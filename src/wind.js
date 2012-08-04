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
  WindFactory.repository = 'https://github.com/ohgyun/wind/';
  WindFactory.toString = function () {
    return [
      'Wind.js - Javascript Keyframe Animation Library',
      '- Version: ' + this.version,
      '- Repository: ' + this.repository
    ].join('\n');
  };
  
  /**
   * @param {Object} options
   *    fps {number} Frame per seconds (default = 30)
   *    startFrame {number} Start frame value (default = 0)
   *    endFrame {number} End frame value (default = 300)
   *    loop {boolean} Play loop? (default = false)
   *    ensureEndFrame {boolean} Play the end frame even if delayed.
   *                            Only valid at single loop mode. (default = false)
   */
  var Wind = function (options) {
      
      options = {
        fps: options.fps || 30,
        startFrame: options.startFrame || 0,
        endFrame: options.endFrame || 300,
        loop: options.loop || false,
        ensureEndFrame: options.ensureEndFrame || false
      };    
    
      this._timer = new Timer();
      this._handlers = new Handlers();
      this._keyables = new Keyables();
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
    
    this.goTo(fCurrent);
    
    if (this._frameManager.hasNextFrame(fCurrent)) {
      this.playNextFrame(fCurrent);
    };
  };
  
  wp.goTo = function (fCurrent) {
    this._keyables.run(fCurrent);
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

  wp.keyable = function (action, context) {
    var keyable = new Keyable(action, context);
    this._keyables.add(keyable);
    return keyable;
  };
  
  wp.onstart = function (callback, context) {
    this._handlers.onstart(callback, context);
  };
  
  wp.onend = function (callback, context) {
    this._handlers.onend(callback, context);
  };
  
  
  
  /**
   * Group of Keyable Objects
   */
  var Keyables = function () {
    this._keyables = [];
  };
  Keyables.prototype.add = function (keyable) {
    this._keyables.push(keyable);
  };
  Keyables.prototype.run = function (frame) {
    var len = this._keyables.length;
    for (var i = 0; i < len; i++) {
      this._keyables[i].run(frame); 
    }
  };
  
  /**
   * Keyable Object
   */
  var Keyable = function (action, context) {
      this._action = action;
      this._context = context || this;
      this._keys = [];
    },
    kp = Keyable.prototype;
    
  kp.key = function (frame/*, data, data, ... */) {
    var datas = Array.prototype.splice.call(arguments, 1);
    this._keys[frame] = datas;
    return this;
  };
  
  kp.run = function (frame) {
    var datas = this._keys[frame];
    if (datas) {
      this._action.apply(this._context, datas);  
    }
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
      this._isLoop = options.loop;
      this._isEnsureEndFrame = options.ensureEndFrame;
      
      this._mpf = (1000 / options.fps) || 1; // mills per frame
      this._fLength = this._fEnd - this._fStart + 1;
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
    
    if (this._isLoop) {
      fPassed = fPassed % this._fLength;
      
    } else if (this._isEnsureEndFrame) {
      fPassed = fPassed > this._fEnd ? this._fEnd : fPassed; 
    }
    
    return Math.floor(fPassed);
  };
  
  fmp.getMillsPassed = function () {
    var mCurrent = new Date().getTime();
    return mCurrent - this._mStart;
  };
  
  fmp.hasNextFrame = function (fCurrent) {
    return this._isLoop || this._fEnd > fCurrent;
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
    this._onstart = [];
    this._onend = [];
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
  
  Handlers.prototype.onstart = function (handler, context) {
    this._onstart.push({
      handler: handler,
      context: context
    });
  };
  
  Handlers.prototype.onend = function (handler, context) {
    this._onend.push({
      handler: handler,
      context: context
    });
  };
  
 
  
}(this));

