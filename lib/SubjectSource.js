"use strict";
var SubjectDisposable_1 = require('./SubjectDisposable');
var util_1 = require('./util');
var defaultScheduler = require('most/lib/scheduler/defaultScheduler');
var BasicSubjectSource = (function () {
    function BasicSubjectSource() {
        this.scheduler = defaultScheduler;
        this.sinks = [];
        this.active = false;
    }
    BasicSubjectSource.prototype.run = function (sink, scheduler) {
        var n = this.add(sink);
        if (n === 1) {
            this.scheduler = scheduler;
            this.active = true;
        }
        return new SubjectDisposable_1.SubjectDisposable(this, sink);
    };
    BasicSubjectSource.prototype.add = function (sink) {
        this.sinks = util_1.append(sink, this.sinks);
        return this.sinks.length;
    };
    BasicSubjectSource.prototype.remove = function (sink) {
        var i = util_1.findIndex(sink, this.sinks);
        if (i >= 0) {
            this.sinks = util_1.remove(i, this.sinks);
        }
        return this.sinks.length;
    };
    BasicSubjectSource.prototype._dispose = function () {
        this.active = false;
    };
    BasicSubjectSource.prototype.next = function (value) {
        if (!this.active || this.scheduler === void 0)
            return;
        this._next(this.scheduler.now(), value);
    };
    BasicSubjectSource.prototype.error = function (err) {
        if (!this.active || this.scheduler === void 0)
            return;
        this._dispose();
        this._error(this.scheduler.now(), err);
    };
    BasicSubjectSource.prototype.complete = function (value) {
        if (!this.active || this.scheduler === void 0)
            return;
        this._dispose();
        this._complete(this.scheduler.now(), value);
    };
    BasicSubjectSource.prototype._next = function (time, value) {
        var s = this.sinks;
        if (s.length === 1) {
            return s[0].event(time, value);
        }
        for (var i = 0; i < s.length; ++i) {
            util_1.tryEvent(time, value, s[i]);
        }
    };
    BasicSubjectSource.prototype._complete = function (time, value) {
        var s = this.sinks;
        for (var i = 0; i < s.length; ++i) {
            util_1.tryEnd(time, value, s[i]);
        }
    };
    BasicSubjectSource.prototype._error = function (time, err) {
        var s = this.sinks;
        for (var i = 0; i < s.length; ++i) {
            s[i].error(time, err);
        }
    };
    return BasicSubjectSource;
}());
exports.BasicSubjectSource = BasicSubjectSource;
//# sourceMappingURL=SubjectSource.js.map