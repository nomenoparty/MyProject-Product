const product = require('../../models/products.model');

// [GET] /products
module.exports.index = async (req, res) => {
  const products = await product.find({
    deleted: false,
    status: "active"
  });
  const newProducts = products.map(item => {
    item.newPrice = (item.price * (100 - item.discountPercentage) / 100).toFixed(0);
    return item;
  });
  res.render('clients/pages/products/index.pug', {
    titlePage: 'Danh sách sản phẩm',
    products: newProducts
  });
}

// [GET] /products/detail/:slug
module.exports.detail = async (req, res) => {
  try{
    const slug = req.params.slug;

    const products = await product.findOne({slug: slug, deleted: false, status: "active"});

    if(products){
      res.render("clients/pages/products/detail", {
        titlePage: "Chi tiết sản phẩm",
        product: products
      });
    }else{
      res.redirect("/products");
    }
  }catch(error){
    res.redirect("/");
  }
}