import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

import routes from './config/routes';
import reducer from './reducer';

import 'font-awesome/css/font-awesome.css';
import 'semantic-ui-css/semantic.min.css';
import '../public/style.css';

let store = createStore(reducer);

ReactDOM.render(
  <Provider store={store}>
    {routes}
  </Provider>,
  document.getElementById('root')
);