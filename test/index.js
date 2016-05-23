/* eslint max-nested-callbacks: 0 */
/* global describe, it */
import assert from 'power-assert'
import sinon from 'sinon'
import {Stream} from 'most'
import {subject, asyncSubject, holdSubject} from '../src'

describe('subject()', () => {
  describe('stream', () => {
    it('should be an extension of Stream', () => {
      const s = subject()
      assert.strictEqual(s instanceof Stream, true)
    })

    it('should inherit Stream combinators', done => {
      const stream = subject()

      stream
        .map(x => x * x)
        .forEach(x => {
          assert.strictEqual(x, 25)
        }).then(done)

      stream.next(5)
      stream.complete()
    })
  })

  describe('observer', () => {
    it('should have next for sending new values', () => {
      const stream = subject()
      assert.strictEqual(typeof stream.next, 'function')
    })

    it('should allow nexting events', done => {
      const stream = subject()

      assert.strictEqual(typeof stream.next, 'function')

      stream.forEach(x => {
        assert.strictEqual(x, 1)
      }).then(done)

      stream.next(1)
      stream.complete()
    })

    it('should allow sending errors', done => {
      const stream = subject()

      assert.strictEqual(typeof stream.error, 'function')
      stream
        .drain()
        .then(assert.fail)
        .catch(err => {
          assert.strictEqual(err.message, 'Error Message')
          done()
        })

      stream.next(1)
      stream.next(2)
      stream.error(new Error('Error Message'))
    })

    it('should have complete for ending stream', () => {
      const stream = subject()
      assert.strictEqual(typeof stream.complete, 'function')
    })

    it('should allow ending of stream', done => {
      const stream = subject()

      stream
        .forEach(assert.fail)
        .then(done)
        .catch(assert.fail)

      stream.complete()
    })

    it('should not allow events after end', done => {
      const stream = subject()

      stream
        .forEach(assert.fail)
        .then(done)
        .catch(assert.fail)

      stream.complete()
      stream.next(1)
    })
  })
})

describe('holdSubject', () => {
  it('should throw if given a bufferSize less than 0', () => {
    assert.throws(() => {
      holdSubject(-1)
    })
  })

  it('should replay the last value', done => {
    const stream = holdSubject()
    stream.next(1)
    stream.next(2)

    stream.forEach(x => {
      assert.strictEqual(x, 2)
    }).then(done)

    setTimeout(() => stream.complete(), 10)
  })

  it('should allow for adjusting bufferSize of stream', done => {
    const stream = holdSubject(3)

    stream.next(1)
    stream.next(2)
    stream.next(3)
    stream.next(4)

    stream
      .reduce((x, y) => x.concat(y), [])
      .then(x => {
        assert.deepEqual(x, [2, 3, 4])
        done()
      })

    stream.complete()
  })
})

describe('asyncSubject', () => {
  it('should emit events asynchronously', done => {
    const stream = asyncSubject()

    // Use an array so we can verify number of events
    const actualEvents = []
    stream.observe(event => actualEvents.push(event))

    const expectedEvent = 123
    stream.next(expectedEvent)

    assert.strictEqual(actualEvents.length, 0, 'event not emitted synchronously')

    setTimeout(() => {
      try {
        assert.deepEqual(actualEvents, [ expectedEvent ], 'event emitted asynchronously')
        done()
      } catch (err) {
        done(err)
      } finally {
        stream.complete()
      }
    }, 10)
  })

  it('should emit errors asynchronously', done => {
    const stream = asyncSubject()

    // Use arrays so we can verify number of emissions
    const actualEvents = []
    const actualErrors = []
    stream.observe(event => actualEvents.push(event)).then(
      () => { throw new Error('unexpected completion') },
      err => actualErrors.push(err)
    )

    const expectedError = new Error('expected')
    stream.error(expectedError)

    assert.strictEqual(actualErrors.length, 0, 'error not emitted synchronously')

    setTimeout(() => {
      try {
        assert.deepEqual(actualErrors, [ expectedError ], 'error emitted asynchronously')
        // Be sure that emitting an error does not emit an event
        assert.strictEqual(actualEvents.length, 0, 'no event emitted')
        done()
      } catch (err) {
        done(err)
      }
    }, 10)
  })

  it('should complete asynchronously', done => {
    const stream = asyncSubject()

    // Use arrays so we can verify number of emissions
    const actualEvents = []
    const actualErrors = []
    const completionSpy = sinon.spy()
    stream.observe(event => actualEvents.push(event)).then(
      completionSpy,
      err => actualErrors.push(err)
    )

    stream.complete()

    setTimeout(() => {
      try {
        assert.strictEqual(actualEvents.length, 0, 'no events were emitted')
        assert.strictEqual(actualErrors.length, 0, 'no errors were emitted')
        assert(completionSpy.called, 'stream completed')
        assert(completionSpy.calledOnce, 'completed just once')
        done()
      } catch (err) {
        done(err)
      }
    }, 10)
  })

  it('should emit an error if there is an error emitting an event', () => {
    const stream = asyncSubject()
    const {source} = stream

    const asapSpy = source._asap = sinon.spy()
    const errorSpy = source.error = sinon.spy()

    stream.next(123)

    assert(asapSpy.calledOnce)
    const [, nextErrorHandler] = asapSpy.args[0]

    assert(!errorSpy.called)
    const expectedError = new Error('expected')
    nextErrorHandler(expectedError)
    assert(errorSpy.called)
    assert(errorSpy.calledWith(expectedError), 'next() error handler emits error')
  })

  it('should be a fatal error to encounter an error while attempting to emit an error', () => {
    const stream = asyncSubject()
    const {source} = stream

    const asapSpy = source._asap = sinon.spy()
    const fatalErrorSpy = source._fatalError = sinon.spy()

    stream.error(new Error())

    assert(asapSpy.calledOnce)
    const [, errorErrorHandler] = asapSpy.args[0]

    assert(!fatalErrorSpy.called, 'fatal error handler not called yet')
    const fatalError = new Error('fatal error')
    errorErrorHandler(fatalError)
    assert(fatalErrorSpy.called, 'fatal error handler called')
    assert(fatalErrorSpy.calledWith(fatalError), 'error while emitting error is treated as fatal')
  })

  it('should emit an error if there is an error completing the stream', () => {
    const stream = asyncSubject()
    const {source} = stream

    const asapSpy = source._asap = sinon.spy()
    const errorSpy = source.error = sinon.spy()

    stream.complete()

    assert(asapSpy.calledOnce)
    const [, completeErrorHandler] = asapSpy.args[0]

    assert(!errorSpy.called)
    const expectedError = new Error('expected')
    completeErrorHandler(expectedError)
    assert(errorSpy.called)
    assert(errorSpy.calledWith(expectedError), 'complete() error handler emits error')
  })
})
