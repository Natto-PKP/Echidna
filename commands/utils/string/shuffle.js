const { Message } = require('discord.js')

module.exports = {
	/**
	 * @param { object } param0 
	 * @param { Message } [param0.message] 
	 * @param { string[] } [param0.args] 
	 */
	exec: function ({ message, args }) {
		const content = message.content.slice(['-word', '-w'].includes(args[1]) ? message.content.indexOf(args[1]) + args[1].length : message.content.indexOf(args[0]) + args[0].length).trim()
		if (!content) return message.sendError("Echidna n'a pas votre texte")
		;['-word', '-w'].includes(args[1]) ? message.channel.send(content.toWords().shuffle().join(' ')) : message.channel.send(content.shuffle())
	},
	options: { name: 'shuffle', aliases: ['sh'], cooldown: 1 }
}
