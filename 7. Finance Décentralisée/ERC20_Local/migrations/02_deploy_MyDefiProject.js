const Dai = artifacts.require("Dai");
const MyDeFiProject = artifacts.require("MyDeFiProject");

module.exports = async function (deployer, _network, accounts) {
  //   await deployer.deploy(Dai);
  const dai = await Dai.deployed();
  console.log("--------------------> Dai address : ", dai.address);
  console.log("--------------------> Deploying MyDeFiProject");
  await deployer.deploy(MyDeFiProject, dai.address);
  const myDeFiProject = await MyDeFiProject.deployed();
  console.log(
    "--------------------> Owner mint 100 DAI to MyDeFiProject (faucet)"
  );
  await dai.faucet(myDeFiProject.address, 100);
  console.log(
    "--------------------> MyDefiProject transfer 100 DAI to accounts[1]"
  );
  await myDeFiProject.foo(accounts[1], 100);

  const balance0 = await dai.balanceOf(myDeFiProject.address);
  const balance1 = await dai.balanceOf(accounts[1]);

  console.log(
    "--------------------> Balance of MyDefiProject :",
    balance0.toString()
  );
  console.log(
    "--------------------> Balance of acount([1]) :",
    balance1.toString()
  );
};
