const cheerio = require('cheerio');
const request = require('request');

const { untappdUserURL, untappdHome } = require('../constants/untappd');

module.exports = {
    name: 'beerme',
    description: 'Let Nag-Bot choose your next beer from your Untappd List (Requires Untappd profile to be public)',
    args: true,
    usage: `\`<untappd username>\``,
    execute(message, args) {
        const untappdUserPage = `${untappdUserURL}${args}/lists`

        const retrieveBeerListID = new Promise((resolve, reject) => {
            request(untappdUserPage, (error, response, html) => {
                if (response.statusCode === 404) {
                    reject(error);
                    return message.channel.send(`Hey ${message.author}, I was unable to find the user ${args}!`);
                }

                const $ = cheerio.load(html);
                const userListID = $('.single-list a').attr('href');
                resolve(userListID);
            })
        })

        retrieveBeerListID.then((userListID) => {
            beerListURL = `${untappdHome}${userListID}`;

            request(beerListURL, (error, response, html) => {
                const $ = cheerio.load(html);
                const fridgeItems = [];

                $('.item-info-container a').each((i, el) => {
                    const beer = $(el)
                        .attr('href')
                    if(beer.includes('/b/')){
                        fridgeItems.push(`${untappdHome}${beer}`);
                    }
                });

                const selectRandomBeerToDrink = (fridgeItems) => {
                    if (fridgeItems.length > 0) {
                        message.channel.send(fridgeItems[Math.floor(Math.random()*fridgeItems.length)]);
                    } else {
                        return message.channel.send(`Hey ${message.author}, looks like ${args} doesn't have any beers in the fridge :worried:`)
                    }
                }

                selectRandomBeerToDrink(fridgeItems);
            })
        })
    }
}