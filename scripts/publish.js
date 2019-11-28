const pact = require('@pact-foundation/pact-node')
const { readSecret } = require('./vaultClient')

const handler = async (args) => {
  const { data: { password, url, username } } = await readSecret('/secret/rplanx/gke-dev/pact-broker')
  const opts = {
    ...args,
    pactBroker: url,
    pactBrokerUsername: username,
    pactBrokerPassword: password,
  }
  console.log(`Publishing pact with version ${args.consumerVersion} and tags ${args.tags}`)
  await pact.publishPacts(opts)
}

const builder = yargs => yargs
  .usage('Publishes pacts to the pact broker')
  .option('pactFilesOrDirs', {
    describe: 'Array of local Pact files or directories containing them',
    demandOption: true,
    type: 'array',
  })
  .option('consumerVersion', {
    describe: 'A string containing a semver-style version e.g. 1.0.0',
    demandOption: true,
    type: 'string',
  })
  .option('tags', {
    describe: 'An array of Strings to tag the Pacts being published',
    demandOption: false,
  })
  .version(false)
  .help('help')

module.exports = {
  command: 'publish',
  desc: 'Publish pact files to the pact broker',
  builder,
  handler,
}
