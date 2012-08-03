var START_FRAME = 0,
  END_FRAME = 24;

var wind = Wind({
  fps: 24,
  loop: false,
  startFrame: START_FRAME,
  endFrame: END_FRAME,
  ensureEndFrame: true
});

var paper = Raphael('box', 400, 400),
  ball = paper.circle(200, 360, 40);

wind.onstart(function () {
  console.log('Animation Start');
});

wind.onend(function () {
  console.log('Animation End');
});

wind.keyable(function (attr) {
    this.attr(attr);
  }, ball)
  .key(0, {
    cy: 360
  })
  .key(12, {
    cy: 340
  });
  
// TODO: execute handler when start and end

wind.play();