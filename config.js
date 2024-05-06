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
