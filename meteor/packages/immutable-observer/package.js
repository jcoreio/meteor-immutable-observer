Package.describe({
  name: 'mindfront:immutable-observer',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: 'Creates and auto-updates Immutable.js collections from Meteor Collection cursors',
  // URL to the Git repository containing the source code for this package.
  git: 'https://github.com/mindfront/meteor-immutable-observer',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.1.0.3');
  api.use('dataflows:immutable@3.6.2')
  api.addFiles('global-meteor-immutable-observer.js');
});

Package.onTest(function(api) {
  api.use('sanjo:jasmine@0.18.0');
  api.use('dataflows:immutable@3.6.2')
  api.use('insecure');
  api.addFiles('global-meteor-immutable-observer.js');
  api.addFiles('tests/Players.js');
  api.addFiles('tests/client/ImmutableObserverSpec.js', 'client');
});