const beerDetailsExpression = /(.+\))/gm;
const beerPriceExpression = /(£.+)/gm;

const beerName = (str) => str.match(beerDetailsExpression);
const beerPrice = (str) => str.match(beerPriceExpression);

const availableBeerStyles = ['new-in', ' ipa ', ' double-ipa', ' session-ipa', ' porter-stout', ' imperial-stout-porter', ' lager-pilsner-kolsch', ' table-beer', ' barrel-aged-beers'];

module.exports = { beerName, beerPrice, availableBeerStyles };
