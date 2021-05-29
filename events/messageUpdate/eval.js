const { Message, Client } = require('discord.js')
const { Database, Collections } = require('discord-echidna')
const { inspect } = require('util')

/**
	 * @param { object } param0 
	 * @param { Message } [param0.newMessage] 
	 * @param { Client } [param0.client]  
	 * @param { Database } [param0.Database]  
	 * @param { Collections } [param0.Collections] 
	 */
module.exports = async function ({ newMessage, client, Database }) {
	if (newMessage.id != client.eval.user.id) return
	const Commands = client.eval.Commands
	try {
		client.eval.client.edit({ embed: { title: '🖥️ Console de Echidna.', color: client.colors.base, description: `\`\`\`js\n${inspect(await eval(newMessage.content), false, 0).slice(0, 1990)}\`\`\`` } })
	} catch (err) {
		client.eval.client.edit({ embed: { title: '🖥️ Console de Echidna.', color: client.colors.base, description: `\`\`\`js\n[${err.name}]: ${err.message}\`\`\`` } })
	}
}
