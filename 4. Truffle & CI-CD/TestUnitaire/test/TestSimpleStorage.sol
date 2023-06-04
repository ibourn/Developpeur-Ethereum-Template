// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.0 <0.9.0;
//import ne marche pas mais en réalité truffle les injecte automatiquement
import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/SimpleStorage.sol";
 
contract TestSimpleStorage {

    function testItStoreAValue() public {
        SimpleStorage simpleStorage = SimpleStorage(DeployedAddresses.SimpleStorage());
        simpleStorage.set(89);
        uint expected = 89;
        Assert.equal(simpleStorage.get(), expected, "It should store the value 89.");
    }
}