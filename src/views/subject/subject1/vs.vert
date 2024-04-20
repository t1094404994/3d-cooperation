#version 300 es

in vec2 a_position;
in vec2 a_texcoord;

uniform vec2 u_resolution;
uniform float u_flipY;

out vec2 v_texcoord;

void main() {
  vec2 zeroToOne = a_position / u_resolution;
  vec2 zeroToTwo = zeroToOne * 2.0f;
  vec2 clipSpace = zeroToTwo - 1.0f;
  gl_Position = vec4(clipSpace * vec2(1, u_flipY), 0, 1);

  v_texcoord = a_texcoord;
}