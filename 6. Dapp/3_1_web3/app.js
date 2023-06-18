const Web3 = require("web3");
const dotenv = require("dotenv");
dotenv.config();

const INFURA_ID = process.env.INFURA_ID;
const rpcURL = `https://goerli.infura.io/v3/${INFURA_ID}`;
const web3 = new Web3(rpcURL); //=> instance de Web3 configurée pour se connecter à l'url du réseau goerli

/*
simple project to use web3 :
npm install --prefix . web3 // web3@1.10.0 (breaking change in new version)
npm install --prefix . dotenv
node app.js
*/

const address = "0x4b984D560387C22f399B76a38edabFE52903E599";
const fetchBalance = async (address) => {
  await web3.eth.getBalance(address, (err, wei) => {
    if (err) {
      console.log("err", err);
    } else {
      const balance = web3.utils.fromWei(wei, "ether"); // convertir la valeur en ether
      console.log(balance);
    }
  });
};
fetchBalance(address);
