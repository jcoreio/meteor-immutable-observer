(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("seamless-immutable"));
	else if(typeof define === 'function' && define.amd)
		define(["seamless-immutable"], factory);
	else if(typeof exports === 'object')
		exports["meteor-seamless-immutable-cursor"] = factory(require("seamless-immutable"));
	else
		root["meteor-seamless-immutable-cursor"] = factory(root["Immutable"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_2__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _ImmutableCursor = __webpack_require__(1);

	var _ImmutableCursor2 = _interopRequireDefault(_ImmutableCursor);

	exports['default'] = _ImmutableCursor2['default'];
	module.exports = exports['default'];

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;
	exports['default'] = ImmutableCursor;

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _seamlessImmutable = __webpack_require__(2);

	var _seamlessImmutable2 = _interopRequireDefault(_seamlessImmutable);

	function ImmutableCursor(cursor) {
	  var immutable = _seamlessImmutable2['default']([]);
	  var dep = new Tracker.Dependency();
	  var observers = [];
	  var handle = undefined;

	  function update(newImmutable) {
	    var oldImmutable = immutable;
	    immutable = newImmutable;
	    dep.changed();
	    observers.forEach(function (observer) {
	      return observer(newImmutable, oldImmutable);
	    });
	    stopObservingIfUnncessary();
	  }

	  function stopObservingIfUnncessary() {
	    if (handle && !dep.hasDependents() && !observers.length) {
	      handle.stop();
	      handle = undefined;
	    }
	  }

	  function _observe() {
	    handle = cursor.observe({
	      addedAt: function addedAt(document, atIndex, before) {
	        if (atIndex === immutable.length) {
	          update(immutable.concat(_seamlessImmutable2['default'](document)));
	        } else {
	          var array = immutable.asMutable();
	          array.splice(atIndex, 0, _seamlessImmutable2['default'](document));
	          update(_seamlessImmutable2['default'](array));
	        }
	      },
	      changedAt: function changedAt(newDocument, oldDocument, atIndex) {
	        var array = immutable.asMutable();
	        array[atIndex] = _seamlessImmutable2['default'](newDocument);
	        update(_seamlessImmutable2['default'](array));
	      },
	      removedAt: function removedAt(oldDocument, atIndex) {
	        var array = immutable.asMutable();
	        array.splice(atIndex, 1);
	        update(_seamlessImmutable2['default'](array));
	      },
	      movedTo: function movedTo(document, fromIndex, toIndex, before) {
	        var array = immutable.asMutable();
	        var elem = array[fromIndex];

	        array.splice(fromIndex, 1);
	        array.splice(toIndex, 0, elem);
	        update(_seamlessImmutable2['default'](array));
	      }
	    });
	  }

	  return {
	    forEach: function forEach() {
	      var _immutable;

	      if (!handle) _observe();
	      dep.depend();
	      return (_immutable = immutable).forEach.apply(_immutable, arguments);
	    },
	    map: function map() {
	      var _immutable2;

	      if (!handle) _observe();
	      dep.depend();
	      return (_immutable2 = immutable).map.apply(_immutable2, arguments);
	    },
	    count: function count() {
	      return cursor.count();
	    },
	    fetch: function fetch() {
	      if (!handle) _observe();
	      dep.depend();
	      return immutable;
	    },
	    observe: function observe(callback) {
	      if (!handle) _observe();
	      observers.push(callback);
	      return {
	        stop: function stop() {
	          var index = observers.indexOf(callback);
	          if (index >= 0) {
	            observers.splice(index, 1);
	            stopObservingIfUnncessary();
	          }
	        }
	      };
	    }
	  };
	}

	module.exports = exports['default'];

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_2__;

/***/ }
/******/ ])
});
;