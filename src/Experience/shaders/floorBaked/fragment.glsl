uniform sampler2D uAlphaMask;
uniform vec3 uColor;

varying vec2 vUv;

void main()
{
    float alpha = 1.0 - texture2D(uAlphaMask, vUv).r;
    gl_FragColor = vec4(uColor, alpha);
}