# Crypto_Wallet_Auditor
A script to audit your wallet for potential vulnerability due to interactions with insecure contract


Let's create a Crypto Auditor script that audits a user's cryptocurrency wallet for security vulnerabilities and best practices. We'll build this script step-by-step, and I'll provide you with the full source code.

**Step 1: Choose a JavaScript library for interacting with the blockchain**

For this script, we'll use the Web3.js library, which provides a JavaScript interface to the Ethereum blockchain. We'll use Web3.js to interact with the Ethereum blockchain and retrieve data about the user's wallet.

**Step 2: Set up the project structure**

Create a new folder for your project, and create the following files:

* `index.js`: This will be the main script file.
* `config.js`: This will contain configuration settings for the script.
* `wallet.js`: This will contain the wallet auditor logic.

**Step 3: Install required dependencies**

Run the following command in your terminal to install the required dependencies:
```
npm install web3
```
**Step 4: Create the `config.js` file**

In the `config.js` file, add the following code:
```
module.exports = {
  // Ethereum node URL
  ethereumNodeUrl: 'https://mainnet.infura.io/v3/YOUR_PROJECT_ID',
  // Wallet address to audit
  walletAddress: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
  // List of security vulnerabilities to check for
  securityVulnerabilities: [
    'insufficient-liquidity',
    'unverified-contracts',
    'unsecured-ERC20-tokens',
  ],
};
```
Replace `YOUR_PROJECT_ID` with your actual Infura project ID.

**Step 5: Create the `wallet.js` file**

In the `wallet.js` file, add the following code:
```
const Web3 = require('web3');
const config = require('./config');

class WalletAuditor {
  constructor(walletAddress) {
    this.walletAddress = walletAddress;
    this.web3 = new Web3(new Web3.providers.HttpProvider(config.ethereumNodeUrl));
  }

  async getWalletBalance() {
    const balance = await this.web3.eth.getBalance(this.walletAddress);
    return balance;
  }

  async getWalletTransactions() {
    const transactions = await this.web3.eth.getTransactionCount(this.walletAddress);
    return transactions;
  }

  async checkForInsufficientLiquidity() {
    const balance = await this.getWalletBalance();
    if (balance < 0.1) {
      return {
        vulnerability: 'insufficient-liquidity',
        severity: 'high',
        description: ' Wallet balance is low',
      };
    }
    return null;
  }

  async checkForUnverifiedContracts() {
    const transactions = await this.getWalletTransactions();
    const unverifiedContracts = [];
    for (const transaction of transactions) {
      const contractAddress = transaction.to;
      const contractCode = await this.web3.eth.getCode(contractAddress);
      if (!contractCode) {
        unverifiedContracts.push(contractAddress);
      }
    }
    if (unverifiedContracts.length > 0) {
      return {
        vulnerability: 'unverified-contracts',
        severity: 'medium',
        description: `Unverified contracts found: ${unverifiedContracts.join(', ')}`,
      };
    }
    return null;
  }

  async checkForUnsecuredERC20Tokens() {
    const transactions = await this.getWalletTransactions();
    const unsecuredTokens = [];
    for (const transaction of transactions) {
      const tokenAddress = transaction.to;
      const tokenContract = await this.web3.eth.getContractAt(tokenAddress);
      if (!tokenContract) {
        unsecuredTokens.push(tokenAddress);
      }
    }
    if (unsecuredTokens.length > 0) {
      return {
        vulnerability: 'unsecured-ERC20-tokens',
        severity: 'low',
        description: `Unsecured ERC20 tokens found: ${unsecuredTokens.join(', ')}`,
      };
    }
    return null;
  }

  async auditWallet() {
    const vulnerabilities = [];
    for (const vulnerability of config.securityVulnerabilities) {
      switch (vulnerability) {
        case 'insufficient-liquidity':
          const liquidityVulnerability = await this.checkForInsufficientLiquidity();
          if (liquidityVulnerability) {
            vulnerabilities.push(liquidityVulnerability);
          }
          break;
        case 'unverified-contracts':
          const unverifiedContractsVulnerability = await this.checkForUnverifiedContracts();
          if (unverifiedContractsVulnerability) {
            vulnerabilities.push(unverifiedContractsVulnerability);
          }
          break;
        case 'unsecured-ERC20-tokens':
          const unsecuredTokensVulnerability = await this.checkForUnsecuredERC20Tokens();
          if (unsecuredTokensVulnerability) {
            vulnerabilities.push(unsecuredTokensVulnerability);
          }
          break;
        default:
          console.log(`Unknown vulnerability: ${vulnerability}`);
      }
    }
    return vulnerabilities;
  }
}

module.exports = WalletAuditor;
```
This script defines a `WalletAuditor` class that checks for three security vulnerabilities:

1. Insufficient liquidity: The wallet balance is low.
2. Unverified contracts: The wallet has interacted with unverified contracts.
3. Unsecured ERC20 tokens: The wallet has unsecured ERC20 tokens.

**Step 6: Create the `index.js` file**

In the `index.js` file, add the following code:
```
const WalletAuditor = require('./wallet');

const walletAddress = config.walletAddress;
const walletAuditor = new WalletAuditor(walletAddress);

async function main() {
  const vulnerabilities = await walletAuditor.auditWallet();
  console.log('Vulnerabilities:');
  for (const vulnerability of vulnerabilities) {
    console.log(`  ${vulnerability.vulnerability}: ${vulnerability.description} (Severity: ${vulnerability.severity})`);
  }
}

main();
```
This script creates a new instance of the `WalletAuditor` class and calls the `auditWallet` method to check for security vulnerabilities. The results are then logged to the console.
