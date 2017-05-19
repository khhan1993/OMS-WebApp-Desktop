import React from 'react';
import { Route, Router, IndexRedirect, browserHistory } from 'react-router';

import DefaultLayout from '../layout/default';

import MainView from '../view/main';
import GroupView from '../view/group';
import OrderRequestView from '../view/order/request';
import OrderListView from '../view/order/list';
import OrderVerifyView from '../view/order/verify';
import QueueView from '../view/queue';
import ManageMenuView from '../view/manage/menu';
import ManageSetmenuView from '../view/manage/setmenu';
import ManageGroupAndMemberView from '../view/manage/group_and_member';
import StatisticsView from '../view/statistics';

export default (
  <Router history={browserHistory}>
    <Route path="/" component={DefaultLayout}>
      <Route path="main" component={MainView} />
      <Route path="group" component={GroupView} />
      <Route path="order">
        <Route path="request" component={OrderRequestView} />
        <Route path="list" component={OrderListView} />
        <Route path="verify" component={OrderVerifyView} />
      </Route>
      <Route path="queue" component={QueueView} />
      <Route path="statistics" component={StatisticsView} />
      <Route path="manage">
        <Route path="menu" component={ManageMenuView} />
        <Route path="setmenu" component={ManageSetmenuView} />
        <Route path="member_and_group" component={ManageGroupAndMemberView} />
      </Route>
      <IndexRedirect to="main" />
    </Route>
  </Router>
);