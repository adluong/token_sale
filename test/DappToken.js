var DappToken = artifacts.require("./DappToken.sol")
/*
-it is related to jasmine framework, an open source testing framework for javascript
- below codes can be described as follows:
1. 
*/

contract('DappToken', function(accounts){

	// it('initializes the contract with the correct values', function(){
	// 	return DappToken.deployed().then(function(instance){
	// 		tokenInstance = instance;
	// 		return tokenInstance.name();
	// 	}).then(function(name){
	// 		assert.equal(name,'Luong Token', 'has the correct name');
	// 		return tokenInstance.symbol();
	// 	}).then(function(symbol){
	// 		assert.equal(symbol, 'LTC', 'has the correct symbol');
	// 		return tokenInstance.standard;
	// 	}).then(function(standard){
	// 		assert(standard, 'Luong Token v1.0', 'has the correct standard');
	// 	});
	// })

	// it('allocate the initial supply upon deployment', function(){
	// 	return DappToken.deployed().then(function(instance){
	// 		tokenInstance = instance;
	// 		return tokenInstance.balanceOf(accounts[0]);
	// 	}).then(function(adminBalance){
	// 		assert.equal(adminBalance.toNumber(), 1000000, 'allocate the initial supply to the admin account')
	// 	});
	// });

	
	it('transfer token ownership',function(){
		return DappToken.deployed().then(function(instance){
			tokenInstance = instance;
			//test 'require' statement first by transferring something larger than the sender's balance
			return tokenInstance.transfer.call(accounts[1],99999999999999);
		}).then(assert.fail).catch(function(error){
			assert(error.message.indexOf('revert') >= 0, 'error message must contain revert');
			return tokenInstance.transfer(accounts[1],100000,{from: accounts[0]});
		}).then(function(receipt){
			return tokenInstance.balanceOf(accounts[1]);
		}).then(function(balance){
			assert.equal(balance.toNumber(), 100000, 'adds the amount to the receiving account');
			return tokenInstance.balanceOf(accounts[0]);
		}).then(function(balance){
			assert.equal(balance.toNumber(), 900000, 'deducts the amount from the sending account')
		});
	});
})