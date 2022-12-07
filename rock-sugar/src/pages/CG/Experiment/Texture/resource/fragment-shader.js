export default
`
precision highp float;

varying vec2 v_texcoord;
varying vec4 v_color;

uniform sampler2D diffuseMap;


void main () {

  vec4 diffuseMapColor = texture2D(diffuseMap, v_texcoord);
  vec3 effectiveDiffuse =  diffuseMapColor.rgb * v_color.rgb;

  gl_FragColor = vec4(
      effectiveDiffuse,
      1);
}

`