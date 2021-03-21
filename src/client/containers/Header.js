import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { I18n } from 'react-i18nify'
import { connect } from 'react-redux'
import { updateNotification } from '../reducer'
import FlagIcon from 'react-flag-kit/lib/CDNFlagIcon'
import SvgIcon from '@material-ui/core/SvgIcon'
import Description from '../components/Description'
import Search from '../components/Search'
import Translate from '../components/Translate'
import axios from 'axios'

class Header extends Component {
  static propTypes = {
    updateNotification: PropTypes.func.isRequired,
  }

  state = {
    count: 0,
    dialog: false,
  }

  componentDidMount() {
    axios('/api/images?count').then((res) => this.setState({ count: res.data.count }))
  }

  getGithubSvg() {
    return 'M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12'
  }

  openGithubProjet() {
    window.open('https://github.com/QuentinDutot/motada-photos-browser', '_blank')
  }

  render() {
    const { updateNotification } = this.props
    const { count, dialog } = this.state

    return (
      <div className="w-full flex items-center justify-center">
        <div className="md:w-3/5 w-full relative md:mx-32 md:my-28 mx-1 my-16">

          {/* Over the search area */}
          <div className="flex items-center justify-between mb-8">
            <p className="text-2xl text-gray-900">
              {count !== 0 ? I18n.t('header.title', { count: `${Math.round(count/1000)}k` }) : I18n.t('header.default_title')}
            </p>
            <div>
              <FlagIcon
                code={I18n.t('flag')}
                size={40}
                className="cursor-pointer mr-4 p-1"
                onClick={() => this.setState({ dialog: true })}
              />
              <SvgIcon
                className="h-20 bg-white rounded-full shadow cursor-pointer"
                onClick={this.openGithubProjet}
              >
                <path fill="black" d={this.getGithubSvg()} />
              </SvgIcon>
            </div>
          </div>


          {/* The search area */}
          <Search />

          {/* Under the search area */}
          <Description />

          {/* The translation popup */}
          <Translate open={dialog} close={() => this.setState({ dialog: false })} />
        </div>
      </div>
    )
  }
}

const mapDispatch = dispatch => ({
  updateNotification: notification => dispatch(updateNotification(notification)),
})

export default connect(null, mapDispatch)(Header)
