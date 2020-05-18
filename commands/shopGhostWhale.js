const cheerio = require('cheerio');
const request = require('request');

const { availableBeerStyles, beerName, beerPrice } = require('../constants/ghostWhale');
const requestOptions = require('../constants/requestOptions');

module.exports = {
	name: 'gw',
	description: 'Shop Ghost Whale :ghost: :whale:',
	args: true,
	usage: `\`[list]\` \nExample: \`!gw new-in\`\nAvailable Beer Lists include - ${availableBeerStyles}`,
	execute(message, args) {
		const url = `https://shop.ghostwhalelondon.com/collections/${args}/?sort_by=created-descending`;
		request(url, requestOptions, (error, response, html) => {
			if (response.statusCode === 404) {
				return message.channel.send(`Hey ${message.author} ${args} is not a valid beer list. Maybe try \`[!gw new-in]\` for the latest list? Or \`[!help gw]\` for help.`);
			}

			const beerList = [];
			const beerShop = [];

			const $ = cheerio.load(html);

			$('.product-card__info').each((i, el) => {
				const beer = $(el)
					.text()
					.trim();
				beerList.push(beer);
			});

			const beersAvailableToBuy = beerList.filter((beer) => {
				if (!beer.includes('Sold Out')) {
					return beer;
				}
			});

			for (let i = 0; i < beersAvailableToBuy.length; i += 1) {
				beerShop.push(`\n*${beerName(beersAvailableToBuy[i])} - ${beerPrice(beersAvailableToBuy[i])}*`);
			}

			return message.author.send(`<${url}>\nHere is the *${args}* beer list for today (Sold out beers, not displayed):\n${beerShop}`)
				.then(() => {
					if (message.channel.type === 'dm') return;
					message.reply('The latest beers have been slid into your DMs. \n Drink responsibly :beer:');
				})
				.catch((error) => {
					console.error(`Could not send help DM to ${message.author.tag}.\n`, error);
					message.reply('it seems like I can\'t DM you. Please try again later');
				});
		});
	},
};
