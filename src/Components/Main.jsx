// @flow
import React from 'react';
import Saal from './Saal';

const style = {
  display: 'flex',
  flex: 1,
  flexWrap: 'wrap',
};

const ctx = new (window.AudioContext || window.webkitAudioContext)();

export default class Main extends React.PureComponent {
  render() {
    return (
      <div style={style}>
        {
          [1, 2, 3, 4, 5, 6, 7, 8].map(i => (
            <Saal key={i} saal={i} ctx={ctx}/>
          ))
        }
      </div>
    );
  }
}
