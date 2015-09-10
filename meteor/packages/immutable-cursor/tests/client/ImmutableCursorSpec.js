describe('ImmutableCursor', function() {
  it('basic test', function(done) {
    var failTimeout = setTimeout(done.fail, 5000);
    var cursor = ImmutableCursor(Players.find({name: 'Andy', score: {$gt: 1000000}})); 

    var origDone = done;
    done = function() {
      cursor.stop();
      clearTimeout(failTimeout);
      origDone();
    }
    done.fail = function(msg) {
      cursor.stop();
      clearTimeout(failTimeout);
      origDone.fail(msg);
    }

    Meteor.call('clearPlayers');
    var comp = Tracker.autorun(function() {
      Meteor.subscribe('players');
      console.log(JSON.stringify(cursor.fetch().toJS(), null, "  "));
      if (cursor.fetch().size) {
        done();
      }
    });
    Players.insert({name: 'Andy', score: 1000000}, function(error, _id) {
      if (error) {
        done.fail(error);
      }
      Players.update({_id: _id}, {$inc: {score: 5}}, function(error) {
        if (error) {
          done.fail(error);
        }
      });
    });
  });
});