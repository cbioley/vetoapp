import About from './about/Page.react';
import App from './app/App.react';
import Auth from './auth/Page.react';
import EditVeto from './vetos/EditVetoPage.react';
import Home from './home/Page.react';
import Me from './me/Page.react';
import NotFound from './notfound/Page.react';
import React from 'react';
import SuggestVeto from './vetos/SuggestVetoPage.react';
import User from './users/UserPage.react';
import Veto from './vetos/VetoPage.react';
// import Vetos from './vetos/Page.react';
import { IndexRoute, Route } from 'react-router';

export default function createRoutes(getState) {
  const requireAuth = (nextState, replace) => {
    const loggedInUser = getState().users.viewer;
    if (!loggedInUser) {
      replace({
        pathname: '/login',
        state: { nextPathname: nextState.location.pathname }
      });
    }
  };

  return (
    <Route component={App} path="/">
      <IndexRoute component={Home} />
      <Route component={About} path="about" />
      <Route component={Auth} path="login" />
      <Route component={EditVeto} path="vetos/:vetoId/edit" />
      <Route component={Me} path="me" onEnter={requireAuth} />
      <Route component={SuggestVeto} path="suggest-veto" />
      <Route component={User} path="users/:userId" />
      {/*<Route component={Vetos} path="vetos" />*/}
      <Route component={Veto} path="vetos/:vetoId" />
      <Route component={NotFound} path="*" />
    </Route>
  );
}
