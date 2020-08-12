var mysql = require("mysql");
var http = require("http");
const express = require("express");

var pug = require("pug");
var bodyParser = require("body-parser");
const { response } = require("express");
//var router = express.Router();

const port = 420;
const app = express();

app.set("view engine", "pug");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const sql = `SELECT * FROM city`;

var cities;

var con = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "admin",
	database: "world",
});

con.connect(function (err) {
	if (err) throw err;
	console.log("Connected!");
	con.query(sql, (error, result, fields) => {
		if (error) {
			return console.error(error.message);
		}
		console.log(result[2]);
		cities = result;
	});
});

app.get("/", (req, res) => {
	res.render("layout", { title: "Cities" });
});

app.get("/addCity", (req, res) => {
	res.render("add", { title: "Cities" });
});

app.post("/add", (req, res) => {
	var add =
		"INSERT INTO `city` (Name, CountryCode, District, Population) VALUES ('" +
		req.body.Name +
		"','" +
		req.body.CountryCode +
		"','" +
		req.body.District +
		"'," +
		req.body.Population +
		")";

	con.query(add, (error, result, fields) => {
		if (error) {
			return console.error(error.message);
		}
		console.log("added!");
	});

	con.query(sql, (error, result, fields) => {
		if (error) {
			return console.error(error.message);
		}
		console.log(result[2]);
		cities = result;
	});
	return res.render("layout", { title: "Cities " });
});

app.post("/city", (req, res) => {
	var foundCity;

	cities.forEach((city) => {
		if (city.Name.includes(req.body.cityname)) {
			foundCity = city;
		}
	});

	console.log(foundCity);
	return res.render("city", {
		title: "CityDetails",
		city: foundCity,
	});
});

app.listen(port, function () {
	console.log(`Server listening on port ${port}`);
});
