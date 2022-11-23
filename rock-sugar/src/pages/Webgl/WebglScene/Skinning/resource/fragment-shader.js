export default
`
precision mediump float;

varying vec3 v_normal;

uniform vec4 u_diffuse;
uniform vec3 u_lightDirection;

void main () {
  vec3 normal = normalize(v_normal);
  float light = dot(u_lightDirection, normal) * .5 + .5;
  // gl_FragColor = vec4(u_diffuse.rgb , u_diffuse.a);

  // for debugging .. see article
  gl_FragColor = vec4(1, 0, 0, 1);
  gl_FragColor = vec4(v_normal * .5 + .5, 1);
}

`

