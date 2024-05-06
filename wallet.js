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
