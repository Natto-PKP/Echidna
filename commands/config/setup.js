const { Message, Client } = require('discord.js')

module.exports = {
	/**
	 * @param { object } param0 
	 * @param { Message } [param0.message] 
	 * @param { Client } [param0.client] 
	 */
	exec: function ({ message, client }) {
		message.channel.send({ embed: { color: client.colors.config, author: { name: '🧪 Menu des options', icon_url: message.guild.iconURL({ dynamic: true }) }, footer: { text: 'exemple: "config logs' }, description: '**`| logs` -** Configurez les logs de votre serveur.' } })
	},
	options: { name: 'config', cooldown: 3, modules: './commands/config/setup', permissions: { users: ['MANAGE_GUILD'], client: ['EMBED_LINKS'] } }
}
