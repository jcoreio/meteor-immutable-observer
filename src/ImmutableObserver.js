import Immutable from 'immutable';

import LinkedMap from './LinkedMap';
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
  let documents = new LinkedMap();
  let documentSeq;
  let documentMap;
  let documentList; 
  let dep = new Tracker.Dependency();

  function update(newDocuments) {
    documentSeq = documentMap = documentList = undefined;
    dep.changed();
  }

  let initialized = false;
  let handle = cursor.observeChanges({
    addedBefore: (id, fields, before) => {
      fields._id = id;
      documents.set(id, Immutable.fromJS(fields), before);
      if (initialized) update();
    },
    changed: (id, fields) => {
      documents.set(id, mergeChanges(documents.get(id), fields));
      update();
    },
    movedBefore: (id, before) => {
      documents.move(id, before);
      update();
    },
    removed: (id) => {
      documents.remove(id);
      update();
    },
  });
  initialized = true;

  if (Tracker.active) {
    Tracker.onInvalidate(() => {
      handle.stop();
    });
  }

  function forEach(iteratee, context) {
    dep.depend();
    function safeIteratee(value, key) {
      return iteratee(value, key);
    }
    if (arguments.length > 1) {
      return documents.forEach(safeIteratee, context);
    }
    else {
      return documents.forEach(safeIteratee);
    }
  }
  function getDocumentSeq() {
    dep.depend();
    if (!documentSeq) {
      let items = {};
      documents.forEach((value, key) => items[key] = value);
      documentSeq = Immutable.Seq(items);
    }
    return documentSeq;
  }
  function getDocumentMap() {
    dep.depend();
    if (!documentMap) documentMap = getDocumentSeq().toOrderedMap();
    return documentMap;
  }
  function getDocumentList() {
    dep.depend();
    if (!documentList) documentList = getDocumentSeq().toList();
    return documentList;
  }
  function count() {
    return documents.size;
  }

  return {
    forEach,
    count,
    documentSeq: getDocumentSeq,
    documentMap: getDocumentMap,
    documentList: getDocumentList,
    stop() {
      handle.stop();
    }
  };
}