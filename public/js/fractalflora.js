/*
 * Little bit of js code for adding fractal bushes to the game.
 *
 * Pretty much the same, but the distinguishing feature is that they're
 * squatter and composed of lines rather than geometries
 */

function FractalBush(r, l) {

  this.model = new THREE.Object3D();

  // Used to determine the local position and rotation of a new set of lines
  // Note: rotation is to be expressed as a percentage of 180 degrees.  i.e.
  // 45 degrees = 180 / 45 = 0.25
  var position = null;
  var rotation = Math.PI * 0.25;

  var currentLength = l;
  var lengthFactor = 0.8;

  var branchMat = new THREE.LineBasicMaterial({
    color: 0x64DE98,
    linewidth: 2
  });

  var branchGeo;

  // You'll need three branch objects
  var branch;
  var branchTwo;
  var branchThree;

  var branchCluster;

  // Base case.  If position and rotation are undefined, then create a single
  // line and add it to the model
  branchGeo = new THREE.Geometry();
  branchGeo.vertices.push(
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(0, currentLength, 0)
  )

  branch = new THREE.Line(branchGeo, branchMat);
  this.model.add(branch);
  position = branchGeo.vertices[1].clone();

  // If r is greater than one, then call FractalBush recursively
  if( r > 1 ) {

    var rotationAxisY = new THREE.Vector3(0, 1, 0);
    var rotationAxisX = new THREE.Vector3(1, 0, 0);

    var bush = new FractalBush(r-1, currentLength * lengthFactor);
    this.model.add(bush.model);
    bush.model.position.set(position.x, position.y, position.z);
    bush.model.rotateOnAxis(rotationAxisX, rotation);

    var bushTwo = new FractalBush(r-1, currentLength * lengthFactor);
    this.model.add(bushTwo.model);
    bushTwo.model.position.set(position.x, position.y, position.z);
    bushTwo.model.rotateOnAxis(rotationAxisY, Math.PI * 0.66);
    bushTwo.model.rotateOnAxis(rotationAxisX, rotation);

    var bushThree = new FractalBush(r-1, currentLength * lengthFactor);
    this.model.add(bushThree.model);
    bushThree.model.position.set(position.x, position.y, position.z);
    bushThree.model.rotateOnAxis(rotationAxisY, Math.PI * 1.33 );
    bushThree.model.rotateOnAxis(rotationAxisX, rotation);

  } // endelse
}

function FractalTree(r, l) {

  this.model = new THREE.Object3D();

  // Used to determine the local position and rotation of a new set of lines
  // Note: rotation is to be expressed as a percentage of 180 degrees.  i.e.
  // 45 degrees = 180 / 45 = 0.25
  var position = null;
  var rotation = Math.PI * 0.25;

  var currentLength = l;
  var lengthFactor = 0.8;

  var branchMat = new THREE.MeshLambertMaterial({
    color: 0x1780DE,
    shading: THREE.FlatShading,
    transparent: true,
    opacity: 0.95
  });

  var branchGeo;

  // You'll need three branch objects
  var branch;
  var branchTwo;
  var branchThree;

  var branchCluster;

  // Base case.  If position and rotation are undefined, then create a single
  // line and add it to the model
  branchGeo = new THREE.CylinderGeometry(currentLength / 20, currentLength / 10, currentLength);

  branch = new THREE.Mesh(branchGeo, branchMat);
  this.model.add(branch);
  position = this.model.position;

  // If r is greater than one, then call FractalBush recursively
  if( r > 1 ) {

    var rotationAxisY = new THREE.Vector3(0, 1, 0);
    var rotationAxisX = new THREE.Vector3(1, 0, 0);

    var bush = new FractalTree(r-1, currentLength * lengthFactor);
    this.model.add(bush.model);
    bush.model.position.set(position.x, position.y + currentLength / 2, position.z);
    bush.model.rotateOnAxis(rotationAxisX, rotation);
    bush.model.translateOnAxis(bush.model.up, currentLength / 2);

    var bushTwo = new FractalTree(r-1, currentLength * lengthFactor);
    this.model.add(bushTwo.model);
    bushTwo.model.position.set(position.x, position.y + currentLength / 2, position.z);
    bushTwo.model.rotateOnAxis(rotationAxisY, Math.PI * 0.66);
    bushTwo.model.rotateOnAxis(rotationAxisX, rotation);
    bushTwo.model.translateOnAxis(bushTwo.model.up, currentLength / 2);

    var bushThree = new FractalTree(r-1, currentLength * lengthFactor);
    this.model.add(bushThree.model);
    bushThree.model.position.set(position.x, position.y + currentLength / 2, position.z);
    bushThree.model.rotateOnAxis(rotationAxisY, Math.PI * 1.33 );
    bushThree.model.rotateOnAxis(rotationAxisX, rotation);
    bushThree.model.translateOnAxis(bushThree.model.up, currentLength / 2);

  } // endelse
}
