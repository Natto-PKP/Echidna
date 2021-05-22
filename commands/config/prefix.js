const { Message } = require('discord.js')
const { Database } = require('discord-echidna')

module.exports = {
	/**
	 * @param { object } param0 
	 * @param { Message } [param0.message] 
	 * @param { string[] } [param0.args] 
	 * @param { Database } [param0.Database] 
	 */
	exec: function ({ message, args, Database }) {
		const prefix = args[0] && ('reset' == args[0] ? '"' : args[0].replace(/((\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff]\s?)+)/g, ''))
		if (!prefix || !prefix.length) return message.sendError('Veuillez inscrire le nouveau prefix.')
		if (prefix.length > 3) return message.sendError('Le prefix ne peut pas être supérieur à 3 caractères.')

		const doc = Database.open(message.guild.id, 'guild-config')
		if (doc.content.prefix == prefix) return message.sendError("Votre nouveau prefix est identique à l'actuel.")
		doc.set(prefix, { path: 'prefix' }).save()
		message.channel.send('**`| 🔑`** Le prefix a été modifié: **`' + prefix + '`**')
	},
	options: { name: 'prefix', cooldown: 8, permissions: { users: ['MANAGE_GUILD'] } }
}
