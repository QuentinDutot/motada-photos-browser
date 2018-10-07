import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { I18n } from 'react-i18nify';
import translations from '../../assets/translations/translations';
import FlagIcon from 'react-flag-kit/lib/FlagIcon';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';

class Translate extends Component {
  static propTypes = {
    open: PropTypes.bool.isRequired,
    close: PropTypes.func.isRequired,
  };

  translate(lang) {
    const { close } = this.props;
    close();
    localStorage.setItem('motada_language', lang);
    location.reload();
  }

  render() {
    const { open, close } = this.props;

    return (
      <Dialog open={open} onClose={() => close()}>
        <DialogTitle>{I18n.t('tooltips.translations')}</DialogTitle>
        <List>
          {
            Object.keys(translations).map(key =>
              <ListItem
                key={translations[key].flag}
                button onClick={() => this.translate(translations[key].code)}>
                <FlagIcon code={translations[key].flag} size={32} />
                <ListItemText primary={translations[key].language} />
              </ListItem>)
          }
        </List>
      </Dialog>
    );
  }
}

export default Translate;
