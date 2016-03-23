import './App.scss';
import Component from 'react-pure-render/component';
import Footer from './Footer.react';
import Header from './Header.react';
import Helmet from 'react-helmet';
import React, { PropTypes } from 'react';
import start from '../../common/app/start';

class App extends Component {

  static propTypes = {
    children: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired
  };

  render() {
    const { children, location } = this.props;

    return (
      <div className="container">
        <Helmet
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
          meta={[{
            content: 'Jury nullification as a service',
            name: 'description'
          }]}
          titleTemplate="%s"
        />
        {/* Pass location to ensure header active links are updated. */}
        <Header location={location} />
        {children}
        <Footer />
      </div>
    );
  }

}

export default start(App);
