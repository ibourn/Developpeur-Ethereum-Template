const Web3 = require("web3");
const dotenv = require("dotenv");
dotenv.config();

const INFURA_ID = process.env.INFURA_ID;
const rpcURL = `https://goerli.infura.io/v3/${INFURA_ID}`;
const web3 = new Web3(rpcURL); //=> instance de Web3 configurée pour se connecter à l'url du réseau goerli

const ContractABI = require("./ContractABI.json");
/*
simple project to use web3 :
npm install --prefix . dotenv web3@1.10.0 
node app.js
*/

const SSaddress = "0x1f9C83F7311c1b0AD188E9925E2705a3B60c4b1d"; //=>add de deploiement du contrat
const simpleStorage = new web3.eth.Contract(ContractABI, SSaddress); //=> instance du contract déployé

simpleStorage.methods
  .get()
  .call()
  .then((data) => {
    console.log(data);
  });
// renvoi 1970 au bloc : 9195644 sur goerli
