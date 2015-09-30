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

	var _ImmutableListObserver = __webpack_require__(6);

	var _ImmutableListObserver2 = _interopRequireDefault(_ImmutableListObserver);

	var _ImmutableIndexByObserver = __webpack_require__(7);

	var _ImmutableIndexByObserver2 = _interopRequireDefault(_ImmutableIndexByObserver);

	exports['default'] = {
	  Map: _ImmutableMapObserver2['default'],
	  List: _ImmutableListObserver2['default'],
	  IndexBy: _ImmutableIndexByObserver2['default']
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

	var _mergeChanges = __webpack_require__(5);

	var _mergeChanges2 = _interopRequireDefault(_mergeChanges);

	function ImmutableMapObserver(cursor) {
	  if (Tracker.active) {
	    throw new Error("This can't be used inside reactive computations; it could cause infinite invalidate loops");
	  }

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
	        return _mergeChanges2['default'](document, fields);
	      }));
	    },
	    removed: function removed(id) {
	      update(_documents['delete'](id));
	    }
	  });
	  _documents = _immutable2['default'].Map(initialDocuments);
	  initialDocuments = undefined;

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
	exports['default'] = mergeChanges;

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

	module.exports = exports['default'];

/***/ },
/* 6 */
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
	  if (Tracker.active) {
	    throw new Error("This can't be used inside reactive computations; it could cause infinite invalidate loops");
	  }

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
	      update(_documents.update(atIndex, function (document) {
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
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;
	exports['default'] = ImmutableIndexByObserver;

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _immutable = __webpack_require__(3);

	var _immutable2 = _interopRequireDefault(_immutable);

	var _updateDeep = __webpack_require__(4);

	var _updateDeep2 = _interopRequireDefault(_updateDeep);

	var _mergeChanges = __webpack_require__(5);

	var _mergeChanges2 = _interopRequireDefault(_mergeChanges);

	/**
	 * This is like `ImmutableMapObserver`, except that instead of using a document's `_id`
	 * for the key in the `Immutable.Map`, it uses a custom key from the `iteratee`.  This
	 * is more efficient than calling `observer.documents().map(...)` every time something
	 * changes, but it is a bit dangerous: when a document is being added, if its key
	 * conflicts with an existing document's key, an `Error` will be thrown; likewise when a
	 * document is being changed, if `iteratee` returns a different key because of the changes
	 * that conflicts with another document's key, an `Error` will be thrown.
	 *
	 * @param{Mongo.Cursor}                 cursor    - the cursor to observe
	 * @param{string|number|array|function} iteratee  - determines the keys of the documents.
	 *    Given `document`, an instance of `Immutable.Map`:
	 *    If `iteratee` is a string or number, uses `document.get(iteratee)` as the key.
	 *    If `iteratee` is an array, uses `document.getIn(iteratee)` as the key.
	 *    If `iteratee` is a function, uses `iteratee(document)` as the key.
	 */

	function ImmutableIndexByObserver(cursor, iteratee) {
	  if (Tracker.active) {
	    throw new Error("This can't be used inside reactive computations; it could cause infinite invalidate loops");
	  }

	  if (typeof iteratee === 'string' || typeof iteratee === 'number') {
	    (function () {
	      var key = iteratee;
	      iteratee = function (document) {
	        return document.get(key);
	      };
	    })();
	  } else if (iteratee instanceof Array) {
	    (function () {
	      var path = iteratee;
	      iteratee = function (document) {
	        return document.getIn(path);
	      };
	    })();
	  }

	  var _documents = undefined;
	  var dep = new Tracker.Dependency();

	  function update(newDocuments) {
	    _documents = newDocuments;
	    dep.changed();
	  }

	  var keyMap = {};
	  var initialDocuments = {};
	  var handle = cursor.observeChanges({
	    added: function added(id, fields) {
	      fields._id = id;
	      var document = _immutable2['default'].fromJS(fields);
	      var key = iteratee(document);
	      if (initialDocuments) {
	        if (initialDocuments.hasOwnProperty(key)) {
	          throw new Error("Key (" + key + ") for added document _id " + id + " conflicts with a pre-existing document");
	        }
	        initialDocuments[key] = document;
	      } else {
	        if (_documents.has(key)) {
	          throw new Error("Key (" + key + ") for added document _id " + id + " conflicts with a pre-existing document");
	        }
	        update(_documents.set(key, document));
	      }
	      keyMap[id] = key;
	    },
	    changed: function changed(id, fields) {
	      var key = keyMap[id];
	      var document = _mergeChanges2['default'](_documents.get(key), fields);
	      var newKey = iteratee(document);
	      if (key !== newKey) {
	        if (_documents.has(newKey)) {
	          throw new Error("Key for document _id " + id + " has changed from " + key + " to " + newKey + ", which conflicts with a pre-existing document, because of changed fields: " + JSON.stringify(fields));
	        }
	        keyMap[id] = newKey;
	        update(_documents.withMutations(function (documents) {
	          documents['delete'](key);
	          documents.set(newKey, document);
	        }));
	      } else {
	        update(_documents.set(key, document));
	      }
	    },
	    removed: function removed(id) {
	      var key = keyMap[id];
	      delete keyMap[id];
	      update(_documents['delete'](key));
	    }
	  });
	  _documents = _immutable2['default'].Map(initialDocuments);
	  initialDocuments = undefined;

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