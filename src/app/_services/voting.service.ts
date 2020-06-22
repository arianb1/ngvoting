import { Injectable } from '@angular/core';
const Web3 = require('web3');
declare let require: any;
declare let window: any;
// tokenAbi points to the ABI file we compiled from the contract SOL file
const tokenAbi = '[{"inputs":[{"internalType":"string","name":"vn","type":"string"},{"internalType":"string","name":"vd","type":"string"},{"internalType":"bytes32[]","name":"proposalNames","type":"bytes32[]"}],"name":"createVote","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"chairperson","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getVote","outputs":[{"internalType":"string","name":"","type":"string"},{"internalType":"string","name":"","type":"string"},{"internalType":"bytes32[]","name":"","type":"bytes32[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"proposals","outputs":[{"internalType":"bytes32","name":"name","type":"bytes32"},{"internalType":"uint256","name":"voteCount","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"voteDesc","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"voteName","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"}]';
const address = '0xdf7B62dD8Eb0711d2Ab5B972118aAD2089C8FF0A'; // '0x37a33d0FB1d77aaa1866BAA51A4AA8BfBf3600Ba';
// to https://ropsten.etherscan.io/address/0x37a33d0fb1d77aaa1866baa51a4aa8bfbf3600ba

@Injectable({
  providedIn: 'root'
})
export class VotingService {
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

  public async retreiveVote(): Promise<any> {
    const that = this;
    console.log('start retreiveVote');
    const myContract = new window.web3.eth.Contract(JSON.parse(tokenAbi), address);
    // , {
      // from: myacc,
      // gasPrice: '30000000000' // default gas price in wei, 20 gwei in this case
    // });

      // console.log (myContract);
    // const result = myContract.methods.storenumber(323).send();
    // console.log(result);

    const result1 = await myContract.methods.getVote().call();
    console.log(result1);
    result1[2] = result1[2].map(x => window.web3.utils.hexToAscii(x).replace(/[^\x20-\x7E]/g, ''));
    return Promise.resolve(result1);

      // console.log(tokenAbi);
      // const contract = require('@truffle/contract');
      // const transferContract = contract(tokenAbi);
      // transferContract.setProvider(that.web3);

      // const myContract = new window.web3.eth.Contract(JSON.parse(tokenAbi));
      // console.log (myContract);
      // const contractInstance = myContract.at('0xCE1C6177bAE04599dfA1b8c38e68619b273e6Be2');
      // console.log(account);
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
    const result = myContract.methods.createVote(vn, vd, params).send();
    return Promise.resolve(result);
    console.log(result);
  }

}
