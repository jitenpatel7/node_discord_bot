const cheerio = require('cheerio');
const request = require('request');

const untappdUserURL = require('../constants/untappd');

module.exports = {
	name: 'lb',
	description: 'Show off your latest beer! (Requires Untappd profile to be public)',
	args:true,
	execute(message, args) {
		let checkinID;
		const feedURL = `${untappdUserURL}${args}/`;

		const retrieveCheckInID = new Promise((resolve, reject) => {
			request(feedURL, (error, response, html) => {
				if (!error && response.statusCode == 200) {
					const $ = cheerio.load(html);
					const activity = $('.stat').first().text();

					checkinID = $('.item').attr('data-checkin-id');

					if (activity == 0) {
						reject(message.channel.send(`Hey ${message.author}, the Untappd user ${args} has not checked in any beer!`));
					}
					else {
						message.channel.send('Is it a banger?!? :face_with_monocle:');
						resolve(checkinID);
					}
				}
				else {
					reject(message.channel.send(`Hey ${message.author}, I was unable to find the Untappd user ${args}`));
				}
			});
		});

		retrieveCheckInID.then((output) => {
			const checkinDetailsURL = `https://untpd.it/s/c${output}`;

			request(checkinDetailsURL, (error, response, html) => {
				if (!error && response.statusCode == 200) {
					const $ = cheerio.load(html);

					const untappdUserName = $('.name p').first().text();
					const drinker = untappdUserName.trim();
					const beer = $('.beer p').first().text();
					const rating = $('.caps').attr('data-rating');
					const badges = $('.badge').find('span').text().split('!')
						.filter(badge => badge.length > 0);

					if (rating == undefined) {
						message.channel.send(`${drinker} is drinking ${beer} and did not rate it`);
					}
					else if (rating < 4) {
						message.channel.send(`Sadly not. ${rating} / 5`);
					}

					message.channel.send(`${checkinDetailsURL}`);
					badges.forEach(badge => message.channel.send(`*${badge}*`));

					if (rating >= 4) {
						message.channel.send(`Banger confirmed. ${rating} / 5 :beers:`);
					}

					if (badges.length >= 4) {
						message.channel.send(':rotating_light: Badge Wanker Alert :rotating_light:');
					}
				}
			});
		});
	},
};