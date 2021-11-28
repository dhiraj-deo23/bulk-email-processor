const express = require("express");
const http = require("http");
const { engine } = require("express-handlebars");
const path = require("path");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const passport = require("passport");
const flash = require("express-flash");
const userRouter = require("./src/router/user");
require("./src/db/seed");

//configuring env varaibles
require("dotenv").config();
// //connecting to database
require("./src/db/mongoose");
//using passport local auth strategy
require("./src/middleware/localStrategy");
//seeding emailtemplate to database once
const seed = require("./src/db/seed");
seed();

//creating server
const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 3000;

//firing websocket server
const { wsServer } = require("./src/services/wsServer");
wsServer(server);

//handlebar settings
app.engine("hbs", engine({ extname: "hbs", defaultLayout: "main" }));
app.set("view engine", "hbs");

const publicDirectory = path.join(__dirname, "public");
app.use(express.static(publicDirectory));

//cors
app.use(cors());
//body parsing middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

//session settings
app.use(
  session({
    secret: process.env.SECRET,
    saveUninitialized: false,
    resave: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URL,
    }),
  })
);

//passport setup
app.use(passport.initialize());
app.use(passport.session());

//flash
app.use(flash());

//routers
app.use(userRouter);

server.listen(port, () => {
  console.log(`server is up on port ${port}`);
});
