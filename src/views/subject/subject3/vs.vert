#version 300 es

in vec4 a_position;
// in vec4 a_color;
uniform vec4 u_start_color;
uniform vec4 u_end_color;
uniform float u_length;
uniform float u_width;
uniform vec3 u_start_pt;
float u_percent;

out vec4 v_color;

void main() {
  gl_Position = a_position;
  u_percent = distance(a_position.xyz, u_start_pt) / u_length;
  // u_percent = u_width * distance(a_position.xyz, u_start_pt) / u_length;
  v_color = mix(u_start_color, u_end_color, u_percent);
}
