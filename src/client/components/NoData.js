import React, { Component } from 'react'
import { connect } from 'react-redux'
import { I18n } from 'react-i18nify'
class NoData extends Component {
  state = {}

  render() {
    const { search, loading } = this.props

    if (loading) return null
    
    return (
      <div className="relative">
        <p className="text-2xl text-gray-900">
          {I18n.t('errors.no_results')}
        </p>
        {search && localStorage.getItem('motada_language') !== 'en' && (
          <p className="text-base text-gray-900">
            {I18n.t('errors.no_results_tip')}
          </p>
        )}
      </div>
    )
  }
}

const mapState = state => ({
  search: state.search,
  loading: state.loading,
})

export default connect(mapState, null)(NoData)
