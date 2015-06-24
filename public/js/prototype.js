Array.prototype.next = function() {
    return this[++this.current];
};
Array.prototype.prev = function() {
    return this[--this.current];
};
Array.prototype.current = 0;