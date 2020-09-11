var DappToken = artifacts.require("./DappToken.sol")
/*
-it is related to jasmine framework, an open source testing framework for javascript
- below codes can be described as follows:
1. 
*/

contract('DappToken', function(accounts){

	it('initializes the contract with the correct values', function(){
		return DappToken.deployed().then(function(instance){
			tokenInstance = instance;
			return tokenInstance.name();
		}).then(function(name){
			assert.equal(name,'Luong Token', 'has the correct name');
			return tokenInstance.symbol();
		}).then(function(symbol){
			assert.equal(symbol, 'LTC', 'has the correct symbol');
			return tokenInstance.standard;
		}).then(function(standard){
			assert(standard, 'Luong Token v1.0', 'has the correct standard');
		});
	})

	it('allocate the initial supply upon deployment', function(){
		return DappToken.deployed().then(function(instance){
			tokenInstance = instance;
			return tokenInstance.balanceOf(accounts[0]);
		}).then(function(adminBalance){
			assert.equal(adminBalance.toNumber(), 1000000, 'allocate the initial supply to the admin account')
		});
	});

	
	//call method will not dirrectly create a transaction (not trigger the transaction) and it does not have
	//the return value
	it('transfer token ownership',function(){
		return DappToken.deployed().then(function(instance){
			tokenInstance = instance;
			//test 'require' statement first by transferring something larger than the sender's balance
			return tokenInstance.transfer.call(accounts[1],99999999999999);
		}).then(assert.fail).catch(function(error){
			assert(error.message.indexOf('revert') >= 0, 'error message must contain revert');
			return tokenInstance.transfer.call(accounts[1],100000, {from:accounts[0]});
		}).then(function(success){
			assert.equal(success, true, 'return true');
			return tokenInstance.transfer(accounts[1],100000,{from: accounts[0]});
		}).then(function(receipt){
			return tokenInstance.balanceOf(accounts[1]);
			assert.equal(receipt.logs.length, 1, 'triggers one event');
			assert.equal(receipt.logs[0].event, 'Transfer','should be the "Transfer" event');
			assert.equal(receipt.logs[0].args._from, accounts[0], 'logs the msg.sender');
			assert.equal(receipt.logs[0].args._to, accounts[1], 'logs the receipt');
			assert.equal(receipt.logs[0].args._value, 100000, 'logs the transfer amount');
		}).then(function(balance){
			assert.equal(balance.toNumber(), 100000, 'adds the amount to the receiving account');
			return tokenInstance.balanceOf(accounts[0]);
		}).then(function(balance){
			assert.equal(balance.toNumber(), 900000, 'deducts the amount from the sending account')
		});
	});

	it('approve tokens for delegated transfer', function(){
		return DappToken.deployed().then(function(instance){
			tokenInstance = instance;
			//call does not really execute the transaction, it just run it without writting in the blockchain
			return tokenInstance.approve.call(accounts[1],100);
		}).then(function(success){
			assert.equal(success, true, 'return approval, should be true');
			return tokenInstance.approve(accounts[1],100,{from: accounts[0]});
		}).then(function(receipt){
			assert.equal(receipt.logs.length, 1, 'triggers one event');
			assert.equal(receipt.logs[0].event, 'Approval','should be the "Transfer" event');
			assert.equal(receipt.logs[0].args._owner, accounts[0], 'logs the acccount the tokens are authorized by');
			assert.equal(receipt.logs[0].args._spender, accounts[1], 'logs the account the tokens are authorized to');
			assert.equal(receipt.logs[0].args._value, 100, 'logs the transfer amount');
			return tokenInstance.allowance(accounts[0], accounts[1]);
		}).then(function(allowance){
			assert.equal(allowance, 100, 'stores the allowance for delegaed transfer');
		});
	});

	it('hanldes delegated token transfer', function(){
		return DappToken.deployed().then(function(instance){
			tokenInstance = intstance;
			fromAccount = accounts[2];
			toAccount = accounts[3];
			spendingAccount = accounts[4];	//msg.sender
			//Transfer some tokens to fromAccount
			return tokenInstance.transfer(fromAccount, 100, {from: accounts[0]});
		}).then(function(receipt){
			//approve spendingAccount to spend 10 tokens from fromAccount
			return tokenInstance.approve(spendingAccount,10, {from: fromAccount});
		}).then(function(receipt){
			// transfer something larger than the spender balance
			return tokenInstance.transferFrom(fromAccount, toAccount, 200, {from: spendingAccount});
		}).then(assert.fail).catch(function(error){
			assert(error.message.indexOf('revert') >= 0, 'cannot transfer value larger than balance');
			//transfering something larger than the approved amount
			return tokenInstance.transferFrom(fromAccount, toAccount, 20, {from: spendingAccount});
		}).then(assert.fail).catch(function(error){
			assert(error.message.indexOf('revert') >= 0, 'cannot transfer value larger than approved amount');
			return tokenInstance.transferFrom.call(fromAccount, toAccount, 10, {from: spendingAccount});
		}).then(function(success){
			assert.equal(success, true);
			return tokenInstance.transferFrom(fromAccount, toAccount, 10, {from: spendingAccount});
		}).then(function(receipt){
			assert.equal(receipt.logs.length, 1, 'triggers one event');
			assert.equal(receipt.logs[0].event, 'Approval','should be the "Transfer" event');
			assert.equal(receipt.logs[0].args._owner, fromAccount, 'logs the acccount the tokens are authorized by');
			assert.equal(receipt.logs[0].args._spender, toAccount, 'logs the account the tokens are authorized to');
			assert.equal(receipt.logs[0].args._value, 10, 'logs the transfer amount');
			return tokenInstance.balanceOf(fromAccount);
		}).then(function(balance){
			assert.equal(balance.toNumber(),90,'deducts the amount from the sending account');
			return tokenInstance.balanceOf(toAccount);
		}).then(function(balance){
			assert.equal(balanceOf.toNumber(),10,'receives from the amount of sending account')
		});
	});
});