"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var SubjectSource_1 = require('./SubjectSource');
var util_1 = require('./util');
var HoldSubjectSource = (function (_super) {
    __extends(HoldSubjectSource, _super);
    function HoldSubjectSource(bufferSize) {
        _super.call(this);
        this.buffer = [];
        this.bufferSize = bufferSize;
    }
    HoldSubjectSource.prototype.add = function (sink) {
        var buffer = this.buffer;
        if (buffer.length > 0) {
            util_1.pushEvents(buffer, sink);
        }
        return _super.prototype.add.call(this, sink);
    };
    HoldSubjectSource.prototype.next = function (value) {
        if (!this.active || this.scheduler === void 0) {
            return;
        }
        var time = this.scheduler.now();
        this.buffer = util_1.dropAndAppend({ time: time, value: value }, this.buffer, this.bufferSize);
        this._next(time, value);
    };
    return HoldSubjectSource;
}(SubjectSource_1.BasicSubjectSource));
exports.HoldSubjectSource = HoldSubjectSource;
//# sourceMappingURL=HoldSubjectSource.js.map