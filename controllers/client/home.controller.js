const product = require("../../models/products.model");

const productHelper = require("../../helpers/product");

// [GET] /
module.exports.index = async (req, res) => {
	const productsFeatured = await product.find({
		deleted: false,
		featured: "1",
		status: "active",
	}).limit(6);

	const newProductsFeatured = productHelper.newPriceProducts(productsFeatured);

	const newProducts = await product.find({
		deleted: false,
		status: "active",
	}).sort({position: "desc"}).limit(6);

	const productsNewPrice = productHelper.newPriceProducts(newProducts);

	res.render("clients/pages/home/index.pug", {
		titlePage: "Trang chủ",
		productsFeatured: newProductsFeatured,
		newProducts: productsNewPrice,
	});
}