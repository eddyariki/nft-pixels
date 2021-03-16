import { reducerWithInitialState } from 'typescript-fsa-reducers';
import { actions, Payload } from './payload.actions';

export interface State {
    userAddress: string | null;
    isLoggedIn: boolean;
    key: string | null;
}

export const initialState: State =  {
    userAddress: null,
    isLoggedIn: false,
    key: null,
};

const payloadHandler = (state: State, payload: Payload): State => {
    return {
    ...state,
    ...payload
  };
};

export const reducer = reducerWithInitialState(initialState)
    .case(actions.payload, payloadHandler)
    .build();

