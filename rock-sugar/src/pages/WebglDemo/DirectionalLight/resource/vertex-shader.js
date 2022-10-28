export default
`
attribute vec4 a_position;
attribute vec4 a_color;
attribute vec3 a_normal;
uniform mat4 u_worldViewProjection;
uniform mat4 u_worldInverseTranspose;
varying vec3 v_normal;
varying vec4 v_color;
void main() {
    gl_Position = u_worldViewProjection * a_position;
    v_normal = mat3(u_worldInverseTranspose) * a_normal;
    v_color = a_color;
}
`