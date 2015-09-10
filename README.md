# meteor-immutable-observer

**(work in progress!)**

This uses [`Mongo.Cursor.observeChanges`](http://docs.meteor.com/#/full/observe_changes) to provide
[Immutable.js](http://facebook.github.io/immutable-js/) views of the collection and its documents.
This is especially handy to pass to React pure render components; when documents are changed, a custom
`updateDeep` method is used so that objects/arrays inside them that didn't change will still be `===` their
previous values.

## API

(TODO: deploy to npm/atmosphere)

If you use the `jedwards1211:immutable-observer` package, `ImmutableObserver` will be defined in package scope.
Alternatively, you may use it as an NPM package: `var ImmutableObserver = require('meteor-immutable-observer');`

##### `ImmutableObserver(cursor)`

Begins a live query on `cursor`, which should be a `Mongo.Cursor` returned by a `Meteor.Collection`'s `find()`.

**This should not be called within a reactive computation.**  Since its `observeChanges` can trigger dependency
changes, it could cause an infinite autorun loop.

*Make sure you `stop()` the cursor when done with it.*

Example:

```javascript
var Players = new Meteor.Collection('players');
var observer = ImmutableObserver(Players.find({}, {limit: 10}));
...
observer.stop();
```

##### `forEach(iteratee: (document?: Immutable.Map, key?: string) => any, context?: any): number`

Calls `iteratee` (optionally with `context` as `this` binding) for each document currently available.

Also registers a dependency on the underlying live query.

If `iteratee` returns `false`, iteration will stop.

Returns the number of documents iterated.

**Note**: this method is more efficient than the other accessors.

##### `documentSeq(): Immutable.Seq`

Returns a lazily-created `Immutable.Seq` of the currently available documents.

Also registers a dependency on the underlying live query.

##### `documentMap(): Immutable.OrderedMap`

Returns a lazily-created `Immutable.OrderedMap` of the currently available documents.

Also registers a dependency on the underlying live query.

##### `documentList(): Immutable.OrderedList`

Returns a lazily-created `Immutable.OrderedList` of the currently available documents.

Also registers a dependency on the underlying live query.

##### `stop()`

Stops the live query (calls `stop()` on what `observeChanges` returned)

## Example (not tested)

```jsx
import React from 'react';
import classNames from 'classnames';
import ImmutableObserver from 'meteor-immutable-observer';
import shouldPureComponentUpdate from 'react-pure-render/function';

class Post extends React.Component {
  shouldComponentUpdate = shouldPureComponentUpdate
  render() {
    var {post} = this.props;
    return <div className="panel">
      <div className="panel-heading">
        <h3 className="panel-title">{post.get('title')}</h3>
        <button><i className={post.get('isLiked') ? "glyphicon glyphicon-heart" : "glyphicon glyphicon-heart-empty"}/></button>
      </div>
      <div className="panel-body">
        {post.get('content')}
      </div>
    </div>;
  }  
}

class PostList extends React.Component {
  shouldComponentUpdate = shouldPureComponentUpdate
  render() {
    var {posts} = this.props;
    var postComponents = [];
    posts.forEach(post => postComponents.push(<Post post={post}/>));
    return <div className="posts">
      {postComponents}
    </div>;
  }
}

export default React.createClass({
  mixins: [ReactMeteorData], 
  componentWillMount() {
    this.postsObserver = ImmutableObserver(Posts.find());
  }
  componentWillUnmount() {
    this.postsObserver.stop();
  }
  getMeteorData() {
    Meteor.subscribe('posts');
    return {
      posts: postsObserver.documents(),
    };
  },
  render() {
    return <PostList {...this.props} {...this.data}/>;
  }
});
```
