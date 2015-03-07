function da(a){function b(){a();A(b)}a();A(b)}function C(a){return a&&"compileShader"in a}function A(a){var b=window.requestAnimationFrame||window.mozRequestAnimationFrame||window.webkitRequestAnimationFrame||window.msRequestAnimationFrame;b?b(a):window.setTimeout(a,17)}
function G(a,b,d){var f=H,c=a.createBuffer(),e=a.createBuffer();a.bindBuffer(a.ARRAY_BUFFER,c);a.bindBuffer(a.ELEMENT_ARRAY_BUFFER,e);a.bufferData(a.ARRAY_BUFFER,new Float32Array(b),a.STATIC_DRAW);var g=a.UNSIGNED_SHORT;65536<=b.length||65536<=d.length?(g=a.UNSIGNED_INT,a.bufferData(a.ELEMENT_ARRAY_BUFFER,new Uint32Array(d),a.STATIC_DRAW)):256>=b.length&&256>=d.length?(g=a.UNSIGNED_BYTE,a.bufferData(a.ELEMENT_ARRAY_BUFFER,new Uint8Array(d),a.STATIC_DRAW)):a.bufferData(a.ELEMENT_ARRAY_BUFFER,new Uint16Array(d),
a.STATIC_DRAW);return{W:c,P:e,Q:d.length,type:g,format:f}}
function ea(a){var b,d;function f(a,d,b,c){return a[d]==a[b]&&a[d+1]==a[b+1]&&a[d+2]==a[b+2]||a[c]==a[b]&&a[c+1]==a[b+1]&&a[c+2]==a[b+2]||a[d]==a[c]&&a[d+1]==a[c+1]&&a[d+2]==a[c+2]}b=1;var c,e,g;"undefined"==typeof b&&(b=1);"undefined"==typeof d&&(d=6);if(0>=d)throw Error("div must be 1 or more");d=1<<d;for(var h=[],m=[],l=[],p=[],q=[],u,k=d-1;0<=k;k--){var t=-90+180*k/d;if(0==k)h[0]=0,h[1]=-1;else{var w=Math.PI/180*t,t=Math.cos(w),w=Math.sin(w);h[2*k]=t;h[2*k+1]=w}k==d-1?(m[2*k]=0,m[2*k+1]=1):(m[2*
k]=h[2*k+2],m[2*k+1]=h[2*k+3])}l[0]=1;l[1]=0;for(k=1;k<2*d;k++){var t=Math.PI/180*(360*k/d),r=Math.cos(t),x=Math.sin(t);l.push(r,x)}for(k=0;k<d;k++){u=!0;for(var t=h[2*k],w=h[2*k+1],z=m[2*k],B=m[2*k+1],D=1*k/d,E=1*(k+1)/d,n=0;n<2*d;n++){var r=l[2*n],x=l[2*n+1],F=y,y=1*(d-n)/d,y=y-.25;0>y&&(y+=1);c=-r*t;e=w;g=x*t;q.push(b*c,b*e,b*g,-c,-e,-g,0,0);c=-r*z;e=B;g=x*z;q.push(b*c,b*e,b*g,-c,-e,-g,0,0);u||(r=q.length/8-4,c=8*r,e=c+6,q[e]=F,q[e+1]=D,q[e+8]=F,q[e+9]=E,q[e+16]=y,q[e+17]=E,q[e+24]=y,q[e+25]=D,
0==k||k==d-1?(f(q,c,c+8,c+16)||p.push(r,r+1,r+2),f(q,c+8,c+16,c+24)||p.push(r+1,r+2,r+3)):p.push(r,r+1,r+2,r+1,r+2,r+3));u=!1}}return G(a,q,p)}function I(a){var b=a[0],d=a[1],f=a[2];len=Math.sqrt(b*b+d*d+f*f);0!=len&&(len=1/len,a[0]*=len,a[1]*=len,a[2]*=len);return a}function N(){return[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]}
function O(a,b,d){null==b&&(b="attribute vec3 position;\nattribute vec3 normal;\nattribute vec2 textureUV;\nattribute vec3 colorAttr;\nuniform mat4 world;\nuniform mat4 view;\nuniform mat4 projection;\nvarying vec2 textureUVVar;\nvarying vec3 colorAttrVar;\nuniform mat4 viewInverse; /* internal */\nuniform mat3 worldInverseTrans3; /* internal */\nuniform float alpha;\nuniform vec4 lightPosition;\nuniform vec3 sa;\nuniform vec3 ma;\nuniform vec3 sd;\nuniform vec3 md;\nuniform vec3 ss;\nuniform vec3 ms;\nuniform float mshin;\nvarying vec3 ambientAndSpecularVar;\nvarying vec3 diffuseVar;\nvoid main(){\nvec4 positionVec4=vec4(position,1.0);\n",b+=
"vec4 worldPosition=world*positionVec4;\nvec3 sdir;\nfloat attenuation;\nif(lightPosition.w == 0.0){\n sdir=normalize(vec3(lightPosition));\n attenuation=1.0;\n} else {\n vec3 vertexToLight=vec3(lightPosition-worldPosition);\n float dist=length(vertexToLight);\n sdir=normalize(vertexToLight);\n attenuation=1.0/(1.0*dist);\n}\nvec3 transformedNormal=normalize(worldInverseTrans3*normal);\nfloat diffInt=dot(transformedNormal,sdir);vec3 viewPosition=normalize(vec3(viewInverse*vec4(0,0,0,1)-worldPosition));\nvec3 ambientAndSpecular=sa*ma;\nif(diffInt>=0.0){\n   // specular reflection\n   ambientAndSpecular+=(ss*ms*pow(max(dot(reflect(-sdir,transformedNormal),      viewPosition),0.0),mshin));\n}\ndiffuseVar=sd*md*max(0.0,dot(transformedNormal,sdir))*attenuation;\nambientAndSpecularVar=ambientAndSpecular;\n",
b+="colorAttrVar=colorAttr;\n",b+="textureUVVar=textureUV;\n",b+="gl_Position=projection*view*world*positionVec4;\n}");null==d&&(d="precision highp float;\nuniform sampler2D sampler;\nuniform float useTexture;\nuniform float useColorAttr;\nvarying vec2 textureUVVar;\nvarying vec3 colorAttrVar;\nvarying vec3 ambientAndSpecularVar;\nvarying vec3 diffuseVar;\n",d+="void main(){\n",d+=" vec4 baseColor;\n",d+=" baseColor=vec4(1.0,1.0,1.0,1.0)*(1.0-useTexture);\n",d+=" baseColor+=texture2D(sampler,textureUVVar)*useTexture;\n baseColor=baseColor*(1.0-useColorAttr) +\n  vec4(colorAttrVar,1.0)*useColorAttr;\n",
d+=" vec3 phong=ambientAndSpecularVar+diffuseVar*baseColor.rgb;\n gl_FragColor=vec4(phong,baseColor.a);\n",d+="}");this.c=fa(a,b,d);this.attributes={};this.a=a;this.q={};this.H={};if(null!=this.c){this.attributes=[];var f=null;b={};d=a.getProgramParameter(this.c,a.ACTIVE_ATTRIBUTES);for(var c=0;c<d;++c)if(f=a.getActiveAttrib(this.c,c),null!==f){var f=f.name,e=a.getAttribLocation(this.c,f);0<=e&&(this.attributes.push(e),b[f]=e)}d=a.getProgramParameter(this.c,a.ACTIVE_UNIFORMS);for(c=0;c<d;++c)e=a.getActiveUniform(this.c,
c),null!==e&&(f=e.name,b[f]=a.getUniformLocation(this.c,f),this.H[f]=e.type);this.q=b}}O.prototype.get=function(a){return this.q.hasOwnProperty(a)?this.q[a]:null};
function P(a,b){for(var d in b)if(b.hasOwnProperty(d)){v=b[d];var f=a.get(d);null!==f&&(3==v.length?a.a.uniform3f(f,v[0],v[1],v[2]):4==v.length?a.a.uniform4f(f,v[0],v[1],v[2],v[3]):16==v.length?a.a.uniformMatrix4fv(f,!1,v):9==v.length?a.a.uniformMatrix3fv(f,!1,v):a.H[d]==a.a.FLOAT?a.a.uniform1f(f,"number"==typeof v?v:v[0]):a.a.uniform1i(f,"number"==typeof v?v:v[0]))}}
function fa(a,b,d){function f(a,d,b){var c=a.createShader(d);a.shaderSource(c,b);a.compileShader(c);return a.getShaderParameter(c,a.COMPILE_STATUS)?c:(console.log((d==a.VERTEX_SHADER?"vertex: ":"fragment: ")+a.getShaderInfoLog(c)),null)}b=b&&0!=b.length?f(a,a.VERTEX_SHADER,b):null;d=d&&0!=d.length?f(a,a.FRAGMENT_SHADER,d):null;var c=null;null!==b&&null!==d&&(c=a.createProgram(),a.attachShader(c,b),a.attachShader(c,d),a.linkProgram(c),a.getProgramParameter(c,a.LINK_STATUS)?a.useProgram(c):(console.log("link: "+
a.getProgramInfoLog(c)),a.deleteProgram(c),c=null));null!==b&&a.deleteShader(b);null!==d&&a.deleteShader(d);return c}O.prototype.k=function(a){if(!a)return this;P(this,{sa:[a.f[0],a.f[1],a.f[2]],lightPosition:a.position,sd:a.h,ss:a.l});return this};function Q(){this.f=[0,0,0,1];this.position=[0,0,1,0];this.h=[1,1,1];this.l=[1,1,1]}function ga(){var a=[0,0,1],b=new Q;b.f=[.25,.25,.25];b.position=a?[a[0],a[1],a[2],0]:[0,0,1,0];b.h=[1,1,1];b.l=[1,1,1];return b}
(function(){function a(a){this.a=a}function b(d,b,c,e){this.kind=a.J;this.U=null==e?1:Math.min(Math.max(0,e),128);this.f=d||[.2,.2,.2];this.h=b||[.8,.8,.8];this.l=c||[0,0,0]}a.TEXTURE=1;a.J=2;a.prototype.t=function(a,f,c){return"number"==typeof a&&"number"==typeof f&&"number"==typeof c?new b([a,f,c],[a,f,c]):new b(a,a)};b.prototype.bind=function(a){P(a,{useTexture:0,mshin:this.U,ma:this.f,md:this.h,ms:this.l})};window.MaterialShade=b;window.Materials=a})(window);
function R(a){this.a=a;this.a.viewport(0,0,1*this.a.canvas.width,1*this.a.canvas.height);this.c=new O(a);this.g=[];this.clearColor=[0,0,0,1];this.S=new Materials(a);this.a.enable(a.BLEND);this.D=N();this.F=N();this.e=!0;this.C=this.o=null;this.w=new Q;this.a.blendFunc(a.SRC_ALPHA,a.ONE_MINUS_SRC_ALPHA);this.a.enable(this.a.DEPTH_TEST);this.a.depthFunc(this.a.LEQUAL);W(this);this.a.clearDepth(999999);this.a.clear(this.a.COLOR_BUFFER_BIT|this.a.DEPTH_BUFFER_BIT)}
R.prototype.useProgram=function(a){if(!a)throw Error("invalid program");a.a.useProgram(a.c);this.c=a;P(this.c,{sampler:0});this.c.k(this.w);this.e=!0;return this};function W(a){a.a.clearColor(a.clearColor[0],a.clearColor[1],a.clearColor[2],a.clearColor[3]);return a}R.prototype.t=function(a,b,d,f){return this.S.t(a,b,d,f)};
R.prototype.p=function(){if(this.e){var a;a=this.F;var b=a[0]*a[10],d=a[0]*a[11],f=a[0]*a[5],c=a[0]*a[6],e=a[0]*a[7],g=a[0]*a[9],h=a[10]*a[12],m=a[10]*a[13],l=a[10]*a[15],p=a[11]*a[12],q=a[11]*a[13],u=a[11]*a[14],k=a[1]*a[4],t=a[1]*a[6],w=a[1]*a[7],r=a[1]*a[8],x=a[2]*a[4],z=a[2]*a[5],B=a[2]*a[7],D=a[2]*a[8],E=a[2]*a[9],n=a[3]*a[4],F=a[3]*a[5],y=a[3]*a[6],S=a[3]*a[8],T=a[3]*a[9],U=a[4]*a[9],V=a[5]*a[8],Z=a[6]*a[8],aa=a[6]*a[9],ba=a[7]*a[8],ca=a[7]*a[9],J=k-f,K=t-z,L=w-F,M=x-c,f=f-k,t=z-t,z=B-y,k=n-
e,w=F-w,B=y-B,c=c-x,x=e-n,e=a[9]*a[12]*B+h*L+p*t+a[8]*a[13]*z+m*k+q*c+a[8]*a[14]*w+a[9]*a[14]*x+u*J+a[8]*a[15]*K+a[9]*a[15]*M+l*f;if(0==e)a=N();else{e=1/e;n=[];n[0]=a[6]*q-a[7]*m+ca*a[14]-a[5]*u-aa*a[15]+a[5]*l;n[1]=a[3]*m-a[2]*q-T*a[14]+a[1]*u+E*a[15]-a[1]*l;n[2]=a[13]*z+a[14]*w+a[15]*K;n[3]=a[9]*B+a[10]*L+a[11]*t;n[4]=a[7]*h-a[6]*p-ba*a[14]+a[4]*u+Z*a[15]-a[4]*l;n[5]=a[2]*p-a[3]*h+a[14]*(S-d)+a[15]*(b-D);n[6]=a[12]*B+a[14]*x+a[15]*M;n[7]=a[8]*z+a[10]*k+a[11]*c;n[8]=a[5]*p-ca*a[12]+ba*a[13]-a[4]*
q+a[15]*(U-V);n[9]=T*a[12]-a[1]*p+a[13]*(d-S)+a[15]*(r-g);n[10]=a[12]*L+a[13]*k+a[15]*f;n[11]=a[8]*w+a[9]*x+a[11]*J;n[12]=aa*a[12]-a[5]*h-Z*a[13]+a[4]*m+a[14]*(V-U);n[13]=a[1]*h-E*a[12]+a[13]*(D-b)+a[14]*(g-r);n[14]=a[12]*t+a[13]*c+a[14]*J;n[15]=a[8]*K+a[9]*M+a[10]*f;for(a=0;16>a;a++)n[a]*=e;a=n}this.C=a;P(this.c,{view:this.F,projection:this.D,viewInverse:this.C});this.e=!1}};R.prototype.k=function(a){this.w=a;this.c.k(this.w);return this};
R.prototype.B=function(){this.p();this.a.clear(this.a.COLOR_BUFFER_BIT);for(var a=0;a<this.g.length;a++)this.g[a].B(this.c);this.a.flush()};function X(a,b){this.n=b;this.a=a;this.A=new MaterialShade;this.scale=[1,1,1];this.r=0;this.position=[0,0,0];this.I=[0,0,0];this.N=!1;this.e=!0;this.o=[1,0,0,0,1,0,0,0,1];this.d=N()}var H=6;
X.prototype.p=function(){this.e=!1;var a=this.scale;this.d=[a[0],0,0,0,0,a[1],0,0,0,0,a[2],0,0,0,0,1];if(0!=this.r){var a=this.d,b=this.r,d=this.I,d=[d[0],d[1],d[2]];I(d);var b=b*Math.PI/180,f=Math.cos(b),c=Math.sin(b),e=1-f,g=d[0]*e,b=d[1]*e,e=d[2]*e,h=d[0]*c,m=d[1]*c,l=d[2]*c,c=d[0]*g+f,p=d[0]*b-l,q=d[0]*e+m,l=d[1]*g+l,u=d[1]*b+f,k=d[1]*e-h,g=d[2]*g-m,b=d[2]*b+h,d=d[2]*e+f;this.d=[a[0]*c+a[4]*p+a[8]*q,a[1]*c+a[5]*p+a[9]*q,a[2]*c+a[6]*p+a[10]*q,a[3]*c+a[7]*p+a[11]*q,a[0]*l+a[4]*u+a[8]*k,a[1]*l+a[5]*
u+a[9]*k,a[2]*l+a[6]*u+a[10]*k,a[3]*l+a[7]*u+a[11]*k,a[0]*g+a[4]*b+a[8]*d,a[1]*g+a[5]*b+a[9]*d,a[2]*g+a[6]*b+a[10]*d,a[3]*g+a[7]*b+a[11]*d,a[12],a[13],a[14],a[15]]}this.d[12]+=this.position[0];this.d[13]+=this.position[1];this.d[14]+=this.position[2];a=this.d;a=[a[0],a[1],a[2],a[4],a[5],a[6],a[8],a[9],a[10]];d=a[0]*a[4]*a[8]+a[3]*a[7]*a[2]+a[6]*a[1]*a[5]-a[6]*a[4]*a[2]-a[3]*a[1]*a[8]-a[0]*a[7]*a[5];0==d?a=[1,0,0,0,1,0,0,0,1]:(d=1/d,a=[(-a[5]*a[7]+a[4]*a[8])*d,(a[5]*a[6]-a[3]*a[8])*d,(-a[4]*a[6]+a[3]*
a[7])*d,(a[2]*a[7]-a[1]*a[8])*d,(-a[2]*a[6]+a[0]*a[8])*d,(a[1]*a[6]-a[0]*a[7])*d,(-a[2]*a[4]+a[1]*a[5])*d,(a[2]*a[3]-a[0]*a[5])*d,(-a[1]*a[3]+a[0]*a[4])*d]);this.o=a};
X.prototype.B=function(a){this.A&&this.A.bind(a);var b=this.a,d=this.n,f=a.get("position"),c=a.get("normal"),e=a.get("textureUV"),g=a.get("colorAttr");b.bindBuffer(b.ARRAY_BUFFER,d.W);b.bindBuffer(b.ELEMENT_ARRAY_BUFFER,d.P);d=d.format;5==d?(Y(b,f,3,b.FLOAT,24,0),Y(b,c,3,b.FLOAT,24,12)):d==H?(Y(b,f,3,b.FLOAT,32,0),Y(b,c,3,b.FLOAT,32,12),Y(b,e,2,b.FLOAT,32,24)):7==d?(Y(b,f,3,b.FLOAT,24,0),Y(b,g,3,b.FLOAT,24,12)):2==d?Y(b,f,2,b.FLOAT,8,0):3==d&&Y(b,f,3,b.FLOAT,12,0);b={};null!==a.get("world")&&(this.e&&
this.p(),b.world=this.d,b.worldInverseTrans3=this.o);b.useColorAttr=7==this.n.format?1:0;P(a,b);this.a.drawElements(this.N?this.a.LINES:this.a.TRIANGLES,this.n.Q,this.n.type,0)};function Y(a,b,d,f,c,e){null!==b&&(a.enableVertexAttribArray(b),a.vertexAttribPointer(b,d,f,!1,c,e))}
(function(a){function b(a){a=a||"#ff0000";this.height=this.width=1E3;var b=$("<canvas>").attr("width",this.width+"").attr("height",this.height+"").css({width:"100%",height:"100%",left:"0px",zIndex:-1,top:"0px",position:"fixed"});$("body").append(b);this.m=!0;this.count=0;if(b=b.get(0)){var c=null,e={antialias:!0};try{c=b.getContext("webgl",e)}catch(g){c=null}if(!c)try{c=b.getContext("experimental-webgl",e)}catch(h){c=null}if(!c)try{c=b.getContext("moz-webgl",e)}catch(m){c=null}if(!c)try{c=b.getContext("webkit-3d",
e)}catch(l){c=null}if(!c)try{c=b.getContext("2d",e)}catch(p){c=null}C(c)&&(c.getExtension("OES_element_index_uint"),c.getExtension("EXT_texture_filter_anisotropic"));b=c}else b=null;this.a=b;this.m=C(this.a);this.g=[];this.setColor(a)}b.V=function(a){var f=a[0]-7.5+b.b(15);360<=f?f=360-f:0>f&&(f=360+f);var c=a[1],c=15>=c?b.b(30):240<c?240+b.b(30):c-15+b.b(30),e=a=a[2],e=15>=e?b.b(30):240<e?240+b.b(30):e+b.b(30);0<a&&0<c&&255>c&&(25>=c&&(c=25),242<=c&&(c=242));return[f,c,e]};b.b=function(a){return Math.random()*
a|0};b.T=function(a){var b=a[0],c=a[1];a=a[2];var e=b;c>e&&(e=c);a>e&&(e=a);var g=b;c<g&&(g=c);a<g&&(g=a);var h=e+g,m=h/2;if(e===g)return[0,0>m?0:255<m?255:m,0];var g=e-g,h=255*g/(127.5>=m?h:510-h),l=0,l=g/2,l=b===e?(60*(e-a)+l)/g-(60*(e-c)+l)/g:a===e?240+(60*(e-c)+l)/g-(60*(e-b)+l)/g:120+(60*(e-b)+l)/g-(60*(e-a)+l)/g;if(0>l||360<=l)l=(l%360+360)%360;return[l,0>m?0:255<m?255:m,0>h?0:255<h?255:h]};b.v=function(a){var b=1*a[0],c=1*a[1],e=1*a[2],c=0>c?0:255<c?255:c,e=0>e?0:255<e?255:e;if(0===e)return[c,
c,c];a=0;127.5>=c?a=c*(255+e)/255:(a=c*e/255,a=c+e-a);var g=2*c-a;if(0>b||360<=b)b=(b%360+360)%360;var h=b+120;360<=h&&(h-=360);c=60>h?g+(a-g)*h/60:180>h?a:240>h?g+(a-g)*(240-h)/60:g;h=b;e=60>h?g+(a-g)*h/60:180>h?a:240>h?g+(a-g)*(240-h)/60:g;h=b-120;0>h&&(h+=360);b=60>h?g+(a-g)*h/60:180>h?a:240>h?g+(a-g)*(240-h)/60:g;return[0>c?0:255<c?255:c,0>e?0:255<e?255:e,0>b?0:255<b?255:b]};b.s=function(a){a="0"+(a|0).toString(16);return a.substring(a.length-2,a.length)};b.u=function(a){a=b.v(a);return"#"+b.s(a[0])+
b.s(a[1])+b.s(a[2])};b.R=function(a){return null==a||"undefined"==typeof a?null:(a=/^\#([A-F0-9]{2})([A-F0-9]{2})([A-F0-9]{2})$/i.exec(a))?[parseInt(a[1],16),parseInt(a[2],16),parseInt(a[3],16)]:null};b.prototype.start=function(){da(this.K.bind(this))};b.prototype.setColor=function(a){a=this.constructor.R(a);if(!a)throw Error("invalid color parameter");this.color=a;this.i=this.constructor.T(a);this.M()};b.prototype.M=function(){document.body.style.backgroundColor=this.constructor.u(this.i);if(this.m){var a=
this.constructor.v(this.i);this.L=G(this.a,[-1,-1,1,1,0,0,1,1,-1,1,1,1,0,0,1,0,-1,1,-1,1,0,0,0,0,-1,-1,-1,1,0,0,0,1,1,-1,-1,-1,0,0,1,1,1,1,-1,-1,0,0,1,0,1,1,1,-1,0,0,0,0,1,-1,1,-1,0,0,0,1,1,-1,-1,0,1,0,1,1,1,-1,1,0,1,0,1,0,-1,-1,1,0,1,0,0,0,-1,-1,-1,0,1,0,0,1,1,1,1,0,-1,0,1,1,1,1,-1,0,-1,0,1,0,-1,1,-1,0,-1,0,0,0,-1,1,1,0,-1,0,0,1,-1,-1,-1,0,0,1,1,1,-1,1,-1,0,0,1,1,0,1,1,-1,0,0,1,0,0,1,-1,-1,0,0,1,0,1,1,-1,1,0,0,-1,1,1,1,1,1,0,0,-1,1,0,-1,1,1,0,0,-1,0,0,-1,-1,1,0,0,-1,0,1],[0,1,2,0,2,3,4,5,6,4,6,7,
8,9,10,8,10,11,12,13,14,12,14,15,16,17,18,16,18,19,20,21,22,20,22,23]);this.G=ea(this.a);var b=(new R(this.a)).k(ga());b.D=N().slice(0,16);b.e=!0;b.clearColor=[a[0]/255,a[1]/255,a[2]/255,1];this.j=W(b)}else this.a.fillStyle=this.constructor.u(this.i),this.a.fillRect(0,0,this.width,this.height)};b.prototype.K=function(){this.count++;4<=this.count&&(this.count=0,this.O());this.m&&this.j.B()};b.prototype.O=function(){var a=this.constructor.V(this.i);if(this.m){300<this.g.length&&this.j.g.shift();var b=
this.constructor.b(2E3)/1E3-1,c=this.constructor.b(2E3)/1E3-1,e=this.constructor.b(60)/60,g=0==this.constructor.b(2)?this.L:this.G,h=(16+this.constructor.b(100))/1E3,m=this.constructor.v(a);m[0]/=255;m[1]/=255;m[2]/=255;var a=this.constructor.b(160),l=I([this.constructor.b(360)/360,this.constructor.b(360)/360,this.constructor.b(30)/30]),p=new X(this.a,g);p.scale=[h,h,h];p.e=!0;h=this.j.t(m);if(g!=this.G||h.kind==Materials.TEXTURE)p.r=a%360,p.I=l,p.e=!0;p.position=[b,c,e];p.e=!0;p.A=h;this.j.g.push(p)}else b=
[this.constructor.b(this.width+30)-30,this.constructor.b(this.height+30)-30,32+this.constructor.b(200),32+this.constructor.b(200)],this.a.fillStyle=this.constructor.u(a),this.a.fillRect(b[0],b[1],b[2],b[3])};b.colorBackground=function(a){$(document).ready(function(){(new b(a)).start()})};a.CanvasBackground=b})(this);
