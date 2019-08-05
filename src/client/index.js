import React from 'react'
import ReactDOM from 'react-dom'
import ReactGA from 'react-ga'
import { I18n } from 'react-i18nify'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import translations from '../assets/translations/translations'
import Home from './containers/Home'
import reducer from './reducer'
import './index.css'

I18n.setTranslations(translations)
I18n.setLocale(
  (localStorage.getItem('motada_language') || navigator.language || navigator.userLanguage || 'en').substring(0,2)
)

if(window.location.href.indexOf('localhost') === -1) {
  ReactGA.initialize('UA-127688890-1')
  ReactGA.pageview(window.location.pathname + window.location.search)
}

ReactDOM.render(
  <Provider store={createStore(reducer)}>
    <Home />
  </Provider>,
  document.getElementById('root'),
)
