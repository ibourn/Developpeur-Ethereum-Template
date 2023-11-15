// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

// importing the ERC-721 contract to deploy for an artist
import "./openzeppelin/ERC721.sol";
import "./openzeppelin/Counters.sol";

/*
exemple cours : pour set name et symbol ds la factory pour l'artiste : Cyril modif erc721
en mettant erc721 : name et symbol internal au lieu de private

*/
contract ArtistCollection is ERC721 {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    constructor() ERC721 ("", "") {}

    function init(string calldata name_, string calldata symbol_) external {
        require(bytes(name()).length == 0 && bytes(symbol()).length == 0, "Already initialized");
        _name = name_;
        _symbol = symbol_;
    }
}