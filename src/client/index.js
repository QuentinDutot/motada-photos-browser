import React from 'react';
import ReactDOM from 'react-dom';
import { I18n } from 'react-i18nify';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import translations from '../assets/translations/translations';
import Home from './components/Home';
import reducer from './reducer';
import './index.css';

I18n.setTranslations(translations);
I18n.setLocale(
  (localStorage.getItem('motada_language') || navigator.language || navigator.userLanguage || 'en').substring(0,2)
);

ReactDOM.render(
  <Provider store={createStore(reducer)}>
    <Home />
  </Provider>,
  document.getElementById('root'),
);
