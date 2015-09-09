#!/bin/sh
babel=node_modules/.bin/babel
webpack=node_modules/.bin/webpack
build_dir=lib

rm -rf $build_dir

$babel ./src -d $build_dir --ignore "__tests__" --loose all

NODE_ENV=production $webpack src/index.js $build_dir/umd/meteor-seamless-immutable-cursor.js
NODE_ENV=production $webpack -p src/index.js $build_dir/umd/meteor-seamless-immutable-cursor.min.js

echo "gzipped, the global build is `gzip -c $build_dir/umd/meteor-seamless-immutable-cursor.min.js | wc -c | sed -e 's/^[[:space:]]*//'` bytes"
