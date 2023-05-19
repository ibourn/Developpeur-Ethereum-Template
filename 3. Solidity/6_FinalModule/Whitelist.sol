// SPDX-License-Identifier: GPL-3.0

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol";

pragma solidity 0.8.19;

contract Whitelist is Ownable {

    mapping(address => bool) whitelist;
    mapping(address => bool) blacklist;

    event Authorized(address _address);
    event Banned(address _address);

    modifier notListed(address _address) {
        require(!blacklist[_address], "Already banned");
        require(!whitelist[_address], "Already authorized");
        _;
    }
    
    function authorize(address _address) public onlyOwner notListed(_address) {
        // require(!blacklist[_address], "Already banned");
        // require(!whitelist[_address], "Already authorized");
        whitelist[_address] = true;

        emit Authorized(_address);
    }

    //FinalModule   
    function unAuthorize(address _address) public onlyOwner notListed(_address) {
        // require(!blacklist[_address], "Already banned");
        // require(!whitelist[_address], "Already authorized");
        blacklist[_address] = true;

        emit Banned(_address);
    }

    function isWhitelisted(address _address) public view returns(bool) {
        return whitelist[_address];
    }

    function isBlacklisted(address _address) public view returns(bool) {
        return blacklist[_address];
    }

}