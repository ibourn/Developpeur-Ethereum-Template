// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.8.19;

contract Classroom{

    mapping(address => uint[]) public notes; //--------- exo : choice of storage sheme

    //1. mapping cause we know all the student addresses and we want to access the notes by student address
    //2. array cause we don't know how many notes a student will have and we want to access the notes for computation
}