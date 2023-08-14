const MyDeFiProject = artifacts.require("MyDeFiProject");
const Web3 = require("web3");
const linkABI = require("../constants/link.json");

const linkAddress = "0x779877a7b0d9e8603169ddbd7836e478b4624789"; //sepolia link address

module.exports = async function (deployer, _network, accounts) {
  //check network is sepolia
  if (_network === "sepolia") {
    console.log("--------------------> Link address : ", linkAddress);
    const linkToken = new web3.eth.Contract(linkABI, linkAddress);

    console.log("--------------------> Deploying MyDeFiProject");
    await deployer.deploy(MyDeFiProject, linkAddress);
    const myDeFiProject = await MyDeFiProject.deployed();
    const myDeFiProjectAddress = myDeFiProject.address;
    console.log(
      "--------------------> MyDefiProject address : ",
      myDeFiProjectAddress
    );

    //18 decimals => get 1 link
    const oneLink = Web3.utils.toBN(10).pow(Web3.utils.toBN(18));

    const balanceBefore1 = await linkToken.methods
      .balanceOf(accounts[1])
      .call();
    await linkToken.methods
      .transfer(myDeFiProjectAddress, oneLink)
      .send({ from: accounts[0] });

    console.log(
      "--------------------> Account[0] transfered 1 link to MyDeFiProject "
    );
    console.log(
      "--------------------> MyDefiProject transfer 1 link to accounts[1]"
    );
    await myDeFiProject.foo(accounts[1], oneLink);

    const balance0 = await linkToken.methods
      .balanceOf(myDeFiProject.address)
      .call();
    const balance1 = await linkToken.methods.balanceOf(accounts[1]).call();

    console.log(
      "--------------------> Balance of MyDefiProject :",
      balance0.toString()
    );
    console.log(
      "--------------------> Balance of acount([1]) before transfert from MyDefiProject :",
      balanceBefore1.toString()
    );
    console.log(
      "--------------------> Balance of acount([1]) after transfert from MyDefiProject : ",
      balance1.toString()
    );
  } else {
    console.log(
      "--------------------> Network is not Sepolia, skipping migration"
    );
  }
};

//truffle migrate --network sepolia
