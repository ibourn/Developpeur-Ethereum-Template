const { assert, expect } = require("chai");
const { BN, expectRevert, expectEvent } = require("@openzeppelin/test-helpers");

const {
  workflow,
  getMockVoters,
  mockStartProposal,
  mockEndProposal,
  mockEndVoting,
} = require("./Test_VotingHelpers.js");

contract("Voting / Test_05", (accounts) => {
  const { owner, voter1, voter2, voter3, stranger } = getMockVoters(accounts);

  const curStatusId = 4;
  const nextStatusId = 5;
  const curStatus = workflow[curStatusId];
  const nextStatus = workflow[nextStatusId];

  const winningId = 2;
  const otherId = 1;
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
      votingInstance = await mockEndVoting(
        votingInstance,
        owner,
        voter1,
        voter2,
        voter3,
        otherId,
        winningId
      );
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

        // mocked context : more votes for proposal 2
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
