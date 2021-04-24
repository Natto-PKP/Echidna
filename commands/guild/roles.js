module.exports = {
	exec: function ({ client, message }) {
		const roles = message.guild.roles.cache.filter((role) => role.name !== '@everyone' && !role.managed)
		if (!roles.size) return message.sendError("Le serveur n'a pas de rôle.")

		const format = (array, { number, total }) => ({
			embed: {
				author: { name: 'Rôles de la guilde', icon_url: message.guild.iconURL({ dynamic: true }) },
				color: client.colors.base,
				description: array.map((role) => role.toString() + '`[' + role.members.size + ']`').join(' '),
				footer: { text: 'pages: ' + number + '/' + total + ' • ' + roles.size + ' roles' }
			}
		})

		message.createPages(roles, format, { limit: 40 })
	},
	options: { name: 'roles', cooldown: 3, permissions: { client: ['EMBED_LINKS', 'ADD_REACTIONS'] } }
}
