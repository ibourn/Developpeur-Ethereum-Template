(VOTING2_README.md) => USAGE / STRUCTURE / CHOICE & EXPLANATION

I. USAGE :

1. Deploy the factory 'VotingFactory2'
2. Deploy the master Voter contract 'Voting2' with the factory address as param.
3. In the factory, set the address of the master Voting contract : setVotingMasterAddress(address of deployed Voting2)
4. Use the factory functions (others features could be added, there's only the minimum):

- createVotingContract("Name") will create a new Vote (a Voting clone)
- getVotingClonesAddresses() to get the addresses of each created Vote

4. Interact 'at the address of the deployed clone' with :

- IVotingAdmin2 for the admin
- IVoting2 for the voters (the admin can be a voter also)

As explained below :

- to manange the vote the admin has only one function 'incrementWorkflowStep()'
  To move to the next step he need to use this function instead of startProposalRegistration().. tally()..

- And the person who will deploy the contracts will be the owner of all the contracts created and therefore the admin. So as requested the admin for all votes will be the owner

II. STRUCTURE :

- VotingFactory2

  - this contract stores the address of the master vote contract (Voting2) and create Voting clones
  - Thus 1 vote structure is 1 clone contract with its storage context

- Voting Contract:

  - heritage : VotingStorage2 > VotingAdmin2 > VotingLogic2 > Voting2
  - main contract : Voting2
  - VotingAdmin2 : group all actions related to the administration (workflow management and voter registration)
  - VotingLogic2 : group all actions related to voters
  - Voting2 : inherits logic and storage. Allows ownership management of the clones

- interfaces :
  - IVoting2 : allows voters interactions at the address of a specific vote
  - IVotingAdmin2 : allows admin interactions at the address of a specific vote

III. CHOICES AND EXPLANATION :

We can add some features in a second version of the contract. Many functions could be added (getter ...) to have a better interactions and visualization but
I focused on these propositions :

1. gas optimisation (loop construction, unchecked tag). An idea would be to also pack the data and manage the function signatures and their order in the contract.

2. Adding the possibility to delegate votes. Thus a function delegate(address \_to) is added.

- Voters can delegate only till 'VoteSessionEnded' status (i.e. as soon as they are registered till the vote is closed).
- the code is modify accordingly.

3. Adding the possibility to manage more than one vote with the same rules.

- One option would be to add a reset feature. This solution suggests that we only have one vote at a time..
  It is asked that the code inspire confidence. In the context of a vote, in my opinion, such a 'reset' function does not go in this direction even if it is implemented correctly.

- A second option would be to modify the structure to accept many votes. It's my choice.

a. A solution could be to use arrays and mappings to manage data the same way as with the current contract for each different vote.

- It means adding functions to manage this 'higher order' of management.
- This also means adding code and loops for this. The number of proposals, voters... are not limited, so I don’t like this solution because the more the app will be used the longer the loops will be involving an increasing cost of execution as well as an uncontrollable size of the 'storage' of the basic contract.

b. I chose to use clones instead in order to circumvent these disadvantages, for these reasons :

- We need additionnal code to handle clones however less than all the changes and new functions needed for the previous operation.
- Then a basic contract will be deployed but the clones will act as a proxy with their storage context.
- Not needing a new iteration level, the cost of loops and different computations will note increase with each vote

\*n'ayant pas besoin de nouveau niveau d'itération le coût de boucles et différents calculs n'augmentera pas à chaque noueau vote.

- As we add more contracts, i try to decrease the deployment cost.
- In that direction I modify the flow management by using a new 'incrementWorkflowStep()' function replacing all admin functions used to move to the next workflow status. A disadvantage is that each incrementation cost a little more gas (as only the admin can do these actions, voters are not impacted).
