# meteor-immutable-cursor

(work in progress!)

This is a wrapper for [`Mongo.Cursor`](http://docs.meteor.com/#/full/mongo_cursor) that provides
[Immutable.js](http://facebook.github.io/immutable-js/) views of the collection and its documents.
This is especially handy to pass to React pure render components; when documents are changed, a custom
`updateDeep` method is used so that objects/arrays inside them that didn't change will still be `===` their
previous values.

To create one you simply do `ImmutableCursor(MyCollection.find(...))`.  
It has the same interface as `Mongo.Cursor` with two exceptions:
* no `observeChanges` method
* `observe` takes a single callback that will be called with `(newDocuments, oldDocuments)`
  whenever the collection changes.

## Example (not tested yet)

```jsx
import React from 'react';
import classNames from 'classnames';
import ImmutableCursor from 'meteor-seamless-immutable-cursor';
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
    this.postsCursor = ImmutableCursor(Posts.find());
  }
  componentWillUnmount() {
    this.postsCursor.stop();
  }
  getMeteorData() {
    Meteor.subscribe('posts');
    return {
      posts: postsCursor.fetch(),
    };
  },
  render() {
    return <PostList {...this.props} {...this.data}/>;
  }
});
```
