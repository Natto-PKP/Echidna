const { Message, Client } = require('discord.js')
const { Database } = require('discord-echidna')

module.exports = {
	/**
	 * @param { object } param0 
	 * @param { Client } [param0.client] 
	 * @param { Message } [param0.message] 
	 * @param { Database } [param0.Database] 
	 */
	exec: async function ({ client, message, Database }) {
		const contents = { profile: Database.open(message.member.id, 'user-profile').cache }

		message.channel.send({
			embed: {
				color: client.colors.base,
				author: { name: '🗂 Vos inventaires', icon_url: message.author.displayAvatarURL({ dynamic: true }) },
				footer: { text: 'exemple: "inventory background' },
				description: "**`| background` -** Votre stock d'image de profil `[" + contents.profile.wallpapers.arr.length + ' image(s)]`'
			}
		})
	},
	options: { name: 'inventory', aliases: ['inv'], cooldown: 3, modules: './commands/utils/inventory', permissions: { client: ['EMBED_LINKS'] } }
}
