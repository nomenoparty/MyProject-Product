const role = require("../../models/role.model");

const systemConfig = require("../../config/system");

// [GET] /admin/roles
module.exports.index = async (req, res) => {
  const record = await role.find({
    deleted: false,
  });

  res.render("admin/pages/roles/index", {
    titlePage: "Danh sách nhóm quyền",
    records: record,
  });
};

// [GET] /admin/roles/create
module.exports.create = async (req, res) => {
  const permissions = res.locals.role.permissions;
  if(!permissions.includes("roles_create")){
    req.flash("error" , "Error");
    res.redirect(`/${systemConfig.prefixAdmin}/roles`);
    return;
  }
  res.render("admin/pages/roles/create", {
    titlePage: "Tạo mới nhóm quyền",
  });
};

// [POST] /admin/roles/create
module.exports.createPost = async (req, res) => {
  const record = new role(req.body);

  await record.save();

  req.flash("success", "Tạo mới nhóm quyền thành công");

  res.redirect(`/${systemConfig.prefixAdmin}/roles`);
};

// [GET] /admin/roles/edit/:id
module.exports.edit = async (req, res) => {
  const permissions = res.locals.role.permissions;
  if(!permissions.includes("roles_edit")){
    req.flash("error" , "Error");
    res.redirect(`/${systemConfig.prefixAdmin}/roles`);
    return;
  }
  try {
    const id = req.params.id;

    const data = await role.findOne({ _id: id, deleted: false });

    res.render("admin/pages/roles/edit", {
      titlePage: "Trang chỉnh sửa nhóm quyền",
      data: data,
    });
  } catch (error) {
    res.redirect(`/${systemConfig.prefixAdmin}/roles`);
  }
};

// [PATCH] /admin/roles/edit/:id
module.exports.editPatch = async (req, res) => {
  const id = req.params.id;

  await role.updateOne({ _id: id }, req.body);

  req.flash("success", "Chỉnh sửa nhóm quyền thành công");

  res.redirect("back");
};

// [GET] /admin/roles/permissions
module.exports.permissions = async (req, res) => {
  const permissions = res.locals.role.permissions;
  if(!permissions.includes("roles_permissions")){
    req.flash("error" , "Error");
    res.redirect(`/${systemConfig.prefixAdmin}/roles`);
    return;
  }
  const record = await role.find({deleted: false});

  res.render("admin/pages/roles/permissions", {
    titlePage: "Trang phân quyền",
    records: record
  });
};

// [PATCH] /admin/roles/permissions
module.exports.permissionsPatch = async (req, res) => {
  const permissions = JSON.parse(req.body.permissions);
  for (const item of permissions) {
    await role.updateOne({_id: item.id}, {permissions: item.permissions});
  }
  req.flash("success", "Cập nhật phân quyền thành công");

  res.redirect("back");
};