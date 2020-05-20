const cheerio = require('cheerio');
const request = require('request');

const { untappdUserURL, untappdHome } = require('../constants/untappd');

module.exports = {
    name: 'fridge',
    description: 'Show off what\'s in your fridge! (Requires Untappd profile to be public)',
    args: true,
    usage: `\`<untappd username>\``,
    execute(message, args) {
        const untappdUserPage = `${untappdUserURL}${args}/lists`

        request(untappdUserPage, (error, response, html) => {
            if (response.statusCode === 404) {
                message.channel.send(`Hey ${message.author}, I was unable to find the user ${args}!`);
                return error;
            }

            const $ = cheerio.load(html);
            const userListID = $('.single-list a').attr('href');
            message.channel.send(`${untappdHome}${userListID}`);
        })
    }
}