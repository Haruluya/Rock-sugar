export default
`
precision highp float;

uniform vec2 iResolution;
uniform vec2 iMouse;
uniform float iTime;

#define pi 3.1415926

float T;

vec2 hash( vec2 p ) { p=vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3))); return fract(sin(p)*18.5453); }
vec4 min(vec4 a, vec4 b,vec4 c) {return (vec4(1.0)-c)*a+c*b;}


float simplegridnoise(vec2 v)
{
    float s = 1. / 256.;
    vec2 fl = floor(v), fr = fract(v);
    float mindist = 1e9;
    for(int y = -1; y <= 1; y++)
        for(int x = -1; x <= 1; x++)
        {
            vec2 offset = vec2(x, y);
            vec2 pos = .5 + .5 * cos(2. * pi * (T*.1 + hash(fl+offset)) + vec2(0,1.6));
            mindist = min(mindist, length(pos+offset -fr));
        }
    
    return mindist;
}

float blobnoise(vec2 v, float s)
{
    return pow(.5 + .5 * cos(pi * clamp(simplegridnoise(v)*2., 0., 1.)), s);
}

float fractalblobnoise(vec2 v, float s)
{
    float val = 0.;
    const float n = 4.;
    for(float i = 0.; i < n; i++)
        //val += 1.0 / (i + 1.0) * blobnoise((i + 1.0) * v + vec2(0.0, iTime * 1.0), s);
    	val += pow(0.5, i+1.) * blobnoise(exp2(i) * v + vec2(0, T), s);

    return val;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    T = iTime;

    vec2 r = vec2(1.0, iResolution.y / iResolution.x);
	vec2 uv = fragCoord.xy / iResolution.xy;
    float val = fractalblobnoise(r * uv * 20.0, 5.0);
    //float val = fractalblobnoise(r * uv * 40.0, 1.25); // more snowflakes
    //float val = blobnoise(r * uv * 10.0, 5.0);
    //fragColor = vec4(vec3(val), 1.0);
    fragColor = mix(vec4(.0), vec4(1.0), vec4(val));
}
void main() {
    mainImage(gl_FragColor, gl_FragCoord.xy);
}
`