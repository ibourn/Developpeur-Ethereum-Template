const Chainlink1 = artifacts.require("Chainlink1"); // ATTENTION: "SimpleStorage" est le nom du fichier "SimpleStorage.sol" sans l'extension ".sol"

module.exports = (deployer) => {
  deployer.deploy(Chainlink1);

  //goerli deployment : 0x00f398dbD8e3840a8F6ed51D6f0941f0046De21c
};
