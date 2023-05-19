// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.8.19;

contract Bank {

    mapping(address => uint) public balances;

    function deposit(uint _amount) public {
        balances[msg.sender] += _amount;
    }

    function transfer(address _to, uint _amount) public {
        require(_to != address(0), "You can't burn your tokens");
        require(balances[msg.sender] >= _amount, "Balance too low");

        balances[msg.sender] -= _amount;
        balances[_to] += _amount;
    }

    function balanceOf(address _account) public view returns(uint) {
        return balances[_account];
    }


}