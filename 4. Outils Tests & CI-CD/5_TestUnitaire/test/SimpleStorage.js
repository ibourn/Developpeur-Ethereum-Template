// const { assert, expect } = require("chai");
// const { BN, expectRevert, expectEvent } = require("@openzeppelin/test-helpers");
// const constants = require("@openzeppelin/test-helpers/src/constants");
const SimpleStorage = artifacts.require("SimpleStorage");

contract("SimpleStorage", (accounts) => {
  let owner = accounts[0];

  it("should store the value 42.", async () => {
    const simpleStorageInstance = await SimpleStorage.deployed();
    await simpleStorageInstance.set(42, { from: accounts[0] });
    const storedData = await simpleStorageInstance.get.call();
    assert.equal(storedData, 42, "The value 42 was not stored.");
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
