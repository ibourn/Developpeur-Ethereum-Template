// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.8.19;

contract People{

    struct Person{
        string name;
        uint age;
    }

    Person public moi;
}