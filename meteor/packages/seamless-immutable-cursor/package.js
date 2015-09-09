Package.describe({
  name: 'jedwards1211:seamless-immutable-cursor',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: 'Creates and auto-updates seamless-immutable arrays from Meteor Collection cursors',
  // URL to the Git repository containing the source code for this package.
  git: 'https://github.com/jedwards1211/meteor-seamless-immutable-cursor',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.1.0.3');
  api.addFiles('seamless-immutable.production.min.js');
  api.addFiles('global-meteor-seamless-immutable-cursor.js');
});