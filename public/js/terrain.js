/*
 * Code for generating terrain in javascript
 * Requires three.js
 */

function terrain(vShader, fShader) {

  this.model = null;

  // Generate the geometry and set the height data
  // Something wrong with plane geometries and shaders for some weird fucking
  // reason.  Have a hacky idea.
  // First, create a temporary plane geometry and set it's vertex data
  // according to the height generation algorithm.
  var terraTempGeo = new THREE.PlaneGeometry(750, 750, 75, 75);
  var height_data = genHeight(75, 75, 10);
  for(var i = 0; i < terraTempGeo.vertices.length; i ++) {
    terraTempGeo.vertices[i].z = height_data[i];
  }

  // Using this vertex data, create a new base geometry, and create entirely
  // new vertexes with the same positional data as the geometry above
  var terraGeo = new THREE.Geometry();
  for(var i = 0; i < terraTempGeo.vertices.length; i ++) {
    terraGeo.vertices.push(new THREE.Vector3(
      terraTempGeo.vertices[i].x,
      terraTempGeo.vertices[i].y,
      terraTempGeo.vertices[i].z
    ));
  }
  for(var i = 0; i < terraTempGeo.faces.length; i ++) {
    terraGeo.faces.push(new THREE.Face3(
      terraTempGeo.faces[i].a,
      terraTempGeo.faces[i].b,
      terraTempGeo.faces[i].c
    ));
  }

  this.geometry = terraGeo;
  this.geometry.computeFaceNormals();
  var terra_wires = new THREE.MeshBasicMaterial({wireframe: true,
    wireframeLinewidth: 4, color: 0x303030});

  var terra_mat = new THREE.MeshBasicMaterial({
    color: 0x00688B
  });
  var materials = [terra_wires, terra_mat];
  var terra = new THREE.SceneUtils.createMultiMaterialObject(terraGeo, materials);
  console.log(terra);
  terra.rotation.x = -(Math.PI * .50);
  terra.position.x = 375;
  terra.position.z = 375;

  this.model = terra;

  // Function is a little tricky, but basically, the height of the current point
  // is a function of the adjacent points plus some acceptable range of change

}

function genHeight(width, length, height_range) {
  var size = width * length,
    data = new Float32Array(size),

  // The actualy number of Vertices Per Row.  Always width + 1.  Can't
  // overstate how much of a headache this was.
    vpr = width + 1,

  // Random Within Range.  The random Number within the range specified by
  // height range
    rwr,

    lower_offset = (height_range / 2),

  // counter vars
    i;

  for (i = 0; i < size; i ++) {

    rwr = ((Math.random() * height_range) - lower_offset);
    // If it's the first data point, just initialize it with something random
    if(i == 0) {
      data[i] = rwr;
    }
    // If it's the initial row, use only previous data point
    else if(i <= width) {
      data[i] = data[i-1] + rwr;
    }

    // This part is tricky as hell.  For instance, if it's a "starting vertice"
    // i.e. vertice divisible by vpr, then make it's height val the
    // average of it's adjacent two points + the random number
    else if(i % vpr == 0) {
      data[i] = twoPointAverage(i, data, vpr) + rwr;
    }
    // Another edge case, those at the end of the row.  You can spot these if
    // their index modulo vpr == vpr - 1.  Their height values involve that of
    // the average of the three adjacant points plus a value within the height
    // range
    else if(i % vpr == (vpr -1)) {
      data[i] = threePointAverage(i, data, vpr) + rwr;
    }
    // Finally, the default case, those vertices in the middle.  In this case
    // you need to calculate a four point average of the adjacent points
    else {
      data[i] = fourPointAverage(i, data, vpr) + rwr;
    }
  }
  return data;
}

function twoPointAverage (i, dataArray, vpr) {
  return (dataArray[i -vpr] + dataArray[i - vpr + 1]) / 2;
}

function threePointAverage (i, dataArray, vpr) {
  return (dataArray[i - 1] + dataArray[i - vpr] + dataArray[i - vpr - 1]) / 3;
}

function fourPointAverage (i, dataArray, vpr) {
  return (dataArray[i - 1] + dataArray[i - vpr] + dataArray[i - vpr - 1] +
    dataArray[i - vpr + 1]) / 4;
}
