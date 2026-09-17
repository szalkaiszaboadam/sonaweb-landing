'use client'

/**
 * ShaderGradient
 * ---------------
 * Letisztult, fluid mesh gradiens, amely a márkaszíneket 
 * lágy, organikus zajmezőn (noise) keresztül mossa egybe.
 */

import { useEffect, useRef } from 'react'

const VERTEX_SRC = `
attribute vec2 a_position;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`

const FRAGMENT_SRC = `
precision highp float;

uniform vec2 u_resolution;
uniform float u_time;

// --- Simplex 2D noise (Ashima Arts) ---
vec3 permute(vec3 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }

float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                      -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
  m = m * m;
  m = m * m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  // Középre igazítjuk a koordinátarendszert és megtartjuk a képarányt
  vec2 p = uv * 2.0 - 1.0;
  p.x *= u_resolution.x / u_resolution.y;

  // EXTRÉM LASSÚ, prémium, nyugodt mozgás
  float t = u_time * 0.015;

  // EXTRÉM NAGYÍTÁS: a 'p' szorzóit minimálisra csökkentettük, 
  // így a hullámok gigantikusak és lágyak lesznek.
  float n1 = snoise(p * 0.1 + vec2(t * 0.6, t * 0.4));
  float n2 = snoise(p * 0.15 - vec2(t * 0.5, t * 0.7));
  float q = snoise(p * 0.2 + vec2(n1, n2) * 1.5 + t * 0.3);

  // A 'q' zaj értéke -1.0 és 1.0 között mozog. Ezt hozzuk be 0.0 és 1.0 közé.
  float f = (q + 1.0) * 0.5;

  // A brand pontos színei normalizálva
  vec3 c_black = vec3(0.04, 0.04, 0.04);   // Sötét/Fekete (#0A0A0A)
  vec3 c_dark  = vec3(0.45, 0.00, 0.07);   // Mély bordó (#740013)
  vec3 c_mid   = vec3(0.85, 0.02, 0.16);   // Élénkebb piros (#d90429)
  vec3 c_light = vec3(1.0, 0.0, 0.0);      // Ragyogó piros (#ff0000)

  // Extrém finom, zökkenőmentes színátmenetek a smoothstep segítségével
  vec3 color = mix(c_black, c_dark, smoothstep(0.0, 0.35, f));
  color = mix(color, c_mid, smoothstep(0.35, 0.7, f));
  color = mix(color, c_light, smoothstep(0.7, 1.0, f));

  // Mozgó lágy "fényfolt" (glow) UV alapján, képarány-torzítás nélkül
  vec2 centerUv = uv * 2.0 - 1.0;
  float glow = smoothstep(1.5, 0.0, length(centerUv + vec2(sin(t)*0.5, cos(t)*0.5)));
  color = mix(color, c_light, glow * 0.15);

  gl_FragColor = vec4(color, 1.0);
}
`

function createShader(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type)
  if (!shader) return null
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader)
    return null
  }
  return shader
}

function createProgram(gl: WebGLRenderingContext, vs: WebGLShader, fs: WebGLShader) {
  const program = gl.createProgram()
  if (!program) return null
  gl.attachShader(program, vs)
  gl.attachShader(program, fs)
  gl.linkProgram(program)
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    gl.deleteProgram(program)
    return null
  }
  return program
}

export function ShaderGradient({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const gl = (canvas.getContext('webgl', { antialias: true, alpha: false, premultipliedAlpha: false }) ||
      canvas.getContext('experimental-webgl', { antialias: true, alpha: false })) as WebGLRenderingContext | null

    if (!gl) return

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, VERTEX_SRC)
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SRC)
    if (!vertexShader || !fragmentShader) return

    const program = createProgram(gl, vertexShader, fragmentShader)
    if (!program) return

    gl.useProgram(program)

    const positionBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)

    const positionLoc = gl.getAttribLocation(program, 'a_position')
    gl.enableVertexAttribArray(positionLoc)
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0)

    const resolutionLoc = gl.getUniformLocation(program, 'u_resolution')
    const timeLoc = gl.getUniformLocation(program, 'u_time')

    const reduceMotion = typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    let rafId = 0
    const start = performance.now()

    function resize() {
      if (!canvas || !gl) return
      const parent = canvas.parentElement
      const width = parent ? parent.clientWidth : window.innerWidth
      const height = parent ? parent.clientHeight : window.innerHeight
      const w = Math.max(1, Math.floor(width * dpr))
      const h = Math.max(1, Math.floor(height * dpr))
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w
        canvas.height = h
        gl.viewport(0, 0, w, h)
      }
    }

    resize()
    const resizeObserver = new ResizeObserver(resize)
    if (canvas.parentElement) resizeObserver.observe(canvas.parentElement)

    function render(now: number) {
      if (!gl) return
      const elapsed = reduceMotion ? 0 : (now - start) / 1000
      gl.uniform2f(resolutionLoc, canvas!.width, canvas!.height)
      gl.uniform1f(timeLoc, elapsed)
      gl.drawArrays(gl.TRIANGLES, 0, 3)
      rafId = requestAnimationFrame(render)
    }
    rafId = requestAnimationFrame(render)

    return () => {
      cancelAnimationFrame(rafId)
      resizeObserver.disconnect()
      gl.deleteProgram(program)
      gl.deleteShader(vertexShader)
      gl.deleteShader(fragmentShader)
      gl.deleteBuffer(positionBuffer)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className={className}
      aria-hidden="true"
    />
  )
}
