const { Message } = require('discord.js')

module.exports = {
	/**
	 * @param { object } param0 
	 * @param { Message } [param0.message] 
	 * @param { string } [param0.command] 
	 */
	exec: function ({ message, command }) {
		const content = message.content.slice(message.content.indexOf(command) + command.length).trim()
		if (!content.length) return message.sendError("Echidna n'a pas votre texte.")

		message.channel.send('```js\n{ caractere: ' + content.length + ', no_space: ' + content.split(/\s+/g).join('').length + ', words: ' + content.toWords().length + ' }```')
	},
	options: { name: 'string', cooldown: 1, modules: './commands/utils/string' }
}
