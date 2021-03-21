import React, { Component } from 'react'
import { I18n } from 'react-i18nify'
import ScrollUpLib from 'react-scroll-up'
import Tooltip from '@material-ui/core/Tooltip'

class ScrollUp extends Component {
  render() {
    return (
      <ScrollUpLib showUnder={160}>
        <Tooltip
          title={I18n.t('tooltips.scroll_to_top')}
          placement="bottom"
        >
          <i className="fa fa-chevron-up bg-white shadow rounded-full text-2xl text-gray-800 p-4" aria-hidden="true" />
        </Tooltip>
      </ScrollUpLib>
    )
  }
}

export default ScrollUp
