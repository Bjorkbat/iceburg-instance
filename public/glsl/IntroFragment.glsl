
varying vec4 vColor;

void main() {

  // Set the fragment's color to whatever the vector's position is in space,
  // which is used to set vColor;
  gl_FragColor = vColor;
}
