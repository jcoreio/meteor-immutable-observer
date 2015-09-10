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

	function mergeChanges(document, fields) {
	  return document.withMutations(function (document) {
	    for (var key in fields) {
	      if (fields.hasOwnProperty(key)) {
	        var newValue = fields[key];
	        if (newValue === undefined) {
	          document['delete'](key);
	        } else {
	          document.update(key, function (oldValue) {
	            return _updateDeep2['default'](oldValue, _immutable2['default'].fromJS(newValue));
	          });
	        }
	      }
	    }
	  });
	}

	function ImmutableCursor(cursor) {
	  var documents = undefined;
	  var dep = new Tracker.Dependency();

	  function update(newDocuments) {
	    var oldDocuments = documents;
	    documents = newDocuments;
	    if (oldDocuments !== newDocuments) dep.changed();
	  }

	  var initialDocuments = {};
	  var handle = cursor.observeChanges({
	    added: function added(id, fields) {
	      fields._id = id;
	      if (documents) {
	        update(documents.set(id, _immutable2['default'].fromJS(fields)));
	      } else {
	        initialDocuments[id] = fields;
	      }
	    },
	    changed: function changed(id, fields) {
	      update(documents.update(id, function (document) {
	        return mergeChanges(document, fields);
	      }));
	    },
	    removed: function removed(id) {
	      update(documents['delete'](id));
	    }
	  });
	  documents = _immutable2['default'].OrderedMap(initialDocuments);
	  initialDocuments = undefined;

	  if (Tracker.active) {
	    Tracker.onInvalidate(function () {
	      handle.stop();
	    });
	  }

	  return {
	    forEach: function forEach() {
	      var _documents;

	      dep.depend();
	      return (_documents = documents).forEach.apply(_documents, arguments);
	    },
	    map: function map() {
	      var _documents2;

	      dep.depend();
	      return (_documents2 = documents).map.apply(_documents2, arguments);
	    },
	    count: function count() {
	      return cursor.count();
	    },
	    fetch: function fetch() {
	      dep.depend();
	      return documents;
	    },
	    stop: function stop() {
	      handle.stop();
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