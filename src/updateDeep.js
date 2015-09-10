import Immutable from 'immutable';

export default function updateDeep(a, b) {
  if (!(a instanceof Immutable.Collection) ||
      !(b instanceof Immutable.Collection) ||
      Object.getPrototypeOf(a) !== Object.getPrototypeOf(b)) {
    return a === b ? a : b;
  }
  return a.withMutations(result => {
    a.forEach((oldValue, key) => {
      if (!b.has(key)) {
        result.delete(key);
      }
    });
    b.forEach((newValue, key) => {
      if (!a.has(key)) {
        result.set(key, newValue);
      }
      else {
        result.set(key, updateDeep(a.get(key), newValue));
      }
    });
  });
}
