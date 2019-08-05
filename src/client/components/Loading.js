import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { I18n } from 'react-i18nify'
import { connect } from 'react-redux'
import LinearProgress from '@material-ui/core/LinearProgress'

class Loading extends Component {
  static propTypes = {
    loading: PropTypes.bool.isRequired,
  }

  render() {
    const { loading } = this.props

    return (
      <div>
        {
          loading
          && <LinearProgress style={{
            top: 0,
            width: '100%',
            zIndex: 9999,
            position: 'fixed',
          }} />
        }
      </div>
    )
  }
}

const mapState = state => ({
  loading: state.loading,
})

export default connect(mapState, null)(Loading)
