// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.0 <0.9.0;
 
 /* mumbai deployment add : 0x3AAE0f4143a49f01ea7A9714B0d13Cfa33a61daa */
contract SimpleStorage {
   uint storageData;
 
   function set(uint x) public {
       storageData = x;
   }
 
   function get() public view returns (uint) {
       return storageData;
   }
}