export default
`
attribute vec4 a_POSITION;
attribute vec3 a_NORMAL;
attribute vec4 a_WEIGHTS_0;
attribute vec4 a_JOINTS_0;

uniform mat4 u_projection;
uniform mat4 u_view;
uniform mat4 u_world;
uniform sampler2D u_jointTexture;
uniform float u_numJoints;

varying vec3 v_normal;

// these offsets assume the texture is 4 pixels across
#define ROW0_U ((0.5 + 0.0) / 4.)
#define ROW1_U ((0.5 + 1.0) / 4.)
#define ROW2_U ((0.5 + 2.0) / 4.)
#define ROW3_U ((0.5 + 3.0) / 4.)

mat4 getBoneMatrix(float jointNdx) {
  float v = (jointNdx + 0.5) / u_numJoints;
  return mat4(
    texture2D(u_jointTexture, vec2(ROW0_U, v)),
    texture2D(u_jointTexture, vec2(ROW1_U, v)),
    texture2D(u_jointTexture, vec2(ROW2_U, v)),
    texture2D(u_jointTexture, vec2(ROW3_U, v)));
}

void main() {
  mat4 skinMatrix = getBoneMatrix(a_JOINTS_0[0]) * a_WEIGHTS_0[0] +
                    getBoneMatrix(a_JOINTS_0[1]) * a_WEIGHTS_0[1] +
                    getBoneMatrix(a_JOINTS_0[2]) * a_WEIGHTS_0[2] +
                    getBoneMatrix(a_JOINTS_0[3]) * a_WEIGHTS_0[3];
  mat4 world = u_world * skinMatrix;
  gl_Position = u_projection * u_view * world * a_POSITION;
  v_normal = mat3(world) * a_NORMAL;

  // for debugging .. see article
  //gl_Position = u_projection * u_view *  a_POSITION;
  //v_normal = a_NORMAL;
  //v_normal = a_WEIGHTS_0.xyz * 2. - 1.;
  //v_normal = a_JOINTS_0.xyz / (u_numJoints - 1.) * 2. - 1.;
}
`
