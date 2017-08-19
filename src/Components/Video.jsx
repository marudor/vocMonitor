// @flow
import React from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.min.css';

type Props = {
  saal: number,
};

export default class Video extends React.PureComponent<Props> {
  video: any;
  getVideoNode() {
    return this.refs.video;
  }
  componentDidMount() {
    const { video } = this.refs;
    this.video = videojs(video);
    this.video.on('error', this.videoError);
  }
  videoError = () => {
    setTimeout(() => {
      this.restartVideo();
    }, 20000);
  };
  restartVideo() {
    this.video.load();
    this.video.play();
  }
  killVideo() {
    const { video } = this.refs;
    video.pause();
    this.video.reset();
  }
  render() {
    const { saal } = this.props;
    return (
      <video ref="video" autoPlay crossOrigin="anonymous" preload="none" className="video-js">
        {/* <source src="https://voc.marudor.de/debug.mp4"/> */}
        <source src={`https://voc.marudor.de/cdn/s${saal}_native_sd.webm`} type="video/webm" />
        <source src={`https://voc.marudor.de/cdn/hls/s${saal}_native_sd.m3u8`} type="application/vnd.apple.mpegURL" />
        <p className="vjs-no-js">
          {'To view this video please enable JavaScript, and consider upgrading to a web browser that'}
          <a href="http://videojs.com/html5-video-support/" target="_blank" rel="noopener noreferrer">
            {'supports HTML5 video'}
          </a>
        </p>
      </video>
    );
  }
}
