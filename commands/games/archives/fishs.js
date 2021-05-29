const { Message, Client } = require('discord.js')
const { Database } = require('discord-echidna')

const items = []
for (const item of require('../../../_storage/rules/items.json').fishing.items) items.unshift(item)
const emotes = ['🐟', '🐠', '🦈', '🐡', '🦀', '🐬']

module.exports = {
	/**
	 * @param { object } param0 
	 * @param { Message } [param0.message] 
	 * @param { Client } [param0.client] 
	 * @param { Database } [param0.Database]  
	 */
	exec: function ({ message, client, Database }) {
		const { inventory } = Database.open(message.member.id, 'user-tools').cache.fishing

		const format = (array, pages) => ({
			embed: {
				color: client.colors.archives,
				author: { name: '🐠 Liste des poissons', icon_url: message.author.displayAvatarURL({ dynamic: true }) },
				description: '\u200B',
				fields: array.map((fish) => {
					const known = inventory.find((_) => _[0] == fish.id)
					return { name: known ? emotes.random() + ' ' + fish.name : '[Espèce non découverte]', value: known ? '`' + known[1] + ' commun' + (fish.f ? 'e' : '') + 's | ' + known[2] + ' doré' + (fish.f ? 'e' : '') + 's`' : '\u200B', inline: true }
				}),
				footer: { text: 'Page ' + pages.number + ' / ' + pages.total }
			}
		})

		message.createPages(items, format, { limit: 9 })
	},
	options: { name: 'fishs', aliases: ['fish'], cooldown: 6, permissions: { client: ['EMBED_LINKS', 'ADD_REACTIONS'] } }
}
