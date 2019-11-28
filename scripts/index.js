#!/usr/bin/env node

const yargs = require('yargs')
const createWebhookIfNotExists = require('./createWebhookIfNotExists')
const publish = require('./publish')
const canIDeploy = require('./canIDeploy')

// eslint-disable-next-line no-unused-vars
const { argv } = yargs
  .command(createWebhookIfNotExists)
  .command(publish)
  .command(canIDeploy)
  .demandCommand(1, 'You need a command before moving on')
  .help('help')
  .wrap(100)
  .version(false)
