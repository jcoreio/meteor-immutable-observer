(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("immutable"));
	else if(typeof define === 'function' && define.amd)
		define(["immutable"], factory);
	else if(typeof exports === 'object')
		exports["meteor-immutable-cursor"] = factory(require("immutable"));
	else
		root["meteor-immutable-cursor"] = factory(root["Immutable"]);
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

	var _immutable = __webpack_require__(2);

	var _immutable2 = _interopRequireDefault(_immutable);

	var _updateDeep = __webpack_require__(3);

	var _updateDeep2 = _interopRequireDefault(_updateDeep);

	function ImmutableCursor(cursor) {
	  var documents = _immutable2['default'].fromJS(cursor.fetch());
	  var dep = new Tracker.Dependency();
	  var observers = [];
	  var handle = undefined;

	  function update(newDocuments) {
	    var oldDocuments = documents;
	    documents = newDocuments;
	    dep.changed();
	    observers.forEach(function (observer) {
	      return observer(newDocuments, oldDocuments);
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
	    update(_immutable2['default'].fromJS(cursor.fetch()));
	    handle = cursor.observe({
	      addedAt: function addedAt(document, atIndex, before) {
	        update(documents.splice(atIndex, 0, _immutable2['default'].fromJS(document)));
	      },
	      changedAt: function changedAt(newDocument, oldDocument, atIndex) {
	        update(documents.update(atIndex, function (oldDocument) {
	          return _updateDeep2['default'](oldDocument, _immutable2['default'].fromJS(newDocument));
	        }));
	      },
	      removedAt: function removedAt(oldDocument, atIndex) {
	        update(documents.splice(atIndex, 1));
	      },
	      movedTo: function movedTo(document, fromIndex, toIndex, before) {
	        var immDocument = documents.get(fromIndex);
	        update(documents['delete'](fromIndex).splice(toIndex, 0, immDocument));
	      }
	    });
	  }

	  return {
	    forEach: function forEach() {
	      var _documents;

	      if (dep.depend() && !handle) _observe();
	      return (_documents = documents).forEach.apply(_documents, arguments);
	    },
	    map: function map() {
	      var _documents2;

	      if (dep.depend() && !handle) _observe();
	      return (_documents2 = documents).map.apply(_documents2, arguments);
	    },
	    count: function count() {
	      return cursor.count();
	    },
	    fetch: function fetch() {
	      if (dep.depend() && !handle) _observe();
	      return documents;
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

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;
	exports['default'] = updateDeep;

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _immutable = __webpack_require__(2);

	var _immutable2 = _interopRequireDefault(_immutable);

	function updateDeep(a, b) {
	  if (!(a instanceof _immutable2['default'].Collection) || !(b instanceof _immutable2['default'].Collection) || Object.getPrototypeOf(a) !== Object.getPrototypeOf(b)) {
	    return a === b ? a : b;
	  }
	  return a.withMutations(function (result) {
	    a.forEach(function (oldValue, key) {
	      if (!b.has(key)) {
	        result['delete'](key);
	      }
	    });
	    b.forEach(function (newValue, key) {
	      if (!a.has(key)) {
	        result.set(key, newValue);
	      } else {
	        result.set(key, updateDeep(a.get(key), newValue));
	      }
	    });
	  });
	}

	module.exports = exports['default'];

/***/ }
/******/ ])
});
;