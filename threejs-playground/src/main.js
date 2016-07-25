document.addEventListener( 'DOMContentLoaded', function() {

  var TestRunner = require("./test-runner");
  var starsTest = TestRunner.makeTest(require("./tests/stars"));
  var cubesTest = TestRunner.makeTest(require("./tests/cubes"));
  var testRunner = new TestRunner(window.document.body);

  window.startStars = function() {
    testRunner.start(starsTest, 30);
  }
  window.startCubes = function() {
    testRunner.start(cubesTest, 60);
  }

  //Stars are nice..
  window.startStars();

}, false );
