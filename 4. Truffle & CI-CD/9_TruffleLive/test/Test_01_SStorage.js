// const { assert, expect } = require("chai");
// const { BN, expectRevert, expectEvent } = require("@openzeppelin/test-helpers");
// const constants = require("@openzeppelin/test-helpers/src/constants");
// const { contracts_build_directory } = require("../truffle-config");
// // const { describe, it } = require("node:test");
// // const { it, describe } = require("node:test");
// const SimpleStorage = artifacts.require("SimpleStorage");

// contract("SimpleStorage", (accounts) => {
//   const owner = accounts[0];
//   const addr1 = accounts[1];
//   const addr2 = accounts[2];

//   let StorageInstance;

//   //Pour faire un seul it ou describe => it.only ou describe.only
//   //Pour ignorer un it ou describe => it.skip ou describe.skip (si un test hyper long à passer)

//   describe("test require and events", () => {
//     beforeEach(async () => {
//       simpleStorageInstance = await SimpleStorage.new({ from: owner });
//     });
//     it("should emit an event when the value is set", async () => {
//       const value = 42;
//       const receipt = await simpleStorageInstance.set(value);
//       expectEvent(receipt, "NewSet", { newStoredData: new BN(value) });
//     });
//     it("should not revert when the value is set to <100", async () => {
//       const value = 42;
//       await simpleStorageInstance.set(value);
//       const storedData = await simpleStorageInstance.storedData;
//       expect(storedData).to.be.bignumber.equal(value);
//     });
//     it("shold revert when the value is set to >=100", async () => {
//       const value = new BN(100);
//       await expectRevert(
//         simpleStorageInstance.set(value),
//         "x must be less than 100"
//       );
//     });
//   });
// });

//correction
const SimpleStorage = artifacts.require("./SimpleStorage.sol");
const { BN, expectRevert, expectEvent } = require("@openzeppelin/test-helpers");
const { expect } = require("chai");

contract("SimpleStorage", (accounts) => {
  const owner = accounts[0];
  const second = accounts[1];
  const third = accounts[2];

  let StorageInstance;

  describe("test require and event", function () {
    beforeEach(async function () {
      StorageInstance = await SimpleStorage.new({ from: owner });
    });

    it("should verify require pass", async () => {
      await StorageInstance.set(8, { from: owner });
      const storedData = await StorageInstance.get();
      expect(storedData).to.be.bignumber.equal(BN(8));
    });

    it("should verify require not passing", async () => {
      await expectRevert(StorageInstance.set(42, { from: owner }), "pas bon");
    });

    it("should verify event", async () => {
      const findEvent = await StorageInstance.set(8, { from: owner });
      expectEvent(findEvent, "Setted", { _value: BN(8) });
    });
  });
});
