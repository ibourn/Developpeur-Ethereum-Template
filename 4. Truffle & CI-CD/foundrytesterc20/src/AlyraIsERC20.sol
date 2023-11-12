// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "openzeppelin-contracts/contracts/token/ERC20/ERC20.sol";

contract AlyraIsERC20 is ERC20 {

    constructor(uint256 initialSupply) ERC20("AlyraIsERC20", "ALY") {
        _mint(msg.sender, initialSupply);
    }

}