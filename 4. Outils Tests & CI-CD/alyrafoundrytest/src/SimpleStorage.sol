// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

error NumberOutOfRange();

contract SimpleStorage {
    event NumberChanged(address indexed by, uint256 number);

    mapping(address => uint256) private addressToNumber;

    function setNumber(uint256 _number) external {
        if(_number >= 10) {
            revert NumberOutOfRange();
        }

        addressToNumber[msg.sender] = _number;
        emit NumberChanged(msg.sender, _number);
    }

    function getNumber() external view returns (uint256) {
        return addressToNumber[msg.sender];
    }
}