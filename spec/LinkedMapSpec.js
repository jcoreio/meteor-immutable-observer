var LinkedMap = require('../lib/LinkedMap.js');

function sanityCheck(map) {
  var size = 0;
  var node = map.head;
  do {
    expect(map.nodes[node.key]).toBe(node);
    var next = node.next;
    expect(next).toBeDefined();
    expect(next.prev).toBe(node);
    node = next;
    size++;
  } while (node !== map.head);
  expect(size).toBe(map.size);
}

describe("LinkedMap", function() {
  it("begins empty", function() {
    var map = new LinkedMap();
    expect(map.size).toBe(0);
    expect(map.head).toBeUndefined();
  });

  describe("set", function() {
    it("sets first element correctly", function() {
      var map = new LinkedMap();
      map.set(0, 'test');
      sanityCheck(map);
      expect(map.size).toBe(1);
      expect(map.head.key).toBe(0);
      expect(map.head.value).toBe('test');
    });
    it("sets second element correctly", function() {
      var map = new LinkedMap();
      map.set(0, 'test');
      map.set(1, 'test2');
      sanityCheck(map);
      expect(map.size).toBe(2);
      expect(map.head.key).toBe(0);
      expect(map.head.value).toBe('test');
      expect(map.head.next.key).toBe(1);
      expect(map.head.next.value).toBe('test2');
    });
    it("inserts before first element correctly", function() {
      var map = new LinkedMap();
      map.set(0, 'test');
      map.set(1, 'test2', 0);
      sanityCheck(map);
      expect(map.size).toBe(2);
      expect(map.head.key).toBe(1);
      expect(map.head.value).toBe('test2');
      expect(map.head.next.key).toBe(0);
      expect(map.head.next.value).toBe('test');    
    });
    it("inserts before last element correctly", function() {
      var map = new LinkedMap();
      map.set(0, 'test');
      map.set(1, 'test2');
      map.set(2, 'test3', 1);
      sanityCheck(map);
      expect(map.size).toBe(3);
      expect(map.head.key).toBe(0);
      expect(map.head.value).toBe('test');
      expect(map.head.next.key).toBe(2);
      expect(map.head.next.value).toBe('test3');    
      expect(map.head.next.next.key).toBe(1);
      expect(map.head.next.next.value).toBe('test2');    
    });
  });
  describe("remove", function() {
    it("removes first element correctly", function() {
      var map = new LinkedMap();
      map.set(0, 'test');
      map.set(1, 'test2');
      map.remove(0);
      sanityCheck(map);
      expect(map.size).toBe(1);
      expect(map.head.key).toBe(1);
      expect(map.head.value).toBe('test2');
    });
    it("removes last element correctly", function() {
      var map = new LinkedMap();
      map.set(0, 'test');
      map.set(1, 'test2');
      map.remove(1);
      sanityCheck(map);
      expect(map.size).toBe(1);
      expect(map.head.key).toBe(0);
      expect(map.head.value).toBe('test');
    });
  });
  describe("forEach", function() {
    it("doesn't callback for empty map", function() {
      var map = new LinkedMap();
      var count = 0;
      map.forEach(function() { count++; });
      expect(count).toBe(0);
    });
    it("calls back once for one-element map", function() {
      var map = new LinkedMap();
      map.set(0, 'test');
      var foo = {
        callback: function(value, key, map) {
        }
      };
      spyOn(foo, 'callback');
      map.forEach(foo.callback, foo);
      expect(foo.callback).toHaveBeenCalledWith('test', 0, map);
    });
    it("calls back 3 times for three-element map", function() {
      var map = new LinkedMap();
      map.set(0, 'test');
      map.set(1, 'test2');
      map.set(2, 'test3', 1);
      var foo = {
        callback: function(value, key, map) {
        }
      };
      spyOn(foo, 'callback');
      map.forEach(foo.callback, foo);
      expect(foo.callback.calls.allArgs()).toEqual([['test', 0, map], ['test3', 2, map], ['test2', 1, map]]);
    });
  });
});