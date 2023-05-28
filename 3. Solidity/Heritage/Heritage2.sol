// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.4.16 <0.9.0;

contract SimpleStorage {
    uint storedData;

    function set(uint x) public {
        storedData = x;
    }

    function get() public view returns (uint) {
        return storedData;
    }
}

//add dploy 0x65225eC10b966cF70bE296c909BfB5964f8fD498

contract Test {

    address cc = 0x65225eC10b966cF70bE296c909BfB5964f8fD498;
    
    function getValue() external view returns(uint){

        SimpleStorage inst = SimpleStorage(cc);
        return inst.get();
    }


}

//correction

interface Deployed {
    function set(uint256) external;

    function get() external view returns(uint256);
}

contract Existing {

    Deployed dc;

    function call(address _ad) public {
        dc = Deployed(_ad);
    }

    function getA() public view returns (uint res) {
        return dc.get();
    }

    function setA(uint256 _val) public returns(uint res) {
        dc.set(_val);
        return _val;
    }
}

//via remix possible : At address contract déployé

//puis call via metamsk la fonction voulue

//de même at address du contrat déployé deploy interface => recup ses fonctions pour interagir