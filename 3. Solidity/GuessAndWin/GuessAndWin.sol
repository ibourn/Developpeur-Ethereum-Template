// SPDX-License-Identifier: GPL-3.0

import "@openzeppelin/contracts/access/Ownable.sol";

pragma solidity 0.8.20;

/* As extra it's asked to add a reset function :
another option : mapping(add => bool[]) to keep track of the guesses and to avoid a loop on 
the mapping with an index of the addesses, allowing to only adjust the array length
of users wanting to guess. And thus users could contribute to the gas cost of this process

The game is not secure as the solution is in clear, a weak solution would be to hash the solution
and to compare the hash of the solution with the hash of the word guessed.
An we could use a commit and reveal strategy to avoid the solution to be known by the contract.
*/
/* perso reminder about 1h45 of which 45 minutes of research on commit and reveal strategy
*/
contract GuessAndWin is Ownable {

    address private winner;
    uint private gameCount;
    string private wordToGuess;
    string private clue;
    bool private gameStarted;

    mapping(address => bool) guesses;
    address[] guessers;

    modifier onlyWhenOpen() {
        require(gameStarted, "Game not ready, needing new word to guess.");
        _;
    }

    modifier onlyWhenClosed() {
        require(!gameStarted, "Can not reset a game in progress.");
        _; 
    }

    function getClue() external view onlyWhenOpen returns(string memory) {
        return clue;
    }

    function getWinner() external view returns(address) {
        return winner;
    }

    function resetGame() public onlyOwner onlyWhenClosed {
        winner = address(0);
        wordToGuess = "";
        clue = "";
        _resetGuesses();
    }

    function setWordAndClue(string memory _wordToGuess, string memory _clue)
    external 
    onlyOwner 
    onlyWhenClosed 
    {
        require(winner == address(0), "Need to reset, before creating a new game.");
        wordToGuess = _wordToGuess;
        clue = _clue;
        gameStarted = true;
        gameCount++;
    }

    function guess(string memory _word) external onlyWhenOpen returns(bool) {
        require(!guesses[msg.sender], "Already guessed");

        guessers.push(msg.sender);
        guesses[msg.sender] = true;

        return _isGuessed(_word);
    }

    function _isGuessed(string memory _word) private returns(bool) {
        bool won = keccak256(abi.encodePacked(_word)) == keccak256(abi.encodePacked(wordToGuess));
        if (won) {
            winner = msg.sender;
            gameStarted = false;
        }
        return won;
    }

    function _resetGuesses() private {
        for (uint i = (guessers.length); i > 0 ; i--) {
            guesses[guessers[i-1]] = false;
            guessers.pop();
        }
    }
    //CORRECTION : use delete with array. Delete delete the array => size = 0 ([])
    //it's different from delete with an index : in this case it's just the value that is set to 0 (index is freed) and so the need to pop

}
     
     
