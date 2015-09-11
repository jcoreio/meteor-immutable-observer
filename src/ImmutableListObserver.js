import Immutable from 'immutable';

import updateDeep from './updateDeep';

export default function ImmutableListObserver(cursor) {
  if (Tracker.active) {
    throw new Error("This can't be used inside reactive computations; it could cause infinite invalidate loops");
  }

  let documents;
  let dep = new Tracker.Dependency();

  function update(newDocuments) {
    documents = newDocuments;
    dep.changed();
  }

  let initialDocuments = [];
  let handle = cursor.observe({
    addedAt: (document, atIndex, before) => {
      if (initialDocuments) {
        initialDocuments.splice(atIndex, 0, Immutable.fromJS(document));
      }
      else {
        update(documents.splice(atIndex, 0, Immutable.fromJS(document)));
      }
    },
    changedAt: (newDocument, oldDocument, atIndex) => {
      update(documents.update(atIndex, document => updateDeep(document, Immutable.fromJS(newDocument))));
    },
    removedAt: (oldDocument, atIndex) => {
      update(documents.splice(atIndex, 1));
    },
    movedTo: (document, fromIndex, toIndex, before) => {
      var movedDocument = documents.get(fromIndex);
      update(documents.splice(fromIndex, 1).splice(toIndex, 0, movedDocument));
    },
  });
  documents = Immutable.List(initialDocuments);
  initialDocuments = undefined;

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