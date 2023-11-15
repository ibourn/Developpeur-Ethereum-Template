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

  describe("setNumber", function () {
    it("should set the number", async function () {
      let tx = await deployedContract.setNumber(777);
      await tx.wait();
      // permet infoAboutTx = await tx.wait(); console.log(tx)hard
      //si return null permet aussi test Call exception
      let num = await deployedContract.getNumber();
      assert(num.toString() === "777");
    });
  });
});

//CORRECTION

// const { ethers } = require("hardhat");
// const { expect, assert } = require("chai");

// describe("test SimpleStorage", function () {
//   let deployedContract;

//   beforeEach(async function () {
//     [this.owner, this.addr1, this.addr2] = await ethers.getSigners();
//     let contract = await ethers.getContractFactory("SimpleStorage");
//     deployedContract = await contract.deploy();
//   });

//   describe("Initialization", function () {
//     it("should get the number and the number should be equal to 0", async function () {
//       let number = await deployedContract.getNumber();
//       assert(number.toString() === "0"); // toString() car "number" est un BN
//       // assert.equal(number.toString(), "0");
//       // expect(number.toString()).to.be.equal("0")
//     });
//   });

//   describe("Set", function () {
//     it("should set the number and get an updated number", async function () {
//       let transaction = await deployedContract.setNumber(7);
//       await transaction.wait();
//       let number = await deployedContract.getNumber();
//       assert(number.toString() === "7");
//     });
//   });
// });
