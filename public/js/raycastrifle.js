/*
 * A simple rifle for the iceburg game.  Shoots bolts of light at thine enemies
 *
 * Requires three.js and pointerlockcontrols.js to function properly
 *
 * by Bjorkbat
 */

function RaycastRifle() {

  this.model = new THREE.Object3D();
  // array of bolts the rifle has fired
  this.bolts = [];

  var MAX_RANGE = 400;

  // consider this the rifle component of the raycast rifle
  var raycastProjectorGeo = new THREE.BoxGeometry(2, 2, 10);
  var raycastProjectorMat = new THREE.MeshLambertMaterial({
    color: 0xAE2828,
    emissive: 0x8E0808
  });
  var raycastProjector = new THREE.Mesh(raycastProjectorGeo, raycastProjectorMat);

  // this part is the stock of the raycast rifle
  var raycastStockGeo = new THREE.BoxGeometry(1, 1, 5);
  var raycastStockMat = new THREE.MeshLambertMaterial({
    color: 0xFFD327,
    emissive: 0xDFB307
  });
  var raycastStock = new THREE.Mesh(raycastStockGeo, raycastStockMat);

  // Now add the meshes to the model and position them to get the final look
  // and feel
  this.model.add(raycastProjector);
  this.model.add(raycastStock);
  raycastStock.position.set(0, -1.5, 0);

  // Add an effectively invisible object, the directionObject.  The
  // directionObject is placed directly in front of the rifle, and is used
  // to guide objects projecting out of it.  An ever present directional vector
  // wrapped in an Object3D
  var directionObject = new THREE.Object3D();
  this.model.add(directionObject);
  directionObject.position.set(0, 0, -20);

  var caster = new THREE.Raycaster(new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(1, 0, 0), 0, 400);

  // Fires the raycaster.  Sends out an actual ray to check with intersection
  // of objects, and also projects an object representing a bolt
  this.onClick = function() {

    // Step 1: Create the bolt
    var boltGeo = new THREE.BoxGeometry(1, 1, 1);
    var boltMat = new THREE.MeshBasicMaterial({color: 0xFFFFFF});
    var bolt = new THREE.Mesh(boltGeo, boltMat);

    // Step 2: Add it to the scene
    scene.add(bolt);

    // Step 3: Set the global matrix transform such that it's position is
    // identical to the model's position
    bolt.applyMatrix(this.model.matrixWorld);

    // Step 4: Create a new vector representing the directionObject's position
    // in global space, but normalized.  The x, y, and z components of this
    // vector will be used to adjust the bolt's position over time.
    var direction = new THREE.Vector3();
    direction.setFromMatrixPosition(directionObject.matrix);
    direction.normalize();

    var start = new THREE.Vector3();
    start.copy(bolt.position);

    this.bolts.push({bolt: bolt, direction: direction, start: start});

    // Now that you've fired a bolt, fire a raycaster as well that shoots
    // off in the same direction as the bolt.  Check for intersections with
    // enemies, and remove enemies from the scene if necessary
    // Reminder: Get your fucking math straight
    var casterOrigin = new THREE.Vector3().setFromMatrixPosition(this.model.matrixWorld);
    var casterDirection = new THREE.Vector3().setFromMatrixPosition(directionObject.matrixWorld);
    casterDirection.sub(casterOrigin);
    casterDirection.normalize();
    caster.set(casterOrigin, casterDirection);
    
    for(var i = 0; i < creatures.length; i ++) {
      if(caster.intersectObject(creatures[i].model).length > 0) {
        scene.remove(creatures[i].model);
        creatures.splice(i, 1);
        i --;
      }
    }
  }

  // Called on every render update.  In the case of the RaycastRifle, this is
  // used primarily to move the array of bolts in some direction
  this.update = function() {

    var i = 0;

    for(i; i < this.bolts.length; i ++) {
      this.bolts[i].bolt.translateX(this.bolts[i].direction.x * 20);
      this.bolts[i].bolt.translateY(this.bolts[i].direction.y * 20);
      this.bolts[i].bolt.translateZ(this.bolts[i].direction.z * 20);


      if(this.bolts[i].bolt.position.distanceTo(this.bolts[i].start) >= MAX_RANGE) {
        scene.remove(this.bolts[i].bolt);
        this.bolts.splice(i, 1);
        i --;
      } // endif
    } // endfor
  }

}
