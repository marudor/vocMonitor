// @flow
import React from 'react';

type Props = {
  ctx: AudioContext,
  muted: boolean
};

const style = {
  canvas: {
    height: 120,
  },
};

export default class CanvasVisualize extends React.PureComponent {
  props: Props;
  stopRendering: boolean = false;
  analyser: AnalyserNode;
  gain: GainNode;
  componentWillUnmount() {
    this.stopRendering = true;
  }
  componentWillReceiveProps(props: Props) {
    if (props.muted) {
      this.gain.gain.value = 0;
    } else {
      this.gain.gain.value = 1;
    }
  }
  componentDidMount() {
    const { ctx, muted } = this.props;
    // $FlowFixMe
    const videoNode = this._reactInternalInstance._currentElement._owner
      .getPublicInstance()
      .props.children._owner.getPublicInstance()
      .getVideoNode();
    const canvas = this.refs.visualize;
    const analyser = ctx.createAnalyser();
    this.analyser = analyser;
    const mediaElementSource = ctx.createMediaElementSource(videoNode);
    mediaElementSource.connect(analyser);
    const gain = ctx.createGain();
    this.gain = gain;
    gain.gain.value = muted ? 0 : 1;
    analyser.connect(gain);
    analyser.fftSize = 1024;
    gain.connect(ctx.destination);
    gain.gain.value = 0;
    videoNode.gain = gain;

    const canvasContext = canvas.getContext('2d');
    const renderFrame = () => {
      canvasContext.clearRect(0, 0, canvas.width, canvas.height);
      canvasContext.fillStyle = '#00CCFF';
      const dataArray = new Float32Array(analyser.frequencyBinCount);
      analyser.getFloatFrequencyData(dataArray);
      const barWidth = canvas.width / dataArray.length * 2.5;
      let x = 0;
      for (let i = 0; i < dataArray.length; i++) {
        const height = dataArray[i] * 2 + 200;
        canvasContext.fillRect(x, canvas.height - height, barWidth, height);
        x += barWidth;
      }
      if (!this.stopRendering) {
        window.requestAnimationFrame(renderFrame);
      }
    };
    renderFrame();
  }
  render() {
    return <canvas style={style.canvas} ref="visualize" />;
  }
}
