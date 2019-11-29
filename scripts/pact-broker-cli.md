# Pact Broker Client

A client for the Rplan Pact Broker. Publishes, Create Webhooks, Verify pacts. The functionality is available via a CLI

## Installation

### CLI

`yarn install @rplan/pact-broker-helper`

### Usage

`npx pact-broker-helper ..args`

## Connection

To connect to a Pact Broker you have only to export the vault credentials

```
export VAULT_ADDR=<vaultAddress>
export VAULT_TOKEN=<vaultToken>
```

### createWebhookIfNotExists

```
Usage:
  npx pact-broker-helper createWebhookIfNotExists --consumerName=accounts --providerName=authentication --webhookTargetUrl=https://rplan.com/jenkins/build/master

Options:
  --consumerName                                            # The name of the consumer. Pact changes from this build cause the webhook to be fired.
  --providerName                                            # The name of the provider. Pact changes from the consumer cause this build to be fired
  --webhookTargetHttpMethod ['GET', 'PUT', 'POST']          # The http method the webhook should use when triggered
                                                            # Default: POST               
  --webhookTargetUrl                                        # The url the webhook should use when triggered
  --force                                                   # Always create the webhook, regardless of if it exists or not

It Will create a webhooks to the Pact Broker.
```

### publish

```
Usage:
  npx pact-broker-helper publish --pactFilesOrDirs=./pacts --consumerVersion=1.0.0 --tags=master

Options:
  --pactFilesOrDirs                                        # Array of local Pact files or directories containing them
  --consumerVersion                                        # A string containing a semver-style version e.g. 1.0.0
  --tags                                                   # An array of Strings to tag the Pacts being published

Publishes pacts to the pact broker
```

### canIDeploy

```
Usage:
  npx pact-broker-helper canIDeploy --pacticipants=accounts:1.0.0 --retryWhileUnknown=36 --retryInterval=15

Options:
  --pacticipants                           # Array of participant names
  --output                                 # Specify output to show, json or table
                                           # Default: table
  --verbose                                # Set the logging mode to verbose
                                           # Default: false
  --retryWhileUnknown                      # The number of times to retry while there is an unknown verification result
                                           # Default: 0
  --retryInterval                          # The time between retries in seconds, use with retryWhileUnknown
                                           # Default: 0
  --tag                                    # The tag you want to deploy to

Description:
  Returns exit code 0 or 1, indicating whether or not the specified pacticipant versions are compatible. Prints out the relevant
  pact/verification details.

  The environment variables PACT_BROKER_BASE_URL, PACT_BROKER_BASE_URL_USERNAME and PACT_BROKER_BASE_URL_PASSWORD may be used
  instead of their respective command line options.
```
