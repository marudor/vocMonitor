function visualizeAudio(videoNode, canvasNode) {
  if (!videoNode || !canvasNode) {
    return;
  }
  var ctx/*: AudioContext */ = new (window.AudioContext || window.webkitAudioContext)();
  var analyser = ctx.createAnalyser();
  var gain = ctx.createGain();
  window.ana = analyser;
  window.gain = gain;
  var mediaElementSource = ctx.createMediaElementSource(videoNode);
  mediaElementSource.connect(analyser);
  analyser.connect(gain);
  analyser.fftSize = 1024;
  gain.connect(ctx.destination);
  gain.gain.value = 0;
  videoNode.gain = gain;
  var canvasContext = canvasNode.getContext('2d');
  function renderFrame() {
    window.requestAnimationFrame(renderFrame);
    var dataArray = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(dataArray);
    canvasContext.clearRect(0, 0, canvasNode.width, canvasNode.height);
    canvasContext.fillStyle = '#00CCFF';
    for (var i = 0; i < 100; i++) {
      var x = i * 3;
      var width = 2;
      var height = -(dataArray[i] / 2) - 3;
      canvasContext.fillRect(x, canvasNode.height, width, height);
    }
  }
  renderFrame();
}

function VisualizeAudio() {
  var elements = document.getElementsByTagName('video');
  for (var i = 0; i < elements.length; i++) {
    if (!elements[i]) {
      return;
    }
    const videoId = elements[i].id;
    const canvasId = videoId.replace('_html5_api', 'a');
    var canvas = document.getElementById(canvasId);
    var video = elements[i];
    visualizeAudio(video, canvas);
  }
}

function removeStream(number) {
  document.cookie += number + '|';
  document.getElementById('v' + number).remove();
  elements = document.getElementsByTagName('video');
  if (elements.length <= 0) {
    document.getElementById('reset').style.display = '';
  }
}

function resetStreams() {
  document.cookie = "n|";
  window.location.reload();
}

function mute(i) {
  var node = document.getElementById('s' + i + '_html5_api');
  if (node && node.gain) {
    node.gain.gain.value = (node.gain.gain.value + 1) % 2
    var mi = document.getElementById('m' + i);
    if (mi) {
      if (node.gain.gain.value) {
        mi.style.display = 'none';
      } else {
        mi.style.display = '';
      }
    }
  }
}

var elements = document.getElementsByTagName('video');
setTimeout(function() {
  var set = document.cookie.split('|');
  for (var i = 0; i < set.length; i++) {
    if (set[i]) {
      var e = document.getElementById('v' + set[i]);
      if (e) {
        e.remove();
      }
    }
  }
  elements = document.getElementsByTagName('video');
  if (elements.length <= 0) {
    document.getElementById('reset').style.display = '';
  }

  setTimeout(function() {
    for (var i = 0; i < elements.length; i++) {
      elements[i].play();
    }

    VisualizeAudio();
  }, 500);
});
