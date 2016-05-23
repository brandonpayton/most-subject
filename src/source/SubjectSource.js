/* @flow */
import defaultScheduler from 'most/lib/scheduler/defaultScheduler'
import {MulticastSource} from '@most/multicast'

export function SubjectSource () {
  // TODO: QUESTION: Why is the default schedule used when one is supplied to `run`?
  this.scheduler = defaultScheduler
  this.sinks = []
  this.active = true
}

// Source methods
SubjectSource.prototype.run = function (sink: Object, scheduler: Object) {
  const n = this.add(sink)
  if (n === 1) { this.scheduler = scheduler }
  return new SubjectDisposable(this, sink)
}

SubjectSource.prototype._dispose = function dispose () {
  this.active = false
}

// Subject methods
SubjectSource.prototype.next = function next (value: any) {
  // TODO: QUESTION: Why not throw here?
  if (!this.active) { return }
  this._next(this.scheduler.now(), value)
}

SubjectSource.prototype.error = function error (err: Error) {
  if (!this.active) { return }

  this.active = false
  this._error(this.scheduler.now(), err)
}

SubjectSource.prototype.complete = function complete (value: any) {
  if (!this.active) { return }

  this.active = false
  this._complete(this.scheduler.now(), value, this.sink)
}

// Multicasting methods
// TODO: QUESTION: Why not extending MulticastSource?
SubjectSource.prototype.add = MulticastSource.prototype.add
SubjectSource.prototype.remove = MulticastSource.prototype.remove
SubjectSource.prototype._next = MulticastSource.prototype.event
SubjectSource.prototype._complete = MulticastSource.prototype.end
SubjectSource.prototype._error = MulticastSource.prototype.error

// SubjectDisposable
function SubjectDisposable (source: Object, sink: Object) {
  this.source = source
  this.sink = sink
  this.disposed = false
}

SubjectDisposable.prototype.dispose = function () {
  if (this.disposed) { return }
  this.disposed = true
  const remaining = this.source.remove(this.sink)
  return remaining === 0 && this.source._dispose()
}
