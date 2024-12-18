#version 300 es

in vec4 a_position;

out vec4 v_color;

void main() {
  gl_Position = a_position;
  v_color = vec4(1.0f, 0.0f, 0.0f, 1.0f);
  // u_percent = distance(a_position.xyz, u_start_pt) / u_length;
  // u_percent = u_width * distance(a_position.xyz, u_start_pt) / u_length;
  // u_percent = (gl_Position.y + 0.5f) / u_width;
  // v_color = mix(u_start_color, u_end_color, u_percent);
}
