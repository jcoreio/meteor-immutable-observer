# meteor-immutable-observer

**(work in progress!)**

This uses [`Mongo.Cursor.observe`](http://docs.meteor.com/#/full/observe)  and `Mongo.Cursor.observeChanges`
to provide [Immutable.js](http://facebook.github.io/immutable-js/) views of the collection and its documents.
This is especially handy to pass to React pure render components; when documents are changed, a custom
`updateDeep` method is used so that objects/arrays inside them that didn't change will still be `===` their
previous values.

## Installation

### Node/Webpack/Browserify/jspm/HTML9 Responsive Boilerstrap JS
```
npm install meteor-immutable-observer
```
Then `var ImmutableObserver = require('meteor-immutable-observer')`

There are Webpack UMDs in the `lib/umd` folder (they rely on `immutable` being in a commons chunk)

### Meteor Package *(not deployed here yet)*
```
meteor add mindfront:immutable-observer
```
This will put `ImmutableObserver` in the package scope.

## API

**Note**: this doesn't seem to work properly when you `Meteor.subscribe()` to your collection within the same reactive computation.  I haven't yet investigated exactly why.  Right now I just `subscribe()` outside of any reactive computation.

### `ImmutableObserver.Map(cursor: Mongo.Cursor)`

Begins a live query via `cursor.observeChanges`, and tracks changes in an `Immutable.Map` of documents indexed by `_id`.

Theoretically this should perform better than `ImmutableObserver.List`, since it doesn't keep track of document order.

**This should not be called within a reactive computation.**  Since its `observeChanges` can trigger dependency
changes, it could cause an infinite autorun loop.

*Make sure you `stop()` the observer when done with it.*

###### Example:

```javascript
var Players = new Meteor.Collection('players');
var observer = ImmutableObserver.Map(Players.find({}, {limit: 10}));
...
observer.stop();
```

#### Methods

##### `documents(): Immutable.Map`

Returns an `Immutable.Map` of the currently available documents, indexed by `_id`.

Also registers a dependency on the underlying live query.

##### `stop()`

Stops the live query (calls `stop()` on what `observeChanges` returned)

### `ImmutableObserver.List(cursor: Mongo.Cursor)`

Begins a live query via `cursor.observe`, and tracks changes in an `Immutable.List` of documents in order.

**This should not be called within a reactive computation.**  Since its `observe` can trigger dependency
changes, it could cause an infinite autorun loop.

*Make sure you `stop()` the observer when done with it.*

###### Example:

```javascript
var Players = new Meteor.Collection('players');
var observer = ImmutableObserver.List(Players.find({}, {sort: {score: 1}, limit: 10}));
...
observer.stop();
```

#### Methods

##### `documents(): Immutable.List`

Returns an `Immutable.List` of the currently available documents.

Also registers a dependency on the underlying live query.

##### `stop()`

Stops the live query (calls `stop()` on what `observe` returned)

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
    this.subscription = Meteor.subscribe('posts');
    this.postsObserver = ImmutableObserver.List(Posts.find({}, {sort: {createdDate: 1}}));
  }
  componentWillUnmount() {
    this.subscription.stop();
    this.postsObserver.stop();
  }
  getMeteorData() {
    return {
      posts: postsObserver.documents(),
    };
  },
  render() {
    return <PostList {...this.props} {...this.data}/>;
  }
});
```
