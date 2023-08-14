const Dai = artifacts.require("Dai");

module.exports = async function (deployer, _network, accounts) {
  console.log("--------------------> Deploying Dai");
  await deployer.deploy(Dai);
};
