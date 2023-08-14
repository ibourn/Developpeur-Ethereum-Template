const Chainlink2 = artifacts.require("Chainlink2"); // ATTENTION: "SimpleStorage" est le nom du fichier "SimpleStorage.sol" sans l'extension ".sol"
require("dotenv").config();

module.exports = (deployer) => {
  deployer.deploy(Chainlink2, `${process.env.CHAINLINK_ID}`);
  console.log("chainlink id: ", `${process.env.CHAINLINK_ID}`);

  //goerli deployment : 0x00f398dbD8e3840a8F6ed51D6f0941f0046De21c
};
