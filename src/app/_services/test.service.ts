import { Injectable } from '@angular/core';
const Web3 = require('web3');
declare let require: any;
declare let window: any;
// tokenAbi points to the ABI file we compiled from the contract SOL file
const tokenAbi = '[{"inputs": [],"name": "retreivenumber","outputs": [{"internalType": "uint256","name": "","type": "uint256"}],"stateMutability": "view","type": "function"},{"inputs": [{"internalType": "uint256","name": "myNum","type": "uint256"}],"name": "storenumber","outputs": [],"stateMutability": "nonpayable","type": "function"}]';
const address = '0x6d7276F6C9C1a37dd6C6d433CecA9F60042CdbCC';
// from https://ropsten.etherscan.io/address/0x6d7276F6C9C1a37dd6C6d433CecA9F60042CdbCC

@Injectable({
  providedIn: 'root'
})
export class TestService {
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
      console.log('transfer.service :: constructor :: window.ethereum');
      window.web3 = new Web3(window.ethereum);
      console.log('transfer.service :: constructor :: this.web3');
      console.log(this.web3);
      // this method will open MetaMask to enable our app to interact with our wallet.
      this.enable = this.enableMetaMaskAccount();
    }
  }

  private async enableMetaMaskAccount(): Promise<any> {
    let enable = false;
    await new Promise((resolve, reject) => {
      enable = window.ethereum.enable();
    });
    return Promise.resolve(enable);
  }

  private async getAccount(): Promise<any> {
    console.log('transfer.service :: getAccount :: start');
    if (this.account == null) {
      this.account = await new Promise((resolve, reject) => {
        console.log('transfer.service :: getAccount :: eth');
        console.log(window.web3.eth);
        window.web3.eth.getAccounts((err, retAccount) => {
          console.log('transfer.service :: getAccount: retAccount');
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

  public async getUserBalance(): Promise<any> {
    const account = await this.getAccount();
    console.log('transfer.service :: getUserBalance :: account');
    console.log(account);
    return new Promise((resolve, reject) => {
      window.web3.eth.getBalance(account, function(err, balance) {
        console.log('transfer.service :: getUserBalance :: getBalance');
        console.log(balance);
        if (!err) {
          const retVal = {
            account: account,
            balance: balance
          };
          console.log('transfer.service :: getUserBalance :: getBalance :: retVal');
          console.log(retVal);
          resolve(retVal);
        } else {
          reject({account: 'error', balance: 0});
        }
      });
    }) as Promise<any>;
  }


  public async retreiveNumber(): Promise<any> {
    const that = this;
    console.log('transfer.service');
    const myacc = await this.getAccount();

    const myContract = new window.web3.eth.Contract(JSON.parse(tokenAbi), address, {
      from: myacc,
      gasPrice: '30000000000' // default gas price in wei, 20 gwei in this case
    });

      // console.log (myContract);
    // const result = myContract.methods.storenumber(323).send();
    // console.log(result);

    const result1 = await myContract.methods.retreivenumber().call();
    console.log(result1);
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

  public async storeNumber(newNum: number): Promise<any> {
    const that = this;
    console.log('storeNumber');
    const myacc = await this.getAccount();

    const myContract = new window.web3.eth.Contract(JSON.parse(tokenAbi), address, {
      from: myacc,
      gasPrice: '30000000000' // default gas price in wei, 20 gwei in this case
    });

      // console.log (myContract);
    const result = myContract.methods.storenumber(newNum).send();
    console.log(result);
    return Promise.resolve(result);

  }

}
