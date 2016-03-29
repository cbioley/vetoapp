import './ProfileImage.scss';
import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';

export default class ProfileImage extends Component {

  static propTypes = {
    url: PropTypes.string.isRequired
  };

  render() {
    const { url } = this.props;

    return (
      <div className="user-profile-image">
        <img className="img-circle" src={url} />
      </div>
    );
  }

}
