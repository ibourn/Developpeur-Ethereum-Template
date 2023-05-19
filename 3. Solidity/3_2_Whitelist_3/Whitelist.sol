// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.8.19;

contract Whitelist{
    //1. créer la whitelist
    mapping(address => bool) whitelist;

    //2. créer un event pour notifier quand un utilisateur est autorisé
    event Authorized(address _address);
    //extra : créer un event pour notifier quand un utilisateur envoie des ethers
    event EthReceived(address _address, uint _amount);
    
    //3. créer une fonction pour autoriser un utilisateur
    function authorize(address _address) public {
        whitelist[_address] = true;

        emit Authorized(_address);
    }

    //extra : créer receive() et fallback() pour gérer la réception des ethers
    receive() external payable {
        emit EthReceived(msg.sender, msg.value);
    }

    fallback() external payable {
        emit EthReceived(msg.sender, msg.value);
    }
}