import Web3 from "web3";
import voting_artifacts from "../../build/contracts/Voting.json";

let candidates = {};
let tokenPrice = null;
let Voting;

window.buyTokens = function (){
  let tokensToBuy = $("#buy").val();
  let _value = tokensToBuy * tokenPrice;
  Voting.methods.buy().send({from: "0x0b79f30046a415c8a4B9ab3dF84B114Dd02B7466",value: _value}).then(()=>{
    Voting.methods.tokenSold().call().then(amount=>{
      $("#tokens-sold").html(amount.toString());
    })
    web3.eth.getBalance(Voting._address).then(balance=>{
      $("#contract-balance").html(web3.utils.fromWei(balance.toString(),"ether")+" ETH");
    })
  })
}

window.voteForCandidate = function (){
  let candidateName = $("#candidate").val();
  let voteTokens = $("#vote-tokens").val();
  $("#candidate").val("");
  $("#vote-tokens").val("");
  Voting.methods.voteForCandidate(candidateName, voteTokens)
      .send({from: "0x0b79f30046a415c8a4B9ab3dF84B114Dd02B7466", gas: 5000000}).then(()=>{
    Voting.methods.totalVotesFor(candidateName).call().then((count)=>{
      $("#"+candidates[candidateName]).html(count.toString());
    })
  })
}

window.lookupVoterInfo = function (){
  let _address = $("#voter-info").val();
  Voting.methods.voterDetails(_address).call().then(res=>{
    $("#tokens-bought").html("Tokens Bought: "+res[0].toString());
    let candidateNames = Object.keys(candidates);
    $("#votes-cast").empty();
    $("#votes-cast").append("Votes cast per candidate: <br>");
    for(let i=0; i<candidateNames.length; i++){
      $("#votes-cast").append(candidateNames[i]+": "+res[1][i].toString() +"<br>");
    }
  })
}

$(document).ready(function (){
  window.web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:8545"));
  let accounts = web3.eth.getAccounts();
  console.log(accounts);
  web3.eth.net.getId().then(function (networkId) {
    const deployedNetwork = voting_artifacts.networks[networkId];
    Voting = new web3.eth.Contract(
        voting_artifacts.abi,
        deployedNetwork.address,
    );
    populateCandidates();
  })
});

function populateCandidates(){
  Voting.methods.allCandidate().call().then(function (candidateArray){
    for(let i=0; i<candidateArray.length; i++){
      candidates[candidateArray[i]] = "candidate-"+i;
    }
    setUpCandidateRows();
    populateCandidateVotes();
    populateTokenData();
  })
}

function setUpCandidateRows(){
  Object.keys(candidates).forEach(candidate=>{
    $("#candidate-rows").append("<tr><td>"+candidate+"</td>" +
        "<td id='"+candidates[candidate] +"'></td></tr>");
  });
}

function populateCandidateVotes(){
  let candidateNames = Object.keys(candidates);
  for(let i=0; i<candidateNames.length; i++){
    Voting.methods.totalVotesFor(candidateNames[i]).call().then(function (result){
      $("#"+candidates[candidateNames[i]]).html(result.toString());
    });
  }
}

function populateTokenData(){
  Voting.methods.totalTokens().call().then(amount=>{
    $("#tokens-total").html(amount.toString());
  })
  Voting.methods.tokenSold().call().then(amount=>{
    $("#tokens-sold").html(amount.toString());
  })
  Voting.methods.tokenPrice().call().then(price=>{
    tokenPrice = price.toString();
    $("#token-cost").html(web3.utils.fromWei(price.toString(), "ether")+" ETH");
  })
  web3.eth.getBalance(Voting._address).then(balance=>{
    $("#contract-balance").html(web3.utils.fromWei(balance,"ether")+" ETH");
  })
}