// [GET] /admin/dashboard
module.exports.dashboard = (req, res) => {
	res.render("admin/pages/dashboard/index", {
		titlePage: "Tổng quan",
	});
}