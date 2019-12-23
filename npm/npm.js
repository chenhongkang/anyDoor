#!/usr/bin/env node
const yargs = require('yargs')
const Server = require('../app')
 
let argv = yargs
    .option('p', {
        alias: 'port',
        demandOption: false,
        default: '3004',
        describe: '端口号',
        type: 'string'
    })
    .option('h', {
        alias: 'host',
        demandOption: false,
        default: '127.0.0.1',
        describe: '域名',
        type: 'string'
    })
    .option('d', {
        alias: 'rootFileRoute',
        demandOption: false,
        default: __dirname,
        describe: '根目录位置',
        type: 'string'
    })
    .argv;

const server = new Server(argv)
server.startServer()