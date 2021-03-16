import { InjectionToken } from '@angular/core';
import { ActionReducerMap, MetaReducer } from 'src/app/lib/ngrx';

// Reducers
import {
initialState as testInitialState,
reducer as testReducer,
State as testState
} from './test/reducer';

export interface State {
    test: testState;
}

export const reducers: ActionReducerMap<State> = {
    test: testReducer,
};

export function getInitialState(): State {
    return {
        test: testInitialState,
    };
}

export const reducersToken = new InjectionToken<ActionReducerMap<State>>(
    'reducers',
);
export const getReducers = () => reducers;
export const reducersProvider = [
  { provide: reducersToken, useFactory: getReducers },
];

