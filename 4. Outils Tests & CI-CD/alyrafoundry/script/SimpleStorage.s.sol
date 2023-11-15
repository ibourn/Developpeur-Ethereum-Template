//SPDX-license-identifier: MIT
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
commande de déploiement :

déployé sur sepolia et vérifié à : 0xB484d46C1B2132F0c52EB2bf926252EAd7763A01

forge script script/SimpleStorage.s.sol --rpc-url $RPC_URL --broadcast --verify

Flux de déploiement :
simulation locale (si rpc/fork fourni alors ds ce contexte)
simulation onchain (si rpc/fork fourni alors ds ce contexte les tx sont executées sequentiellement)
diffusion si option --broadcast
verification si option --verify



pour déployer sur anvil :
forge script script/SimpleStorage.s.sol:MyScript --fork-url http://localhost:8545/ --broadcast

*/