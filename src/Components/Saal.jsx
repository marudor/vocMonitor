// @flow
import CanvasVisualize from './CanvasVisualize';
import React from 'react';
import SaalVideo from './SaalVideo';
import Video from './Video';

type Props = {
  saal: number,
  ctx: AudioContext,
  minWidth: number,
};

export default class Saal extends React.PureComponent {
  props: Props;
  getVideoNode() {
    return this.refs.video.getVideoNode();
  }
  killVideo() {
    this.refs.video.killVideo();
  }
  render() {
    const { saal, ctx, minWidth } = this.props;
    return (
      <SaalVideo
        VisualizeComponent={CanvasVisualize}
        minWidth={minWidth}
        ctx={ctx}>
        <Video ref="video" saal={saal} />
      </SaalVideo>
    );
  }
}
