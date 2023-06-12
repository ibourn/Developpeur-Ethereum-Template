const MyToken = artifacts.require("MyToken");

module.exports = (deployer) => {
  deployer.deploy(MyToken, 10000);
};
