pragma solidity >=0.4.22 <0.8.0;

contract DappToken{
	uint256 public totalSupply;
	//constructor
	//set total number of tokens
	//read the total number of tokens
	constructor() public{
		totalSupply = 1000000;
	}

	// function getTotalSupply() public returns (uint256){
	// 	return totalSupply;
	// }

}