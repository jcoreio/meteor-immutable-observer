#!/bin/sh
babel=node_modules/.bin/babel
webpack=node_modules/.bin/webpack
build_dir=lib
meteor_package_dir=meteor/packages/immutable-observer

rm -rf $build_dir

$babel ./src -d $build_dir --ignore "__tests__" --loose all

NODE_ENV=production $webpack src/index.js $build_dir/umd/meteor-immutable-observer.js
NODE_ENV=production $webpack -p src/index.js $build_dir/umd/meteor-immutable-observer.min.js
NODE_ENV=production $webpack src/setGlobalImmutableObserver.js $meteor_package_dir/global-meteor-immutable-observer.js

echo "gzipped, the global build is `gzip -c $build_dir/umd/meteor-immutable-observer.min.js | wc -c | sed -e 's/^[[:space:]]*//'` bytes"
