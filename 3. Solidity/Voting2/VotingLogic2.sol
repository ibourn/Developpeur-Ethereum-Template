// SPDX-License-Identifier: GPL-3.0

import "./IVoting2.sol";
import "./VotingAdmin2.sol";

pragma solidity 0.8.20;

/**
@title 'VotingLogic2' is the voter interaction contract
@notice It allows to : delegate, register proposals, vote and provides getters for :
- winning proposal Id
- winning proposal details
- count of all the proposals
- details of a proposal Id
*/
contract VotingLogic2 is VotingAdmin2, IVoting2 {

    event ProposalRegistered(uint ProposalId);
    event Voted(address voter, uint proposalId);
    /* added to warn when someone delegates (because in principle if he delegates he doesn't vote)*/
    event Delegated(address voter, address delegateTo);
 
    modifier onlyDuringProposalsRegistration() {
        require(workflowStatus == WorkflowStatus.ProposalsRegistrationStarted, "Proposal registration is not open.");
        _;
    }

    modifier onlyDuringVotingSession() {
        require(workflowStatus == WorkflowStatus.VotingSessionStarted, "Vote session is not open.");
        _;
    }

    modifier onlyWhenVotesTallied() {
        require(workflowStatus == WorkflowStatus.VotesTallied, "Votes are not tallied.");
        _;
    }

    /**
    @notice allows a voter to delegate his vote to _delegateTo (_delegateTo should be registered).
     Delegations are available as soons as a delegator is registered till 'VoteSessionEnded'
    @dev no 'Voted' event cause it's the delegator role, instead the function emit a 'Delegated' event 
     If the delegator has already voted we add the user vote to the delegator's 'votedProposalId'
    */
    function delegate(address _delegateTo) external onlyWhitelisted {
        require(uint(workflowStatus) < uint(WorkflowStatus.VotingSessionEnded), "You can't delegate, vote is closed.");
        require(_delegateTo != msg.sender, "You can't delegate to yourself.");
        Voter memory delegator = whitelist[_delegateTo];
        require(delegator.isRegistered, "The delegate is not registered in whitelist.");
        Voter memory currentVoter = whitelist[msg.sender];
        require(!currentVoter.hasVoted, "You have already voted.");
        require(currentVoter.delegateTo == address(0), "You have already delegated your vote.");

        currentVoter.delegateTo = _delegateTo;

        ++delegator.weigth;
        if (delegator.hasVoted) {
            ++totalVotesCount;
            proposals[delegator.votedProposalId].voteCount++;
        }

        whitelist[_delegateTo] = delegator;
        whitelist[msg.sender] = currentVoter;
        emit Delegated(msg.sender, _delegateTo);
    }
    
    /**
    @notice the voters can register only when the workflow status is RegisteringVoters
     we don't check if multiple proposals are similar
    @param _description the description of the proposal to register  
    @dev 'proposals.length - 1' can not underflow cause we push a new proposal before emitting the event
    */
    function registerProposal(string calldata _description) external onlyWhitelisted onlyDuringProposalsRegistration {
        Proposal memory proposal;
        proposal.description = _description;
        
        proposals.push(proposal);

        uint256 proposalId;
        unchecked { proposalId = proposals.length - 1; }  
        emit ProposalRegistered(proposalId);
    }

    /**
    @notice the voters can vote only when the workflow status is VotingSessionStarted
     they can vote only once.
    @param _proposalId the id of the proposal to vote for
    */
    function vote(uint _proposalId) external onlyWhitelisted onlyDuringVotingSession {
        require(_proposalId < proposals.length, "Proposal does not exist.");
        Voter memory currentVoter = whitelist[msg.sender];
        require(!currentVoter.hasVoted, "You have already voted.");
        require(currentVoter.delegateTo == address(0), "You have delegated your vote.");

        ++totalVotesCount;
        currentVoter.hasVoted = true;
        currentVoter.votedProposalId = _proposalId;
        proposals[_proposalId].voteCount++;

        /* if voters delegate to msg.sender, add their votes */
        if (currentVoter.weigth != 0) {
            proposals[_proposalId].voteCount += currentVoter.weigth;
        }
        whitelist[msg.sender] = currentVoter;

        emit Voted(msg.sender, _proposalId);
    }

    /**
    @notice everybody can get the winning proposal but only when the workflow status is VotesTallied
    @return the index in proposals of the winner
    */
    function getWinner() external view onlyWhenVotesTallied returns (uint256) {
        return winningProposalId;
    }

    /**
    @notice everybody can get the winning proposal details but only when the workflow status is VotesTallied
    @return the details of the winner : description, countVote
    */
    function getWinningProposalDetails() external view onlyWhenVotesTallied returns (string memory, uint) {
        return getProposalDetails(winningProposalId);
    }

    /**
    @notice we can get the total votes count at any time
    */
    function getProposalsCount() external view returns (uint256) {
        return proposals.length;
    }

    /**
    @notice we can get the total votes count at any time
     */
    function getTotalVotesCount() external view returns (uint256) {
        return totalVotesCount;
    }

    /**
    @notice we can get the total voters count at any time
    */
    function getVotersCount() external view returns (uint256) {
        return votersCount;
    }

    /**
    @notice all voters can get the details of any proposal at any time
    @param _proposalId, the id of the proposal to get the details from
    @return the details of the proposal : description, countVote
    */
    function getProposalDetails(uint _proposalId) public view onlyWhitelisted returns (string memory, uint) {
        Proposal[] memory currentProposals = proposals;
        /* manage also the case where there's no proposal cause Id 0 will not be < length 0*/
        require(_proposalId < currentProposals.length, "Proposal does not exist.");

        return (currentProposals[_proposalId].description, currentProposals[_proposalId].voteCount);
    }
}