const { Message } = require('discord.js')
const { createCanvas, loadImage } = require('canvas')

module.exports = {
	/**
     * @param { object } param0 
     * @param { Message } [param0.message] 
     * @param { string[] } [param0.args] 
     */
	exec: async function ({ message, args }) {
		const member = (args[0] && message.guild.members.select(args.join(' '))) || message.guild.me
		const calc = (parseInt(message.author.id) + parseInt(member.id)) % 101
		const ctx = createCanvas(500, 150).getContext('2d')

		ctx.save()
		ctx.fillStyle = 'rgba(10, 10, 10, .4)'
		ctx.fillRect(0, 35, 500, 80)
		ctx.drawImage(await loadImage('./_storage/icons/' + (calc > 80 ? 'full' : calc > 40 ? 'middle' : 'empty') + '.png'), 185, 10, 130, 130)
		ctx.font = '32px "Press Start 2P"'
		ctx.fillStyle = 'rgb(240, 240, 240)'
		ctx.fillText(calc + '%', 250 - ctx.measureText(calc + '%').width / 2, 90)
		ctx.roundRect(0, 0, 150, 150, 10)
		ctx.fillStyle = 'rgb(10, 10, 10)'
		ctx.fill()
		ctx.roundRect(2, 2, 146, 146, 10)
		ctx.clip()
		ctx.drawImage(await loadImage(message.author.displayAvatarURL({ format: 'png', size: 256 })), 2, 2, 146, 146)
		ctx.restore()
		ctx.roundRect(350, 0, 150, 150, 10)
		ctx.fillStyle = 'rgb(10, 10, 10)'
		ctx.fill()
		ctx.roundRect(352, 2, 146, 146, 10)
		ctx.clip()
		ctx.drawImage(await loadImage(member.user.displayAvatarURL({ format: 'png', size: 256 })), 352, 2, 146, 146)

		message.channel.send({ files: [{ attachment: ctx.canvas.toBuffer(), name: `lovecalc.png` }] })
	},
	options: { name: 'lovecalc', aliases: ['lc'], cooldown: 8, permissions: { client: ['ATTACH_FILES'] } }
}
