// @flow
import React from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.min.css';

type Props = {
  saal: number,
}

export default class SaalVideo extends React.PureComponent {
  props: Props;
  getVideoNode() {
    return this.refs.video;
  }
  componentDidMount() {
    const { video } = this.refs;
    videojs(video);
  }
  render() {
    const { saal } = this.props;
    return (
      <video ref="video" autoPlay crossOrigin="anonymous" preload="none" className="video-js">
        {/* <source src="https://voc.marudor.de/debug.mp4"/> */}
        <source src={`https://voc.marudor.de/cdn/s${saal}_native_sd.webm`} type="video/webm"/>
        <source src={`https://voc.marudor.de/cdn/hls/s${saal}_native_sd.m3u8`} type="application/vnd.apple.mpegURL"/>
        <p className="vjs-no-js">
          To view this video please enable JavaScript, and consider upgrading to a web browser that
          <a href="http://videojs.com/html5-video-support/" target="_blank">supports HTML5 video</a>
        </p>
      </video>
    );
  }
}
