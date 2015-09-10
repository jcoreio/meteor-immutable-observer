(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("immutable"));
	else if(typeof define === 'function' && define.amd)
		define(["immutable"], factory);
	else if(typeof exports === 'object')
		exports["meteor-immutable-observer"] = factory(require("immutable"));
	else
		root["meteor-immutable-observer"] = factory(root["Immutable"]);
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

	var _ImmutableObserver = __webpack_require__(1);

	var _ImmutableObserver2 = _interopRequireDefault(_ImmutableObserver);

	exports['default'] = _ImmutableObserver2['default'];
	module.exports = exports['default'];

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;
	exports['default'] = ImmutableObserver;

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _immutable = __webpack_require__(2);

	var _immutable2 = _interopRequireDefault(_immutable);

	var _LinkedMap = __webpack_require__(3);

	var _LinkedMap2 = _interopRequireDefault(_LinkedMap);

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

	function ImmutableObserver(cursor) {
	  var documents = new _LinkedMap2['default']();
	  var documentSeq = undefined;
	  var documentMap = undefined;
	  var documentList = undefined;
	  var dep = new Tracker.Dependency();

	  function update(newDocuments) {
	    documentSeq = documentMap = documentList = undefined;
	    dep.changed();
	  }

	  var initialized = false;
	  var handle = cursor.observeChanges({
	    addedBefore: function addedBefore(id, fields, before) {
	      fields._id = id;
	      documents.set(id, _immutable2['default'].fromJS(fields), before);
	      if (initialized) update();
	    },
	    changed: function changed(id, fields) {
	      documents.set(id, mergeChanges(documents.get(id), fields));
	      update();
	    },
	    movedBefore: function movedBefore(id, before) {
	      documents.move(id, before);
	      update();
	    },
	    removed: function removed(id) {
	      documents.remove(id);
	      update();
	    }
	  });
	  initialized = true;

	  if (Tracker.active) {
	    Tracker.onInvalidate(function () {
	      handle.stop();
	    });
	  }

	  function forEach(iteratee, context) {
	    dep.depend();
	    if (arguments.length > 1) {
	      return documents.forEach(iteratee, context);
	    } else {
	      return documents.forEach(iteratee);
	    }
	  }
	  function getDocumentSeq() {
	    dep.depend();
	    if (!documentSeq) {
	      (function () {
	        var items = {};
	        documents.forEach(function (value, key) {
	          return items[key] = value;
	        });
	        documentSeq = _immutable2['default'].Seq(items);
	      })();
	    }
	    return documentSeq;
	  }
	  function getDocumentMap() {
	    dep.depend();
	    if (!documentMap) documentMap = getDocumentSeq().toOrderedMap();
	    return documentMap;
	  }
	  function getDocumentList() {
	    dep.depend();
	    if (!documentList) documentList = getDocumentSeq().toList();
	    return documentList;
	  }
	  function count() {
	    return documents.size;
	  }

	  return {
	    forEach: forEach,
	    count: count,
	    documentSeq: getDocumentSeq,
	    documentMap: getDocumentMap,
	    documentList: getDocumentList,
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
/***/ function(module, exports) {

	"use strict";

	exports.__esModule = true;

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var LinkedMap = (function () {
	  function LinkedMap() {
	    _classCallCheck(this, LinkedMap);

	    this.nodes = {};
	    this.size = 0;
	  }

	  LinkedMap.prototype.get = function get(key) {
	    if (this.nodes.hasOwnProperty(key)) {
	      return this.nodes[key].value;
	    }
	  };

	  LinkedMap.prototype.set = function set(key, value, beforeKey) {
	    var beforeNode = undefined;
	    if (beforeKey !== undefined) {
	      if (this.nodes.hasOwnProperty(beforeKey)) {
	        beforeNode = this.nodes[beforeKey];
	      } else {
	        beforeKey = undefined;
	      }
	    } else {
	      beforeNode = this.head;
	    }
	    if (this.nodes.hasOwnProperty(key)) {
	      if (beforeKey !== undefined && beforeNode !== undefined) {
	        this.remove(key);
	      } else {
	        var oldValue = this.nodes[key].oldValue;

	        if (oldValue !== value) {
	          this.nodes[key].value = value;
	        }
	      }
	    } else {
	      this.size++;
	      if (beforeNode) {
	        var prev = beforeNode.prev;
	        var node = this.nodes[key] = {
	          key: key,
	          value: value,
	          prev: prev,
	          next: beforeNode
	        };
	        prev.next = node;
	        beforeNode.prev = node;
	        if (beforeNode === this.head && beforeKey !== undefined) {
	          this.head = node;
	        }
	      } else {
	        this.head = this.nodes[key] = { key: key, value: value };
	        this.head.prev = this.head.next = this.head;
	      }
	    }
	  };

	  LinkedMap.prototype.remove = function remove(key) {
	    if (this.nodes.hasOwnProperty(key)) {
	      var node = this.nodes[key];
	      var prev = node.prev;
	      var next = node.next;
	      var value = node.value;

	      if (node === this.head) {
	        if (this.size === 1) {
	          prev = next = undefined;
	        }
	        this.head = next;
	      }
	      if (prev) prev.next = next;
	      if (next) next.prev = prev;
	      this.size--;
	      return value;
	    }
	  };

	  LinkedMap.prototype.move = function move(key, beforeKey) {
	    if (this.nodes.hasOwnProperty(key) && this.nodes.hasOwnProperty(beforeKey)) {
	      insert(key, remove(key), beforeKey);
	    }
	  };

	  LinkedMap.prototype.forEach = function forEach(iteratee, context) {
	    var node = this.head;
	    var count = 0;
	    if (node) {
	      if (arguments.length > 1) {
	        do {
	          count++;
	          if (iteratee.call(context, node.value, node.key, this) === false) {
	            return;
	          }
	          node = node.next;
	        } while (node !== this.head);
	      } else {
	        do {
	          count++;
	          if (iteratee(node.value, node.key, this) === false) {
	            return;
	          }
	          node = node.next;
	        } while (node !== this.head);
	      }
	    }
	    return count;
	  };

	  return LinkedMap;
	})();

	exports["default"] = LinkedMap;
	module.exports = exports["default"];

/***/ },
/* 4 */
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