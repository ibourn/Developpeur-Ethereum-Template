const { assert, expect } = require("chai");
const { BN, expectRevert, expectEvent } = require("@openzeppelin/test-helpers");

const {
  workflow,
  getMockVoters,
  mockStartProposal,
} = require("./Test_VotingHelpers.js");

contract("Voting / Test_03", (accounts) => {
  const { owner, voter1, voter2, voter3, stranger } = getMockVoters(accounts);

  const curStatusId = 1;
  const nextStatusId = 2;
  const curStatus = workflow[curStatusId];
  const nextStatus = workflow[nextStatusId];

  let votingInstance;

  describe(`${curStatus} status step`, () => {
    before(async () => {
      votingInstance = await mockStartProposal(owner, voter1, voter2, voter3);
    });

    describe(`checks that the new ${curStatus} status is valid`, () => {
      it(`checks current status is ${curStatus}`, async function () {
        const status = await votingInstance.workflowStatus.call({
          from: owner,
        });
        expect(status.toNumber()).to.equal(curStatusId);
      });

      it("checks that 'genesis' proposal has been created", async function () {
        const receipt = await votingInstance.getOneProposal(0, {
          from: voter1,
        });
        const proposal = receipt[0];
        expect(proposal).to.equal("GENESIS");
      });
    });

    describe("adding a proposal", () => {
      it("should revert for empty proposal", async function () {
        await expectRevert(
          votingInstance.addProposal("", { from: voter1 }),
          "Vous ne pouvez pas ne rien proposer"
        );
      });

      describe("adding proposals", () => {
        const testProposals = [
          //id:0 is the 'genesis' proposal
          { id: 1, content: "first proposal", sender: voter1 },
          { id: 2, content: "second proposal", sender: voter2 },
          { id: 3, content: "third proposal", sender: voter3 },
        ];
        testProposals.forEach(function (t) {
          it(`should emit 'ProposalRegistered' event for proposalId${t.id}`, async function () {
            const receipt = await votingInstance.addProposal(t.content, {
              from: t.sender,
            });
            expectEvent(receipt, "ProposalRegistered", {
              proposalId: new BN(t.id),
            });
          });

          it(`it should get '${t.content}' for ID ${t.id}`, async function () {
            const receipt = await votingInstance.getOneProposal(t.id, {
              from: voter1,
            });
            const proposal = receipt[0];
            expect(proposal).to.equal(t.content);
          });
        });
      });
    });

    describe("voter can't set vote", () => {
      it("should revert for voter1", async function () {
        await expectRevert(
          votingInstance.setVote(1, { from: voter1 }),
          "Voting session havent started yet"
        );
      });
    });
    describe("owner can't do these actions", () => {
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
          votingInstance.startVotingSession({ from: owner }),
          "Registering proposals phase is not finished"
        );
      });

      it(`sould revert for endVotingSession`, async function () {
        await expectRevert(
          votingInstance.endVotingSession({ from: owner }),
          "Voting session havent started yet"
        );
      });

      it(`sould revert for tallyVotes`, async function () {
        await expectRevert(
          votingInstance.tallyVotes({ from: owner }),
          "Current status is not voting session ended"
        );
      });
    });
  });
  describe("change to the next status", () => {
    beforeEach(async () => {
      votingInstance = await mockStartProposal(owner, voter1, voter2, voter3);
    });

    it(`checks owner change to ${nextStatus} status`, async function () {
      await votingInstance.endProposalsRegistering({
        from: owner,
      });
      const status = await votingInstance.workflowStatus.call({
        from: owner,
      });
      assert.equal(status, nextStatusId, "status should be changed");
    });

    it(`checks change to ${nextStatus} emit 'WorkflowStatusChange'`, async function () {
      const receipt = await votingInstance.endProposalsRegistering({
        from: owner,
      });
      expectEvent(receipt, "WorkflowStatusChange", {
        previousStatus: new BN(curStatusId),
        newStatus: new BN(nextStatusId),
      });
    });
  });
});
