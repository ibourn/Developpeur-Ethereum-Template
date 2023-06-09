const { assert, expect } = require("chai");
const { BN, expectRevert, expectEvent } = require("@openzeppelin/test-helpers");

const {
  workflow,
  getMockVoters,
  mockStartProposal,
  mockEndProposal,
} = require("./Test_VotingHelpers.js");

contract("Voting / Test_04", (accounts) => {
  const { owner, voter1, voter2, voter3, stranger } = getMockVoters(accounts);

  const preStatusId = 2;
  const curStatusId = 3;
  const nextStatusId = 4;
  const preStatus = workflow[preStatusId]; //ProposalsRegistrationEnded
  const curStatus = workflow[curStatusId];
  const nextStatus = workflow[nextStatusId];

  const nonExistingProposalId = 10;
  let votingInstance;

  describe(`${curStatus} status step`, () => {
    beforeEach(async () => {
      votingInstance = await mockStartProposal(owner, voter1, voter2, voter3);
      votingInstance = await mockEndProposal(
        votingInstance,
        owner,
        voter1,
        voter2,
        voter3
      );
    });
    describe(`checks that the ${curStatus} status is valid`, () => {
      it(`checks status is ${preStatus}`, async function () {
        const status = await votingInstance.workflowStatus.call({
          from: owner,
        });
        expect(status.toNumber()).to.equal(preStatusId);
      });
      it(`checks change from ${preStatus} to ${curStatus}`, async function () {
        await votingInstance.startVotingSession({
          from: owner,
        });
        const status = await votingInstance.workflowStatus.call({
          from: owner,
        });
        expect(status.toNumber()).to.equal(curStatusId);
      });
      it(`checks change to ${curStatus} emit 'WorkflowStatusChange'`, async function () {
        const receipt = await votingInstance.startVotingSession({
          from: owner,
        });
        expectEvent(receipt, "WorkflowStatusChange", {
          previousStatus: new BN(preStatusId),
          newStatus: new BN(curStatusId),
        });
      });

      const testProposals = [0, 1, 2, 3];
      testProposals.forEach(function (t) {
        it(`checks that the ${t} proposal has no vote`, async function () {
          const receipt = await votingInstance.getOneProposal(t, {
            from: voter1,
          });
          const voteCount = receipt[1];
          expect(voteCount).to.not.equal(0);
        });
      });
      const testVoters = [voter1, voter2, voter3];
      testVoters.forEach(function (t) {
        it(`checks that the ${t} voter has no voted proposal`, async function () {
          const receipt = await votingInstance.getVoter(t, {
            from: voter1,
          });
          const votedProposal = receipt[2];
          expect(votedProposal).to.not.equal(0);
        });
      });
    });

    describe("vote actions", () => {
      beforeEach(async () => {
        await votingInstance.startVotingSession({
          from: owner,
        });
      });
      describe("voter can set vote", () => {
        it("should emit 'Voted' event", async function () {
          const receipt = await votingInstance.setVote(1, {
            from: voter1,
          });
          expectEvent(receipt, "Voted", {
            voter: voter1,
            proposalId: new BN(1),
          });
        });
        it("should set votedProposalID to 1 for voter1", async function () {
          const receipt = await votingInstance.setVote(1, {
            from: voter1,
          });
          const voter = await votingInstance.getVoter(voter1, { from: voter1 });
          expect(voter.votedProposalId).to.equal("1");
        });
        it("should set hasVoted to true for voter1", async function () {
          const receipt = await votingInstance.setVote(1, {
            from: voter1,
          });
          const voter = await votingInstance.getVoter(voter1, { from: voter1 });
          expect(voter.hasVoted).to.equal(true);
        });
        it("should set voteCount to 1 for proposal 1", async function () {
          const receipt = await votingInstance.setVote(1, {
            from: voter1,
          });
          const proposal = await votingInstance.getOneProposal(1, {
            from: voter1,
          });
          expect(proposal[1]).to.equal("1");
        });
      });
      describe("setVote revert cases", () => {
        it("should revert for voter1 voting twice", async function () {
          await votingInstance.setVote(1, {
            from: voter1,
          });
          await expectRevert(
            votingInstance.setVote(2, { from: voter1 }),
            "You have already voted"
          );
        });
        it("should revert for voter1 voting for a non existing proposal", async function () {
          await expectRevert(
            votingInstance.setVote(nonExistingProposalId, { from: voter1 }),
            "Proposal not found"
          );
        });
      });
    });
    describe("voter can't had proposal", () => {
      beforeEach(async () => {
        await votingInstance.startVotingSession({
          from: owner,
        });
      });
      it("should revert for voter1 adding proposal", async function () {
        await expectRevert(
          votingInstance.addProposal("new proposal", { from: voter1 }),
          "Proposals are not allowed yet"
        );
      });
    });
    describe("owner can't do these actions", () => {
      beforeEach(async () => {
        await votingInstance.startVotingSession({
          from: owner,
        });
      });
      it("sould revert for adding Voter", async function () {
        await expectRevert(
          votingInstance.addVoter(stranger, { from: owner }),
          "Voters registration is not open yet"
        );
      });
      it("sould revert for starting proposals registering", async function () {
        await expectRevert(
          votingInstance.startProposalsRegistering({ from: owner }),
          "Registering proposals cant be started now"
        );
      });
      it(`sould revert for startVotingSession`, async function () {
        await expectRevert(
          votingInstance.startVotingSession(),
          "Registering proposals phase is not finished"
        );
      });
      it(`sould revert for tallyVotes`, async function () {
        await expectRevert(
          votingInstance.tallyVotes(),
          "Current status is not voting session ended"
        );
      });
    });

    describe("change to the next status", () => {
      beforeEach(async () => {
        await votingInstance.startVotingSession({
          from: owner,
        });
      });
      it(`checks owner change to ${nextStatus} status`, async function () {
        const receipt = await votingInstance.endVotingSession({
          from: owner,
        });
        const status = await votingInstance.workflowStatus.call({
          from: owner,
        });
        assert.equal(status, nextStatusId, "status should be changed");
      });
      it(`checks change to ${nextStatus} emit 'WorkflowStatusChange'`, async function () {
        const receipt = await votingInstance.endVotingSession({
          from: owner,
        });
        expectEvent(receipt, "WorkflowStatusChange", {
          previousStatus: new BN(curStatusId),
          newStatus: new BN(nextStatusId),
        });
      });
    });
  });
});
