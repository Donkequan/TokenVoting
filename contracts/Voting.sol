// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

contract Voting{
    struct voter{
        address voteAdress;
        uint256 tokenNum;
        uint256[] tokensVoteforCandidates;
    }

    uint256 public totalTokens;
    uint256 public tokenBalance;
    uint256 public tokenPrice;
    bytes32[] public candidateList;
    mapping(bytes32=>uint256) public votesReceived;
    mapping(address=>voter) public voterInfor;

    constructor(uint256 totalSupply, uint256 price, bytes32[] memory candidateNames){
        totalTokens = totalSupply;
        tokenBalance = totalSupply;
        tokenPrice = price;
        candidateList = candidateNames;
    }

    function buy() payable public returns(uint256){
        uint256 tokenToBuy = msg.value / tokenPrice;
        require(tokenToBuy <= tokenBalance);
        voterInfor[msg.sender].voteAdress = msg.sender;
        voterInfor[msg.sender].tokenNum += tokenToBuy;
        tokenBalance -= tokenToBuy;
        return tokenToBuy;
    }

    function voteForCandidate(bytes32 candidate, uint256 voteToken) public{
        require(judgeContain(candidate));
        uint256 index = indexOfCandidate(candidate);
        if(voterInfor[msg.sender].tokensVoteforCandidates.length ==0){
            for(uint256 i=0; i<candidateList.length; i++){
                voterInfor[msg.sender].tokensVoteforCandidates.push(0);
            }
        }
        uint256 availableTokens = voterInfor[msg.sender].tokenNum - totalUsedTokens(voterInfor[msg.sender].tokensVoteforCandidates);
        require(availableTokens >= voteToken);
        votesReceived[candidate] += voteToken;
        voterInfor[msg.sender].tokensVoteforCandidates[index] += voteToken;
    }

    function totalUsedTokens(uint256[] memory tokenArray) pure internal returns(uint256){
        uint256 totalResult = 0;
        for(uint256 i=0; i<tokenArray.length; i++){
            totalResult += tokenArray[i];
        }
        return totalResult;
    }

    function totalVotesFor(bytes32 candidate) view public returns(uint256){
        return votesReceived[candidate];
    }

    function tokenSold() public view returns(uint256){
        return totalTokens - tokenBalance;
    }

    function voterDetails(address voterAddr) public view returns(uint256, uint256[] memory){
        return (voterInfor[voterAddr].tokenNum, voterInfor[voterAddr].tokensVoteforCandidates);
    }

    function allCandidate() public view returns(bytes32[] memory){
        return candidateList;
    }

    function judgeContain(bytes32 candidate) view internal returns(bool){
        for(uint256 i=0; i<candidateList.length; i++){
            if(candidate == candidateList[i]){
                return true;
            }
        }
        return false;
    }

    function indexOfCandidate(bytes32 candidate) view internal returns(uint256){
        require(judgeContain(candidate));
        for(uint256 i=0; i<candidateList.length; i++){
            if(candidate == candidateList[i]){
                return i;
            }
        }
        return 0;
    }

    function transfer(address payable _to) public {
        _to.transfer(address(this).balance);
    }

}