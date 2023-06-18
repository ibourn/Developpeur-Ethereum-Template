const SimpleStorage = artifacts.require("SimpleStorage");

/*
deployed at : 0x1F16Be8b279ED252aC18F0bF9bE0f9768A8453D8 (goerli)
tx : 0x45287601b4dbea6c8bd33d297765ca62c682ce673f59b97fdda121917f9925a9
block number : 9200364
*/
module.exports = function (deployer) {
  deployer.deploy(SimpleStorage);
};
