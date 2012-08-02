var wind = Wind({
  fps: 30,
  loop: true,
  startFrame: 0,
  endFrame: 100
});
console.log(wind);

wind.every(function (frame) {
  document.getElementById('framebox').value = frame;
});

wind.every(function (frame) {
  var cursor = document.getElementById('cursor');
  cursor.style.left = frame + '%';
});

wind.every(function (frame) {
  if (frame === 0) {
    var d = new Date();
    console.log('Start seconds: %d', d.getSeconds());
  }
});

wind.play();