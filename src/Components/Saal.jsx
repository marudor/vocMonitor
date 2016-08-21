// @flow
import React from 'react';
import SaalVideo from './SaalVideo';
import SimpleVisualize from './SimpleVisualize';

type Props = {
  saal: number,
  ctx: AudioContext,
}

export default class Saal extends React.PureComponent {
  props: Props;
  getVideoNode() {
    return this.refs.video.getVideoNode();
  }
  render() {
    const { saal, ctx } = this.props;
    return (
      <SimpleVisualize ctx={ctx}>
        <SaalVideo ref="video" saal={saal}/>
      </SimpleVisualize>
    );
  }
}
