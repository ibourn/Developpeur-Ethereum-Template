require("dotenv").config();
const { MNEMONIC, INFURA_ID } = process.env;
const HDWalletProvider = require("@truffle/hdwallet-provider");

module.exports = {
  contracts_build_directory: "../client/src/contracts",
  /* npm install --prefix . @truffle/hdwallet-provider dotenv */
  /* $ truffle test --network <network-name> */
  networks: {
    development: {
      host: "127.0.0.1", // Localhost (default: none)
      port: 8545, // Standard Ethereum port (default: none)
      network_id: "*", // Any network (default: none)
    },
    goerli: {
      provider: function () {
        return new HDWalletProvider({
          mnemonic: { phrase: `${process.env.MNEMONIC}` },
          providerOrUrl: `https://goerli.infura.io/v3/${process.env.INFURA_ID}`,
        });
      },
      network_id: 5,
    },
    mumbai: {
      provider: function () {
        return new HDWalletProvider({
          mnemonic: { phrase: `${process.env.MNEMONIC}` },
          providerOrUrl: `https://polygon-mumbai.g.alchemy.com/v2/${process.env.ALCHEMY_ID}`,
        });
      },
      network_id: 80001,
    },
  },
  mocha: {},
  compilers: {
    solc: {
      version: "0.8.20", // Fetch exact version from solc-bin (default: truffle's version)
      // docker: true, // Use "0.5.1" you've installed locally with docker (default: false)
      settings: {
        // See the solidity docs for advice about optimization and evmVersion
        optimizer: {
          enabled: false,
          runs: 200,
        },
        evmVersion: "byzantium",
      },
    },
  },
};
