import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { I18n } from 'react-i18nify'
import { connect } from 'react-redux'
import TextField from '@material-ui/core/TextField'
import InputAdornment from '@material-ui/core/InputAdornment'
import SearchIcon from '@material-ui/icons/Search'
import Clear from '@material-ui/icons/Clear'
import IconButton from '@material-ui/core/IconButton'
import { makeSearch } from '../reducer'

class Search extends Component {
  static propTypes = {
    search: PropTypes.string.isRequired,
    makeSearch: PropTypes.func.isRequired,
  }

  getSearchAdornement() {
    return (
      <InputAdornment position="start">
        <SearchIcon />
      </InputAdornment>
    )
  }

  getClearAdornement() {
    const { makeSearch } = this.props
    return (
      <InputAdornment position="end">
        <IconButton aria-label={I18n.t('tooltips.clear_search')} onClick={() => makeSearch('')}>
          <Clear />
        </IconButton>
      </InputAdornment>
    )
  }

  getInputProps() {
    const { search } = this.props
    return {
      startAdornment: this.getSearchAdornement(),
      endAdornment: search.length > 0 && this.getClearAdornement(),
    }
  }

  render() {
    const { search, makeSearch } = this.props

    return (
      <TextField
        value={search}
        variant="outlined"
        style={{ width: '100%', backgroundColor: 'white' }}
        placeholder={I18n.t('tooltips.search')}
        onChange={event => makeSearch(event.target.value)}
        InputProps={this.getInputProps()} />
    )
  }
}

const mapState = state => ({
  search: state.search,
})

const mapDispatch = dispatch => ({
  makeSearch: search => dispatch(makeSearch(search)),
})

export default connect(mapState, mapDispatch)(Search)
