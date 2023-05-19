// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.8.19;

contract PseudoRandom {

    uint public nonce;

    function random() public returns(uint){
        nonce++;
        //not secure cause the miner can manipulate the result
        return uint(keccak256(abi.encodePacked(block.timestamp, msg.sender, nonce))) % 100;
    }

}