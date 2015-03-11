/*
Written by Peter O. in 2015.

Any copyright is dedicated to the Public Domain.
http://creativecommons.org/publicdomain/zero/1.0/
If you like this, you should donate to Peter O.
at: http://upokecenter.dreamhosters.com/articles/donate-now-2/
*/
function ObjData(){
  this.url=null;
  this.mtllib=null;
  this.mtl=null;
  this.meshes=[];
}
function MtlData(){
  this.url=null;
  this.list=[];
}
ObjData.prototype.toShape=function(context){
 var multi=new MultiShape();
 for(var i=0;i<this.meshes.length;i++){
  var shape=new Shape(context, this.meshes[i].data);
  var mat=this._getMaterial(this.meshes[i]);
  shape.setMaterial(mat);
  multi.add(shape);
 }
 return multi;
}
ObjData._resolvePath=function(path, name){
 // Relatively dumb for a relative path
 // resolver, but sufficient here, as it will
 // only be used with relative "mtllib"/"map_Kd"
 // strings
 var ret=path;
 var lastSlash=ret.lastIndexOf("/")
 if(lastSlash>=0){
  ret=ret.substr(0,lastSlash+1)+name.replace(/\\/g,"/");
 } else {
  ret=name.replace(/\\/g,"/");
 }
 return ret;
}
ObjData.prototype._getMaterial=function(mesh){
 if(!this.mtl || !mesh){
  return new MaterialShade();
 } else {
  if(mesh.usemtl){
   var mtl=this.mtl.getMaterial(mesh.usemtl);
   if(!mtl)return new MaterialShade();
   return mtl;
  } else {
   return new MaterialShade();
  }
 }
}
MtlData.prototype._resolveTextures=function(){
  for(var i=0;i<this.list.length;i++){
    var mtl=this.list[i].data;
    if(mtl.textureName){
     var resolvedName=ObjData._resolvePath(
       this.url,mtl.textureName);
     //console.log(resolvedName)
     this.list[i].data=new Texture(resolvedName)
       .setParams(mtl);
    }
  }
}
MtlData.prototype.getMaterial=function(name){
  for(var i=0;i<this.list.length;i++){
    if(this.list[i].name==name){
      return this.list[i].data
    }
  }
  return null;
}
MtlData._getMaterial=function(mtl){
 function xyzToRgb(xyz){
  // convert CIE XYZ to RGB
  var x=xyz[0];
  var y=xyz[1];
  var z=xyz[2];
  var rgb=[2.2878384873407613*x-0.8333676778352163*y-0.4544707958714208*z,
    -0.5116513807438615*x+1.4227583763217775*y+0.08889300175529392*z,
    0.005720409831409596*x-0.01590684851040362*y+1.0101864083734013*z]
  // ensure RGB value fits in 0..1
  var w=-Math.min(0,rgb[0],rgb[1],rgb[2]);
  if(w>0){
    rgb[0]+=w; rgb[1]+=w; rgb[2]+=w;
  }
  w=Math.max(rgb[0],rgb[1],rgb[2]);
  if(w>1){
    rgb[0]/=w; rgb[1]/=w; rgb[2]/=w;
  }
  return rgb;
 }
 var shininess=1.0;
 var ambient=null;
 var diffuse=null;
 var specular=null;
 var textureName=null;
 if(mtl.hasOwnProperty("Ns")){
  shininess=mtl["Ns"];
 }
 if(mtl.hasOwnProperty("Kd")){
  diffuse=xyzToRgb(mtl["Kd"]);
 }
 if(mtl.hasOwnProperty("map_Kd")){
  textureName=mtl["map_Kd"];
 }
 if(mtl.hasOwnProperty("Ka")){
  ambient=xyzToRgb(mtl["Ka"]);
 }
 if(mtl.hasOwnProperty("Ks")){
  specular=xyzToRgb(mtl["Ks"]);
 }
 var ret=new MaterialShade(ambient,diffuse,specular,shininess);
 if(textureName){
  ret.textureName=textureName;
 }
 return ret;
}
ObjData.loadMtlFromUrl=function(url){
 return GLUtil.loadFileFromUrl(url).then(
   function(e){
     var mtl=MtlData._loadMtl(e.text);
     if(mtl.error)return Promise.reject({url:e.url, error: mtl.error});
     var mtldata=mtl.success;
     mtldata.url=e.url;
     mtldata._resolveTextures();
     return Promise.resolve(mtldata);
   },
   function(e){
     return Promise.reject(e)
   });
}
ObjData.loadObjFromUrl=function(url){
 return GLUtil.loadFileFromUrl(url).then(
   function(e){
     var obj=ObjData._loadObj(e.text);
     if(obj.error)return Promise.reject({url:e.url, error:obj.error});
     obj=obj.success
     obj.url=e.url;
     if(obj.mtllib){
       // load the material file if available
       var mtlURL=ObjData._resolvePath(e.url,obj.mtllib);
       return ObjData.loadMtlFromUrl(mtlURL).then(
        function(result){
          obj.mtl=result;
          return Promise.resolve(obj);
        }, function(result){
          obj.mtl=null;
          console.log(result)
          return Promise.resolve(obj);
        });
     } else {
       // otherwise just return the object
       return Promise.resolve(obj);
     }
     return {url: e.url, obj: GLUtil._loadObj(e.text)};
   },
   function(e){
     return Promise.reject(e)
   });
}
MtlData._loadMtl=function(str){
 var number="(-?(?:\\d+\\.?\\d*|\\d*\\.\\d+)(?:[Ee][\\+\\-]?\\d+)?)"
 var nonnegInteger="(\\d+)"
 var oneNumLine=new RegExp("^(Ns|d|Tr|Ni|Ke)\\s+"+number+"\\s*$")
 var oneIntLine=new RegExp("^(illum)\\s+"+nonnegInteger+"\\s*$")
 var threeNumLine=new RegExp("^(Kd|Ka|Ks|Tf)\\s+"+number+"\\s+"+number
   +"\\s+"+number+"\\s*$")
 var mapLine=new RegExp("^(map_Kd|map_bump|map_Ka|map_Ks)\\s+(.*?)\\s*$")
 var newmtlLine=new RegExp("^newmtl\\s+([^\\s]+)$")
 var faceStart=new RegExp("^f\\s+")
 var lines=str.split(/\r?\n/)
 var firstLine=true;
 var materials=[];
 var currentMat=null;
 for(var i=0;i<lines.length;i++){
  var line=lines[i];
  // skip empty lines
  if(line.length==0)continue;
  // skip comments
  if(line.charAt(0)=="#")continue;
  while(line.charAt(line.length-1)=="\\" &&
    i+1<line.length){
    // The line continues on the next line
   line=line.substr(0,line.length-1);
   line+=" "+lines[i+1];
   i++;
  }
  if(line.charAt(line.length-1)=="\\"){
   line=line.substr(0,line.length-1);
  }
  if(firstLine && !(/^newmtl\s+/)){
   return {error: "newmtl not the first line in MTL file"};
  }
  firstLine=false;
  var e=newmtlLine.exec(line)
  if(e){
    var name=e[1];
    currentMat={};
    materials.push({name:name, data: currentMat});
    continue;
  }
  e=threeNumLine.exec(line)
  if(e){
    currentMat[e[1]]=[parseFloat(e[2]),parseFloat(e[3]),parseFloat(e[4])];
    continue;
  }
  e=oneNumLine.exec(line)
  if(e){
    currentMat[e[1]]=parseFloat(e[2]);
    continue;
  }
  e=mapLine.exec(line)
  if(e){
     // only allow relative paths
    if((/^(?![\/\\])([^\:\?\#\s]+)$/).test(e[2])){
     currentMat[e[1]]=e[2];
    }
    continue;
  }
  e=oneIntLine.exec(line)
  if(e){
    currentMat[e[1]]=[parseInt(e[2],10)];
    continue;
  }
  return {error: new Error("unsupported line: "+line)}
 }
 var mtl=new MtlData();
 mtl.list=materials;
 for(var i=0;i<mtl.list.length;i++){
  mtl.list[i].data=MtlData._getMaterial(mtl.list[i].data)
 }
 return {success: mtl};
}
ObjData._recalcNormalsSingleFace=function(vertices,indices,stride){
  if(indices.length<3)return;
  // Reset to zero all normals involved
  for(var i=0;i<indices.length;i++){
    var v4=indices[i]*stride;
    vertices[v4+3]=0.0
    vertices[v4+4]=0.0
    vertices[v4+5]=0.0
  }
  for(var i=0;i<indices.length;i++){
    var v1=indices[i]*stride
    var vPrev=(i==0) ? indices[indices.length-1] : indices[i-1]*stride
    var vNext=(i==indices.length-1) ? indices[0]*stride : indices[i+1]*stride
    var n1=[vertices[vPrev]-vertices[vNext],vertices[vPrev+1]-vertices[vNext+1],vertices[vPrev+2]-vertices[vNext+2]]
    var n2=[vertices[v1]-vertices[vNext],vertices[v1+1]-vertices[vNext+1],vertices[v1+2]-vertices[vNext+2]]
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
      for(var j=0;j<indices.length;j++){
        var v4=indices[j]*stride;
        vertices[v4+3]+=x;
        vertices[v4+4]+=x;
        vertices[v4+5]+=x;
      }
    }
  }
  // Normalize each normal of each vertex involved
  for(var i=0;i<indices.length;i++){
    var v4=indices[i]*stride;
    var x=vertices[v4+3];
    var y=vertices[v4+4];
    var z=vertices[v4+5];
    len=Math.sqrt(x*x+y*y+z*z);
    if(len){
      len=1.0/len;
      vertices[v4+3]=x*len;
      vertices[v4+4]=y*len;
      vertices[v4+5]=z*len;
    }
  }
}
ObjData._loadObj=function(str){
 function pushVertex(verts,faces,look,
   v1,v2,v3,n1,n2,n3,u1,u2){
   var lookBack=faces.length-Math.min(20,faces.length);
   lookBack=Math.max(lookBack,look);
   // check if a recently added vertex already has the given
   // values
   for(var i=faces.length-1;i>=lookBack;i--){
    var vi=faces[i]*8;
    if(verts[vi]==v1 && verts[vi+1]==v2 && verts[vi+2]==v3 &&
        verts[vi+3]==n1 && verts[vi+4]==n2 && verts[vi+5]==n3 &&
        verts[vi+6]==u1 && verts[vi+7]==u2){
     // found it
     faces.push(faces[i]);
     return;
    }
   }
   var ret=verts.length/8;
   verts.push(v1,v2,v3,n1,n2,n3,u1,u2);
   faces.push(ret);
 }
 var number="(-?(?:\\d+\\.?\\d*|\\d*\\.\\d+)(?:[Ee][\\+\\-]?\\d+)?)"
 var nonnegInteger="(\\d+)"
 var vertexOnly=new RegExp("^"+nonnegInteger+"($|\\s+)")
 var vertexNormalOnly=new RegExp("^"+nonnegInteger+"\\/\\/"+nonnegInteger+"($|\\s+)")
 var vertexUVOnly=new RegExp("^"+nonnegInteger+"\\/"+
   nonnegInteger+"($|\\s+)")
 var vertexUVNormal=new RegExp("^"+nonnegInteger+"\\/"+nonnegInteger+
   "\\/"+nonnegInteger+"($|\\s+)")
 var vertexLine=new RegExp("^v\\s+"+number+"\\s+"+number+"\\s+"+number+"\\s*$")
 var uvLine=new RegExp("^vt\\s+"+number+"\\s+"+number+"(\\s+"+number+")?\\s*$")
 var smoothLine=new RegExp("^(s)\\s+(.*)$")
 var usemtlLine=new RegExp("^(usemtl|o|g)\\s+([^\\s]+)\\s*$")
 var mtllibLine=new RegExp("^(mtllib)\\s+(?![\\/\\\\])([^\\:\\?\\#\\s]+)\\s*$")
 var normalLine=new RegExp("^vn\\s+"+number+"\\s+"+number+"\\s+"+number+"\\s*")
 var faceStart=new RegExp("^f\\s+")
 var lines=str.split(/\r?\n/)
 var vertices=[];
 var resolvedVertices=[];
 var normals=[];
 var uvs=[];
 var faces=[];
 var meshName=name;
 var usemtl=null;
 var currentFaces=[];
 var ret=new ObjData();
 var haveNormals=false;
 var lookBack=0;
 var vertexKind=-1;
 var mesh=null;
 var objName="";
 var oldObjName="";
 var seenFacesAfterObjName=false;
 var flat=false;
 var haveCalcedNormals=false;
 for(var i=0;i<lines.length;i++){
  var line=lines[i];
  // skip empty lines
  if(line.length==0)continue;
  // skip comments
  if(line.charAt(0)=="#")continue;
  while(line.charAt(line.length-1)=="\\" &&
    i+1<line.length){
    // The line continues on the next line
   line=line.substr(0,line.length-1);
   line+=" "+lines[i+1];
   i++;
  }
  if(line.charAt(line.length-1)=="\\"){
   line=line.substr(0,line.length-1);
  }
  var e=vertexLine.exec(line)
  if(e){
    vertices.push([parseFloat(e[1]),parseFloat(e[2]),parseFloat(e[3])]);
    continue;
  }
  e=normalLine.exec(line)
  if(e){
    normals.push([parseFloat(e[1]),parseFloat(e[2]),parseFloat(e[3])]);
    continue;
  }
  e=uvLine.exec(line)
  if(e){
    uvs.push([parseFloat(e[1]),parseFloat(e[2])]);
    continue;
  }
  e=faceStart.exec(line)
  if(e){
    var oldline=line;
    seenFacesAfterObjName=true;
    line=line.substr(e[0].length);
    var faceCount=0;
    var firstFace=faces.length;
    currentFaces=[];
    while(line.length>0){
     e=vertexOnly.exec(line)
     if(e){
      if(vertexKind!=0){
       vertexKind=0;
       lookBack=faces.length;
      }
      var vtx=parseInt(e[1],10)-1;
      pushVertex(resolvedVertices, faces, lookBack,
        vertices[vtx][0],vertices[vtx][1],vertices[vtx][2],0,0,0,0,0);
      currentFaces[faceCount]=faces[faces.length-1];
      line=line.substr(e[0].length);
      faceCount++;
      continue;
     }
     e=vertexNormalOnly.exec(line)
     if(e){
      if(vertexKind!=1){
       vertexKind=1;
       lookBack=faces.length;
      }
      var vtx=parseInt(e[1],10)-1;
      var norm=parseInt(e[2],10)-1;
      haveNormals=true;
      pushVertex(resolvedVertices, faces, lookBack,
        vertices[vtx][0],vertices[vtx][1],vertices[vtx][2],
        normals[norm][0],normals[norm][1],normals[norm][2],0,0);
      currentFaces[faceCount]=faces[faces.length-1];
      line=line.substr(e[0].length);
     faceCount++;
      continue;
     }
     e=vertexUVOnly.exec(line)
     if(e){
      if(vertexKind!=2){
       vertexKind=2;
       lookBack=faces.length;
      }
      var vtx=parseInt(e[1],10)-1;
      var uv=parseInt(e[2],10)-1;
      pushVertex(resolvedVertices, faces, lookBack,
        vertices[vtx][0],vertices[vtx][1],vertices[vtx][2],
        0,0,0,uvs[uv][0],uvs[uv][1]);
      currentFaces[faceCount]=faces[faces.length-1];
      line=line.substr(e[0].length);
      faceCount++;
      continue;
     }
     e=vertexUVNormal.exec(line)
     if(e){
      if(vertexKind!=3){
       vertexKind=3;
       lookBack=faces.length;
      }
      var vtx=parseInt(e[1],10)-1;
      var uv=parseInt(e[2],10)-1;
      var norm=parseInt(e[3],10)-1;
      haveNormals=true;
      pushVertex(resolvedVertices, faces, lookBack,
        vertices[vtx][0],vertices[vtx][1],vertices[vtx][2],
        normals[norm][0],normals[norm][1],normals[norm][2],
        uvs[uv][0],uvs[uv][1]);
      currentFaces[faceCount]=faces[faces.length-1];
      line=line.substr(e[0].length);
      faceCount++;
      continue;
     }
     return {error: new Error("unsupported face: "+oldline)}
    }
    if(faceCount>=4){
      // Add an additional triangle for each vertex after
      // the third
      var m=firstFace+3;
      for(var k=3;k<faceCount;k++,m+=3){
       faces[m]=currentFaces[0];
       faces[m+1]=currentFaces[k-1];
       faces[m+2]=currentFaces[k];
      }
    } else if(faceCount<3){
     return {error: "face has fewer than 3 vertices"}
    }
    if(flat){
      // Give all vertices in the face normals for a flat
      // appearance
      ObjData._recalcNormalsSingleFace(resolvedVertices,
        currentFaces, 8);
      // Don't reuse previous vertices
      lookBack=faces.length;
      haveNormals=true;
    }
    continue;
  }
  e=usemtlLine.exec(line)
  if(e){
    if(e[1]=="usemtl"){
      console.log(usemtl)
      // Changes the material used
      if(resolvedVertices.length>0){
        mesh=new Mesh(resolvedVertices,faces,Mesh.VEC3DNORMALUV);
        if(!haveNormals){
         // No normals in this mesh, so calculate them
         mesh.recalcNormals();
        }
        ret.meshes.push({
          name: seenFacesAfterObjName ? objName : oldObjName, 
          usemtl: usemtl, data: mesh});
        lookBack=0;
        vertexKind=0;
        resolvedVertices=[];
        faces=[];
        haveNormals=false;
      }
      usemtl=e[2];
    } else if(e[1]=="g"){
      // Starts a new group
      if(resolvedVertices.length>0){
        mesh=new Mesh(resolvedVertices,faces,Mesh.VEC3DNORMALUV);
        if(!haveNormals){
         // No normals in this mesh, so calculate them
         mesh.recalcNormals();
        }
        ret.meshes.push({
          name: seenFacesAfterObjName ? objName : oldObjName, 
          usemtl: usemtl, data: mesh});
        lookBack=0;
        vertexKind=0;
        resolvedVertices=[];
        faces=[];
        usemtl=null;
        haveNormals=false;
      }
      meshName=e[2];
    } else if(e[1]=="o"){
      oldObjName=objName;
      objName=e[2];
      seenFacesAfterObjName=false;
    }
    continue;
  }
  e=mtllibLine.exec(line)
  if(e){
    if(e[1]=="mtllib"){
      ret.mtllib=e[2];
    }
    continue;
  }
  e=smoothLine.exec(line)
  if(e){
    flat=(e[2]=="off");
    continue;
  }
  return {error: new Error("unsupported line: "+line)}
 }
 mesh=new Mesh(resolvedVertices,faces,Mesh.VEC3DNORMALUV);
 if(!haveNormals){
   // No normals in this mesh, so calculate them
   mesh.recalcNormals();
 }
 ret.meshes.push({
          name: seenFacesAfterObjName ? objName : oldObjName, 
          usemtl: usemtl, data: mesh});
 return {success: ret};
}
