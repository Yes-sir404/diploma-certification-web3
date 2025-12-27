import { ethers } from "hardhat";

async function main() {
  // 1. Récupérer le compte qui déploie (l'Admin/L'École)
  const [deployer] = await ethers.getSigners();

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