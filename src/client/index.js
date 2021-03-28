import React from 'react'
import ReactDOM from 'react-dom'
import ReactGA from 'react-ga'
import { setTranslations, setLocale } from 'react-i18nify'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import translations from '../assets/translations/translations'
import Home from './containers/Home'
import reducer from './reducer'

// bundle needed styles (tree shaked with webpack)
import '../assets/styles/font-awesome.css'
import '../assets/styles/tailwind.css'
import '../assets/styles/global.css'

// bundle needed polyfills
import './polyfills/promise' 
import './polyfills/find'

// add supported locales
setTranslations(translations)

// extract and validate user language
const detectedLanguage = (localStorage.getItem('motada_language') || navigator.language || navigator.userLanguage || 'en').substring(0,2)
const validatedLanguage = translations[detectedLanguage] ? detectedLanguage : 'en'
setLocale(validatedLanguage)

// init google analytics tracking
if(window.location.href.indexOf('localhost') === -1) {
  ReactGA.initialize('UA-127688890-1')
  ReactGA.pageview(window.location.pathname + window.location.search)
}

// render react application
ReactDOM.render(
  <Provider store={createStore(reducer)}>
    <Home />
  </Provider>,
  document.getElementById('root'),
)
