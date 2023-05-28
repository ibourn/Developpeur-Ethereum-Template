// SPDX-License-Identifier: GPL-3.0

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol";

pragma solidity 0.8.20;

/**
@notice This contract is herited by all others, it manages all voting state variables and types
@dev This contract shouldn't be modified!
*/
contract VotingStorage2 is Ownable {

    ///@notice the flow of the vote follows this enum order. 
    enum WorkflowStatus {
        RegisteringVoters,
        ProposalsRegistrationStarted,
        ProposalsRegistrationEnded,
        VotingSessionStarted,
        VotingSessionEnded,
        VotesTallied
    }

    /**
    @dev weigth and delegateTo added
    -weigth, the number of vote given by other voters (weigth == 0 : simple voter, != 0 : voter with delegation)
    -delegateTo, the address to which the elector delegates his vote (voter can't vote if hasVoted or delegateTo != add(0))
    */
    struct Voter {
        bool isRegistered;
        bool hasVoted;
        uint votedProposalId;
        uint weigth;
        address delegateTo;
    }
    struct Proposal {
        string description;
        uint voteCount;
    }

    ///@notice stores the current step of the vote. At initialization, the status is RegisteringVoters.
    WorkflowStatus workflowStatus; 
    uint winningProposalId;
    ///@dev it allows to check if there's at least one voter before moving to 'ProposalsRegistrationStarted' status
    uint votersCount;
    ///@dev it allows to check if there's at least one vote before moving to 'VotingSessionEnded' status
    uint totalVotesCount;
    ///@notice the ident of the vote
    string voteName;

    mapping(address => Voter) whitelist;
    Proposal[] proposals;

}