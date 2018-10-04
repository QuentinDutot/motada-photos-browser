import React, { Component } from 'react';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import { updateNotification } from '../reducer';
import FlagIcon from 'react-flag-kit/lib/FlagIcon';
import Search from './Search';
import axios from 'axios';

const styles = {
  header: {
    top: 0,
    width: '70%',
    padding: '5% 15% 5% 15%',
    position: 'relative',
  },
  text: {
    padding: 0,
    color: '#ffffff',
  },
  title: {
    textAlign: 'left',
    fontSize: '1.3rem',
  },
  description: {
    textAlign: 'center',
    fontSize: '0.7rem',
  },
  flag: {
    float: 'right',
    cursor: 'pointer',
  },
  link: {
    marginRight: 10,
  },
};

class Header extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    updateNotification: PropTypes.func.isRequired,
  };

  state = {
    count: 0,
    sources: ['unsplash', 'pixabay', 'pexels'],
  }

  componentDidMount() {
    axios('/api/images?count').then((res) => this.setState({ count: res.data.images }));
  }

  render() {
    const { classes, updateNotification } = this.props;
    const { count, sources } = this.state;
    const formattedCount = count !== 0 ? count : 'thousands';

    return (
      <div className={classes.header}>
        <p className={[classes.text, classes.title].join(' ')}>
          {`Search over ${formattedCount} free and hig-res images`}
          <FlagIcon
            code="GB"
            size={32}
            className={classes.flag}
            onClick={() => updateNotification('Oops no translation available !')}/>
        </p>
        <Search />
        <p className={[classes.text, classes.description].join(' ')}>
          {
            sources.map(source =>
              <a
                href={`https://${source}.com`}
                target="_blank"
                rel="noopener noreferrer"
                className={classes.link}>
                {`${source}.com`}
              </a>)
          }
        </p>
      </div>
    );
  }
}

const mapDispatch = dispatch => ({
  updateNotification: notification => dispatch(updateNotification(notification)),
});

export default compose(withStyles(styles), connect(null, mapDispatch))(Header);
