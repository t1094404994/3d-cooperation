#version 300 es

in vec4 a_position;

out vec4 v_color;

uniform vec3 u_start_color;
uniform vec3 u_end_color;
uniform vec3 u_start_point;
uniform vec3 u_end_point;

void main() {
  gl_Position = a_position;

  float crossx = 0.0f;
  float crossy = 0.0f;
  if(u_start_point.x == u_end_point.x) {
    crossx = u_start_point.x;
    crossy = a_position.y;
  } else if(u_start_point.y == u_end_point.y) {
    crossx = a_position.x;
    crossy = u_start_point.y;
  } else {
    float k1 = (u_end_point.y - u_start_point.y) / (u_end_point.x - u_start_point.x);
    float k2 = -1.0f / k1;
    float a1 = u_start_point.y - u_start_point.x * k1;
    float a2 = a_position.y - a_position.x * k2;
    crossx = (a2 - a1) / (k1 - k2);
    crossy = k1 * crossx + a1;
  }
  float distancePow2 = (crossx - u_start_point.x) * (crossx - u_start_point.x) + (crossy - u_start_point.y) * (crossy - u_start_point.y);
  float lineLengthPow2 = (u_end_point.x - u_start_point.x) * (u_end_point.x - u_start_point.x) + (u_end_point.y - u_start_point.y) * (u_end_point.y - u_start_point.y);
  float t = sqrt(distancePow2 / lineLengthPow2);

  float cx = u_start_color.x * (1.0f - t) + u_end_color.x * t;
  float cy = u_start_color.y * (1.0f - t) + u_end_color.y * t;
  float cz = u_start_color.z * (1.0f - t) + u_end_color.z * t;
  v_color = vec4(cx, cy, cz, 1.0f);
}
