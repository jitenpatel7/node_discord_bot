const cheerio = require('cheerio');
const request = require('request');
const { MessageEmbed } = require('discord.js');

const { untappdUserURL } = require('../constants/untappd');

module.exports = {
	name: 'profile',
	description: 'Retrieve Untappd user stats (Profile must be public)',
	args: true,
	execute(message, args) {
		request(`${untappdUserURL}${args}`, (error, response, html) => {
			if (!error && response.statusCode === 200) {
				const $ = cheerio.load(html);

				const userAvatar = $('.user-avatar').find('img').attr('src');
				const userInfo = $('.stats').text();
				const userCheckinStats = userInfo.split('\n').filter((el) => el.length > 0);

				const embed = new MessageEmbed()
					.setTitle(`Untappd Stats for ${args}`)
					.setThumbnail(userAvatar)
					.setColor(16763904)
					.setDescription(`Total Checkins: ${userCheckinStats[0]}\nUnique Checkins: ${userCheckinStats[2]}\nBadges ${userCheckinStats[4]}\nFriends ${userCheckinStats[6]}\n`);

				message.channel.send(embed);
			} else {
				message.channel.send(`Hey ${message.author}, I was unable to find the Untappd user ${args}`);
			}
		});
	},
};
