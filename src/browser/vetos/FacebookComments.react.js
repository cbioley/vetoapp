import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

class FacebookComments extends Component {

  static propTypes = {
    currentLocale: PropTypes.string.isRequired
  };

  constructor(props) {
    super(props);
    this.onRef = this.onRef.bind(this);
  }

  onRef(el) {
    // TODO: What if FB doesn't exists yet? Probably register, but how?
    if (window.FB) {
      window.FB.XFBML.parse(el);
    }
  }

  render() {
    return (
      <div ref={this.onRef} className="facebook-comments">
        <div
          className="fb-comments"
          data-numposts="5"
        ></div>
      </div>
    );
  }

}

export default connect(({ intl }) => ({
  currentLocale: intl.currentLocale
}))(FacebookComments);
