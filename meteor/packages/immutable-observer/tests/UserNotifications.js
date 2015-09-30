// Set up a collection to contain player information. On the server,
// it is backed by a MongoDB collection named "userNotifications`".

UserNotifications = new Meteor.Collection("userNotifications");

var UserNotificationsSchema = new SimpleSchema({
  podId: {
    type: String,
    index: true
  },
  channelId: {
    type: String
  },
  userId: {
    type: String
  },
  alarmIds: {
    type: [String]
  }
});
UserNotifications.attachSchema(UserNotificationsSchema);

// On server startup, create some userNotifications if the database is empty.
if (Meteor.isServer) {
  Meteor.methods({
    clearUserNotifications: function() {
      UserNotifications.remove({});
    }
  });

  Meteor.startup(function () {
    Meteor.publish('userNotifications', function(){
      return UserNotifications.find();
    });
  });
}