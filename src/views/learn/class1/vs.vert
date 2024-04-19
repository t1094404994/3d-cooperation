#version 300 es

// in vec4 a_position;
in vec2 a_position;

uniform vec2 u_resolution;
void main() {
  vec2 zeroToOne = a_position / u_resolution;
  vec2 zeroToTwo = zeroToOne * 2.0f;
  vec2 clipSpace = zeroToTwo - 1.0f;
  gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
}