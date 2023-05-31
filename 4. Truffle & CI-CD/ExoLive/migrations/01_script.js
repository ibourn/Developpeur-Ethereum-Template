const Storage = artifacts.require("Storage");
// import web3 from "web3";

module.exports = async function (deployer, network, accounts) {
  const valToSend = web3.utils.toWei("1", "ether");
  const valToSendGoerli = web3.utils.toWei("0.001", "ether");
  const account1 = accounts[0];

  if (network === "development") {
    await deployer.deploy(Storage, 5, {
      //   overwrite: false,
      from: `${account1}`,
      value: `${valToSend}`,
    });
  } else if (network === "goerli") {
    await deployer.deploy(Storage, 5, {
      //   overwrite: false,
      from: `${account1}`,
      value: `${valToSendGoerli}`,
    });
  }
};

//option truflle migrate --reset --network goerli --skip-dry-run --verbose-rpc --dry-run --f 2 --to 2 --compile-all --all
