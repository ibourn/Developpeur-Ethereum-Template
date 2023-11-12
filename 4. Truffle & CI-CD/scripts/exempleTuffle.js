const Storage = artifacts.require("Storage");

module.exports = async function (deployer, network, accounts) {
  await deployer.deploy(Storage);

  const instance = await Storage.deployed();
  let value = await instance.get();
  console.log("initial value : ", value.toString());

  await instance.set(10, { from: accounts[0] });
  value = await instance.get();
  console.log("new value : ", value.toString());
};

/*
methode via déployement

sinon dans scripts et appels :
 truffle exec script/NAME.js
*/
