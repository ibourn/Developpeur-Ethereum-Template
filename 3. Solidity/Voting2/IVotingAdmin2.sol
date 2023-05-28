// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.8.20;

/**
@notice this interface allows the admin to interact with a specific vote by associating it with the address of
the clone corresponding to the desired vote
*/
interface IVotingAdmin2 {

    function getWorkflowStatus() external view returns(uint);
    function incrementWorkflowStep() external;
    function registerVoters(address[] calldata _votersAddresses) external;
    function registerVoter(address _voterAddress) external;

}