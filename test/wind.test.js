module('wind', {
  setup: function () {
    this.w = new Wind({
      fps: 30,
      length: 100
    }); 
  },
  teardown: function () {
    
  }
  
});

test('Get current frame', function () {
  
  equal(this.w.getCurrentFrame(), -1);
  
});