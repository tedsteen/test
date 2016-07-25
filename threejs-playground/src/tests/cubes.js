(function() {
  'use strict';
  // 'To actually be able to display anything with Three.js, we need three things:
  // A scene, a camera, and a renderer so we can render the scene with the camera.'
  // - http://threejs.org/docs/#Manual/Introduction/Creating_a_scene
  var THREE = require("three");
  var THREEx = require("../THREEx.WindowResize");
  var camera, particlesBlocks, scene, renderer, cameraCube, sceneCube, group, shakeAmount;

  module.exports = {
    name: "Cubes",
    setupLogic: function(canvas) {
      var windowHalfX = window.innerWidth / 2;
      var windowHalfY = window.innerHeight / 2;

      camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 10000 );
      cameraCube = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 10000 );

      camera.position.z = -700;
      camera.position.x = 500;
      camera.position.y = -100;

      scene = new THREE.Scene();
      var textureCubeLoader = new THREE.CubeTextureLoader();
      textureCubeLoader.setPath( '/images/textures/cube/bridge/');
      var textureCube = textureCubeLoader.load( [ 'posx.jpg', 'negx.jpg', 'posy.jpg', 'negy.jpg', 'posz.jpg', 'negz.jpg' ] );
      scene.background = textureCube;


      sceneCube = new THREE.Scene();
      var cubeShader = THREE.ShaderLib[ "cube" ];
      var cubeMaterial = new THREE.ShaderMaterial( {
        fragmentShader: cubeShader.fragmentShader,
        vertexShader: cubeShader.vertexShader,
        uniforms: cubeShader.uniforms,
        depthWrite: false,
        side: THREE.BackSide
      } );

      cubeMaterial.uniforms[ "tCube" ].value = textureCube;

      // Skybox
      var cubeMesh = new THREE.Mesh( new THREE.BoxGeometry( 5000, 5000, 5000 ), cubeMaterial );
      sceneCube.add( cubeMesh );



      var material = new THREE.MeshPhongMaterial( { color: 0xaa9944, specular:0xbbaa99, shininess:50, envMap: textureCube, combine: THREE.MultiplyOperation } )
      //material = new THREE.MeshNormalMaterial();
      var size = 3;
      var geometry = new THREE.BoxGeometry( 10*size, 10*size, 10*size );
      //geometry = new THREE.SphereGeometry( 10.0*size, 24, 24 );
      group = new THREE.Group();

      for ( var i = 0; i < 160; i ++ ) {

        var mesh = new THREE.Mesh( geometry, material );
        mesh.position.x = (Math.random() * 200 - 100)*size;
        mesh.position.y = (Math.random() * 200 - 100)*size;
        mesh.position.z = (Math.random() * 200 - 100)*size;

        mesh.rotation.x = (2 - Math.random() * 4) * Math.PI;
        mesh.rotation.y = (2 - Math.random() * 4) * Math.PI;
        mesh.rotation.z = (2 - Math.random() * 4) * Math.PI;

        mesh.matrixAutoUpdate = false;
        mesh.updateMatrix();
        group.add( mesh );
      }

      scene.add( group );

      //Lights
      var ambient = new THREE.AmbientLight( 0x050505 );
      scene.add( ambient );

      var pointLight = new THREE.PointLight( 0xffaa00, 2 );
      pointLight.position.set( 2000, 1200, 10000 );
      scene.add( pointLight );

      var directionalLight = new THREE.DirectionalLight( 0xffffff, 2 );
      directionalLight.position.set( 2, 1.2, 10 ).normalize();
      scene.add( directionalLight );

      directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
      directionalLight.position.set( -2, 1.2, -10 ).normalize();
      scene.add( directionalLight );


      renderer = new THREE.WebGLRenderer({canvas: canvas});
      renderer.autoClear = false;
      renderer.setPixelRatio( window.devicePixelRatio );
      renderer.setSize( window.innerWidth, window.innerHeight );
      renderer.sortObjects = false;

      var mouseX = 0, mouseY = 0;
      function onDocumentMouseMove(event) {
        mouseX = ( event.clientX - windowHalfX ) * 10;
        mouseY = ( event.clientY - windowHalfY ) * 10;
      }
      document.addEventListener( 'mousemove', onDocumentMouseMove, false );
      shakeAmount = 0;
      function onClick(event) {
        shakeAmount = 20;
      }
      document.addEventListener( 'click', onClick, false );

      function onWindowResize() {
        windowHalfX = window.innerWidth / 2;
        windowHalfY = window.innerHeight / 2;

        camera.aspect = window.innerWidth / window.innerHeight;
        cameraCube.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        cameraCube.updateProjectionMatrix();

        renderer.setSize( window.innerWidth, window.innerHeight );
      }
      window.addEventListener( 'resize', onWindowResize, false );
    },
    animationLogic: function(dt) {
      var time = Date.now() * 0.001;
      shakeAmount *= 0.91;

			var rx = Math.sin( time * 0.7 ) * 0.5,
  				ry = Math.sin( time * 0.3 ) * 0.5,
  				rz = Math.sin( time * 0.2 ) * 0.5;

			group.rotation.x = rx;
			group.rotation.y = ry;
			group.rotation.z = rz;
      for (var i = 0; i < group.children.length; i++) {
        var mesh = group.children[i];
        mesh.rotation.x = mesh.position.x*0.01; //*= 0.98;
        mesh.rotation.y = mesh.position.y*0.01; //*= 0.98;
        mesh.rotation.z = mesh.position.z*0.01; //*= 0.98;
        mesh.updateMatrix();
      }
      var lookAtPosition = scene.position.clone();

      lookAtPosition.x += Math.sin(time*300)*shakeAmount;
      lookAtPosition.y += Math.cos(time*280)*shakeAmount;
      lookAtPosition.z += Math.sin(time*280)*shakeAmount;

      cameraCube.rotation.copy(camera.rotation);
      cameraCube.position.copy(camera.position);
      camera.lookAt( lookAtPosition );
      cameraCube.lookAt( lookAtPosition );

			renderer.render( sceneCube, cameraCube );
      renderer.render( scene, camera );
    }
  };
})();
