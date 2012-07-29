var wind = Wind();
console.log(wind);

wind.on(function (fCurrent) {
  console.log(fCurrent);
});

wind.on(function (fCurrent) {
  var el = document.getElementById('box');
  el.style.top = fCurrent + 'px';
});

wind.on(function (fCurrent) {
  var el = document.getElementById('box');
  el.style.left = (fCurrent % 200) + 'px';
});

wind.on(function (fCurrent) {
  var el = document.getElementById('box');
  el.style.height = (fCurrent % 200) + 'px';
});

wind.on(function (fCurrent) {
  var el = document.getElementById('box');
  el.style.width = (fCurrent % 300) + 'px';
});

wind.play();