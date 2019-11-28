const { makeRequestToPactBroker } = require('./makeRequestToPactBroker')
const { readSecret } = require('./vaultClient')

const getWebhookUrlForConsumerProducerRelationship = (consumerName, providerName) => `pacts/provider/${providerName}/consumer/${consumerName}/webhooks`

const doesWebhookExist = async ({
  consumerName,
  providerName,
  webhookTargetUrl,
  webhookTargetHttpMethod,
}) => {
  const url = getWebhookUrlForConsumerProducerRelationship(consumerName, providerName)
  const body = await makeRequestToPactBroker('GET', url)
  const webhooks = await Promise.all(
    body._links['pb:webhooks'].map(async ({ href }) => {
      const {
        request: { url: webhookUrl, method },
      } = await makeRequestToPactBroker('GET', href)

      return {
        webhookUrl,
        method,
      }
    }),
  )
  const returnValue = !!webhooks.find(
    ({ webhookUrl, method }) =>
      webhookUrl.includes(webhookTargetUrl) && method === webhookTargetHttpMethod,
  )
  return returnValue
}

const createWebhook = async ({
  consumerName,
  providerName,
  webhookTargetHttpMethod,
  webhookTargetUrl,
}) => {
  const url = `pacts/provider/${providerName}/consumer/${consumerName}/webhooks`
  const PACT_BROKER_JENKINS_SECRET_PATH = 'secret/rplanx/jenkins/pact-broker'
  const { data: { username, token } } = await readSecret(PACT_BROKER_JENKINS_SECRET_PATH)

  const requestBody = {
    events: [{
      name: 'contract_content_changed',
    }],
    request: {
      method: webhookTargetHttpMethod,
      url: `${webhookTargetUrl}?auth_type="basic"`,
      username,
      password: token,
    },
  }
  await makeRequestToPactBroker('POST', url, requestBody)
  console.log('webhook created')
}

const createWebhookIfRequired = async ({
  consumerName,
  providerName,
  webhookTargetHttpMethod,
  webhookTargetUrl,
  force,
}) => {
  try {
    const webhookAlreadyExists = await doesWebhookExist({
      consumerName,
      providerName,
      webhookTargetUrl,
      webhookTargetHttpMethod,
    })

    if (webhookAlreadyExists && !force) {
      console.log(
        `The webhook between consumer: ${consumerName} and provider: ${providerName} already exists. To force create this use --force.`,
      )
      return
    }

    if (webhookAlreadyExists && force) {
      console.log(
        `The webhook between consumer: ${consumerName} and provider: ${providerName} already exists. You specified force, creating webhook anyway.`,
      )
    }

    console.log(
      `Creating webhook for consumer: ${consumerName} and provider: ${providerName}.`,
    )

    await createWebhook({
      consumerName,
      providerName,
      webhookTargetHttpMethod,
      webhookTargetUrl,
    })
    process.exit(0)
  } catch (err) {
    console.log(err.stack)
    process.exit(1)
  }
}

const getOptions = yargs => yargs
  .usage('Creates a pact-broker webhook if the webhook does not already exist')
  .option('consumerName', {
    describe:
    'The name of the consumer. Pact changes from this build cause the webhook to be fired.',
    demandOption: true,
  })
  .option('providerName', {
    describe:
    'The name of the provider. Pact changes from the consumer cause this build to be fired',
    demandOption: true,
  })
  .option('webhookTargetHttpMethod', {
    describe: 'The http method the webhook should use when triggered',
    demandOption: false,
    choices: ['GET', 'PUT', 'POST'],
    default: 'POST',
  })
  .option('webhookTargetUrl', {
    describe: 'The url the webhook should use when triggered',
    demandOption: true,
  })
  .option('force', {
    describe: 'Always create the webhook, regardless of if it exists or not',
    demandOption: false,
    type: 'boolean',
    default: false,
  })
  .version(false)
  .help('help')


module.exports = {
  getOptions,
  createWebhookIfRequired,
}
