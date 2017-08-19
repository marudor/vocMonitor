// @flow
import React from 'react';

type Props = {
  children?: any,
  ctx: AudioContext,
  minWidth: number,
  VisualizeComponent: Object,
  name: string,
};

type State = {
  muted: boolean,
};

export default class SaalVideo extends React.PureComponent<Props, State> {
  stopRendering = false;
  state = {
    muted: true,
  };
  toggleMute = () => {
    const muted = !this.state.muted;
    this.setState({
      muted,
    });
  };
  remove = () => {
    this.stopRendering = true;
    const { children } = this.props;
    const reactVideo = React.Children.only(children);
    reactVideo._owner.getPublicInstance().killVideo();
    this.forceUpdate();
  };
  render() {
    if (this.stopRendering) {
      return null;
    }
    const { VisualizeComponent, children, minWidth, ctx, name } = this.props;
    const { muted } = this.state;
    const muteNode = muted
      ? <span style={style.muted}>
          {'muted'}
        </span>
      : <span />;
    const removeNode = (
      <span style={style.remove} onClick={this.remove}>
        {'[-]'}
      </span>
    );
    return (
      <div
        style={{
          ...style.main,
          minWidth: `${minWidth}%`,
        }}
        onClick={this.toggleMute}>
        <h2 style={style.head}>
          {removeNode}
          {name}
          {muteNode}
        </h2>
        {children}
        <VisualizeComponent muted={muted} ctx={ctx} />
      </div>
    );
  }
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
    height: 120,
  },
};
