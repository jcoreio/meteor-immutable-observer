describe('ImmutableCursor', function() {
  it('basic test', function(done) {
    var failTimeout = setTimeout(done.fail, 5000);
    var fail = function(msg) {
      clearTimeout(failTimeout);
      done.fail(msg);
    }

    Meteor.call('clearPlayers');
    var comp = Tracker.autorun(function() {
      Meteor.subscribe('players');
      var cursor = ImmutableCursor(Players.find({name: 'Andy', score: {$gt: 1000000}})); 
      if (cursor.fetch().length) {
        clearTimeout(failTimeout);
        done();
      }
    });
    Players.insert({name: 'Andy', score: 1000000}, function(error, _id) {
      if (error) {
        fail(error);
      }
      console.log('id: ' + _id);
      Players.update({_id: _id}, {$inc: {score: 5}});
    });
  });
});