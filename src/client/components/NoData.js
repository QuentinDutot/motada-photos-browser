import React, { Component } from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import { I18n } from 'react-i18nify';

const styles = {
  nodataBlock: {
    position: 'relative',
    padding: '20% 10%',
  },
  nodataText: {
    padding: 0,
    margin: 0,
    textAlign: 'center',
    fontSize: '1.5rem',
    color: '#333',
  },
  nodataTip: {
    fontSize: '1rem',
  },
};

class NoData extends Component {
  state = {}

  render() {
    const { classes, search, loading } = this.props;

    if (loading) return null;
    
    return (
      <div className={classes.nodataBlock}>
        <p className={classes.nodataText}>
          {I18n.t('errors.no_results')}
        </p>
        {search && localStorage.getItem('motada_language') !== 'en' && <p className={classes.nodataTip}>
          {I18n.t('errors.no_results_tip')}
        </p>}
      </div>
    );
  }
}

const mapState = state => ({
  search: state.search,
  loading: state.loading,
});

export default compose(withStyles(styles), connect(mapState, null))(NoData);
