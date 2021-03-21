import React from 'react'
import { connect } from 'react-redux'
import LinearProgress from '@material-ui/core/LinearProgress'

const Loading = ({ loading = false }) => (
  loading ? (
    <LinearProgress className="fixed top-0 w-full z-10" />
  ) : null
)

const mapState = state => ({
  loading: state.loading,
})

export default connect(mapState, null)(Loading)
