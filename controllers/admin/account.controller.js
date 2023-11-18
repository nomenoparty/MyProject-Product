const account = require("../../models/account.model");
const Role = require("../../models/role.model");
const systemConfig = require("../../config/system");
const md5 = require('md5');

//[GET] /admin/accounts
module.exports.index = async (req, res) => {
	const records = await account.find({
		deleted: false
	});

	for (const record of records) {
		const role = await Role.findOne({
			_id: record.role_id
		});
		record.role = role;
	}

	res.render("admin/pages/accounts/index",{
		titlePage: "Danh sách tài khoản",
		records: records
	});
}

//[GET] /admin/accounts/create
module.exports.create = async (req, res) => {
	const permissions = res.locals.role.permissions;
  if(!permissions.includes("accounts_create")){
    req.flash("error" , "Error");
    res.redirect(`/${systemConfig.prefixAdmin}/accounts`);
    return;
  }
	const role = await Role.find({
		deleted: false
	});

	res.render("admin/pages/accounts/create",{
		titlePage: "Tạo mới danh sách tài khoản",
		roles: role
	});
}

//[POST] /admin/accounts/createPost
module.exports.createPost = async (req, res) => {
	const findEmail = await account.findOne({email: req.body.email});
	if(findEmail){
		req.flash("error", "Email đã tồn tại");
		res.redirect("back");
		return;
	}

	req.body.password = md5(req.body.password);

	const record = new account(req.body);
	await record.save();

	req.flash("success", "Tạo mới tài khoản thành công");
	res.redirect(`/${systemConfig.prefixAdmin}/accounts`);
}

//[GET] /admin/accounts/edit/id
module.exports.edit = async (req, res) => {
	const permissions = res.locals.role.permissions;
  if(!permissions.includes("roles_edit")){
    req.flash("error" , "Error");
    res.redirect(`/${systemConfig.prefixAdmin}/roles`);
    return;
  }
	const id = req.params.id;

	try{
		const data = await account.findOne({
			_id: id, 
			deleted: false
		});
		const roles = await Role.find({
			deleted: false
		});
		res.render("admin/pages/accounts/edit", {
			titlePage: "Trang cập nhật tài khoản",
			data: data,
			roles: roles
		});
	}catch(error){
		res.redirect(`/${systemConfig.prefixAdmin}/accounts`);
	}
}

//[PATCH] /admin/accounts/edit/id		
module.exports.editPatch = async (req, res) => {
	const id = req.params.id;
	const findEmail = await account.findOne({email: req.body.email});
	if(req.body.data_email != req.body.email && findEmail){
		req.flash("error", "Email đã tồn tại");
		res.redirect("back");
		return;
	}

	delete req.body.data_email;

	if(req.body.password){
		req.body.password = md5(req.body.password);
	}else{
		delete req.body.password;
	}
	await account.updateOne({_id: id}, req.body);

	req.flash("success", "Cập nhật tài khoản thành công");

	res.redirect("back");
}