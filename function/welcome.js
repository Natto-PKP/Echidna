const { createCanvas, loadImage } = require('canvas')

module.exports = async ({ user, guild, image, color }) => {
	const tag = (user.tag.length > 22 ? user.tag.slice(0, 20) + '..' : user.tag) + '#' + user.discriminator
	const count = 'no ' + guild.memberCount.form()
	image = image && (await loadImage(image).catch(() => null))

	const ctx = createCanvas(1070, 420).getContext('2d')
	if (image) ctx.drawImage(image, 0, 0, ctx.canvas.width, ctx.canvas.height)

	// Tag
	ctx.font = '56px "Do Hyeon"'
	ctx.roundRect(262, 48, ctx.measureText(tag).width > 370 ? 50 + ctx.measureText(tag).width : 420, 86, 8)
	ctx.fillStyle = 'rgba(10, 10, 10, 0.75)'
	ctx.fill()
	ctx.lineWidth = '2px'
	ctx.strokeStyle = 'rgb(10, 10, 10)'
	ctx.stroke()
	ctx.fillStyle = color
	ctx.fillText(tag, 290 + (ctx.measureText(tag).width > 370 ? 0 : 370 - ctx.measureText(tag).width), 110)

	// Count
	ctx.font = '36px "Do Hyeon"'
	ctx.roundRect(262, 134, 50 + ctx.measureText(count).width, 40, 4)
	ctx.fillStyle = color
	ctx.fill()
	ctx.fillStyle = 'rgb(10, 10, 10)' // '#f5f0f0'
	ctx.fillText(count, 290, 166)

	// Avatar
	ctx.fillStyle = 'rgb(10, 10, 10)'
	ctx.roundRect(28, 28, 244, 244, 8)
	ctx.fill()
	ctx.roundRect(30, 30, 240, 240, 8)
	ctx.clip()
	ctx.drawImage(await loadImage(user.displayAvatarURL({ format: 'png', size: 512 })), 30, 30, 240, 240)

	return ctx.canvas.toBuffer()
}
