const Cart = require("../../models/cart.model");
const Product = require("../../models/products.model");

const productHelper = require("../../helpers/product");

//[GET] /cart
module.exports.index = async (req, res) => {
	const cartId = req.cookies.cartId;

	const cart = await Cart.findOne({
		_id: cartId
	});

	if(cart.products.length > 0){
		for (const item of cart.products) {
			const productId = item.product_id;

			const productInfo = await Product.findOne({
				_id: productId
			});

			productInfo.newPrice = productHelper.newPriceProduct(productInfo);

			item.productInfo = productInfo;
			item.totalPrice = productInfo.newPrice * item.quantity;
		}
	}

	cart.totalPrice = cart.products.reduce((sum, item) => sum + item.totalPrice, 0);

	res.render("clients/pages/cart/index", {
		titlePage: "Giỏ hàng",
		cartDetail: cart
	});
}

//[POST] /cart/add/:productId
module.exports.addPost = async (req, res) => {
	const cartId = req.cookies.cartId;
	const productId = req.params.productId;
	const quantity = parseInt(req.body.quantity);

	const cart = await Cart.findOne({
		_id: cartId
	});

	const existProductInCart = cart.products.find(item => item.product_id == productId);

	if(existProductInCart){
		const newQuantity = quantity + existProductInCart.quantity;

		await Cart.updateOne(
			{
				_id: cartId,
				'products.product_id': productId
			},
			{
				'products.$.quantity': newQuantity
			}
		);
	}else{
		const objectCart = {
			product_id: productId,
			quantity: quantity
		};

		await Cart.updateOne(
			{
				_id: cartId
			},
			{
				$push: {products: objectCart}
			}
		);
	}

	req.flash("success", "Đã thêm sản phẩm vào giỏ hàng");
	res.redirect("back");
}

//[GET] /cart/delete/:productId
module.exports.delete = async (req, res) => {
	const productId = req.params.productId;
	const cartId = req.cookies.cartId;

	await Cart.updateOne(
		{
			_id: cartId
		},
		{
			$pull: {products: {"product_id": productId}}
		}
	);

	req.flash("success", "Xóa sản phẩm thành công khỏi giỏ hàng");
	res.redirect("back");
}

//[GET] /cart/update/:productId/:quantity
module.exports.update = async (req, res) => {
	const cartId = req.cookies.cartId;
	const productId = req.params.productId;
	const quantity = req.params.quantity;

	await Cart.updateOne(
		{
			_id: cartId,
			'products.product_id': productId
		},
		{
			'products.$.quantity': quantity
		}
	);

	req.flash("success", "Cập nhật số lượng thành công");

	res.redirect("back");
}