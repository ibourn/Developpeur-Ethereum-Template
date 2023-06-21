// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

/// @title a simple storage contract
/// @author Ben BK

contract SimpleStorage {

    uint private number;

    /// @notice Set the number
    /// @dev Nothing to say
    /// @param _number the new number which will be in storage in the blockchain
    function setNumber(uint _number) external {
        number = _number;
    }

    /// @notice Get the number which is stored in the blockchain
    /// @return Returns the number
    function getNumber() external view returns(uint) {
        return number;
    }

} 