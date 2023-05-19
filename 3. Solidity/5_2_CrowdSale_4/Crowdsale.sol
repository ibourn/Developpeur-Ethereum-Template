// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.8.19;

import "./Token.sol";

contract CrowdSale { 
    uint public constant MIN_INVEST = 0.01 ether;
    //1 eth received = 200 tokens sent (= 0.005 eth/token or 5* 1**15 wei/token )
    uint public rate = 200;
    Token public token;
 
    constructor(uint256 _initialSupply) {
        token = new Token(_initialSupply);
    }

    receive() external payable {
        require(msg.value >= MIN_INVEST, "Minimum 0.01 ether");

        distribute(msg.value);
    }

    function distribute(uint256 _amount) internal {
        uint256 tokensToSent = _amount * rate;

        token.transfer(msg.sender, tokensToSent);
    }

}