import Immutable from 'seamless-immutable';

export default function updateDeep(a, b) {
  if ((a instanceof Object || a instanceof Array) &&
      Object.getPrototypeOf(a) === Object.getPrototypeOf(b)) {
    for (var key in a) {
      if (!b.hasOwnProperty(key)) {
        var updated = a instanceof Object ? {} : [];
        for (var key in b) {
          var updatedValue = updateDeep(a[key], b[key]);
          if (updatedValue !== a[key]) {
            updated[key] = updatedValue;
          }
        }      
        return Immutable(updated);
      }
    }

    var updated;
    for (var key in b) {
      var updatedValue = updateDeep(a[key], b[key]);
      if (updatedValue !== a[key]) {
        if (!updated) updated = a.asMutable();
        updated[key] = updatedValue;
      }
    }

    return updated ? Immutable(updated) : a;
  }
  return Immutable(b);
}
