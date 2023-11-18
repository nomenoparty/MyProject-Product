const express = require("express");
require("dotenv").config();

const methodOverride = require("method-override");
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser')
const flash = require("express-flash");
const session = require("express-session");
const http = require('http');
const { Server } = require("socket.io");
const database = require("./config/database");
const systemConfig = require("./config/system");
const path = require('path');
const moment = require('moment');
database.connect();

const product = require('./models/products.model');

const app = express();

const server = http.createServer(app);
const io = new Server(server);

global._io = io;

const port = process.env.PORT;  

const routeAdmin = require("./routes/admin/index.route");
const route = require("./routes/client/index.route");

app.set("views", `${__dirname}/views`);
app.set("view engine", "pug");


app.use(cookieParser("LHNASDASDAD"));
app.use(session({ cookie: { maxAge: 60000 } }));
app.use(flash());

app.use(express.static(`${__dirname}/public`));

app.use('/tinymce', express.static(path.join(__dirname, 'node_modules', 'tinymce')));

app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({ extended: false }));

app.locals.prefixAdmin = systemConfig.prefixAdmin;
app.locals.moment = moment;

routeAdmin(app);
route(app);

app.get("*", (req, res) => {
  res.render("clients/pages/errors/404", {
    titlePage: "404 Not Found"
  });
});

server.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
