// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/introspection/ERC165.sol";

//contrat not safe : add require ... (only erc1155 a royaltie examples)
interface IERC2981Royalties {
    function royaltyInfo(uint256 _tokenId, uint256 _value) external view  returns (address _receiver, uint256 _royaltyAmount);
}

contract Royalties is IERC2981Royalties, ERC165{
    struct RoyaltyInfo {
        address recipient;
        uint24 amount;
    }

    mapping(uint256 => RoyaltyInfo) internal _royalties;

    function supportsInterface(bytes4 interfaceId) public view virtual override returns (bool) {
        return interfaceId == type(IERC2981Royalties).interfaceId || super.supportsInterface(interfaceId);
    }

    function _setTokenRoyalty( uint256 tokenId, address recipient, uint256 value) internal {
        require(value <= 10000, 'ERC2981Royalties: Too high');
        _royalties[tokenId] = RoyaltyInfo(recipient, uint24(value));
    }

    function royaltyInfo(uint256 tokenId, uint256 value) external view override returns (address receiver, uint256 royaltyAmount)
    {
        RoyaltyInfo memory royalties = _royalties[tokenId];
        receiver = royalties.recipient;
        royaltyAmount = (value * royalties.amount) / 10000;
    }
}

contract Cats1155 is ERC1155, Royalties {

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    struct Cats{
        string name;
        string size;
        string color;
    }
    Cats[] cats;

    //hash du dossier ipfs des json
    constructor() ERC1155("https://ipfs.io/QmbC1rLqA5sfov6eShPYcmjzX7jKAXSVywqLPqkxLwMZbM/{id}.json") {}

     function supportsInterface(bytes4 interfaceId) public view virtual override(ERC1155, Royalties) returns (bool){
        return super.supportsInterface(interfaceId);
    }

    function MintCats(address _player, string memory _name, string memory _size, string memory _color, uint _number) public returns (uint){
        _tokenIds.increment();
		cats.push(Cats(_name, _size, _color));
        uint256 newItemId = _tokenIds.current();
        _mint(_player, newItemId, _number, "");
        _setTokenRoyalty(newItemId, msg.sender, 1000);

        return newItemId;    
    }

    function init()public {
        MintCats(msg.sender, "cool cat", "big", "classic", 2*10**3 );
        MintCats(msg.sender, "psycho cat", "small", "multi", 10);
    }
}
