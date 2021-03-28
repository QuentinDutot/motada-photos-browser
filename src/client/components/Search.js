import React, { useEffect, useState } from 'react'
import { translate } from 'react-i18nify'
import { connect } from 'react-redux'
import useDebouncy from '../hooks/UseDebouncy'
import { makeSearch } from '../reducer'

const Search = ({ search = '', makeSearch = () => {} }) => {

  const [value, setValue] = useState(search)
  useDebouncy(
    () => makeSearch(value),
    500,
    [value],
  )

  useEffect(() => {
    if (search == value) return
    setValue(search)
  }, [search])
  
  return (
    <form className="relative">
      <i className="fa fa-search absolute md:left-4 left-2 top-1/2 transform -translate-y-1/2 text-gray-900" aria-hidden="true" />
      <input
        type="text"
        value={value}
        placeholder={translate('tooltips.search')}
        onChange={event => setValue(event.target.value)}
        className="focus:border-blue-900 focus:ring-1 focus:ring-blue-900 focus:outline-none w-full text-lg text-black placeholder-gray-900 border border-gray-200 rounded shadow md:px-12 px-6 md:py-6 py-3"
      />
      {search.length > 0 && (
        <i
          className="fa fa-times absolute md:right-4 right-2 top-1/2 transform -translate-y-1/2 bg-gray-50 hover:bg-gray-300 text-gray-900 text-lg rounded-full cursor-pointer px-4 py-2"
          aria-label={translate('tooltips.clear_search')}
          onClick={() => setValue('')}
        />
      )}
    </form>
  )
}

const mapState = state => ({
  search: state.search,
})

const mapDispatch = dispatch => ({
  makeSearch: search => dispatch(makeSearch(search)),
})

export default connect(mapState, mapDispatch)(Search)
