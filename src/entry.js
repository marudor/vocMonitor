// @flow
import './vendor.js';
// import { AppContainer } from 'react-hot-loader';
import axios from 'axios';
import Main from './Components/Main';
import React from 'react';
import ReactDOM from 'react-dom';

export type Conference = {
  conference: string,
  slug: string,
  author: string,
  description: string,
  keywords: string,
  startsAt: string,
  endsAt: string,
  groups: Group[]
};

export type Group = {
  group: string,
  rooms: Room[]
};

export type Room = {
  slug: string,
  schedulename: string,
  thumb: string,
  link: string,
  display: string,
  streams: Stream[]
};

export type Stream = {
  slug: string,
  display: string,
  type: string,
  isTranslated: boolean,
  videoSize: [number, number],
  urls: { [type: string]: StreamURL }
};

export type StreamURL = {
  display: string,
  tech: string,
  url: string
};

export type ConferenceInfo = {
  name: string,
  slug: string,
  rooms: {
    name: string,
    number: number
  }[]
};

async function initialize() {
  const re = /s(\d).png$/;
  const saalConfigs: Conference[] = (await axios.get(
    'https://voc.marudor.de/api.json'
  )).data;
  const conferences = [];
  saalConfigs.forEach(s => {
    const conferenceInfo = {
      name: s.conference,
      slug: s.slug,
      rooms: [],
    };
    const groups = s.groups;
    groups.forEach(g => {
      g.rooms.forEach(r => {
        // $FlowFixMe
        const x: ?(number[]) = (r.thumb: string).match(re);
        if (x) {
          conferenceInfo.rooms.push({
            name: r.display,
            number: x[1],
          });
        }
      });
    });
    conferences.push(conferenceInfo);
  });

  ReactDOM.render(
    <Main conferences={conferences} />,
    document.querySelector('#vocMonitor')
  );
}

const REFRESH_RATE = 60000;
initialize();
setInterval(initialize, REFRESH_RATE);
