const Voting = artifacts.require("Voting");

contract("Voting", accounts => {
    it("should buy 100 Token in the first account", async () => {
        const instance = await Voting.deployed();
        await instance.buy({from: accounts[0], value: 1000000000000000000});
        const tokenSold = await instance.tokenSold.call();

        const userBuyArray = await instance.voterDetails(accounts[0]);
        const userBuy = userBuyArray[0].toString();
        assert.equal(tokenSold.valueOf(), 100, "token should be 100");
        assert.equal(userBuy.valueOf(), 100, "token should be 100");
    });

    it("should vote in the first account", async () => {
        const instance = await Voting.deployed();
        await instance.buy({from: accounts[0], value: 1000000000000000000});
        await instance.voteForCandidate("0xa1", 10);
        const arr = await instance.voterDetails(accounts[0]);
        const voteNum = arr[1][0].toString();
        assert.equal(voteNum.valueOf(), 10, "token 10");
    });
})