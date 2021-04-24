module.exports = {
	exec: function ({ client, message, args }) {
		if (!message.guild.emojis.cache.size) return message.sendError("Le serveur n'a pas d'emojis.")

		if (args[1]) {
			const emoji = message.guild.emojis.select(args.slice(1).join(' '))
			if (!emoji) return message.sendError("Je n'ai pas trouvé cet emoji.")
			message.channel.send({ embed: { color: client.colors.base, thumbnail: { url: emoji.url }, description: 'Télécharger le **[sur ce lien](' + emoji.url + ')**' } })
		} else {
			const format = (array, { number, total }) => ({
				embed: {
					author: { name: 'Emojis de la guilde', icon_url: message.guild.iconURL({ dynamic: true }) },
					color: client.colors.base,
					description: array.map((emoji) => emoji.toString() + ' - [Télécharger](' + emoji.url + ')').join('\n'),
					footer: { text: 'pages: ' + number + '/' + total + ' • ' + message.guild.emojis.cache.size + ' emojis' }
				}
			})

			message.createPages(message.guild.emojis.cache, format, { limit: 10 })
		}
	},
	options: { name: 'emojis', aliases: ['emotes'], cooldown: 3, permissions: { client: ['EMBED_LINKS', 'ADD_REACTIONS'] } }
}
