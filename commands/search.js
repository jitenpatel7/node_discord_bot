const cheerio = require('cheerio');
const request = require('request');

const { noSearchResults, untappdHome } = require('../constants/untappd')

module.exports = {
    name: 'fb',
    description: 'Find a beer on Untappd *(Search results may vary, but hey-ho)*',
    args: true,
    usage: `\`<brewery> <beer>\``,
    execute(message, args) {
        const searchBeerUrl = `https://untappd.com/search?q=${args}`

        request(searchBeerUrl, (error, response, html) => {
            if (response.statusCode === 404) {
                return error;
            }

            const $ = cheerio.load(html);
            const beerPage = $('.name a').attr('href');
            const noBeerResults = $('.results-none p').text();

            if (noBeerResults.includes(noSearchResults)) {
                return message.channel.send(`${args} returned no results within Untappd`);
            }

            message.channel.send(`${untappdHome}${beerPage}`);
        })
    }
}
