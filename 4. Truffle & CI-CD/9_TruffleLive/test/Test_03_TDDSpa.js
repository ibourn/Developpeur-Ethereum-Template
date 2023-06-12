const { assert, expect } = require("chai");
const { BN, expectRevert, expectEvent } = require("@openzeppelin/test-helpers");
const constants = require("@openzeppelin/test-helpers/src/constants");
const { contracts_build_directory } = require("../truffle-config");
const { inTransaction } = require("@openzeppelin/test-helpers/src/expectEvent");
const SPA = artifacts.require("TDDSpa");

//TEST TDD
//1. création des variables de l'énoncé

contract("SimpleStorage", (accounts) => {
  const owner = accounts[0];
  const second = accounts[1];
  const third = accounts[2];
  let spaInstance;
  beforeEach(async function () {
    spaInstance = await SPA.new({ from: owner });
  });

  //1.creation du setter addAnimal
  describe("addAnimal", function () {
    //1.1 au départ le tableau est vide
    it("checks animalsArray is empty at deployment", async () => {
      await expectRevert(spaInstance.animalsArray.call(0), "revert");
    });
    //1.2 on ajoute un animal
    //1.2.1 on vérifie la taille de animalArryas == 1 / echec / implementation
    describe("addAnimal add element to array and map", function () {
      let race, size, age;
      beforeEach(async function () {
        race = "dog";
        size = 80;
        age = 5;

        await spaInstance.addAnimal(race, size, age);
      });
      it("should add an animal to animalsArray", async () => {
        const animal = await spaInstance.animalsArray.call(0);
        expect(animal.size).to.be.bignumber.equal(new BN(size));
        expect(animal.age).to.be.bignumber.equal(new BN(age));
        expect(animal.isAdopted).to.be.false;
        expect(animal.race).to.be.equal(race);
      });
    });
  });

  describe("getAnimal", function () {
    let race, size, age;
    beforeEach(async function () {
      let mockData = [
        //3 dog, 2 cat, 2 equal size, 3 equal age
        { race: "dog", size: 80, age: 5 },
        { race: "cat", size: 20, age: 2 },
        { race: "bird", size: 10, age: 1 },
        { race: "dog", size: 50, age: 3 },
        { race: "dog", size: 30, age: 1 },
        { race: "cat", size: 10, age: 1 },
      ];
      mockData.forEach(async (a) => {
        await spaInstance.addAnimal(a.race, a.size, a.age);
      });
      //test si obtient un résultat unique
      it("should return one animal : dog/80/5", async () => {
        const res = await spaInstance.getAnimal("dog", 80, 5);
        expect(res[0]).to.be.bignumber.equal(new BN(1));
        expect(res[1].size).to.be.bignumber.equal(new BN(80));
        expect(res[1].age).to.be.bignumber.equal(new BN(5));
        expect(res[1].isAdopted).to.be.false;
        expect(res[1].race).to.be.equal("dog");
      });

      //test si obtient un résultat multiple
      describe("getAnimal multiple result", async function () {
        let res;
        res = await spaInstance.getAnimal("dog", 80, 5);
        let count = res[0];
        it("should return 3 animals : dog/<80/<5", async () => {
          const res = await spaInstance.getAnimal("dog", 80, 5);
          expect(res[0]).to.be.bignumber.equal(new BN(3));
        });
        let list = res[1];
        list.forEach((a) => {
          it("should return race : dog", async () => {
            expect(a.race).to.be.equal("dog");
          });
          it("should return size : <=80", async () => {
            expect(a.size).to.be.bignumber.lte(new BN(80));
          });
          it("should return age : <=5", async () => {
            expect(a.age).to.be.bignumber.lte(new BN(5));
          });
        });

        //test si obtient bon résultat qd race !=

        //test si pas de correpsondance

        //test si tableau vide
      });
    });
  });
});
