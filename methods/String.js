String.prototype.toWords = function () {
	return this.match(/[a-zA-Z\-\u00c0-\u00c4\u00c7-\u00cf\u00d1-\u00d6\u00d9-\u00dd\u00e0-\u00e4\u00e7-\u00ef\u00f1-\u00f6\u00f9-\u00fd]+/g) || []
}

String.prototype.shuffle = function () {
	return this.split('').sort(() => Math.random() - 0.5).join('')
}

String.prototype.form = function ({ member, guild, exp, eco }) {
	let result = this
	if (member) result = result.replace(/{mention}|{username}|{nickname}|{discriminator}|{tag}|{id}/g, (v) => ({ mention: member, username: member.user.username, nickname: member.displayName, discriminator: member.user.discriminator, tag: member.user.tag, id: member.id }[v.replace(/{|}/g, '')]))
	if (guild) result = result.replace(/{guild}/g, (v) => ({ guild: guild.name }[v.replace(/{|}/g, '')]))
	return result
}

String.prototype.bar = function (empty, full, max, number) {
	return ''.padEnd(Math.ceil(this.length / max * 100 * (number / 100)), full).padEnd(number, empty)
}
