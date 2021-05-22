const { Message, Client } = require('discord.js')

module.exports = {
	/**
	 * @param { object } param0 
	 * @param { Message } [param0.message] 
	 * @param { Client } [param0.client] 
	 */
	exec: async function ({ message, client }) {
		const [bots, users] = message.guild.members.cache.partition((m) => m.user.bot)

		message.channel.send({
			embed: {
				author: { name: message.guild.name, icon_url: message.guild.iconURL({ dynamic: true }) },
				thumbnail: { url: message.guild.owner.user.avatarURL({ format: 'png', dynamic: true, size: 512 }) },
				color: client.colors.base,
				description: '> **' + users.size + '** membres sur le serveur `[' + (bots.size > 1 ? bots.size + ' bots' : '1 bot') + ']`',
				fields: [
					{
						name: '💤 Salon AFK ' + (message.guild.afkChannel ? '- **' + new Date(message.guild.afkTimeout).duration() + '**' : ''),
						value: message.guild.afkChannel ? '**' + message.guild.afkChannel.name + '**' + (message.guild.afkChannel.parent ? ' `[' + message.guild.afkChannel.parent.name + ']`' : '') : '`Aucun`',
						inline: true
					},
					{ name: '🛠️ Owner', value: message.guild.owner, inline: true },
					{ name: '\u200B', value: '`| ' + message.guild.emojis.cache.size + ' emoji(s)` `| ' + message.guild.roles.cache.size + ' role(s)` ' + ((await message.guild.fetchBans().catch(() => false)) ? '`| ' + (await message.guild.fetchBans()).size + ' ban(s)`' : '') }
				],
				footer: { text: 'Créer le: ' + new Date(message.guild.createdAt).format('DD MMMM YYYY') }
			}
		})
	},
	options: { name: 'guild', aliases: ['gi'], cooldown: 1, modules: './commands/info/guild', permissions: { client: ['EMBED_LINKS'] } }
}
