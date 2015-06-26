Array.prototype.next = function() {
  return this[++this.current];
};
Array.prototype.prev = function() {
  if (!this[this.current - 1]) {
    return this[0];
  }
  return this[--this.current];
};
Array.prototype.current = 0;