const { Message, Client } = require('discord.js')
const fetch = require('node-fetch')

const apps = [{ names: ['youtube', 'yt'], ID: '755600276941176913' }]

module.exports = {
	/**
     * @param { object } param0 
     * @param { Client } [param0.client] 
     * @param { Message } [param0.message] 
     * @param { string[] } [param0.args] 
     */
	exec: function ({ client, message, args }) {
		const app = args[0] && apps.find(({ names }) => names.includes(args[0]))
		if (!app) return message.sendError("Modules disponibles: 'youtube'")
		if (!message.member.voice.channel) return message.sendError("Vous n'êtes pas dans un salon vocal.")

		fetch(`https://discord.com/api/v8/channels/${channel.id}/invites`, {
			method: 'POST',
			body: { max_age: 86400, max_uses: 0, target_application_id: app.ID, target_type: 2, temporary: false, validate: null },
			headers: { Authorization: 'Bot ' + client.token, 'Content-Type': 'application/json' }
		})
			.then((res) => res.json())
			.then((invite) => message.channel.send(invite.code))
	},
	options: { name: 'together', cooldown: 3 }
}
