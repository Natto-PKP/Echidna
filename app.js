const { Echidna, Collections } = require('discord-echidna')
const echidna = new Echidna(require('./secret.json').token, { partials: ['CHANNEL', 'GUILD_MEMBER', 'MESSAGE', 'REACTION', 'USER'], lang: 'fr', owners: ['570642674151981135'] })

const { readdirSync, existsSync } = require('fs')

readdirSync('./methods').forEach((file) => require('./methods/' + file))
readdirSync('./collections').forEach((collection) => Collections.add(collection.split('.')[0], require('./collections/' + collection)))
readdirSync('./events').forEach((event) => (existsSync('./events/' + event + '/index.js') ? echidna.on(event, require('./events/' + event + '/index.js')) : echidna.on(event, (params) => readdirSync('./events/' + event).forEach((file) => require('./events/' + event + '/' + file)(params)))))

echidna.commands({ directory: { path: './commands', categories: true }, prefixes: { collection: 'guild-config', properties: 'prefix' } })
