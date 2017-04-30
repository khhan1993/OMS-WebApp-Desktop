import React from 'react';
import { Route, Router, IndexRedirect, browserHistory } from 'react-router';

import DefaultLayout from '../layout/default';

import MainView from '../view/main';
import GroupListView from '../view/group/list';
import GroupCreateView from '../view/group/create';
import OrderRequestView from '../view/order/request';
import ManageMenuView from '../view/manage/menu';

export default (
  <Router history={browserHistory}>
    <Route path="/" component={DefaultLayout}>
      <Route path="main" component={MainView} />
      <Route path="group">
        <Route path="list" component={GroupListView} />
        <Route path="create" component={GroupCreateView} />
      </Route>
      <Route path="order">
        <Route path="request" component={OrderRequestView} />
      </Route>
      <Route path="manage">
        <Route path="menu" component={ManageMenuView} />
      </Route>
      <IndexRedirect to="main" />
    </Route>
  </Router>
);