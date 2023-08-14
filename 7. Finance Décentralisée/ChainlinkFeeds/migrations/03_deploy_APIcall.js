const Chainlink3 = artifacts.require("Chainlink3"); // ATTENTION: "SimpleStorage" est le nom du fichier "SimpleStorage.sol" sans l'extension ".sol"
require("dotenv").config();

//1. fund the contract with LINK (0.1 per request => send more then withdraw the rest)
//2. truffle console --network goerli
// const instance = await Chainlink3.deployed();
// await instance.requestVolumeData();
// await instance.volume.call();

//add adapter : 0xCC79157eb46F5624204f47AB42b3906cAA40eaB7
// job id for get json : d5270d1c311941d0b08bead21fea7747

module.exports = (deployer) => {
  deployer.deploy(Chainlink3);
};
