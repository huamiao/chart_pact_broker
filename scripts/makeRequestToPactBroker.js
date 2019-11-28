const superagent = require('superagent')
const { readSecret } = require('./vaultClient')

const makeRequestToPactBroker = async (method, url, body) => {
  console.log(`making request to pact broker method: ${method} url ${url}`)
  const PACT_BROKER_SECRET_PATH_NAME = '/secret/rplanx/gke-dev/pact-broker'
  const { data: pactBrokerConfig } = await readSecret(PACT_BROKER_SECRET_PATH_NAME)

  const urlToQuery = url.includes(pactBrokerConfig.url) ? url : `${pactBrokerConfig.url}/${url}`
  const request = superagent(method, urlToQuery)
    .auth(pactBrokerConfig.username, pactBrokerConfig.password)
    .set({
      'Content-Type': 'application/json',
    })
  if (body) {
    request.send(body)
  }
  const { body: responseBody } = await request
  return responseBody
}

module.exports = {
  makeRequestToPactBroker,
}
