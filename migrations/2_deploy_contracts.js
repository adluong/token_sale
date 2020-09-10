var DappToken = artifacts.require("./DappToken.sol")	//artifact creates abstraction that vm can use

module.exports = function(deployer){
	deployer.deploy(DappToken);
};