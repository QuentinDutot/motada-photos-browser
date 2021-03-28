import React from 'react'
import { connect } from 'react-redux'

const Loading = ({ loading = false }) => (
  loading ? (
    <div className="w-full h-2 fixed top-0 bg-blue-900 z-10 animate-pulse" />
  ) : null
)

const mapState = state => ({
  loading: state.loading,
})

export default connect(mapState, null)(Loading)
