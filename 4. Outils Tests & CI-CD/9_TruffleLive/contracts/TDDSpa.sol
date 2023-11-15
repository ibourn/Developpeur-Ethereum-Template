/// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

contract TDDSpa {

struct Animal{
    string race;
    uint size; // cm
    uint age;
bool isAdopted;
}

Animal[] public animalsArray;
mapping(uint => address) public animalToOwner;


function addAnimal(string calldata _race, uint _size, uint _age) public {

    Animal memory animal;
    animal.race = _race;
    animal.size = _size;
    animal.age = _age;
    animal.isAdopted = false;
    animalsArray.push(animal);

}

function getAnimal(string calldata _race, uint _size, uint _age) public view returns(uint, Animal[] memory){
    uint animalCount = animalsArray.length;
    Animal[] memory animals = animalsArray;
    Animal[] memory animalsFiltered = new Animal[](animalCount);
    Animal memory animal;
    uint animalsFilteredCount = 0;
uint maxIndex = animalCount - 1;

    for(uint i; i < maxIndex; i++) {
        animal = animals[i];
        bool isEqualSize = animal.size <= _size;
        bool isEqualAge = animal.age <= _age;
        bool isEquelRace = (keccak256(abi.encodePacked(animal.race)) == keccak256(abi.encodePacked(_race)));
        if(isEqualSize && isEqualAge && isEquelRace) {
    
            animalsFiltered[animalsFilteredCount] = animal;
            animalsFilteredCount++;
        }

    }
    return (animalsFilteredCount, animalsFiltered);

}

}