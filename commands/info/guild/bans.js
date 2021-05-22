const { Message, Client } = require('discord.js')

module.exports = {
	/**
	 * @param { object } param0 
	 * @param { Client } [param0.client] 
	 * @param { Message } [param0.message] 
	 * @param { string[] } [param0.args] 
	 */
	exec: async function ({ client, message, args }) {
		const bans = await message.guild.fetchBans()
		if (!bans.size) return message.sendError("Il n'y a aucun ban sur le serveur.")

		if (args[1]) {
			const ban = bans.find((obj) => obj.user.id == args[1] || obj.user.username.toLowerCase().includes(args.slice(1).join(' ')))
			if (!ban) return message.sendError("Je n'ai pas trouvé cet utilisateur dans les bannis.")
			message.channel.send({ embed: { color: client.colors.base, author: { name: 'La sanction de ' + ban.user.tag, icon_url: message.guild.iconURL({ dynamic: true }) }, description: '**`| `** ' + (ban.reason || 'Aucune raison spécifiée'), thumbnail: { url: ban.user.avatarURL({ dynamic: true }) } } })
		} else {
			const format = (array, { number, total }) => ({
				embed: {
					color: client.colors.base,
					author: { name: 'Les utilisateurs bannis de la guilde', icon_url: message.guild.iconURL({ dynamic: true }) },
					description: array.map((ban) => '**`' + ban.user.id + '`** - Pseudo: `' + ban.user.username + '`').join('\n'),
					footer: { text: 'page: ' + number + '/' + total + ' • ' + bans.size + ' bans' }
				}
			})

			message.createPages(bans, format, { limit: 20 })
		}
	},
	options: { name: 'bans', cooldown: 3, permissions: { client: ['EMBED_LINKS', 'ADD_REACTIONS', 'BAN_MEMBERS', 'READ_MESSAGE_HISTORY'], users: ['BAN_MEMBERS'] } }
}
