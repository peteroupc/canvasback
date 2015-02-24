/*
Written by Peter O. in 2015.

Any copyright is dedicated to the Public Domain.
http://creativecommons.org/publicdomain/zero/1.0/
If you like this, you should donate to Peter O.
at: http://upokecenter.dreamhosters.com/articles/donate-now-2/
*/

var GLUtil={
initColorAndDepth:function(context,r,g,b,a,depth,depthFunc){
  context.enable(context.DEPTH_TEST);
  context.enable(context.BLEND);
  context.blendFunc(context.SRC_ALPHA,
    context.ONE_MINUS_SRC_ALPHA);
  context.depthFunc(depthFunc);
  context.clearColor(r,g,b, (typeof a=="undefined") ? 1.0 : a);
  context.clearDepth(depth);
  context.clear(
    context.COLOR_BUFFER_BIT | 
    context.DEPTH_BUFFER_BIT);
},
renderShapes:function(context,shapes,position,color,normal,matrix){
  for(var i=0;i<shapes.length;i++){
   shapes[i].render(position,color,normal,matrix);
  }
  context.flush();
},
setUniforms:function(context,actives,uniforms){
  for(var i in uniforms){
    if(uniforms.hasOwnProperty(i)){
      v=uniforms[i];
      if(v.length==3){
       context.uniform3f(actives[i], v[0],v[1],v[2]);
      } else if(v.length==16){
       context.uniformMatrix4fv(actives[i],false,v);
      } else {
       context.uniform1f(actives[i], v[0]);
      }
    }
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
compileShaders:function(context, vertexShader, fragmentShader){
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
  var program = context.createProgram();
  if(vs!==null)context.attachShader(program, vs);
  if(fs!==null)context.attachShader(program, fs);
 	context.linkProgram(program);
  if (!context.getProgramParameter(program, context.LINK_STATUS)) {
		console.log("link: "+context.getProgramInfoLog(program));
		return null;
	}
  context.useProgram(program);
  return program;
},
getActives:function(context,program){
 var name=null;
 var ret={}
 if(program!=null){
  var count= context.getProgramParameter(program, context.ACTIVE_ATTRIBUTES);
  for (var i = 0; i < count; ++i) {
   name=context.getActiveAttrib(program, i).name;
   ret[name]=context.getAttribLocation(program, name);
   if(ret[name]!==null)context.enableVertexAttribArray(ret[name]);
  }
  count = context.getProgramParameter(program, context.ACTIVE_UNIFORMS);
  for (var i = 0; i < count; ++i) {
   name = context.getActiveUniform(program, i).name;
   ret[name] = context.getUniformLocation(program, name);
  }
 }
 return ret;
},
createCube:function(context){
 // Position X, Y, Z, normal NX, NY, NZ
 var vertices=[
  -1.0, -1.0, 1.0, -1, 0, 0,
 -1.0, 1.0, 1.0, -1, 0, 0,
 -1.0, 1.0, -1.0, -1, 0, 0,
 -1.0, -1.0, -1.0, -1, 0, 0,
 1.0, -1.0, -1.0, 1, 0, 0,
 1.0, 1.0, -1.0, 1, 0, 0,
 1.0, 1.0, 1.0, 1, 0, 0,
 1.0, -1.0, 1.0, 1, 0, 0,
 1.0, -1.0, -1.0, 0, -1, 0,
 1.0, -1.0, 1.0, 0, -1, 0,
 -1.0, -1.0, 1.0, 0, -1, 0,
 -1.0, -1.0, -1.0, 0, -1, 0,
 1.0, 1.0, 1.0, 0, 1, 0,
 1.0, 1.0, -1.0, 0, 1, 0,
 -1.0, 1.0, -1.0, 0, 1, 0,
 -1.0, 1.0, 1.0, 0, 1, 0,
 -1.0, -1.0, -1.0, 0, 0, -1,
 -1.0, 1.0, -1.0, 0, 0, -1,
 1.0, 1.0, -1.0, 0, 0, -1,
 1.0, -1.0, -1.0, 0, 0, -1,
 1.0, -1.0, 1.0, 0, 0, 1,
 1.0, 1.0, 1.0, 0, 0, 1,
 -1.0, 1.0, 1.0, 0, 0, 1,
 -1.0, -1.0, 1.0, 0, 0, 1
 ]
 var faces=[
  0, 1, 2, 0, 2, 3,
  4, 5, 6, 4, 6, 7,
  8, 9, 10, 8, 10, 11,
  12, 13, 14, 12, 14,
  15, 16, 17, 18, 16,
  18, 19, 20, 21, 22,
  20, 22, 23
 ]
 return GLUtil.createVerticesAndFaces(
   context,vertices,faces,Shape.VEC3DNORMAL);
},
vec3cross:function(a,b){
return [a[1]*b[2]-a[2]*b[1],
 a[2]*b[0]-a[0]*b[2],
 a[0]*b[1]-a[1]*b[0]];
},
vec3dot:function(a,b){
return a[0]*b[0]+a[1]*b[1]+a[2]*b[2];
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
vec3distSquared:function(a,b){
 var dx=a[0]-b[0];
 var dy=a[1]-b[1];
 var dz=a[2]-b[2];
 return dx*dx+dy*dy+dz*dz;
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
mat4rotVecDegrees:function(mat, angle, v){
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

function callRequestFrame(func){
 var raf=window.requestAnimationFrame || window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
 if(raf){
  raf(func);
 } else {
  window.setTimeout(func,17);
 }
}

function Shape(context,vertfaces){
  this.vertfaces=vertfaces;
  this.context=context;
  this.scale=[1,1,1];
  this.angle=0;
  this.position=[0,0,0];
  this.vector=[0,0,0];
  this.uniforms=[];
  this._matrixDirty=false;
  this.matrix=GLUtil.mat4identity();
}
Shape.VEC2DCOLOR=0;
Shape.VEC3DCOLOR=1;
Shape.VEC2D=2;
Shape.VEC3D=3;
Shape.VEC3DNORMALCOLOR=4;
Shape.VEC3DNORMAL=5;
Shape.prototype._bind=function(context, vertfaces,
  attribPosition, attribColor, attribNormal){
  context.bindBuffer(context.ARRAY_BUFFER, vertfaces.verts);
  context.bindBuffer(context.ELEMENT_ARRAY_BUFFER, vertfaces.faces);
  var format=vertfaces.format;
  if(format==Shape.VEC2DCOLOR){
   context.vertexAttribPointer(attribPosition, 2,
     context.FLOAT, false, 5*4, 0);
   context.vertexAttribPointer(attribColor, 3,
     context.FLOAT, false, 5*4, 2*4);
  } else if(format==Shape.VEC3DCOLOR){
  context.vertexAttribPointer(attribPosition, 3,
    context.FLOAT, false, 6*4, 0);
  context.vertexAttribPointer(attribColor, 3,
    context.FLOAT, false, 6*4, 3*4);
  } else if(format==Shape.VEC3DNORMAL){
  context.vertexAttribPointer(attribPosition, 3,
    context.FLOAT, false, 6*4, 0);
  context.vertexAttribPointer(attribNormal, 3,
    context.FLOAT, false, 6*4, 3*4);
  } else if(format==Shape.VEC3DNORMALCOLOR){
  context.vertexAttribPointer(attribPosition, 3,
    context.FLOAT, false, 9*4, 0);
  if(attribNormal!==null && attribNormal>=0){
   context.vertexAttribPointer(attribNormal, 3,
     context.FLOAT, false, 9*4, 3*4);
  }
  context.vertexAttribPointer(attribColor, 3,
    context.FLOAT, false, 9*4, 6*4);
  } else if(format==Shape.VEC2D){
   context.vertexAttribPointer(attribPosition, 2,
     context.FLOAT, false, 2*4, 0);
  } else if(format==Shape.VEC3D){
   context.vertexAttribPointer(attribPosition, 3,
     context.FLOAT, false, 3*4, 0);
  }
}
Shape.prototype.getUniform=function(uniform){
  for(var i=0;i<this.uniforms.length;i++){
   if(this.uniforms[i][0]==uniform){
    return this.uniforms[i].slice(1,this.uniforms[i].length);
   }
  }
  return null;
}
Shape.prototype.addUniform3f=function(uniform,a,b,c){
  for(var i=0;i<this.uniforms.length;i++){
   if(this.uniforms[i][0]==uniform){
    this.uniforms[i][1]=a;
    this.uniforms[i][2]=b;
    this.uniforms[i][3]=c;
    return;
   }
  }
  this.uniforms.push([uniform,a,b,c]);
}
Shape.prototype.addUniform1f=function(uniform,a){
  for(var i=0;i<this.uniforms.length;i++){
   if(this.uniforms[i][0]==uniform){
    this.uniforms[i][1]=a;
    return;
   }
  }
  this.uniforms.push([uniform,a]);
}
Shape.prototype.addUniform4f=function(uniform,a,b,c,d){
  for(var i=0;i<this.uniforms.length;i++){
   if(this.uniforms[i][0]==uniform){
    this.uniforms[i][1]=a;
    this.uniforms[i][2]=b;
    this.uniforms[i][3]=c;
    this.uniforms[i][4]=d;
    return;
   }
  }
  this.uniforms.push([uniform,a,b,c,d]);
}
Shape.prototype.calcMatrix=function(){
  this._matrixDirty=false;
  this.matrix=GLUtil.mat4scaledVec3(this.scale);
  this.matrix=GLUtil.mat4rotVecDegrees(this.matrix,this.angle,this.vector);
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
Shape.prototype.render=function(attribPosition, attribColor, attribNormal, uniformMatrix){
  this._bind(this.context,this.vertfaces,
    attribPosition, attribColor, attribNormal);
  for(var i=0;i<this.uniforms.length;i++){
    var uniform=this.uniforms[i];
    if(uniform.length==4){
      this.context.uniform3f(uniform[0],uniform[1],uniform[2],uniform[3]);
    } else if(uniform.length==5){
      this.context.uniform4f(uniform[0],uniform[1],uniform[2],uniform[3],uniform[4]);
    } else if(uniform.length==2){
      this.context.uniform1f(uniform[0],uniform[1]);
    }
  }
  if(uniformMatrix!==null){
   if(this._matrixDirty){
    this.calcMatrix();
   }
   this.context.uniformMatrix4fv(uniformMatrix,false,this.matrix);
  }
  this.context.drawElements(this.context.TRIANGLES,
    this.vertfaces.facesLength,
    this.vertfaces.type, 0);
}

function CanvasBackground(color){
  "use strict";
  color=color||"#ff0000";
  this.width=1000;
  this.height=1000;
  var canvas=$("<canvas>")
   .attr("width",this.width+"")
   .attr("height",this.height+"")
   .css({"width":"100%",
          "height":"100%",
          "left":"0px",
          "zIndex":-1,
          "top":"0px",
         "position":"fixed"});
  $("body").append(canvas);
  this.use3d=true;
  var canvasElement=canvas.get(0);
  this.context=canvasElement.getContext("webgl", {antialias: true});
  if(!this.context)
   this.context=canvasElement.getContext("experimental-webgl", {antialias: true});
  if(!this.context){
   // Fallback draws simple boxes
   this.use3d=false;
   this.context=canvasElement.getContext("2d");
  }
  this.shapes=[]
  this.setColor(color);
}
CanvasBackground.varyColor=function(n){
 var newHue=(n[0]-7.5)+CanvasBackground.rand(15);
 if(newHue>=360)newHue=360-newHue;
 else if(newHue<0)newHue=360+newHue;
 var oldLum=n[1];
 var newLum=oldLum;
 if(newLum<=15){
  newLum=CanvasBackground.rand(30);
 } else if(newLum>255-15){
  newLum=(255-15)+CanvasBackground.rand(30);
 } else {
  newLum=(newLum-15)+CanvasBackground.rand(30);
 }
 var oldSat=n[2];
 var newSat=oldSat;
 if(newSat<=15){
  newSat=CanvasBackground.rand(30);
 } else if(newSat>255-15){
  newSat=(255-15)+CanvasBackground.rand(30);
 } else {
  newSat=(newSat)+CanvasBackground.rand(30);
 }
 if(oldSat>0 && newLum>0 && newLum<255){
  // Avoid all-gray color variations if original color
  // is not grayscale
  if(newLum<=25)
   newLum=25;
  if(newLum>=242)
   newLum=242;
  if(oldSat<=25)
   oldSat=25;
 }
 return [newHue,newLum,newSat]
};
CanvasBackground.rand=function(n){
"use strict";
 return (Math.random()*n)|0;
};
CanvasBackground.rgb2hls=function(rgb){
  var r=rgb[0];
  var g=rgb[1];
  var b=rgb[2];
  var vmax=r;
  if (g > vmax) vmax=g;
  if (b > vmax) vmax=b;
  var vmin=r;
  if (g<vmin) vmin=g;
  if (b<vmin) vmin=b;
  var vadd=(vmax+vmin);
  var lt=vadd/2.0;
  if (vmax===vmin){
   return [0,(lt<0 ? 0 : (lt>255 ? 255 : lt)),0];
  }
  var vd=(vmax-vmin);
   var divisor=(lt<=127.5)?vadd:510-vadd;
   var s=((vd*255)/divisor);
  var h=0;
   var hvd=vd/2;
   if (r === vmax){
    h=(((vmax-b)*60)+hvd)/vd;
    h-=(((vmax-g)*60)+hvd)/vd;
   } else if (b === vmax){
    h=240+(((vmax-g)*60)+hvd)/vd ;
    h-=(((vmax-r)*60)+hvd)/vd ;
   } else {
    h=120+(((vmax-r)*60)+hvd)/vd;
    h-=(((vmax-b)*60)+hvd)/vd;
   }
   if(h<0||h>=360)h=(((h%360)+360)%360);
  return [h,(lt<0 ? 0 : (lt>255 ? 255 : lt)),(s<0 ? 0 : (s>255 ? 255 : s))];
 };
CanvasBackground.hls2rgb=function(hls) {
"use strict";
 var hueval=hls[0]*1.0;//[0-360)
 var lum=hls[1]*1.0;//[0-255]
 var sat=hls[2]*1.0;//[0-255]
 lum=(lum<0 ? 0 : (lum>255 ? 255 : lum));
 sat=(sat<0 ? 0 : (sat>255 ? 255 : sat));
 if(sat===0){
  return [lum,lum,lum];
 }
 var b=0;
 if (lum<=127.5){
  b=(lum*(255.0+sat))/255.0;
 } else {
  b=lum*sat;
  b=b/255.0;
  b=lum+sat-b;
 }
 var a=(lum*2)-b;
 var r,g,bl;
 if(hueval<0||hueval>=360)hueval=(((hueval%360)+360)%360);
 var hue=hueval+120;
 if(hue>=360)hue-=360;
 if (hue<60) r=(a+(b-a)*hue/60);
 else if (hue<180) r=b;
 else if (hue<240) r=(a+(b-a)*(240-hue)/60);
 else r=a;
 hue=hueval;
 if (hue<60) g=(a+(b-a)*hue/60);
 else if (hue<180) g=b;
 else if (hue<240) g=(a+(b-a)*(240-hue)/60);
 else g=a;
 hue=hueval-120;
 if(hue<0)hue+=360;
 if (hue<60) bl=(a+(b-a)*hue/60);
 else if (hue<180) bl=b;
 else if (hue<240) bl=(a+(b-a)*(240-hue)/60);
 else bl=a;
 return [(r<0 ? 0 : (r>255 ? 255 : r)),
 (g<0 ? 0 : (g>255 ? 255 : g)),
 (bl<0 ? 0 : (bl>255 ? 255 : bl))];
};
CanvasBackground.component2hex=function(n){
 var str="0"+(n|0).toString(16);
 return str.substring(str.length-2,str.length);
};
CanvasBackground.hls2hex=function(n){
 n=CanvasBackground.hls2rgb(n);
 return "#"+CanvasBackground.component2hex(n[0])+
 CanvasBackground.component2hex(n[1])+
 CanvasBackground.component2hex(n[2]);
};
CanvasBackground.hex2rgb=function(n){
 if(n==null || typeof n=="undefined")return null;
 var e=(/^\#([A-F0-9]{2})([A-F0-9]{2})([A-F0-9]{2})$/i).exec(n);
 if(e){
  return [parseInt(e[1],16),parseInt(e[2],16),parseInt(e[3],16)];
 }
 return null;
};
CanvasBackground.prototype.setColor=function(color){
 var rgb=this.constructor.hex2rgb(color);
 if(!rgb)throw new Error("invalid color parameter");
 this.color=rgb;
 this.hls=this.constructor.rgb2hls(rgb);
 this.drawBack();
}
CanvasBackground.prototype.drawBack=function(){
 document.body.style.backgroundColor=this.constructor.hls2hex(this.hls);
 if(this.use3d){
  var rgb=this.constructor.hls2rgb(this.hls);
  var vertex="\
attribute vec3 position;\
attribute vec3 normal;\
uniform mat4 world;\
uniform mat4 view;\
uniform mat4 projection;\
varying vec3 normalVar;\
varying vec3 viewPositionVar;\
void main(){\
vec4 positionVec4=vec4(position,1.0);\
gl_Position=projection*view*world*positionVec4;\
viewPositionVar=vec3(view*world*positionVec4);\
normalVar=vec3(world*vec4(normal,0.0));\
}"
  var fragment="\
precision mediump float;\
uniform vec3 sa;\
uniform vec3 sd;\
uniform vec3 ss;\
uniform vec3 sdir;\
uniform vec3 ma;\
uniform vec3 md;\
uniform vec3 ms;\
uniform float mshin;\
uniform vec3 color;\
uniform float alpha;\
varying vec3 normalVar;\
varying vec3 viewPositionVar;\
void main(){\
 vec3 phong=(sa*ma)+(ss*ms*pow(max(dot(reflect(sdir,normalVar),\
    normalize(viewPositionVar)),0.0),mshin))+(sd*md*max(dot(normalVar,sdir),0.0));\
 gl_FragColor=vec4(phong*color,alpha);\
}"
  var uniformValues={};
  // light data
  uniformValues["sa"]=[4,4,4]; // source ambient color
  uniformValues["sd"]=[2,2,2]; // source diffuse color
  uniformValues["ss"]=[0,0,0]; // source specular color
  uniformValues["sdir"]=[0,0,-1]; // directs the light uniformly across all objects on the screen
  uniformValues["ma"]=[0.2,0.2,0.2]; // material ambient color
  uniformValues["md"]=[1,1,1]; // material diffuse color
  uniformValues["ms"]=[1,1,1]; // material specular color
  uniformValues["mshin"]=[0]; // material shininess
  // matrices
  uniformValues["projection"]=GLUtil.mat4identity();
  uniformValues["view"]=GLUtil.mat4identity();
  var width=this.context.canvas.width*1;
  var height=this.context.canvas.height*1;
  this.uniforms=uniformValues;
  this._initDebugFps();
  var program=GLUtil.compileShaders(this.context,vertex,fragment);
  var actives=GLUtil.getActives(this.context,program);
  this.position=actives["position"];
  this.modelMatrix=actives["world"];
  var perspectiveMatrix=actives["world"];
  this.attribColor=actives["color"];
  this.attribAlpha=actives["alpha"];
  this.attribNormal=actives["normal"];
  this.cubeMesh=GLUtil.createCube(this.context);
  this.actives=actives;
  this.fadingIn=[];
  this.fadingOut=[];
  GLUtil.initColorAndDepth(this.context,
    rgb[0]/255.0,rgb[1]/255.0,rgb[2]/255.0, 1.0,
    999999.0, this.context.LEQUAL);
  GLUtil.setUniforms(this.context,this.actives,this.uniforms);
  this.animate();
 } else {
  this.context.fillStyle=this.constructor.hls2hex(this.hls);
  this.context.fillRect(0,0,this.width,this.height);
 }
}
CanvasBackground.prototype._initDebugFps=function(){
  this.lastFrame=-1;
  this.frameGaps=[]
  this.frameCount=0;
}
CanvasBackground.prototype.debugFps=function(){
 var now=window.performance.now();
  if(this.lastFrame>=0){
    var gap=now-this.lastFrame;
    if(this.frameGaps.length>300)
     this.frameGaps.shift();
    if(gap>5000){
     // treat as a discontinuity, so discard all the
     // frame gaps recorded so far
     this.frameGaps=[];
    }
    this.frameGaps.push(gap);
  }
  this.lastFrame=now;
  this.frameCount++;
  if(this.frameGaps.length>0 && this.frameCount>=30){
    this.frameCount=0;
    var total=0;
    for(var i=0;i<this.frameGaps.length;i++){
      total+=this.frameGaps[i];
    }
    total/=1.0*this.frameGaps.length;
    var fps=(total<=0) ? 60 : 1000.0/total;
    console.log(fps+" fps");
  }
}
CanvasBackground.prototype.animate=function(){
  GLUtil.renderShapes(this.context,
   this.shapes,this.position, -1,
   this.attribNormal, this.modelMatrix);
  callRequestFrame(this.animate.bind(this));
}
CanvasBackground.prototype.drawOne=function(){
 var newhls=this.constructor.varyColor(this.hls);
 if(this.use3d){
  if(this.shapes.length>300){
   // Delete the oldest shape generated
   var lastShape=this.shapes.shift();
  }
  var x=(this.constructor.rand(2000)/1000.0)-1.0;
  var y=(this.constructor.rand(2000)/1000.0)-1.0;
  var z=(this.constructor.rand(60))/60.0;
  var radius=(16+this.constructor.rand(100))/1000.0;
  var rgb=this.constructor.hls2rgb(newhls);
  rgb[0]/=255
  rgb[1]/=255
  rgb[2]/=255
   var angle=this.constructor.rand(160);
   var vector=[
     (this.constructor.rand(60))/30.0,
     (this.constructor.rand(60))/30.0,0]
   var shape=new Shape(this.context,this.cubeMesh);
   shape.setScale(radius,radius,radius);
   shape.setRotation(angle,vector);
   shape.setPosition(x,y,z);
   shape.addUniform3f(this.attribColor,rgb[0],rgb[1],rgb[2]);
   shape.addUniform1f(this.attribAlpha,1.0);
   this.shapes.push(shape);
 } else {
  var rect=[this.constructor.rand(this.width+30)-30,
    this.constructor.rand(this.height+30)-30,
    32+this.constructor.rand(200),
    32+this.constructor.rand(200)];
  this.context.fillStyle=this.constructor.hls2hex(newhls);
  this.context.fillRect(rect[0],rect[1],rect[2],rect[3]);
 }
};
CanvasBackground.colorBackground=function(color){
$(document).ready(function(){
 var canvas=new CanvasBackground(color);
 window.setInterval(function(){
   canvas.drawOne();
 },100);
});
};