const { assert, expect } = require("chai");
const { BN, expectRevert, expectEvent } = require("@openzeppelin/test-helpers");
const constants = require("@openzeppelin/test-helpers/src/constants");
const { contracts_build_directory } = require("../truffle-config");
// const { it, describe } = require("node:test");
const Voting = artifacts.require("Voting");
const {
  ownerId,
  voterId1,
  voterId2,
  voterId3,
  strangerId,
  workflow,
} = require("../testHelpers/TestConfig.js");
const { getValidStatusIndex } = require("../testHelpers/TestHelpers.js");

let winnigProposalID;
let workflowStatus;

contract("Voting", (accounts) => {
  const owner = accounts[ownerId];
  const voter1 = accounts[voterId1];
  const voter2 = accounts[voterId2];
  const voter3 = accounts[voterId3];
  const stranger = accounts[strangerId];

  const curStatus = workflow[0];
  const curStatusId = 0;
  const nextStatus = workflow[1];
  const nextStatusId = 1;

  let votingInstance;
  beforeEach(async () => {
    votingInstance = await Voting.new({ from: owner });
  });

  describe(`${curStatus} status step`, () => {
    it(`checks current status is ${curStatus}`, async function () {
      const status = await votingInstance.workflowStatus.call({ from: owner });
      expect(status.toNumber()).to.equal(curStatusId);
    });

    describe("adding a voter", () => {
      it("should emit 'VoterRegistered' event", async function () {
        const receipt = await votingInstance.addVoter(voter1, {
          from: owner,
        });
        expectEvent(receipt, "VoterRegistered", { voterAddress: voter1 });
      });

      it("should set isRegistered to true for voter1", async function () {
        const receipt = await votingInstance.addVoter(voter1, {
          from: owner,
        });
        const voter = await votingInstance.getVoter(voter1, { from: voter1 });
        expect(voter.isRegistered).to.equal(true);
      });

      it("should revert when adding voter1 two times", async function () {
        await votingInstance.addVoter(voter1, { from: owner });
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
      //   it(`checks owner can't call startProposalsRegistering`, async function () {
      //     await expectRevert(
      //       votingInstance.startProposalsRegistering(),
      //       "Registering proposals cant be started now"
      //     );
      //   });
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
      //   it(`checks owner can call startProposalsRegistering`, async function () {
      //     let receipt = await votingInstance.tallyVotes();
      //     expectEvent(receipt, "WorkflowStatusChange", {
      //       previousStatus: 0,
      //       newStatus: 1,
      //     });
      //   });
    });
  });
  describe("change to the next status", () => {
    it(`checks owner change to ${nextStatus} status`, async function () {
      const receipt = await votingInstance.startProposalsRegistering({
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
//   });
// });
