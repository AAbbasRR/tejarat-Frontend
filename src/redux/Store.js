
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { persistReducer } from 'redux-persist';
import {composeWithDevTools} from 'redux-devtools-extension'

import { CookieStorage } from 'redux-persist-cookie-storage';
import Cookies from 'cookies-js';
import rootReducer from './reducers';

const persistConfig = {
    key: '_userData',
    storage: new CookieStorage(Cookies, {
        setCookieOptions: {
            // path: '/mypath',
            // secure: true,
        },
    }),
    whitelist: ['UserReducer', 'CartProductReducer'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const middleware = applyMiddleware(thunk);

const Store = createStore(
    persistedReducer,
    composeWithDevTools(middleware),
);

export default Store;
