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

				const userAvatar = $('.user-avatar').find('img').attr('src');

				$('.stats').each((i, el) => {
					const title = $(el)
						.find('a').text();
					message.channel.send({ embed: {
						color: 16763904,
						title: `Untappd Stats for ${args}`,
						description: title,
						thumbnail: {
							url: userAvatar,
						},
					} });
				});
			}
			else {
				message.channel.send(`Hey ${message.author}, I was unable to find the Untappd user ${args}`);
			}
		});


	},
};