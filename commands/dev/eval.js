const { Message, Client } = require('discord.js')
const { Database, Commands, Collections } = require('discord-echidna')
const { inspect } = require('util')

module.exports = {
	/**
	 * @param { object } param0 
	 * @param { Message } [param0.message] 
	 * @param { Client } [param0.client] 
	 * @param { string } [param0.command] 
	 * @param { Database } [param0.Database] 
	 * @param { Commands } [param0.Commands] 
	 * @param { Collections } [param0.Collections] 
	 */
	exec: async function ({ message, client, command, Database, Commands, Collections }) {
		client.eval = { user: message, Commands }
		try {
			client.eval.client = await message.channel.send({ embed: { title: '🖥️ Console de Echidna.', color: client.colors.base, description: `\`\`\`js\n${inspect(await eval(message.content.slice(message.content.indexOf(command) + command.length).trim()), false, 0).slice(0, 1990)}\`\`\`` } })
		} catch (err) {
			client.eval.client = await message.channel.send({ embed: { title: '🖥️ Console de Echidna.', color: client.colors.base, description: `\`\`\`js\n[${err.name}]: ${err.message}\`\`\`` } })
		}
	},
	options: { name: 'eval', cooldown: 2, permissions: { flags: ['owner'] } }
}
