function x(a){if(!a.Promise){var c=function(a){this.g=0;this.v=this.k=null;this.l={P:[],Q:[]};this.j=[];a&&this.X(a)};c.resolve=function(a){return new this(function(c){c(a)})};c.reject=function(a){return new this(function(c,d){d(a)})};c.all=c.pa=function(a){return new this(function(c,d){var f=0,h=[];a.forEach(function(a,k){f++;a.then(function(a){h[k]=a;f--;f||c(h)},function(a){f=1/0;d(a)})})})};c.race=function(a){return new this(function(c,d){a.forEach(function(a){a.then(c,d)})})};c.prototype.then=
function(a,e){this.l.P.push(a);this.l.Q.push(e);var d=new c;this.j.push(d);0<this.g&&this.u();return d};c.prototype.D=function(a){0==this.g&&(this.g=1,this.k=a,this.j.length&&this.u())};c.prototype.reject=function(a){if(0!=this.g)return this;this.g=2;this.k=a;this.j.length&&this.u();return this};c.prototype.resolve=function(a){if(a==this)this.reject(new TypeError("Promise resolved by its own instance"));else if(a instanceof this.constructor)a.aa(this);else if(null===a||"object"!=typeof a&&"function"!=
typeof a)this.D(a);else{try{var c=a.then}catch(d){this.reject(d);return}if("function"==typeof c){var f=!1,h=function(a){f||(f=!0,this.resolve(a))},l=function(a){f||(f=!0,this.reject(a))};try{c.call(a,h.bind(this),l.bind(this))}catch(q){f||this.reject(q)}}else this.D(a)}};c.prototype.aa=function(a){this.then(function(c){a.resolve(c)},function(c){a.reject(c)})};c.prototype["catch"]=function(a){return this.then(null,a)};c.prototype.u=function(){this.v||(this.v=setTimeout(this.Y.bind(this),0))};c.prototype.Y=
function(){for(this.v=null;this.j.length;){var a=this.l.P.shift(),c=this.l.Q.shift();this.W(1==this.g?a:c)}};c.prototype.W=function(a){var c=this.j.shift();if("function"!=typeof a)1==this.g?c.D(this.k):c.reject(this.k);else try{var d=a(this.k);c.resolve(d)}catch(f){c.reject(f)}};c.prototype.X=function(a){try{a(this.resolve.bind(this),this.reject.bind(this))}catch(c){this.reject(c)}};a.Promise=c}}"function"===typeof define&&define.oa?define(["exports"],x):"object"===typeof exports?x(exports):x(this);
function D(){return[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]}
function aa(a,c,k){c=c*Math.PI/180;var e=Math.cos(c),d=Math.sin(c),f,h;f=k[0];h=k[1];c=k[2];if(1==f&&0==h&&0==c)return[a[0],a[1],a[2],a[3],e*a[4]+a[8]*d,e*a[5]+a[9]*d,e*a[6]+a[10]*d,e*a[7]+a[11]*d,e*a[8]-d*a[4],e*a[9]-d*a[5],e*a[10]-d*a[6],e*a[11]-d*a[7],a[12],a[13],a[14],a[15]];if(0==f&&1==h&&0==c)return[e*a[0]-d*a[8],e*a[1]-d*a[9],e*a[2]-d*a[10],e*a[3]-d*a[11],a[4],a[5],a[6],a[7],e*a[8]+a[0]*d,e*a[9]+a[1]*d,e*a[10]+a[2]*d,e*a[11]+a[3]*d,a[12],a[13],a[14],a[15]];if(0==f&&0==h&&1==c)return[e*a[0]+
a[4]*d,e*a[1]+a[5]*d,e*a[2]+a[6]*d,e*a[3]+a[7]*d,e*a[4]-d*a[0],e*a[5]-d*a[1],e*a[6]-d*a[2],e*a[7]-d*a[3],a[8],a[9],a[10],a[11],a[12],a[13],a[14],a[15]];if(0==f&&0==h&&0==c)return a.slice(0,16);k=1/Math.sqrt(f*f+h*h+c*c);f*=k;h*=k;c*=k;var l=h*h,q=1-e,m=f*h,p=h*c;k=f*d;h*=d;var y=c*d,d=q*p,n=q*m,w=q*f*c;f=e+q*f*f;m=n+y;p=w-h;l=e+q*l;y=n-y;n=d+k;e+=q*c*c;c=w+h;k=d-k;return[a[0]*f+a[4]*m+a[8]*p,a[1]*f+a[5]*m+a[9]*p,a[10]*p+a[2]*f+a[6]*m,a[11]*p+a[3]*f+a[7]*m,a[0]*y+a[4]*l+a[8]*n,a[1]*y+a[5]*l+a[9]*n,
a[10]*n+a[2]*y+a[6]*l,a[11]*n+a[3]*y+a[7]*l,a[0]*c+a[4]*k+a[8]*e,a[1]*c+a[5]*k+a[9]*e,a[10]*e+a[2]*c+a[6]*k,a[11]*e+a[3]*c+a[7]*k,a[12],a[13],a[14],a[15]]}function ga(a){function c(){a();I(c)}a();I(c)}function J(a){return a&&"compileShader"in a}function I(a){var c=window.requestAnimationFrame||window.mozRequestAnimationFrame||window.webkitRequestAnimationFrame||window.msRequestAnimationFrame;c?c(a):window.setTimeout(a,17)}
function ha(){var a,c;function k(a,c,k,e){return a[c]==a[k]&&a[c+1]==a[k+1]&&a[c+2]==a[k+2]||a[e]==a[k]&&a[e+1]==a[k+1]&&a[e+2]==a[k+2]||a[c]==a[e]&&a[c+1]==a[e+1]&&a[c+2]==a[e+2]}a=1;var e,d,f;"undefined"==typeof a&&(a=1);"undefined"==typeof c&&(c=6);if(0>=c)throw Error("div must be 1 or more");c=1<<c;for(var h=[],l=[],q=[],m=[],p=[],y,n=c-1;0<=n;n--){var w=-90+180*n/c;if(0==n)h[0]=0,h[1]=-1;else{var z=Math.PI/180*w,w=Math.cos(z),z=Math.sin(z);h[2*n]=w;h[2*n+1]=z}n==c-1?(l[2*n]=0,l[2*n+1]=1):(l[2*
n]=h[2*n+2],l[2*n+1]=h[2*n+3])}q[0]=1;q[1]=0;for(n=1;n<2*c;n++){var w=Math.PI/180*(360*n/c),t=Math.cos(w),G=Math.sin(w);q.push(t,G)}for(n=0;n<c;n++){y=!0;for(var w=h[2*n],z=h[2*n+1],B=l[2*n],E=l[2*n+1],C=1*n/c,H=1*(n+1)/c,F=0;F<2*c;F++){var t=q[2*F],G=q[2*F+1],u=A,A=1*(c-F)/c,A=A-.25;0>A&&(A+=1);e=-t*w;d=z;f=G*w;p.push(a*e,a*d,a*f,-e,-d,-f,0,0);e=-t*B;d=E;f=G*B;p.push(a*e,a*d,a*f,-e,-d,-f,0,0);y||(t=p.length/8-4,e=8*t,d=e+6,p[d]=u,p[d+1]=C,p[d+8]=u,p[d+9]=H,p[d+16]=A,p[d+17]=H,p[d+24]=A,p[d+25]=C,
0==n||n==c-1?(k(p,e,e+8,e+16)||m.push(t,t+1,t+2),k(p,e+8,e+16,e+24)||m.push(t+2,t+1,t+3)):m.push(t,t+1,t+2,t+2,t+1,t+3));y=!1}}return new K(p,m,K.s)}
function L(a,c,k){null==c&&(c="attribute vec3 position;\nattribute vec3 normal;\nattribute vec2 textureUV;\nattribute vec3 colorAttr;\nuniform mat4 world;\nuniform mat4 view;\nuniform mat4 projection;\nvarying vec2 textureUVVar;\nvarying vec3 colorAttrVar;\nuniform mat4 viewInverse; /* internal */\nuniform mat3 worldInverseTrans3; /* internal */\nuniform float alpha;\nuniform vec4 lightPosition;\nuniform vec3 sa;\nuniform vec3 ma;\nuniform vec3 sd;\nuniform vec3 md;\nuniform vec3 ss;\nuniform vec3 ms;\nuniform float mshin;\nvarying vec3 ambientAndSpecularVar;\nvarying vec3 diffuseVar;\nvoid main(){\nvec4 positionVec4=vec4(position,1.0);\n",c+=
"vec4 worldPosition=world*positionVec4;\nvec3 sdir;\nfloat attenuation;\nif(lightPosition.w == 0.0){\n sdir=normalize(vec3(lightPosition));\n attenuation=1.0;\n} else {\n vec3 vertexToLight=vec3(lightPosition-worldPosition);\n float dist=length(vertexToLight);\n sdir=normalize(vertexToLight);\n attenuation=1.0/(1.0*dist);\n}\nvec3 transformedNormal=normalize(worldInverseTrans3*normal);\nfloat diffInt=dot(transformedNormal,sdir);vec3 viewPosition=normalize(vec3(viewInverse*vec4(0,0,0,1)-worldPosition));\nvec3 ambientAndSpecular=sa*ma;\nif(diffInt>=0.0){\n   // specular reflection\n   ambientAndSpecular+=(ss*ms*pow(max(dot(reflect(-sdir,transformedNormal),      viewPosition),0.0),mshin));\n}\ndiffuseVar=sd*md*max(0.0,dot(transformedNormal,sdir))*attenuation;\nambientAndSpecularVar=ambientAndSpecular;\n",
c+="colorAttrVar=colorAttr;\n",c+="textureUVVar=textureUV;\n",c+="gl_Position=projection*view*world*positionVec4;\n}");null==k&&(k="precision highp float;\nuniform sampler2D sampler;\nuniform float useTexture;\nuniform float useColorAttr;\nvarying vec2 textureUVVar;\nvarying vec3 colorAttrVar;\nvarying vec3 ambientAndSpecularVar;\nvarying vec3 diffuseVar;\n",k+="void main(){\n",k+=" vec4 baseColor;\n",k+=" baseColor=vec4(1.0,1.0,1.0,1.0)*(1.0-useTexture);\n",k+=" baseColor+=texture2D(sampler,textureUVVar)*useTexture;\n baseColor=baseColor*(1.0-useColorAttr) +\n  vec4(colorAttrVar,1.0)*useColorAttr;\n",
k+=" vec3 phong=ambientAndSpecularVar+diffuseVar*baseColor.rgb;\n gl_FragColor=vec4(phong,baseColor.a);\n",k+="}");this.c=ia(a,c,k);this.attributes={};this.a=a;this.A={};this.R={};if(null!=this.c){this.attributes=[];var e=null;c={};k=a.getProgramParameter(this.c,a.ACTIVE_ATTRIBUTES);for(var d=0;d<k;++d)if(e=a.getActiveAttrib(this.c,d),null!==e){var e=e.name,f=a.getAttribLocation(this.c,e);0<=f&&(this.attributes.push(f),c[e]=f)}k=a.getProgramParameter(this.c,a.ACTIVE_UNIFORMS);for(d=0;d<k;++d)f=a.getActiveUniform(this.c,
d),null!==f&&(e=f.name,c[e]=a.getUniformLocation(this.c,e),this.R[e]=f.type);this.A=c}}L.prototype.getContext=function(){return this.a};L.prototype.get=function(a){return this.A.hasOwnProperty(a)?this.A[a]:null};
function M(a,c){for(var k in c)if(c.hasOwnProperty(k)){v=c[k];var e=a.get(k);null!==e&&(3==v.length?a.a.uniform3f(e,v[0],v[1],v[2]):4==v.length?a.a.uniform4f(e,v[0],v[1],v[2],v[3]):16==v.length?a.a.uniformMatrix4fv(e,!1,v):9==v.length?a.a.uniformMatrix3fv(e,!1,v):a.R[k]==a.a.FLOAT?a.a.uniform1f(e,"number"==typeof v?v:v[0]):a.a.uniform1i(e,"number"==typeof v?v:v[0]))}}
function ia(a,c,k){function e(a,c,k){var e=a.createShader(c);a.shaderSource(e,k);a.compileShader(e);return a.getShaderParameter(e,a.COMPILE_STATUS)?e:(console.log((c==a.VERTEX_SHADER?"vertex: ":"fragment: ")+a.getShaderInfoLog(e)),null)}c=c&&0!=c.length?e(a,a.VERTEX_SHADER,c):null;k=k&&0!=k.length?e(a,a.FRAGMENT_SHADER,k):null;var d=null;null!==c&&null!==k&&(d=a.createProgram(),a.attachShader(d,c),a.attachShader(d,k),a.linkProgram(d),a.getProgramParameter(d,a.LINK_STATUS)?a.useProgram(d):(console.log("link: "+
a.getProgramInfoLog(d)),a.deleteProgram(d),d=null));null!==c&&a.deleteShader(c);null!==k&&a.deleteShader(k);return d}L.prototype.o=function(a){if(!a)return this;M(this,{sa:[a.h[0],a.h[1],a.h[2]],lightPosition:a.position,sd:a.m,ss:a.p});return this};function N(){this.h=[0,0,0,1];this.position=[0,0,1,0];this.m=[1,1,1];this.p=[1,1,1]}function ja(){var a=[0,0,1],c=new N;c.h=[.25,.25,.25];c.position=a?[a[0],a[1],a[2],0]:[0,0,1,0];c.m=[1,1,1];c.p=[1,1,1];return c}
function S(a,c,k,e){this.ia=null==e?1:Math.min(Math.max(0,e),128);this.h=a||[.2,.2,.2];this.m=c||[.8,.8,.8];this.p=k||[0,0,0]}S.prototype.bind=function(a){M(a,{useTexture:0,mshin:this.ia,ma:this.h,md:this.m,ms:this.p})};function K(a,c,k){this.L=a;this.f=c;this.format=k}K.T=2;K.U=3;K.s=6;K.V=5;K.M=7;
K.prototype.bind=function(a){var c=a.createBuffer(),k=a.createBuffer();a.bindBuffer(a.ARRAY_BUFFER,c);a.bindBuffer(a.ELEMENT_ARRAY_BUFFER,k);a.bufferData(a.ARRAY_BUFFER,new Float32Array(this.L),a.STATIC_DRAW);var e=a.UNSIGNED_SHORT;65536<=this.L.length||65536<=this.f.length?(e=a.UNSIGNED_INT,a.bufferData(a.ELEMENT_ARRAY_BUFFER,new Uint32Array(this.f),a.STATIC_DRAW)):256>=this.L.length&&256>=this.f.length?(e=a.UNSIGNED_BYTE,a.bufferData(a.ELEMENT_ARRAY_BUFFER,new Uint8Array(this.f),a.STATIC_DRAW)):
a.bufferData(a.ELEMENT_ARRAY_BUFFER,new Uint16Array(this.f),a.STATIC_DRAW);return{la:c,f:k,fa:this.f.length,type:e,format:this.format}};
K.na=function(a,c,k){for(var e=0;e<a.length;e+=k)a[e+3]=0,a[e+4]=0,a[e+5]=0;for(e=0;e<a.length;e+=3){var d=c[e]*k,f=c[e+1]*k,h=c[e+2]*k,l=[a[f]-a[h],a[f+1]-a[h+1],a[f+2]-a[h+2]],q=[a[d]-a[h],a[d+1]-a[h+1],a[d+2]-a[h+2]],m=l[1]*q[2]-l[2]*q[1],p=l[2]*q[0]-l[0]*q[2],l=l[0]*q[1]-l[1]*q[0];len=Math.sqrt(m*m+p*p+l*l);0!=len&&(len=1/len,m*=len,p*=len,l*=len,a[d+3]+=m,a[d+4]+=p,a[d+5]+=l,a[f+3]+=m,a[f+4]+=p,a[f+5]+=l,a[h+3]+=m,a[h+4]+=p,a[h+5]+=l)}for(e=0;e<a.length;e+=k)if(m=a[e+3],p=a[e+4],l=a[e+5],len=
Math.sqrt(m*m+p*p+l*l))len=1/len,a[e+3]=m*len,a[e+4]=p*len,a[e+5]=l*len};window.TextureManager=function(a){this.a=a};
function T(a){this.a=a;this.a.viewport(0,0,1*this.a.canvas.width,1*this.a.canvas.height);this.c=new L(a);this.i=[];this.clearColor=[0,0,0,1];new TextureManager(a);this.a.enable(a.BLEND);this.Z=D();this.O=D();this.e=!0;this.N=this.t=null;this.H=new N;this.a.blendFunc(a.SRC_ALPHA,a.ONE_MINUS_SRC_ALPHA);this.a.enable(this.a.DEPTH_TEST);this.a.depthFunc(this.a.LEQUAL);ka(this);this.a.clearDepth(999999);this.a.clear(this.a.COLOR_BUFFER_BIT|this.a.DEPTH_BUFFER_BIT)}
T.prototype.useProgram=function(a){if(!a)throw Error("invalid program");a.a.useProgram(a.c);this.c=a;M(this.c,{sampler:0});this.c.o(this.H);this.e=!0;return this};function ka(a){a.a.clearColor(a.clearColor[0],a.clearColor[1],a.clearColor[2],a.clearColor[3]);return a}
T.prototype.w=function(){if(this.e){var a;a=this.O;var c=a[0]*a[10],k=a[0]*a[11],e=a[0]*a[5],d=a[0]*a[6],f=a[0]*a[7],h=a[0]*a[9],l=a[10]*a[12],q=a[10]*a[13],m=a[10]*a[15],p=a[11]*a[12],y=a[11]*a[13],n=a[11]*a[14],w=a[1]*a[4],z=a[1]*a[6],t=a[1]*a[7],G=a[1]*a[8],B=a[2]*a[4],E=a[2]*a[5],C=a[2]*a[7],H=a[2]*a[8],F=a[2]*a[9],u=a[3]*a[4],A=a[3]*a[5],V=a[3]*a[6],W=a[3]*a[8],X=a[3]*a[9],Y=a[4]*a[9],ba=a[5]*a[8],ca=a[6]*a[8],da=a[6]*a[9],ea=a[7]*a[8],fa=a[7]*a[9],O=w-e,P=z-E,Q=t-A,R=B-d,e=e-w,z=E-z,E=C-V,w=
u-f,t=A-t,C=V-C,d=d-B,B=f-u,f=a[9]*a[12]*C+l*Q+p*z+a[8]*a[13]*E+q*w+y*d+a[8]*a[14]*t+a[9]*a[14]*B+n*O+a[8]*a[15]*P+a[9]*a[15]*R+m*e;if(0==f)a=D();else{f=1/f;u=[];u[0]=a[6]*y-a[7]*q+fa*a[14]-a[5]*n-da*a[15]+a[5]*m;u[1]=a[3]*q-a[2]*y-X*a[14]+a[1]*n+F*a[15]-a[1]*m;u[2]=a[13]*E+a[14]*t+a[15]*P;u[3]=a[9]*C+a[10]*Q+a[11]*z;u[4]=a[7]*l-a[6]*p-ea*a[14]+a[4]*n+ca*a[15]-a[4]*m;u[5]=a[2]*p-a[3]*l+a[14]*(W-k)+a[15]*(c-H);u[6]=a[12]*C+a[14]*B+a[15]*R;u[7]=a[8]*E+a[10]*w+a[11]*d;u[8]=a[5]*p-fa*a[12]+ea*a[13]-a[4]*
y+a[15]*(Y-ba);u[9]=X*a[12]-a[1]*p+a[13]*(k-W)+a[15]*(G-h);u[10]=a[12]*Q+a[13]*w+a[15]*e;u[11]=a[8]*t+a[9]*B+a[11]*O;u[12]=da*a[12]-a[5]*l-ca*a[13]+a[4]*q+a[14]*(ba-Y);u[13]=a[1]*l-F*a[12]+a[13]*(H-c)+a[14]*(h-G);u[14]=a[12]*z+a[13]*d+a[14]*O;u[15]=a[8]*P+a[9]*R+a[10]*e;for(a=0;16>a;a++)u[a]*=f;a=u}this.N=a;M(this.c,{view:this.O,projection:this.Z,viewInverse:this.N});this.e=!1}};T.prototype.o=function(a){this.H=a;this.c.o(this.H);return this};
T.prototype.J=function(){this.w();this.a.clear(this.a.COLOR_BUFFER_BIT);for(var a=0;a<this.i.length;a++)this.i[a].J(this.c);this.a.flush()};function U(a,c){if(null==c)throw Error("vertfaces is null");this.r=c.constructor==K?c.bind(a):c;this.a=a;this.I=new S;this.scale=[1,1,1];this.B=0;this.position=[0,0,0];this.S=[0,0,0];this.da=!1;this.e=!0;this.t=[1,0,0,0,1,0,0,0,1];this.d=D()}
U.prototype.w=function(){this.e=!1;var a=this.scale;this.d=[a[0],0,0,0,0,a[1],0,0,0,0,a[2],0,0,0,0,1];0!=this.B&&(this.d=aa(this.d,this.B,this.S));this.d[12]+=this.position[0];this.d[13]+=this.position[1];this.d[14]+=this.position[2];var a=this.d,a=[a[0],a[1],a[2],a[4],a[5],a[6],a[8],a[9],a[10]],c=a[0]*a[4]*a[8]+a[3]*a[7]*a[2]+a[6]*a[1]*a[5]-a[6]*a[4]*a[2]-a[3]*a[1]*a[8]-a[0]*a[7]*a[5];0==c?a=[1,0,0,0,1,0,0,0,1]:(c=1/c,a=[(-a[5]*a[7]+a[4]*a[8])*c,(a[5]*a[6]-a[3]*a[8])*c,(-a[4]*a[6]+a[3]*a[7])*c,(a[2]*
a[7]-a[1]*a[8])*c,(-a[2]*a[6]+a[0]*a[8])*c,(a[1]*a[6]-a[0]*a[7])*c,(-a[2]*a[4]+a[1]*a[5])*c,(a[2]*a[3]-a[0]*a[5])*c,(-a[1]*a[3]+a[0]*a[4])*c]);this.t=a};
U.prototype.J=function(a){this.I&&this.I.bind(a);var c=this.a,k=this.r,e=a.get("position"),d=a.get("normal"),f=a.get("textureUV"),h=a.get("colorAttr");c.bindBuffer(c.ARRAY_BUFFER,k.la);c.bindBuffer(c.ELEMENT_ARRAY_BUFFER,k.f);k=k.format;k==K.V?(Z(c,e,3,c.FLOAT,24,0),Z(c,d,3,c.FLOAT,24,12)):k==K.s?(Z(c,e,3,c.FLOAT,32,0),Z(c,d,3,c.FLOAT,32,12),Z(c,f,2,c.FLOAT,32,24)):k==K.M?(Z(c,e,3,c.FLOAT,24,0),Z(c,h,3,c.FLOAT,24,12)):k==K.T?Z(c,e,2,c.FLOAT,8,0):k==K.U&&Z(c,e,3,c.FLOAT,12,0);c={};null!==a.get("world")&&
(this.e&&this.w(),c.world=this.d,c.worldInverseTrans3=this.t);c.useColorAttr=this.r.format==K.M?1:0;M(a,c);this.a.drawElements(this.da?this.a.LINES:this.a.TRIANGLES,this.r.fa,this.r.type,0)};function Z(a,c,k,e,d,f){null!==c&&(a.enableVertexAttribArray(c),a.vertexAttribPointer(c,k,e,!1,d,f))}
(function(a){function c(a){a=a||"#ff0000";this.height=this.width=1E3;var c=$("<canvas>").attr("width",this.width+"").attr("height",this.height+"").css({width:"100%",height:"100%",left:"0px",zIndex:-1,top:"0px",position:"fixed"});$("body").append(c);this.q=!0;this.count=0;if(c=c.get(0)){var d=null,f={antialias:!0};try{d=c.getContext("webgl",f)}catch(h){d=null}if(!d)try{d=c.getContext("experimental-webgl",f)}catch(l){d=null}if(!d)try{d=c.getContext("moz-webgl",f)}catch(q){d=null}if(!d)try{d=c.getContext("webkit-3d",
f)}catch(m){d=null}if(!d)try{d=c.getContext("2d",f)}catch(p){d=null}J(d)&&(d.getExtension("OES_element_index_uint"),d.getExtension("EXT_texture_filter_anisotropic"));c=d}else c=null;this.a=c;this.q=J(this.a);this.i=[];this.setColor(a)}c.ka=function(a){var e=a[0]-7.5+c.b(15);360<=e?e=360-e:0>e&&(e=360+e);var d=a[1],d=15>=d?c.b(30):240<d?240+c.b(30):d-15+c.b(30),f=a=a[2],f=15>=f?c.b(30):240<f?240+c.b(30):f+c.b(30);0<a&&0<d&&255>d&&(25>=d&&(d=25),242<=d&&(d=242));return[e,d,f]};c.b=function(a){return Math.random()*
a|0};c.ha=function(a){var c=a[0],d=a[1];a=a[2];var f=c;d>f&&(f=d);a>f&&(f=a);var h=c;d<h&&(h=d);a<h&&(h=a);var l=f+h,q=l/2;if(f===h)return[0,0>q?0:255<q?255:q,0];var h=f-h,l=255*h/(127.5>=q?l:510-l),m=0,m=h/2,m=c===f?(60*(f-a)+m)/h-(60*(f-d)+m)/h:a===f?240+(60*(f-d)+m)/h-(60*(f-c)+m)/h:120+(60*(f-c)+m)/h-(60*(f-a)+m)/h;if(0>m||360<=m)m=(m%360+360)%360;return[m,0>q?0:255<q?255:q,0>l?0:255<l?255:l]};c.G=function(a){var c=1*a[0],d=1*a[1],f=1*a[2],d=0>d?0:255<d?255:d,f=0>f?0:255<f?255:f;if(0===f)return[d,
d,d];a=0;127.5>=d?a=d*(255+f)/255:(a=d*f/255,a=d+f-a);var h=2*d-a;if(0>c||360<=c)c=(c%360+360)%360;var l=c+120;360<=l&&(l-=360);d=60>l?h+(a-h)*l/60:180>l?a:240>l?h+(a-h)*(240-l)/60:h;l=c;f=60>l?h+(a-h)*l/60:180>l?a:240>l?h+(a-h)*(240-l)/60:h;l=c-120;0>l&&(l+=360);c=60>l?h+(a-h)*l/60:180>l?a:240>l?h+(a-h)*(240-l)/60:h;return[0>d?0:255<d?255:d,0>f?0:255<f?255:f,0>c?0:255<c?255:c]};c.C=function(a){a="0"+(a|0).toString(16);return a.substring(a.length-2,a.length)};c.F=function(a){a=c.G(a);return"#"+c.C(a[0])+
c.C(a[1])+c.C(a[2])};c.ga=function(a){return null==a||"undefined"==typeof a?null:(a=/^\#([A-F0-9]{2})([A-F0-9]{2})([A-F0-9]{2})$/i.exec(a))?[parseInt(a[1],16),parseInt(a[2],16),parseInt(a[3],16)]:null};c.prototype.start=function(){ga(this.$.bind(this))};c.prototype.setColor=function(a){a=this.constructor.ga(a);if(!a)throw Error("invalid color parameter");this.color=a;this.n=this.constructor.ha(a);this.ca()};c.prototype.ca=function(){document.body.style.backgroundColor=this.constructor.F(this.n);if(this.q){var a=
this.constructor.G(this.n);this.ba=new K([-1,-1,1,1,0,0,1,1,-1,1,1,1,0,0,1,0,-1,1,-1,1,0,0,0,0,-1,-1,-1,1,0,0,0,1,1,-1,-1,-1,0,0,1,1,1,1,-1,-1,0,0,1,0,1,1,1,-1,0,0,0,0,1,-1,1,-1,0,0,0,1,1,-1,-1,0,1,0,1,1,1,-1,1,0,1,0,1,0,-1,-1,1,0,1,0,0,0,-1,-1,-1,0,1,0,0,1,1,1,1,0,-1,0,1,1,1,1,-1,0,-1,0,1,0,-1,1,-1,0,-1,0,0,0,-1,1,1,0,-1,0,0,1,-1,-1,-1,0,0,1,1,1,-1,1,-1,0,0,1,1,0,1,1,-1,0,0,1,0,0,1,-1,-1,0,0,1,0,1,1,-1,1,0,0,-1,1,1,1,1,1,0,0,-1,1,0,-1,1,1,0,0,-1,0,0,-1,-1,1,0,0,-1,0,1],[0,1,2,0,2,3,4,5,6,4,6,7,8,
9,10,8,10,11,12,13,14,12,14,15,16,17,18,16,18,19,20,21,22,20,22,23],K.s);this.ja=ha();var c=(new T(this.a)).o(ja());c.clearColor=[a[0]/255,a[1]/255,a[2]/255,1];this.K=ka(c)}else this.a.fillStyle=this.constructor.F(this.n),this.a.fillRect(0,0,this.width,this.height)};c.prototype.$=function(){this.count++;4<=this.count&&(this.count=0,this.ea());this.q&&this.K.J()};c.prototype.ea=function(){var a=this.constructor.ka(this.n);if(this.q){300<this.i.length&&this.K.i.shift();var c=this.constructor.b(2E3)/
1E3-1,d=this.constructor.b(2E3)/1E3-1,f=this.constructor.b(60)/60,h=0==this.constructor.b(2)?this.ba:this.ja,l=(16+this.constructor.b(100))/1E3,a=this.constructor.G(a);a[0]/=255;a[1]/=255;a[2]/=255;var q=this.constructor.b(160),m=[this.constructor.b(360)/360,this.constructor.b(360)/360,this.constructor.b(30)/30],h=new U(this.a,h);h.scale=[l,l,l];h.e=!0;h.B=q%360;h.S=m;h.e=!0;h.position=[c,d,f];h.e=!0;h.I=new S(a,a);this.K.i.push(h)}else c=[this.constructor.b(this.width+30)-30,this.constructor.b(this.height+
30)-30,32+this.constructor.b(200),32+this.constructor.b(200)],this.a.fillStyle=this.constructor.F(a),this.a.fillRect(c[0],c[1],c[2],c[3])};c.colorBackground=function(a){$(document).ready(function(){(new c(a)).start()})};a.CanvasBackground=c})(this);
