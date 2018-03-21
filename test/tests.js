'use strict';


const chai = require('chai');
const expect = chai.expect;
const PromisePool = require('../');

describe('PromisePool', () => {

  it('Should successfully resolve all items.', done => {
    const promisePool = new PromisePool(resolveGenerator, 5);
    let count = 0;
    promisePool.on('resolved', res => {
      count++;
    }).on('completed', () => {
      expect(count).to.eql(10);
      done();
    }).start();
  });

  it('Should reject all items.', done => {
    const promisePool = new PromisePool(rejectGenerator, 6);
    let count = 0;
    promisePool.on('rejected', err => {
      count++;
    }).on('completed', () => {
      expect(count).to.eql(10);
      done();
    }).start();
  });

  it('Should reject or resolve all items.', done => {
    const promisePool = new PromisePool(oddEvenGenerator);
    let countRes = 0;
    let countErr = 0;

    promisePool.on('resolved', res => {
      countRes++;
    }).on('rejected', err => {
      countErr++;
    }).on('completed', () => {
      expect(countRes).to.eql(53);
      expect(countErr).to.eql(54);
      done();
    }).start();

  });
}).timeout(0)

// -------------------------------------------------
//    Helpers to create generators of promises.
// -------------------------------------------------


function* resolveGenerator() {
  for(let i = 0; i < 10; i++) {
    yield new Promise(function(resolve, reject) {
      setTimeout(resolve, 100);
    });
  }
}

function* rejectGenerator() {
  for(let i = 0; i < 10; i++) {
    yield new Promise(function(resolve, reject) {
      return reject(i);
    });
  }
}

function* oddEvenGenerator() {
  for(let i = 0; i < 107; i++) {
    yield new Promise(function(resolve, reject) {
      setTimeout(function () {
        if(i % 2 === 0) return reject(i);
        resolve(i);
      }, (Math.random()*100)+1);
    });
  }
}
