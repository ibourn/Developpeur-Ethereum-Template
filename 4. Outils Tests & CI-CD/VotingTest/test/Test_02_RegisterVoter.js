const { assert, expect } = require("chai");
const { BN, expectRevert, expectEvent } = require("@openzeppelin/test-helpers");

const Voting = artifacts.require("Voting");
const { getMockVoters, workflow } = require("./Test_VotingHelpers.js");

contract("Voting / Test_02", (accounts) => {
  const { owner, voter1, voter2 } = getMockVoters(accounts);

  const curStatusId = 0;
  const nextStatusId = 1;
  const curStatus = workflow[curStatusId];
  const nextStatus = workflow[nextStatusId];

  let votingInstance;

  beforeEach(async () => {
    votingInstance = await Voting.new({ from: owner });
  });

  describe(`${curStatus} status step`, () => {
    let receipt;

    it(`checks current status is ${curStatus}`, async function () {
      const status = await votingInstance.workflowStatus.call({ from: owner });
      expect(status.toNumber()).to.equal(curStatusId);
    });

    it("should revert to get Voter1 when Voter1 not registered", async function () {
      await expectRevert(
        votingInstance.getVoter(voter1, { from: voter1 }),
        "You're not a voter"
      );
    });

    it("checks voter2 is not registered", async function () {
      await votingInstance.addVoter(voter1, { from: owner });
      const voter = await votingInstance.getVoter(voter2, { from: voter1 });
      expect(voter.isRegistered).to.equal(false);
    });

    describe("adding a voter", () => {
      beforeEach(async () => {
        receipt = await votingInstance.addVoter(voter1, { from: owner });
      });

      it("should emit 'VoterRegistered' event", async function () {
        expectEvent(receipt, "VoterRegistered", { voterAddress: voter1 });
      });

      it("should set isRegistered to true for voter1", async function () {
        const voter = await votingInstance.getVoter(voter1, { from: voter1 });
        expect(voter.isRegistered).to.equal(true);
      });

      it("should revert when adding voter1 two times", async function () {
        await expectRevert(
          votingInstance.addVoter(voter1, { from: owner }),
          "Already registered"
        );
      });
    });

    it("checks there's no proposals", async function () {
      await votingInstance.addVoter(voter1, { from: owner });
      await expectRevert(
        votingInstance.getOneProposal(0, { from: voter1 }),
        "revert"
      );
    });

    describe("voter can't add proposal or setVote", () => {
      it(`checks voter can't call addProposal`, async function () {
        await votingInstance.addVoter(voter1, { from: owner });
        await expectRevert(
          votingInstance.addProposal("first proposal", { from: voter1 }),
          "Proposals are not allowed yet"
        );
      });

      it(`checks voter can't call setVote`, async function () {
        await votingInstance.addVoter(voter1, { from: owner });
        await expectRevert(
          votingInstance.setVote(1, { from: voter1 }),
          "Voting session havent started yet"
        );
      });
    });

    describe("owner can't go beyond startProposalsRegistering() step", () => {
      it(`checks owner can't call endProposalsRegistering`, async function () {
        await expectRevert(
          votingInstance.endProposalsRegistering(),
          "Registering proposals havent started yet"
        );
      });

      it(`checks owner can't call startVotingSession`, async function () {
        await expectRevert(
          votingInstance.startVotingSession(),
          "Registering proposals phase is not finished"
        );
      });

      it(`checks owner can't call endVotingSession`, async function () {
        await expectRevert(
          votingInstance.endVotingSession(),
          "Voting session havent started yet"
        );
      });

      it(`checks owner can't call tallyVotes`, async function () {
        await expectRevert(
          votingInstance.tallyVotes(),
          "Current status is not voting session ended"
        );
      });
    });
  });

  describe("change to the next status", () => {
    it(`checks owner change to ${nextStatus} status`, async function () {
      await votingInstance.startProposalsRegistering({
        from: owner,
      });
      const status = await votingInstance.workflowStatus.call({
        from: owner,
      });
      assert.equal(status, nextStatusId, "status should be changed");
    });

    it(`checks change to ${nextStatus} emit 'WorkflowStatusChange'`, async function () {
      const receipt = await votingInstance.startProposalsRegistering({
        from: owner,
      });
      expectEvent(receipt, "WorkflowStatusChange", {
        previousStatus: new BN(curStatusId),
        newStatus: new BN(nextStatusId),
      });
    });
  });
});
