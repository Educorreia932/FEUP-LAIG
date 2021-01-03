#ifdef GL_ES
precision highp float;
#endif
  
attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix;

uniform float char_index; 

uniform float size_c;
uniform float size_l;

uniform vec2 charCoords;

varying vec2 vTextureCoord;

void main() {
    vec3 offset = vec3(0.4, 0.0, 0.0) * char_index;
    gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition + offset, 1.0);

    vTextureCoord = (aTextureCoord + vec2(charCoords[0], charCoords[1])) * vec2(size_c, size_l) ;
}