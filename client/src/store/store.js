import { createStore, applyMiddleware } from 'redux';
// import { configureStore } from '@reduxjs/toolkit';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import rootReducer from '../reducers';

const initialState = {};

const middleware = [thunk];

const store = createStore(rootReducer, initialState, composeWithDevTools(applyMiddleware(...middleware)));
// const storeNew = configureStore({ reducer: rootReducer, preloadedState: initialState, middleware: [...middleware] });


export default store;