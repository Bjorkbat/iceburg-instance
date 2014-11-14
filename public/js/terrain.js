/*
 * Code for generating terrain in javascript
 * Requires three.js
 */

function terrain(vShader, fShader) {

  this.model = null;
  this.geometry = null;

  // Create a plane geometry with a specific number of segments.  Set here, but
  // will create model in app to store segments inside
  var terraGeo = new THREE.PlaneGeometry(750, 750, 75, 75);

  // Retrieve the JSON data for the terrain from the server
  $.ajax({
    url: '/assets/terrain',
    async: false,
    success: function(data) {
      data = JSON.parse(data);
      for(var i = 0; i < terraGeo.vertices.length; i ++) {
        terraGeo.vertices[i].z = data.HeightVals[i].Height;
      }
    }
  });

  var terra_wires = new THREE.MeshBasicMaterial({wireframe: true,
    wireframeLinewidth: 4, color: 0x303030});
  var terra_mat = new THREE.MeshBasicMaterial({
    color: 0x00688B
  });

  var materials = [terra_wires, terra_mat];
  var terra = new THREE.SceneUtils.createMultiMaterialObject(terraGeo, materials);

  terra.rotation.x = -(Math.PI * .50);
  terra.position.x = 375;
  terra.position.z = 375;

  this.model = terra;
  this.geometry = terraGeo;

  // Function is a little tricky, but basically, the height of the current point
  // is a function of the adjacent points plus some acceptable range of change

}
