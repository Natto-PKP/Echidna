Array.prototype.random = function () {
	return this[Math.floor(Math.random() * this.length)]
}

Array.prototype.partly = function (search, { depth } = {}) {
	if (!Array.isArray(search)) throw TypeError('search must be a array')
	return depth ? this.filter((arr) => search.every((value) => arr.includes(value))) : search.every((value) => this.includes(value))
}

Array.prototype.shuffle = function () {
	return this.sort(() => Math.random() - 0.5)
}
