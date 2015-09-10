# meteor-immutable-observer

**(work in progress!)**

This uses [`Mongo.Cursor.observeChanges`](http://docs.meteor.com/#/full/observe_changes) to provide
[Immutable.js](http://facebook.github.io/immutable-js/) views of the collection and its documents.
This is especially handy to pass to React pure render components; when documents are changed, a custom
`updateDeep` method is used so that objects/arrays inside them that didn't change will still be `===` their
previous values.

To create one you simply do `var observer = ImmutableObserver(MyCollection.find(...))`.
`observer.documents()` will return an `Immutable.OrderedMap` of the documents indexed by id, and register
a dependency on the underlying documents.
You must later call `stop()` on it (although if it is created inside a reactive computation, 
it will be stopped automatically when the computation is invalidated).

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
