const dupesFilter = ((fullListOfBeers, untappdUsers) => {
	const beerCount = {};
	const finalList = [];

	fullListOfBeers.forEach((val) => {
		beerCount[val] = (beerCount[val] || 0) + 1;

		if (beerCount[val] === untappdUsers.length) {
			finalList.push(val);
		}
	});

	return finalList;
});

exports.dupesFilter = dupesFilter;
