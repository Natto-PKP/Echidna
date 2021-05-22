const Canvas = require('canvas')

Canvas.registerFont('./_storage/fonts/PressStart2P-Regular.ttf', { family: 'Press Start 2P' })
Canvas.registerFont('./_storage/fonts/DoHyeon-Regular.ttf', { family: 'Do Hyeon' })
Canvas.registerFont('./_storage/fonts/Knewave-Regular.ttf', { family: 'Knewave' })

/**
 * @param { number } x
 * @param { number } y
 * @param { number } width
 * @param { number } heigth
 * @param { number } rayon
 */
Canvas.CanvasRenderingContext2D.prototype.roundRect = function (x, y, width, heigth, rayon) {
	this.beginPath()
	this.moveTo(x, y + rayon)
	this.lineTo(x, y + heigth - rayon)
	this.quadraticCurveTo(x, y + heigth, x + rayon, y + heigth)
	this.lineTo(x + width - rayon, y + heigth)
	this.quadraticCurveTo(x + width, y + heigth, x + width, y + heigth - rayon)
	this.lineTo(x + width, y + rayon)
	this.quadraticCurveTo(x + width, y, x + width - rayon, y)
	this.lineTo(x + rayon, y)
	this.quadraticCurveTo(x, y, x, y + rayon)
	this.closePath()
}
