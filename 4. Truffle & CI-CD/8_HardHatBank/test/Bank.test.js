const { ethers } = require("hardhat");
const { expect, assert } = require("chai");

describe("Test Bank", function () {
  let bank, owner, addr1, addr2;
  // [this.owner, this.addr1, this.addr2] = await ethers.getSigners();

  describe("Initialisation", function () {
    beforeEach(async function () {
      [owner, addr1, addr2] = await ethers.getSigners();
      let contract = await ethers.getContractFactory("Bank");
      bank = await contract.deploy();
    });

    it("should deploy Bank", async function () {
      let theOwner = await bank.owner();
      console.log("theOwner", theOwner);
      console.log("owner", owner);
      assert(theOwner === owner.address);
    });
  });

  //test desposit si <0.1 si >= event

  describe("Deposit", function () {
    beforeEach(async function () {
      [owner, addr1, addr2] = await ethers.getSigners();
      let contract = await ethers.getContractFactory("Bank");
      bank = await contract.connect(owner).deploy(); //connect(owner) pour que owner soit le msg.sender
    });

    it("should NOT deposit if not owner", async function () {
      let etherQuantity = ethers.utils.parseEther("0.1"); // => perse ether en wei
      console.log("etherQuantity", etherQuantity.toString());
      await expect(
        bank.connect(addr1).deposit({ value: etherQuantity })
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("should NOT deposit if < 0.1 ether", async function () {
      let etherQuantity = ethers.utils.parseEther("0.09"); // => parse ether en wei
      console.log("etherQuantity", etherQuantity.toString());
      await expect(
        bank.connect(owner).deposit({ value: etherQuantity })
      ).to.be.revertedWith("not enough funds provided");
    });

    it("should deposit if >= 0.1 ether and emit event", async function () {
      let etherQuantity = ethers.utils.parseEther("0.1"); // => perse ether en wei
      console.log("etherQuantity", etherQuantity.toString());
      await expect(bank.connect(owner).deposit({ value: etherQuantity }))
        .to.emit(bank, "Deposit")
        .withArgs(owner.address, etherQuantity);
      let balanceOfBank = await ethers.provider.getBalance(bank.address);
      assert(balanceOfBank.toString() === etherQuantity.toString());

      //   assert(balanceOfBank === etherQuantity.utils.BigNumber);

      assert.equal(balanceOfBank.eq(etherQuantity), true);
      // ethers.BigNumber.from(balanceOfBank)
    });
  });

  describe("Withdraw", function () {
    beforeEach(async function () {
      [owner, addr1, addr2] = await ethers.getSigners();
      let contract = await ethers.getContractFactory("Bank");
      bank = await contract.connect(owner).deploy();

      let etherQuantity = ethers.utils.parseEther("0.1");
      console.log("etherQuantity", etherQuantity.toString());
      let tx = await bank.connect(owner).deposit({ value: etherQuantity });
      await tx.wait();
    });

    it("should NOT withdraw if not owner", async function () {
      let etherQuantity = ethers.utils.parseEther("0.1"); // => perse ether en wei
      console.log("etherQuantity", etherQuantity.toString());
      await expect(
        bank.connect(addr1).withdraw(etherQuantity)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("should NOT withdraw if owner tries to withdraw too much", async function () {
      let etherQuantity = ethers.utils.parseEther("0.11"); // => perse ether en wei
      console.log("etherQuantity", etherQuantity.toString());
      await expect(
        bank.connect(owner).withdraw(etherQuantity)
      ).to.be.revertedWith("you cannot withdraw this much");
    });
  });
});

//si custom error to.be.revertedWithCustomError(...

//before ... pour server
//ou pour integration => evolution scenario
