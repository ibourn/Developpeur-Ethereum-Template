// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "forge-std/Script.sol";
import "../src/SimpleStorage.sol";

contract MyScript is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        SimpleStorage simpleStorage = new SimpleStorage(3);

        vm.stopBroadcast();
    }
}

/*
1. METHODE CLI avec CAST
commande de déploiement :
forge script script/SimpleStorage.s.sol:MyScript --fork-url http://localhost:8545 --broadcast
si déployé à : 0x5FbDB2315678afecb367f032d93F642f64180aa3

cast send 0x5FbDB2315678afecb367f032d93F642f64180aa3 "setNumber(uint256)" 777 --rpc-url http://127.0.0.1:8545 --private-key $PRIVATE_KEY

cast call 0x5FbDB2315678afecb367f032d93F642f64180aa3 "getNumber()"
res : 0x0000000000000000000000000000000000000000000000000000000000000309
cast to-dec 0x0000000000000000000000000000000000000000000000000000000000000309


*/


/*
CONTRAT SIMPLESTORAGE :
// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import "openzeppelin-contracts/contracts/access/Ownable.sol";

contract SimpleStorage is Ownable {
    uint256 private number;

    constructor(uint256 _number) {
        number = _number;
    }

    function setNumber(uint256 _number) external {
        number = _number;
    }

    function getNumber() external view returns(uint256) {
        return number;
    }
}

*/