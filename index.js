'use strict';

var AnimationFrame = require('animation-frame'),
    map = require('array-map'),
    loadImage = require('load-image'),
    typeCheck = require('type-check');

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
  if (!typeCheck.isArray(images)) {
    images = [images];
  }

  return Promise.all(
    map(images, function(src) {
      return loadImage(src);
    })
  );
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

  if (!typeCheck.isNumber(options.step) || !isFinite(options.step)) {
    throw new TypeError('step is must be a finite number');
  }

  progress = options.progress;
  complete = options.complete;

  context = {
    af: new AnimationFrame({
      frameRate: options.fps
    }),
    id: null,
    step: Math.floor(options.step),
    count: 1,
    progress: (typeCheck.isFunction(progress)) ? progress : noop,
    complete: (typeCheck.isFunction(complete)) ? complete : noop
  };

  if (typeCheck.isFunction(options.begin)) {
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
  load: load,
  start: start
};
