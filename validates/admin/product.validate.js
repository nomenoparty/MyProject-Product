module.exports.createPost = (req, res, next) => {
	if(!req.body.title){
		req.flash("error", `Tiêu đề không được bỏ trống`);
		res.redirect("back");
		return;
	}
	if(req.body.title.length < 4){
		req.flash("error", `Tiêu đề không được ít hơn 3 kí tự`);
		res.redirect("back");
		return;
	}
	next();
};