module.exports = function(sequelize, DataTypes){
  var User = sequelize.define("User", {
    oauthId: {
      type: DataTypes.STRING,
      allowNull: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    credType: {
      type: DataTypes.STRING,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true
    },
    hash: {
      type: DataTypes.STRING,
      allowNull: true
    },
    subscribed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    }
  },
  {
    classMethods: {
      associate: function(models) {
        // Associating User with Event
        User.hasMany(models.Event, 
          {
           foreignKey: {
            name: "creatorId",
            allowNull: false,
          }
        });

        //allows us to use include: ["User"] when queriying db.Event and get back that infomation too
        User.belongsToMany(models.Event, {through: models.Partylist});

        //same thing as above but with include: ["Partylist"] instead
        //this is probably no needed, but allows us to be more flexible with our queries.
        User.hasMany(models.Partylist);
      }
    }
  }
);
  return User;
};
