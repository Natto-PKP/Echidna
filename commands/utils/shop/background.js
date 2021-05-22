const { Message, Client } = require('discord.js')
const { Database } = require('discord-echidna')

const wallpapers = require('../../../_storage/images/wallpapers.json')

const content = ({ menu, client, docs }) => {
	const image = menu.images[menu.page]
	const embed = {
		author: { name: '[Background shop] - ' + image.name + (docs.profile.content.wallpapers.arr.includes(image.path) ? ' (Déjà acheté)' : '') },
		description: '```diff\n+ ' + image.tags.join(', ') + '```\n```css\nfont: ' + image._colors.font + '\naccent: ' + image._colors.accent + '```',
		color: docs.profile.content.wallpapers.arr.includes(image.path) ? client.colors.active : client.colors.shop,
		image: { url: image.link },
		footer: { text: (menu.images.length > 1 ? 'Item ' + (menu.page + 1) + ' / ' + menu.images.length + ' •' : '') + docs.eco.content.tickets.form() + ' 🎟️ • ' + docs.eco.content.money.form() + ' 💴 | path: ' + image.path }
	}

	if (image.price && (embed.fields = [])) {
		if (image.price.tickets) embed.fields.push({ name: '\u200B', value: '🎟️ `' + image.price.tickets.form() + '` tickets.', inline: true })
		if (image.price.money) embed.fields.push({ name: '\u200B', value: '💴 `' + image.price.money.form() + '` yens.', inline: true })
	}

	return embed
}

module.exports = {
	/**
	 * @param { object } param0 
	 * @param { Client } [param0.client] 
	 * @param { Message } [param0.message] 
	 * @param { string[] } [param0.args] 
	 * @param { Database } [param0.Database] 
	 */
	exec: async function ({ client, message, args, Database }) {
		const images = args.slice(1).length ? wallpapers.filter(({ name, path, tags }) => args.slice(1).join(' ') == name.toLowerCase() || [path.toLowerCase(), ...tags].partly(args.slice(1))) : wallpapers
		if (!images.length) return message.sendError('Aucune image correspondante à votre filtre.')
		const [docs, menu] = [{ profile: Database.open(message.member.id, 'user-profile'), eco: Database.open(message.member.id, 'user-eco') }, { images, page: 0 }]
		menu.msg = await message.channel.send({ embed: content({ menu, client, docs }) })

		if (images.length > 1) {
			await Promise.all(['◀️', '🔴', '🛒', '▶️'].map((icon) => menu.msg.react(icon)))
			menu.collector = menu.msg.createReactionCollector((r, u) => ['◀️', '🔴', '🛒', '▶️'].includes(r.emoji.name) && u.id == message.member.id, { idle: 60000 })
			let cooldown
			menu.collector.on('collect', async (reaction, user) => {
				await reaction.users.remove(user).catch(() => null)
				if (cooldown && cooldown - Date.now() > 0) return

				if (reaction.emoji.name === '🛒') {
					const image = menu.images[menu.page]
					if (image.tags.includes('premium') && !docs.profile.content.premium) return message.sendError("Ce background n'est disponible seulement pour les membres premium.").then((_) => _.delete({ timeout: 6000 }).catch(() => null))

					if (image.price) {
						if (image.price.money && image.price.tickets && docs.eco.content.money < image.price.money && docs.eco.content.tickets < image.price.tickets)
							return message.sendError('**' + (image.price.money - docs.eco.content.money).form() + '** 💴 yens manquants et **' + (image.price.tickets - docs.eco.content.tickets).form() + '** 🎟️ tickets manquants.').then((_) => _.delete({ timeout: 6000 }).catch(() => null))
						if (image.price.money && docs.eco.content.money < image.price.money) return message.sendError('**' + (image.price.money - docs.eco.content.money).form() + '** 💴 yens manquants.').then((_) => _.delete({ timeout: 6000 }).catch(() => null))
						if (image.price.tickets && docs.eco.content.tickets < image.price.tickets) return message.sendError('**' + (image.price.tickets - docs.eco.content.tickets).form() + '** 🎟️ tickets manquants.').then((_) => _.delete({ timeout: 6000 }).catch(() => null))
						docs.eco.update({ money: image.price.money ? docs.eco.content.money - image.price.money : docs.eco.content.money, tickets: image.price.tickets ? docs.eco.content.tickets - image.price.tickets : docs.eco.content.tickets }).save()
					}

					docs.profile.update({ active: image.path, arr: image.path }, { path: 'wallpapers' }).save()
				} else if (reaction.emoji.name === '◀️') menu.images[menu.page - 1] ? --menu.page : (menu.page = menu.images.length - 1)
				else if (reaction.emoji.name === '▶️') menu.images[menu.page + 1] ? ++menu.page : (menu.page = 0)
				else if (reaction.emoji.name === '🔴') return menu.collector.stop()
				cooldown = 1500 + Date.now()
				await menu.msg.edit({ embed: content({ menu, client, docs }) }).catch(() => menu.collector.stop())
			})
		} else {
			const image = menu.images[menu.page]
			if (docs.profile.content.wallpapers.arr.includes(image.path)) return

			await Promise.all(['🔴', '🛒'].map((e) => menu.msg.react(e).catch(() => null)))
			menu.collector = menu.msg.createReactionCollector((r, u) => ['🔴', '🛒'].includes(r.emoji.name) && u.id == message.member.id, { idle: 45000, max: 1 })
			menu.collector.on('collect', (reaction) => {
				if (reaction.emoji.name === '🛒') {
					if (image.tags.includes('premium') && !docs.profile.content.premium) return message.sendError("Ce background n'est disponible seulement pour les membres premium.").then((_) => _.delete({ timeout: 6000 }).catch(() => null))

					if (image.price) {
						if (image.price.money && image.price.tickets && docs.eco.content.money < image.price.money && docs.eco.content.tickets < image.price.tickets)
							return message.sendError('**' + (image.price.money - docs.eco.content.money).form() + '** 💴 yens manquants et **' + (image.price.tickets - docs.eco.content.tickets).form() + '** 🎟️ tickets manquants.').then((_) => _.delete({ timeout: 6000 }).catch(() => null))
						if (image.price.money && docs.eco.content.money < image.price.money) return message.sendError('**' + (image.price.money - docs.eco.content.money).form() + '** 💴 yens manquants.').then((_) => _.delete({ timeout: 6000 }).catch(() => null))
						if (image.price.tickets && docs.eco.content.tickets < image.price.tickets) return message.sendError('**' + (image.price.tickets - docs.eco.content.tickets).form() + '** 🎟️ tickets manquants.').then((_) => _.delete({ timeout: 6000 }).catch(() => null))
						docs.eco.update({ money: image.price.money ? docs.eco.content.money - image.price.money : docs.eco.content.money, tickets: image.price.tickets ? docs.eco.content.tickets - image.price.tickets : docs.eco.content.tickets }).save()
					}

					docs.profile.update({ active: image.path, arr: image.path }, { path: 'wallpapers' }).save()
				} else if (reaction.emoji.name === '🔴') return menu.collector.stop('buy')
			})
		}

		menu.collector.on('end', (reason) => {
			menu.msg.reactions.removeAll().catch(() => null)
			menu.msg.edit({ embed: reason == 'buy' ? content({ menu, client, docs }) : { color: client.colors.shop, author: { name: message.member.displayName + ' a quitté(e) la boutique de fonds de profil.', icon_url: message.author.avatarURL({ dynamic: true }) } } }).catch(() => null)
		})
	},
	options: { name: 'background', aliases: ['bg'], cooldown: 8, permissions: { client: ['EMBED_LINKS', 'ADD_REACTIONS'] } }
}
