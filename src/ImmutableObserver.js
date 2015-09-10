import Immutable from 'immutable';

import updateDeep from './updateDeep';

function mergeChanges(document, fields) {
  return document.withMutations(document => {
    for (var key in fields) {
      if (fields.hasOwnProperty(key)) {
        var newValue = fields[key];
        if (newValue === undefined) {
          document.delete(key);
        }
        else {
          document.update(key, oldValue => updateDeep(oldValue, Immutable.fromJS(newValue)));
        }
      }
    }
  });
}

export default function ImmutableObserver(cursor) {
  let documents;
  let dep = new Tracker.Dependency();

  function update(newDocuments) {
    let oldDocuments = documents;
    documents = newDocuments;
    if (oldDocuments !== newDocuments) dep.changed();
  }

  let initialDocuments = {};
  let handle = cursor.observeChanges({
    added: (id, fields) => {
      fields._id = id;
      if (documents) {
        update(documents.set(id, Immutable.fromJS(fields)));
      }
      else {
        initialDocuments[id] = fields;
      }
    },
    changed: (id, fields) => {
      update(documents.update(id, document => mergeChanges(document, fields)));
    },
    removed: (id) => {
      update(documents.delete(id));
    },
  });
  documents = Immutable.OrderedMap(initialDocuments);
  initialDocuments = undefined;

  if (Tracker.active) {
    Tracker.onInvalidate(() => {
      handle.stop();
    });
  }

  return {
    documents() {
      dep.depend();
      return documents; 
    },
    stop() {
      handle.stop();
    }
  };
}