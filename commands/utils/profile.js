const { Message } = require('discord.js')
const { Database } = require('discord-echidna')
const { createCanvas, loadImage } = require('canvas')

const wallpapers = require('../../_storage/images/wallpapers.json')
const { rules: { exp } } = require('../../config')

module.exports = {
	/**
     * @param { object } param0 
     * @param { Message } [param0.message] 
     * @param { string[] } [param0.args] 
     * @param { Database } [param0.Database] 
     */
	exec: async function ({ message, args, Database }) {
		const member = (args[0] && message.guild.members.select(args.join(' '))) || message.member
		const docs = { profile: Database.open(member.id, 'user-profile'), exp: Database.open(member.id, 'user-exp'), eco: Database.open(member.id, 'user-eco') }
		const wallpaper = wallpapers.find(({ path }) => docs.profile.cache.wallpapers.active == path)

		const ctx = createCanvas(1070, 420).getContext('2d')

		ctx.save()
		ctx.drawImage(await loadImage('./_storage/images/wallpapers/' + wallpaper.path + '.png'), 0, 0, ctx.canvas.width, ctx.canvas.height)

		// Avatar
		ctx.fillStyle = 'rgb(10, 10, 10)'
		ctx.roundRect(26, 156, 244, 244, 8)
		ctx.fill()
		ctx.roundRect(28, 158, 240, 240, 8)
		ctx.clip()
		ctx.drawImage(await loadImage(member.user.displayAvatarURL({ format: 'png', size: 512 })), 28, 158, 240, 240)
		ctx.restore()

		// Exp bar
		ctx.roundRect(280, 326, 364, 74, 8)
		ctx.fillStyle = 'rgb(10, 10, 10)'
		ctx.fill()
		ctx.roundRect(288, 333, docs.exp.cache.exp / exp(docs.exp.cache.level) * 100 * 3.52 > 20 ? docs.exp.cache.exp / exp(docs.exp.cache.level) * 100 * 3.52 : 20, 60, 8)
		ctx.fillStyle = wallpaper._colors.accent
		ctx.fill()
		ctx.restore()

		// Level bar
		ctx.font = '52px "Do Hyeon"'
		const levelContentWidth = ctx.measureText(docs.exp.cache.level).width
		ctx.roundRect(282, 271, 45 + levelContentWidth, 50, 4)
		ctx.fillStyle = 'rgba(10, 10, 10, .75)'
		ctx.fill()
		ctx.strokeStyle = wallpaper._colors.accent
		ctx.lineWidth = 2
		ctx.stroke()
		ctx.fillStyle = wallpaper._colors.accent
		ctx.fillText(docs.exp.cache.level, 282 + (45 + levelContentWidth) / 2 - levelContentWidth / 2, 314)

		// Ticket
		let x = 339 + levelContentWidth
		ctx.drawImage(await loadImage('./_storage/icons/tickets.png'), x, 275, 42, 42)
		ctx.font = '28px "Knewave"'
		ctx.fillStyle = wallpaper._colors.font
		ctx.strokeStyle = 'rgb(10, 10, 10)'
		ctx.fillText(docs.eco.cache.tickets.form(), x + 47, 306)
		ctx.strokeText(docs.eco.cache.tickets.form(), x + 47, 306)

		// Money
		ctx.drawImage(await loadImage('./_storage/icons/money.png'), (x = x + 67 + ctx.measureText(docs.eco.cache.tickets.form()).width) && x, 275, 42, 42)
		ctx.fillText(docs.eco.cache.money.form(), x + 52, 306)
		ctx.strokeText(docs.eco.cache.money.form(), x + 52, 306)

		message.channel.send({ files: [{ attachment: ctx.canvas.toBuffer(), name: 'profile.png' }] })
	},
	options: { name: 'profile', cooldown: 8, permissions: { client: ['ATTACH_FILES'] } }
}
