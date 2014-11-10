#ifdef GL_ES
precision highp float;
#endif

varying vec3 vNormal;

void main() {

  vNormal = normal;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
