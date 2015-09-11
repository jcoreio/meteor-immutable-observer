(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("immutable"));
	else if(typeof define === 'function' && define.amd)
		define(["immutable"], factory);
	else if(typeof exports === 'object')
		exports["meteor-immutable-observer"] = factory(require("immutable"));
	else
		root["meteor-immutable-observer"] = factory(root["Immutable"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_3__) {
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

	var global = (function() { return this; })();
	global.ImmutableObserver = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _ImmutableMapObserver = __webpack_require__(2);

	var _ImmutableMapObserver2 = _interopRequireDefault(_ImmutableMapObserver);

	var _ImmutableListObserver = __webpack_require__(5);

	var _ImmutableListObserver2 = _interopRequireDefault(_ImmutableListObserver);

	exports['default'] = {
	  Map: _ImmutableMapObserver2['default'],
	  List: _ImmutableListObserver2['default']
	};
	module.exports = exports['default'];

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;
	exports['default'] = ImmutableMapObserver;

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _immutable = __webpack_require__(3);

	var _immutable2 = _interopRequireDefault(_immutable);

	var _updateDeep = __webpack_require__(4);

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

	function ImmutableMapObserver(cursor) {
	  var _documents = undefined;
	  var dep = new Tracker.Dependency();

	  function update(newDocuments) {
	    _documents = newDocuments;
	    dep.changed();
	  }

	  var initialDocuments = {};
	  var handle = cursor.observeChanges({
	    added: function added(id, fields) {
	      fields._id = id;
	      if (initialDocuments) {
	        initialDocuments[id] = _immutable2['default'].fromJS(fields);
	      } else {
	        update(_documents.set(id, _immutable2['default'].fromJS(fields)));
	      }
	    },
	    changed: function changed(id, fields) {
	      update(_documents.update(id, function (document) {
	        return mergeChanges(document, fields);
	      }));
	    },
	    removed: function removed(id) {
	      update(_documents['delete'](id));
	    }
	  });
	  _documents = _immutable2['default'].Map(initialDocuments);
	  initialDocuments = undefined;

	  if (Tracker.active) {
	    Tracker.onInvalidate(function () {
	      handle.stop();
	    });
	  }

	  return {
	    documents: function documents() {
	      dep.depend();
	      return _documents;
	    },
	    stop: function stop() {
	      handle.stop();
	    }
	  };
	}

	module.exports = exports['default'];

/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_3__;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;
	exports['default'] = updateDeep;

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _immutable = __webpack_require__(3);

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

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;
	exports['default'] = ImmutableListObserver;

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _immutable = __webpack_require__(3);

	var _immutable2 = _interopRequireDefault(_immutable);

	var _updateDeep = __webpack_require__(4);

	var _updateDeep2 = _interopRequireDefault(_updateDeep);

	function ImmutableListObserver(cursor) {
	  var _documents = undefined;
	  var dep = new Tracker.Dependency();

	  function update(newDocuments) {
	    _documents = newDocuments;
	    dep.changed();
	  }

	  var initialDocuments = [];
	  var handle = cursor.observe({
	    addedAt: function addedAt(document, atIndex, before) {
	      if (initialDocuments) {
	        initialDocuments.splice(atIndex, 0, _immutable2['default'].fromJS(document));
	      } else {
	        update(_documents.splice(atIndex, 0, _immutable2['default'].fromJS(document)));
	      }
	    },
	    changedAt: function changedAt(newDocument, oldDocument, atIndex) {
	      update(_documents.update(id, function (document) {
	        return _updateDeep2['default'](document, _immutable2['default'].fromJS(newDocument));
	      }));
	    },
	    removedAt: function removedAt(oldDocument, atIndex) {
	      update(_documents.splice(atIndex, 1));
	    },
	    movedTo: function movedTo(document, fromIndex, toIndex, before) {
	      var movedDocument = _documents.get(fromIndex);
	      update(_documents.splice(fromIndex, 1).splice(toIndex, 0, movedDocument));
	    }
	  });
	  _documents = _immutable2['default'].List(initialDocuments);
	  initialDocuments = undefined;

	  if (Tracker.active) {
	    Tracker.onInvalidate(function () {
	      handle.stop();
	    });
	  }

	  return {
	    documents: function documents() {
	      dep.depend();
	      return _documents;
	    },
	    stop: function stop() {
	      handle.stop();
	    }
	  };
	}

	module.exports = exports['default'];

/***/ }
/******/ ])
});
;