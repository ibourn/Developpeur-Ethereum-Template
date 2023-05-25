//SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Parent {

    uint public myVar;

    function setMyVar(uint _myVar) external {
        myVar = _myVar;
    }
}

contract Child is Parent {

    function getMyVar() external view returns(uint) {
        return myVar;
    }
}

contract Caller {
    Child child;   
    
    constructor(address _child) {
        child = new Child(_child);
    }

    function getMyVar() external view returns(uint) {
        return child.getMyVar();
    }
}


