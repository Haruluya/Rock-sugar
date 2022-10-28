export default
`
precision mediump float;
varying vec3 v_normal;
varying vec3 v_surfaceToLight;
varying vec3 v_surfaceToView;

varying vec4 v_color;
uniform float u_shininess;
uniform vec3 u_lightDirection;
uniform float u_innerLimit;          // in dot space
uniform float u_outerLimit;          // in dot space
void main() {
    vec3 normal = normalize(v_normal);
    vec3 surfaceToLightDirection = normalize(v_surfaceToLight);
    vec3 surfaceToViewDirection = normalize(v_surfaceToView);
    vec3 halfVector = normalize(surfaceToLightDirection + surfaceToViewDirection);
    float dotFromDirection = dot(surfaceToLightDirection,
                                -u_lightDirection);
    float inLight = smoothstep(u_outerLimit, u_innerLimit, dotFromDirection);
    float light = inLight * dot(normal, surfaceToLightDirection);
    float specular = inLight * pow(dot(normal, halfVector), u_shininess);

    gl_FragColor = v_color;
    gl_FragColor.rgb *= light;
    gl_FragColor.rgb += specular;
}

`