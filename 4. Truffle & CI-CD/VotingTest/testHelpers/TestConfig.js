const { assert, expect } = require("chai");

module.exports = {
  ownerId: 0,
  voterId1: 1,
  voterId2: 2,
  voterId3: 3,
  strangerId: 4,
  workflow: [
    "RegisteringVoters",
    "ProposalsRegistrationStarted",
    "ProposalsRegistrationEnded",
    "VotingSessionStarted",
    "VotingSessionEnded",
    "VotesTallied",
  ],
  proposals: ["first proposal", "second proposal", "third proposal"],

  // export {
  //   ownerId,
  //   voterId1,
  //   voterId2,
  //   voterId3,
  //   strangerId,
  //   workflow,
  //   proposals,
  //   getValidStatusIndex,
  // };
};
