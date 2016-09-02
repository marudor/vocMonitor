// @flow
import './vendor.js';
import ReactDOM from 'react-dom';
import Main from './Components/Main';
import React from 'react';
import { AppContainer } from 'react-hot-loader';

const saal = location.search.replace('?saal=', '').split(',').map(s => Number.parseInt(s, 10)).filter(x => !Number.isNaN(x));

ReactDOM.render(
  <AppContainer>
    <Main saal={saal && saal.length ? saal : undefined}/>
  </AppContainer>
  , document.querySelector('#vocMonitor'));

if (module.hot) {
  // $FlowFixMe
  module.hot.accept('./Components/Main', () => {
    // If you use Webpack 2 in ES modules mode, you can
    // use <App /> here rather than require() a <NextApp />.
    const NextApp = require('./Components/Main').default;

    ReactDOM.render(
      <AppContainer>
         <NextApp saal={saal && saal.length ? saal : undefined}/>
      </AppContainer>,
      document.querySelector('#vocMonitor')
    );
  });
}
