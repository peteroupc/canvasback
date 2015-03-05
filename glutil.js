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
 } else if(vertices.length<=256 && faces.length<=256){
  type=context.UNSIGNED_BYTE;
  context.bufferData(context.ELEMENT_ARRAY_BUFFER,
    new Uint8Array(faces), context.STATIC_DRAW);
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
      x*=len;
      y*=len;
      z*=len;
      // add normalized normal to each vertex of the face
      vertices[v1+3]+=x
      vertices[v1+4]+=y
      vertices[v1+5]+=z
      vertices[v2+3]+=x
      vertices[v2+4]+=y
      vertices[v2+5]+=z
      vertices[v3+3]+=x
      vertices[v3+4]+=y
      vertices[v3+5]+=z
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
      vertices[i+3]=x*len;
      vertices[i+4]=y*len;
      vertices[i+5]=z*len;
    }
  }
},
createSphere:function(context,radius,count) {
 if(typeof radius=="undefined")radius=1.0;
 if(typeof div=="undefined")count=6;
 function pushMidpoint(points,a,b){
  var newpt=GLUtil.vec3normInPlace([
    (points[a]+points[b])*0.5,
    (points[a+1]+points[b+1])*0.5,
    (points[a+2]+points[b+2])*0.5]);
  points.push(newpt[0],newpt[1],newpt[2],0,0,0,0,0);
 }
 function adjustPoleTex(points,tris,triOffset,pointPole,point2,point3){
   var tx;
   var pxPole=tris[triOffset+pointPole]*8;
   var px2=tris[triOffset+point2]*8;
   var px3=tris[triOffset+point3]*8;
   var tx=(points[px2+6]+points[px3+6])*0.5;
   if(Math.abs(points[px2+6]-points[px3+6])>0.5){
        var point2Less=(points[px2+6]<points[px3+6]) ? true : false;
        var lowpt=point2Less ? point2 : point3;
        var lowpx=point2Less ? px2 : px3;
        var tx2=points[lowpx+6]+1;
        tris[triOffset+lowpt]=points.length/8;
        points.push(points[lowpx],points[lowpx+1],points[lowpx+2],
           0,0,0,tx2,points[lowpx+7]);
        tx=(point2Less) ? tx2+points[px3+6] : tx2+points[px2+6];
        tx/=2
   }
   tris[triOffset+pointPole]=points.length/8;
   points.push(points[pxPole],points[pxPole+1],points[pxPole+2],
         0,0,0,tx,points[pxPole+7]);
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
   var point1=t1*8;
   var point2=t2*8;
   var point3=t3*8;
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
 // Calculate texture coordinates
 for(var i=0;i<points.length;i+=8){
   points[i+6]=1-(0.5+(Math.atan2(points[i],points[i+2])/(Math.PI*2)));
   points[i+7]=1-(Math.acos(points[i+1])/Math.PI);
  }
  // Adjust texture coordinates
  for(var j=0;j<tris.length;j+=3){
   var point1=tris[j]*8;
   var point2=tris[j+1]*8;
   var point3=tris[j+2]*8;
   if(points[point1]==0 && points[point1+2]==0){
      adjustPoleTex(points,tris,j,0,1,2);continue
   } else if(points[point2]==0 && points[point2+2]==0){
      adjustPoleTex(points,tris,j,1,0,2);continue
   } else if(points[point3]==0 && points[point3+2]==0){
      adjustPoleTex(points,tris,j,2,0,1);continue
   }
   var px1=points[point1+6];
   var px2=points[point2+6];
   var px3=points[point3+6];
   var mintx=(px1<px2) ? (px1<px3 ? point1 : point3) :
     (px2<px3 ? point2 : point3);
   var maxtx=(px1>px2) ? (px1>px3 ? point1 : point3) :
     (px2>px3 ? point2 : point3);
   var midtx=(point1==mintx || point1==maxtx) ? ((point2==mintx || point2==maxtx) ?
         point3 : point2) : point1
   if((points[maxtx+6]-points[mintx+6])>0.5){
      var newIndex;
      newIndex=points.length/8;
      points.push(points[mintx],points[mintx+1],points[mintx+2],
         0,0,0,points[mintx+6]+1.0,points[mintx+7]);
      if(point1==mintx)tris[j]=newIndex;
      else if(point2==mintx)tris[j+1]=newIndex;
      else tris[j+2]=newIndex;
      farEnd=newIndex*8;
      if((points[maxtx+6]-points[midtx+6])>0.5){
       newIndex=points.length/8;
       var mend=points[midtx+6]+1.0
       points.push(points[midtx],points[midtx+1],points[midtx+2],
          0,0,0,points[midtx+6]+1.0,points[midtx+7]);
       if(point1==midtx)tris[j]=newIndex;
       else if(point2==midtx)tris[j+1]=newIndex;
       else tris[j+2]=newIndex;
       midEnd=newIndex*8;
      }
   }
  }
  // Multiply vertices by the given radius
 if(radius!=1.0){
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
mat4copy:function(mat){
 return mat.slice(0,16);
},
mat4invert:function(m){
var tvar0 = m[0]*m[10];
var tvar1 = m[0]*m[11];
var tvar2 = m[0]*m[5];
var tvar3 = m[0]*m[6];
var tvar4 = m[0]*m[7];
var tvar5 = m[0]*m[9];
var tvar6 = m[10]*m[12];
var tvar7 = m[10]*m[13];
var tvar8 = m[10]*m[15];
var tvar9 = m[11]*m[12];
var tvar10 = m[11]*m[13];
var tvar11 = m[11]*m[14];
var tvar12 = m[1]*m[10];
var tvar13 = m[1]*m[11];
var tvar14 = m[1]*m[4];
var tvar15 = m[1]*m[6];
var tvar16 = m[1]*m[7];
var tvar17 = m[1]*m[8];
var tvar18 = m[2]*m[11];
var tvar19 = m[2]*m[4];
var tvar20 = m[2]*m[5];
var tvar21 = m[2]*m[7];
var tvar22 = m[2]*m[8];
var tvar23 = m[2]*m[9];
var tvar24 = m[3]*m[10];
var tvar25 = m[3]*m[4];
var tvar26 = m[3]*m[5];
var tvar27 = m[3]*m[6];
var tvar28 = m[3]*m[8];
var tvar29 = m[3]*m[9];
var tvar30 = m[4]*m[10];
var tvar31 = m[4]*m[11];
var tvar32 = m[4]*m[9];
var tvar33 = m[5]*m[10];
var tvar34 = m[5]*m[11];
var tvar35 = m[5]*m[8];
var tvar36 = m[6]*m[11];
var tvar37 = m[6]*m[8];
var tvar38 = m[6]*m[9];
var tvar39 = m[7]*m[10];
var tvar40 = m[7]*m[8];
var tvar41 = m[7]*m[9];
var tvar42 = m[8]*m[13];
var tvar43 = m[8]*m[14];
var tvar44 = m[8]*m[15];
var tvar45 = m[9]*m[12];
var tvar46 = m[9]*m[14];
var tvar47 = m[9]*m[15];
var tvar48 = tvar14-tvar2;
var tvar49 = tvar15-tvar20;
var tvar50 = tvar16-tvar26;
var tvar51 = tvar19-tvar3;
var tvar52 = tvar2-tvar14;
var tvar53 = tvar20-tvar15;
var tvar54 = tvar21-tvar27;
var tvar55 = tvar25-tvar4;
var tvar56 = tvar26-tvar16;
var tvar57 = tvar27-tvar21;
var tvar58 = tvar3-tvar19;
var tvar59 = tvar4-tvar25;
var det = tvar45*tvar57 + tvar6*tvar50 + tvar9*tvar53 + tvar42*tvar54 + tvar7*tvar55 +
tvar10*tvar58 + tvar43*tvar56 + tvar46*tvar59 + tvar11*tvar48 + tvar44*tvar49 +
tvar47*tvar51 + tvar8*tvar52;
if(det==0)return GLUtil.mat4identity();
det=1.0/det;
var r=[]
r[0] = m[6]*tvar10 - m[7]*tvar7 + tvar41*m[14] - m[5]*tvar11 - tvar38*m[15] + m[5]*tvar8;
r[1] = m[3]*tvar7 - m[2]*tvar10 - tvar29*m[14] + m[1]*tvar11 + tvar23*m[15] - m[1]*tvar8;
r[2] = m[13]*tvar54 + m[14]*tvar56 + m[15]*tvar49;
r[3] = m[9]*tvar57 + m[10]*tvar50 + m[11]*tvar53;
r[4] = m[7]*tvar6 - m[6]*tvar9 - tvar40*m[14] + m[4]*tvar11 + tvar37*m[15] - m[4]*tvar8;
r[5] = m[2]*tvar9 - m[3]*tvar6 + m[14]*(tvar28-tvar1) + m[15]*(tvar0-tvar22);
r[6] = m[12]*tvar57 + m[14]*tvar59 + m[15]*tvar51;
r[7] = m[8]*tvar54 + m[10]*tvar55 + m[11]*tvar58;
r[8] = m[5]*tvar9 - tvar41*m[12] + tvar40*m[13] - m[4]*tvar10 + m[15]*(tvar32-tvar35);
r[9] = tvar29*m[12] - m[1]*tvar9 + m[13]*(tvar1-tvar28) + m[15]*(tvar17-tvar5);
r[10] = m[12]*tvar50 + m[13]*tvar55 + m[15]*tvar52;
r[11] = m[8]*tvar56 + m[9]*tvar59 + m[11]*tvar48;
r[12] = tvar38*m[12] - m[5]*tvar6 - tvar37*m[13] + m[4]*tvar7 + m[14]*(tvar35-tvar32);
r[13] = m[1]*tvar6 - tvar23*m[12] + m[13]*(tvar22-tvar0) + m[14]*(tvar5-tvar17);
r[14] = m[12]*tvar53 + m[13]*tvar58 + m[14]*tvar48;
r[15] = m[8]*tvar49 + m[9]*tvar51 + m[10]*tvar52;
for(var i=0;i<16;i++){
 r[i]*=det;
}
return r;
},
mat4inverseTranspose3:function(m4){
 // Operation equivalent to transpose(invert(mat3(m4)))
var m=[m4[0],m4[1],m4[2],m4[4],m4[5],m4[6],
   m4[8],m4[9],m4[10]];
var det=m[0] * m[4] * m[8] +
m[3] * m[7] * m[2] +
m[6] * m[1] * m[5] -
m[6] * m[4] * m[2] -
m[3] * m[1] * m[8] -
m[0] * m[7] * m[5];
if(det==0) {
return [1,0,0,0,1,0,0,0,1];
}
det=1.0/det;
return [
 (-m[5] * m[7] + m[4] * m[8])*det,
 (m[2] * m[7] - m[1] * m[8])*det,
 (-m[2] * m[4] + m[1] * m[5])*det,
 (m[5] * m[6] - m[3] * m[8])*det,
 (-m[2] * m[6] + m[0] * m[8])*det,
 (m[2] * m[3] - m[0] * m[5])*det,
 (-m[4] * m[6] + m[3] * m[7])*det,
 (m[1] * m[6] - m[0] * m[7])*det,
 (-m[1] * m[3] + m[0] * m[4])*det]
},
mat4scaleVec3:function(mat,v3, v3y, v3z){
  var scaleX,scaleY,scaleZ;
  if(typeof v3y!="undefined" && typeof v3z!="undefined"){
      scaleX=v3;
      scaleY=v3y;
      scaleZ=v3z;
  } else {
      scaleX=v3[0];
      scaleY=v3[1];
      scaleZ=v3[2];
  }
	return [
		mat[0]*scaleX, mat[1]*scaleY, mat[2]*scaleZ, mat[3],
		mat[4]*scaleX, mat[5]*scaleY, mat[6]*scaleZ, mat[7],
		mat[8]*scaleX, mat[9]*scaleY, mat[10]*scaleZ, mat[11],
		mat[12]*scaleX, mat[13]*scaleY, mat[14]*scaleZ, mat[15]
	];
},
mat3identity:function(){
 return [1,0,0,0,1,0,0,0,1];
},
mat4scaledVec3:function(v3){
  return [v3[0],0,0,0,0,v3[1],0,0,0,0,v3[2],0,0,0,0,1]
},
mat4translatedVec3:function(v3){
  return [1,0,0,0,0,1,0,0,0,0,1,0,v3[0],v3[1],v3[2],1]
},
mat4perspective:function(fovY,aspectRatio,nearZ,farZ){
 var f = 1/Math.tan(fovY*Math.PI/360);
 var nmf = nearZ-farZ;
 nmf=1/nmf;
 return [f/aspectRatio, 0, 0, 0, 0, f, 0, 0, 0, 0,
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
 var width=1/(r-l);
 var height=1/(t-b);
 var depth=1/(f-n);
 return [2*width,0,0,0,0,2*height,0,0,0,0,2*depth,0,
   -(l+r)*width,-(t+b)*height,-(n+f)*depth,1];
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
mat4multiply:function(a,b){
  var dst=[];
	for(var i = 0; i < 16; i+= 4){
		for(var j = 0; j < 4; j++){
			dst[i+j] =
				b[i]   * a[j]   +
				b[i+1] * a[j+4] +
				b[i+2] * a[j+8] +
				b[i+3] * a[j+12];
    }
  }
  return dst;
},
mat4rotateVec:function(mat, angle, v, vy, vz){
if(typeof vy!="undefined" && typeof vz!="undefined"){
  v=GLUtil.vec3norm([v,vy,vz]);
} else {
  v=GLUtil.vec3norm(v);
}
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
      var uniform=this.get(i);
      if(uniform===null)continue;
      //console.log("setting "+i+": "+v);
      if(v.length==3){
       this.context.uniform3f(uniform, v[0],v[1],v[2]);
      } else if(v.length==4){
       this.context.uniform4f(uniform, v[0],v[1],v[2],v[3]);
      } else if(v.length==16){
       this.context.uniformMatrix4fv(uniform,false,v);
      } else if(v.length==9){
       this.context.uniformMatrix3fv(uniform,false,v);
      } else {
       if(this.uniformTypes[i]==this.context.FLOAT){
        this.context.uniform1f(uniform, (typeof v=="number") ? v : v[0]);
       } else {
        this.context.uniform1i(uniform, (typeof v=="number") ? v : v[0]);
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
 "lightPosition":light.position,
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
"uniform mat4 viewInverse; /* internal */\n" +
"uniform mat3 modelInverseTrans3; /* internal */\n" +
"uniform mat4 projection;\n" +
"uniform float alpha;\n"+
"uniform vec4 lightPosition;\n" + // source light direction
"uniform vec3 sa;\n" + // source light ambient color
"uniform vec3 ma;\n" + // material ambient color (-1 to -1 each component).
"uniform vec3 sd;\n" + // source light diffuse color
"uniform vec3 md;\n" + // material diffuse color (0-1 each component). Is multiplied by texture/solid color.
"uniform vec3 ss;\n" + // source light specular color
"uniform vec3 ms;\n" + // material specular color (0-1 each comp.).  Affects how intense highlights are.
"uniform float mshin;\n" + // material shininess
"varying vec2 textureUVVar;\n"+
"varying vec3 ambientAndSpecularVar;\n" +
"varying vec3 diffuseVar;\n" +
"void main(){\n" +
"vec4 positionVec4=vec4(position,1.0);\n" +
"vec4 worldPosition=world*positionVec4;\n" +
"vec4 viewWorldPosition=view*world*positionVec4;\n" +
"vec3 sdir;\n"+
"float attenuation;\n"+
"if(lightPosition.w == 0.0){\n" +
" sdir=normalize(vec3(lightPosition));\n" +
" attenuation=1.0;\n" +
"} else {\n"+
" vec3 vertexToLight=vec3(lightPosition-viewWorldPosition);\n"+
" float dist=length(vertexToLight);\n"+
" sdir=normalize(vertexToLight);\n" +
" attenuation=1.0/(1.0*dist);\n" +
"}\n"+
"vec3 transformedNormal=normalize(modelInverseTrans3*normal);\n" +
"vec3 ambientAndSpecular=sa*ma;\n" +
"float diffInt=dot(transformedNormal,sdir);" +
"vec3 viewPosition=normalize(vec3(viewInverse*vec4(0,0,0,1)-worldPosition));\n" +
"if(diffInt>=0.0){\n" +
"   // specular reflection\n" +
"   ambientAndSpecular+=(ss*ms*pow(max(dot(reflect(-sdir,transformedNormal)," +
"      viewPosition),0.0),mshin));\n" +
"}\n"+
"diffuseVar=sd*md*max(0.0,dot(transformedNormal,sdir))*attenuation;\n" +
"ambientAndSpecularVar=ambientAndSpecular;\n"+
"textureUVVar=textureUV;\n"+
"gl_Position=projection*view*world*positionVec4;\n" +
"}";
};
ShaderProgram.getDefaultFragment=function(){
return "" +
"precision highp float;\n" +
"uniform sampler2D sampler;\n" + // texture sampler
"uniform int useTexture;\n" + // use texture sampler rather than solid color if nonzero
"uniform vec4 color;\n" + // solid color
"varying vec2 textureUVVar;\n"+
"varying vec3 ambientAndSpecularVar;\n" +
"varying vec3 diffuseVar;\n" +
"void main(){\n" +
" vec4 baseColor=(useTexture==0) ? color : texture2D(sampler,textureUVVar);\n" +
" vec3 phong=ambientAndSpecularVar+diffuseVar*baseColor.rgb;\n" +
" gl_FragColor=vec4(phong,baseColor.a);\n" +
"}";
};
function MaterialShade(ambient, diffuse, specular,shininess) {
 this.shininess=(shininess==null) ? 1 : Math.max(0,shininess);
 this.ambient=ambient||[0.2,0.2,0.2];
 this.diffuse=diffuse||[1,1,1];
 this.specular=specular||[0.2,0.2,0.2];
}
function LightSource(position, diffuse, specular) {
 this.position=position ? [position[0],position[1],position[2],1.0] :[0, 0, 0, 0];
 this.diffuse=diffuse||[1, 1, 1];
 this.specular=specular||[0.2,0.2,0.2];
};
LightSource.directionalLight=function(position,diffuse,specular){
 var source=new LightSource()
 source.direction=null;
 source.position=position ? [position[0],position[1],position[2],0.0] : [0,1,2,1];
 source.diffuse=diffuse||[1,1,1];
 source.specular=specular||[0.2,0.2,0.2];
 return source;
};
LightSource.pointLight=function(position,diffuse,specular){
 var source=new LightSource()
 source.direction=null;
 source.position=position ? [position[0],position[1],position[2],1.0] : [0,1,2,1];
 source.diffuse=diffuse||[1,1,1];
 source.specular=specular||[0.2,0.2,0.2];
 return source
};

(function(){
var Materials=function(context, program){
 this.textures={}
 this.context=context;
 this.colorUniform=program.get("color");
 program.setUniforms({"sampler":0});
 this.useTextureUniform=program.get("useTexture");
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
  var uniforms={};
  if(this.useTextureUniform!==null){
   uniforms["useTexture"]=0;
  }
  uniforms["color"]=this.color;
  program.setUniforms(uniforms);
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
      var uniforms={};
      uniforms["useTexture"]=1;
      program.setUniforms(uniforms);
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
     context.TEXTURE_MIN_FILTER, context.LINEAR_MIPMAP_LINEAR);
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
 this._projectionMatrix=null;
 this._viewMatrix=null;
 this._matrixDirty=false;
 this._invProjectionView=null;
 this._invTransModel3=null;
 this._invView=null;
 this.ambient=null;
 this.context.blendFunc(context.SRC_ALPHA,context.ONE_MINUS_SRC_ALPHA);
 this.setProjectionMatrix(GLUtil.mat4identity())
    .setViewMatrix(GLUtil.mat4identity())
    .setLightSource(new LightSource())
    .setAmbient(0.2,0.2,0.2,1.0);
 this.program.setMaterialShade(new MaterialShade());
 this.context.enable(this.context.DEPTH_TEST);
 this.context.depthFunc(this.context.LEQUAL);
 this.context.clearColor(0,0,0,1.0);
 this.context.clearDepth(999999);
 this.context.clear(
    this.context.COLOR_BUFFER_BIT |
    this.context.DEPTH_BUFFER_BIT);
}
Scene3D.prototype.getWidth=function(){
 return this.context.viewportWidth*1.0;
}
Scene3D.prototype.getHeight=function(){
 return this.context.viewportHeight*1.0;
}
Scene3D.prototype.getAspect=function(){
 return this.getWidth()/this.getHeight();
}
Scene3D.prototype.setPerspective=function(fov, near, far){
 return this.setProjectionMatrix(GLUtil.mat4perspective(fov,
   this.getAspect(),near,far));
}
Scene3D.prototype.setAmbient=function(r,g,b,a){
 this.ambient=[r,g,b,(typeof a=="undefined") ? 1.0 : a];
 this.program.setUniforms({
 "sa":[this.ambient[0],this.ambient[1],this.ambient[2]]
 });
 return this;
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
Scene3D.prototype._updateMatrix=function(){
 if(this._matrixDirty){
  var projView=GLUtil.mat4multiply(this._projectionMatrix,this._viewMatrix);
  this._invProjectionView=GLUtil.mat4invert(projView);
  this._invView=GLUtil.mat4invert(this._viewMatrix);
  this.program.setUniforms({
   "view":this._viewMatrix,
   "projection":this._projectionMatrix,
   "viewInverse":this._invView,
  });
  this._matrixDirty=false;
 }
}
Scene3D.prototype.setProjectionMatrix=function(matrix){
 this._projectionMatrix=GLUtil.mat4copy(matrix);
 this._matrixDirty=true;
 return this;
}
Scene3D.prototype.setViewMatrix=function(matrix){
 this._viewMatrix=GLUtil.mat4copy(matrix);
 this._matrixDirty=true;
 return this;
}
Scene3D.prototype.setLightSource=function(light){
 this.program.setLightSource(light);
 return this;
}
Scene3D.prototype.render=function(){
  this._updateMatrix();
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
  this.drawLines=false;
  this._matrixDirty=true;
  this._invTransModel3=GLUtil.mat3identity();
  this.matrix=GLUtil.mat4identity();
}
Shape.prototype.setDrawLines=function(value){
 this.drawLines=value;
 return this;
}
Shape.prototype.getDrawLines=function(){
 return this.drawLines;
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
 return this;
}
Shape.prototype._updateMatrix=function(){
  this._matrixDirty=false;
  this.matrix=GLUtil.mat4scaledVec3(this.scale);
  if(this.angle!=0){
    this.matrix=GLUtil.mat4rotateVec(this.matrix,this.angle,this.vector);
  }
  this.matrix[12]+=this.position[0];
  this.matrix[13]+=this.position[1];
  this.matrix[14]+=this.position[2];
  this._invTransModel3=GLUtil.mat4inverseTranspose3(this.matrix);
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
Shape.prototype.rotate=function(angle,vector){
  this.angle+=angle;
  this.angle%=360;
  this.vector=vector;
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
    this._updateMatrix();
   }
   program.setUniforms({
    "world":this.matrix,
    "modelInverseTrans3":this._invTransModel3
   });
  }
  // Draw the shape
  this.context.drawElements(
    this.drawLines ? this.context.LINES : this.context.TRIANGLES,
    this.vertfaces.facesLength,
    this.vertfaces.type, 0);
};
