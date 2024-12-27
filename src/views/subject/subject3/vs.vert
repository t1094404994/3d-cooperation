#version 300 es

in vec4 a_position;

out vec4 v_color;

uniform vec3 u_start_color;
uniform vec3 u_end_color;
uniform float u_a;
uniform float u_b;
uniform float u_c;
uniform float u_d;

void main() {
  gl_Position = a_position;
  float dist = abs(u_a * gl_Position.x + u_b * gl_Position.y + u_c) / u_d;
  float t = dist / u_d;
  float cx = u_start_color.x - u_start_color.x * t + u_end_color.x * t;
  float cy = u_start_color.y - u_start_color.y * t + u_end_color.y * t;
  float cz = u_start_color.z - u_start_color.z * t + u_end_color.z * t;
  v_color = vec4(cx, cy, cz, 1.0f);
}
