const User = require("../../models/user.model");

module.exports.requireAuth = async (req, res, next) => {
  if(!req.cookies.tokenUser){
    req.flash("error", "Vui lòng đăng nhập");
    res.redirect("/user/login");
    return;
  }

  const user = await User.findOne({
    tokenUser: req.cookies.tokenUser
  });

  if(!user){
    res.redirect("/user/login");
    return;
  }

  next();
}