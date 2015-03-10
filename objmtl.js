function ObjData(){
  this.url=null;
  this.mtllib=null;
  this.mtl=null;
  this.usemtl=null;
  this.mesh=null;
}
function MtlData(){
  this.url=null;
  this.list=[];
}
ObjData.prototype.toShape=function(context){
 var shape=new Shape(context, this.getMesh());
 var mat=this.getMaterial();
 // TODO: load texture into shape
 shape.setMaterial(mat);
 return shape;
}
ObjData.prototype.getMesh=function(){
  return this.mesh;
}
ObjData.prototype.getMaterial=function(){
 if(!this.mtl){
  return new MaterialShade();
 } else {
  if(this.usemtl){
   var mtl=this.mtl.getMaterial(this.usemtl);
   if(!mtl)return new MaterialShade();
   return mtl;
  } else if(this.mtl.list.length>0) {
    return this.mtl.list[0].data;
  } else {
   return new MaterialShade();
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
  var rgb=[2.2878384873407613*r-0.8333676778352163*g-0.4544707958714208*b,
    -0.5116513807438615*r+1.4227583763217775*g+0.08889300175529392*b,
    0.005720409831409596*r-0.01590684851040362*g+1.0101864083734013*b]
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
     return Promise.resolve(mtldata);
   },
   function(e){
     return Promise.reject({url: e.url})
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
       var mtlURL=e.url;
       var lastSlash=mtlURL.lastIndexOf("/")
       if(lastSlash>=0){
        mtlURL=mtlURL.substr(0,lastSlash+1)+obj.mtllib;
       } else {
        mtlURL=obj.mtllib;
       }
       return ObjData.loadMtlFromUrl(mtlURL).then(
        function(result){
          obj.mtl=result;
          return Promise.resolve(obj);
        }, function(result){
          obj.mtl=null;
          return Promise.resolve(obj);
        });
     } else {
       // otherwise just return the object
       return Promise.resolve(obj);
     }
     return {url: e.url, obj: GLUtil._loadObj(e.text)};
   },
   function(e){
     return Promise.reject({url: e.url})
   });
}
MtlData._loadMtl=function(str){
 var number="(-?(?:\\d+\\.?\\d*|\\d*\\.\\d+)(?:[Ee][\\+\\-]?\\d+)?)"
 var nonnegInteger="(\\d+)"
 var oneNumLine=new RegExp("^(Ns|d|Tr|Ni)\\s+"+number+"\\s*$")
 var oneIntLine=new RegExp("^(illum)\\s+"+nonnegInteger+"\\s*$")
 var threeNumLine=new RegExp("^(Kd|Ka|Ks|Ke|Tf)\\s+"+number+"\\s+"+number
   +"\\s+"+number+"\\s*$")
 var mapLine=new RegExp("^(map_Kd)\\s+([^\\:\\s]+)$")
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
    currentMat[e[1]]=e[2];
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
 var uvLine=new RegExp("^vt\\s+"+number+"\\s+"+number+"\\s*$")
 var usemtlLine=new RegExp("^(usemtl|o|g|s)\\s+([^\\s]+)\\s*$")
 var mtllibLine=new RegExp("^(mtllib)\\s+([^\\:\\/\\s]+)\\s*$")
 var normalLine=new RegExp("^vn\\s+"+number+"\\s+"+number+"\\s+"+number+"\\s*")
 var faceStart=new RegExp("^f\\s+")
 var lines=str.split(/\r?\n/)
 var vertices=[];
 var resolvedVertices=[];
 var normals=[];
 var uvs=[];
 var faces=[];
 var currentFaces=[];
 var ret=new ObjData();
 var lookBack=0;
 var vertexKind=-1;
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
    line=line.substr(e[0].length);
    var faceCount=0;
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
        0,0,0,uvs[uv][0],uvs[uv][1],0,0);
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
      // Add an additional triangle in the polygon
      faces[faces.length-1]=currentFaces[0];
      faces.push(currentFaces[faceCount-2]);
      faces.push(currentFaces[faceCount-1]);
    }
    continue;
  }
  e=usemtlLine.exec(line)
  if(e){
    if(e[1]=="usemtl"){
      ret["usemtl"]=e[2];
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
  return {error: new Error("unsupported line: "+line)}
 }
 ret.mesh=new Mesh(resolvedVertices,faces,Mesh.VEC3DNORMALUV);
 if(normals.length==0){
  ret.mesh.recalcNormals();
 }
 return {success: ret};
}
