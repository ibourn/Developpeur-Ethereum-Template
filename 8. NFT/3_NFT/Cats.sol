// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/*
si ancienne version de ERC721 chargé : requireMinted de ERC721URIStorage pas implémenté
dans ce cas importer ds remix erc721 dernière version
et remplacer avec import "../ERC721.sol";
OU
avec l'url github
*/
contract CatsNFT is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

		struct Cats{
			string size;
			string color;
		}
		Cats[] cats;

    constructor() ERC721 ("Cats", "CTS") {}

    function MintCats(address _player, string memory _tokenURI, string memory _size, string memory _color) public returns (uint256)
    {
        _tokenIds.increment();
				cats.push(Cats(_size, _colorr));
        uint256 newItemId = _tokenIds.current();
        _mint(_player, newItemId);
        _setTokenURI(newItemId, _tokenURI);

        return newItemId;
    }
}

/*
contract not safe (mint onlyOwner...)=> just usage of ipfs

tokenURI : cid des json 
baseURI : QmbC1rLqA5sfov6eShPYcmjzX7jKAXSVywqLPqkxLwMZbM

les cid permettent pour les collections de composer l'addresse
baseUrl + le hash du sous dossier + le tokenId

ici pour mint on indique l'url complete
https://aqua-solid-lark-269.mypinata.cloud/ipfs/QmbC1rLqA5sfov6eShPYcmjzX7jKAXSVywqLPqkxLwMZbM/1.json
ou
https://aqua-solid-lark-269.mypinata.cloud/ipfs/QmbC1rLqA5sfov6eShPYcmjzX7jKAXSVywqLPqkxLwMZbM/2.json

param dispo 
size : big, color : classic
size : small, color : multi 

pour exemple : ça plante... en réalité besoin de .img pour indiquer le chemin de l'image

*/