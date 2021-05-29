const { Message, Client } = require('discord.js')
const { Database } = require('discord-echidna')

module.exports = {
	/**
	 * @param { object } param0 
	 * @param { Message } [param0.message] 
	 * @param { Client } [param0.client] 
	 * @param { Database } [param0.Database] 
	 */
	exec: function ({ message, client, Database }) {
		const docs = { tools: Database.open(message.member.id, 'user-tools') }
		message.channel.send({
			embed: {
				color: client.colors.archives,
				author: { name: '📁 Vos archives', icon_url: client.user.displayAvatarURL({ dynamic: true }) },
				description: ['**`| fishs` -** Liste des poissons `[' + docs.tools.cache.fishing.inventory.length + ' connu(s)]`'].join('\n'),
				footer: { text: 'exemple: "archives fishs' }
			}
		})
	},
	options: { name: 'archives', aliases: ['index'], cooldown: 3, modules: './commands/games/archives', permissions: { client: ['EMBED_LINKS'] } }
}
