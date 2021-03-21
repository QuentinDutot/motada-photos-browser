import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import LinearProgress from '@material-ui/core/LinearProgress'

class Loading extends Component {
  static propTypes = {
    loading: PropTypes.bool.isRequired,
  }

  render() {
    const { loading } = this.props

    return loading ? (
      <LinearProgress className="fixed top-0 w-full z-10" />
    ) : null
  }
}

const mapState = state => ({
  loading: state.loading,
})

export default connect(mapState, null)(Loading)
