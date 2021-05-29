const { Message } = require('discord.js')
const { Database } = require('discord-echidna')
const { rules: { exp } } = require('../../config')

const cooldowns = {}

/**
 * @param { object } param0 
 * @param { Message } [param0.message] 
 */
module.exports = ({ message }) => {
	if (!message.member || message.author.bot || (cooldowns[message.member.id] && cooldowns[message.member.id] - Date.now() > 0)) return
	const doc = Database.open(message.member.id, 'user-exp')
	const [random, req] = [Math.ceil(Math.random() * 7 + 3 + ([0, 6].includes(new Date().getUTCDate()) ? 2 : 1)), exp(doc.content.level)]
	doc.update(doc.content.exp + random >= req ? { level: doc.content.level + 1, exp: doc.content.exp + random - req } : { exp: doc.content.exp + random }).save()
	cooldowns[message.member.id] = Date.now() + 2500
}
