// @flow
import './vendor.js';
// import { AppContainer } from 'react-hot-loader';
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
        const x: ?(number[]) = (r.thumb: string).match(re);
        if (x) {
          saal.push(x[1]);
        }
      });
    });
  });

  ReactDOM.render(<Main saal={saal} />, document.querySelector('#vocMonitor'));
}

initialize();
