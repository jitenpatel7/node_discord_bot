const cheerio = require('cheerio');

const getWebElementDetails = (body, elementID, arrayToPopulate) => {
	const webPageBodyToSearch = cheerio.load(body);

	webPageBodyToSearch(elementID).each((i, el) => {
		const elementToScrape = webPageBodyToSearch(el)
			.text()
			.trim();
		arrayToPopulate.push(`${elementToScrape}`);
	});
};

exports.getWebElementDetails = getWebElementDetails;
