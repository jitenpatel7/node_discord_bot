const cheerio = require('cheerio');
const request = require('request');

module.exports = {
	name: 'profile',
	description: 'Retrieve Untappd user stats (Profile must be public)',
	args: true,
	execute(message, args) {
		request(`https://untappd.com/user/${args}`, (error, response, html) => {
			if (!error && response.statusCode == 200) {
				const $ = cheerio.load(html);

				$('.stats').each((i, el) => {
					const title = $(el)
						.find('a').text();
					message.channel.send(`**Stats for ${args}**\n${title}\n`);
				});
			}
			else {
				message.channel.send(`Hey ${message.author}, I was unable to find the Untappd user ${args}`);
			}
		});
	},
};