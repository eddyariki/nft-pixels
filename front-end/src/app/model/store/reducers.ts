import { InjectionToken } from '@angular/core';
import { ActionReducerMap, MetaReducer } from 'src/app/lib/ngrx';

// Reducers
import {
initialState as testInitialState,
reducer as testReducer,
State as testState
} from './test/reducer';
import {
initialState as userInitialState,
reducer as userReducer,
State as userState
} from './user/reducer';


export interface State {
    test: testState;
    user: userState;
}

export const reducers: ActionReducerMap<State> = {
    test: testReducer,
    user: userReducer,
};

export function getInitialState(): State {
    return {
        test: testInitialState,
        user: userInitialState,
    };
}

export const reducersToken = new InjectionToken<ActionReducerMap<State>>(
    'reducers',
);
export const getReducers = () => reducers;
export const reducersProvider = [
  { provide: reducersToken, useFactory: getReducers },
];

