export default class LinkedMap {
  constructor() {
    this.nodes = {};
    this.size = 0;
  }

  get(key) {
    if (this.nodes.hasOwnProperty(key)) {
      return  this.nodes[key].value;
    }
  }

  set(key, value, beforeKey) {
    let beforeNode;
    if (beforeKey !== undefined) {
      if (this.nodes.hasOwnProperty(beforeKey)) {
        beforeNode = this.nodes[beforeKey];
      }
      else {
        beforeKey = undefined;
      }
    }
    else {
      beforeNode = this.head;
    }
    if (this.nodes.hasOwnProperty(key)) {
      if (beforeKey !== undefined && beforeNode !== undefined) {
        this.remove(key);
      }
      else {
        let {oldValue} = this.nodes[key];
        if (oldValue !== value) {
          this.nodes[key].value = value;
        }
      }
    } 
    else {
      this.size++;
      if (beforeNode) {
        let prev = beforeNode.prev;
        let node = this.nodes[key] = {
          key,
          value,
          prev,
          next: beforeNode,
        };
        prev.next = node;
        beforeNode.prev = node;
        if (beforeNode === this.head && beforeKey !== undefined) {
          this.head = node;
        }
      }
      else {
        this.head = this.nodes[key] = {key, value};
        this.head.prev = this.head.next = this.head;
      }
    }
  }

  remove(key) {
    if (this.nodes.hasOwnProperty(key)) {
      let node = this.nodes[key];
      let {prev, next, value} = node;
      if (node === this.head) {
        if (this.size === 1) {
          prev = next = undefined;
        }
        this.head = next;
      }
      if (prev) prev.next = next;
      if (next) next.prev = prev;
      this.size--;
      return value;
    }
  }

  move(key, beforeKey) {
    if (this.nodes.hasOwnProperty(key) && this.nodes.hasOwnProperty(beforeKey)) {
      insert(key, remove(key), beforeKey);
    }
  }

  forEach(iteratee, context) {
    let node = this.head;
    let count = 0;
    if (node) {
      if (arguments.length > 1) {
        do {
          count++;
          if (iteratee.call(context, node.value, node.key, this) === false) {
            return;
          }
          node = node.next;
        } while (node !== this.head);
      }
      else {
        do {
          count++;
          if (iteratee(node.value, node.key,  this) === false) {
            return;
          }
          node = node.next; 
        } while (node !== this.head);
      }
    }
    return count;
  }
}
