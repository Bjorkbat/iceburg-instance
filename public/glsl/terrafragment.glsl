#ifdef GL_ES
precision highp float;
#endif

varying vec3 vNormal;

void main() {
  vec3 light = vec3(0, 2, 1);
  light = normalize(light);

  float dProd = max(0.0, dot(vNormal, light));

  gl_FragColor = vec4(0, (float(104) / float(256) * dProd), (float(139) / float(256) * dProd), 1.0);
}
