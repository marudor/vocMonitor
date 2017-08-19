// @flow
import React from 'react';
import Saal from './Saal';
import type { ConferenceInfo } from '../entry';

const style = {
  display: 'flex',
  flex: 1,
  flexWrap: 'wrap',
};

const ctx = new (window.AudioContext || window.webkitAudioContext)();

type Props = {
  conferences: ConferenceInfo[],
};

export default class Main extends React.PureComponent<Props> {
  render() {
    const { conferences } = this.props;
    const streamCount = conferences.reduce((p, c) => c.rooms.length + p, 0);
    let minWidth = 100 / streamCount * 2;
    if (streamCount % 2 !== 0) {
      minWidth /= 1.2;
    }
    if (streamCount <= 2) {
      minWidth = 50;
    }
    return (
      <div style={style}>
        {conferences.map(c => c.rooms.map(r => <Saal key={r.number} minWidth={minWidth} room={r} ctx={ctx} />))}
      </div>
    );
  }
}
