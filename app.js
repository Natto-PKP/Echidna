const { Echidna, Collections } = require('discord-echidna')
const echidna = new Echidna(require('./secret.json').token, { owners: ['570642674151981135'], client: { partials: ['CHANNEL', 'GUILD_MEMBER', 'MESSAGE', 'REACTION', 'USER'] } })

const { readdirSync, existsSync } = require('fs')

readdirSync('./methods').forEach((file) => require('./methods/' + file))
readdirSync('./events').forEach((event) => (existsSync('./events/' + event + '/index.js') ? echidna.on(event, ...Object.values(require('./events/' + event + '/index.js'))) : echidna.on(event, (params) => readdirSync('./events/' + event).forEach((file) => require('./events/' + event + '/' + file)(params)))))
readdirSync('./collections').forEach((collection) => Collections.add(collection.split('.')[0], require('./collections/' + collection)))
