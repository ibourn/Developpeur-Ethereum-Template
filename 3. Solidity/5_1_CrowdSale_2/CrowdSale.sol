// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.8.19;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/contracts/token/ERC20/ERC20.sol";

//question : nom => Crowdsale ou Token ?
contract CrowdSale is ERC20{ 

    constructor() ERC20("CrowdSaleAlyra", "CAL") {
    }


}