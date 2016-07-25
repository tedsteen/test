(function() {
  'use strict';
  // 'To actually be able to display anything with Three.js, we need three things:
  // A scene, a camera, and a renderer so we can render the scene with the camera.'
  // - http://threejs.org/docs/#Manual/Introduction/Creating_a_scene
  var THREE = require("three");
  var THREEx = require("../THREEx.WindowResize");
  var camera, particlesBlocks, scene, renderer;

  module.exports = {
    name: "Stars",
    setupLogic: function(canvas) {
      //var HEIGHT = container.innerHeight, WIDTH = container.innerWidth;

      /*fieldOfView — Camera frustum vertical field of view.
      	aspectRatio — Camera frustum aspect ratio.
      	nearPlane — Camera frustum near plane.
      	farPlane — Camera frustum far plane.

      	- http://threejs.org/docs/#Reference/Cameras/PerspectiveCamera

      	In geometry, a frustum (plural: frusta or frustums)
      	is the portion of a solid (normally a cone or pyramid)
      	that lies between two parallel planes cutting it. - wikipedia.		*/
      var fieldOfView = 75, aspectRatio = 1,
      nearPlane = 1, farPlane = 3000;

      camera = new THREE.PerspectiveCamera(fieldOfView, aspectRatio, nearPlane, farPlane);
      camera.position.z = farPlane / 3

      var geometry = new THREE.Geometry();
      var particleCount = 8000;

      for (var i = 0; i < particleCount; i++) {
          geometry.vertices.push(
            new THREE.Vector3(Math.random() * 3000 - 1500, Math.random() * 2000 - 1000, Math.random() * -2000)
          );
      }

      var loader = new THREE.TextureLoader();
      var material = new THREE.PointsMaterial({
        color: 0xFFFFFF,
        size: 6,
        map: loader.load("images/particle.png"),
        blending: THREE.AdditiveBlending,
        transparent: true
      });
      material.depthTest = false;

      var particles = new THREE.Points(geometry, material);
      particles.position.z = 1000;
      var particles2 = new THREE.Points(geometry, material);
      particles2.position.z = -1000;

      scene = new THREE.Scene();

      scene.add(particles2);
      scene.add(particles);

      renderer = new THREE.WebGLRenderer({ canvas: canvas });
      renderer.setPixelRatio(window.devicePixelRatio); /*	Probably 1; unless you're fancy.	*/
      var resizer = THREEx.WindowResize(renderer, camera, canvas);
      resizer.callback();
      //resizer.stop();

      particlesBlocks = [particles, particles2];
    },
    animationLogic: function(dt) {
      var starSpeed = 0.008;
      camera.lookAt(scene.position);

      for(var i = 0; i < particlesBlocks.length; i++) {
        var particles = particlesBlocks[i],
        position = particles.position;
        position.z += starSpeed * dt;
        if(position.z > 3000) {
          position.z = -1000;
        }
        //particles.rotation.z += 0.00001 * dt;
      }

      renderer.render(scene, camera);
    }
  };
})();
