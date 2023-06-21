//command serveur : python3 -m http.server

import { ethers } from "./ethers.min.js";
import { contractABI, contractAddress } from "./constants.js";
import { bankABI, bankAddress } from "./constants.js";

const connectButton = document.getElementById("connectButton");
const getNumber = document.getElementById("getNumber");
const theNumber = document.getElementById("theNumber");
const inputNumber = document.getElementById("inputNumber");
const setNumber = document.getElementById("setNumber");

const theBalance = document.getElementById("theBalance");
const getBalance = document.getElementById("getBalance");
const inputDeposit = document.getElementById("inputDeposit");
const deposit = document.getElementById("deposit");
const inputWithdraw = document.getElementById("inputWithdraw");
const withdraw = document.getElementById("withdraw");

let connectedAccount;

// What happens when the user clicks on the connect button
connectButton.addEventListener("click", async function () {
  if (typeof window.ethereum !== "undefined") {
    const resultAccount = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    connectedAccount = ethers.utils.getAddress(resultAccount[0]);
    connectButton.innerHTML =
      "Connected with " +
      connectedAccount.substring(0, 4) +
      "..." +
      connectedAccount.substring(connectedAccount.length - 4);
  } else {
    connectButton.innerHTML = "Please install Metamask!";
  }
});

getNumber.addEventListener("click", async function () {
  if (typeof window.ethereum !== "undefined" && connectedAccount) {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      // const network = await provider.getNetwork()
      // console.log(network.chainId.toString())
      console.log(contractAddress);
      const contract = new ethers.Contract(
        contractAddress,
        contractABI,
        provider
      );
      console.log(contract);
      console.log(contractAddress);
      const number = await contract.getNumber();
      theNumber.innerHTML = number.toString();
    } catch (e) {
      console.log(e);
    }
  }
});

setNumber.addEventListener("click", async function () {
  if (typeof window.ethereum !== "undefined" && connectedAccount) {
    try {
      let inputNumberByUser = inputNumber.value;
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );
      let transaction = await contract.setNumber(inputNumberByUser);
      await transaction.wait();
    } catch (e) {
      console.log(e);
    }
  }
});

// getBalance.addEventListener("click", async function () {
//   if (typeof window.ethereum !== "undefined" && connectedAccount) {
//     try {

//     } catch (e) {
//       console.log(e);
//     }
//   }
// });

deposit.addEventListener("click", async function () {
  if (typeof window.ethereum !== "undefined" && connectedAccount) {
    try {
      let inputDepositByUser = inputDeposit.value;
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(bankAddress, bankABI, signer);
      let transaction = await contract.sendEthers({
        value: ethers.utils.parseEther(inputDepositByUser),
      });
      await transaction.wait();
    } catch (e) {
      console.log(e);
    }
  }
});

withdraw.addEventListener("click", async function () {
  if (typeof window.ethereum !== "undefined" && connectedAccount) {
    try {
      let inputWithdrawByUser = inputWithdraw.value;
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(bankAddress, bankABI, signer);
      let transaction = await contract.withdraw(
        ethers.utils.parseEther(inputWithdrawByUser)
      );
      await transaction.wait();
    } catch (e) {
      console.log(e);
    }
  }
});
