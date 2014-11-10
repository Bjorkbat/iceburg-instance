#ifdef GL_ES
precision highp float;
#endif

varying vec4 vColor;

void main() {

  // Define vColor as the position of the vector in space
  float r = position.x / float(256);
  r = max(-r, r);

  float g = position.y / float(256);
  g = max(-g, g);

  float b = position.z / float(256);
  b = max(-b, b);

  vColor = vec4(r, g, b, 1.0);
  gl_PointSize = 2.0;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
