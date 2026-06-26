/**
 * GLSL for the schematic. Nodes are drawn as soft glowing points whose screen
 * size follows perspective and a gentle per-node pulse; brightness fades with
 * depth so the cloud reads three-dimensional. Edges fade with depth too. A
 * per-node highlight term lets the interaction layer light up a hovered node.
 */

export const nodeVertex = /* glsl */ `
  attribute float aSize;
  attribute float aSeed;
  attribute float aIndex;
  uniform float uTime;
  uniform float uPixelRatio;
  uniform float uSize;
  uniform float uHighlight;
  varying float vDepth;
  varying float vCore;
  varying float vHot;

  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    float pulse = 0.82 + 0.18 * sin(uTime * 1.4 + aSeed);
    // light up when this node's index matches the hovered one
    float hot = step(0.5, 1.0 - abs(aIndex - uHighlight));
    vHot = hot;
    float boost = 1.0 + hot * 0.9;
    gl_PointSize = uSize * aSize * pulse * boost * uPixelRatio / max(-mv.z, 0.001);
    vDepth = -mv.z;
    vCore = clamp(aSize * 0.5, 0.0, 1.0);
    gl_Position = projectionMatrix * mv;
  }
`

export const nodeFragment = /* glsl */ `
  precision mediump float;
  uniform vec3 uColor;
  uniform vec3 uColorHot;
  varying float vDepth;
  varying float vCore;
  varying float vHot;

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    if (d > 0.5) discard;
    float core = smoothstep(0.5, 0.0, d);
    float halo = smoothstep(0.5, 0.16, d);
    float depthFade = clamp(1.25 - vDepth * 0.085, 0.28, 1.0);
    float a = (core * 0.92 + halo * 0.45) * depthFade;
    vec3 col = mix(uColor, uColorHot, vHot);
    col *= 0.65 + 0.7 * core;
    gl_FragColor = vec4(col, a);
  }
`

export const edgeVertex = /* glsl */ `
  varying float vDepth;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vDepth = -mv.z;
    gl_Position = projectionMatrix * mv;
  }
`

export const edgeFragment = /* glsl */ `
  precision mediump float;
  uniform vec3 uColor;
  uniform float uOpacity;
  varying float vDepth;
  void main() {
    float depthFade = clamp(1.35 - vDepth * 0.1, 0.04, 1.0);
    gl_FragColor = vec4(uColor, uOpacity * depthFade);
  }
`
