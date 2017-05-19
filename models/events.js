module.exports = function(sequelize, DataTypes){
  var Event = sequelize.define("Event", {
    description: {
      type: DataTypes.STRING,
      allowNull: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    numAttendees: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    category: {
      type: DataTypes.STRING,
      allowNull: true
    },
    location: {
      type: DataTypes.STRING,
      allowNull: true
    },
    startTime: {
      type: DataTypes.STRING,
      allowNull: true
    },
    endTime: {  
      type: DataTypes.STRING,
      allowNull: true
    },
    date: {
      type: DataTypes.STRING,
      allowNull: true
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true
    },
    placesId: {
      type: DataTypes.STRING,
      allowNull: true
    },
    latLng: {
      type: DataTypes.STRING,
      allowNull: true
    }
  },
  {
    classMethods: {
      associate: function(models) {
        // Associating Event with User
        Event.belongsTo(models.User, {
          as: "Creator",
          foreignKey: {
            name: "creatorId",
            allowNull: false,
          }
        });

        //allows us to use include: ["User"] when queriying db.Event and get back that infomation too
        Event.belongsToMany(models.User, {through: models.Partylist});

        //same thing as above but with include: ["Partylist"] instead
        //this is probably no needed, but allows us to be more flexible with our queries.
        Event.hasMany(models.Partylist);
      }
    }
  }
);
  return Event;
};
