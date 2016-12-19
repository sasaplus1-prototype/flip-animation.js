'use strict';

var AnimationFrame = require('animation-frame');

var loadImage = require('load-image');

var isArray = require('type-check/is-array'),
    isFunction = require('type-check/is-function'),
    isNumber = require('type-check/is-number');

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
