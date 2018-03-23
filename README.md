# node-promise-parallel

> Utility to run a batch of Promises in parallel.

[![Build Status](https://travis-ci.org/snappyjs/node-promise-parallel.svg?branch=master)](https://travis-ci.org/snappyjs/node-promise-parallel)
[![license](https://img.shields.io/github/license/snappyjs/node-promise-parallel.svg)](https://www.github.com/snappyjs/node-request-queue)
[![GitHub issues](https://img.shields.io/github/issues/snappyjs/node-promise-parallel.svg)](https://github.com/snappyjs/node-request-queue/issues)

## Installation

OS X, Windows & Linux

```sh
npm install node-promise-parallel --save
```

## Usage example

Use a `function*` (generator) to queue up promises to be executed in serial. The `function*` works as a factory `yield`ing the Promises to be executed in parallel.

```sh
const PromiseParallel = require('node-promise-parallel');

// Example generator function to create Promises to be executed by the queue.
// The generator have to yeild a Promise.
function* promiseGenerator() {
  for(let i = 0; i < 10; i++) {
    yield new Promise(resolve => {
      setTimeout(resolve, (Math.random()*100)+1);
    });
  }
}

// Create a PromiseParallel, executing 3 Promises in parallel with a waitTime of 1000ms before staring the next one.
const pq = new PromiseParallel(promiseGenerator, 3, 1000);

// Listen on the events emitted from the PromiseParallel.
//  'resolved' - successfully resolved Promise.
//  'rejected' - the Promise was rejected.
//  'completed' - the generator is completed (no new Promises to consume)

pq.on('resolved', res => {
  console.log(`Result that was resolved: ${res}`)
}).on('rejected', err => {
  console.log(`Error occured: ${err}`);
}).on('completed', () => {
  console.log('Generator is completed.');
});

pq.start(); // Start the execution
```

_For a complete tutorial on how this was created have a look at my blog:_ https://www.snappyjs.com/2018/03/23/js-how-to-use-generators-and-iterators

## Development setup

No dependencies needed, just start testing your code see below

```sh
npm install node-promise-parallel --save
npm test
npm sample
```

## Release History

* 1.0.0
  * RELEASE: Initial release.

## Meta

Tommy Dronkers -
E-mail: tommy@snappyjs.com
Homepage: https://www.snappyjs.com

Distributed under the MIT license. See `LICENSE` for more information.

[https://github.com/snappyjs/node-promise-serial](https://github.com/snappyjs/node-promise-parallel)

## Contributing

1.  Fork it (<https://github.com/snappyjs/node-promise-parallel/fork>)
2.  Create your feature branch (`git checkout -b feature/fooBar`)
3.  Commit your changes (`git commit -am 'Add some fooBar'`)
4.  Push to the branch (`git push origin feature/fooBar`)
5.  Create a new Pull Request
