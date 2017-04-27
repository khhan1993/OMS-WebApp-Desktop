import React from 'react';
import { Route, Router, IndexRedirect, browserHistory } from 'react-router';

import DefaultLayout from '../layout/default';

import MainView from '../view/main';
import OrderRequestView from '../view/order/request';

export default (
  <Router history={browserHistory}>
    <Route path="/" component={DefaultLayout}>
      <IndexRedirect to="/main" />
      <Route path="main" component={MainView} />
      <Route path="order">
        <Route path="request" component={OrderRequestView} />
      </Route>
    </Route>
  </Router>
);