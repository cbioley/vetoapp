import * as vetosActions from '../../common/vetos/actions';
import Component from 'react-pure-render/component';
import EditVeto from './EditVeto.react';
import Loading from '../lib/Loading.react';
import NotFound from '../notfound/Page.react';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { queryFirebase } from '../../common/lib/redux-firebase';

class EditVetoPage extends Component {

  static propTypes = {
    veto: PropTypes.object
  };

  render() {
    const { veto } = this.props;

    return (
      <div className="veto-page">
        <div className="row">
          <div className="col-md-10">
            {veto === undefined ?
              <Loading />
            : !veto ?
              <NotFound />
            :
              <EditVeto veto={veto} />
            }
          </div>
        </div>
      </div>
    );
  }

}

EditVetoPage = queryFirebase(EditVetoPage, ({ onVeto, params: { vetoId } }) => ({
  path: `vetos/${vetoId}`,
  on: {
    value: snapshot => onVeto(vetoId, snapshot.val())
  }
}));

export default connect(({ vetos }, { params: { vetoId } }) => ({
  veto: vetos.map.get(vetoId)
}), vetosActions)(EditVetoPage);
