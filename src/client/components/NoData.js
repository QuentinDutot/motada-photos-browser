import React from 'react'
import { connect } from 'react-redux'
import { I18n } from 'react-i18nify'

const NoData = ({ search = '', loading = false }) => (
  loading ? null : (
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
)

const mapState = state => ({
  search: state.search,
  loading: state.loading,
})

export default connect(mapState, null)(NoData)
