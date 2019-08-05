import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Snackbar from '@material-ui/core/Snackbar'
import { updateNotification } from '../reducer'

class Notification extends Component {
  static propTypes = {
    notification: PropTypes.string.isRequired,
    updateNotification: PropTypes.func.isRequired,
  }

  render() {
    const { notification, updateNotification } = this.props

    return (
      <Snackbar
        open={notification.length > 0}
        autoHideDuration={6000}
        onClose={() => updateNotification('')}
        message={notification} />
    )
  }
}

const mapState = state => ({
  notification: state.notification,
})

const mapDispatch = dispatch => ({
  updateNotification: notification => dispatch(updateNotification(notification)),
})

export default connect(mapState, mapDispatch)(Notification)
