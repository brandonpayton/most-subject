"use strict";
function tryEvent(t, x, sink) {
    try {
        sink.event(t, x);
    }
    catch (e) {
        sink.error(t, e);
    }
}
exports.tryEvent = tryEvent;
function tryEnd(t, x, sink) {
    try {
        sink.end(t, x);
    }
    catch (e) {
        sink.error(t, e);
    }
}
exports.tryEnd = tryEnd;
function pushEvents(buffer, sink) {
    for (var i = 0; i < buffer.length; ++i) {
        var _a = buffer[i], time = _a.time, value = _a.value;
        sink.event(time, value);
    }
}
exports.pushEvents = pushEvents;
function dropAndAppend(event, buffer, bufferSize) {
    if (buffer.length === bufferSize) {
        return append(event, drop(1, buffer));
    }
    return append(event, buffer);
}
exports.dropAndAppend = dropAndAppend;
function append(x, a) {
    var l = a.length;
    var b = new Array(l + 1);
    for (var i = 0; i < l; ++i) {
        b[i] = a[i];
    }
    b[l] = x;
    return b;
}
exports.append = append;
function drop(n, a) {
    if (n < 0) {
        throw new TypeError('n must be >= 0');
    }
    var l = a.length;
    if (n === 0 || l === 0) {
        return a;
    }
    if (n >= l) {
        return [];
    }
    return unsafeDrop(n, a, l - n);
}
// unsafeDrop :: Int -> [a] -> Int -> [a]
// Internal helper for drop
function unsafeDrop(n, a, l) {
    var b = new Array(l);
    for (var i = 0; i < l; ++i) {
        b[i] = a[n + i];
    }
    return b;
}
function remove(i, a) {
    if (i < 0) {
        throw new TypeError('i must be >= 0');
    }
    var l = a.length;
    if (l === 0 || i >= l) {
        return a;
    }
    if (l === 1) {
        return [];
    }
    return unsafeRemove(i, a, l - 1);
}
exports.remove = remove;
// unsafeRemove :: Int -> [a] -> Int -> [a]
// Internal helper to remove element at index
function unsafeRemove(i, a, l) {
    var b = new Array(l);
    var j;
    for (j = 0; j < i; ++j) {
        b[j] = a[j];
    }
    for (j = i; j < l; ++j) {
        b[j] = a[j + 1];
    }
    return b;
}
function findIndex(x, a) {
    for (var i = 0, l = a.length; i < l; ++i) {
        if (x === a[i]) {
            return i;
        }
    }
    return -1;
}
exports.findIndex = findIndex;
//# sourceMappingURL=util.js.map