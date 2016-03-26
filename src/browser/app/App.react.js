import './App.scss';
import Component from 'react-pure-render/component';
import Footer from './Footer.react';
import Header from './Header.react';
import Helmet from 'react-helmet';
import React, { PropTypes } from 'react';
import start from '../../common/app/start';
import { connect } from 'react-redux';

// v4-alpha.getbootstrap.com/getting-started/introduction/#starter-template
const bootstrap4Metas = [
  { charset: 'utf-8' },
  {
    name: 'viewport',
    content: 'width=device-width, initial-scale=1, shrink-to-fit=no'
  },
  {
    'http-equiv': 'x-ua-compatible',
    content: 'ie=edge'
  }
];

class App extends Component {

  static propTypes = {
    children: PropTypes.object.isRequired,
    currentLocale: PropTypes.string.isRequired,
    location: PropTypes.object.isRequired
  };

  render() {
    const { children, currentLocale, location } = this.props;

    return (
      <div className="container">
        <Helmet
          htmlAttributes={{ lang: currentLocale }}
          titleTemplate="%s"
          meta={[
            ...bootstrap4Metas,
            {
              name: 'description',
              content: 'Jury nullification as a service'
            }
          ]}
          link={[
            ...['32x32', '16x16'].map(sizes => ({
              // TODO: Add limit 0 somehow to prevent inlining.
              href: require(`./favicon-${sizes}.png`),
              rel: 'icon',
              type: 'image/png',
              sizes
            })),
            { href: require('./favicon.ico'), rel: 'shortcut icon' },
            {
              href: 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/1.4.0/css/flag-icon.min.css',
              rel: 'stylesheet'
            }
          ]}
        />
        {/* Pass location to ensure header active links are updated. */}
        <Header location={location} />
        {children}
        <Footer />
      </div>
    );
  }

}

App = start(App);

export default connect(state => ({
  currentLocale: state.intl.currentLocale
}))(App);
