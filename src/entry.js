// @flow
import './vendor.js';
import { AppContainer } from 'react-hot-loader';
import axios from 'axios';
import Main from './Components/Main';
import React from 'react';
import ReactDOM from 'react-dom';

async function initialize() {
  const re = /s(\d).png$/;
  const saalConfigs = (await axios.get('https://voc.marudor.de/api.json')).data;
  const saal = [];
  saalConfigs.forEach(s => {
  const groups = s.groups;
  groups.forEach(g => {
    g.rooms.forEach(r => {
      // $FlowFixMe
      const x: ?number[] = (r.thumb: string).match(re);
      if (x) {
        saal.push(x[1]);
      }
    });
  });
});

  ReactDOM.render(
    <AppContainer>
      <Main saal={saal} />
    </AppContainer>,
    document.querySelector('#vocMonitor'),
  );

  if (module.hot) {
    // $FlowFixMe
    module.hot.accept('./Components/Main', () => {
      // If you use Webpack 2 in ES modules mode, you can
      // use <App /> here rather than require() a <NextApp />.
      const NextApp = require('./Components/Main').default;

      ReactDOM.render(
        <AppContainer>
          <NextApp saal={saal} />
        </AppContainer>,
        document.querySelector('#vocMonitor'),
      );
    });
  }
}

initialize();
