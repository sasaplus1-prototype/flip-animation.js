# flip-animation.js

for flip animation

## Installation

```sh
$ npm install sasaplus1-prototype/flip-animation.js
```

## Usage

via `require()`

```js
var flipAnimation = require('flip-animation');
```

via `<script>`

```html
<script src="flip-animation.min.js"></script>
```

### Example

```js
flipAnimation
  .load(['image1.png', 'image2.png', 'image3.png')
  .then(function(images) {
    flipAnimation.start({
      step: 3,
      fps: 1,
      begin: function() {
        console.log('begin animation');
      },
      progress: function(params) {
        image.src = images[params.count - 1];
      },
      complete: function() {
        console.log('complete.');
      }
    });
  })
  ['catch'](function(err) {
    console.error(err);
  });
```

## Functions

### load(images)

- `images`
  - `String|String[]`
- `return`
  - `Promise`

load images.

### start(options)

- `options`
  - `Object`
- `options.step`
  - `Number`
- `[options.fps]`
  - `Number`
- `[options.begin]`
  - `Function`
- `[options.progress]`
  - `Function`
- `[options.complete]`
  - `Function`

start animation.

## License

The MIT license.
