// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.8.19;

contract Whitelist{
    //1. créer la whitelist
    mapping(address => bool) whitelist;

    //2. créer un event pour notifier quand un utilisateur est autorisé
    event Authorized(address _address);

}