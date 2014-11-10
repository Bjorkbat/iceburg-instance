/*
 * Source code for tetrademons, a flying diamond-shaped monster that basically
 * just zooms towards the player as fast as it can, loosing the ability to
 * turn as a consequence of speed.  Collisions are unlikely unless player gets
 * swarmed
 */

function tetrademon(pos) {

  this.model;

  //var tetraGeo = new THREE.SphereGeometry(10);
  // TODO: Make the model shaped like an actual tetrahedron
  var tetraGeo = new THREE.Geometry();
  tetraGeo.vertices.push(
    new THREE.Vector3(5, 0, 0),
    new THREE.Vector3(-5, 0, 0),
    new THREE.Vector3(0, 0, 5),
    new THREE.Vector3(0, 0, -5),
    new THREE.Vector3(0, 5, 0),
    new THREE.Vector3(0, -5, 0)
  );
  tetraGeo.faces.push(
    // top
    new THREE.Face3(2, 0, 4),
    new THREE.Face3(0, 3, 4),
    new THREE.Face3(3, 1, 4),
    new THREE.Face3(1, 2, 4),
    // bottom
    new THREE.Face3(2, 0, 5),
    new THREE.Face3(0, 3, 5),
    new THREE.Face3(3, 1, 5),
    new THREE.Face3(1, 2, 5)
  );
  tetraGeo.mergeVertices();
  tetraGeo.computeFaceNormals();
  tetraGeo.computeBoundingSphere();
  
  var tetraMat = new THREE.MeshLambertMaterial({
    color: 0xAE2828,
    shading: THREE.FlatShading,
    side: THREE.DoubleSide
  });
  var tetrademon = new THREE.Mesh(tetraGeo, tetraMat);
  this.model = tetrademon;

  // If the position argument is supplied, set the tetrademon to that position
  // Otherwise
  if(pos != undefined) {
    this.model.translateX(pos.x);
    this.model.translateY(pos.y);
    this.model.translateZ(pos.z);
  }

  var velocity = new THREE.Vector3(0, 0, 0);
  var acceleration = new THREE.Vector3();

  var direction = new THREE.Vector3();
  var currentPosVect = new THREE.Vector3();

  var MAX_VELOCITY = 1.5;
  var MAX_ACCELERATION = 1.25;
  var MIN_ACCELERATION = 0.25;

  // Update function requires both delta between last function call, and a
  // Object3D representing the player's avatar
  this.update = function(delta, player) {

    // Tetrademons are constantly accelerating towards the player, so subtract
    // the player object's position from the tetrademon's position to get a
    // direction
    direction.setFromMatrixPosition(player.matrixWorld);
    currentPosVect.setFromMatrixPosition(this.model.matrixWorld);
    direction.sub(currentPosVect);

    // With direction being a vector representing diff between demon and player,
    // normalize it to get an appropriate acceleration vector
    acceleration = direction.clone();
    acceleration.normalize();
    acceleration.multiplyScalar(2 / (velocity.length() || 1));

    if(acceleration.length() >= MAX_ACCELERATION) {
      acceleration.normalize();
      acceleration.multiplyScalar(MAX_ACCELERATION);
    } else if(acceleration.length() <= MIN_ACCELERATION) {
      acceleration.normalize();
      acceleration.multiplyScalar(MIN_ACCELERATION);
    }

    // Now add this value to velocity, keeping in mind the MAX_MAGNITUDE
    velocity.add(acceleration);
    if(velocity.length() >= MAX_VELOCITY) {
      velocity.normalize();
      velocity.multiplyScalar(MAX_VELOCITY);
    }

    // Using the velocity vector, translate the model's position in space,
    // multiplying by the velocity and the amount of time that's passed.
    this.model.translateX(velocity.x);
    this.model.translateY(velocity.y);
    // The model is never allowed to go below the terrain.  Use the x and z
    // position to determine where the model is with respect to the terrain, and
    // ensure that it's at least 10 units above the closest vertice
    currentPosVect.setFromMatrixPosition(this.model.matrixWorld);
    var vIndex = Math.round(currentPosVect.x / 10) +
                 Math.round(currentPosVect.z / 10) * 75 +
                 Math.round(currentPosVect.z / 10);
    // The terrain geometry is defined globally, so we can reference it as such
    // rather than pass it in as an argument to the update method
    if(vIndex < 0 || vIndex > terra.geometry.vertices.length) {
      vIndex = 0;
    }
    // The terrain is rotated 90 degrees on the x axis, so you'll need to
    // rotate the terrainVertex by 90 degrees in order for the math to be
    // correct
    var terrainVertex = terra.geometry.vertices[vIndex].clone();
    var vectDelta = currentPosVect.sub(terrainVertex.applyAxisAngle(
      new THREE.Vector3(1, 0, 0),
      -Math.PI * .50
    ));
    if(vectDelta.y < 10) {
      this.model.translateY(10 - vectDelta.y);
    }
    this.model.translateZ(velocity.z);
  }
}
