// SPDX-License-Identifier: GPL-3.0

import "./IVotingAdmin2.sol";
import "./VotingStorage2.sol";

pragma solidity 0.8.20;

/**
@title 'VotingAdmin2' is the admin interaction contract
@notice 
-here are all admin action : increment the workflow steps and register one or many voters
-tally() function is called by incrementWorkflowStep() when incrementing from 'VotingSessionEnded' step
-a public getter allows every whitelisted address to check the 'workflowstatus'
*/
contract VotingAdmin2 is VotingStorage2, IVotingAdmin2 {

    event WorkflowStatusChange(WorkflowStatus previousStatus, WorkflowStatus newStatus);
    event VoterRegistered(address voterAddress);

    modifier onlyWhitelisted() {
        require(whitelist[msg.sender].isRegistered, "You are not registered in whitelist");
        _;
    }

    modifier onlyDuringVotersRegistration() {
        require(workflowStatus == WorkflowStatus.RegisteringVoters, "Voter registration is not open.");
        _;
    }

    /**
    @notice this function becomes the only one the admin use to manage the workflow.
     - Admin needs to call this function as soon as he wants to proceed to the next step of the workflow.
     - Thus tallyVotes() is called by the function when he wants to switch from 'VotingSessionEnded'
     to 'VotesTallied'.
     - I think this code brings more confidence because the admin runs the vote with a single function that
     increments the steps, so he can't mess with the order of the flow (reading available functions
     from user perspective.
     - As I didn't touch the workflow enum :
     Be aware going from 'startstartProposals..' to 'startVoting..' needs 2 calls (one to close the first step
     and one to start the next step). The same from 'startVoting..' to 'votesTallied'.
    @dev the main goal of this function is to reduce the deployment cost, the disadvantage is that
     incrementing each step costs a little more gas at execution. Indeed it is less costly at execution to have 
     a small function for each workflowstatus than to have one that handles them all.
     (as only the admin can do these actions, voters are not impacted)
    */
    function incrementWorkflowStep() external onlyOwner {
        WorkflowStatus currentStatus = workflowStatus;
        if (currentStatus == WorkflowStatus.RegisteringVoters && votersCount == 0) {
            revert("No voter registered.");
        } else if (currentStatus == WorkflowStatus.ProposalsRegistrationStarted && proposals.length == 0) {
            revert("No proposal registered.");
        } else if (currentStatus == WorkflowStatus.VotingSessionStarted && totalVotesCount == 0) {
            revert("There is no vote.");
        } else if (currentStatus == WorkflowStatus.VotesTallied) {
            revert("Workflow is already finished. Votes are tallied.");
        } else if (currentStatus == WorkflowStatus.VotingSessionEnded) {
            tallyVotes();
        }

        /* enum can't overflow */
        uint newStatus;
        unchecked { newStatus = uint(currentStatus) + 1; }

        workflowStatus = WorkflowStatus(newStatus);
        emit WorkflowStatusChange(currentStatus, workflowStatus);
    }
    
    /**
    @notice the owner can register voters only when the workflow status is RegisteringVoters
     Only the addresses registered in the whitelist can vote and register proposals.
    @param _votersAddresses array of addresses to register
    */
    function registerVoters(address[] calldata _votersAddresses) external onlyOwner onlyDuringVotersRegistration {
        for (uint256 i; i < _votersAddresses.length;) {
            registerVoter(_votersAddresses[i]);
            unchecked { ++i; }
        }
    } 

    /**
    @notice allow to register a voter one by one. 
    @param _voterAddress the address of the voter to register
    */
    function registerVoter(address _voterAddress) public onlyOwner onlyDuringVotersRegistration {
        Voter memory currentVoter = whitelist[_voterAddress];
        require(!currentVoter.isRegistered, "This address is already registered.");
        
        ++votersCount;
        currentVoter.isRegistered = true;
        whitelist[_voterAddress] = currentVoter;

        emit VoterRegistered(_voterAddress);
    }

    /**
    @notice getter for the current 'workflowstatus', it's public to let voter check the status
    */
    function getWorkflowStatus() public view returns(uint) {
        return uint(workflowStatus);
    }

    /**
    @notice the owner can tally the votes only when the workflow status is VotingSessionEnded
     the winning proposal is the one with the most votes. In case of equality, the first registered proposal wins
     the winning proposal id is stored in `winningProposalId` 
    @dev to save gas : dont't init i to 0 in the loop and for ' proposals' use memory instead of storage as we have many calls with the loop
    */
    function tallyVotes() private onlyOwner {
        Proposal[] memory currentProposals = proposals;
        uint256 proposalsLength = currentProposals.length;
        uint256 winningVoteCount;

        for (uint256 i; i < proposalsLength;) {
            if (currentProposals[i].voteCount > winningVoteCount) {
                winningVoteCount = currentProposals[i].voteCount;
                winningProposalId = i;
            }
            unchecked { ++i; }
        }
        workflowStatus = WorkflowStatus.VotesTallied; 
        emit WorkflowStatusChange(WorkflowStatus.VotingSessionEnded, WorkflowStatus.VotesTallied);
    }
}