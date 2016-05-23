/* @flow */

import {SubjectSource} from './SubjectSource'
import {fatalError} from '../fatalError'

function Task (f: Function, e: Function) {
  this.f = f
  this.e = e
  this.active = true
}
Task.prototype = {
  run () {
    this.active && this.f()
  },
  error (err) {
    this.e(err)
  },
  dispose () {
    this.active = false
  }
}

// flow-ignore-next-line: I want to extend another class
export class AsyncSubjectSource extends SubjectSource {
  next (value: any) {
    this._asap(() => super.next(value), e => this.error(e))
  }

  error (err: Error) {
    this._asap(() => super.error(err), e => this._fatalError(e))
  }

  complete (value: any) {
    this._asap(() => super.complete(), e => this.error(e))
  }

  _asap (f: Function, e: Function) {
    this.scheduler.asap(new Task(f, e))
  }

  // Expose this for unit test
  _fatalError (err: Error) {
    fatalError(err)
  }
}
