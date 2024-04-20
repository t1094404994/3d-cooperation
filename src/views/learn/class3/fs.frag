#version 300 es
precision highp float;

uniform sampler2D u_image;
uniform float u_max_height;
in vec2 v_texcoord;

out vec4 outColor;

void main(){
  outColor = texture(u_image, v_texcoord);
}