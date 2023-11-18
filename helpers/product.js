module.exports.newPriceProducts = (products) => {
	const newProducts = products.map(item => {
		item.newPrice = ((item.price * (100 - item.discountPercentage)) / 100).toFixed(0);
		return item;
	});

	return newProducts;
}

module.exports.newPriceProduct = (product) => {
	const newPrice = ((product.price * (100 - product.discountPercentage)) / 100).toFixed(0);
	return newPrice;
}