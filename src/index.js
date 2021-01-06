const express = require("express");
var cors = require('cors')
const bodyParser = require("body-parser");

const app = express();

const personRoutes = require('./routes/endpoint');

const puert = 3000;

app.use(cors());

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

app.use(personRoutes);

app.listen(puert, () => {
    console.log("Server is running on port");
});