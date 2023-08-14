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
  const Chainlink2 = artifacts.require("Chainlink2");
  const abi = Chainlink2.abi;
  const addr = "0xf2CD6F4678963124365f3Ef1f8703d6d5292775D";

  const Contract = new web3.eth.Contract(abi, addr);
  // console.log(Contract);

  const display = async function () {
    // const test = await Contract.methods.requestRandomWords();
    const number = await Contract.methods.s_randomWords(0).call({
      from: account,
    });
    //array so 0 as index to get the first element
    console.log("random number: ", number.toString(), number);
  };

  //result:
  // random number:  35136696705545412190471462121149645804941996204000345738665005608053234953730 35136696705545412190471462121149645804941996204000345738665005608053234953730

  display()
    .then(() => callback())
    .catch((err) => callback(err));

  //Non-ETH pairs: 8 decimals - ETH pairs: 18 Decimals
};
