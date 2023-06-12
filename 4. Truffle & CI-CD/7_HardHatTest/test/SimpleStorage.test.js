const { ethers } = require("hardhat");
const { expect, assert } = require("chai");

describe("test SimpleStorage", function () {
  let deployedContract;

  //avant chaque test individuel ce sera executé
  beforeEach(async function () {
    [this.owner, this.addr1, this.addr2] = await ethers.getSigners();

    let contract = await ethers.getContractFactory("SimpleStorage");
    deployedContract = await contract.deploy();
  });

  describe("Initialisation", function () {
    it("should get the number and the number should be equal to 0", async function () {
      // expect(await deployedContract.getNumber()).to.equal(0);
      let num = await deployedContract.getNumber();
      assert(num.toString() === "0"); //toString car num est bignumber
      // assert.equal(num, 0); //marche aussi => assertion mathématique
      // expect(num).to.equal(0); //marche aussi => comportementale
    });
  });
});
