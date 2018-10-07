import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { I18n } from 'react-i18nify';
import Dialog from '@material-ui/core/Dialog';

class Display extends Component {
  static propTypes = {
    open: PropTypes.bool.isRequired,
    close: PropTypes.func.isRequired,
  };

  render() {
    const { open, close } = this.props;

    return (
      <Dialog open={open} onClose={() => close()}>
        <img />
      </Dialog>
    );
  }
}

export default Display;
