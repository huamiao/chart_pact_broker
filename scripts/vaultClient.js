const nodeVault = require('node-vault')

const vault = nodeVault({
  apiVersion: 'v1',
  endpoint: process.env.VAULT_ADDR,
  token: process.env.VAULT_TOKEN,
})

const { read: readSecret } = vault

module.exports = {
  readSecret,
}
