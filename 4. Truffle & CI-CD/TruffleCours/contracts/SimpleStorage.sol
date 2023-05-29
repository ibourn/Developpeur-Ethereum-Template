// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.0 <0.9.0;
 
 /* goerli deployment add : 0x6E063cf59F7528598da474F13F74601284678068 */
contract SimpleStorage {
   uint storageData;
 
   function set(uint x) public {
       storageData = x;
   }
 
   function get() public view returns (uint) {
       return storageData;
   }
}