/* eslint-disable no-loop-func */
/* eslint-disable consistent-return */
/* eslint-disable no-await-in-loop */
const cheerio = require('cheerio');
const fetch = require('node-fetch');

const { dupesFilter } = require('../utils/dupesFilter');
const { getWebElementDetails } = require('../utils/getWebElementDetails.js');
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
		const ratingsList = [];

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
					.then((body) => {
						const beerName = '.item-info-container h2';
						const beerRating = '.rating-avg';

						getWebElementDetails(body, beerName, beerList);

						getWebElementDetails(body, beerRating, ratingsList);
					});
			}

			const beerAndRatings = beerList.map((e, i) => `\n${e} ${ratingsList[i]}`);

			const beersToShare = dupesFilter(beerAndRatings, args);

			if (beersToShare.length < 1) {
				message.channel.send(':exclamation: No dupes found this time :pouting_cat:');
			} else {
				message.channel.send(`Dupes found :beers: :beers: \n${beersToShare}`);
			}
		}());
	},
};
