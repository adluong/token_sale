var DappToken = artifacts.require("./DappToken.sol")
/*
-it is related to jasmine framework, an open source testing framework for javascript
- below codes can be described as follows:
1. 
*/

contract('DappToken', function(accounts){
	it('sets the total supply upon deployment', function(){
		return DappToken.deployed().then(function(instance){
			tokenInstance = instance;
			return tokenInstance.totalSupply();
		}).then(function(totalSupply) {
			assert.equal(totalSupply.toNumber(), 1000000, 'sets the toal supply to 1,000,000')
		});
	});
})