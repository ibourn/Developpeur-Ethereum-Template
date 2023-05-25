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

    function etMyVar() external view returns(uint) {
        return myVar;
    }
}

contract Caller {

    //correction => fonctionne car on importe Child ou là ds le même fichier
    Child cc = new Child();  //création d'une instance nouvelle de Child
    // Child child;   
    
    // constructor(address _child) {
    //     child = new Child(_child);
    // }

    function testMyVar(uint myVar) external view returns(uint) {
        cc.setMyVar(myVar);
        return cc.getMyVar();
    }
}


