Package.describe({
  name: 'jedwards1211:immutable-cursor',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: 'Creates and auto-updates Immutable.js arrays from Meteor Collection cursors',
  // URL to the Git repository containing the source code for this package.
  git: 'https://github.com/jedwards1211/meteor-immutable-cursor',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.1.0.3');
  api.use('dataflows:immutable@3.6.2')
  api.addFiles('global-meteor-immutable-cursor.js');
});