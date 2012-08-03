var START_FRAME = 0,
  END_FRAME = 30;

var wind = Wind({
  fps: 30,
  loop: false,
  startFrame: START_FRAME,
  endFrame: END_FRAME,
  ensureEndFrame: true
});

wind.every(function (frame) {
  document.getElementById('framebox').value = frame;
});

// move cursor
wind.every(function (frame) {
  var cursors = [ 'cursor1', 'cursor2', 'cursor3', 'cursor4', 'cursor5' ];
  for (var i = 0; i < cursors.length; i++) {
    var c = document.getElementById(cursors[i]);
    c.style.left = (frame*10) + 'px';
  }
});

// long time script interruption
wind.every(function (frame) {
  // long time script
  ///(A+A+)+B/.test("AAAAAAAAAAAAAAAAAAAAAA");
});

// played frame log
var played = [];
wind.every(function (frame) {
  played.push(frame);
  if (frame === END_FRAME) {
    console.log('played frame: ', played);
    played = []; 
  }
});

// execution timing log
wind.every(function (frame) {
  if (frame === END_FRAME) {
    var now = new Date().getTime();
    console.log('Execution time: %f seconds', (now - jobStart) / 1000);
    jobStart = new Date().getTime();
  }
});

var jobStart = new Date().getTime();
wind.play();