// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

//sepolia address 0x1E45a9511f83051be7Ab33D68cF92BD4B5278E20
contract SimpleStorage {

    uint private number;

    // constructor(uint _number) {
    //     number = _number;
    // }

    function setNumber(uint _number) external {
        number = _number;
    }

    function getNumber() external view returns(uint) {
        return number;
    }

}