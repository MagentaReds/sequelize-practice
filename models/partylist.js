//We technically don't have to specifically define this table, 
//as sequelize will make this table for us when we do belongsToMany
//but I am doing so just to make sure it is defined exactly how I want it.

//However, if we were going to add information to this table other than it just having
//the other tables foreignkeys, then we would need to define it ourself

module.exports = function(sequelize, DataTypes)  {

  var Partylist = sequelize.define("Partylist", {},{
    classMethods: {
      associate: function(models) {
        //a Row in Partylsit 
        Partylist.belongsTo(models.Event);
        Partylist.belongsTo(models.User);
        
      }
    }
  });

  return Partylist;

};