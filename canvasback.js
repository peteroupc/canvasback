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
  context.depthFunc(depthFunc);
  context.clearColor(r,g,b, (typeof a=="undefined") ? 1.0 : a);
  context.clearDepth(depth);
  context.clear(context.COLOR_BUFFER_BIT | context.DEPTH_BIT);
},
renderShapes:function(context,shapes,position,color,normal,matrix){
  for(var i=0;i<shapes.length;i++){
   shapes[i].render(position,color,normal,matrix);
  }
  context.flush();
},
createVerticesAndFaces:function(context, vertices, faces){
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
   facesLength: faces.length, type:type};
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
mat4identity:function(){
 return [1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]
},
vec3normalize:function(v){
	var len = Math.sqrt(v[0]*v[0] + v[1]*v[1] + v[2]*v[2]);
	return [v[0]/len, v[1]/len, v[2]/len];
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
mat4rotVecDegrees:function(mat, angle, v){
v=GLUtil.vec3normalize(v);
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

function Shape(context,vertfaces,format,scale){
  this.vertfaces=vertfaces;
  this.context=context;
  this.format=format;
  this.scale=scale;
  this.angle=0;
  this.position=[0,0,0];
  this.vector=[0,0,0];
  this.calcMatrix();
}
Shape.VEC2DCOLOR=0;
Shape.VEC3DCOLOR=1;
Shape.VEC2D=2;
Shape.VEC3D=3;
Shape.VEC3DNORMALCOLOR=4;
Shape.prototype.calcMatrix=function(){
  this.matrix=GLUtil.mat4identity();
  this.matrix=GLUtil.mat4scaleVec3(this.matrix,[this.scale,this.scale,this.scale]);
  this.matrix=GLUtil.mat4rotVecDegrees(this.matrix,this.angle,this.vector);
  this.matrix[12]+=this.position[0];
  this.matrix[13]+=this.position[1];
  this.matrix[14]+=this.position[2];
}
Shape.prototype.setPosition=function(x,y,z){
  this.position=[x,y,z];
  this.calcMatrix();
  return this;
}
Shape.prototype.setRotation=function(angle, vector){
  this.angle=angle;
  this.vector=vector;
  this.calcMatrix();
  return this;
}
Shape.prototype.render=function(attribPosition, attribColor, attribNormal, uniformMatrix){
  this.context.bindBuffer(this.context.ARRAY_BUFFER, this.vertfaces.verts);
  if(this.format==this.constructor.VEC2DCOLOR){
   this.context.vertexAttribPointer(attribPosition, 2, 
     this.context.FLOAT, false, 5*4, 0);
   this.context.vertexAttribPointer(attribColor, 3, 
     this.context.FLOAT, false, 5*4, 2*4);  
  } else if(this.format==this.constructor.VEC3DCOLOR){
  this.context.vertexAttribPointer(attribPosition, 3, 
    this.context.FLOAT, false, 6*4, 0);
  this.context.vertexAttribPointer(attribColor, 3, 
    this.context.FLOAT, false, 6*4, 3*4);
  } else if(this.format==this.constructor.VEC3DNORMALCOLOR){
  this.context.vertexAttribPointer(attribPosition, 3, 
    this.context.FLOAT, false, 9*4, 0);
  if(attribNormal!==null && attribNormal>=0){
   this.context.vertexAttribPointer(attribNormal, 3, 
     this.context.FLOAT, false, 9*4, 3*4);
  }
  this.context.vertexAttribPointer(attribColor, 3, 
    this.context.FLOAT, false, 9*4, 6*4);
  } else if(this.format==this.constructor.VEC2D){
   this.context.vertexAttribPointer(attribPosition, 2, 
     this.context.FLOAT, false, 2*4, 0);
  } else if(this.format==this.constructor.VEC3D){
   this.context.vertexAttribPointer(attribPosition, 3, 
     this.context.FLOAT, false, 3*4, 0);  
  }
  if(uniformMatrix!==null){
   this.context.uniformMatrix4fv(uniformMatrix,false,this.matrix);  
  }
  this.context.bindBuffer(this.context.ELEMENT_ARRAY_BUFFER, this.vertfaces.faces);
  this.context.drawElements(this.context.TRIANGLES, 
    this.vertfaces.facesLength,
    this.vertfaces.type, 0);
}

function createCube(context,color,radius){
 var r=color[0];
 var g=color[1];
 var b=color[2];
 // Position X, Y, Z, normal NX, NY, NZ, color R, G, B
 var vertices=[
  -1.0, -1.0, 1.0, -1, 0, 0, r, g, b,
 -1.0, 1.0, 1.0, -1, 0, 0, r, g, b,
 -1.0, 1.0, -1.0, -1, 0, 0, r, g, b,
 -1.0, -1.0, -1.0, -1, 0, 0, r, g, b,
 1.0, -1.0, -1.0, 1, 0, 0, r, g, b,
 1.0, 1.0, -1.0, 1, 0, 0, r, g, b,
 1.0, 1.0, 1.0, 1, 0, 0, r, g, b,
 1.0, -1.0, 1.0, 1, 0, 0, r, g, b,
 1.0, -1.0, -1.0, 0, -1, 0, r, g, b,
 1.0, -1.0, 1.0, 0, -1, 0, r, g, b,
 -1.0, -1.0, 1.0, 0, -1, 0, r, g, b,
 -1.0, -1.0, -1.0, 0, -1, 0, r, g, b,
 1.0, 1.0, 1.0, 0, 1, 0, r, g, b,
 1.0, 1.0, -1.0, 0, 1, 0, r, g, b,
 -1.0, 1.0, -1.0, 0, 1, 0, r, g, b,
 -1.0, 1.0, 1.0, 0, 1, 0, r, g, b,
 -1.0, -1.0, -1.0, 0, 0, -1, r, g, b,
 -1.0, 1.0, -1.0, 0, 0, -1, r, g, b,
 1.0, 1.0, -1.0, 0, 0, -1, r, g, b,
 1.0, -1.0, -1.0, 0, 0, -1, r, g, b,
 1.0, -1.0, 1.0, 0, 0, 1, r, g, b,
 1.0, 1.0, 1.0, 0, 0, 1, r, g, b,
 -1.0, 1.0, 1.0, 0, 0, 1, r, g, b,
 -1.0, -1.0, 1.0, 0, 0, 1, r, g, b
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
 return new Shape(
   context,
   GLUtil.createVerticesAndFaces(context,vertices,faces),
   Shape.VEC3DNORMALCOLOR,
   radius);
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
  this.canvas=canvas;
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
 var newLum=n[1];
 if(newLum<=15){
  newLum=CanvasBackground.rand(30);
 } else if(newLum>255-15){
  newLum=(255-15)+CanvasBackground.rand(30); 
 } else {
  newLum=(newLum-15)+CanvasBackground.rand(30);  
 }
 var newSat=n[2];
 if(newSat<=15){
  newSat=CanvasBackground.rand(30);
 } else if(newSat>255-15){
  newSat=(255-15)+CanvasBackground.rand(30); 
 } else {
  newSat=(newSat)+CanvasBackground.rand(30);  
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
attribute vec3 color;\
uniform mat4 matrix;/* currently used only for the model transform */\
varying vec3 colorVar;\
varying vec3 normalVar;\
varying vec3 viewPositionVar;\
void main(){\
vec4 positionVec4=vec4(position,1.0);\
colorVar=color;\
gl_Position=matrix*positionVec4;\
viewPositionVar=vec3(gl_Position);\
normalVar=vec3(matrix*vec4(normal,0.0));\
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
varying vec3 colorVar;\
varying vec3 normalVar;\
varying vec3 viewPositionVar;\
void main(){\
 vec3 phong=(sa*ma)+(ss*ms*pow(max(dot(reflect(sdir,normalVar),\
    normalize(viewPositionVar)),0.0),mshin))+(sd*md*max(dot(normalVar,sdir),0.0));\
 gl_FragColor=vec4(phong*colorVar,1.0);\
}"
  var uniformValues={};
  uniformValues["sa"]=[4,4,4];
  uniformValues["sd"]=[2,2,2];
  uniformValues["ss"]=[0,0,0];
  uniformValues["sdir"]=[0,0,-1];
  uniformValues["ma"]=[0.2,0.2,0.2];
  uniformValues["md"]=[1,1,1];
  uniformValues["ms"]=[1,1,1];
  this.uniforms=uniformValues;
  var program=GLUtil.compileShaders(this.context,vertex,fragment);
  var actives=GLUtil.getActives(this.context,program);
  this.position=actives["position"];
  this.modelMatrix=actives["matrix"]
  this.attribColor=actives["color"];
  this.attribNormal=actives["normal"];
  this.actives=actives;
  GLUtil.initColorAndDepth(this.context,
    rgb[0]/255.0,rgb[1]/255.0,rgb[2]/255.0, 1.0, 
    999999.0, this.context.LEQUAL);
  for(var i in uniformValues){
    if(uniformValues.hasOwnProperty(i)){
      v=uniformValues[i];
      this.context.uniform3f(actives[i], v[0],v[1],v[2]);
    }
  }
  this.context.uniform1f(actives["mshin"],1.0);
  this.animate();
 } else {
  this.context.fillStyle=this.constructor.hls2hex(this.hls);
  this.context.fillRect(0,0,this.width,this.height); 
 }
}
CanvasBackground.prototype.animate=function(){
  GLUtil.renderShapes(this.context,
   this.shapes,this.position, this.attribColor, 
   this.attribNormal, this.modelMatrix);
  callRequestFrame(this.animate.bind(this));
}
CanvasBackground.prototype.drawOne=function(){
 var newhls=this.constructor.varyColor(this.hls);
 if(this.use3d){
  var x=(this.constructor.rand(2000)/1000.0)-1.0;
  var y=(this.constructor.rand(2000)/1000.0)-1.0;
  var z=(this.constructor.rand(60))/60.0;
  var radius=(16+this.constructor.rand(100))/1000.0;
  var rgb=this.constructor.hls2rgb(newhls);
  rgb[0]/=255
  rgb[1]/=255
  rgb[2]/=255
   var shape=createCube(this.context,rgb,radius);
   var angle=this.constructor.rand(160);
   var vector=[
     (this.constructor.rand(60))/30.0,
     (this.constructor.rand(60))/30.0,0]
   shape.setRotation(angle,vector);
   shape.setPosition(x,y,z);
   // TODO: When there are many shapes, copy the canvas's
   // contents to a temporary buffer, clear the shapes, and
   // copy the contents back
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