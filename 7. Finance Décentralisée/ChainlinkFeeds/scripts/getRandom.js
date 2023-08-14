/* 
depuis console:
truffle console --network goerli
const instance = await Chainlink2.deployed();
let test = await instance.requestRandomWords()
let nombre=await instance.s_randomWords.call(0)
nombre.toString()
*/

/*
=> BEFORE : prefund subscription => https://vrf.chain.link/goerli and add consummer address (contract deployed making the request)
*/

const addr = "0xf2CD6F4678963124365f3Ef1f8703d6d5292775D";

module.exports = function (callback) {
  const Web3 = require("web3");
  require("dotenv").config();
  const HDWalletProvider = require("@truffle/hdwallet-provider");

  const Chainlink2 = artifacts.require("Chainlink2");
  const abi = Chainlink2.abi;

  const provider = new HDWalletProvider(
    `${process.env.MNEMONIC}`,
    `https://goerli.infura.io/v3/${process.env.INFURA_ID}`
  );
  console.log("-------------------->provider :", provider);
  const web3 = new Web3(provider);
  console.log("-------------------->web3 :", web3);
  const Contract = new web3.eth.Contract(abi, addr);
  console.log("-------------------->contrat :", Contract);

  const play = async function () {
    const tx = await Contract.methods.requestRandomWords().send({
      from: "0xCAfDB1c46c5036A83e2778CCc85e0F12Ce21Eb06", // metamask address (mnemonic used to deploy the contract)
    });
    console.log("----------------->tx :", tx);
  };

  play()
    .then(() => callback())
    .catch((err) => callback(err));

  //Non-ETH pairs: 8 decimals - ETH pairs: 18 Decimals
};
