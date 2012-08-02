/**
 * Wind.js - Javascript Keyframe Animation Framework
 * Copyright 2012 Ohgyun Ahn
 * MIT Licensed 
 */
 
  
/*
 * [prefix]
 * - m : milliseconds
 * - f : frame
 */
(function (glob) {
  
  var WindFactory = glob.Wind = function (options) {
    return new Wind(options || {});
  };

  WindFactory.version = '0.1-dev';
  WindFactory.api = 'http://windjs.com/api/';
  WindFactory.repository = 'https://github.com/ohgyun/wind/';
  WindFactory.toString = function () {
    return [
      'Wind.js - Javascript Keyframe Animation Library',
      '- Version: ' + this.version,
      '- API: ' + this.api,
      '- Repository: ' + this.repository
    ].join('\n');
  };
  
  var Wind = function (options) {
      
      options = {
        fps: options.fps || 30,
        startFrame: options.startFrame || 0,
        endFrame: options.endFrame || 300,
        loop: options.loop || false
      };    
    
      this._loop = options.loop;
  
      this._timer = new Timer();
      this._handlers = new Handlers();
      this._frameManager = new FrameManager(options);
    },
    
    wp = Wind.prototype;
    
  wp.play = function () {
    this._timer.clear();
    this._frameManager.start();
    
    this.playFrame();
  };

  /**
   * Play the frame that matched at passed time.
   */ 
  wp.playFrame = function () {
    var fCurrent = this._frameManager.getFrameAtCurrentTime();
    
    if (this._frameManager.isValidFrame(fCurrent)) {
      this.goTo(fCurrent);
    }
    
    if (this._frameManager.hasNextFrame(fCurrent)) {
      this.playNextFrame(fCurrent);
      return;
    };
    
    if (this._loop) {
      this.play(); 
    }
  };
  
  wp.goTo = function (fCurrent) {
    this._handlers.run(fCurrent);
  };
  
  wp.playNextFrame = function (fCurrent) {
    var mToNext = this._frameManager.getMillsToNextFrame(fCurrent);
    this._timer.delay(mToNext, this.playFrame, this);
  };
  
  wp.stop = function () {
    this._timer.clear();
  };
  
  /**
   * Register a handler that runs on every frame
   * @param {function(currentFrame)} callback function
   * @param {object} context
   */
  wp.every = function (callback, context) {
    this._handlers.add(callback, context);
  };
  
  // TODO : add key for animating
  wp.key = function (frame, status, easing) {
    
  };
  
  
  /**
   * Timer
   */
  var Timer = function () {
      this._t = null;
    },
    tp = Timer.prototype;
    
  tp.clear = function () {
    clearTimeout(this._t);
    this._t = null;
  };
  
  tp.delay = function (mDelay, callback, context) {
    this.clear();
    this._t = setTimeout(function () {
      callback.call(context); 
    }, mDelay);
  };
  
  
  /**
   * Frame Manager
   */
  var FrameManager = function (options) {
      this._fStart = options.startFrame;
      this._fEnd = options.endFrame;
      
      this._mpf = (1000 / options.fps) || 1; // mills per frame
      this._mStart = 0;
    },
    fmp = FrameManager.prototype;
    
  fmp.start = function (fStart) {
    fStart = fStart || this._fStart;
    
    var mNow = new Date().getTime(),
      mPassed = fStart * this._mpf;
      
    this._mStart = mNow - mPassed;
  };
  
  fmp.getFrameAtCurrentTime = function () {
    var fPassed = this.getMillsPassed() / this._mpf;
    return Math.floor(fPassed);
  };
  
  fmp.getMillsPassed = function () {
    var mCurrent = new Date().getTime();
    return mCurrent - this._mStart;
  };
  
  fmp.isValidFrame = function (fCurrent) {
    return fCurrent >= this._fStart && fCurrent <= this._fEnd;
  };
  
  fmp.hasNextFrame = function (fCurrent) {
    return this._fEnd > fCurrent;
  };
  
  fmp.getMillsToNextFrame = function (fCurrent) {
    var mThisBlockExecution = 1,
      mExcess = (this.getMillsPassed() % this._mpf) - mThisBlockExecution,
      mThreshold = this._mpf * 2/3;
        
    // jump the frame if excess time is bigger than threshold
    if (mExcess > mThreshold) {
      return this._mpf + (this._mpf - mExcess);   
      
    } else {
      return this._mpf - mExcess;
    }
  };
  
  
  
  /**
   * Callback Handlers
   */
  var Handlers = function () {
    this._objs = [];
  };
  
  Handlers.prototype.run = function () {
    for (var i = 0, obj; obj = this._objs[i]; i++) {
      obj.handler.apply(obj.context, arguments);
    };
  };
  
  Handlers.prototype.add = function (handler, context) {
    this._objs.push({
      handler: handler,
      context: context
    });
  };
  
 
  
}(this));

