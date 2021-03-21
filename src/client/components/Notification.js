import React from 'react'
import { connect } from 'react-redux'
import Snackbar from '@material-ui/core/Snackbar'
import { updateNotification } from '../reducer'

const Notification = ({ notification = '', updateNotification = () => {} }) => (
  <Snackbar
    open={notification.length > 0}
    autoHideDuration={6000}
    onClose={() => updateNotification('')}
    message={notification}
  />
)

const mapState = state => ({
  notification: state.notification,
})

const mapDispatch = dispatch => ({
  updateNotification: notification => dispatch(updateNotification(notification)),
})

export default connect(mapState, mapDispatch)(Notification)
