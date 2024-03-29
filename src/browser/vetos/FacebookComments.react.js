import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import facebook from '../components/facebook';

class FacebookComments extends Component {

  static propTypes = {
    href: PropTypes.string.isRequired
  }

  render() {
    const { href } = this.props;

    return (
      <div className="facebook-comments">
        <div
          className="fb-comments"
          data-href={href}
          data-numposts="5"
        />
      </div>
    );
  }

}

export default facebook(FacebookComments);
