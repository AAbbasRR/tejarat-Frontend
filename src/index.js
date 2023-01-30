import React from 'react';

import './index.css';

import reportWebVitals from './app/reportWebVitals';
import App from './app/App';

import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import { SnackbarProvider } from 'notistack';

import axios from 'axios';
import { Provider } from 'react-redux';
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';

import Store from './redux/Store';

axios.defaults.baseURL = "http://127.0.0.1:8000/";
const persistor = persistStore(Store);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={Store}>
    <PersistGate loading={null} persistor={persistor}>
      <BrowserRouter>
        <SnackbarProvider maxSnack={3} autoHideDuration={4000} anchorOrigin={{ horizontal: "center", vertical: "top" }}>
          <App />
        </SnackbarProvider>
      </BrowserRouter>
    </PersistGate>
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
