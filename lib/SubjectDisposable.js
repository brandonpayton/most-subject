"use strict";
var SubjectDisposable = (function () {
    function SubjectDisposable(source, sink) {
        this.source = source;
        this.sink = sink;
        this.disposed = false;
    }
    SubjectDisposable.prototype.dispose = function () {
        if (this.disposed)
            return;
        this.disposed = true;
        var remaining = this.source.remove(this.sink);
        return remaining === 0 && this.source._dispose();
    };
    return SubjectDisposable;
}());
exports.SubjectDisposable = SubjectDisposable;
//# sourceMappingURL=SubjectDisposable.js.map