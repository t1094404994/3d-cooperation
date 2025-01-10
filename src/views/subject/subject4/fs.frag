#version 300 es
precision highp float;

uniform sampler2D u_texture;

in vec2 v_texcoord;

out vec4 outColor;

void main() {
  outColor = texture(u_texture, v_texcoord);
  //   vec2 onePixel = vec2(1) / vec2(textureSize(u_texture, 0));
 
  // // average the left, middle, and right pixels.
  //   outColor=(texture(u_texture,v_texcoord)+texture(u_texture,v_texcoord+vec2(onePixel.x,0.0))+texture(u_texture,v_texcoord+vec2(-onePixel.x,0.0)))/3.0;
}