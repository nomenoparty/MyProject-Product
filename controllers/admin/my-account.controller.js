const md5 = require("md5");

const account = require("../../models/account.model");

//[GET] /admin/my-account
module.exports.index = async (req, res) => {
	res.render("admin/pages/my-account/index", {
		titlePage: "Thông tin cá nhân",
	});
}

//[GET] /admin/my-account/edit
module.exports.edit = async (req, res) => {
	res.render("admin/pages/my-account/edit", {
		titlePage: "Trang chỉnh sửa thông tin cá nhân",
	});
}

//[PATCH] /admin/my-account/edit
module.exports.editPatch = async (req, res) => {
	if(req.body.password){
		req.body.password = md5(req.body.password);
	}else{
		delete req.body.password;
	}

	await account.updateOne({_id: res.locals.user.id}, req.body);

	req.flash("success", "Cập nhật thành công");
	res.redirect("back");
}