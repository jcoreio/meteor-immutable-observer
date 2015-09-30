import Immutable from 'immutable';

import updateDeep from './updateDeep';

export default function mergeChanges(document, fields) {
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
