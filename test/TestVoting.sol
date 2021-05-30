// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Voting.sol";

contract TestVoting {

    uint public initialBalance = 3 ether;

    function testInitialBalanceUsingDeployedContract() public {
        Voting voting = Voting(DeployedAddresses.Voting());
        uint expected = 100000;
        Assert.equal(
            voting.totalTokens(),
            expected,
            "total tokens should be 100000."
        );
    }

    function testBuyTokens() public {
        Voting voting = Voting(DeployedAddresses.Voting());
        voting.buy{value: 1 ether}();
        uint expected = 99900;
        Assert.equal(
            voting.tokenBalance(),
            expected,
            "Balance tokens should be 9900 after buy 1 ether."
        );
    }
}
