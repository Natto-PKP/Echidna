module.exports = {
	exec: async function ({ client, message, args }) {
		const member = args[0] != 'random' ? (args[0] && (await message.guild.members.select(args.join(' ')))) || message.member : message.guild.members.cache.random()
		const url = member.user.displayAvatarURL({ format: 'png', dynamic: true, size: 2048 })
		message.channel.send(message.guild.me.permissionsIn(message.channel).has('EMBED_LINKS') ? { embed: { color: client.colors.base, description: '📸 | Image de profile de ' + member.displayName, image: { url } } } : '📸 | Image de profile de ' + member.displayName + '\n' + url)
	},
	options: { name: 'avatar', aliases: ['pp'], cooldown: 1 },
	help: { category: 'info' }
}
