const { Message, Client } = require('discord.js')
const { Database } = require('discord-echidna')

const wallpapers = require('../../../_storage/images/wallpapers.json')

content = ({ menu, client, doc }) => {
	const image = menu.images[menu.page]
	return {
		author: { name: '[Background inventory] - ' + image.name + (image.path == doc.cache.wallpapers.active ? ' (Déjà équipée)' : '') },
		description: '```diff\n+ ' + image.tags.join(', ') + '```\n```css\nfont: ' + image._colors.font + '\naccent: ' + image._colors.accent + '```',
		color: image.path == doc.cache.wallpapers.active ? client.colors.active : client.colors.shop,
		image: { url: image.link },
		footer: { text: (menu.images.length > 1 ? 'Item ' + (menu.page + 1) + ' / ' + menu.images.length + ' |' : '') + ' path: ' + image.path }
	}
}

module.exports = {
	/**
	 * @param { object } param0 
	 * @param { Client } [param0.client] 
	 * @param { Message } [param0.message] 
	 * @param { Database } [param0.Database] 
	 * @param { string[] } [param0.args] 
	 */
	exec: async function ({ client, message, Database, args }) {
		const doc = Database.open(message.member.id, 'user-profile')
		const _wallpapers = wallpapers.filter(({ path }) => doc.cache.wallpapers.arr.includes(path))
		const images = args.slice(1).length ? _wallpapers.filter(({ name, path, tags }) => args.slice(1).join(' ') == name.toLowerCase() || [path.toLowerCase(), ...tags].partly(args.slice(1))) : _wallpapers
		if (!images.length) return message.sendError('Aucune image correspondante à votre filtre.')

		const menu = { images, page: 0 }
		menu.msg = await message.channel.send({ embed: content({ menu, client, doc }) })

		if (images.length > 1) {
			await Promise.all(['◀️', '🔴', '🏷', '▶️'].map((icon) => menu.msg.react(icon)))
			menu.collector = menu.msg.createReactionCollector((r, u) => ['◀️', '🔴', '🏷', '▶️'].includes(r.emoji.name) && u.id == message.member.id, { idle: 60000 })
			let cooldown
			menu.collector.on('collect', async (reaction, user) => {
				await reaction.users.remove(user).catch(() => null)
				if (cooldown && cooldown - Date.now() > 0) return

				if (reaction.emoji.name === '🏷') menu.images[menu.page].path != doc.cache.wallpapers.active && doc.set(menu.images[menu.page].path, { path: 'wallpapers.active' }).save()
				else if (reaction.emoji.name === '◀️') menu.images[menu.page - 1] ? --menu.page : (menu.page = menu.images.length - 1)
				else if (reaction.emoji.name === '▶️') menu.images[menu.page + 1] ? ++menu.page : (menu.page = 0)
				else if (reaction.emoji.name === '🔴') return menu.collector.stop()

				cooldown = 1500 + Date.now()
				await menu.msg.edit({ embed: content({ menu, client, doc }) }).catch(() => menu.collector.stop())
			})
		} else {
			const image = menu.images[menu.page]
			if (doc.cache.wallpapers.active == image.path) return

			await Promise.all(['🔴', '🏷'].map((e) => menu.msg.react(e).catch(() => null)))
			menu.collector = menu.msg.createReactionCollector((r, u) => ['🔴', '🏷'].includes(r.emoji.name) && u.id == message.member.id, { idle: 45000, max: 1 })
			menu.collector.on('collect', (reaction) => {
				if (reaction.emoji.name === '🏷') doc.set(menu.images[menu.page].path, { path: 'wallpapers.active' }).save()
				else if (reaction.emoji.name === '🔴') return menu.collector.stop('stop')
			})
		}

		menu.collector.on('end', (_, reason) => {
			menu.msg.reactions.removeAll().catch(() => null)
			menu.msg.edit({ embed: reason == 'limit' ? content({ menu, client, doc }) : { color: client.colors.shop, author: { name: message.member.displayName + ' a quitté(e) un de ses inventaires.', icon_url: message.author.avatarURL({ dynamic: true }) } } }).catch(() => null)
		})
	},
	options: { name: 'background', aliases: ['bg'], cooldown: 8, permissions: { client: ['EMBED_LINKS', 'ADD_REACTIONS'] } }
}
