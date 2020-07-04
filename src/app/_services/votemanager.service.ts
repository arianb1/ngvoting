import { Injectable } from '@angular/core';
const Web3 = require('web3');
declare let require: any;
declare let window: any;
// tokenAbi points to the ABI file we compiled from the contract SOL file
const tokenAbi = '[{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"contractAddress","type":"address"}],"name":"newVoteContractCreated","type":"event"},{"inputs":[{"internalType":"address","name":"contractVoteAddress","type":"address"},{"internalType":"address","name":"voter","type":"address"},{"internalType":"bytes32","name":"propsalName","type":"bytes32"}],"name":"castVote","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"votename","type":"string"},{"internalType":"string","name":"vodedesc","type":"string"},{"internalType":"bytes32[]","name":"options","type":"bytes32[]"}],"name":"createNewVote","outputs":[{"internalType":"address","name":"newContract","type":"address"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"getContractCount","outputs":[{"internalType":"uint256","name":"contractCount","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getDeployedChildVotes","outputs":[{"components":[{"internalType":"string","name":"voteName","type":"string"},{"internalType":"address","name":"voteAddress","type":"address"},{"internalType":"address","name":"voteCreator","type":"address"},{"internalType":"string","name":"voteStatus","type":"string"}],"internalType":"struct VoteManager.VoteInfo[]","name":"","type":"tuple[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"pos","type":"uint256"}],"name":"getVoteAddressByPosition","outputs":[{"internalType":"address","name":"contractVoteAddress","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"contractVoteAddress","type":"address"}],"name":"getVoteByAddress","outputs":[{"internalType":"string","name":"","type":"string"},{"internalType":"string","name":"","type":"string"},{"internalType":"bytes32[]","name":"","type":"bytes32[]"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"lastContractAddress","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"contractVoteAddress","type":"address"},{"internalType":"string","name":"vn","type":"string"},{"internalType":"string","name":"vd","type":"string"},{"internalType":"bytes32[]","name":"proposalNames","type":"bytes32[]"}],"name":"updateVoteByAddress","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"voteList","outputs":[{"internalType":"string","name":"voteName","type":"string"},{"internalType":"address","name":"voteAddress","type":"address"},{"internalType":"address","name":"voteCreator","type":"address"},{"internalType":"string","name":"voteStatus","type":"string"}],"stateMutability":"view","type":"function"}]';
const address = '0x30A31742E33B150dAE5Ab0bE59D9ac4131DD8f5D';

@Injectable({
  providedIn: 'root'
})
export class VotesManagerService {
  private account: any = null;
  private readonly web3: any;
  private enable: any;
  constructor() {
    // The browsers that support MetaMask (if installed) will have the variable “window.ethereum” set for us
    if (window.ethereum === undefined) {
      alert('Non-Ethereum browser detected. Install MetaMask');
    } else {
      if (typeof window.web3 !== 'undefined') {
        this.web3 = window.web3.currentProvider;
        console.log('current provider');
      } else {
        this.web3 = new Web3.providers.HttpProvider('https://ropsten.etherscan.io/'); // http://localhost:8545');
        console.log('new provider ' + this.web3);
      }
      window.web3 = new Web3(window.ethereum);
      console.log('WEB3: ' + this.web3);
      // this method will open MetaMask to enable our app to interact with our wallet.
      // this.enable = this.enableMetaMaskAccount();
    }
  }

  private async enableMetaMaskAccount(): Promise<any> {
    let enable = false;
    await new Promise((resolve, reject) => {
      enable = window.ethereum.enable();
    });
    return Promise.resolve(enable);
  }

  public async  getAccount(): Promise<any> {
    console.log('getAccount-start1');
    this.enable = await window.ethereum.enable(); // await this.enableMetaMaskAccount();
    console.log('getAccount-start2');
    if (this.account == null) {
      console.log('getAccount-start3');
      this.account = await new Promise((resolve, reject) => {
        window.web3.eth.getAccounts((err, retAccount) => {
          console.log('getAccount-start4');
          console.log(retAccount);
          if (retAccount.length > 0) {
            this.account = retAccount[0];
            resolve(this.account);
          } else {
            alert('transfer.service :: getAccount :: no accounts found.');
            reject('No accounts found.');
          }
          if (err != null) {
            alert('transfer.service :: getAccount :: error retrieving account');
            reject('Error retrieving account');
          }
        });
      }) as Promise<any>;
    }
    return Promise.resolve(this.account);
  }

  public async getAllVotes(): Promise<any> {
    const that = this;
    console.log('start getAllVotes');
    const myContract = new window.web3.eth.Contract(JSON.parse(tokenAbi), address);

    const result1 = await myContract.methods.getDeployedChildVotes().call();
    return Promise.resolve(result1);

  }

  public async createVote(vn: string, vd: string, proposalNames: Array<string>): Promise<any> {
    const that = this;
    console.log('createVote');
    const myacc = await this.getAccount();

    const myContract = new window.web3.eth.Contract(JSON.parse(tokenAbi), address, {
      from: myacc,
      gasPrice: '30000000000' // default gas price in wei, 20 gwei in this case
    });

    console.log ('before call');
    const params = proposalNames.map(x => window.web3.utils.toHex(x.trim())); // .padEnd(66, '0')
    const result = myContract.methods.createNewVote(vn, vd, params).send();
    return Promise.resolve(result);
    console.log(result);
  }

  public async retreiveVote(contractVoteAddress): Promise<any> {
    const that = this;
    console.log('start retreiveVote');
    const myContract = new window.web3.eth.Contract(JSON.parse(tokenAbi), address);

    const result1 = await myContract.methods.getVoteByAddress(contractVoteAddress).call();
    console.log(result1);
    result1[2] = result1[2].map(x => window.web3.utils.hexToAscii(x).replace(/[^\x20-\x7E]/g, ''));
    return Promise.resolve(result1);
  }

  public async updateVote(contractVoteAddress: any, vn: string, vd: string, proposalNames: Array<string>): Promise<any> {
    const that = this;
    console.log('updateVote');
    const myacc = await this.getAccount();

    const myContract = new window.web3.eth.Contract(JSON.parse(tokenAbi), address, {
      from: myacc,
      gasPrice: '30000000000' // default gas price in wei, 20 gwei in this case
    });

    console.log ('before call');
    const params = proposalNames.map(x => window.web3.utils.toHex(x.trim())); // .padEnd(66, '0')
    const result = myContract.methods.updateVoteByAddress(contractVoteAddress, vn, vd, params).send();
    return Promise.resolve(result);
    console.log(result);
  }

  public async castVote(contractVoteAddress: any, proposalName: string): Promise<any> {
    const that = this;
    console.log('castVote call...');
    const myacc = await this.getAccount();

    const myContract = new window.web3.eth.Contract(JSON.parse(tokenAbi), address, {
      from: myacc,
      gasPrice: '30000000000' // default gas price in wei, 20 gwei in this case
    });

    const voterSelection = window.web3.utils.toHex(proposalName.trim())
    const result = myContract.methods.castVote(contractVoteAddress, myacc, voterSelection).send();
    return Promise.resolve(result);
    console.log(result);
  }

}
