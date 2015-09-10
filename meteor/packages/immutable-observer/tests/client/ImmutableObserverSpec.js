describe('ImmutableObserver', function() {
  it('basic test', function(done) {
    var failTimeout = setTimeout(done.fail, 5000);
    var observer = ImmutableObserver(Players.find({name: 'Andy', score: {$gt: 1000000}})); 

    var origDone = done;
    done = function() {
      observer.stop();
      clearTimeout(failTimeout);
      origDone();
    }
    done.fail = function(msg) {
      observer.stop();
      clearTimeout(failTimeout);
      origDone.fail(msg);
    }

    Meteor.call('clearPlayers');
    var comp = Tracker.autorun(function() {
      Meteor.subscribe('players');
      console.log(JSON.stringify(observer.documents().toJS(), null, "  "));
      if (observer.documents().size) {
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