## **(README_VOTING2.md) => USAGE & SCENARIO / STRUCTURE / CHOICE & EXPLANATION**

In short this version of Voting adds : optimization, delegation, clones & factory to create many vote structure

## **I. USAGE & SCENARIO :**

**DEPLOYMENT**

1. Deploy the factory [VotingFactory2](./VotingFactory2.sol)

2. Deploy the master Voter contract [Voting2](./Voting2.sol) with the deployed factory address as param.

3. In the factory, set the address of the master Voting contract : _setVotingMasterAddress(address of deployed Voting2)_

4. Use the factory functions (others features could be added, there's only the minimum):

- _createVotingContract("Name of the New Vote")_ will create a new Vote (a Voting clone)
- _getVotingClonesAddresses()_ to get the addresses of each created Vote

5. Interact 'at address' of the deployed clone with :

- [IVotingAdmin2](./IVotingAdmin2.sol) for the admin
- [IVoting2](IVoting2.sol) for the voters (the admin can be a voter also)

**SCENARIO**

- admin : _After deployment :_

  - set the address of the deployed Voting contract with _setVotingMasterAddress_
  - uses _createVotingContract("vote name")_ to open a new vote
  - _via IVotingAdmin2 at the address of the clone :_
  - registers voters
  - increments the workflow to start the proposals registration (**only if there's at least one voter registered**)

- voters : _via IVoting2 at the address of the clone :_

  - registers proposals (one or many by voter)
  - can delegate their vote (delegator need to be registered), they can delegate till 'VoteSessionEnded'

- admin :

  - increments the workflow to end the proposals registration (**only if there's at least one proposal registered**)
  - increments the workflow to start the vote session

- voters vote

- admin :

  - increments the workflow to end de vote session (**only if there's at least one vote**)
  - increments the workflow to tally the votes

- about votes :
  - as there's at least one voter, one proposal, one vote leaving the default state of 'winningProposalId' does not create inconsistency.
  - EQUALITY is not managed. Thus in this case, the winner will be the lowest proposalID and so the first proposal registered

## **II. STRUCTURE :**

- VotingFactory2 :

  - this contract stores the address of the master vote contract (Voting2) and create Voting clones
  - Thus 1 vote structure is 1 clone contract with its storage context

- Voting Contract :

  - heritage : VotingStorage2 > VotingAdmin2 > VotingLogic2 > Voting2
  - main contract : Voting2
  - VotingAdmin2 : group all actions related to the administration (workflow management and voter registration)
  - VotingLogic2 : group all actions related to voters
  - Voting2 : inherits logic and storage. Allows ownership management of the clones

- Interfaces :

  - IVoting2 : allows voters interactions at the address of a specific vote (a Voting clone)
  - IVotingAdmin2 : allows admin interactions at the address of a specific vote

- As explained below :
  - to manage the vote, now, the admin has only one function 'incrementWorkflowStep()'
    To move to the next step he need to use this function instead of startProposalRegistration().. tally()..
  - And the person who will deploy the contracts will be the owner of all the contracts created and therefore the admin. So as requested the deployer is the owner and the admin.

## **III. CHOICES AND EXPLANATION :**

We can add some features in a second version of the contract. Many functions could be added (getter ...) to have a better interactions and visualization but
I focused on these propositions :

1. **gas optimization** (loop construction, unchecked tag). An idea would be to also pack the data and manage the function signatures and their order in the contract.

2. Adding the possibility to **delegate votes**. Thus a function delegate(address \_to) is added.

- Voters can delegate only till 'VoteSessionEnded' status (i.e. as soon as they are registered till the vote is closed).
- the code is modify accordingly.

3. Adding the possibility to **manage more than one vote with the same rules**.

- One option would be to add a reset feature. This solution suggests that we only have one vote at a time..
  It is asked that the code inspire confidence. In the context of a vote, in my opinion, such a 'reset' function does not go in this direction even if it is implemented correctly.

- A second option would be to modify the structure to accept many votes. It's my choice.

  - a. A solution could be to use arrays and mappings to manage data the same way as with the current contract for each different vote.

  - It means adding functions to manage this 'higher order' of management.
  - This also means adding code and loops for this. The number of proposals, voters... are not limited, so I don’t like this solution because the more the app will be used the longer the loops will be involving an increasing cost of execution as well as an uncontrollable size of the 'storage' of the basic contract.

  - b. I chose to use clones instead in order to circumvent these disadvantages, for these reasons :

  - We need additional code to handle clones however less than all the changes and new functions needed for the previous operation.
  - Then a basic contract will be deployed but the clones will act as a proxy with their storage context.
  - Not needing a new iteration level, the cost of loops and different computations will note increase with each vote
  - As we add more contracts, i try to decrease the deployment cost.
  - In that direction I modify the flow management by using a new 'incrementWorkflowStep()' function replacing all admin functions used to move to the next workflow status. A disadvantage is that each tx to increment the workflow cost a little more gas (as only the admin can do these actions, voters are not impacted).

4. Possible improvement :

- use a proxy for the factory to allow updates and adding features (there's only the minimum to run)
- features to add to the factory : manage the version of the Voting contract
- features to add to the voting contract : management of the vote count... add the possibility to set more rules...check the proposals to avoid having several identical

// personal note : 3 \* 1/2 journée (1 doc/tests, 1 implementation : clone / heritage.. and correction/tests)
