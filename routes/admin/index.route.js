const systemConfig = require("../../config/system");
const dashboardRoute = require("./dashboard.route");
const productRoute = require("./product.route");
const productCategoryRoute = require("./product-category.route");
const roleRoute = require("./role.route");
const accountRoute = require("./account.route");
const authRoute = require("./auth.route");
const myAccountRoute = require("./my-account.route");
const settingtRoute = require("./setting.route");

const authController = require("../../controllers/admin/auth.controller");

const authMiddleware = require("../../middlewares/admin/auth.middleware");

module.exports = (app) => {
	const PATH_ADMIN = "/" + systemConfig.prefixAdmin;

	app.get(PATH_ADMIN, authController.login);

	app.use(PATH_ADMIN + "/dashboard", authMiddleware.requireAuth, dashboardRoute);
	app.use(PATH_ADMIN + "/products", authMiddleware.requireAuth, productRoute);
	app.use(PATH_ADMIN + "/product-category", authMiddleware.requireAuth, productCategoryRoute);
	app.use(PATH_ADMIN + "/roles", authMiddleware.requireAuth, roleRoute);
	app.use(PATH_ADMIN + "/accounts", authMiddleware.requireAuth, accountRoute);
	app.use(PATH_ADMIN + "/auth", authRoute);
	app.use(PATH_ADMIN + "/my-account", authMiddleware.requireAuth, myAccountRoute);
	app.use(PATH_ADMIN + "/settings", authMiddleware.requireAuth, settingtRoute);
};