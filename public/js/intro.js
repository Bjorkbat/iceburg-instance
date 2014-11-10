
// Declare standard vars
var camera,
  scene,
  renderer,
  iceburgGeo,
  iceburgMat,
  iceburgMesh,
  nodeGeo,
  nodeMat,
  nodes,

  lineGeo,
  lineMat,
  line,
  lineGroup = new THREE.Object3D(),

  icoGeo,
  icoPointMat,
  icoPoints,
  stats,

  //counters
  i,
  j,

  //consts
  CONN_LIKELY = 0.0025;

var bezierMat;
var lineCluster = new THREE.Object3D();

function init(vertexShader, fragmentShader) {
  // Instantiate the scene
  scene = new THREE.Scene();

  stats = new Stats();
  stats.setMode(0); // 0: fps, 1: ms

  // Align top-left
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.left = '0px';
  stats.domElement.style.top = '0px';

  document.body.appendChild( stats.domElement );

  // define our bezierMat
  bezierMat = new THREE.ShaderMaterial({
    vertexShader: vertexShader,
    fragmentShader: fragmentShader
  });

  // Add some light
  light = new THREE.DirectionalLight(0xffffff);
  light.position.set(200, 400, 200);
  scene.add(light);

  ambientLight = new THREE.AmbientLight(0x070707);
  scene.add(ambientLight);

  // Declare the camera!
  // IMPORTANT!  Make sure perspecitive is window.innerWidth / window.innerHeight!
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
  camera.position.z = 600;

  // Instantiate renderer, set to same size as the window, and append
  // it to the dom
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);

  document.body.appendChild(renderer.domElement);

  // TODO: Replace icosahedron with custom iceburg geometry
  iceburgGeo = new THREE.IcosahedronGeometry(200, 1);
  iceburgMat = new THREE.MeshLambertMaterial({color: 0x1BAEEF, ambient: 0x1885B5});
  iceburgMesh = new THREE.Mesh(iceburgGeo, iceburgMat);
  scene.add(iceburgMesh);

  // Generate a bunch of points along an icosahedron's vertices
  icoGeo = new THREE.IcosahedronGeometry(256, 3);
  icoPointMat = new THREE.ShaderMaterial({
    vertexShader: vertexShader,
    fragmentShader: fragmentShader
  });
  icoPoints = new THREE.PointCloud(icoGeo, icoPointMat);
  scene.add(icoPoints);

  // Iterate through the vertices and create random bezier connections between
  // them.
  for(i = 0; i < icoGeo.vertices.length; i ++) {
    j = i + 1;
    for(j; j < icoGeo.vertices.length; j ++) {
      if(Math.random() < CONN_LIKELY) {

        // Step 1: Calculate vector cross product and normalize it
        var crossVector = new THREE.Vector3(0, 0, 0);
        crossVector.crossVectors(icoGeo.vertices[i], icoGeo.vertices[j]);
        crossVector.normalize();

        // Step 2: Find angle between vertices
        var angle = icoGeo.vertices[i].angleTo(icoGeo.vertices[j]);

        // Make a copy of the vector indexed at i, then rotate it along the axis
        // of rotation defined by the cross vector at an angle of 1/2 the radians
        // in var angle
        var midVector = new THREE.Vector3(0, 0, 0);
        midVector.copy(icoGeo.vertices[i]);
        midVector.applyAxisAngle(crossVector, (angle/2));

        // Multiply by scalar to move vector past the others
        midVector.multiplyScalar(2);

        // Using this vector, draw a line segement from point i to point j, using
        // a bezier curve function
        bezierCurve(icoGeo.vertices[i], midVector, icoGeo.vertices[j]);
        scene.add(lineCluster);
      }
    }
  }

  // Begin
  animate();
}

function animate() {
  stats.begin();
  requestAnimationFrame(animate);
  iceburgMesh.rotation.y = Date.now() * 0.0002;
  icoPoints.rotation.y = Date.now() * 0.0002;
  lineCluster.rotation.y = Date.now() * 0.0002;
  renderer.render(scene, camera);
  stats.end();
}

function killIntro() {
  document.body.removeChild(renderer.domElement);
}

function bezierCurve(v1, v2, v3) {
  var segments = 12;
  var t_increment = 1 / segments;
  var bezierGeo = new THREE.Geometry();
  var x;
  var y;
  var z;
  var t;
  for(var i = 0; i < segments; i ++ ){
    // Create points and add a new anonymous vector to the geometry
    t = t_increment * i;
    x = bezierSquarePoint(v1.x, v2.x, v3.x, t);
    y = bezierSquarePoint(v1.y, v2.y, v3.y, t);
    z = bezierSquarePoint(v1.z, v2.z, v3.z, t);

    bezierGeo.vertices.push(new THREE.Vector3(x, y, z));
  }
  bezierGeo.vertices.push(v3);
  // Once you've added all the segments, create a line using the geometry and
  // material, then push this to an Object3D containing all the lines
  var line = new THREE.Line(bezierGeo, bezierMat);
  lineCluster.add(line);
}

// Given three coordinates, calculates a new coordinate using a square
// polynomial and t
function bezierSquarePoint(coord1, coord2, coord3, t) {
  return coord1 * Math.pow(1-t, 2) +
         coord2 * 2 * (1-t) * t +
         coord3 * Math.pow(t, 2);
};
