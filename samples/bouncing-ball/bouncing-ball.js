var START_FRAME = 0,
  END_FRAME = 48;

var wind = Wind({
  fps: 12,
  loop: false,
  startFrame: START_FRAME,
  endFrame: END_FRAME,
  ensureEndFrame: true
});

var paper = Raphael('box', 400, 400),
  ball = paper.ellipse(200, 360, 40, 40);

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
  .key(1, {
    
  })
  .key(23, {
    cy: 160
  })
  .key(24, {
    ry: 30,
    cy: 150
  })
  .key(25, {
    cy: 160
  });
  
// TODO: execute handler when start and end

//wind.goTo(22);
wind.play();

// TODO: 커서로 키를 움직일 수 있는 툴박스 FrameNavigator
//   right = 프레임 이동
//   shift + right = 키 이동

