const Voting = artifacts.require("Voting");

module.exports = function(deployer) {
  deployer.deploy(Voting, 100000, web3.utils.toWei("0.01", "ether"), ["0XA1", "0XB2", "0XC3"], {gas: 5000000});
};
