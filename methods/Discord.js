const Discord = require('discord.js')

// Send a Error Message
/**
 * @param {String} content 
 * @returns 
 */
Discord.Message.prototype.sendError = function (content) {
	return this.channel.send(`${this.author} **\` | ❌ ${content}\`**`)
}
