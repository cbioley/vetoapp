import './App.scss';
import Component from 'react-pure-render/component';
import Footer from './Footer.react';
import Header from './Header.react';
import Helmet from 'react-helmet';
import NotFound from '../notfound/Page.react';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { onAppComponentDidMount } from '../../common/app/actions';

class App extends Component {

  static propTypes = {
    children: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired
  };

  // Note pattern how actions related to app start are dispatched.
  // componentDidMount is not called in ReactDOMServer.renderToString, so it's
  // the right place to dispatch client only (e.g. Firebase) actions.
  // Firebase can be used on the server as well, but it's over of this example.
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(onAppComponentDidMount());
  }

  render() {
    const { children, location } = this.props;
    const notFound = children.type === NotFound;

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
            { href: require('./favicon.ico'), rel: 'shortcut icon' }
          ]}
          meta={[{
            name: 'description',
            content: 'Dev stack and starter kit for functional and universal React web apps'
          }]}
          titleTemplate="%s"
        />
        {/* Pass location to ensure header active links are updated. */}
        <Header location={location} notFound={notFound} />
        {children}
        <Footer />
      </div>
    );
  }

}

// Just inject dispatch.
export default connect()(App);
