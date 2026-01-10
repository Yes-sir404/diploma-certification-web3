package ma.yassir.diploma_backend.service;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.web3j.abi.FunctionEncoder;
import org.web3j.abi.FunctionReturnDecoder;
import org.web3j.abi.datatypes.Function;
import org.web3j.abi.datatypes.Type;
import org.web3j.abi.datatypes.Utf8String;
import org.web3j.abi.datatypes.generated.Bytes32; // <--- Import Important pour le Hash
import org.web3j.abi.datatypes.generated.Uint256;
import org.web3j.crypto.Credentials;
import org.web3j.crypto.RawTransaction;
import org.web3j.crypto.TransactionEncoder;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.core.DefaultBlockParameterName;
import org.web3j.protocol.core.methods.response.EthGetTransactionCount;
import org.web3j.protocol.core.methods.response.EthSendTransaction;
import org.web3j.protocol.http.HttpService;
import org.web3j.utils.Numeric;

import java.math.BigInteger;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import org.web3j.abi.TypeReference;
import org.web3j.abi.datatypes.Bool;

@Service
public class BlockchainService {

    @Value("${web3j.client-address}")
    private String nodeUrl;

    @Value("${blockchain.admin.private-key}")
    private String privateKey;

    @Value("${blockchain.contract.address}")
    private String contractAddress;

    private Web3j web3j;
    private Credentials credentials;

    @PostConstruct
    public void init() {
        this.web3j = Web3j.build(new HttpService(nodeUrl));
        this.credentials = Credentials.create(privateKey);
    }

    // --- 1. CERTIFICATION (Avec Hash PDF) ---
    public String createDiploma(String cne, String fullName, String major, int graduationYear, byte[] pdfHash) throws Exception {

        // On prépare la fonction Solidity "issueDiploma"
        Function function = new Function(
                "issueDiploma",
                Arrays.asList(
                        new Utf8String(cne),
                        new Utf8String(fullName),
                        new Utf8String(major),
                        new Uint256(graduationYear),
                        new Bytes32(pdfHash) // <--- Envoi du Hash (32 bytes)
                ),
                Collections.emptyList()
        );

        return sendTransaction(function);
    }

    // --- AJOUT 1 : Appeler revokeDiploma sur la Blockchain ---
    public String revokeDiploma(String cne) throws Exception {
        Function function = new Function(
                "revokeDiploma",  // Nom exact dans ton Smart Contract
                Arrays.asList(new Utf8String(cne)),
                Collections.emptyList()
        );
        return sendTransaction(function); // Réutilisation de ta méthode sendTransaction existante
    }

    // --- AJOUT 2 : Appeler reactivateDiploma sur la Blockchain ---
    public String reactivateDiploma(String cne) throws Exception {
        Function function = new Function(
                "reactivateDiploma", // Nom exact dans ton Smart Contract
                Arrays.asList(new Utf8String(cne)),
                Collections.emptyList()
        );
        return sendTransaction(function);
    }

    // --- Méthode utilitaire pour éviter de répéter le code d'envoi ---
    private String sendTransaction(Function function) throws Exception {
        String encodedFunction = FunctionEncoder.encode(function);

        EthGetTransactionCount ethGetTransactionCount = web3j.ethGetTransactionCount(
                credentials.getAddress(), DefaultBlockParameterName.LATEST).send();
        BigInteger nonce = ethGetTransactionCount.getTransactionCount();

        // Limite de gaz un peu plus haute car on stocke plus de données
        BigInteger gasLimit = BigInteger.valueOf(600_000);
        BigInteger gasPrice = BigInteger.valueOf(20_000_000_000L);

        RawTransaction rawTransaction = RawTransaction.createTransaction(
                nonce, gasPrice, gasLimit, contractAddress, encodedFunction
        );

        byte[] signedMessage = TransactionEncoder.signMessage(rawTransaction, credentials);
        String hexValue = Numeric.toHexString(signedMessage);

        EthSendTransaction ethSendTransaction = web3j.ethSendRawTransaction(hexValue).send();

        if (ethSendTransaction.hasError()) {
            throw new RuntimeException("Erreur Blockchain: " + ethSendTransaction.getError().getMessage());
        }

        return ethSendTransaction.getTransactionHash();
    }


    // --- 3. VÉRIFICATION ROBUSTE (View) ---
    public boolean verifyDiplomaOnChain(String cne, String expectedHash) throws Exception {

        // On appelle la nouvelle fonction simplifiée : getDiplomaHash
        Function function = new Function(
                "getDiplomaHash",
                Arrays.asList(new Utf8String(cne)),
                Arrays.asList(
                        new TypeReference<Bytes32>() {}, // 0: Le Hash (bytes32)
                        new TypeReference<Bool>() {}     // 1: IsValid (bool)
                )
        );

        String encodedFunction = FunctionEncoder.encode(function);

        org.web3j.protocol.core.methods.response.EthCall response = web3j.ethCall(
                org.web3j.protocol.core.methods.request.Transaction.createEthCallTransaction(
                        credentials.getAddress(), contractAddress, encodedFunction),
                DefaultBlockParameterName.LATEST
        ).send();

        // Décodage simple
        List<Type> results = FunctionReturnDecoder.decode(
                response.getValue(), function.getOutputParameters());

        if (results.isEmpty()) return false;

        // Récupération des valeurs
        byte[] chainHashBytes = ((Bytes32) results.get(0)).getValue();
        boolean isValid = ((Bool) results.get(1)).getValue();

        // Conversion propre avec Web3j (0x + minuscules)
        String chainHashString = Numeric.toHexString(chainHashBytes);

        System.out.println("🔍 VÉRIFICATION BLOCKCHAIN :");
        System.out.println("   👉 Hash reçu de la Chain : " + chainHashString);
        System.out.println("   👉 Hash attendu (Upload) : " + expectedHash);
        System.out.println("   👉 Statut Valide : " + isValid);

        // Comparaison
        return isValid && chainHashString.equalsIgnoreCase(expectedHash);
    }

}