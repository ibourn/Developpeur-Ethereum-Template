const Voting = artifacts.require("Voting");

const [ownerId, voterId1, voterId2, voterId3, strangerId] = [0, 1, 2, 3, 4];

module.exports = {
  ownerId,
  voterId1,
  voterId2,
  voterId3,
  strangerId,
  workflow: [
    "RegisteringVoters",
    "ProposalsRegistrationStarted",
    "ProposalsRegistrationEnded",
    "VotingSessionStarted",
    "VotingSessionEnded",
    "VotesTallied",
  ],
  proposals: ["first proposal", "second proposal", "third proposal"],
  getMockVoters: (accounts) => {
    return {
      owner: accounts[ownerId],
      voter1: accounts[voterId1],
      voter2: accounts[voterId2],
      voter3: accounts[voterId3],
      stranger: accounts[strangerId],
    };
  },
  mockStartProposal: async (owner, voter1, voter2, voter3) => {
    votingInstance = await Voting.new({ from: owner });
    await votingInstance.addVoter(voter1, { from: owner });
    await votingInstance.addVoter(voter2, { from: owner });
    await votingInstance.addVoter(voter3, { from: owner });
    await votingInstance.startProposalsRegistering({
      from: owner,
    });
    return votingInstance;
  },
  mockEndProposal: async (votingInstance, owner, voter1, voter2, voter3) => {
    await votingInstance.addProposal("first proposal", {
      from: voter1,
    });
    await votingInstance.addProposal("second proposal", {
      from: voter2,
    });
    await votingInstance.addProposal("third proposal", {
      from: voter3,
    });
    await votingInstance.endProposalsRegistering({ from: owner });
    return votingInstance;
  },
  mockEndVoting: async (
    votingInstance,
    owner,
    voter1,
    voter2,
    voter3,
    otherId,
    winningId
  ) => {
    await votingInstance.startVotingSession({ from: owner });
    await votingInstance.setVote(otherId, {
      from: voter1,
    });
    await votingInstance.setVote(winningId, {
      from: voter2,
    });
    await votingInstance.setVote(winningId, {
      from: voter3,
    });
    await votingInstance.endVotingSession({
      from: owner,
    });
    return votingInstance;
  },
};
