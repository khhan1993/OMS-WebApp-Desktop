import React from 'react';
import { Route, Router, IndexRedirect, browserHistory } from 'react-router';

import DefaultLayout from '../layout/default';

import MainView from '../view/main';
import GroupView from '../view/group';
import OrderRequestView from '../view/order/request';

export default (
  <Router history={browserHistory}>
    <Route path="/" component={DefaultLayout}>
      <Route path="main" component={MainView} />
      <Route path="group" component={GroupView} />
      <Route path="order">
        <Route path="request" component={OrderRequestView} />
      </Route>
      <IndexRedirect to="main" />
    </Route>
  </Router>
);