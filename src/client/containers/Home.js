import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { reachBottom } from '../reducer'
import Notification from '../components/Notification'
import Display from '../components/Display'
import ScrollUp from '../components/ScrollUp'
import Loading from '../components/Loading'
import Background from '../components/Background'
import Header from './Header'
import Gallery from './Gallery'

const Home = ({ bottomReached = false, reachBottom = () => {} }) => {

  const onScroll = () => {
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

  useEffect(() => {
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [bottomReached])

  return (
    <div className="pb-40 bg-white">

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

const mapState = state => ({
  bottomReached: state.bottomReached,
})

const mapDispatch = dispatch => ({
  reachBottom: reached => dispatch(reachBottom(reached)),
})

export default connect(mapState, mapDispatch)(Home)
