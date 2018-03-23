'use strict';

const PromiseParallel = require('../');

/**
 * The Promise "factory" that produces the Promises that we want
 * to execute in parallel.
 * @return {Generator} yield Promise
 */
function* promiseGenerator() {
	for (let i = 0; i < 10; i++) {
		yield new Promise(resolve => {
			setTimeout(() => resolve(i), Math.random() * 1000 + 1);
		});
	}
}

/**
 * Create a new PromiseParallel queue
 * Running 3 parallel requests at a time
 * with a waitTime before starting a new one of 1000ms
 */
const pp = new PromiseParallel(promiseGenerator, 3, 1000);

/**
 * Subscribe to the events fired off in the parallel queue.
 */
pp
	.on('resolved', res => {
		// Handle resolved Promise
		console.log(`Got a successful response: ${res}`);
		if (res === 5) {
			console.log('Stopping for 5 seconds.');
			pp.stop();
			setTimeout(() => pp.start(), 5000);
		}
	})
	.on('rejected', err => {
		// Handle rejected Promise
		console.log(err);
	})
	.on('completed', () => {
		// Handle when completed.
		console.log('All promises done.');
	})
	.start();
