// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.8.20;

/**
@notice this interface allows voters to participate to a vote by associating it with the address of
the clone corresponding to the desired vote
*/
interface IVoting2 {
    
    function delegate(address _delegateTo) external;
    function registerProposal(string calldata _description) external;
    function vote(uint _proposalId) external;
    function getWinner() external view returns (uint256);
    function getWinningProposalDetails() external view returns (string memory, uint);
    function getProposalsCount() external view returns (uint256);
    function getProposalDetails(uint _proposalId) external view returns (string memory, uint);

}