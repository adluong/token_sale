pragma solidity >=0.4.22 <0.8.0;

contract DappToken{
	uint256 public totalSupply;
	mapping(address => uint256) public balanceOf;
	//name of token
	string public name;
	//symbol of token
	string public symbol;
	//standard of token
	string public standard;

	//constructor
	//set total number of tokens
	//read the total number of tokens
	constructor(uint256 _initSupply) public{
		//balanceOf[0] is the balance of the admin
		balanceOf[msg.sender] = _initSupply;
		name	 = 'Luong Token';
		symbol   = 'LTC';
		standard = 'Luong Token standard v1.0';
	}

	//transfer token: exception if account does not have enough token, return a boolean and log transfer event
	function transfer(address _to, uint256 _value) public returns (bool success){
		//throw exception if account does not have enough token
		require(balanceOf[msg.sender] >= _value);
	}

	// function getTotalSupply() public returns (uint256){
	// 	return totalSupply;
	// }

}