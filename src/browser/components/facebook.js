// A higher order component for Facebook XFBML.

import Component from 'react-pure-render/component';
import React from 'react';
import ReactDOM from 'react-dom';

export default function facebook(Wrapped) {
  return class Wrapper extends Component {

    parseXfbmlAsap(el) {
      if (window.FB) {
        window.FB.XFBML.parse(el);
        return;
      }
      const fbAsyncInit = window.fbAsyncInit;
      // Aspect Oriented Programming ftw.
      window.fbAsyncInit = () => {
        fbAsyncInit();
        if (!this._isMounted) return;
        window.FB.XFBML.parse(el);
      };
    }

    componentDidMount() {
      this._isMounted = true;
      const el = ReactDOM.findDOMNode(this);
      this.parseXfbmlAsap(el);
    }

    componentWillUnmount() {
      this._isMounted = false;
    }

    render() {
      return <Wrapped {...this.props} />;
    }

  };
}
