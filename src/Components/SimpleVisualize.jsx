// @flow
import React from 'react';
import { autobind } from 'core-decorators';

type Props = {
  children?: any;
  ctx: AudioContext;
  minWidth: number,
}

type State = {
  muted: bool,
}

const style = {
  remove: {
    cursor: 'pointer',
  },
  muted: {
    color: 'red',
  },
  head: {
    WebkitUserSelect: 'none',
    display: 'flex',
    justifyContent: 'space-around',
    margin: 0,
  },
  main: {
    flex: '1 1 0',
    display: 'flex',
    flexDirection: 'column',
  },
  canvas: {
    height: 70,
  },
};

export default class SimpleVisualize extends React.PureComponent {
  props: Props;
  state: State = {
    muted: true,
  };
  stopRendering: bool = false;
  analyser: AnalyserNode;
  gain: GainNode;
  componentWillUnmount() {
    this.stopRendering = true;
  }
  @autobind
  toggleMute() {
    const muted = !this.state.muted;
    this.gain.gain.value = muted ? 0 : 1;
    this.setState({
      muted,
    });
  }
  componentDidMount() {
    const { children, ctx } = this.props;
    const reactVideo = React.Children.only(children);
    const videoNode = reactVideo._owner.getPublicInstance().getVideoNode();
    const canvas = this.refs.visualize;
    const analyser = this.analyser = ctx.createAnalyser();
    const gain = this.gain = ctx.createGain();
    const mediaElementSource = ctx.createMediaElementSource(videoNode);
    mediaElementSource.connect(analyser);
    analyser.connect(gain);
    analyser.fftSize = 1024;
    gain.connect(ctx.destination);
    gain.gain.value = this.state.muted ? 0 : 1;
    videoNode.gain = gain;

    const canvasContext = canvas.getContext('2d');
    const renderFrame = () => {
      canvasContext.clearRect(0, 0, canvas.width, canvas.height);
      canvasContext.fillStyle = '#00CCFF';
      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      analyser.getByteFrequencyData(dataArray);
      for (let i = 0; i < 100; i++) {
        const x = i * 3;
        const width = 2;
        const height = -(dataArray[i] / 2) - 3;
        canvasContext.fillRect(x, canvas.height, width, height);
      }
      if (!this.stopRendering) {
        window.requestAnimationFrame(renderFrame);
      }
    };
    renderFrame();
  }
  @autobind
  remove() {
    this.stopRendering = true;
    const { children } = this.props;
    const reactVideo = React.Children.only(children);
    reactVideo._owner.getPublicInstance().killVideo();
    this.forceUpdate();
  }
  render() {
    if (this.stopRendering) {
      return null;
    }
    const { children, minWidth } = this.props;
    const { saal } = (children || {}).props;
    const { muted } = this.state;
    const muteNode = muted ? (
      <span style={style.muted}>muted</span>
    ) : <span/>;
    const removeNode = <span style={style.remove} onClick={this.remove}>[-]</span>;
      return (
        <div style={{
            ...style.main,
            minWidth: `${minWidth}%`,
          }} onClick={this.toggleMute}>
          <h2 style={style.head}>{removeNode}Saal {saal}{muteNode}</h2>
          {children}
          <canvas style={style.canvas} ref="visualize"/>
        </div>
      );
    }
  }
