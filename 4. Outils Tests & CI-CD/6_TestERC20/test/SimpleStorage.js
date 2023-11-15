const { assert, expect } = require("chai");
const { BN, expectRevert, expectEvent } = require("@openzeppelin/test-helpers");
// const constants = require("@openzeppelin/test-helpers/src/constants");
// const { inTransaction } = require("@openzeppelin/test-helpers/src/expectEvent");
const MyToken = artifacts.require("MyToken");

const _name = "Alyra";
const _symbol = "ALY";
const _decimals = new BN(18);
const _initialSupply = new BN(10000);

contract("MyToken", (accounts) => {
  const _owner = accounts[0];
  const _recipient = accounts[1];
  let myTokenInstance;

  beforeEach(async () => {
    // ici pour à chqe fois new instance de 0 (propre) // dif de await MyToken.deployed();
    myTokenInstance = await MyToken.new(_initialSupply, { from: _owner });
  });

  it("has a name", async () => {
    //  myTokenInstance = await MyToken.deployed();

    const tokenName = await myTokenInstance.name();
    assert.equal(tokenName, _name, "The token name is not correct.");

    expect(await myTokenInstance.name()).to.equal(_name);
  });

  it("has a symbol", async () => {
    expect(await myTokenInstance.symbol()).to.equal(_symbol);
  });

  it("has an amount of decimals", async () => {
    expect(await myTokenInstance.decimals()).to.be.bignumber.equal(_decimals);
  });

  it("has an initial supply", async () => {
    expect(await myTokenInstance.totalSupply()).to.be.bignumber.equal(
      _initialSupply
    );
  });

  it("check first balance of owner", async () => {
    expect(await myTokenInstance.balanceOf(_owner)).to.be.bignumber.equal(
      _initialSupply
    );
  });

  it("check balance after transfer", async () => {
    const amount = new BN(1000);
    const initialSupplyMinusAmount = _initialSupply.sub(amount);
    let balanceOwnerBeforeTransfer = await myTokenInstance.balanceOf(_owner);
    let balanceRecipientBeforeTransfer = await myTokenInstance.balanceOf(
      _recipient
    );

    expect(balanceRecipientBeforeTransfer).to.be.bignumber.equal(new BN(0));

    await myTokenInstance.transfer(_recipient, amount, { from: _owner });
    let balanceOwnerAfterTransfer = await myTokenInstance.balanceOf(_owner);
    let balanceRecipientAfterTransfer = await myTokenInstance.balanceOf(
      _recipient
    );

    expect(balanceOwnerAfterTransfer).to.be.bignumber.equal(
      initialSupplyMinusAmount
    );
    expect(balanceRecipientAfterTransfer).to.be.bignumber.equal(amount);
  });

  it("check if approval done", async () => {
    const amount = new BN(1000);
    let AllowanceBeforeApproval = await myTokenInstance.allowance(
      _owner,
      _recipient
    );
    expect(AllowanceBeforeApproval).to.be.bignumber.equal(new BN(0));

    await myTokenInstance.approve(_recipient, amount, { from: _owner });
    let AllowanceAfterApproval = await myTokenInstance.allowance(
      _owner,
      _recipient
    );

    expect(AllowanceAfterApproval).to.be.bignumber.equal(amount);
  });

  it("check if transferFrom done", async () => {
    const amount = new BN(1000);
    const initialSupplyMinusAmount = _initialSupply.sub(amount);

    await myTokenInstance.approve(_recipient, amount, { from: _owner });

    let balanceOwnerBeforeTransfer = await myTokenInstance.balanceOf(_owner);
    let balanceRecipientBeforeTransfer = await myTokenInstance.balanceOf(
      _recipient
    );
    expect(balanceRecipientBeforeTransfer).to.be.bignumber.equal(new BN(0));
    expect(balanceOwnerBeforeTransfer).to.be.bignumber.equal(_initialSupply);

    await myTokenInstance.transferFrom(_owner, _recipient, amount, {
      from: _recipient,
    });

    let balanceOwnerAfterTransfer = await myTokenInstance.balanceOf(_owner);
    let balanceRecipientAfterTransfer = await myTokenInstance.balanceOf(
      _recipient
    );
    expect(balanceOwnerAfterTransfer).to.be.bignumber.equal(
      initialSupplyMinusAmount
    );
    expect(balanceRecipientAfterTransfer).to.be.bignumber.equal(amount);
  });

  //   it("should store the value 42.", async () => {
  //     const simpleStorageInstance = await SimpleStorage.deployed();
  //     const receiptTx = await simpleStorageInstance.set(42, { from: owner });
  //     console.log("ceci est un log : " + storedData);
  //     //CAS ou il y aurait un reqiure dans la fonction ou un revert
  //     await expectRevert(
  //       ContractInstance.nameFunction(param, { from: owner }),
  //       "MESSAGE EXACT DU REVERT"
  //     );
  //     //CAS OU UN EVENT devrait être émis
  //     expectEvent(receiptTx, "EventName", { arg1: value1, arg2: value2 });
  //     const storedData = await simpleStorageInstance.get.call();
  //     assert.equal(storedData, 42, "The value 42 was not stored.");
  //   });
});
