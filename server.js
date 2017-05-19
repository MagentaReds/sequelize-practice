var express = require("express");
var bodyParser = require("body-parser");

//make server
var app = express();

var PORT = 8080;

//use bodyParser for parsing JSON (among other thing) that is sent to the server as part of a http transaction
//parses anbd jams the information into req.body
app.use(bodyParser.urlencoded({ extended: false }));

//make this file aware of all our models by loading ./models/index.js
var db = require("./models");

var testRoutes = require("./routes/testRoutes.js");
app.use("/test", testRoutes);

var yourTestRoutes = require("./routes/yourTestRoutes.js");
app.use("/", yourTestRoutes);

//force sync'ing to be true to clean out the db on each server restart
db.sequelize.sync({force: true}).then(function(){
  app.listen(PORT, function(){
    console.log("App listening on PORT " + PORT);

    //loading some dummy seeds
    var dummySeeds = require("./config/dummySeeds.js");
    dummySeeds();

  });
});