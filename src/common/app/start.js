import * as appActions from './actions';
import * as authActions from '../auth/actions';
import * as usersActions from '../users/actions';
import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { IntlProvider } from 'react-intl';
import { connect } from 'react-redux';
import { firebaseActions } from '../lib/redux-firebase';
import { queryFirebase } from '../../common/lib/redux-firebase';

export default function start(Wrapped) {
  class Start extends Component {

    static propTypes = {
      currentLocale: PropTypes.string.isRequired,
      dispatch: PropTypes.func.isRequired,
      messages: PropTypes.object.isRequired
    };

    componentDidMount() {
      const { dispatch } = this.props;
      // Client side changes must be dispatched after componentDidMount.
      dispatch(firebaseActions.watchAuth(authActions.logout));
      dispatch(appActions.updateAppStateFromStorage());
    }

    render() {
      const { currentLocale, messages } = this.props;
      return (
        <IntlProvider
          key={currentLocale} // https://github.com/yahoo/react-intl/issues/234
          locale={currentLocale}
          messages={messages[currentLocale]}
        >
          <Wrapped {...this.props} />
        </IntlProvider>
      );
    }

  }

  Start = queryFirebase(Start, ({ dispatch, viewer }) => ({
    path: viewer && `roles/admins/${viewer.id}`,
    on: {
      value: snapshot =>
        dispatch(usersActions.setViewerIsAdmin(!!snapshot.val()))
    }
  }));

  Start = connect(state => ({
    currentLocale: state.intl.currentLocale,
    messages: state.intl.messages,
    viewer: state.users.viewer
  }))(Start);

  return Start;
}
