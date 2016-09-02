// @flow
import React from 'react';
import Saal from './Saal';

const style = {
  display: 'flex',
  flex: 1,
  flexWrap: 'wrap',
};

const ctx = new (window.AudioContext || window.webkitAudioContext)();

type Props = {
  saal?: number[]
}

export default class Main extends React.PureComponent {
  props: Props;
  static defaultProps = {
    saal: [1, 2, 3, 4, 5, 6, 7, 8],
  };
  render() {
    const { saal } = this.props;
    // $FlowFixMe
    let minWidth = 100 / saal.length * 1.5;
    // $FlowFixMe
    if (saal.length <= 2) {
      minWidth = 50;
    }
    return (
      <div style={style}>
        {
          // $FlowFixMe
          saal.map(i => (
            <Saal key={i} minWidth={minWidth} saal={i} ctx={ctx}/>
          ))
        }
      </div>
    );
  }
}
