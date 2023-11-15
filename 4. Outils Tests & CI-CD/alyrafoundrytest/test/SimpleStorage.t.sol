// SPDX-license-identifier: MIT
pragma solidity 0.8.20;

import "forge-std/Test.sol";
import "../src/SimpleStorage.sol";

contract SimpleStorageTest is Test {
    //placer les event ds les tests
    event NumberChanged(address indexed by, uint256 number);

    address user1 = makeAddr("user1");
    address user2 = makeAddr("user2");
    SimpleStorage simpleStorage;

    //equiv à beforeEach
    function setUp() public {
        simpleStorage = new SimpleStorage();
    }

    //PREFIXER par test_ pour que cela soit pris en compte comme test
    function test_NumberIs0() public {
        uint256 expectedNumber = simpleStorage.getNumber();
        assertEq(expectedNumber, 0);
    }

    //testFail_ prefix : ce test est ok si il échoue (cas qui doit échouer)
    function testFail_SetNumberTo99() public {
        simpleStorage.setNumber(99);
    }

    function test_RevertWhen_NumberOutOfRange() public {
        vm.expectRevert(NumberOutOfRange.selector);
        simpleStorage.setNumber(99);
    }

    //cas normal
    function test_SetNumberTo7() public {
        simpleStorage.setNumber(7);
        uint256 expectedNumber = simpleStorage.getNumber();
        assertEq(expectedNumber, 7);
    }

    //chgt de signer
    function test_SetNumberWithDifferentUsers() public {
        vm.startPrank(user2);
        simpleStorage.setNumber(7);
        uint256 expectedNumberUser2 = simpleStorage.getNumber();
        assertEq(expectedNumberUser2, 7);
        vm.stopPrank();
        uint256 expectedNumberUser1 = simpleStorage.getNumber();
        assertEq(expectedNumberUser1, 0);
    }

    /*
    3er args : topics des event donc arg indéxés (max 3)
    le 4e correspond à number
    true correpsond aux élément à vérifier pdt le test : false si y en a pas, ou si on veut pas le check
    */
    function test_ExpectEmit() public {
        vm.expectEmit(true, false, false, true);
        emit NumberChanged(address(user2), 7);
        vm.startPrank(user2);
        simpleStorage.setNumber(7);
        vm.stopPrank();
    }
}


/*
forge test => résumé des tests

option -v à -vvvvvv (5)
vv : journaux pdt tests sont affichés (erreurs assertions...)
vvv : traces de pile des tests qui échouent
vvvv : traces de pile de tt les tests
vvvvv : traces de pile et de configuration sont ttes affichées

forge test -watch => relance les tests à chaque modif (test du fichier modifié uniquement)
forge test --watch --run-all => relance ts les tests à chq modif



*/