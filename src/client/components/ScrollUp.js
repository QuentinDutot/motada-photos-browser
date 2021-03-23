import React from 'react'
import { I18n } from 'react-i18nify'
import ScrollUpLib from 'react-scroll-up'
import Tooltip from '@material-ui/core/Tooltip'

const ScrollUp = () => (
  <ScrollUpLib showUnder={160}>
    <Tooltip
      title={I18n.t('tooltips.scroll_to_top')}
      placement="bottom"
    >
      <i className="fa fa-chevron-up bg-white shadow rounded-full text-2xl text-gray-800 py-4 px-5" aria-hidden="true" />
    </Tooltip>
  </ScrollUpLib>
)

export default ScrollUp
