const { assert, expect } = require("chai");
const { workflow } = require("./TestConfig");
module.exports = {
  getValidStatusIndex: ({ statusName, expectedStatusIndex }) => {
    const index = workflow.indexOf(statusName);
    assert.equal(
      index,
      expectedStatusIndex,
      "status doesn't match the desired index of the test file."
    );
    return index;
  },
};
