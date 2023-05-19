// SPDX-License-Identifier: GPL-3.0

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol";

pragma solidity 0.8.19;

contract WhitelistEnum is Ownable {

    enum Status {NONE, WHITELISTED, BLACKLISTED}

    mapping(address => Status) status;

    event Authorized(address _address);
    event Banned(address _address);

    modifier notListed(address _address) {
        require(status[_address] == Status.NONE, "Already listed");
        _;
    }
    
    function authorize(address _address) public onlyOwner notListed(_address) {
        status[_address] = Status.WHITELISTED;

        emit Authorized(_address);
    }
 
    function unAuthorize(address _address) public onlyOwner notListed(_address) {
        status[_address] = Status.BLACKLISTED;

        emit Banned(_address);
    }

    function isWhitelisted(address _address) public view returns(bool) {
        return status[_address] == Status.WHITELISTED;
    }

    function isBlacklisted(address _address) public view returns(bool) {
        return status[_address] == Status.BLACKLISTED;
    }

}