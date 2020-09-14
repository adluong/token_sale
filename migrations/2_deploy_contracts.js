var DappToken = artifacts.require("./DappToken.sol")	//artifact creates abstraction that vm can use
var DappTokenSale = artifacts.require("./DappTokenSale.sol")

module.exports = function(deployer){
	deployer.deploy(DappToken, 1000000);
	deployer.deploy(DappTokenSale, DappToken.address, 1000000000000000);
};