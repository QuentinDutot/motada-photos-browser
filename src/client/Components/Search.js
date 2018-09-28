import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import SearchIcon from '@material-ui/icons/Search';
import Clear from '@material-ui/icons/Clear';
import Chip from '@material-ui/core/Chip';
import IconButton from '@material-ui/core/IconButton';

const styles = {
  searchBar: {
    width: '100%',
    backgroundColor: 'white',
  },
  trendingSearchBar: {
    marginTop: 12,
  },
  trendingSearch: {
    marginLeft: 12,
  },
};

class Search extends Component {
  state = {
    search: '',
    suggestions: ['sky', 'laptop', 'car'],
  }

  // TODO propTypes

  makeSearch(key) {
    this.setState({ search: key });
    const { search } = this.props;
    search(search);
  }

  clearSearch() {
    this.setState({ search: '' });
    const { search } = this.props;
    search('');
  }

  render() {
    const { classes } = this.props;
    const { search, suggestions } = this.state;

    const searchAdornment = <InputAdornment position="start"><SearchIcon /></InputAdornment>;
    const clearAdornment = <InputAdornment position="end"><IconButton aria-label="Clear" onClick={() => this.clearSearch()}><Clear /></IconButton></InputAdornment>;

    return (
      <div>
        <TextField
          className={classes.searchBar}
          variant="outlined"
          placeholder="Search here..."
          value={search}
          onChange={event => this.makeSearch(event.target.value)}
          InputProps={{ startAdornment: searchAdornment, endAdornment: search.length > 0 && clearAdornment }} />
        <div className={classes.trendingSearchBar}>
          {
            suggestions.map((suggestedSearch) => <Chip
              color="primary"
              key={suggestedSearch}
              className={classes.trendingSearch}
              onClick={() => this.makeSearch(suggestedSearch)}
              label={suggestedSearch} />)
          }
        </div>
      </div>
    );
  }
}


export default withStyles(styles)(Search);
