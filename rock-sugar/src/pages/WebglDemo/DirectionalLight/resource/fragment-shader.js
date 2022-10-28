export default
`
precision mediump float;
varying vec3 v_normal;
uniform vec3 u_reverseLightDirection;
varying vec4 v_color;
void main() {
    vec3 normal = normalize(v_normal);
    float light = dot(normal, u_reverseLightDirection);
    gl_FragColor = v_color;
    gl_FragColor.rgb *= light;
}
`