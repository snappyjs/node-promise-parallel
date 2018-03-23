'use strict';

const EventEmitter = require('events');
const assert = require('assert');

const EVENTS = {
	RESOLVED: 'resolved',
	REJECTED: 'rejected',
	COMPLETED: 'completed'
};

/**
 * A utility class to keep a specific amount [poolSize] number of concurrent
 * promises running. This class extends the EventEmitter class and emits:
 *
 * 'resolved' - when a promise have been resolved.
 * 'rejected' - when a promise have been rejected.
 * 'completed' - when all promises have been either reoslved or rejected.
 *
 * The constructor takes an integer [poolSize], a function* [generator].
 *
 * the generator function should yield a new promise to be added to the current
 * batch. (you can see it as a factory)
 *
 * @extends EventEmitter
 */
class PromisePool extends EventEmitter {
	/**
	 * Create a new PromisePool with a set poolSize and a generator for it.
	 * @param {Number} [poolSize=5] The number of concurrent promises to be run at any single time.
	 * @param {function*} generator     A function* that should yield a promise to be added to the batch.
	 */
	constructor(generator, poolSize = 5, waitTime = 0) {
		super();
		assert.equal(typeof generator, 'function', 'A generator must be used.');
		assert.equal(Number.isInteger(poolSize), true, 'poolSize must be of type integer (defaults to 5).');

		this._poolSize = poolSize;
		this._generator = generator();
		this._running = 0;
		this._stopped = false;
		this._waitTime = waitTime;
		this._completed = false;
	}

	/**
	 * PRIVATE
	 * Helper to start the next yielded promise from the generator.
	 */
	_next() {
		if (this._stopped) return;
		let prom = this._generator.next();
		if (!prom.done) {
			this._running++;

			prom.value
				.then(res => {
					this._resolveReject(EVENTS.RESOLVED, res);
				})
				.catch(err => {
					this._resolveReject(EVENTS.REJECTED, err);
				});
		} else if (this._running === 0 && !this._completed) {
			this._completed = true;
			this.emit(EVENTS.COMPLETED);
		}
	}

	/**
	 * PRIVATE
	 * Helper to emit resolve or reject events.
	 * This also reduces the running count and
	 * starts the next Promise from the Pool.
	 * @param  {String} event
	 * @param  {Object} data
	 */
	_resolveReject(event, data) {
		this._running--;
		this.emit(event, data);
		this._wait().then(() => this._next());
	}

	/**
	 * PRIVATE
	 * Helper to wait [_waitTime]ms and then resolve returned Promise.
	 */
	_wait() {
		return new Promise(resolve => {
			setTimeout(resolve, this._waitTime);
		});
	}

	/**
	 * Start running the promises by initializing the pool with the [poolSize]
	 * first promises yielded by the generator.
	 *
	 * Will emit the following events:
	 *  'resolved' - when a promise have been resolved.
	 *  'rejected' - when a promise have been rejected.
	 *  'completed' - when all promises have been either reoslved or rejected.
	 *
	 * @return {this} - EventEmitter
	 */
	start() {
		this._stopped = false;
		for (let i = 0; i < this._poolSize; i++) {
			this._next();
		}
		return this;
	}

	/**
	 * Stop running the Promise-generator.
	 * @return {this}
	 */
	stop() {
		this._stopped = true;
		return this;
	}
}
module.exports = PromisePool;
