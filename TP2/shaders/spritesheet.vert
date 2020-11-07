#ifdef GL_ES
precision highp float;
#endif
  
attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix;

uniform char_index; 

uniform size_c;
uniform size_l;

uniform vec2 charCoords;

varying vec2 vTextureCoord;

void main() {
    vec3 offset = vec3(1.0, 0.0, 0.0) * char_index;
    gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition + offset, 1.0);

    vTextureCoord = vec2(charCoords[0] * size_c, charCoords[1]  * size_l);
}