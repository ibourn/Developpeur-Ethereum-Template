const SimpleStorage = artifacts.require("SimpleStorage"); // ATTENTION: "SimpleStorage" est le nom du fichier "SimpleStorage.sol" sans l'extension ".sol"

module.exports = (deployer) => {
  deployer.deploy(SimpleStorage);
};
