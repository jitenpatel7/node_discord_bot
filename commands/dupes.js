/* eslint-disable consistent-return */
/* eslint-disable no-await-in-loop */
const cheerio = require('cheerio');
const fetch = require('node-fetch');

const { dupesFilter } = require('../utils/dupesFilter');
const { untappdUserURL, untappdHome } = require('../constants/untappd');

module.exports = {
	name: 'dupes',
	description: 'Get a list of common beers to share! (Requires Untappd profile to be public)',
	args: true,
	usage: '`<untappd username>`',
	execute(message, args) {
		if (args.length < 2) {
			return message.channel.send('No solo drinking here. :no_entry_sign: Please provide at least two Untappd usernames');
		}

		const beerList = [];
		message.channel.send('Raiding fridges, please hold..... :stopwatch:');

		(async function () {
			for (let i = 0; i < args.length; i += 1) {
				let fridgeLink;
				const untappdUserPage = `${untappdUserURL}${args[i]}/lists`;

				await fetch(untappdUserPage)
					.then((res) => {
						if (res.ok) {
							return res;
						}
						return message.channel.send(':thumbsdown: Unable to retrieve lists for users provided, be sure to check your spelling');
					})
					.then((res) => res.text())
					.then((body) => {
						const $ = cheerio.load(body);
						const userListID = $('.single-list a').attr('href');
						fridgeLink = `${untappdHome}${userListID}`;
					});

				await fetch(fridgeLink)
					.then((res) => res.text())
					.then((fridgeBody) => {
						const getFridgeBody = cheerio.load(fridgeBody);

						getFridgeBody('.item-info-container h2').each((i, el) => {
							const beer = getFridgeBody(el)
								.text()
								.trim();
							beerList.push(`\n${beer}`);
						});
					});
			}

			const beersToShare = dupesFilter(beerList, args);
			message.channel.send(`The choices you make in your life, will make your life.\nChoose wisely :beers: \n${beersToShare}`);
		}());
	},
};
