import Component from 'react-pure-render/component';
import React from 'react';
import facebook from '../components/facebook';

class FacebookComments extends Component {

  render() {
    return (
      <div className="facebook-comments">
        <div
          className="fb-comments"
          data-numposts="5"
        />
      </div>
    );
  }

}

export default facebook(FacebookComments);
