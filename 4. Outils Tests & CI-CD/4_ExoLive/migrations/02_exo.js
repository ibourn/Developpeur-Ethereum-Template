const Storage = artifacts.require("Storage");

module.exports = async function (deployer, network, accounts) {
  if (network === "development") {
    const instance = await Storage.deployed();
    let value = await instance.get();
    console.log("initial value : ", value.toString());

    await instance.set(10);
    value = await instance.get();
    console.log("new value : ", value.toString());

    web3.eth.getAccounts().then(console.log);

    let balance = await web3.eth.getBalance(instance.address);

    console.log(
      "instance.address balance: " +
        web3.utils.fromWei(balance, "ether") +
        " ETH"
    );
  }
};
