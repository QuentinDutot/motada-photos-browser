import React, { Component } from 'react'
import { I18n } from 'react-i18nify'
import ScrollUpLib from 'react-scroll-up'
import PlayCircleOutline from '@material-ui/icons/PlayCircleOutline'
import Tooltip from '@material-ui/core/Tooltip'

class ScrollUp extends Component {
  render() {
    return (
      <ScrollUpLib
        showUnder={160}>
        <Tooltip
          title={I18n.t('tooltips.scroll_to_top')}
          placement="bottom">
          <PlayCircleOutline
            style={{
              color: '#00000099',
              fontSize: 60,
              borderRadius: 50,
              transform: 'rotate(-90deg)',
              boxShadow: '-2px 2px 5px black',
              backgroundColor: 'white',
            }} />
        </Tooltip>
      </ScrollUpLib>
    )
  }
}

export default ScrollUp
