# sequelize-practice

This is a small node express app with routes defined on /test/1 through /test/10 to see how sequelize does querying.  And I have added a seperate routes file mounted to '/' for you to add your own routes for testing.

I have some dummySeeds and models set up to help with testing/practice.

You'll need to ```create database test_database``` in mysql before the server will work correctly.  And also be sure to change the password in config.json to whatever your local mysql password is.

----


For testing purposes, I recommend res.json() query results to the browswer and letting Chrome's Json formatter make then easier to read.  It is much easier to see what exactly the query is return you than if you tried to console.log it in the termnial.

In this little example repo, I am focusing on querying and associations settup as I feel those are the two areas that giving the most trouble.  

---
You see sometimes (most times) I use {raw: true}, when querying.  This is because I am mostly interested in just the raw data from the mysql database most of the time.  If you set {raw: false} (which it is by default), the promise returns you sequelize objects instead of just raw data.  This is useful if you need/want to use functions and methods that are part of them, like addUser and whatnot.

And for another note, if you are making large changes to your models, especially constraints, you may have to drop your database completely in mysql.  Even though we are ```{force_sync: true}```, it doesn't always get rid of extra constaraints that may be left over in mysql from when you changed your models.  So if your code is acting not like you expect, try dropping the entire database to see if it helps.

There are ways to drop constraints in mysql directly without killing the whole db, but I don't know enough of mysql to be able to tell you which ones are causing the problem, but be aware that they exist if you want to do some learning on your own.

---

For Sequelize [belongsToMany](http://docs.sequelizejs.com/manual/tutorial/associations.html#belongs-to-many-associations) ,
it is helpful to know that it exposes several helper methods to the model that will make your life easier.  You can see a this exmaple using some in the dummySeeds.js file.

---
Belongs-To-Many associations are used to connect sources with multiple targets. Furthermore the targets can also have connections to multiple sources.

Project.belongsToMany(User, {through: 'UserProject'});
User.belongsToMany(Project, {through: 'UserProject'});
This will create a new model called UserProject with the equivalent foreign keys projectId and userId. Whether the attributes are camelcase or not depends on the two models joined by the table (in this case User and Project).

Defining through is required. Sequelize would previously attempt to autogenerate names but that would not always lead to the most logical setups.

This will add methods getUsers, setUsers, addUser,addUsers to Project, and getProjects, setProjects, addProject, and addProjects to User.

---

In this little example server, we have two tables, with two different associations between them.

---
One User can be the creator of many Event
(1:m, one to many)
(the foreign key in the relationship is stored in Event)

and

Many Users can be going to many Events
(n:m, many to many)

---

To do the many to many associaton, in Sql, it is done through a third table.  In this example, I specifically named that table Partylist and gave it its own associations in sequelize.

One Event can have many Partylist
(1:m, the foreignkey in the relationship is stored in Partylist)

and 

One User can have many Partylist
(1:m, the foreignkey in the relationship is stored in Partylist)

---

One thing to keep in mind, when you adding new associations between models, make sure the sme options are set on both sides in the models, otherwise you'll get some behavior you don't want.

For example:

In my one User to many Event, I wanted to rename the foreignkey that is going to be stored in Event as "creatorId", just so it easier to understand what the association is.

in events.js I had 
```
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

```

I thought would be enough to do what I want, so I users.js I had left it mostly alone

```
    classMethods: {
      associate: function(models) {
        // Associating User with Event
        User.hasMany(models.Event);
```

And when the code ran, in the Events table, it had two foreign keys, one called creatorId like I wanted, and one called userId that I didn't want.