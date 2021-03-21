import React from 'react'
import { I18n } from 'react-i18nify'
import { connect } from 'react-redux'
import { makeSearch } from '../reducer'

const Search = ({ search = '', makeSearch = () => {} }) => (
  <form className="relative">
    <i className="fa fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-900" aria-hidden="true" />
    <input
      type="text"
      value={search}
      placeholder={I18n.t('tooltips.search')}
      onChange={event => makeSearch(event.target.value)}
      className="focus:border-blue-900 focus:ring-1 focus:ring-blue-900 focus:outline-none w-full text-lg text-black placeholder-gray-900 border border-gray-200 rounded shadow px-12 py-4"
    />
    {search.length > 0 && (
      <i
        className="fa fa-times absolute right-4 top-1/2 transform -translate-y-1/2 bg-gray-50 hover:bg-gray-300 text-gray-900 text-lg rounded-full cursor-pointer px-4 py-2"
        aria-label={I18n.t('tooltips.clear_search')}
        onClick={() => makeSearch('')}
      />
    )}
  </form>
)

const mapState = state => ({
  search: state.search,
})

const mapDispatch = dispatch => ({
  makeSearch: search => dispatch(makeSearch(search)),
})

export default connect(mapState, mapDispatch)(Search)
