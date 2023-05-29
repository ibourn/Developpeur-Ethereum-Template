// SPDX-License-Identifier: MIT

pragma solidity 0.8.20;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/proxy/Clones.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol";
import "./Voting2.sol";

/**
@notice This is the factory used to create voting contract clones frome Voting2
-only the admin can create new vote contract
-In this structure : 1 vote == 1 clone contract with its storage context
-Admin need to set the master Voting contract before cloning
*/
contract VotingFactory2 is Ownable {

  address public votingMasterAddress;
  address[] votingCloneAddresses;

  event VoteCreated(address newVotingContract);

  /**
  @notice allows to set the master voting addres from which votes will be cloned
  */
  function setVotingMasterAddress(address _votingMasterAddress) external onlyOwner {
    votingMasterAddress = _votingMasterAddress;
  }

  /**
  @notice function to create a new vote. One Vote == one clone contract with its storage context.
  @return the clone address, it allows with Ivoting2 or IVotingAdmin2 to participate to the vote
  */
  function createVotingContract(string calldata _name) external onlyOwner returns(address) {
    address votingClone = Clones.clone(votingMasterAddress);

    Voting2(votingClone).initialize(msg.sender, _name);  
    votingCloneAddresses.push(votingClone);

    emit VoteCreated(votingClone);
    return votingClone;
  }

  /**
  @notice getter to get the address of master voting contract
  @return address of current master voting contract
  */
  function getMasterVotingAddress() external view returns(address) {
      return votingMasterAddress;
  }

  /**
  @notice getter to get addresses of each vote created
  @return an array of clone addresses
  */
  function getVotingClonesAddresses() external view returns(address[] memory) {
      return votingCloneAddresses;
  }
}