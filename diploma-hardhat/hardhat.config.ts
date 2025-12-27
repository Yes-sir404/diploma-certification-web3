import type { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.28",
  networks: {
    // Configuration du réseau Local (par défaut)
    hardhatMainnet: {
      url: "http://127.0.0.1:8545",
    },
  },
};

export default config;
