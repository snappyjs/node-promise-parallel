'use strict';

const chai = require('chai');
const expect = chai.expect;
const PromiseParallel = require('../');

describe('PromiseParallel', () => {
	it('Should successfully resolve all items.', done => {
		const pp = new PromiseParallel(resolveGenerator, 5);
		let count = 0;
		pp
			.on('resolved', res => {
				count++;
			})
			.on('completed', () => {
				expect(count).to.eql(10);
				done();
			})
			.start();
	});

	it('Should reject all items.', done => {
		const pp = new PromiseParallel(rejectGenerator, 6);
		let count = 0;
		pp
			.on('rejected', err => {
				count++;
			})
			.on('completed', () => {
				expect(count).to.eql(10);
				done();
			})
			.start();
	});

	it('Should reject or resolve all items.', done => {
		const pp = new PromiseParallel(oddEvenGenerator);
		let countRes = 0;
		let countErr = 0;

		pp
			.on('resolved', res => {
				countRes++;
			})
			.on('rejected', err => {
				countErr++;
			})
			.on('completed', () => {
				expect(countRes).to.eql(53);
				expect(countErr).to.eql(54);
				done();
			})
			.start();
	});

	it('Should stop and restart queue.', done => {
		const pp = new PromiseParallel(resolveGenerator, 2);
		let count = 0;

		pp
			.on('resolved', res => {
				count++;
				if (count === 5) {
					pp.stop();
					setTimeout(() => pp.start(), 1000);
				}
			})
			.on('completed', () => {
				expect(count).to.eql(10);
				done();
			})
			.start();
	}).timeout(0);
});

// -------------------------------------------------
//    Helpers to create generators of promises.
// -------------------------------------------------

function* resolveGenerator() {
	for (let i = 0; i < 10; i++) {
		yield new Promise(resolve => {
			setTimeout(() => resolve(i), 100);
		});
	}
}

function* rejectGenerator() {
	for (let i = 0; i < 10; i++) {
		yield new Promise((resolve, reject) => {
			return reject(i);
		});
	}
}

function* oddEvenGenerator() {
	for (let i = 0; i < 107; i++) {
		yield new Promise((resolve, reject) => {
			setTimeout(function() {
				if (i % 2 === 0) return reject(i);
				resolve(i);
			}, Math.random() * 100 + 1);
		});
	}
}
