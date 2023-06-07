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

  const preStatus = workflow[2]; //ProposalsRegistrationEnded
  const preStatusId = 2;
  const curStatus = workflow[3];
  const curStatusId = 3;
  const nextStatus = workflow[4];
  const nextStatusId = 4;

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
    //   describe("adding a proposal", () => {
    //     it("should revert for empty proposal", async function () {
    //       await expectRevert(
    //         votingInstance.addProposal("", { from: voter1 }),
    //         "Vous ne pouvez pas ne rien proposer"
    //       );
    //     });
    //     describe("adding proposals", () => {
    //       const testProposals = [
    //         //id:0 is the 'genesis' proposal
    //         { id: 1, content: "first proposal", sender: voter1 },
    //         { id: 2, content: "second proposal", sender: voter2 },
    //         { id: 3, content: "third proposal", sender: voter3 },
    //       ];
    //       testProposals.forEach(function (t) {
    //         it(`should emit 'ProposalRegistered' event for proposalId${t.id}`, async function () {
    //           const receipt = await votingInstance.addProposal(t.content, {
    //             from: t.sender,
    //           });
    //           expectEvent(receipt, "ProposalRegistered", {
    //             proposalId: new BN(t.id),
    //           });
    //         });

    //         it(`it should get '${t.content}' for ID ${t.id}`, async function () {
    //           const receipt = await votingInstance.getOneProposal(t.id, {
    //             from: voter1,
    //           });
    //           const proposal = receipt[0];
    //           //console.log(proposal);
    //           //get the value of description
    //           expect(proposal).to.equal(t.content);
    //         });
    //       });
    //     });
    //   });
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
