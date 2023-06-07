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

  const curStatus = workflow[4];
  const curStatusId = 4;
  const nextStatus = workflow[5];
  const nextStatusId = 5;

  let votingInstance;
  // describe("curent status", () => {
  // before(async () => {
  //   votingInstance = await Voting.new({ from: owner });
  //   await votingInstance.addVoter(voter1, { from: owner });
  //   await votingInstance.addVoter(voter2, { from: owner });
  //   await votingInstance.addVoter(voter3, { from: owner });
  //   await votingInstance.startProposalsRegistering({
  //     from: owner,
  //   });
  // });

  describe(`${curStatus} status step`, () => {
    nonExistingProposalId = 10;
    winningId = 2;
    otherId = 1;
    beforeEach(async () => {
      votingInstance = await Voting.new({ from: owner });
      await votingInstance.addVoter(voter1, { from: owner });
      await votingInstance.addVoter(voter2, { from: owner });
      await votingInstance.addVoter(voter3, { from: owner });
      await votingInstance.startProposalsRegistering({
        from: owner,
      });
      await votingInstance.addProposal("first propsoal", {
        from: voter1,
      });
      await votingInstance.addProposal("second proposal", {
        from: voter2,
      });
      await votingInstance.addProposal("third proposal", {
        from: voter3,
      });
      await votingInstance.endProposalsRegistering({
        from: owner,
      });
      await votingInstance.startVotingSession({
        from: owner,
      });
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
    });
    describe(`checks that the ${curStatus} status is valid`, () => {
      it(`checks status is ${curStatus}`, async function () {
        const status = await votingInstance.workflowStatus.call({
          from: owner,
        });
        expect(status.toNumber()).to.equal(curStatusId);
      });
      it(`checks change from ${curStatus} to ${nextStatus}`, async function () {
        await votingInstance.tallyVotes({
          from: owner,
        });
        const status = await votingInstance.workflowStatus.call({
          from: owner,
        });
        expect(status.toNumber()).to.equal(nextStatusId);
      });
      it(`checks change to ${nextStatus} emit 'WorkflowStatusChange'`, async function () {
        const receipt = await votingInstance.tallyVotes({
          from: owner,
        });
        expectEvent(receipt, "WorkflowStatusChange", {
          previousStatus: new BN(curStatusId),
          newStatus: new BN(nextStatusId),
        });
      });
      describe("tally actions", () => {
        beforeEach(async () => {
          await votingInstance.tallyVotes({
            from: owner,
          });
        });
        it("should set winningProposalID to 2", async function () {
          assert.equal(await votingInstance.winningProposalID(), winningId);
        });
      });
    });
    describe("voter can't do these actions", () => {
      beforeEach(async () => {
        await votingInstance.tallyVotes({
          from: owner,
        });
      });
      it("voter can't add proposal", async function () {
        await expectRevert(
          votingInstance.addProposal("new proposal", {
            from: voter1,
          }),
          "Proposals are not allowed yet"
        );
      });
      it("voter can't setVote", async function () {
        await expectRevert(
          votingInstance.setVote(otherId, {
            from: voter1,
          }),
          "Voting session havent started yet"
        );
      });
    });
    describe("owner can't do these actions", () => {
      beforeEach(async () => {
        await votingInstance.tallyVotes({
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
      it("sould revert for endProposalsRegistering", async function () {
        await expectRevert(
          votingInstance.endProposalsRegistering({ from: owner }),
          "Registering proposals havent started yet"
        );
      });
      it(`sould revert for startVotingSession`, async function () {
        await expectRevert(
          votingInstance.startVotingSession(),
          "Registering proposals phase is not finished"
        );
      });
      it(`sould revert for endVotingSession`, async function () {
        await expectRevert(
          votingInstance.endVotingSession(),
          "Voting session havent started yet"
        );
      });
    });
  });
});
