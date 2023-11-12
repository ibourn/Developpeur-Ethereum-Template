// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/AlyraIsERC20.sol";

contract AlyraIsERC20Test is Test {

    string _name = "AlyraIsERC20";
    string _symbol = "ALY";
    uint256 _initialSupply = 10000 * 10 ** 18;
    address _owner = makeAddr("User0");
    address _recipient = makeAddr("User1");
    uint256 _decimal = 18;

    AlyraIsERC20 _alyraIsERC20;

    function setUp() public {
        vm.prank(_owner);
        _alyraIsERC20 = new AlyraIsERC20(_initialSupply);
    }


    function test_NameIsAlyra() public {
        string memory expectedName = _alyraIsERC20.name();
        assertEq(expectedName, _name);
    }

    function test_SymbolIsALY() public {
        string memory expectedSymbol = _alyraIsERC20.symbol();
        assertEq(expectedSymbol, _symbol);
    }

    function test_DecimalIs18() public {
        uint256 expectedDecimal = _alyraIsERC20.decimals();
        assertEq(expectedDecimal, _decimal);
    }

    function test_FirstBalance() public {
        uint256 balanceOfOwner = _alyraIsERC20.balanceOf(_owner);
        assertEq(balanceOfOwner, _initialSupply);
    }

    function test_CheckBalanceAfterTransfer() public {
        uint256 amount = 100;
        //balance of owner and recipient before transfer
        uint256 balanceOfOwnerBefore = _alyraIsERC20.balanceOf(_owner);
        uint256 balanceOfRecipientBefore = _alyraIsERC20.balanceOf(_recipient);
        assertEq(balanceOfRecipientBefore, 0);

        // ..owner transfer 100
        vm.prank(_owner);
        _alyraIsERC20.transfer(_recipient, amount);
        vm.stopPrank();

        uint256 balanceOfOwnerAfter = _alyraIsERC20.balanceOf(_owner);
        uint256 balanceOfRecipientAfter = _alyraIsERC20.balanceOf(_recipient);
        console.log("balanceOfOwnerBefore", balanceOfOwnerBefore);
        console.log("balanceOfOwnerAfter", balanceOfOwnerAfter);
        console.log("balanceOfRecipientBefore", balanceOfRecipientBefore);
        console.log("balanceOfRecipientAfter", balanceOfRecipientAfter);

        uint256 expectedBalanceOfOwner = balanceOfOwnerBefore - amount;
        uint256 expectedBalanceOfRecipient = balanceOfRecipientBefore + amount;
        console.log("expectedBalanceOfOwner", expectedBalanceOfOwner);
        console.log("expectedBalanceOfRecipient", expectedBalanceOfRecipient);

        assertEq(balanceOfOwnerAfter, expectedBalanceOfOwner);
        assertEq(balanceOfRecipientAfter, expectedBalanceOfRecipient);

    }

    function test_CheckIfApprovalDone() public {
        uint256 amount = 100;
        uint256 allowanceBeforeApproval = _alyraIsERC20.allowance(_owner, _recipient);
        assertEq(allowanceBeforeApproval, 0);

        vm.prank(_owner);
        _alyraIsERC20.approve(_recipient, amount);

        uint256 allowanceAfterApproval = _alyraIsERC20.allowance(_owner, _recipient);
        console.log("allowanceBeforeApproval", allowanceBeforeApproval);
        assertEq(allowanceAfterApproval, amount);
    }

    function test_CheckIfTransferFromDone() public {
        uint256 amount = 100;
        vm.prank(_owner);
        _alyraIsERC20.approve(_recipient, amount);

        uint256 balanceOfOwnerBefore = _alyraIsERC20.balanceOf(_owner);
        uint256 balanceOfRecipientBefore = _alyraIsERC20.balanceOf(_recipient);

        assertEq(balanceOfRecipientBefore, 0);
        assertEq(balanceOfOwnerBefore, _initialSupply);

        uint256 expectedAllowance = _alyraIsERC20.allowance(_owner, _recipient);
        console.log('ok');
        console.log(expectedAllowance);

        vm.prank(_recipient);
        _alyraIsERC20.transferFrom(_owner, _recipient, amount);

        uint256 balanceOfOwnerAfter = _alyraIsERC20.balanceOf(_owner);
        uint256 balanceOfRecipientAfter = _alyraIsERC20.balanceOf(_recipient);

        uint256 expectedBalanceOfOwner = balanceOfOwnerBefore - amount;
        uint256 expectedBalanceOfRecipient = balanceOfRecipientBefore + amount;

        assertEq(balanceOfOwnerAfter, expectedBalanceOfOwner);
        assertEq(balanceOfRecipientAfter, expectedBalanceOfRecipient);

        
    }
}