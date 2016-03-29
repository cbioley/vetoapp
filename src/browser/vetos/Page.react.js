import Component from 'react-pure-render/component';
import Helmet from 'react-helmet';
import LastVetos from './LastVetos.react';
import React from 'react';
import linksMessages from '../../common/app/linksMessages';
import { injectIntl, intlShape } from 'react-intl';

class Page extends Component {

  static propTypes = {
    intl: intlShape.isRequired
  }

  render() {
    const { intl } = this.props;
    const title = intl.formatMessage(linksMessages.vetos);

    return (
      <div className="vetos-page">
        <Helmet title={title} />
        <div className="row">
          <div className="col-md-10">
            <LastVetos />
          </div>
        </div>
      </div>
    );
  }

}

export default injectIntl(Page);
