const productCategory = require("../../models/products-category.model");

const config = require("../../config/system");

const createTree = require("../../helpers/createTree");

// [GET] /admin/product-category
module.exports.index = async (req, res) => {
  let find = {
    deleted: false,
  };

  const records = await productCategory.find(find);

  const newRecords = createTree(records);

  res.render("admin/pages/products-category/index", {
    titlePage: "Danh mục sản phẩm",
    records: newRecords,
  });
};

// [GET] /admin/product-category/create
module.exports.create = async (req, res) => {
  let find = {
    deleted: false,
  };

  const records = await productCategory.find(find);

  const newRecords = createTree(records);

  res.render("admin/pages/products-category/create", {
    titlePage: "Trang tạo mới danh mục sản phẩm",
    records: newRecords,
  });
};

// [POST] /admin/product-category/create
module.exports.createPost = async (req, res) => {
  if (req.body.position === "") {
    const countRecords = await productCategory.countDocuments();
    req.body.position = countRecords + 1;
  } else {
    req.body.position = parseInt(req.body.position);
  }
  
  const newProductCategory = new productCategory(req.body);
  await newProductCategory.save();

  res.redirect(`/${config.prefixAdmin}/product-category`);
};

// [GET] /admin/product-category/edit/:id
module.exports.edit = async (req, res) => {
  const id = req.params.id;
  const data = await productCategory.findOne({
    _id: id,
    deleted: false
  })
  let find = {
    deleted: false,
  };

  const records = await productCategory.find(find);

  const newRecords = createTree(records);

  res.render("admin/pages/products-category/edit", {
    titlePage: "Trang chỉnh sửa danh mục sản phẩm",
    records: newRecords,
    data: data
  });
};

// [PATCH] /admin/product-category/edit/:id
module.exports.editPatch = async (req, res) => {
  const id = req.params.id;
  req.body.position = parseInt(req.body.position);
  
  await productCategory.updateOne({_id: id}, req.body);

  req.flash("success", "Cập nhật thành công");

  res.redirect("back");
};