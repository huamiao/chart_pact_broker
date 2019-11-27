#!/usr/bin/env node

const yargs = require('yargs')
const createWebhookIfNotExists = require('./createWebhookIfNotExists')

// eslint-disable-next-line no-unused-vars
const { argv } = yargs
  .command({
    command: 'createWebhookIfNotExists',
    desc: 'create a webhook if it does not exist',
    builder: createWebhookIfNotExists.getOptions,
    handler: createWebhookIfNotExists.createWebhookIfRequired,
  })
  .demandCommand(1, 'You need a command before moving on')
  .help('help')
  .wrap(100)
  .version(false)
