const { assert, expect } = require("chai");
const { expectRevert } = require("@openzeppelin/test-helpers");

const Voting = artifacts.require("Voting");
const {
  ownerId,
  voterId1,
  voterId2,
  voterId3,
  strangerId,
  workflow,
  getMockVoters,
} = require("./Test_VotingHelpers.js");

describe("Validation of test file data", async () => {
  describe("the 'workflow' array corresponds to the 'workflowStatus' enum", function () {
    const testStatus = [
      { status: "RegisteringVoters", expectedIndex: 0 },
      { status: "ProposalsRegistrationStarted", expectedIndex: 1 },
      { status: "ProposalsRegistrationEnded", expectedIndex: 2 },
      { status: "VotingSessionStarted", expectedIndex: 3 },
      { status: "VotingSessionEnded", expectedIndex: 4 },
      { status: "VotesTallied", expectedIndex: 5 },
    ];

    it("checks workflow has 6 statuses", function () {
      const statusCount = workflow.length;
      assert.equal(statusCount, 6, `workflow should have 6 statuses`);
    });

    testStatus.forEach(function (t) {
      it(`checks ${t.status} has workflow index : ${t.expectedIndex}`, function () {
        assert.equal(workflow.indexOf(t.status), t.expectedIndex);
      });
    });
  });

  describe("account indexes of owner and stranger are unique", function () {
    const testIndexes = [
      { firstId: ownerId, secondId: voterId1, name: "owner and voter1" },
      { firstId: ownerId, secondId: voterId2, name: "owner and voter2" },
      { firstId: ownerId, secondId: voterId3, name: "owner and voter3" },
      { firstId: ownerId, secondId: strangerId, name: "owner and stranger" },
      { firstId: strangerId, secondId: voterId1, name: "stranger and voter1" },
      { firstId: strangerId, secondId: voterId2, name: "stranger and voter2" },
      { firstId: strangerId, secondId: voterId3, name: "stranger and voter3" },
    ];

    testIndexes.forEach(function (t) {
      it(`checks ${t.name} have different indexes`, function () {
        assert.notEqual(t.firstId, t.secondId);
      });
    });
  });
});

contract("Voting / Test_01", (accounts) => {
  const { owner, voter1, stranger } = getMockVoters(accounts);
  let votingInstance;

  beforeEach(async () => {
    votingInstance = await Voting.new({ from: owner });
  });

  describe("After Deployment", async () => {
    it("checks workflowStatus is RegisteringVoters", async () => {
      assert.equal(await votingInstance.workflowStatus(), 0);
    });

    it("has an admin : the owner", async () => {
      expect(await votingInstance.owner()).to.be.equal(owner);
    });

    it("has a winnerID of 0", async () => {
      assert.equal(await votingInstance.winningProposalID(), 0);
    });
  });

  describe("functions access", async () => {
    describe("Non owner can't perfom admin actions", async () => {
      it("non owner can't addVoter", async () => {
        await expectRevert(
          votingInstance.addVoter(voter1, { from: stranger }),
          "Ownable: caller is not the owner"
        );
      });

      it("non owner can't startProposalsRegistration", async () => {
        await expectRevert(
          votingInstance.startProposalsRegistering({ from: stranger }),
          "Ownable: caller is not the owner"
        );
      });

      it("non owner can't endProposalsRegistration", async () => {
        await expectRevert(
          votingInstance.endProposalsRegistering({ from: stranger }),
          "Ownable: caller is not the owner"
        );
      });

      it("non owner can't startVotingSession", async () => {
        await expectRevert(
          votingInstance.startVotingSession({ from: stranger }),
          "Ownable: caller is not the owner"
        );
      });

      it("non owner can't endVotingSession", async () => {
        await expectRevert(
          votingInstance.endVotingSession({ from: stranger }),
          "Ownable: caller is not the owner"
        );
      });

      it("non owner can't tallyVotes", async () => {
        await expectRevert(
          votingInstance.tallyVotes({ from: stranger }),
          "Ownable: caller is not the owner"
        );
      });
    });

    describe("Non Voter can't perform voter actions", async () => {
      it("non voter can't get voter", async () => {
        await expectRevert(
          votingInstance.getVoter(owner, { from: stranger }),
          "You're not a voter"
        );
      });

      it("non voter can't get proposal", async () => {
        await expectRevert(
          votingInstance.getOneProposal(0, { from: stranger }),
          "You're not a voter"
        );
      });

      it("non voter can't addProposal", async () => {
        await expectRevert(
          votingInstance.addProposal("new proposal", { from: stranger }),
          "You're not a voter"
        );
      });

      it("non voter can't vote", async () => {
        await expectRevert(
          votingInstance.setVote(0, { from: stranger }),
          "You're not a voter"
        );
      });
    });
  });
});
