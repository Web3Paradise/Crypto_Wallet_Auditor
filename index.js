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
