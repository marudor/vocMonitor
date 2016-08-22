// @flow
import './vendor.js';
import ReactDOM from 'react-dom';
import Main from './Components/Main';
import React from 'react';
import { AppContainer } from 'react-hot-loader';



ReactDOM.render(
  <AppContainer>
    <Main/>
  </AppContainer>
  , document.querySelector('#vocMonitor'));

if (module.hot) {
  module.hot.accept('./Components/Main', () => {
    // If you use Webpack 2 in ES modules mode, you can
    // use <App /> here rather than require() a <NextApp />.
    const NextApp = require('./Components/Main').default;
    
    ReactDOM.render(
      <AppContainer>
         <NextApp />
      </AppContainer>,
      document.querySelector('#vocMonitor')
    );
  });
}
