const months = { full: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'], half: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aoû', 'Sep', 'Nov', 'Déc'] }
const days = { full: ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'], half: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'] }
const times = { years: { text: 'année', ms: 31557600000 }, months: { text: 'mois', ms: 2592000000 }, days: { text: 'jour', ms: 86400000 }, hours: { text: 'heure', ms: 3600000 }, minutes: { text: 'minute', ms: 60000 }, seconds: { text: 'seconde', ms: 1000 }, milliseconds: { text: 'milliseconde', ms: 1 } }

Date.prototype.duration = function () {
	let [date, str] = [Date.now() - this.getTime(), undefined]
	Object.values(times).some((obj) => (date > obj.ms ? (str = `**${parseInt(date / obj.ms)}** ${parseInt(date / obj.ms) > 1.5 ? (obj.text.endsWith('s') ? obj.text : obj.text + 's') : obj.text}`) : false))
	return str
}

Date.prototype.format = function (form) {
	if (typeof form != 'string') throw new Error('form must be a string')

	const marks = {
		YYYY: this.getFullYear().toString(),
		YY: this.getUTCFullYear().toString().slice(2),

		MMMM: months.full[this.getMonth()],
		MMM: months.half[this.getMonth()],
		MM: this.getMonth().toString().padStart(2, '0'),
		M: this.getMonth().toString(),

		DDDD: days.full[this.getDay()],
		DDD: days.half[this.getDay()],
		DD: this.getDate().toString().padStart(2, '0'),
		D: this.getDate().toString(),
		d: this.getDay().toString(),

		hh: this.getHours().toString().padStart(2, '0'),
		h: this.getHours().toString(),

		mm: this.getMinutes().toString().padStart(2, '0'),
		m: this.getMinutes().toString(),

		ss: this.getSeconds().toString().padStart(2, '0'),
		s: this.getSeconds().toString(),

		ms: this.getMilliseconds().toString()
	}

	return form.replace(/YYYY|YY|MMMM|MMM|MM|M|DDDD|DDD|DD|D|d|hh|h|mm|m|ss|s|ms/g, (str) => marks[str])
}
