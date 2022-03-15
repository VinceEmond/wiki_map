// load .env data into process.env
require("dotenv").config();

// Web server config
const PORT = process.env.PORT || 8080;
const sassMiddleware = require("./lib/sass-middleware");
const express = require("express");
const app = express();
const morgan = require("morgan");

// cookies
const cookieParser = require('cookie-parser');
app.use(cookieParser());


// PG database client/connection setup
const { Pool } = require("pg");
const dbParams = require("./lib/db.js");
const db = new Pool(dbParams);
db.connect();

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan("dev"));

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(
  "/styles",
  sassMiddleware({
    source: __dirname + "/styles",
    destination: __dirname + "/public/styles",
    isSass: false, // false => scss, true => sass
  })
);
app.use(express.static("public"));

const usersRoutes = require("./routes/users_route");
const maps = require("./routes/maps_route");
const mapPoints = require("./routes/map_points_route");
const login = require("./routes/login_route");

// XXXXXXXXXXXXXXXXXXXXXXXXXXX
//          ROUTES
// XXXXXXXXXXXXXXXXXXXXXXXXXXX
// Mount all resource routes here
// (Don't forget to "require" them above as well)

// const currentMapId = 1;

app.use("/users", usersRoutes(db));
// app.use(`/maps/${currentMapId}/map_points`, mapPoints(db));
app.use(`/map_points`, mapPoints(db));
app.use("/maps", maps(db));
app.use("/login", login(db));

// Home page
app.get("/", (req, res) => {
  res.render("index");
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
