// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.0 <0.9.0;
 
//  /* goerli deployment add : 0x6E063cf59F7528598da474F13F74601284678068 */
// contract SimpleStorage {
//    uint storageData;

// event NewSet(uint newStoredData);

 
//    function set(uint x) public {
//     require(x < 100, "x must be less than 100");
//        storageData = x;
//        emit NewSet(x);
//    }
 
//    function get() public view returns (uint) {
//        return storageData;
//    }
// }


//correction
// pragma solidity >=0.4.16 <0.9.0;


contract SimpleStorage {
    uint storedData;
    event Setted(uint _value);

    function set(uint x) public {
        require(x != 42, "pas bon");
        storedData = x;
        emit Setted(x);
    }

    function get() public view returns (uint) {
        return storedData;
    }
}