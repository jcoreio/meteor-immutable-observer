// Set up a collection to contain player information. On the server,
// it is backed by a MongoDB collection named "players".

Players = new Meteor.Collection("players");

// On server startup, create some players if the database is empty.
if (Meteor.isServer) {
  Meteor.methods({
    clearPlayers: function() {
      Players.remove({});
    }
  });

  Meteor.startup(function () {
    Meteor.publish('players', function(){
      return Players.find();
    });
  });
}