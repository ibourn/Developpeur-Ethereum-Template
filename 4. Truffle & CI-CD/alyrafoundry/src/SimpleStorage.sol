// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

contract SimpleStorage {
    uint256 private number;

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
forge create --rpc-url http://localhost:8545 --private-key 0xdbda1821b80551c9d65939329250298aa3472ba22feea921c0cf5d620ea67b97 src/SimpleStorage.sol:SimpleStorage

deploiement publique :




forge => env de dev
anvil => blockchain locale (même infos que harhdat mettre localhost pour avoir les 2), chainid 31337
castle =>
chisel => 
*/