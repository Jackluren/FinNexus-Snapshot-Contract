
const FnxVote = artifacts.require('FnxVote');
const MockTokenFactory = artifacts.require('TokenFactory');
const Token = artifacts.require("TokenMock");

const assert = require('chai').assert;
const Web3 = require('web3');
const config = require("../truffle.js");
const BN = require("bn.js");
var utils = require('./utils.js');

web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:7545"));


/**************************************************
 test case only for the ganahce command
 ganache-cli --port=7545 --gasLimit=8000000 --accounts=10 --defaultBalanceEther=100000 --blockTime 1
 **************************************************/
contract('FnxVote', function (accounts){
    let mockFnxToken;
    let mockLpToken;
    let mockUniMineToken;
    let mockColToken;

    let amount = web3.utils.toWei('1', 'ether');

    before("init", async()=>{

        fnxvote = await FnxVote.new();
        console.log("fnxVote address:", fnxvote.address);

        tokenFactory = await MockTokenFactory.new();
        console.log("tokenfactory address:",tokenFactory.address);

        await tokenFactory.createToken(18);
        mockFnxToken = await Token.at(await tokenFactory.createdToken());
        console.log("mockFnxToken address:",mockFnxToken.address);

        await tokenFactory.createToken(18);
        mockLpToken = await Token.at(await tokenFactory.createdToken());
        console.log("mockLpToken address:",mockLpToken.address);

        await tokenFactory.createToken(18);
        mockUniMineToken = await Token.at(await tokenFactory.createdToken());
        console.log("mockUniMineToken address:",mockUniMineToken.address);

        await tokenFactory.createToken(18);
        mockColToken = await Token.at(await tokenFactory.createdToken());
        console.log("mockColToken address:",mockColToken.address);

      //set mine coin info
      res = await fnxvote.removeAll();
      assert.equal(res.receipt.status,true);

      res = await fnxvote.setFnx(mockFnxToken.address);
      assert.equal(res.receipt.status,true);

      res = await fnxvote.setUniswap(mockLpToken.address,mockUniMineToken.address);
      assert.equal(res.receipt.status,true);

      res = await fnxvote.setOptionCol(mockColToken.address);
      assert.equal(res.receipt.status,true);

      res = await fnxvote.setSushiSwap(mockSushiLpToken.address,address0);
      assert.equal(res.receipt.status,true);


    })


   it("[0010]vote without uni,should pass", async()=>{
     let count = 1;
     let expected =  new Map();

     let i = 0;
     for(i=0;i< count;i++) {
       let val = new BN(amount);//.mul(new BN(i+1));

       res = await mockLpToken.adminSetBalance(accounts[i], val);
       assert.equal(res.receipt.status,true);

       res = await mockLpToken.adminSetBalance(accounts[i+1], val);
       assert.equal(res.receipt.status,true);

       expected[i] = new BN(amount).mul(new BN(1))
     }
     // 1 lp == 2 fnx
     res = await mockFnxToken.adminSetBalance(mockLpToken.address, new BN(amount).mul(new BN(2)));
     assert.equal(res.receipt.status,true);

     for(i=0;i<count;i++) {
       let voteAmount = await fnxvote.fnxBalanceAll(accounts[i]);
       console.log(expected[i].toString());
       console.log(voteAmount.toString());
       assert.equal(voteAmount.toString(),expected[i].toString(),"value not equal")
     }
		})
})
