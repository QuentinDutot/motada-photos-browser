import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { updateNotification } from '../reducer'
import Slide from 'react-reveal/Slide'

const Notification = ({ notification = '', updateNotification = () => {} }) => {

  useEffect(() => {
    if (!notification) return
    const clearNotification = () => updateNotification('')
    setTimeout(clearNotification, 6000)
    return () => clearTimeout(clearNotification)
  }, [notification])

  return notification ? (
    <Slide bottom duration={500} when={notification}>
      <p className="fixed bottom-0 left-0 right-0 bg-white rounded shadow p-4 mx-auto mb-12" style={{ width: 'fit-content' }}>
        {notification}
      </p>
    </Slide>
  ) : null
}

const mapState = state => ({
  notification: state.notification,
})

const mapDispatch = dispatch => ({
  updateNotification: notification => dispatch(updateNotification(notification)),
})

export default connect(mapState, mapDispatch)(Notification)
