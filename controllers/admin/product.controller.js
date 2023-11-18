const product = require("../../models/products.model");
const productCategory = require("../../models/products-category.model");
const account = require("../../models/account.model");

const filterStatusHelper = require("../../helpers/filterStatus");
const searchHelper = require("../../helpers/search");
const paginationHelper = require("../../helpers/pagination");
const config = require("../../config/system");
const createTree = require("../../helpers/createTree");

// [GET] /admin/products
module.exports.index = async (req, res) => {
  try {
    const filterStatus = filterStatusHelper(req.query);

    const objectSearch = searchHelper(req.query);

    let find = {
      deleted: false,
    };

    if (req.query.status) {
      find.status = req.query.status;
    }

    if (req.query.keyword) {
      find.title = objectSearch.regex;
    }

    let initPagination = {
      currentPage: 1,
      limitItems: 4,
    };

    const countProducts = await product.count(find);

    const objectPagination = paginationHelper(
      initPagination,
      req.query,
      countProducts
    );

    let sort = {};

    if(req.query.sortKey && req.query.sortValue){
      sort[req.query.sortKey] = req.query.sortValue;
    }else{
      sort.position = "desc";
    }

    const products = await product
      .find(find)
      .sort(sort)
      .limit(objectPagination.limitItems)
      .skip(objectPagination.skip);

    for (const product of products) {
      const userCreated = await account.findOne({
        _id: product.createdBy.account_id
      });
      
      if(userCreated){
        product.createdBy.accountFullName = userCreated.fullName;
      }

      const userUpdatedId = product.updatedBy.slice(-1)[0];

      if(userUpdatedId){
        const userUpdated = await account.findOne({
          _id: userUpdatedId.account_id
        });
        
        if(userUpdated){
          userUpdatedId.accountFullName = userUpdated.fullName;
        }
      }
    }

    if (products.length > 0 || countProducts == 0) {
      res.render("admin/pages/products/index", {
        titlePage: "Danh sách sản phẩm",
        products: products,
        filterStatus: filterStatus,
        keyword: objectSearch.keyword,
        pagination: objectPagination,
      });
    }else {
      let stringQuery = "";
      for (const key in req.query) {
        if (key != "page") stringQuery += `&${key}=${req.query[key]}`;
      }
      const href = `${req.baseUrl}?page=1${stringQuery}`;
      res.redirect(href);
    }
  }catch (error) {
    console.log(error);
    res.redirect("back");
  }
};

// [GET] /admin/products/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  const permissions = res.locals.role.permissions;
  if(!permissions.includes("products_edit")){
    req.flash("error" , "Error");
    res.redirect(`/${config.prefixAdmin}/products`);
    return;
  }
  const status = req.params.status;
  const id = req.params.id;

  const updatedBy = {
    account_id: res.locals.user.id,
    updatedAt: new Date(),
  };

  await product.updateOne({ _id: id }, { 
    status: status,
    $push: {updatedBy: updatedBy}
  });
  req.flash("success", "Cập nhật trạng thái thành công!");
  // res.redirect("/admin/products");
  res.redirect("back");
};

// [GET] /admin/products/change-multi
module.exports.changeMulti = async (req, res) => {
  const permissions = res.locals.role.permissions;
  if(!permissions.includes("products_edit")){
    req.flash("error" , "Error");
    res.redirect(`/${config.prefixAdmin}/products`);
    return;
  }
  const ids = req.body.ids.split(", ");
  const status = req.body.type;
  
  const updatedBy = {
    account_id: res.locals.user.id,
    updatedAt: new Date(),
  };

  switch (status) {
    case "active":
    case "inactive":
      await product.updateMany({ _id: { $in: ids } }, { 
        status: status,
        $push: {updatedBy: updatedBy},
      });
      req.flash(
        "success",
        `Cập nhật trạng thái thành công ${ids.length} sản phẩm!`
      );
      break;
    case "delete-all":
      await product.updateMany(
        { _id: { $in: ids } },
        { 
          deleted: true,
          deletedBy: {
            account_id: res.locals.user.id,
            deletedAt: new Date(),
          }
        }
      );
      req.flash("success", `Xóa thành công ${ids.length} sản phẩm!`);
      break;
    case "change-position":
      for (const item of ids) {
        const [id, position] = item.split("-");
        await product.updateOne({ _id: id }, { 
          position: position,
          $push: {updatedBy: updatedBy},
        });
        req.flash(
          "success",
          `Thay đổi vị trí thành công ${ids.length} sản phẩm!`
        );
      }
      break;
    default:
      break;
  }
  res.redirect("back");
};

// [DELETE] /admin/products/delete/:id
module.exports.deleteItem = async (req, res) => {
  const id = req.params.id;

  await product.updateOne(
    { _id: id },
    { 
      deleted: true,
      deletedBy: {
        account_id: res.locals.user.id,
        deletedAt: new Date(),
      }
    }
  );
  req.flash("success", "Xóa thành công!");

  res.redirect("back");
};

// [GET] /admin/products/create
module.exports.create = async (req, res) => {
  const permissions = res.locals.role.permissions;
  if(!permissions.includes("products_create")){
    req.flash("error" , "Error");
    res.redirect(`/${config.prefixAdmin}/products`);
    return;
  }
  const record = await productCategory.find({deleted: false});

  const newRecord = createTree(record);

  res.render("admin/pages/products/create", {
    titlePage: "Trang tạo mới sản phẩm",
    records: newRecord,
  });
};

// [POST] /admin/products/create
module.exports.createPost = async (req, res) => {
  req.body.price = parseFloat(req.body.price);
  req.body.discountPercentage = parseFloat(req.body.discountPercentage);
  req.body.stock = parseInt(req.body.stock);
  
  if (req.body.position === "") {
    const countProducts = await product.countDocuments();
    req.body.position = countProducts + 1;
  } else {
    req.body.position = parseInt(req.body.position);
  }

  // if(req.file && req.file.filename){
  //   req.body.thumbnail = `/uploads/${req.file.filename}`;
  // }
  
  req.body.createdBy = {
    account_id: res.locals.user.id
  }

  const newProduct = await new product(req.body);
  newProduct.save();

  req.flash("success", "Tạo mới sản phẩm thành công");
  res.redirect(`/${config.prefixAdmin}/products`);
};

// [GET] /admin/products/edit/:id
module.exports.edit = async (req, res) => {
  const permissions = res.locals.role.permissions;
  if(!permissions.includes("products_edit")){
    req.flash("error" , "Error");
    res.redirect(`/${config.prefixAdmin}/products`);
    return;
  }
  try{
    const id = req.params.id;
    const products = await product.findOne({_id: id, deleted: false});

    const record = await productCategory.find({deleted: false});
    const newRecord = createTree(record);

    res.render("admin/pages/products/edit", {
      titlePage: "Chỉnh sửa sản phẩm",
      product: products,
      records: newRecord,
    }); 
  }catch(error){
    res.redirect(`/${config.prefixAdmin}/products`);
  }
};

// [PATCH] /admin/products/edit/:id
module.exports.editPatch = async (req, res) => {
  const id = req.params.id;

  req.body.price = parseFloat(req.body.price);
  req.body.discountPercentage = parseFloat(req.body.discountPercentage);
  req.body.stock = parseInt(req.body.stock);
  req.body.position = parseInt(req.body.position);

  // if(req.file && req.file.filename){
  //   req.body.thumbnail = `/uploads/${req.file.filename}`;
  // }
  
  const updatedBy = {
    account_id: res.locals.user.id,
    updatedAt: new Date(),
  };

  await product.updateOne({_id: id}, {
    ...req.body,
    $push: {updatedBy: updatedBy},
  });

  req.flash("success", "Cập nhật sản phẩm thành công");

  res.redirect("back");
};

module.exports.detail = async (req, res) => {
  const permissions = res.locals.role.permissions;
  if(!permissions.includes("products_view")){
    req.flash("error" , "Error");
    res.redirect(`/${config.prefixAdmin}/products`);
    return;
  }
  try{
    const id = req.params.id;

    const products = await product.findOne({_id: id, deleted: false});

    res.render("admin/pages/products/detail", {
      titlePage: "Chi tiết sản phẩm",  
      product: products
    });

  }catch(error){
    res.redirect(`/${config.prefixAdmin}/products`);
  }
};