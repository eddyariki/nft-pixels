// boiler plate. always import them
import { createSelector } from 'src/app/lib/ngrx';
import { getState as getParentState } from '../selectors';
import { adapter } from './reducer';

export const getState = createSelector(
    getParentState,
    state => state.test
);

