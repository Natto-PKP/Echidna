const { Message, Client } = require('discord.js')

module.exports = {
	/**
	 * @param { object } param0 
	 * @param { Client } [param0.client] 
	 * @param { Message } [param0.message] 
	 */
	exec: function ({ client, message }) {
		message.channel.send({
			embed: {
				color: client.colors.base,
				author: { name: '🛒 Magasins ouverts et disponibles', icon_url: message.author.displayAvatarURL({ dynamic: true }) },
				footer: { text: 'exemple: "shop background' },
				description: '**`| background` -** prennez vous de nouvelles images de profil'
			}
		})
	},
	options: { name: 'shop', cooldown: 1, modules: './commands/utils/shop', permissions: { client: ['EMBED_LINKS'] } }
}
