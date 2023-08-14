/* 
depuis console:
truffle console --network goerli
const instance = await Chainlink.deployed();
let test = await instance.getLatestPrice()
test.toString()
*/

/*
=> getter function => view => no cost (gas or link) / important operations for defi protocols to get/convert prices
*/
module.exports = function (callback) {
  const Web3 = require("web3");
  require("dotenv").config();
  const HDWalletProvider = require("@truffle/hdwallet-provider");

  const provider = new HDWalletProvider(
    `${process.env.MNEMONIC}`,
    `https://goerli.infura.io/v3/${process.env.INFURA_ID}`
  );
  const web3 = new Web3(provider);

  const account = web3.eth.accounts[0];
  const Chainlink1 = artifacts.require("Chainlink1");
  const abi = Chainlink1.abi;
  const addr = "0x00f398dbD8e3840a8F6ed51D6f0941f0046De21c";

  const Contract = new web3.eth.Contract(abi, addr);
  console.log(Contract);

  const display = async function () {
    const res = await Contract.methods.getLatestPrice().call({ from: account });
    console.log(res);
  };

  display()
    .then(() => callback())
    .catch((err) => callback(err));

  //Non-ETH pairs: 8 decimals - ETH pairs: 18 Decimals
};
