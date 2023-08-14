// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;
 
import '../node_modules/@openzeppelin/contracts/token/ERC20/IERC20.sol';
 
contract MyDeFiProject {
	IERC20 link;
 
	constructor(address linkAddress) {
		// injecter l'address du token Dai à utiliser
		link = IERC20(linkAddress);
	}
 
	// fonction qui permet d'effectuer un transfer de dai vers le recipient
	function foo(address recipient, uint amount) external {
		// quelques instructions
		link.transfer(recipient, amount);
	}
}