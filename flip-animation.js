/*!
 * @license flip-animation.js ver.1.0.0 Copyright(c) 2016 sasa+1
 * https://github.com/sasaplus1-prototype/flip-animation.js
 * Released under the MIT license.
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["flipAnimation"] = factory();
	else
		root["flipAnimation"] = factory();
})(this, function() {
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

	var AnimationFrame = __webpack_require__(4);

	var loadImage = __webpack_require__(9);

	var isArray = __webpack_require__(11),
	    isFunction = __webpack_require__(3),
	    isNumber = __webpack_require__(12);

	// NOTE: get global object by any environment
	var Promise = Function('return this')().Promise;

	/**
	 * noop function
	 */
	function noop() {}

	/**
	 * load images
	 *
	 * @param {String|String[]} images
	 * @return {Promise}
	 */
	function load(images) {
	  var promises = [],
	      i, len;

	  if (!isArray(images)) {
	    images = [images];
	  }

	  for (i = 0, len = images.length; i < len; ++i) {
	    promises.push(
	      loadImage(images[i])
	    );
	  }

	  return Promise.all(promises);
	}

	/**
	 * start animation
	 *
	 * @param {Object} options
	 * @param {Number} options.step
	 * @param {Number} [options.fps]
	 * @param {Function} [options.begin]
	 * @param {Function} [options.complete]
	 * @param {Function} [options.progress]
	 */
	function start(options) {
	  var progress, complete, context;

	  if (!isNumber(options.step) || !isFinite(options.step)) {
	    throw new TypeError('step is must be a finite number');
	  }

	  progress = options.progress;
	  complete = options.complete;

	  context = {
	    af: new AnimationFrame({
	      frameRate: options.fps
	    }),
	    complete: (isFunction(complete)) ? complete : noop,
	    count: 1,
	    progress: (isFunction(progress)) ? progress : noop,
	    step: Math.floor(options.step)
	  };

	  if (isFunction(options.begin)) {
	    options.begin();
	  }

	  tick.call(context);
	}

	/**
	 * for frame animation
	 */
	function tick() {
	  var that = this;

	  that.af.request(function() {
	    var count, step;

	    ++that.count;

	    count = that.count;
	    step = that.step;

	    if (count <= step) {
	      tick.call(that);
	    }

	    that.progress({
	      count: count - 1
	    });

	    if (count > step) {
	      that.complete();
	    }
	  });
	}

	module.exports = {
	  Promise: Promise,
	  load: load,
	  start: start
	};


/***/ },
/* 1 */
/***/ function(module, exports) {

	'use strict'

	/**
	 * Crossplatform Date.now()
	 *
	 * @return {Number} time in ms
	 * @api private
	 */
	module.exports = Date.now || function() {
	  return (new Date).getTime()
	}


/***/ },
/* 2 */
/***/ function(module, exports) {

	var root
	// Browser window
	if (typeof window !== 'undefined') {
	  root = window
	// Web Worker
	} else if (typeof self !== 'undefined') {
	  root = self
	// Other environments
	} else {
	  root = this
	}

	module.exports = root


/***/ },
/* 3 */
/***/ function(module, exports) {

	'use strict';

	var toString = Object.prototype.toString;

	module.exports = function isFunction(value) {
	  return (
	    typeof value === 'function' || toString.call(value) === '[object Function]'
	  );
	};


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * An even better animation frame.
	 *
	 * @copyright Oleg Slobodskoi 2016
	 * @website https://github.com/kof/animationFrame
	 * @license MIT
	 */

	module.exports = __webpack_require__(5)


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	var nativeImpl = __webpack_require__(6)
	var now = __webpack_require__(1)
	var performance = __webpack_require__(8)
	var root = __webpack_require__(2)

	// Weird native implementation doesn't work if context is defined.
	var nativeRequest = nativeImpl.request
	var nativeCancel = nativeImpl.cancel

	/**
	 * Animation frame constructor.
	 *
	 * Options:
	 *   - `useNative` use the native animation frame if possible, defaults to true
	 *   - `frameRate` pass a custom frame rate
	 *
	 * @param {Object|Number} options
	 */
	function AnimationFrame(options) {
	    if (!(this instanceof AnimationFrame)) return new AnimationFrame(options)
	    options || (options = {})

	    // Its a frame rate.
	    if (typeof options == 'number') options = {frameRate: options}
	    options.useNative != null || (options.useNative = true)
	    this.options = options
	    this.frameRate = options.frameRate || AnimationFrame.FRAME_RATE
	    this._frameLength = 1000 / this.frameRate
	    this._isCustomFrameRate = this.frameRate !== AnimationFrame.FRAME_RATE
	    this._timeoutId = null
	    this._callbacks = {}
	    this._lastTickTime = 0
	    this._tickCounter = 0
	}

	module.exports = AnimationFrame

	/**
	 * Default frame rate used for shim implementation. Native implementation
	 * will use the screen frame rate, but js have no way to detect it.
	 *
	 * If you know your target device, define it manually.
	 *
	 * @type {Number}
	 * @api public
	 */
	AnimationFrame.FRAME_RATE = 60

	/**
	 * Replace the globally defined implementation or define it globally.
	 *
	 * @param {Object|Number} [options]
	 * @api public
	 */
	AnimationFrame.shim = function(options) {
	    var animationFrame = new AnimationFrame(options)

	    root.requestAnimationFrame = function(callback) {
	        return animationFrame.request(callback)
	    }
	    root.cancelAnimationFrame = function(id) {
	        return animationFrame.cancel(id)
	    }

	    return animationFrame
	}

	/**
	 * Request animation frame.
	 * We will use the native RAF as soon as we know it does works.
	 *
	 * @param {Function} callback
	 * @return {Number} timeout id or requested animation frame id
	 * @api public
	 */
	AnimationFrame.prototype.request = function(callback) {
	  var self = this

	  // Alawys inc counter to ensure it never has a conflict with the native counter.
	  // After the feature test phase we don't know exactly which implementation has been used.
	  // Therefore on #cancel we do it for both.
	  ++this._tickCounter

	  if (nativeImpl.supported && this.options.useNative && !this._isCustomFrameRate) {
	    return nativeRequest(callback)
	  }

	  if (!callback) throw new TypeError('Not enough arguments')

	  if (this._timeoutId == null) {
	    // Much faster than Math.max
	    // http://jsperf.com/math-max-vs-comparison/3
	    // http://jsperf.com/date-now-vs-date-gettime/11
	    var delay = this._frameLength + this._lastTickTime - now()
	    if (delay < 0) delay = 0

	    this._timeoutId = setTimeout(function() {
	      self._lastTickTime = now()
	      self._timeoutId = null
	      ++self._tickCounter
	      var callbacks = self._callbacks
	      self._callbacks = {}
	      for (var id in callbacks) {
	        if (callbacks[id]) {
	          if (nativeImpl.supported && self.options.useNative) {
	            nativeRequest(callbacks[id])
	          } else {
	            callbacks[id](performance.now())
	          }
	        }
	      }
	    }, delay)
	  }

	  this._callbacks[this._tickCounter] = callback

	  return this._tickCounter
	}

	/**
	 * Cancel animation frame.
	 *
	 * @param {Number} timeout id or requested animation frame id
	 *
	 * @api public
	 */
	AnimationFrame.prototype.cancel = function(id) {
	if (nativeImpl.supported && this.options.useNative) nativeCancel(id)
	delete this._callbacks[id]
	}


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	var root = __webpack_require__(2)

	// Test if we are within a foreign domain. Use raf from the top if possible.
	try {
	  // Accessing .name will throw SecurityError within a foreign domain.
	  root.top.name
	  root = root.top
	} catch(e) {}

	exports.request = root.requestAnimationFrame
	exports.cancel = root.cancelAnimationFrame || root.cancelRequestAnimationFrame
	exports.supported = false

	var vendors = ['Webkit', 'Moz', 'ms', 'O']

	// Grab the native implementation.
	for (var i = 0; i < vendors.length && !exports.request; i++) {
	  exports.request = root[vendors[i] + 'RequestAnimationFrame']
	  exports.cancel = root[vendors[i] + 'CancelAnimationFrame'] ||
	    root[vendors[i] + 'CancelRequestAnimationFrame']
	}

	// Test if native implementation works.
	// There are some issues on ios6
	// http://shitwebkitdoes.tumblr.com/post/47186945856/native-requestanimationframe-broken-on-ios-6
	// https://gist.github.com/KrofDrakula/5318048

	if (exports.request) {
	  exports.request.call(null, function() {
	    exports.supported = true
	  })
	}


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	var now = __webpack_require__(1)

	/**
	 * Replacement for PerformanceTiming.navigationStart for the case when
	 * performance.now is not implemented.
	 *
	 * https://developer.mozilla.org/en-US/docs/Web/API/PerformanceTiming.navigationStart
	 *
	 * @type {Number}
	 * @api private
	 */
	exports.navigationStart = now()


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'

	var now = __webpack_require__(1)
	var PerformanceTiming = __webpack_require__(7)
	var root = __webpack_require__(2)

	/**
	 * Crossplatform performance.now()
	 *
	 * https://developer.mozilla.org/en-US/docs/Web/API/Performance.now()
	 *
	 * @return {Number} relative time in ms
	 * @api public
	 */
	exports.now = function () {
	  if (root.performance && root.performance.now) return root.performance.now()
	  return now() - PerformanceTiming.navigationStart
	}


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var isFunction = __webpack_require__(3);

	var once = __webpack_require__(10);

	/**
	 * callback when image loaded
	 *
	 * @param {String} src
	 * @param {Function} callback
	 */
	function load(src, callback) {
	  var image = new Image();

	  image.onabort = function(event) {
	    callback(new Error('onabort'), event);
	  };
	  image.onerror = function(event) {
	    callback(new Error('onerror'), event);
	  };

	  image.onload = function() {
	    callback(null, image);
	  };
	  image.src = src;

	  if (image.naturalWidth || image.complete) {
	    callback(null, image);
	  }
	}

	/**
	 * load image
	 *
	 * @param {String} src
	 * @param {Function} [callback]
	 * @return {Promise}
	 */
	function loadImage(src, callback) {
	  if (isFunction(callback)) {
	    load(src, once(callback));
	  } else {
	    return new loadImage.Promise(function(resolve, reject) {
	      load(src, function(err, image) {
	        (err) ? reject(err) : resolve(image);
	      });
	    });
	  }
	}

	// NOTE: get global object by any environment
	loadImage.Promise = Function('return this')().Promise;

	module.exports = loadImage;


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var isFunction = __webpack_require__(3);

	/**
	 * return converted function
	 *
	 * @param {Function} fn
	 * @throws {TypeError}
	 * @return {Function}
	 */
	module.exports = function once(fn) {
	  var count;

	  if (!isFunction(fn)) {
	    throw new TypeError('fn must be a Function');
	  }

	  count = 1;

	  return function() {
	    var args, call;

	    if (count-- <= 0) {
	      return;
	    }

	    args = arguments;
	    call = 'call';

	    switch (args.length) {
	      case 0:
	        return fn[call](this);
	      case 1:
	        return fn[call](this, args[0]);
	      case 2:
	        return fn[call](this, args[0], args[1]);
	      case 3:
	        return fn[call](this, args[0], args[1], args[2]);
	      default:
	        return fn.apply(this, args);
	    }
	  };
	};


/***/ },
/* 11 */
/***/ function(module, exports) {

	'use strict';

	var toString = Object.prototype.toString;

	module.exports = (Array.isArray) ?
	  function isArray(value) {
	    return Array.isArray(value);
	  } :
	  function isArray(value) {
	    return (toString.call(value) === '[object Array]');
	  };


/***/ },
/* 12 */
/***/ function(module, exports) {

	'use strict';

	var toString = Object.prototype.toString;

	module.exports = function isNumber(value) {
	  return (
	    typeof value === 'number' || toString.call(value) === '[object Number]'
	  );
	};


/***/ }
/******/ ])
});
;