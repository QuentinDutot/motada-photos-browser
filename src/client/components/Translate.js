import React from 'react'
import { I18n } from 'react-i18nify'
import translations from '../../assets/translations/translations'
import FlagIcon from 'react-flag-kit/lib/CDNFlagIcon'

const Translate = ({ open = false, close = () => {} }) => {

  const translate = (lang) => {
    close()
    localStorage.setItem('motada_language', lang)
    location.reload()
  }

  const languages = Object.keys(translations).map(key => (
    <button
      type="button"
      key={translations[key].flag}
      onClick={() => translate(translations[key].code)}
      className="flex items-center w-full rounded hover:bg-gray-200 rounded text-gray-500 text-lg py-2 px-4 m-2"
    >
      <FlagIcon code={translations[key].flag} size={32} />
      <span className="ml-3">{translations[key].language}</span>
    </button>
  ))

  return open ? (
    <div class="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="translations-dialog" role="dialog" aria-modal="true">
      <div class="flex items-center justify-center min-h-screen py-4 px-4 text-center sm:block sm:p-0">

        <div
          onClick={close}
          class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          aria-hidden="true"
        />

        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div class="inline-block align-bottom bg-white rounded text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg p-8">
          <h3 class="text-2xl leading-6 font-medium text-gray-900 font-extrabold text-center mt-2 mb-4" id="translations-dialog">
            {I18n.t('tooltips.translations')}
          </h3>
          <div className="flex flex-wrap mt-4">
            <p className="flex-1">
              {languages.map((l, i) => i % 2 == 0 ? l : null)}
            </p>
            <p className="flex-1">
              {languages.map((l, i) => i % 2 != 0 ? l : null)}
            </p>
          </div>
        </div>

      </div>
    </div>
  ) : null
}

export default Translate
