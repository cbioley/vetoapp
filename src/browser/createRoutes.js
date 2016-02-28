import About from './about/Page.react';
import App from './app/App.react';
import Auth from './auth/Page.react';
import Home from './home/Page.react';
import Me from './me/Page.react';
import NotFound from './notfound/Page.react';
import React from 'react';
import SuggestVeto from './vetos/SuggestVeto.react';
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
      <Route component={Me} onEnter={requireAuth} path="me" />
      <Route component={SuggestVeto} onEnter={requireAuth} path="suggest-veto" />
      <Route component={NotFound} path="*" />
    </Route>
  );
}
