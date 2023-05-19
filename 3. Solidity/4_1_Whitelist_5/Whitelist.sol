// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.8.19;

contract Whitelist{
    //1. créer la whitelist
    mapping(address => bool) whitelist;

    //2. créer un event pour notifier quand un utilisateur est autorisé
    event Authorized(address _address);
    //extra : créer un event pour notifier quand un utilisateur envoie des ethers
    event EthReceived(address _address, uint _amount);

    //5.bis ajout du constructeur pour autoriser le deployeur du contrat
    constructor() {
        whitelist[msg.sender] = true;
    }

    //5. créer un modifier pour vérifier si un utilisateur est autorisé, il remplace la function check()
    modifier check() {
        require(whitelist[msg.sender], "You are not authorized to authorize");
        _;
    }
    
    //3. créer une fonction pour autoriser un utilisateur
    function authorize(address _address) public check{
        whitelist[_address] = true;

        emit Authorized(_address);
    }

    //4. créer une fonction pour vérifier si un utilisateur est autorisé
    //as the default value of a bool is false, only authorized users will return true
    // function check() private view returns(bool) {
    //     return whitelist[msg.sender];
    // }
    //correction : 
    // function check() private view returns(bool) {
    //    if(whitelist[msg.sender] == true){
    //        return true;
    //    } else {
    //        return false;
    //    }
    // }


    //extra : créer receive() et fallback() pour gérer la réception des ethers
    receive() external payable {
        emit EthReceived(msg.sender, msg.value);
    }

    fallback() external payable {
        emit EthReceived(msg.sender, msg.value);
    }
}