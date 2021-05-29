const { Message } = require('discord.js')
const { Database } = require('discord-echidna')

const loot = require('../../_storage/rules/loot')

module.exports = {
	/**
	 * @param { object } param0 
	 * @param { Message } [param0.message] 
	 * @param { Database } [param0.Database] 
	 */
	exec: function ({ message, Database }) {
		const doc = Database.open(message.member.id, 'user-tools')
		if (doc.cache.fishing.cooldown && doc.cache.fishing.cooldown - Date.now() > 0) return message.channel.send("🧶 Rien n'a encore mordu, patientez encore un peu.")

		const drop = loot('fishing', doc.cache.fishing.tool)
		const gold = Math.random() > 0.95

		message.channel.send('🐟 Vous avez attrapé un' + (drop.f ? 'e' : '') + ' **' + drop.name + (gold ? (drop.f ? ' dorée' : ' doré') : '') + "** d'une valeur de **`" + (gold ? Math.ceil(drop.money * 1.4) : drop.money).form() + ' 💴`**')

		const eco = Database.open(message.member.id, 'user-eco')
		eco.set((gold ? Math.ceil(drop.money * 1.4) : drop.money) + eco.cache.money, { path: 'money' }).save()

		const item = doc.cache.fishing.inventory.find(([id]) => id == drop.id)
		item ? item[gold ? 2 : 1]++ : doc.cache.fishing.inventory.push([drop.id, ...(gold ? [0, 1] : [1, 0])])
		doc.set(Date.now() + 9e5, { path: 'fishing.cooldown' }).save()
	},
	options: { name: 'fishing', cooldown: 3 }
}
