export default
`
attribute vec4 a_position;
attribute vec2 a_texcoord;


uniform mat4 u_worldViewProjection;
varying vec2 v_texcoord;

void main() {
  gl_Position = u_worldViewProjection * a_position;
  v_texcoord = a_texcoord;
}
`