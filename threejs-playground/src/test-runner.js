(function() {
  'use strict';

  var TestRunner = function(container) {
    var self = this;

    var lastAnimationTime,
    FPS = 60;
    var currentWork;

    function doTick(work) {
      if(!work.running) return;
      var test = work.test;
      //console.debug("Tick in", work.test.name);

      var requestNewFrame = window.requestAnimationFrame.bind(window, doTick.bind(this, work));
      if(FPS >= 60) {
        requestNewFrame();
      } else {
          setTimeout(requestNewFrame, 1000.0/FPS);
      }

      var currentTime = new Date().getTime(), dt = currentTime - lastAnimationTime;
      if(dt > 3000) {
        console.warn("Extreme time diff (", dt, "ms), cropping to 3000 ms")
        dt = 3000;
      }
      test.runAnimationLogic(dt);
      lastAnimationTime = currentTime;
    }

    self.start = function start(test, fps) {
      self.stop();
      currentWork = {running: true, test: test};
      container.appendChild(test.canvas);
      test.runSetupLogic(container);
      FPS = Math.max(0.34, Math.min(fps, 60));
      if(fps > 60 || fps < 0.34) {
        console.warn("FPS must be between 0.34 and 60.", fps, "was capped to", FPS);
      }

      console.info("Starting", test.name, "with", FPS, "frames per second");
      lastAnimationTime = new Date().getTime();
      doTick(currentWork); //Start the loop
    }
    self.stop = function() {
      if(currentWork) {
        var test = currentWork.test;
        currentWork.running = false;
        console.info("Stopping", test.name);
        container.removeChild(test.canvas);
      }
    }
  }

  var _ = require('lodash/core');
  TestRunner.makeTest = function(test) {
    var canvas = document.createElement("canvas");
    return {
      name: test.name,
      canvas: canvas,
      runSetupLogic: _.once(function() {
        console.info("Initializing", test.name, "on", canvas);
        test.setupLogic(canvas);
      }),
      runAnimationLogic: test.animationLogic
    }
  }

  module.exports = TestRunner;
})();
