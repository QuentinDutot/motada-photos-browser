import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { reachBottom } from '../reducer'
import Notification from '../components/Notification'
import Display from '../components/Display'
import ScrollUp from '../components/ScrollUp'
import Loading from '../components/Loading'
import Background from '../components/Background'
import Header from './Header'
import Gallery from './Gallery'

class Home extends Component {
  static propTypes = {
    bottomReached: PropTypes.bool.isRequired,
    reachBottom: PropTypes.func.isRequired,
  }

  componentDidMount() {
    window.addEventListener('scroll', this.checkScrolling)
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.checkScrolling)
  }

  checkScrolling = () => {
    const { bottomReached, reachBottom } = this.props
    const { body, documentElement } = document
    const windowHeight = 'innerHeight' in window ? window.innerHeight : documentElement.offsetHeight
    const windowBottom = windowHeight + window.pageYOffset + 300
    const docHeight = Math.max(
      body.scrollHeight, body.offsetHeight,
      documentElement.clientHeight, documentElement.scrollHeight, documentElement.offsetHeight,
    )
    if (windowBottom >= docHeight && !bottomReached) {
      reachBottom(true)
    } else if(bottomReached) {
      reachBottom(false)
    }
  }

  render() {
    return (
      <div style={{ paddingBottom: 50, backgroundColor: 'rgb(255, 255, 255)' }}>

        {/* Background */}
        <Background />

        {/* Head */}
        <Loading />
        <Header />

        {/* Body */}
        <Display />
        <Gallery />
        <ScrollUp />

        {/* Notif's snackbar */}
        <Notification />
      </div>
    )
  }
}

const mapState = state => ({
  bottomReached: state.bottomReached,
})

const mapDispatch = dispatch => ({
  reachBottom: reached => dispatch(reachBottom(reached)),
})

export default connect(mapState, mapDispatch)(Home)
