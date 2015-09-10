import Immutable from 'immutable';

import updateDeep from './updateDeep';

export default function ImmutableCursor(cursor) {
  let documents = Immutable.fromJS(cursor.fetch());
  let dep = new Tracker.Dependency();
  let observers = [];
  let handle;

  function update(newDocuments) {
    let oldDocuments = documents;
    documents = newDocuments;
    dep.changed();
    observers.forEach(observer => observer(newDocuments, oldDocuments));
    stopObservingIfUnncessary();
  }

  function stopObservingIfUnncessary() {
    if (handle && !dep.hasDependents() && !observers.length) {
      handle.stop();
      handle = undefined;
    }
  }

  function observe() {
    update(Immutable.fromJS(cursor.fetch()));
    handle = cursor.observe({
      addedAt: (document, atIndex, before) => {
        update(documents.splice(atIndex, 0, Immutable.fromJS(document)));
      },
      changedAt: (newDocument, oldDocument, atIndex) => {
        update(documents.update(atIndex, 
          oldDocument => updateDeep(oldDocument, Immutable.fromJS(newDocument))));
      },
      removedAt: (oldDocument, atIndex) => {
        update(documents.splice(atIndex, 1));
      },
      movedTo: (document, fromIndex, toIndex, before) => {
        var immDocument = documents.get(fromIndex);
        update(documents.delete(fromIndex).splice(toIndex, 0, immDocument));
      },
    });
  }

  return {
    forEach(...args) {
      if (dep.depend() && !handle) observe();
      return documents.forEach(...args);
    },
    map(...args) {
      if (dep.depend() && !handle) observe();
      return documents.map(...args);
    },
    count() {
      return cursor.count();
    },
    fetch() {
      if (dep.depend() && !handle) observe();
      return documents; 
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