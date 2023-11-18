const product = require('../../models/products.model');
const productCategory = require('../../models/products-category.model');

const productHelper = require("../../helpers/product");

// [GET] /products
module.exports.index = async (req, res) => {
  const products = await product.find({
    deleted: false,
    status: "active"
  }).sort({position: "desc"});

  const newProducts = productHelper.newPriceProducts(products);

  res.render('clients/pages/products/index.pug', {
    titlePage: 'Danh sách sản phẩm',
    products: newProducts
  });
}

// [GET] /products/detail/:slugProduct
module.exports.detail = async (req, res) => {
  try{
    const slug = req.params.slugProduct;

    const products = await product.findOne({slug: slug, deleted: false, status: "active"});
    if(products){
      if(products.product_category_id){
        const category = await productCategory.findOne({
          _id: products.product_category_id,
          deleted: false,
          status: "active",
        });
        products.category = category;
      }

      products.newPrice = productHelper.newPriceProduct(products);

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

// [GET] /products/:slugCategory
module.exports.category = async (req, res) => {
  const slugCategory = req.params.slugCategory;

  const category = await productCategory.findOne({slug: slugCategory, deleted: false, status: "active"});

  const subCategory = async(parentId) => {
    const subs = await productCategory.find({
      parent_id: parentId,
      deleted: false,
      status: "active",
    });

    let allSub = [...subs];

    for (const sub of subs) {
      const childs = await subCategory(sub.id);
      allSub = allSub.concat(childs);
    }
    return allSub;
  };

  const listSubCategory = await subCategory(category.id);
  const listSubCategoryId = listSubCategory.map(item => item.id);

  const products = await product.find({
    product_category_id: {$in: [category.id, ...listSubCategoryId]},
    deleted: false,
    status: "active",
  }).sort({position: "desc"});

  const newProducts = productHelper.newPriceProducts(products);

  res.render("clients/pages/products/index", {
    titlePage: category.title,
    products: newProducts,
  });
}