#version 300 es
precision highp float;

uniform sampler2D u_image;
in vec2 v_texcoord;

out vec4 outColor;

void main(){
    vec2 onePixel=vec2(1)/vec2(textureSize(u_image,0));
    // outColor = texture(u_image, v_texcoord).bgra;
    // average the left, middle, and right pixels.
  outColor=(texture(u_image,v_texcoord)+texture(u_image,v_texcoord+vec2(onePixel.x,0.0))+texture(u_image,v_texcoord+vec2(-onePixel.x,0.0)))/3.0;
}