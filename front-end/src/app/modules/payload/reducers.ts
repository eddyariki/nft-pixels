import { InjectionToken } from '@angular/core';
import {
  Action,
  ActionReducer,
  ActionReducerMap,
  MetaReducer,
} from '@ngrx/store';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
    initialState as payloadInitalState,
    reducer as payloadReducer,
    State as payloadState,
} from './payload.reducer';

export interface State {
    payload: payloadState;
}

export const reducers: ActionReducerMap<State> = {
    payload: payloadReducer,
};

export function getInitialState(): State {
    return {
        payload: payloadInitalState
    };
}

export const reducersToken = new InjectionToken<ActionReducerMap<State>>(
    'reducers',
);
export const getReducers = () => reducers;
export const reducersProvider = [
  { provide: reducersToken, useFactory: getReducers },
];
