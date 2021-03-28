import React from 'react'
import { I18n } from 'react-i18nify'
import ScrollUpLib from 'react-scroll-up'

const ScrollUp = () => (
  <ScrollUpLib showUnder={160}>
    <i
      className="fa fa-chevron-up bg-white hover:bg-gray-200 shadow rounded-full text-2xl text-gray-800 py-4 px-5"
      aria-valuetext={I18n.t('tooltips.scroll_to_top')}
      aria-hidden="false"
    />
  </ScrollUpLib>
)

export default ScrollUp
