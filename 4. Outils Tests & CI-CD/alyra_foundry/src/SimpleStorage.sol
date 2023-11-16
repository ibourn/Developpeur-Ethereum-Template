// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "openzeppelin-contracts/contracts/access/Ownable.sol";

contract SimpleStorage is Ownable {
    uint256 private number;

    constructor(uint256 _number) Ownable(msg.sender) {
        number = _number;
    }

    function setNumber(uint256 _number) external {
        number = _number;
    }

    function getNumber() external view returns (uint256) {
        return number;
    }
}

/*
commandes : 
curl -L https://foundry.paradigm.xyz | bash
si besoin 
source /home/ibournubuntu/.bashrc
foundryup
besoin d'un referentiel git propre (donc commit avant si besoin)
forge init
forge compile

forge --help

anvil (ds 2nd terminal)
ds autre terminal ds dossier forge, déploiement :
forge create --rpc-url http://localhost:8545 --private-key LAPRIVATEKEY src/SimpleStorage.sol:SimpleStorage

deploiement publique manuel :
charger le .env
source .env

chargement de lib externe :
forge install OpenZeppelin/openzeppelin-contracts

forge create --rpc-url $RPC_URL --constructor-args 3 --private-key $PRIVATE_KEY --etherscan-api-key $ETHERSCAN_API_KEY --verify src/SimpleStorage.sol:SimpleStorage





forge => env de dev
anvil => blockchain locale (même infos que harhdat mettre localhost pour avoir les 2), chainid 31337
castle =>
chisel => 
*/