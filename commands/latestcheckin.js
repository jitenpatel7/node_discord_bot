const cheerio = require('cheerio');
const request = require('request');

const untappdUserURL = require('../constants/untappd');

module.exports = {
	name: 'lb',
	description: 'Show off your latest beer! (Requires Untappd profile to be public)',
	args: true,
	execute(message, args) {
		let checkinID;
		const untappdUserActivity = `${untappdUserURL}${args}/`;

		const retrieveCheckInID = new Promise((resolve, reject) => {
			request(untappdUserActivity, (error, response, html) => {
				if (!error && response.statusCode === 200) {
					const $ = cheerio.load(html);
					const activity = $('.stat').first().text();

					checkinID = $('.item').attr('data-checkin-id');

					// eslint-disable-next-line eqeqeq
					if (activity == 0) {
						reject(message.channel.send(`Hey ${message.author}, the Untappd user ${args} has not checked in any beer!`));
					} else {
						message.channel.send('Is it a banger?!? :face_with_monocle:');
						resolve(checkinID);
					}
				} else {
					reject(message.channel.send(`Hey ${message.author}, I was unable to find the Untappd user ${args}`));
				}
			});
		});

		retrieveCheckInID.then((output) => {
			const checkinDetailsURL = `https://untpd.it/s/c${output}`;

			request(checkinDetailsURL, (error, response, html) => {
				if (!error && response.statusCode === 200) {
					const $ = cheerio.load(html);

					const rating = $('.caps').attr('data-rating');
					const badgesList = $('.badge').find('span').text().split('Earned the ')
						.slice(1);
					const badgesEarned = badgesList.join('\n').trim();

					if (rating !== undefined && rating < 4) {
						message.channel.send(`Sadly not. ${rating} / 5`);
					} else if (rating >= 4) {
						message.channel.send(`Banger confirmed. ${rating} / 5 :beers:`);
					}

					message.channel.send(`${checkinDetailsURL}`);
					if (badgesEarned.length > 0) {
						message.channel.send(`Badges Earned:\n*${badgesEarned}*\n`);
						if (badgesList.length >= 4) {
							message.channel.send(':rotating_light: Badge Wanker Alert :rotating_light:');
						}
					}
				}
			});
		});
	},
};
