const { Message, Client } = require('discord.js')
const { Database } = require('discord-echidna')

const tools = [{ types: ['fishing', 'canne'], name: '🐟 Canne à pêche', arr: [['Branche'], ['Canne en bois', 0, 0], ['Canne renforcée', 0, 0], ['', 0, 0], ['', 0, 0], ['', 0, 0], ['', 0, 0], ['', 0, 0], ['', 0, 0], ['', 0, 0], ['', 0, 0]] }]

const content = ({ message, client, docs }) => {}

module.exports = {
	/**
	 * @param { object } param0 
	 * @param { Client } [param0.client] 
	 * @param { Message } [param0.message] 
	 * @param { Database } [param0.Database] 
	 */
	exec: async function ({ client, message, Database }) {
		const docs = { tools: Database.open(message.member.id, 'user-tools'), eco: Database.open(message.member.id, 'user-eco') }
		const menu = await message.channel.send({ embed: content({ message, client, docs }) })

		const collector = menu.channel.createMessageCollector((m) => message.author.id == m.author.id)
		menu.react('🔓').then(() => {
			menu.awaitReactions((r, u) => u.id == message.author.id && r.emoji.name == '🔓', { time: 9e5, max: 1 }).then(() => {
				menu.reactions.removeAll().catch(() => null)
				menu.react('🔒').catch(() => null)
				collector.stop()
			})
		}, () => null)

		collector.on('collect', (msg) => {
			const [command] = msg.content.toLowerCase().split(/\s+/)
			const tool = tools.find(({ types }) => types.includes(command))
			if (docs.tools.content[tool.types[0]].tool >= tool.arr.length) return message.sendError('Votre outil est déjà à son niveau max')
		})
	},
	options: { name: 'tools', aliases: ['tool'], cooldown: 8, permissions: { client: ['EMBED_LINKS'] } }
}
