module.exports = ({ client }) => {
	const refresh = () => {
		const presences = [
			{ activity: { name: 'un livre.', type: 'WATCHING' }, status: 'dnd' },
			{ activity: { name: 'son thé.', type: 'WATCHING' }, status: 'online' },
			{ activity: { name: 'espionner avec Nariko.', type: 'PLAYING' }, status: 'online' },
			{ activity: { name: "Nat' ❤.", type: 'WATCHING' }, status: 'online' },
			{ activity: { name: 'Étudie de nouvelles choses.', type: 'STREAMING', url: 'https://www.twitch.tv/notabenemovies' }, status: 'dnd' }
		]

		client.user.setPresence(presences.random())
		setTimeout(() => refresh(), 45000)
	}
	refresh()
}
