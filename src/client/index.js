import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import Home from './components/Home';
import reducer from './reducer';
import './index.css';

ReactDOM.render(
  <Provider store={createStore(reducer)}>
    <Home />
  </Provider>,
  document.getElementById('root'),
);
