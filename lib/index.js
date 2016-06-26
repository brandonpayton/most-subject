"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var most_1 = require('most');
var SubjectSource_1 = require('./SubjectSource');
var HoldSubjectSource_1 = require('./HoldSubjectSource');
function subject() {
    return new Subject(new SubjectSource_1.BasicSubjectSource());
}
exports.subject = subject;
function holdSubject(bufferSize) {
    if (bufferSize === void 0) { bufferSize = 1; }
    if (bufferSize <= 0) {
        throw new Error('bufferSize must be an integer 1 or greater');
    }
    return new Subject(new HoldSubjectSource_1.HoldSubjectSource(bufferSize));
}
exports.holdSubject = holdSubject;
var Subject = (function (_super) {
    __extends(Subject, _super);
    function Subject(source) {
        _super.call(this, source);
    }
    Subject.prototype.next = function (value) {
        this.source.next(value);
    };
    Subject.prototype.error = function (err) {
        this.source.error(err);
    };
    Subject.prototype.complete = function (value) {
        this.source.complete(value);
    };
    return Subject;
}(most_1.Stream));
exports.Subject = Subject;
//# sourceMappingURL=index.js.map