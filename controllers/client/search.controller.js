const product = require("../../models/products.model");

const productHelper = require("../../helpers/product");

//[GET] /search
module.exports.index = async (req, res) => {
	const keyword = req.query.keyword;

	let newProducts = [];

	if(keyword){
		const keywordRegex = new RegExp(keyword, "i");
		const products = await product.find({
			title: keywordRegex,
			deleted: false,
			status: "active"
		});

		newProducts = productHelper.newPriceProducts(products);
	}

	res.render("clients/pages/search/index", {
		titlePage: "Kết quả tìm kiếm",
		products: newProducts,
		keyword: keyword
	});
}