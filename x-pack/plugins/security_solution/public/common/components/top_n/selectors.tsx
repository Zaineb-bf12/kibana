/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { State } from '../../store';
import { sourcererSelectors } from '../../store/selectors';
import { SourcererScopeName } from '../../store/sourcerer/model';

export interface IndicesSelector {
  all: string[];
  raw: string[];
}

export const getIndicesSelector = () => {
  const getSignalIndexNameSelector = sourcererSelectors.signalIndexNameSelector();
  const getScopeSelector = sourcererSelectors.scopeIdSelector();

  return (state: State, scopeId: SourcererScopeName): IndicesSelector => {
    const raw: string[] = [];
    const signalIndexName = getSignalIndexNameSelector(state);
    const { selectedPatterns } = getScopeSelector(state, scopeId);
    selectedPatterns.forEach((index) => {
      // indexOf instead of === because the dataView version of signals index
      // will have a wildcard and the signalIndexName does not include the wildcard
      if (index.indexOf(`${signalIndexName}`) === -1) {
        raw.push(index);
      }
    });

    return {
      all: signalIndexName != null ? [...raw, signalIndexName] : [...raw],
      raw,
    };
  };
};
