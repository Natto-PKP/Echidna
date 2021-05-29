const { Message, Client } = require('discord.js')
const { Commands, Database } = require('discord-echidna')

module.exports = {
	/**
	 * @param { object } param0 
	 * @param { Client } [param0.client] 
	 * @param { Message } [param0.message] 
	 * @param { string[] } [param0.args] 
	 * @param { Commands } [param0.Commands] 
	 * @param { Database } [param0.Database] 
	 */
	exec: async function ({ client, message, args, Commands, Database }) {
		const cmd = Commands.get(...args)
		if (cmd) return cmd.help ? message.channel.send({ embed: Object.assign({ color: client.colors.base, author: { name: '💌 Commande ' + cmd.options.name, icon_url: message.guild.iconURL({ dynamic: true }) }, footer: { text: cmd.options.aliases.length ? 'aliases: ' + cmd.options.aliases.join(' ') : 'Aucun alias' } }) }) : message.sendError("Cette commande n'a pas de help.")
		const categories = { config: ['🛠 Configurations', []], fun: ['🧶 Occupation', []], games: ['🎲 Jeux', []], info: ['📰 Informations', []], utils: ['🧪 Outils', []] }
		Commands.array.filter(({ options: { permissions: { flags } } }) => !flags.includes('owner')).forEach(({ options: { name, modules, category } }) => categories[category][1].push(name + (modules.length ? '[' + modules.length + ']' : '')))
		message.channel.send({
			embed: { color: client.colors.base, author: { name: "💌 Page d'aide de Echidna", icon_url: message.guild.iconURL({ dynamic: true }) }, description: '**`| `  Le prefix de la guilde est: `' + Database.open(message.guild.id, 'guild-config').content.prefix + '`**', fields: Object.values(categories).map(([name, arr]) => ({ name, value: '`' + arr.join('` `') + '`' })) }
		})
	},
	options: { name: 'help', aliases: ['h'], cooldown: 3, permissions: { client: ['EMBED_LINKS'] } }
}
