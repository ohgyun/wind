var START_FRAME = 0,
  END_FRAME = 30;

var wind = Wind({
  fps: 30,
  loop: true,
  startFrame: START_FRAME,
  endFrame: END_FRAME
});

wind.every(function (frame) {
  document.getElementById('framebox').value = frame;
});

wind.every(function (frame) {
  var cursors = [ 'cursor1', 'cursor2', 'cursor3', 'cursor4', 'cursor5' ];
  for (var i = 0; i < cursors.length; i++) {
    var c = document.getElementById(cursors[i]);
    c.style.left = frame + 'px';
  }
});

wind.every(function (frame) {
  if (frame < 3) console.log('---', frame);
  // /(A+A+)+B/.test("AAAAAAAAAAAAAAAAAAAAA");
});


wind.every(function (frame) {
  if (frame === END_FRAME) {
    var now = new Date().getTime();
    console.log('Execution time: %f seconds', (now - jobStart) / 1000);
    jobStart = new Date().getTime();
  }
});

var jobStart = new Date().getTime();
wind.play();