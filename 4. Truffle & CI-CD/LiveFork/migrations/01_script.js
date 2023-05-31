const CrowdSale = artifacts.require("CrowdSale");
const ERC20 = artifacts.require("ERC20");
const Send = artifacts.require("Send");

module.exports = async function (deployer, network, accounts) {
  const crowdSaleAddress = "0x52Ffb08546eEEb0f275B501D5f536Ec446541756";
  const tokenAddress = "0xD03CF00e9fc9ffcD011b70eB5cd259bdF166978B";

  const valToSend = web3.utils.toWei("0.15", "ether");
  const account1 = accounts[1];

  await deployer.deploy(Send);
  const send = await Send.deployed();

  await send.setAdr(crowdSaleAddress);
  await send.sendEther({ from: account1, value: valToSend });
  const tokenReceived = await send.checkToken(tokenAddress);

  console.log("tokenReceived : ", tokenReceived.toString());
};

/*
FORK : 2nd terminal => ganache-cli --fork.network=goerli  == copie du réel, puis réel simulé

puis script ou 1ere console truffle console 
Attention aux parenthèses, ex : (await send.checkToken(tokenAddress)).toString()

si interaction tesnet avec seed en config => truffle console --network goerli
*/

//option truflle migrate --reset --network goerli --skip-dry-run --verbose-rpc --dry-run --f 2 --to 2 --compile-all --all
