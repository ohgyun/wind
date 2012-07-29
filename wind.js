/**
 * Wind.js - Javascript Keyframe Animation Framework
 * 
 
 * [prefix]
 * - m : milliseconds
 * - f : frame
 */
(function () {
  
  var Wind = function (options) {
      
      this._fps = options.fps || 30;
      this._mPerFrame = Math.floor(1000 / this._fps); // frame per milliseconds
      
      this._fCurrent = -1;
      this._timer = null;
      
      this._keys = [];
      this._callbackObjects = [];
        
    },
    
    wp = Wind.prototype;
    
  wp.play = function () {
    var self = this,
      mStart = new Date().getTime();
    
    this._playFrame(mStart);
  };

  /**
   * Play the frame that matched at passed time.
   */ 
  wp._playFrame = function (mStart) {
    var mCurrent = new Date().getTime(),
      mPassed = mCurrent - mStart,
      fCurrent = this._getFrameAtMills(mPassed);
    
    if (this._fCurrent !== fCurrent) {
      this._fCurrent = fCurrent;
      this._runCallbacks(fCurrent);
    }
    
    // TODO : check next frame
    // if (this._hasNextFrame(fCurrent))
    this._playNextFrame(mStart, mPassed);
  };
  
  wp._getFrameAtMills = function(mPassed) {
    var fPassed = mPassed / this._mPerFrame;
    return Math.floor(fPassed);
  };  
  
  wp._getMillsToNextFrame = function (mPassed) {
    var mExcess = mPassed % this._mPerFrame,
      mToNext = this._mPerFrame - mExcess;
    
    return mToNext;
  };
  
  wp._runCallbacks = function (fCurrent, context) {
    var objs = this._callbackObjects;
      
    for (var i = 0, obj = null; obj = objs[i]; i++) {
      obj.handler.call(obj.context, fCurrent);
    };
  };
  
  wp._playNextFrame = function (mStart, mPassed) {
    clearTimeout(this._timer);
    
    var mToNext = this._getMillsToNextFrame(mPassed),
      self = this;
      
    this._timer = setTimeout(function () {
      self._playFrame(mStart);
    }, mToNext);
  };
  
  wp.stop = function () {
    clearTimeout(this._timer);
    this._timer = null;
    this._fCurrent = -1;
  };
  
  
  
  /**
   * Register a handler that runs on every frame
   * @param {function(currentFrame)} callback function
   * @param {object} context
   */
  wp.on = function (callback, context) {
    this._callbackObjects.push({
      handler : callback,
      context : context || this
    });
  };
  
  // TODO : add key for animating
  wp.key = function (frame, status, easing) {
    
  };
  
  
  // TODO : seperate timer from wind core.
  var Timer = function () {
    this._timer = null;
  };
  
  
  
  
  
  
  /**
   * export Wind
   */
  window.Wind = function (options) {
    return new Wind(options || {});
  };
  
}());