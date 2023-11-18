const productCategory = require("../../models/products-category.model");

const createTree = require("../../helpers/createTree");

module.exports.category = async (req, res, next) => {
	const categoryProducts = await productCategory.find({
		deleted: false
	});
	const newCategoryProducts = createTree(categoryProducts);
	
	res.locals.layoutCategoryProducts = newCategoryProducts;

	next();
}