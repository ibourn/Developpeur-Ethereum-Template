export const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
// import contractJSON from "./artifacts/SimpleStorage.json";
// export const contractABI = contractJSON.abi;

export const contractABI = JSON.stringify([
  {
    inputs: [],
    name: "getNumber",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_number",
        type: "uint256",
      },
    ],
    name: "setNumber",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
]);

//
// const getAbi = async () => {
//     const response = await fetch(

// export const contractABI =

export const bankAddress = "0x0165878A594ca255338adfa4d48449f69242Eb8F"; //"0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
// import bankJSON from "./artifacts/Bank.json";
// export const bankABI = bankJSON.abi;
//v6 ethers bug

// import bankJSON from "./artifacts/Bank.json";
export const bankABI = JSON.stringify([
  {
    inputs: [],
    name: "Bank__NotEnoughEthersOnTheSC",
    type: "error",
  },
  {
    inputs: [],
    name: "Bank__NotEnoughFundsProvided",
    type: "error",
  },
  {
    inputs: [],
    name: "Bank__WithdrawFailed",
    type: "error",
  },
  {
    inputs: [],
    name: "sendEthers",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
    ],
    name: "withdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
]);
