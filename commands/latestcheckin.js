const puppeteer = require('puppeteer');
const fetch = require('node-fetch');

module.exports = {
	name: 'lb',
	description: 'Show off your latest beer! (Requires Untappd profile to be public)',
	args:true,
	execute(message, args) {
		const untappdURL = `https://untappd.com/user/${args}`;

		fetch(untappdURL)
			.then((res) => {

				if (res.statusText != 'OK') {
					message.channel.send(`Unable to find Untappd user ${args}`);
				}
				else {
					(async () => {

						message.channel.send('Is it a banger?!?!');

						const browser = await puppeteer.launch({ headless: true, args:['--no-sandbox'] });
						const page = await browser.newPage();

						await page.goto(untappdURL, { waitUntil: 'networkidle2' });

						const latestCheckIn = await page.evaluate(() => {

							const checkInDetails = document.querySelector('div[class="top"] > p').innerText;
							const details = document.querySelector('div[class="bottom"] > a').getAttribute('href');
							const ratings = document.querySelector('div[data-rating]').dataset.rating;

							return {
								checkInDetails,
								details,
								ratings,
							};
						});

						const detailsURL = `https://untappd.com${latestCheckIn.details}`;

						message.channel.send(`${latestCheckIn.checkInDetails}\n${args}'s rating: **${latestCheckIn.ratings}**\nLinky: ${detailsURL}`);

						await browser.close();
					})();
				}
			});
	},
};