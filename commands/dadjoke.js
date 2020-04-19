const fetch = require('node-fetch');

module.exports = {
	name: 'darreljoke',
	description: 'Something Darrel would casually drop into a conversation',
	execute(message, args) {
		const dadJokeURL = 'https://icanhazdadjoke.com/';

		fetch(dadJokeURL, {
			headers: { 'Accept': 'text/plain' },
		})
			.then(res => res.text())
			.then(body => message.channel.send(`${body} :older_man:`));
	},
};