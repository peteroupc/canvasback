/*
Written by Peter O. in 2015.

Any copyright is dedicated to the Public Domain.
http://creativecommons.org/publicdomain/zero/1.0/
If you like this, you should donate to Peter O.
at: http://upokecenter.dreamhosters.com/articles/donate-now-2/
*/
var GLUtil={
renderLoop:function(func){
  func();
  var selfRefFunc=function(){
   func();
   GLUtil.callRequestFrame(selfRefFunc);
  };
  GLUtil.callRequestFrame(selfRefFunc);
},
get3DOr2DContext:function(canvasElement){
  if(!canvasElement)return null;
  var context=null;
  var options={antialias:true};
  try { context=canvasElement.getContext("webgl", options);
  } catch(e) { context=null; }
  if(!context){
    try { context=canvasElement.getContext("experimental-webgl", options);
    } catch(e) { context=null; }
  }
  if(!context){
    try { context=canvasElement.getContext("moz-webgl", options);
    } catch(e) { context=null; }
  }
  if(!context){
    try { context=canvasElement.getContext("webkit-3d", options);
    } catch(e) { context=null; }
  }
  if(!context){
    try { context=canvasElement.getContext("2d", options);
    } catch(e) { context=null; }
  }
  if(GLUtil.is3DContext(context)){
   context.getExtension("OES_element_index_uint");
   context.getExtension("EXT_texture_filter_anisotropic");
  }
  return context;
},
get3DContext:function(canvasElement,err){
  if(!canvasElement)return null;
  var c=GLUtil.get3DOr2DContext(canvasElement);
  var errmsg=null;
  if(!c && window.WebGLShader){
    errmsg="Failed to initialize graphics support required by this page.";
  } else if(window.WebGLShader && !GLUtil.is3DContext(c)){
    errmsg="This page requires WebGL, but it failed to start. Your computer might not support WebGL.";
  } else if(!c || !GLUtil.is3DContext(c)){
    errmsg="This page requires a WebGL-supporting browser.";
  }
  if(errmsg){
   (err || window.alert)(errmsg);
   return null;
  }
  return c;
},
is3DContext:function(context){
 return context && ("compileShader" in context);
},
callRequestFrame:function(func){
 var raf=window.requestAnimationFrame || window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
 if(raf){
  raf(func);
 } else {
  window.setTimeout(func,17);
 }
},
createVerticesAndFaces:function(context, vertices, faces, format){
 var vertbuffer=context.createBuffer();
 var facebuffer=context.createBuffer();
 context.bindBuffer(context.ARRAY_BUFFER, vertbuffer);
 context.bindBuffer(context.ELEMENT_ARRAY_BUFFER, facebuffer);
 context.bufferData(context.ARRAY_BUFFER,
   new Float32Array(vertices), context.STATIC_DRAW);
 var type=context.UNSIGNED_SHORT;
 if(vertices.length>=65536 || faces.length>=65536){
  type=context.UNSIGNED_INT;
  context.bufferData(context.ELEMENT_ARRAY_BUFFER,
    new Uint32Array(faces), context.STATIC_DRAW);
 } else {
  context.bufferData(context.ELEMENT_ARRAY_BUFFER,
    new Uint16Array(faces), context.STATIC_DRAW);
 }
 return {verts:vertbuffer, faces:facebuffer,
   facesLength: faces.length, type:type, format:format};
},
createCube:function(context){
 // Position X, Y, Z, normal NX, NY, NZ, texture U, V
 var vertices=[-1.0,-1.0,1.0,1.0,0.0,0.0,1.0,1.0,-1.0,1.0,1.0,1.0,0.0,0.0,1.0,0.0,-1.0,1.0,-1.0,1.0,0.0,0.0,0.0,0.0,-1.0,-1.0,-1.0,1.0,0.0,0.0,0.0,1.0,1.0,-1.0,-1.0,-1.0,0.0,0.0,1.0,1.0,1.0,1.0,-1.0,-1.0,0.0,0.0,1.0,0.0,1.0,1.0,1.0,-1.0,0.0,0.0,0.0,0.0,1.0,-1.0,1.0,-1.0,0.0,0.0,0.0,1.0,1.0,-1.0,-1.0,0.0,1.0,0.0,1.0,1.0,1.0,-1.0,1.0,0.0,1.0,0.0,1.0,0.0,-1.0,-1.0,1.0,0.0,1.0,0.0,0.0,0.0,-1.0,-1.0,-1.0,0.0,1.0,0.0,0.0,1.0,1.0,1.0,1.0,0.0,-1.0,0.0,1.0,1.0,1.0,1.0,-1.0,0.0,-1.0,0.0,1.0,0.0,-1.0,1.0,-1.0,0.0,-1.0,0.0,0.0,0.0,-1.0,1.0,1.0,0.0,-1.0,0.0,0.0,1.0,-1.0,-1.0,-1.0,0.0,0.0,1.0,1.0,1.0,-1.0,1.0,-1.0,0.0,0.0,1.0,1.0,0.0,1.0,1.0,-1.0,0.0,0.0,1.0,0.0,0.0,1.0,-1.0,-1.0,0.0,0.0,1.0,0.0,1.0,1.0,-1.0,1.0,0.0,0.0,-1.0,1.0,1.0,1.0,1.0,1.0,0.0,0.0,-1.0,1.0,0.0,-1.0,1.0,1.0,0.0,0.0,-1.0,0.0,0.0,-1.0,-1.0,1.0,0.0,0.0,-1.0,0.0,1.0]
 var faces=[0,1,2,0,2,3,4,5,6,4,6,7,8,9,10,8,10,11,12,13,14,12,14,15,16,17,18,16,18,19,20,21,22,20,22,23]
 return GLUtil.createVerticesAndFaces(
   context,vertices,faces,Shape.VEC3DNORMALUV);
},
recalcNormals:function(vertices,faces){
  for(var i=0;i<vertices.length;i+=8){
    vertices[i+3]=0.0
    vertices[i+4]=0.0
    vertices[i+5]=0.0
  }
  for(var i=0;i<vertices.length;i+=3){
    var v1=faces[i]*8
    var v2=faces[i+1]*8
    var v3=faces[i+2]*8
    var n1=[vertices[v2]-vertices[v3],vertices[v2+1]-vertices[v3+1],vertices[v2+2]-vertices[v3+2]]
    var n2=[vertices[v1]-vertices[v3],vertices[v1+1]-vertices[v3+1],vertices[v1+2]-vertices[v3+2]]
    // cross multiply n1 and n2
    var x=n1[1]*n2[2]-n1[2]*n2[1]
    var y=n1[2]*n2[0]-n1[0]*n2[2]
    var z=n1[0]*n2[1]-n1[1]*n2[0]
    // normalize xyz vector
    len=Math.sqrt(x*x+y*y+z*z);
    if(len!=0){
      len=1.0/len;
      n1[0]=x*len;
      n1[1]=y*len;
      n1[2]=z*len;
      // add normalized normal to each vertex of the face
      vertices[v1+3]+=n1[0]
      vertices[v1+4]+=n1[1]
      vertices[v1+5]+=n1[2]
      vertices[v2+3]+=n1[0]
      vertices[v2+4]+=n1[1]
      vertices[v2+5]+=n1[2]
      vertices[v3+3]+=n1[0]
      vertices[v3+4]+=n1[1]
      vertices[v3+5]+=n1[2]
    }
  }
  // Normalize each normal of the vertex
  for(var i=0;i<vertices.length;i+=8){
    var x=vertices[i+3];
    var y=vertices[i+4];
    var z=vertices[i+5];
    len=Math.sqrt(x*x+y*y+z*z);
    if(len){
      len=1.0/len;
      vertices[i+3]*=len;
      vertices[i+4]*=len;
      vertices[i+5]*=len;
    }
  }
},
createSphere:function(context,radius,count) {
 if(typeof radius=="undefined")radius=1.0;
 if(typeof div=="undefined")count=5;
 function pushMidpoint(points,a,b){
  var newpt=GLUtil.vec3normInPlace([
    (points[a]+points[b])/2.0,
    (points[a+1]+points[b+1])/2.0,
    (points[a+2]+points[b+2])/2.0]);
  var uvx=(points[a+6]+points[b+6])/2;
  var uvy=(points[a+7]+points[b+7])/2;
  points.push(newpt[0],newpt[1],newpt[2],0,0,0,uvx,uvy);
 }
 var t=0.5773502691896258
 var points=[t,t,t,0,0,0,0,0,
  -t,-t,t,0,0,0,0,0,
  -t,t,-t,0,0,0,0,0,
  t,-t,-t,0,0,0,0,0];
 var tris=[0,1,3,0,2,1,3,2,0,2,3,1];
 for(var i=0;i<count;i++){
  var facesCount=tris.length;
  for(var j=0;j<facesCount;j+=3){
   var t1=tris[j];
   var t2=tris[j+1];
   var t3=tris[j+2];
   var point1=tris[j]*8;
   var point2=tris[j+1]*8;
   var point3=tris[j+2]*8;
   var pointIndex=points.length/8;
   pushMidpoint(points,point1,point2);
   pushMidpoint(points,point2,point3);
   pushMidpoint(points,point3,point1);
   tris[j]=pointIndex;
   tris[j+1]=pointIndex+1;
   tris[j+2]=pointIndex+2;
   tris.push(
    t1,pointIndex,pointIndex+2,
    t2,pointIndex+1,pointIndex,
    t3,pointIndex+2,pointIndex+1);
  }  
 }
 if(radius!=1.0){
  // Multiply vertices by the given radius
  for(var i=0;i<points.length;i+=8){
   points[i]*=radius;
   points[i+1]*=radius;
   points[i+2]*=radius;
  }
 }
 GLUtil.recalcNormals(points,tris);
 return GLUtil.createVerticesAndFaces(
   context,points,tris,Shape.VEC3DNORMALUV);
},
vec3cross:function(a,b){
return [a[1]*b[2]-a[2]*b[1],
 a[2]*b[0]-a[0]*b[2],
 a[0]*b[1]-a[1]*b[0]];
},
vec3dot:function(a,b){
return a[0]*b[0]+a[1]*b[1]+a[2]*b[2];
},
vec3addInPlace:function(a,b){
var b0=b[0];
var b1=b[1];
a[0]+=b0;
a[1]+=b1;
},
vec3subInPlace:function(a,b){
var b0=b[0];
var b1=b[1];
a[0]-=b0;
a[1]-=b1;
},
vec3scaleInPlace:function(a,scalar){
a[0]*=scalar;
a[1]*=scalar;
a[2]*=scalar;
},
vec3normInPlace:function(vec){
 var x=vec[0];
 var y=vec[1];
 var z=vec[2];
 len=Math.sqrt(x*x+y*y+z*z);
 if(len!=0){
  len=1.0/len;
  vec[0]*=len;
  vec[1]*=len;
  vec[2]*=len;
 }
 return vec;
},
vec3norm:function(vec){
 var ret=[vec[0],vec[1],vec[2]]
 GLUtil.vec3normInPlace(ret);
 return ret;
},
vec3length:function(a){
 var dx=a[0];
 var dy=a[1];
 var dz=a[2];
 return Math.sqrt(dx*dx+dy*dy+dz*dz);
},
mat4identity:function(){
 return [1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]
},
mat4scaleVec3:function(mat,v3){
  var scaleX=v3[0];
  var scaleY=v3[1];
  var scaleZ=v3[2];
	return [
		mat[0]*scaleX, mat[1]*scaleY, mat[2]*scaleZ, mat[3],
		mat[4]*scaleX, mat[5]*scaleY, mat[6]*scaleZ, mat[7],
		mat[8]*scaleX, mat[9]*scaleY, mat[10]*scaleZ, mat[11],
		mat[12]*scaleX, mat[13]*scaleY, mat[14]*scaleZ, mat[15]
	];
},
mat4scaledVec3:function(v3){
  return [v3[0],0,0,0,0,v3[1],0,0,0,0,v3[2],0,0,0,0,1]
},
mat4translatedVec3:function(v3){
  return [1,0,0,0,0,1,0,0,0,0,1,0,v3[0],v3[1],v3[2],1]
},
mat4perspectiveDegrees:function(fovY,aspectRatio,nearZ,farZ){
 var f = 1/Math.tan(fovY*Math.PI/360);
 var nmf = nearZ-farZ;
 nmf=1/nmf;
 return [ f/aspectRatio, 0, 0, 0, 0, f, 0, 0, 0, 0,
   nmf*(nearZ+farZ), -1, 0, 0, nmf*nearZ*farZ*2, 0]
},
mat4lookat:function(viewerPos, lookingAt, up){
 var f=[viewerPos[0]-lookingAt[0],viewerPos[1]-lookingAt[1],viewerPos[2]-lookingAt[2]];
 if(GLUtil.vec3length(f)<1e-6){
   return GLUtil.mat4identity();
 }
 GLUtil.vec3normInPlace(f);
 var s=GLUtil.vec3cross(up,f);
 GLUtil.vec3normInPlace(s);
 var u=GLUtil.vec3cross(f,s);
 GLUtil.vec3normInPlace(u);
 return [s[0],u[0],f[0],0,s[1],u[1],f[1],0,s[2],u[2],f[2],0,
    -GLUtil.vec3dot(viewerPos,s),
    -GLUtil.vec3dot(viewerPos,u),
    -GLUtil.vec3dot(viewerPos,f),1];
},
mat4ortho:function(l,r,b,t,n,f){
 var width=r-l;
 var height=b-t;
 var depth=n-f;
 return [-2/width,0,0,0,0,-2/height,0,0,0,0,2/depth,0,
   -(l+r)/width,-(t+b)/height,-(n+f)/depth,1];
},
mat4frustum:function(l,r,b,t,n,f){
 var dn=2*n;
 var onedx=1/(r-l);
 var onedy=1/(t-b);
 var onedz=1/(n-f);
return [dn*onedx,0,0,0,0,dn*onedy,0,0,(l+r)*onedx,(t+b)*onedy,(f+n)*onedz,-1,
   0,0,dn*f*onedz,0];
},
mat4scaleVec3InPlace:function(mat,v3){
  var scaleX=v3[0];
  var scaleY=v3[1];
  var scaleZ=v3[2];
  mat[0]*=scaleX;
  mat[4]*=scaleX;
  mat[8]*=scaleX;
  mat[12]*=scaleX;
  mat[1]*=scaleY;
  mat[5]*=scaleY;
  mat[9]*=scaleY;
  mat[13]*=scaleY;
  mat[2]*=scaleZ;
  mat[6]*=scaleZ;
  mat[10]*=scaleZ;
  mat[14]*=scaleZ;
},
mat4rotateVecDegrees:function(mat, angle, v){
v=GLUtil.vec3norm(v);
angle=angle*Math.PI/180;
var c = Math.cos(angle);
var s = Math.sin(angle);
var tc=1-c;
var v0tc=v[0]*tc;
var v1tc=v[1]*tc;
var v2tc=v[2]*tc;
var v0s=v[0]*s;
var v1s=v[1]*s;
var v2s=v[2]*s;
var x0=v[0]*v0tc+c,
x1=v[0]*v1tc-v2s,
x2=v[0]*v2tc+v1s,
x3=v[1]*v0tc+v2s,
x4=v[1]*v1tc+c,
x5=v[1]*v2tc-v0s,
x6=v[2]*v0tc-v1s,
x7=v[2]*v1tc+v0s,
x8=v[2]*v2tc+c;
return [
mat[0]*x0+mat[4]*x1+mat[8]*x2,
mat[1]*x0+mat[5]*x1+mat[9]*x2,
mat[2]*x0+mat[6]*x1+mat[10]*x2,
mat[3]*x0+mat[7]*x1+mat[11]*x2,
mat[0]*x3+mat[4]*x4+mat[8]*x5,
mat[1]*x3+mat[5]*x4+mat[9]*x5,
mat[2]*x3+mat[6]*x4+mat[10]*x5,
mat[3]*x3+mat[7]*x4+mat[11]*x5,
mat[0]*x6+mat[4]*x7+mat[8]*x8,
mat[1]*x6+mat[5]*x7+mat[9]*x8,
mat[2]*x6+mat[6]*x7+mat[10]*x8,
mat[3]*x6+mat[7]*x7+mat[11]*x8,
mat[12],mat[13],mat[14],mat[15]]
}
};

var ShaderProgram=function(context, vertexShader, fragmentShader){
 if(vertexShader==null)vertexShader=ShaderProgram.getDefaultVertex();
 if(fragmentShader==null)fragmentShader=ShaderProgram.getDefaultFragment();
 this.program=ShaderProgram._compileShaders(context,vertexShader,fragmentShader);
 this.attributes={};
 this.context=context;
 this.actives={};
 this.uniformTypes={};
 if(this.program!=null){
  this.attributes=[];
  var name=null;
  var ret={}
  var count= context.getProgramParameter(this.program, context.ACTIVE_ATTRIBUTES);
  for (var i = 0; i < count; ++i) {
   var attributeInfo=context.getActiveAttrib(this.program, i);
   if(attributeInfo!==null){
    name=attributeInfo.name;
    var attr=context.getAttribLocation(this.program, name);
    if(attr>=0){
     this.attributes.push(attr);
     ret[name]=attr;
    }
   }
  }
  count = context.getProgramParameter(this.program, context.ACTIVE_UNIFORMS);
  for (var i = 0; i < count; ++i) {
   var uniformInfo=context.getActiveUniform(this.program, i);
   if(uniformInfo!==null){
    name = uniformInfo.name;
    ret[name] = context.getUniformLocation(this.program, name);
    this.uniformTypes[name] = uniformInfo.type;
   }
  }
  this.actives=ret;
 }
}
ShaderProgram.prototype.get=function(name){
 return (!this.actives.hasOwnProperty(name)) ?
   null : this.actives[name];
}
ShaderProgram.prototype.use=function(){
 this.context.useProgram(this.program);
 for(var i=0;i<this.attributes.length;i++){
  this.context.enableVertexAttribArray(this.attributes[i]);
 }
 return this;
}
ShaderProgram.prototype.setUniforms=function(uniforms){
  for(var i in uniforms){
    if(uniforms.hasOwnProperty(i)){
      v=uniforms[i];
      if(v.length==3){
       this.context.uniform3f(this.get(i), v[0],v[1],v[2]);
      } else if(v.length==16){
       this.context.uniformMatrix4fv(this.get(i),false,v);
      } else {
       if(this.uniformTypes[i]==this.context.FLOAT){
        this.context.uniform1f(this.get(i), (typeof v=="number") ? v : v[0]);
       } else {
        this.context.uniform1i(this.get(i), (typeof v=="number") ? v : v[0]);
       }
      }
    }
  }
  return this;
}
ShaderProgram._compileShaders=function(context, vertexShader, fragmentShader){
  function compileShader(context, kind, text){
    var shader=context.createShader(kind);
    context.shaderSource(shader, text);
    context.compileShader(shader);
    if (!context.getShaderParameter(shader, context.COMPILE_STATUS)) {
	  	console.log((kind==context.VERTEX_SHADER ? "vertex: " : "fragment: ")+
        context.getShaderInfoLog(shader));
	  	return null;
	  }
   return shader;
  }
  var vs=(!vertexShader || vertexShader.length==0) ? null :
    compileShader(context,context.VERTEX_SHADER,vertexShader);
  var fs=(!fragmentShader || fragmentShader.length==0) ? null :
    compileShader(context,context.FRAGMENT_SHADER,fragmentShader);
  var program = null;
  if(vs!==null && fs!==null){
   program = context.createProgram();
   context.attachShader(program, vs);
   context.attachShader(program, fs);
 	 context.linkProgram(program);
   if (!context.getProgramParameter(program, context.LINK_STATUS)) {
		console.log("link: "+context.getProgramInfoLog(program));
		context.deleteProgram(program);
    program=null;
	 } else {
    context.useProgram(program);
   }
  }
  if(vs!==null)context.deleteShader(vs);
  if(fs!==null)context.deleteShader(fs);
  return program;
};
ShaderProgram.prototype.setLightSource=function(light){
 if(!light)return this;
 this.setUniforms({
 "sdir":light.direction,
 "sa":light.ambient,
 "sd":light.diffuse,
 "ss":light.specular
 });
 return this;
}
ShaderProgram.prototype.setMaterialShade=function(shade){
 if(!shade)return this;
 this.setUniforms({
 "mshin":shade.shininess,
 "ma":shade.ambient,
 "md":shade.diffuse,
 "ms":shade.specular
 });
 return this;
}
ShaderProgram.getDefaultVertex=function(){
return "" +
"attribute vec3 position;\n" +
"attribute vec3 normal;\n" +
"attribute vec2 textureUV;\n" +
"uniform mat4 world;\n" +
"uniform mat4 view;\n" +
"uniform mat4 projection;\n" +
"uniform float alpha;\n"+
"varying vec2 textureUVVar;\n"+
"varying vec3 normalVar;\n" +
"varying vec3 viewPositionVar;\n" +
"void main(){\n" +
"vec4 positionVec4=vec4(position,1.0);\n" +
"mat4 viewWorld=view*world;\n" +
"gl_Position=projection*viewWorld*positionVec4;\n" +
"viewPositionVar=vec3(viewWorld*positionVec4);\n" +
"normalVar=normalize(vec3(world*vec4(normal,0.0)));\n" +
"textureUVVar=textureUV;\n"+
"}";
};
ShaderProgram.getDefaultFragment=function(){
return "" +
"precision highp float;\n" +
"uniform sampler2D sampler;\n" + // texture sampler
"uniform int useTexture;\n" + // use texture sampler rather than solid color if nonzero
"uniform vec3 sa;\n" + // source light ambient color
"uniform vec3 sd;\n" + // source light diffuse color
"uniform vec3 ss;\n" + // source light specular color
"uniform vec3 sdir;\n" + // source light direction
"uniform vec3 ma;\n" + // material ambient color (-1 to -1 each component).
"uniform vec3 md;\n" + // material diffuse color (0-1 each component). Is multiplied by texture/solid color.
"uniform vec3 ms;\n" + // material specular color (0-1 each comp.).  Affects how intense highlights are.
"uniform float mshin;\n" + // material shininess (1 or greater).  A higher value results in sharper highlights.
"uniform vec4 color;\n" + // solid color
"varying vec3 normalVar;\n" +
"varying vec3 viewPositionVar;\n" +
"varying vec2 textureUVVar;\n"+
"void main(){\n" +
" vec3 normNormalVar=normalize(normalVar);" +
" vec3 normSdir=normalize(sdir);" +
" float diffInt=dot(normNormalVar,normSdir);" +
" vec4 baseColor=(useTexture==0) ? color : texture2D(sampler,textureUVVar);\n" +
" vec3 phong=(sa*ma)+(sd*md*baseColor.rgb*max(diffInt,0.0));\n" +
" if(diffInt>=0.0){\n" +
"   phong=phong+(ss*ms*pow(max(dot(reflect(-normSdir,normNormalVar),viewPositionVar),0.0),mshin));\n" +
" }\n"+
" gl_FragColor=vec4(phong,baseColor.a);\n" +
"}";
};
function MaterialShade(ambient, diffuse, specular,shininess) {
 this.shininess=(shininess==null) ? 1 : Math.max(1,shininess);
 this.ambient=ambient||[0,0,0];
 this.diffuse=diffuse||[1,1,1];
 this.specular=ambient||[0.2,0.2,0.2];
}
function LightSource(direction,ambient, diffuse, specular) {
 this.direction=direction||[0,0,-1];
 this.ambient=ambient||[1,1,1];
 this.diffuse=diffuse||[0.2,0.2,0.2];
 this.specular=ambient||[0.2,0.2,0.2];
}

(function(){
var Materials=function(context, program){
 this.textures={}
 this.context=context;
 this.useTextureUniform=program.get("color");
 this.samplerUniform=program.get("sampler");
 this.colorUniform=program.get("useTexture");
 this.context.uniform1i(this.samplerUniform,0);
}
Materials.COLOR = 0;
Materials.TEXTURE = 1;
Materials.prototype.getColor=function(r,g,b){
 if(typeof r=="number" && typeof g=="number" &&
    typeof b=="number"){
   return new SolidColor(this.context,[r,g,b],this.colorUniform);
 }
 // treat r as a 3-element RGB array
 return new SolidColor(this.context,r,this.colorUniform);
}
Materials.prototype.getTexture=function(name, loadHandler){
 // Get cached texture
 if(this.textures[name] && this.textures.hasOwnProperty(name)){
   return new Texture(this.textures[name]);
 }
 // Load new texture and cache it
 var tex=new TextureImage(this.context,name, loadHandler,this.useTextureUniform);
 this.textures[name]=tex;
 return new Texture(tex);
}
var SolidColor=function(context, color){
 this.kind=Materials.COLOR;
 this.material=null;
 this.color=[color[0],color[1],color[2],(color[3]==null ? 1.0 : color[3])];
 this.context=context;
}
SolidColor.prototype.setShading=function(material){
 this.material=material;
 return this;
}
SolidColor.prototype.bind=function(program){
  var useTextureUniform=program.get("useTexture");
  if(useTextureUniform!==null){
   this.context.uniform1i(useTextureUniform, 0);
  }
  this.context.uniform4f(program.get("color"),this.color[0],
    this.color[1],this.color[2],this.color[3]);
  program.setMaterialShade(this.material);
}
var Texture=function(texture){
 this.texture=texture;
 this.material=null;
 this.kind=Materials.TEXTURE;
}
Texture.prototype.bind=function(program){
 this.texture.bind(program);
}
Texture.prototype.setShading=function(material){
 this.material=material;
 return this;
}
var TextureImage=function(context, name, loadHandler){
  this.texture=null;
  this.context=context;
  this.name=name;
  var thisObj=this;
  var image=new Image();
  image.onload=function(e) {
    thisObj.texture=Texture.fromImage(context,image);
    if(loadHandler)loadHandler(thisObj);
    image.onload=null;
  };
  image.src=name;
}
TextureImage.prototype.bind=function(program){
   if (this.texture!==null) {
      var useTextureUniform=program.get("useTexture");
      if(useTextureUniform!==null){
        this.context.uniform1i(useTextureUniform, 1);
      }
      this.context.activeTexture(this.context.TEXTURE0);
      this.context.bindTexture(this.context.TEXTURE_2D,
        this.texture);
    }
    program.setMaterialShade(this.material);
}
Texture.fromImage=function(context,image){
  function isPowerOfTwo(a){
   if(Math.floor(a)!=a || a<=0)return false;
   while(a>1 && (a&1)==0){
    a>>=1;
   }
   return (a==1);
  }
  var texture=context.createTexture();
  context.pixelStorei(context.UNPACK_FLIP_Y_WEBGL, true);
  context.bindTexture(context.TEXTURE_2D, texture);
  context.texParameteri(context.TEXTURE_2D,
    context.TEXTURE_MAG_FILTER, context.LINEAR);
  context.texImage2D(context.TEXTURE_2D, 0,
    context.RGBA, context.RGBA, context.UNSIGNED_BYTE, image);
  if(isPowerOfTwo(image.width) && isPowerOfTwo(image.height)){
   // Enable mipmaps if texture's dimensions are powers of two
   context.texParameteri(context.TEXTURE_2D,
     context.TEXTURE_MIN_FILTER, context.NEAREST_MIPMAP_LINEAR);
   context.generateMipmap(context.TEXTURE_2D);
  } else {
   context.texParameteri(context.TEXTURE_2D,
     context.TEXTURE_MIN_FILTER, context.LINEAR);  
   // Other textures require this wrap mode
   context.texParameteri(context.TEXTURE_2D,
     context.TEXTURE_WRAP_S, context.CLAMP_TO_EDGE);  
   context.texParameteri(context.TEXTURE_2D,
     context.TEXTURE_WRAP_T, context.CLAMP_TO_EDGE);  
  }
  context.bindTexture(context.TEXTURE_2D, null);
  return texture;
}
window["Materials"]=Materials;
})(window);

function Scene3D(context){
 this.context=context;
 this.context.viewport(0,0,
    this.context.canvas.width*1.0,this.context.canvas.height*1.0);
 this.program=new ShaderProgram(context);
 this.shapes=[];
 this.clearColor=[0,0,0,0];
 this.materials=new Materials(context,this.program);
 this.context.enable(context.BLEND);
 this.context.blendFunc(context.SRC_ALPHA,context.ONE_MINUS_SRC_ALPHA);
 this.setProjectionMatrix(GLUtil.mat4identity())
    .setViewMatrix(GLUtil.mat4identity())
    .setLightSource(new LightSource());
 this.program.setMaterialShade(new MaterialShade());
 this.context.enable(this.context.DEPTH_TEST);
 this.context.depthFunc(this.context.LEQUAL);
 this.context.clearColor(0,0,0,1.0);
 this.context.clearDepth(999999);
 this.context.clear(
    this.context.COLOR_BUFFER_BIT |
    this.context.DEPTH_BUFFER_BIT);
}
Scene3D.prototype.setPerspective=function(fov, near, far){
 this.setProjectionMatrix(GLUtil.mat4perspective(fov,
   this.context.viewportWidth*1.0/this.context.viewportHeight,near,far));
}
Scene3D.prototype.setClearColor=function(r,g,b,a){
  this.context.clearColor(r,g,b,(typeof a=="undefined") ? 1.0 : a);
  return this;
}
Scene3D.prototype.getColor=function(r,g,b,a){
 return this.materials.getColor(r,g,b,a);
}
Scene3D.prototype.getTexture=function(name){
 return this.materials.getTexture(name);
}
Scene3D.prototype.setProjectionMatrix=function(matrix){
 this.program.setUniforms({
 "projection":matrix
 });
 return this;
}
Scene3D.prototype.setViewMatrix=function(matrix){
 this.program.setUniforms({
 "view":matrix
 });
 return this;
}
Scene3D.prototype.setLightSource=function(light){
 this.program.setLightSource(light);
 return this;
}
Scene3D.prototype.render=function(){
  this.context.clear(this.context.COLOR_BUFFER_BIT);
  for(var i=0;i<this.shapes.length;i++){
   this.shapes[i].render(this.program);
  }
  this.context.flush();
}

function Shape(context,vertfaces){
  this.vertfaces=vertfaces;
  this.context=context;
  this.material=null;
  this.scale=[1,1,1];
  this.angle=0;
  this.position=[0,0,0];
  this.vector=[0,0,0];
  this.uniforms=[];
  this._matrixDirty=false;
  this.matrix=GLUtil.mat4identity();
}
Shape.VEC2D=2;
Shape.VEC3D=3;
Shape.VEC3DNORMAL=5;
Shape._vertexAttrib=function(context, attrib, size, type, stride, offset){
  if(attrib!==null){
    context.enableVertexAttribArray(attrib);
    context.vertexAttribPointer(attrib,size,type,false,stride,offset);
  }
}
Shape.prototype._bind=function(context, vertfaces,
  attribPosition, attribNormal, attribUV){
  context.bindBuffer(context.ARRAY_BUFFER, vertfaces.verts);
  context.bindBuffer(context.ELEMENT_ARRAY_BUFFER, vertfaces.faces);
  var format=vertfaces.format;
  if(format==Shape.VEC3DNORMAL){
   Shape._vertexAttrib(context,attribPosition, 3, context.FLOAT, 6*4, 0);
   Shape._vertexAttrib(context,attribNormal, 3,
    context.FLOAT, 6*4, 3*4);
  } else if(format==Shape.VEC3DNORMALUV){
   Shape._vertexAttrib(context,attribPosition, 3,
    context.FLOAT, 8*4, 0);
   Shape._vertexAttrib(context,attribNormal, 3,
    context.FLOAT, 8*4, 3*4);
   Shape._vertexAttrib(context,attribUV, 2,
    context.FLOAT, 8*4, 6*4);
  } else if(format==Shape.VEC2D){
   Shape._vertexAttrib(context,attribPosition, 2,
     context.FLOAT, 2*4, 0);
  } else if(format==Shape.VEC3D){
   Shape._vertexAttrib(context,attribPosition, 3,
     context.FLOAT, 3*4, 0);
  }
}
Shape.prototype.setMaterial=function(material){
 this.material=material;
}
Shape.prototype._calcMatrix=function(){
  this._matrixDirty=false;
  this.matrix=GLUtil.mat4scaledVec3(this.scale);
  if(this.angle!=0){
    this.matrix=GLUtil.mat4rotateVecDegrees(this.matrix,this.angle,this.vector);
  }
  this.matrix[12]+=this.position[0];
  this.matrix[13]+=this.position[1];
  this.matrix[14]+=this.position[2];
}
Shape.prototype.setScale=function(x,y,z){
  if(x!=null && y==null && z==null){
   this.scale=[x,x,x];
  } else {
   this.scale=[x,y,z];
  }
  this._matrixDirty=true;
  return this;
}
Shape.prototype.setPosition=function(x,y,z){
  this.position=[x,y,z];
  this._matrixDirty=true;
  return this;
}
Shape.prototype.rotate=function(angle){
  this.angle+=angle;
  this.angle%=360;
  this._matrixDirty=true;
  return this;
}
Shape.prototype.setRotation=function(angle, vector){
  this.angle=angle%360;
  this.vector=vector;
  this._matrixDirty=true;
  return this;
}
Shape.prototype.render=function(program){
  // Bind vertex attributes
  this._bind(this.context,this.vertfaces,
    program.get("position"),
    program.get("normal"),
    program.get("textureUV"));
  // Set material (texture or color)
  if(this.material){
   this.material.bind(program);
  }
  // Set world matrix
  var uniformMatrix=program.get("world");
  if(uniformMatrix!==null){
   if(this._matrixDirty){
    this._calcMatrix();
   }
   this.context.uniformMatrix4fv(uniformMatrix,false,this.matrix);
  }
  // Draw the shape
  this.context.drawElements(this.context.TRIANGLES,
    this.vertfaces.facesLength,
    this.vertfaces.type, 0);
};
