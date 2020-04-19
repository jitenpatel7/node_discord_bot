const cheerio = require('cheerio');
const request = require('request');

module.exports = {
	name: 'lb',
	description: 'Show off your latest beer! (Requires Untappd profile to be public)',
	args:true,
	execute(message, args) {
		message.channel.send('Is it a banger?!? :beers:');
		let checkinID;
		const feedURL = `https://untappd.com/user/${args}/`;

		const retrieveCheckInID = new Promise((resolve, reject) => {
			request(feedURL, (error, response, html) => {
				if (!error && response.statusCode == 200) {
					const $ = cheerio.load(html);

					checkinID = $('.item').attr('data-checkin-id');

					resolve(checkinID);
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
					const beer = $('.beer p').first().text();
					const rating = $('.caps').attr('data-rating');
					const drinker = untappdUserName.trim();

					message.channel.send(`${drinker} is drinking ${beer} and has rated it ${rating} / 5\n${checkinDetailsURL}`);

					if (rating >= 4) {
						message.channel.send('Banger confirmed :beers:');
					}
				}
				else {
					message.channel.send(`Hey ${message.author}, I was unable to find the Untappd user ${args}`);
				}
			});
		});


	},
};