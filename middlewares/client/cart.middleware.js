const Cart = require("../../models/cart.model");

module.exports.cardId = async (req, res, next) => {
	if(!req.cookies.cartId){
		const cart = new Cart();
		await cart.save();

		const expiresTime = 365 * 24 * 3600 * 1000;

		res.cookie("cartId", cart.id, {
			expires: new Date(Date.now() + expiresTime)
		});
	}else{
		const cart = await Cart.findOne({
			_id: req.cookies.cartId
		});

		cart.totalQuantity = cart.products.reduce((sum, item) => sum + item.quantity, 0);

		res.locals.miniCart = cart;
	}
	next();
}