import Immutable from 'seamless-immutable';

import updateDeep from './updateDeep';

export default function ImmutableCursor(cursor) {
  let immutable = Immutable(cursor.fetch());
  let dep = new Tracker.Dependency();
  let observers = [];
  let handle;

  function update(newImmutable) {
    let oldImmutable = immutable;
    immutable = newImmutable;
    dep.changed();
    observers.forEach(observer => observer(newImmutable, oldImmutable));
    stopObservingIfUnncessary();
  }

  function stopObservingIfUnncessary() {
    if (handle && !dep.hasDependents() && !observers.length) {
      handle.stop();
      handle = undefined;
    }
  }

  function observe() {
    update(Immutable(cursor.fetch()));
    handle = cursor.observe({
      addedAt: (document, atIndex, before) => {
        if (atIndex === immutable.length) {
          update(immutable.concat(Immutable(document)));
        }
        else {
          let array = immutable.asMutable();
          array.splice(atIndex, 0, Immutable(document));
          update(Immutable(array));
        }
      },
      changedAt: (newDocument, oldDocument, atIndex) => {
        let array = immutable.asMutable();
        array[atIndex] = updateDeep(array[atIndex], newDocument);
        update(Immutable(array));
      },
      removedAt: (oldDocument, atIndex) => {
        let array = immutable.asMutable();
        array.splice(atIndex, 1);
        update(Immutable(array));
      },
      movedTo: (document, fromIndex, toIndex, before) => {
        let array = immutable.asMutable();
        let elem = array[fromIndex];

        array.splice(fromIndex, 1);
        array.splice(toIndex, 0, elem);
        update(Immutable(array));
      },
    });
  }

  return {
    forEach(...args) {
      if (dep.depend() && !handle) observe();
      return immutable.forEach(...args);
    },
    map(...args) {
      if (dep.depend() && !handle) observe();
      return immutable.map(...args);
    },
    count() {
      return cursor.count();
    },
    fetch() {
      if (dep.depend() && !handle) observe();
      return immutable; 
    },
    observe(callback) {
      if (!handle) observe();
      observers.push(callback);
      return {
        stop() {
          let index = observers.indexOf(callback);
          if (index >= 0) {
            observers.splice(index, 1);
            stopObservingIfUnncessary();
          }
        },
      };
    },
  };
}