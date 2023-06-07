#_TEST OF VOTING.SOL_

## environment :

truffle

## structure :

as a vote follows different steps, I made the choice to separate the tests according to each phase with an associated file:

- 01 at deployment :
- status check
- accessibility of functions test
- check the change to next status
- 02 'RegisterVoter' :

- 03 'RegisterProposals' :

- 04 'VotingSession' :

- 05 'TallyVotes :

# coverage :

it tried to cover all cases for all functions, however I did not test the situations not dealt with by the contract (ex: equality of votes...)

each require and emit are tested all status
