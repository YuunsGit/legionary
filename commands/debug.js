const Discord = require('discord.js')
const config = require('../config.json')
const logs = require('../logs.json')
const cron = require('node-cron')
const fs = require('fs')
const fetch = require('node-fetch')
const weather = require('openweather-apis')
const Util = require('../util');
const {MessageEmbed} = require('discord.js')
const members = require('../members.json')

module.exports = {
    data: {
        name: 'debug',
        description: 'Yunus\'un efsanevi sorun gidericisi.',
        default_permission: false
    },
    perms: [
        {
            id: '305044214239068162',
            type: 'USER',
            permission: true
        }
    ],
    async execute(interaction) {
    }
}