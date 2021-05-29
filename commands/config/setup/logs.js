const { Message, Client } = require('discord.js')
const { Database } = require('discord-echidna')

const joinImage = require('../../../function/welcome')
const defaults = { messages: require('../../../_storage/messages/default.json').logs, rules: require('../../../_storage/rules/default.json').logs }
const logs = ['ban', 'unban', 'message-delete', 'message-update', 'join', 'leave']

const content = ({ message, client, doc }) => {
	return {
		color: client.colors.config,
		author: { name: '🧪 Configuration des logs', icon_url: message.guild.iconURL({ dynamic: true }) },
		description: '**`| commandes: channel, message, preview, image, color`**\n**`| exemple`** Tapez directement `join channel <#salon>`',
		fields: [['ban', 'unban'], ['message-update', 'message-delete'], ['leave'], ['join']].map((arr) => ({
			name: '\u200B',
			value: arr
				.map((type) => {
					const log = doc.cache.arr.find((_) => _.type == type)
					const channel = log && log.channel && message.guild.channels.select(log.channel, { strict: true })
					if (type != 'join') return '**`' + (channel ? '🟢' : '🟠') + ' ' + type + (type == 'leave' ? ' [preview]' : '') + '`**\n' + `${channel || '\u200B'}`
					return '**`' + (channel ? '🟢' : '🟠') + ' ' + type + ` [preview]\`**  ${channel || ''}` + '```asciidoc\ncolor :: ' + ((log && log.color) || defaults.rules.join.color) + '\nimage :: ' + (log && log.image ? "'join preview' pour voir votre image" : 'aucune image') + '```'
				})
				.join('\n\n'),
			inline: arr.includes('join') ? false : true
		})),
		footer: { text: 'Cliquez sur 🔓 pour fermer le menu' }
	}
}

module.exports = {
	/**
	 * @param { object } param0 
	 * @param { Message } [param0.message] 
	 * @param { Client } [param0.client] 
	 * @param { Database } [param0.Database] 
	 */
	exec: async function ({ message, client, Database }) {
		const doc = Database.open(message.guild.id, 'guild-logs')
		const menu = await message.channel.send({ embed: content({ message, client, doc }) })

		const collector = menu.channel.createMessageCollector((m) => message.author.id == m.author.id)
		menu.react('🔓').then(() => {
			menu.awaitReactions((r, u) => u.id == message.author.id && r.emoji.name == '🔓', { time: 9e5, max: 1 }).then(() => {
				menu.reactions.removeAll().catch(() => null)
				menu.react('🔒').catch(() => null)
				collector.stop()
			})
		}, () => null)

		collector.on('collect', async (msg) => {
			const [command, ...args] = msg.content.toLowerCase().split(/\s+/)
			if (!['cancel', 'all', ...logs].includes(command)) return

			switch (args[0]) {
				case 'channel':
					const channel = args[1] && message.guild.channels.select(args.slice(1).join(' '), { type: 'text' })
					if (!channel) return message.sendError('Echidna ne trouve pas le salon indiqué', { remove: true })
					;(!doc.cache.arr.some(({ type }) => type == command) ? doc.update({ type: command, channel: channel.id }, { path: 'arr' }) : doc.update({ channel: channel.id }, { path: 'arr', index: ({ type }) => type == command })).save()
					menu.edit({ embed: content({ message: msg, client, doc }) })
					break

				case 'color':
					// Faire l'image si dessous avant de vouloir faire la couleur.
					break

				case 'image':
					/**
					 * Faire une API pour stocker les images persos des guildes.
					 * Il faudra vérifié si le lien donné est bien une image.
					 * Si c'est bien une image, il faudra la retaillée pour qu'elle entre parfaitement dans le canvas.
					 * Une fois ça de fait, il faut l'envoyé dans l'api avec l'id de la guilde comme key.
					 * Ensuite, on récupère le lien de l'image dans l'api pour le mettre dans la db. (Ou l'idéal, c'est de ne même pas utilisé la db et directement fetch l'api.)
					 */
					break

				case 'message':
					if (!['join', 'leave'].includes(command)) return msg.sendError('Ce log ne prend pas en charge les messages personnalisés.', { remove: true })
					const string = msg.content.slice(msg.content.indexOf(args[0]) + 8)

					if (string.length > 200) return msg.sendError('Le message personnalisé ne doit pas être supérieur à 200 caractères.', { remove: true })
					if (string.length < 10) return msg.sendError('Le message personnalisé doit être supérieur à 10 caractères.', { remove: true })
					;(!doc.cache.arr.some(({ type }) => type == command) ? doc.update({ type: command, message: string }, { path: 'arr' }) : doc.update({ message: string }, { path: 'arr', index: ({ type }) => type == command })).save()
					menu.edit({ embed: content({ message: msg, client, doc }) })
					break

				case 'preview':
					if (!['join', 'leave'].includes(command)) return msg.sendError('Ce log ne prend pas en charge les messages personnalisés.', { remove: true })
					const log = doc.cache.arr.find(({ type }) => type == command)
					if (command == 'leave') message.channel.send(((log && log.message) || defaults.messages['fr'][command]).form({ member: message.member, guild: message.guild }))
					else message.channel.send({ content: ((log && log.message) || defaults.messages['fr'][command]).form({ member: message.member, guild: message.guild }), files: [{ attachment: await joinImage({ user: message.author, guild: message.guild, color: (log && log.color) || defaults.rules.join.color, image: log && log.image }) }] })
					break

				default:
					;(!doc.cache.arr.some(({ type }) => type == command) ? doc.update({ type: command }, { path: 'arr' }) : doc.remove({ path: 'arr', index: ({ type }) => type == command })).save()
					menu.edit({ embed: content({ message: msg, client, doc }) })
					break
			}
		})
	},
	options: { name: 'logs', aliases: ['log'], cooldown: 8, permissions: { users: ['MANAGE_GUILD'], client: ['EMBED_LINKS', 'ADD_REACTIONS'] } }
}
