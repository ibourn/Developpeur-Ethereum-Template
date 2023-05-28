// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract ButeToken is ERC20 {
    constructor(uint256 initialSupply) ERC20("ButeToken", "BTN")  {
        _mint(msg.sender, initialSupply);
    }

    function freeMint() public {
        _mint(msg.sender, 10);
    }
}

interface ButeTokenDeployed {

    function freeMint() external;

}

//exemple : Cyr déploie erc20 à 0x0A9B6D72750C8e0102ee861d793aCc7FB118788c
//on déploie interce at adress
//puis call freeMint pour récup des tokens
//tx : 0xede3c7d715d5be7c69ec06291852a3db520c9e3b6e25f9599fc30ac21d72c670
