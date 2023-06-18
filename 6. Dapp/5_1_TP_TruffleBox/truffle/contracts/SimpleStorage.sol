// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract SimpleStorage {

  event ValueChanged(uint256 newValue);
  event TextChanged(string newText);

  uint256 value;
  //exo 5.1.2:
  string greeter;

  function read() public view returns (uint256) {
    return value;
  }

  function write(uint256 newValue) public {
    value = newValue;
    //tp 5.1.3:
    emit ValueChanged(newValue);
  }

  //exo 5.1.2:
function greet() public view returns (string memory) {
    return greeter;
  }

  function setGreet(string memory _greeter) public {
    greeter = _greeter;
    //tp 5.1.3:
    emit TextChanged(_greeter);
  }
}
