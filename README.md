# meteor-seamless-immutable-cursor

(work in progress!)

This is a wrapper for [`Mongo.Cursor`](http://docs.meteor.com/#/full/mongo_cursor) that provides
[seamless-immutable](https://github.com/rtfeldman/seamless-immutable) views of the collection and its documents.
This is especially handy to pass to React pure render components; when documents are changed, a custom
`updateDeep` method is used so that objects/arrays inside them that didn't change will still be `===` their
previous values.

It has the same interface as `Mongo.Cursor` with two exceptions:
* no `observeChanges` method
* `observe` takes a single callback that will be called with `{newDocuments, oldDocuments}`
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
        <h3 className="panel-title">{post.title}</h3>
        <button><i className={post.isLiked ? "glyphicon glyphicon-heart" : "glyphicon glyphicon-heart-empty"}/></button>
      </div>
      <div className="panel-body">
        {post.content}
      </div>
    </div>;
  }  
}

class PostList extends React.Component {
  shouldComponentUpdate = shouldPureComponentUpdate
  render() {
    var {posts} = this.props;
    return <div className="posts">
      {posts.map(post => (<Post post={post}/>))}
    </div>;
  }
}

export default React.createClass({
  mixins: [ReactMeteorData], 
  getMeteorData() {
    Meteor.subscribe('posts');
    return {
      ImmutableCursor(Posts.find()).fetch();
    };
  },
  render() {
    return <PostList {...this.props} {...this.data}/>;
  }
});
```