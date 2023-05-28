// SPDX-License-Identifier: GPL-3.0

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol";

pragma solidity 0.8.20;

/**
@title 'Voters', a contract to register voters, proposals and vote for a proposal
@notice The owner is the admin, he can register voters, open and close the proposals registration, open and close the vote session, tally the votes
Voters can register proposals and vote for a proposal and see the vote of the others. 
The owner is the admin.
It is asked that the code inpsire confiance :
- the workflow is managed by an enum (the admin decides when to move to the next step, but modifiers and the enum prevent him from doing it at the wrong time)
- mofdifiers prevent wrong persons from doing wrong actions at the wrong time
- the naming of the variables and functions is explicit
- comments are added when necessary
*/
contract Voting is Ownable {

    ///@notice the flow of the vote follows this enum order. 
    enum WorkflowStatus {
        RegisteringVoters,
        ProposalsRegistrationStarted,
        ProposalsRegistrationEnded,
        VotingSessionStarted,
        VotingSessionEnded,
        VotesTallied
    }

    struct Voter {
        bool isRegistered;
        bool hasVoted;
        uint votedProposalId;
    }
    struct Proposal {
        string description;
        uint voteCount;
    }

    ///@notice at initialization, the status is RegisteringVoters
    ///@dev nothing is specified for workflow visibility. It is left public so that anyone
    /// can check the normal course (even if there are events). And so the default getter saves 73 gas
    WorkflowStatus public workflowStatus; 
    uint winningProposalId;
    ///@dev it allows to check if there's at least one vote before moving to 'VotingSessionEnded' status
    uint totalVotesCount;

    mapping(address => Voter) whitelist;
    Proposal[] proposals;

    /*
    * it is specified that each voter can see the vote of the others.
    * As there's an event for each vote, do not create a function for this saves gas.
    */
    event VoterRegistered(address voterAddress);
    event WorkflowStatusChange(WorkflowStatus previousStatus, WorkflowStatus newStatus);
    event ProposalRegistered(uint ProposalId);
    event Voted(address voter, uint proposalId);
 

    modifier onlyWhitelisted() {
        require(whitelist[msg.sender].isRegistered, "You are not registered in whitelist");
        _;
    }
    /*
     * Modifiers to check the workflow status
     */
    modifier onlyDuringVotersRegistration() {
        require(workflowStatus == WorkflowStatus.RegisteringVoters, "Voter registration is not open.");
        _;
    }

    modifier onlyDuringProposalsRegistration() {
        require(workflowStatus == WorkflowStatus.ProposalsRegistrationStarted, "Proposal registration is not open.");
        _;
    }

    modifier onlyWhenProposalsRegistrationEnded() {
        require(workflowStatus == WorkflowStatus.ProposalsRegistrationEnded, "Only when registration is ended.");
        _;
    }

    modifier onlyDuringVotingSession() {
        require(workflowStatus == WorkflowStatus.VotingSessionStarted, "Vote session is not open.");
        _;
    }

    modifier onlyWhenVotingSessionEnded() {
        require(workflowStatus == WorkflowStatus.VotingSessionEnded, "Only when vote session is ended.");
        _;
    }

    modifier onlyWhenVotesTallied() {
        require(workflowStatus == WorkflowStatus.VotesTallied, "Votes are not tallied.");
        _;
    }

    /*
     * functions following the workflow
     */
    ///@notice the owner can register voters only when the workflow status is RegisteringVoters
    /// Only the addresses registered in the whitelist can vote and register proposals.
    ///@param _votersAddresses array of addresses to register
    function registerVoters(address[] calldata _votersAddresses) external onlyOwner onlyDuringVotersRegistration {
        for (uint256 i; i < _votersAddresses.length; i++) {
            registerVoter(_votersAddresses[i]);
        }
    }  
 
    ///@notice the owner can open the proposals registration only when the workflow status is RegisteringVoters
    function startProposalsRegistration() external onlyOwner onlyDuringVotersRegistration {
        workflowStatus = WorkflowStatus.ProposalsRegistrationStarted;
        emit WorkflowStatusChange(WorkflowStatus.RegisteringVoters, WorkflowStatus.ProposalsRegistrationStarted);
    }

    ///@notice the voters can register only when the workflow status is RegisteringVoters
    /// we don't check if multiple proposals are similar
    ///@param _description the description of the proposal to register  
    ///@dev 'proposals.length - 1' can not underflow cause we push a new proposal before emitting the event
    function registerProposal(string calldata _description) external onlyWhitelisted onlyDuringProposalsRegistration {
        proposals.push(Proposal(_description, 0));
        // unchecked {uint proposalId = proposals.length - 1;}  
        emit ProposalRegistered(proposals.length - 1);
    }

    ///@notice the owner can close the proposals registration only when the workflow status is ProposalsRegistrationStarted
    /// and only if at least one proposal is registered (the vote has no sense if there is no proposal)
    ///@dev !=0 cost less gas than >0
    function endProposalsRegistration() external onlyOwner onlyDuringProposalsRegistration {
        require(proposals.length != 0, "No proposal registered.");

        workflowStatus = WorkflowStatus.ProposalsRegistrationEnded;
        emit WorkflowStatusChange(WorkflowStatus.ProposalsRegistrationStarted, WorkflowStatus.ProposalsRegistrationEnded);
    }

    ///@notice the owner can open the vote session only when the workflow status is ProposalsRegistrationEnded
    function startVotingSession() external onlyOwner onlyWhenProposalsRegistrationEnded {
        workflowStatus = WorkflowStatus.VotingSessionStarted;
        emit WorkflowStatusChange(WorkflowStatus.ProposalsRegistrationEnded, WorkflowStatus.VotingSessionStarted);
    }

    ///@notice the voters can vote only when the workflow status is VotingSessionStarted
    /// they can vote only once.
    ///@param _proposalId the id of the proposal to vote for
    function vote(uint _proposalId) external onlyWhitelisted onlyDuringVotingSession {
        Voter memory currentVoter = whitelist[msg.sender];
        require(!currentVoter.hasVoted, "You have already voted.");
        require(_proposalId < proposals.length, "Proposal does not exist.");

        totalVotesCount++;
        currentVoter.hasVoted = true;
        currentVoter.votedProposalId = _proposalId;
        proposals[_proposalId].voteCount++;
        
        whitelist[msg.sender] = currentVoter;
        emit Voted(msg.sender, _proposalId);
    }

    ///@notice the owner can close the vote session only when the workflow status is VotingSessionStarted
    /// and only if at least one vote is registered. There's at least one proposal, so it should have at least one vote
    function endVotingSession() external onlyOwner onlyDuringVotingSession {
        require(totalVotesCount != 0, "No votes registered.");

        workflowStatus = WorkflowStatus.VotingSessionEnded;
        emit WorkflowStatusChange(WorkflowStatus.VotingSessionStarted, WorkflowStatus.VotingSessionEnded);
    }

    ///@notice the owner can tally the votes only when the workflow status is VotingSessionEnded
    /// the winning proposal is the one with the most votes. In case of equality, the first registered proposal wins
    /// the winning proposal id is stored in `winningProposalId` 
    ///@dev to save gas : dont't init i to 0 in the loop and for ' proposals' use memory instead of storage as we have many calls with the loop
    function tallyVotes() external onlyOwner onlyWhenVotingSessionEnded {
        Proposal[] memory currentProposals = proposals;
        uint256 proposalsLength = currentProposals.length;
        uint256 winningVoteCount;

        for (uint256 i; i < proposalsLength; i++) {
            if (currentProposals[i].voteCount > winningVoteCount) {
                winningVoteCount = currentProposals[i].voteCount;
                winningProposalId = i;
            }
        }
        workflowStatus = WorkflowStatus.VotesTallied; 
        emit WorkflowStatusChange(WorkflowStatus.VotingSessionEnded, WorkflowStatus.VotesTallied);
    }

    /*
    *   GETTERS
    */
    ///@notice everybody can get the winning proposal but only when the workflow status is VotesTallied
    ///@return the index in proposals of the winner
    function getWinner() external view onlyWhenVotesTallied returns (uint256) {
        return winningProposalId;
    }

    ///@notice everybody can get the winning proposal details but only when the workflow status is VotesTallied
    ///@return the details of the winner : description, countVote
    function getWinningProposalDetails() external view onlyWhenVotesTallied returns (string memory, uint) {
        return getProposalDetails(winningProposalId);
    }

    // ///@notice we can get the workflow status at any time
    // function getWorkflowStatus() external view returns (WorkflowStatus) {
    //     return workflowStatus;
    // }

    ///@notice we can get the total votes count at any time
    function getProposalsCount() external view returns (uint256) {
        return proposals.length;
    }

    ///@notice all voters can get the details of any proposal at any time
    ///@param _proposalId the id of the proposal to get the details from
    ///@return the details of the proposal : description, countVote
    function getProposalDetails(uint _proposalId) public view onlyWhitelisted returns (string memory, uint) {
        require(proposals.length != 0, "No proposal registered yet.");
        require(_proposalId < proposals.length, "Proposal does not exist.");

        return (proposals[_proposalId].description, proposals[_proposalId].voteCount);
    }


    ///@notice allow to register a voter one by one. 
    ///@param _voterAddress the address of the voter to register
    function registerVoter(address _voterAddress) public onlyOwner onlyDuringVotersRegistration {
        require(!whitelist[_voterAddress].isRegistered, "This address is already registered.");
        
        whitelist[_voterAddress].isRegistered = true;
        emit VoterRegistered(_voterAddress);
    }

}