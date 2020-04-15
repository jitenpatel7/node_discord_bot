const puppeteer = require('puppeteer');
const fetch = require('node-fetch');

module.exports = {
	name: 'profile',
	description: 'Get sweet stats! (Requires Untappd profile to be public)',
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
						const browser = await puppeteer.launch({ headless: true, args:['--no-sandbox'] });
						const page = await browser.newPage();

						await page.goto(untappdURL, { waitUntil: 'networkidle2' });

						const retrieveProfileStats = await page.evaluate(() => {

							const totalCheckIns = document.querySelectorAll('div[class="stats"] > a > span[class="stat"]')[0].innerText;
							const uniqueCheckIns = document.querySelectorAll('div[class="stats"] > a > span[class="stat"]')[1].innerText;
							const totalBadges = document.querySelectorAll('div[class="stats"] > a > span[class="stat"]')[2].innerText;
							const totalFriends = document.querySelectorAll('div[class="stats"] > a > span[class="stat"]')[3].innerText;

							return {
								totalCheckIns,
								uniqueCheckIns,
								totalBadges,
								totalFriends,
							};
						});

						message.channel.send(`**Stats for ${args}**\nCheck-ins ${retrieveProfileStats.totalCheckIns}\nUnique Check-ins ${retrieveProfileStats.uniqueCheckIns}\nBadges ${retrieveProfileStats.totalBadges}\nDrinking Buddies ${retrieveProfileStats.totalFriends}\n`);

						await browser.close();
					})();
				}
			});
	},
};