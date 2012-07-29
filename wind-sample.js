var wind = Wind({
  fps: 60
});
console.log(wind);

wind.every(function (fCurrent) {
  console.log('frame: %d', fCurrent);
});

wind.every(function (fCurrent) {
  var el = document.getElementById('box');
  el.style.top = fCurrent + 'px';
});

wind.every(function (fCurrent) {
  var el = document.getElementById('box');
  el.style.left = (fCurrent % 200) + 'px';
});

wind.every(function (fCurrent) {
  var el = document.getElementById('box');
  el.style.height = (fCurrent % 200) + 'px';
});

wind.every(function (fCurrent) {
  var el = document.getElementById('box');
  el.style.width = (fCurrent % 300) + 'px';
});

wind.play();

setTimeout(function () {
  wind.stop();
}, 5000);