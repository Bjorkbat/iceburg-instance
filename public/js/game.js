var camera,
	scene,
	controls;

var tick = 0;
var sparkArray = [];

var terra;

var ico_geo;
var ico_mat;
var ico_wire;
var ico_materials;
var ico;

var clock;

var sparkGeo;
var sparkMaterial;

var creatures = [];

var stats;

// Make the Pointer Lock happen
function initPointerLock() {
  var havePointerLock = 'pointerLockElement' in document ||
  	'mozPointerLockElement' in document ||
  	'webkitPointerLockElement' in document;

  if(havePointerLock) {

  	var element = document.body;

  	var pointerLockChange = function(event) {

  			if ( document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element ) {
  				controls.enabled = true;
  				console.log(controls.enabled);
  			}
  			else {
  				controls.enabled = false;
  			}
  	}

  	document.addEventListener('pointerlockchange', pointerLockChange, false);
  	document.addEventListener('mozpointerlockchange', pointerLockChange, false);
  	document.addEventListener('webkitpointerlockchange', pointerLockChange, false);

  	document.addEventListener('click', function(event) {

  		element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;

  		if ( /Firefox/i.test( navigator.userAgent ) ) {

  			var fullscreenchange = function ( event ) {

  				if ( document.fullscreenElement === element || document.mozFullscreenElement === element || document.mozFullScreenElement === element ) {

  					document.removeEventListener( 'fullscreenchange', fullscreenchange );
  					document.removeEventListener( 'mozfullscreenchange', fullscreenchange );

  					element.requestPointerLock();

  				}

  			}

  			document.addEventListener( 'fullscreenchange', fullscreenchange, false );
  			document.addEventListener( 'mozfullscreenchange', fullscreenchange, false );

  			element.requestFullscreen = element.requestFullscreen || element.mozRequestFullscreen || element.mozRequestFullScreen || element.webkitRequestFullscreen;

  			element.requestFullscreen();

  		} else {

  		element.requestPointerLock();

  		}
  	});
  }
  else {
  	// In this case, the browser apparently doesn't support PointerLock.  At the
  	// moment, I don't really give two shits about this scenario, more important
  	// things to do.
  }
}
function assignVertexes(v, f) {
	terraVertex = v;
	terraFragment = f;
}

function startGame() {
  // init PointerLock
  initPointerLock();

	stats = new Stats();
	stats.setMode(0); // 0: fps, 1: ms

	// Align top-left
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.left = '0px';
	stats.domElement.style.top = '0px';

	document.body.appendChild( stats.domElement );

  // create the scene and setup the camera
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth/ window.innerHeight,
  	0.1, 500);

  // add first-person style controls for the camera
  controls = new THREE.PointerLockControls(camera);
  scene.add(controls.getObject());

  // create a clock
  clock = new THREE.Clock(true);

  // Add the light
  var light = new THREE.DirectionalLight(0xffffff);
  light.position.set(0, 200, 100);
  scene.add(light);

  // Add ambient light
  var ambientLight = new THREE.AmbientLight(0x111111);
  scene.add(ambientLight);

  // set up the renderer and attach it to the dom
  renderer = new THREE.WebGLRenderer();
  // Think of the setClearColor as the color of the sky.  If nothing's on the
  // screen, bam, here we go, off-black color
  renderer.setClearColor(0x1B1B2B, 0);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // create the terrain, rotate it such that it's parallel with the y axis,
  // and add it to the scene
	terra = new terrain(terraVertex, terraFragment);
	scene.add(terra.model);

  // add variation to the terrain
  // I should point out that it's the gen_height function that generates the
  // actual values, and the for loop below that actually sets them.
	/*
	*/

	// Add bushes
	for(var i = 0; i < terra.geometry.vertices.length; i ++) {
		if(Math.random() < 0.005) {
			var bush = new FractalBush(Math.round(Math.random() * 3) + 2, 7);
			bush.model.position.x = terra.geometry.vertices[i].x + 375;
			bush.model.position.y = terra.geometry.vertices[i].z;
			bush.model.position.z = -(terra.geometry.vertices[i].y) + 375;

			scene.add(bush.model);
		}
	}

	// Add trees
	for(var i = 0; i < terra.geometry.vertices.length; i ++) {
		if(Math.random() < 0.0025) {
			var tree = new FractalTree(Math.round(Math.random() * 3) + 2, 21);
			tree.model.position.x = terra.geometry.vertices[i].x + 375;
			tree.model.position.y = terra.geometry.vertices[i].z + 21 / 2;
			tree.model.position.z = -(terra.geometry.vertices[i].y) + 375;

			scene.add(tree.model);
		}
	}

	// Add enemies.  Start by retrieving enemy data from server
	$.ajax({
		url: '/assets/creatures',
		async: false,
		success: function(data) {
			data = JSON.parse(data);
			var x;
			var z;
			var creature;
			for(var i = 0; i < data.Creatures.length; i ++) {
				// In the future I'll create a dict to handle this.  For now there's
				// only one creature, so it's pretty simple
				for(var j = 0; j < data.Creatures[i].Count; j ++) {
					// Let's make this fun.  Make the tetrademon show up randomly near
					// the edges
					// In each case either the x or the z is at a min or max.  Use a
					// 50 / 50 random var to determine which is the extreme
					if(Math.random() <= 0.5) {
						x = Math.round(Math.random()) * 750 - 375;
						z = Math.random() * 750 - 375;
					} else {
						x = Math.random() * 750 - 375;
						z = Math.round(Math.random()) * 750 - 735;
					}
					creature = new tetrademon(new THREE.Vector3(x, 20, z))
					creatures.push(creature);
					scene.add(creature.model);
				} // endfor
			} // endfor
		} // end success
	});

	/*
	creatures.push(new tetrademon(new THREE.Vector3(100, 20, 100)));
	scene.add(creatures[0].model);
	*/

  window.addEventListener('resize', onWindowResize, false);

	// add a gun to the game, which we'll call a raycaster
	var raycaster = new RaycastRifle();

	controls.addHandheld(raycaster);

  render();
}

// Basically, if the window resizes, just make sure you change the camera
// perspective and renderer so that everything resizes okay
function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize(window.innerWidth, window.innerHeight);
}

function render() {
	stats.begin();
	tick ++;
	requestAnimationFrame(render);
	var cam_position = new THREE.Vector3();
	cam_position = controls.getObject().position;

	var index = Math.round(cam_position.x / 10) + (Math.round(cam_position.z / 10) * 75) + Math.round(cam_position.z / 10);
	if(index < 0 || index > terra.geometry.vertices.length) { index = 0 ;}

	var vheight = terra.geometry.vertices[index].z;
	var diff = (controls.getObjectHeight() - 10) - vheight;
	var change_val;
	if(diff > 1) {
		change_val = -0.2 * diff;
	}
	if(diff < -1) {
		change_val = 0.2 * -diff;
	}

	controls.update(clock.getDelta(), change_val);
	for(var i = 0; i < creatures.length; i++) {
		creatures[i].update(clock.getDelta(), controls.getObject());
	}

	renderer.render(scene, camera);
	stats.end();
}
