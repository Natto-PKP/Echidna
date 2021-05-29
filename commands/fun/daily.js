const { Message, Client } = require('discord.js')
const { Database } = require('discord-echidna')

const rewards = [[100, 0], [150, 0], [200, 1]]

module.exports = {
	/**
	 * @param { object } param0 
	 * @param { Message } [param0.message] 
	 * @param { Client } [param0.client] 
	 * @param { Database } [param0.Database] 
	 */
	exec: function ({ message, client, Database }) {
		const doc = Database.open(message.author.id, 'user-eco')
		if (doc.cache.daily.cooldown && doc.cache.daily.cooldown - Date.now() > 0) return message.sendError('Vous pourrez réclamer de nouveau demain.')
		const reward = rewards[doc.cache.daily.cooldown && Date.now() - doc.cache.daily.cooldown < 864e5 ? (doc.cache.daily.acc < 2 ? doc.cache.daily.acc++ : doc.cache.daily.acc) : (doc.cache.daily.acc = 0)]

		message.channel.send({
			files: [{ attachment: './_storage/icons/daily_' + doc.cache.daily.acc + '.png', name: `acc.png` }],
			embed: {
				color: client.colors.base,
				author: { name: 'Vous venez de récupérer votre aide quotidienne !', icon_url: 'attachment://acc.png' },
				description: '`| ' + doc.cache.money.form() + ' 💴` < `' + reward[0].form() + ' 💴`' + (reward[1] ? '\n`| ' + doc.cache.tickets.form() + ' 🎟` < `' + reward[1].form() + ' 🎟`' : '')
			}
		})

		doc.update({ daily: { cooldown: Date.now() + new Date().rest() }, money: doc.cache.money + reward[0], tickets: doc.cache.tickets + reward[1] }).save()
	},
	options: { name: 'daily', aliases: ['dl'], cooldown: 6, permissions: { client: ['EMBED_LINKS', 'ATTACH_FILES'] } }
}
