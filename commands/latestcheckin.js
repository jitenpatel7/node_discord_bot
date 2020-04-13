const puppeteer = require('puppeteer');

module.exports = {
	name: 'lb',
	description: 'Show off your latest beer!',
	args:true,
	execute(message, args) {
		(async () => {

			const untappdURL = `https://untappd.com/user/${args}`;

			const browser = await puppeteer.launch();
			const page = await browser.newPage();

			await page.goto(untappdURL, { waitUntil: 'networkidle2' });

			const latestCheckIn = await page.evaluate(() => {

				const checkInDetails = document.querySelector('div[class="top"] > p').innerText;
				const details = document.querySelector('div[class="bottom"] > a').getAttribute('href');

				return {
					checkInDetails,
					details,
				};

			});

			const detailsURL = `https://untappd.com/${latestCheckIn.details}`;

			message.channel.send(`${latestCheckIn.checkInDetails}\nLinky: ${detailsURL}`);

			await browser.close();
		})();
	},
};