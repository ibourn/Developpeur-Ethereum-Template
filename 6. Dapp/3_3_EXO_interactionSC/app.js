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

const SSaddress = "0xfA95935932ECcd000765C772CF8A731B1E215d06"; //=>add de deploiement du contrat
const simpleStorage = new web3.eth.Contract(ContractABI, SSaddress); //=> instance du contract déployé

simpleStorage.methods
  .get()
  .call()
  .then((data) => {
    console.log(data);
  });
// renvoi 1984 au bloc : 9195979 sur goerli
