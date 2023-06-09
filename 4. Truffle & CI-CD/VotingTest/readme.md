#_TEST OF VOTING.SOL_

## environment :

truffle <br>
installation : npm install --prefix . @openzeppelin/test-helpers --save-dev
@openzeppelin/contracts dotenv @truffle/hdwallet-provider

## coverage :

it tried to cover all cases for all functions, however I did not test the situations not dealt with by the contract (ex: equality of votes...)

the use of package x allowing to use truffle code in hardhat allowed to test hardhat coverage with a result of 100% for all columns

## structure :

as a vote follows different steps, I made the choice to separate the tests according to each phase with an associated file:

- 01 at deployment :
- 02 'RegisterVoter' :
- 03 'RegisterProposals' :
- 04 'VotingSession' :
- 05 'TallyVotes :

I used helpers placed in VotingHelper to clarify the code and factor what could be. This also helps to ensure that the simulated parameters are the same throughout the tests.

## **details :**

### helpers :

here are the mocked elements:

- index of addresses used
- proposals
- workflowStatus
- a function to obtain addresses
- as well as 3 helpers to simulate a context up to the status 'ProposalRegisteringStarted', 'ProposalRegisteringEnded', 'VotingSessionEndeds'

### 01 at deployment :

- before any test, I confirm that the simulated status matches the indexes of the enum
- it is also checked that owner and stranger are unique
- we check the contract is deployed
- we then check the value of the states expected for deployment (status, winningId, and the owner)

- finally, since access to functions is processed with modifiers, I check that all functions with limited access is not accessible by unauthorized addresses. This frees up the rest of the tests

### 02 'RegisterVoter' :

- I define the current and next status as well as the addresses used for the registration stage of voters. A hook is used to do each test on a new fresh instance

- I then check the actions related to this phase:
- addVoter, getVoter : when adding a voter: an event must be issued, it must be added to the voter mapping. An attempt to add the same voter must revert
- as addVoter is tested, we can test, the initial status of getOneProposal which must revert. This confirms that proposals is empty

- then check that voting and owner cannot call all other functions accessible only during other status

### 03 'RegisterProposals' :

- I define the current and next status as well as the addresses used for the registration stage of voters. First a hook before is used to facilitate a loop test on several additions of proposals. This does not affect the context of this block’s tests. Second a beforeEach is used to ensure a fresh instance for the change of status

- I then check the actions related to this phase:
  - the status index should be 1
  - a genesis proposal should have been added to proposals
- addProposal :

  - should revert with an empty proposal
  - should emit an event and after we should get the proposal via his index

- then check that voting and owner cannot call all other functions accessible only during other status

- finally I check the passage to the next status. The new index must correspond to the expected and an event must be issued

### 04 'VotingSession' :

- I define the previous, current and next status as well as the addresses used for the registration stage of voters. A hook is used to do each test on a new fresh instance

- I then check the actions related to this phase:
  - the current status, the change to 'VotingSessionStared'
  - The three proposals simulated and injected via the general hooks must have no vote and the voters of must have VotedProposalId
- then i add a hook for 'VotingSessionStarted' to test 'setVote'

  - setVote : sould emit an event and set the votedProposalId of the voter
    We check then the update of voter (hasVoted) and proposalId (the vote count)
  - setVote revert cases : we check a voter can't vote twice and for a non existing vote

- then I check that voting and owner cannot call all other functions accessible only during other status

- finally I check the passage to the next status. The new index must correspond to the expected and an event must be issued

### 05 'TallyVotes :

- I define the previous, current and next status as well as the addresses used for the registration stage of voters. A hook is used to do each test on a new fresh instance

- I then check the actions related to this phase:
  - the current status must be valid, then the change to the last one should give the correct index and emit an event
- tallyVote : we check that it set winningProposalId with the correct id (according to the mocked context)

- then I check that voting and owner cannot call all other functions accessible only during other status
