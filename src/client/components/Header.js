import React, { Component } from 'react';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import { I18n } from 'react-i18nify';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import { updateNotification } from '../reducer';
import translations from '../../assets/translations/translations';
import FlagIcon from 'react-flag-kit/lib/FlagIcon';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import Description from './Description';
import Search from './Search';
import axios from 'axios';

const styles = {
  header: {
    top: 0,
    width: '70%',
    padding: '5% 15% 5% 15%',
    position: 'relative',
  },
  title: {
    padding: 0,
    color: '#ffffff',
    textAlign: 'left',
    fontSize: '1.3rem',
  },
  flag: {
    float: 'right',
    cursor: 'pointer',
  },
};

class Header extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    updateNotification: PropTypes.func.isRequired,
  };

  state = {
    count: 0,
    dialog: false,
  }

  componentDidMount() {
    axios('/api/images?count').then((res) => this.setState({ count: res.data.images }));
  }

  render() {
    const { classes, updateNotification } = this.props;
    const { count, dialog } = this.state;

    return (
      <div className={classes.header}>
        <p className={classes.title}>
          {
            count !== 0
            ? I18n.t('header.title', { count })
            : I18n.t('header.default_title')
          }
          <FlagIcon
            code={I18n.t('flag')}
            size={32}
            className={classes.flag}
            onClick={() => this.setState({ dialog: true })} />
        </p>
        <Search />
        <Description />
        <Dialog open={dialog} onClose={() => this.setState({ dialog: false })}>
          <DialogTitle>{I18n.t('tooltips.translations')}</DialogTitle>
          <List>
            {
              Object.keys(translations).map(key =>
                <ListItem
                  key={translations[key].flag}
                  button onClick={() => this.setState({ dialog: false })}>
                  <FlagIcon code={translations[key].flag} size={32} />
                  <ListItemText primary={translations[key].language} />
                </ListItem>)
            }
          </List>
        </Dialog>
      </div>
    );
  }
}

const mapDispatch = dispatch => ({
  updateNotification: notification => dispatch(updateNotification(notification)),
});

export default compose(withStyles(styles), connect(null, mapDispatch))(Header);
