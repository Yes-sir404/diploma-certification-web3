package ma.yassir.diploma_backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.web3j.abi.FunctionEncoder;
import org.web3j.abi.datatypes.Function;
import org.web3j.abi.datatypes.Type;
import org.web3j.abi.datatypes.Utf8String;
import org.web3j.abi.datatypes.generated.Bytes32;
import org.web3j.abi.datatypes.generated.Uint256;
import org.web3j.crypto.Credentials;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.core.DefaultBlockParameterName;
import org.web3j.protocol.core.methods.response.EthGetTransactionCount;
import org.web3j.protocol.core.methods.response.EthSendTransaction;
import org.web3j.protocol.http.HttpService;
import org.web3j.tx.RawTransactionManager;
import org.web3j.tx.TransactionManager;
import org.web3j.tx.gas.DefaultGasProvider;
import org.web3j.utils.Numeric;

import jakarta.annotation.PostConstruct;
import java.math.BigInteger;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

@Service
public class SmartContractService {

    // Récupération des valeurs depuis application.properties
    @Value("${web3j.client-address}")
    private String nodeUrl;

    @Value("${blockchain.contract.address}")
    private String contractAddress;

    @Value("${blockchain.admin.private-key}")
    private String privateKey;

    private Web3j web3j;
    private Credentials credentials;

    // Initialisation de la connexion Web3j au démarrage
    @PostConstruct
    public void init() {
        // Connexion au noeud Hardhat/Ethereum
        this.web3j = Web3j.build(new HttpService(nodeUrl));
        // Chargement du portefeuille de l'Admin (pour signer les transactions)
        this.credentials = Credentials.create(privateKey);
        System.out.println("✅ Web3j connecté au noeud : " + nodeUrl);
    }

    /**
     * Méthode principale pour ancrer un diplôme sur la Blockchain.
     * Appelle la fonction issueCertificate(uint256, bytes32, string) du Smart Contract.
     *
     * @param diplomaId L'ID unique du diplôme (celui de la BDD PostgreSQL)
     * @param pdfHash   Le Hash SHA-256 du fichier PDF
     * @param ipfsCid   Le lien IPFS ou chemin du fichier
     * @return Le Hash de la transaction Ethereum
     */
    public String anchorDiploma(Long diplomaId, String pdfHash, String ipfsCid) throws Exception {

        // 1. Préparer les arguments de la fonction Solidity
        // uint256 _id
        Uint256 idParam = new Uint256(BigInteger.valueOf(diplomaId));

        // bytes32 _pdfHash (Conversion du String Hex en Bytes32)
        byte[] hashBytes = Numeric.hexStringToByteArray(pdfHash);
        Bytes32 hashParam = new Bytes32(hashBytes);

        // string memory _ipfsCid
        Utf8String cidParam = new Utf8String(ipfsCid);

        // 2. Définir la fonction à appeler : "issueCertificate"
        Function function = new Function(
                "issueCertificate",  // Nom exact de la fonction dans votre .sol
                Arrays.asList(idParam, hashParam, cidParam), // Entrées
                Collections.emptyList() // Sorties (on ne récupère rien, c'est une transaction)
        );

        // 3. Encoder la fonction en bytecode pour la Blockchain
        String encodedFunction = FunctionEncoder.encode(function);

        // 4. Utiliser un TransactionManager pour gérer le Nonce et la signature automatiquement
        TransactionManager txManager = new RawTransactionManager(web3j, credentials);

        // 5. Envoyer la transaction
        // On utilise ici les prix du Gas par défaut pour simplifier (DefaultGasProvider)
        EthSendTransaction transactionResponse = txManager.sendTransaction(
                DefaultGasProvider.GAS_PRICE,
                DefaultGasProvider.GAS_LIMIT,
                contractAddress,
                encodedFunction,
                BigInteger.ZERO // Valeur en Wei envoyée (0 car on ne transfère pas d'argent)
        );

        // 6. Vérifier si la transaction a été acceptée
        if (transactionResponse.hasError()) {
            throw new RuntimeException("Erreur Blockchain: " + transactionResponse.getError().getMessage());
        }

        String txHash = transactionResponse.getTransactionHash();
        System.out.println("🎉 Diplôme ancré sur la Blockchain ! Hash Transaction : " + txHash);

        return txHash;
    }
}