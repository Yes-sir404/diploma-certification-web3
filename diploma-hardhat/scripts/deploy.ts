import { ethers } from "hardhat";
import hre from "hardhat";

function assertSepoliaEnv(): void {
  const key = process.env.PRIVATE_KEY?.trim();
  const hex = key?.startsWith("0x") ? key.slice(2) : key;
  if (!key || !hex || !/^[0-9a-fA-F]{64}$/.test(hex)) {
    throw new Error(
      "Invalid or missing PRIVATE_KEY in .env. It must be exactly 64 hex characters (32 bytes). " +
        "Export it from MetaMask: Account → Details → Show private key. Remove any placeholder text like 'YourPrivateKeyHere'."
    );
  }
  if (!process.env.SEPOLIA_RPC_URL?.trim()) {
    throw new Error("Missing SEPOLIA_RPC_URL in .env.");
  }
}

async function main() {
  if (hre.network.name === "sepolia") {
    assertSepoliaEnv();
  }

  const [deployer] = await ethers.getSigners();
  if (!deployer) {
    throw new Error("No deployer account configured for this network.");
  }

  console.log("----------------------------------------------------");
  console.log("Déploiement du contrat avec le compte :", deployer.address);
  
  // Vérification optionnelle du solde pour payer le Gas
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Solde du compte :", ethers.formatEther(balance), "ETH");

  // 2. Récupérer la Factory du Smart Contract
  // Le nom "DiplomaCertification" doit correspondre exactement au nom de la classe dans votre .sol
  const DiplomaCertification = await ethers.getContractFactory("DiplomaCertification");

  // 3. Déployer le contrat
  // Note: Pas d'arguments dans deploy() car votre constructeur n'en prend pas (Ownable est init avec msg.sender)
  console.log("Envoi de la transaction de déploiement...");
  const diplomaContract = await DiplomaCertification.deploy();

  // 4. Attendre que la transaction soit minée (Ethers v6 syntaxe)
  await diplomaContract.waitForDeployment();

  const contractAddress = await diplomaContract.getAddress();

  console.log("----------------------------------------------------");
  console.log("✅ Contrat 'DiplomaCertification' déployé avec succès !");
  console.log("📍 Adresse du contrat :", contractAddress);
  console.log("👑 Propriétaire (Admin) :", deployer.address);
  console.log("----------------------------------------------------");

  // Conseil: Copiez cette adresse pour la mettre dans votre application Spring Boot
}

// Gestion des erreurs
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });