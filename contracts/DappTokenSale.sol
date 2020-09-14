pragma solidity ^0.5.1;
import "./DappToken.sol";
//token sale contract
contract DappTokenSale{

	address payable admin;
	DappToken public tokenContract;
	uint256 public tokenPrice;
	uint256 public tokensSold;

	event Sell(address _buyer, uint256 _amount);
	
	//constructor
	constructor(DappToken _tokenContract, uint256 _tokenPrice) public{
		admin = msg.sender;
		tokenContract = _tokenContract;
		tokenPrice = _tokenPrice;
	}

	function multiply(uint256 x, uint256 y) internal pure returns (uint256 z){
		require(y==0 || (z=x*y)/y == x);
	}


	function buyTokens(uint256 _numberOfTokens) public payable{
		require(msg.value == multiply(_numberOfTokens,tokenPrice));
		//balance of this token sell contract must be larger than the number of tokens gonna be sold
		require(tokenContract.balanceOf(address(this)) >= _numberOfTokens);
		//require transfer success
		require(tokenContract.transfer(msg.sender, _numberOfTokens));

		//keep track of tokenSold
		tokensSold += _numberOfTokens;

		//emit sell event
		emit Sell(msg.sender, _numberOfTokens);
	}

	//ending token sale
	function endSale() public {
		//require admin
		require(msg.sender == admin);
		//transfer remaining dapp tokens to admin
		// require(tokenContract.transfer(admin, tokenContract.balanceOf(address(this))));
		require(tokenContract.transfer(admin, 7499));
		//destroy contract
		selfdestruct(admin);
	}
}