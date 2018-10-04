import React, { Component } from 'react';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import SearchIcon from '@material-ui/icons/Search';
import Clear from '@material-ui/icons/Clear';
import Chip from '@material-ui/core/Chip';
import IconButton from '@material-ui/core/IconButton';
import { makeSearch } from '../reducer';

const styles = {
  searchBar: {
    width: '100%',
    backgroundColor: 'white',
  },
  trendingSearchBar: {
    marginTop: 20,
  },
  trendingSearch: {
    marginLeft: 15,
    backgroundColor: 'white',
  },
};

class Search extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    search: PropTypes.string.isRequired,
    makeSearch: PropTypes.func.isRequired,
  };

  state = {
    suggestions: ['building', 'business', 'car', 'flower', 'sky', 'tatoo', 'wall'],
  }

  render() {
    const { classes, search, makeSearch } = this.props;
    const { suggestions } = this.state;

    const searchAdornment = <InputAdornment position="start"><SearchIcon /></InputAdornment>;
    const clearAdornment = <InputAdornment position="end"><IconButton aria-label="Clear" onClick={() => makeSearch('')}><Clear /></IconButton></InputAdornment>;

    return (
      <div>
        <TextField
          className={classes.searchBar}
          variant="outlined"
          placeholder="Search here..."
          value={search}
          onChange={event => makeSearch(event.target.value)}
          InputProps={{ startAdornment: searchAdornment, endAdornment: search.length > 0 && clearAdornment }} />
        <div className={classes.trendingSearchBar}>
          {
            /*suggestions.map((suggestedSearch) => <Chip
              color="primary"
              variant="outlined"
              key={suggestedSearch}
              className={classes.trendingSearch}
              onClick={() => makeSearch(suggestedSearch)}
              label={suggestedSearch} />)*/
          }
        </div>
      </div>
    );
  }
}

const mapState = state => ({
  search: state.search,
});

const mapDispatch = dispatch => ({
  makeSearch: search => dispatch(makeSearch(search)),
});

export default compose(withStyles(styles), connect(mapState, mapDispatch))(Search);
