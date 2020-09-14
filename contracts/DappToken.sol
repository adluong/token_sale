pragma solidity >=0.4.22 <0.8.0;

contract DappToken{
	uint256 public totalSupply;
	mapping(address => uint256) public balanceOf;

	//allowance
	//first address is owner, second mapping will store the list of addresses that the owner approve
	mapping(address => mapping(address => uint256)) public allowance;
	//name of token
	string public name;
	//symbol of token
	string public symbol;
	//standard of token
	string public standard;
	
	//aprroval event
	//the owner of token will approve spender to spend an amount of value
	event Approval(
		address indexed _owner,
		address indexed _spender,
		uint256 _value
		);

	//transfer event
	event Transfer(
		address indexed _from,
		address indexed _to,
		uint256 _value
		);
	//constructor
	//set total number of tokens
	//read the total number of tokens
	constructor(uint256 _initSupply) public{
		//balanceOf[0] is the balance of the admin
		balanceOf[msg.sender] = _initSupply;
		totalSupply = _initSupply;
		name	 = 'Luong Token';
		symbol   = 'LTC';
		standard = 'Luong Token standard v1.0';
	}

	//transfer token: exception if account does not have enough token, return a boolean and log transfer event
	function transfer(address _to, uint256 _value) public returns (bool success){
		//throw exception if account does not have enough token
		require(balanceOf[msg.sender] >= _value);
		balanceOf[msg.sender] -= _value;
		balanceOf[_to] 		  += _value;

		//trigger a transfer event
		emit Transfer(msg.sender, _to, _value);

		//return a boolean value
		return true;
	}

	//approve function
	//i.e: i want to approve account B spend an amount of C token
	function approve(address _spender, uint256 _value) public returns(bool success){
		//allowance: how much i allow spender to spend
		allowance[msg.sender][_spender] += _value;

		//approve event
		emit Approval(msg.sender, _spender, _value);

		//return result
		return true;
	}

	//transfer from function: handle for delegated transfer(dai dien chuyen nhuong)
	function transferFrom(address _from, address _to, uint256 _value) public returns (bool success){
		//balance of mine must be bigger than _value
		require(balanceOf[_from] >= _value);
		//B calls this function and it requires my allowance is larger than _value
		require(allowance[_from][msg.sender] >= _value);
		// //change the balances
		balanceOf[_from] -= _value;
		balanceOf[_to]	 += _value;

		allowance[_from][msg.sender] -= _value;
		//transfer event
		emit Transfer(_from, _to, _value);

		// //return result
		return true;
	}

}