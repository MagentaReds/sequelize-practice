var express = require("express");
var db = require("../models")

var router = express.Router();


router.get("/1", function(req, res){
  res.send("Hello!");
});

//raw SQL Query that returns all the coloumns in Events with the adtional coloym numGoing that is calculated as a subquery
router.get("/2", function(req, res) {
  db.sequelize.query('SELECT *, (SELECT COUNT(UserId) FROM partylists WHERE EventId = events.id) AS "numGoing" FROM events;',
    {
      model: db.Event,
      raw: false
    }
  ).then(function(results){
    res.json(results);
  });
});


//nearly the same thing as above, but in this case using db.Event.findAll instead of a raw query
router.get("/3", function(req, res) {
  var query = {};

  db.Event.findAll({
    raw: true,
    where: query,
      attributes: Object.keys(db.Event.attributes).concat([
          [
            db.sequelize.literal('(SELECT COUNT(UserId) FROM partylists WHERE EventId = id)'),
            "numGoing"
          ]
        ])
  }).then(function(dbPost) {
    res.json(dbPost);
  });
});


//Find all events that a person is going to
//in this case, it is person with UserId 1
//Notice the order of includes, this changese the results you get back.
//this query gives us some extra info back, that we do not want.
router.get("/4", function(req, res) {
 db.Event.findAll({
    where: {
    },
    include:[{
      model: db.User, 
      through:{
        model: db.Partylist,
        where: {UserId: 1}
      }
    }],
    raw: true
  }).done(function(dbStuff){
    res.json(dbStuff);
  });
});


//same as above but gives us exactly what we want back
//Find all events that a person is going to
//in this case, it is person with UserId 1
//Notice the order of includes, this changese the results you get back.
router.get("/5", function(req, res) {
  db.Event.findAll({
    where: {
    },
    include:[{
      model: db.Partylist, 
      include:[{
        model: db.User,
        where: {id: 1}
      }]
    }],
    raw: true
  }).done(function(dbStuff){
    res.json(dbStuff)
  });
});


//same as above but gives us exactly what we want back
//Find all events that a person is going to
//in this case, it is person with UserId 1
//Notice the order of includes, this changese the results you get back.
//here we don't reference Partylist at all, sequelie's associations handles it for us.
router.get("/6", function(req, res) {
//also works
  db.Event.findAll({
    where: {
    },
    include:[{
      model: db.User, 
      where: {id: 1}
      }],
    raw: true
  }).done(function(dbStuff){
    res.json(dbStuff);
  });
});

//Query Partlist, and find all events that a specific User is going to
//in this case, UserId 1
router.get("/7", function(req, res) {
  //just a test, but works also
  db.Partylist.findAll({
    where: {
      UserId: 1
    },
    include: [db.User, db.Event],
    raw: true
  }).done(function(results){
    res.json(results);
  });
});


//REturns the numGoing to the specific Event
//in this case EventId 3
router.get("/8", function(req, res) {
  //works, for getting count of thing going to specific event
  //we can use this to calculate open slots when people try to join
  db.Partylist.findAll({
    attributes:  [[db.sequelize.fn('COUNT', db.sequelize.col('UserId')), 'numGoing']],
    where: {
      EventId: 3
    }
  }).done(function(results){
    res.json(results);
  });
});


//api'ish route, returns all users from database
router.get("/9", function(req, res){
  db.User.findAll({}).done(function(dbUsers){
    res.json(dbUsers);
  })
});

//api'ish route, returns all events from database
router.get("/10", function(req, res){
  db.Event.findAll({}).done(function(dbEvents){
    res.json(dbEvents);
  })
});



module.exports = router;