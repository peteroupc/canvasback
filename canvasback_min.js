function ca(a){function b(){a();A(b)}a();A(b)}function C(a){return a&&"compileShader"in a}function A(a){var b=window.requestAnimationFrame||window.mozRequestAnimationFrame||window.webkitRequestAnimationFrame||window.msRequestAnimationFrame;b?b(a):window.setTimeout(a,17)}
function G(a,b,e){var f=H,c=a.createBuffer(),d=a.createBuffer();a.bindBuffer(a.ARRAY_BUFFER,c);a.bindBuffer(a.ELEMENT_ARRAY_BUFFER,d);a.bufferData(a.ARRAY_BUFFER,new Float32Array(b),a.STATIC_DRAW);var g=a.UNSIGNED_SHORT;65536<=b.length||65536<=e.length?(g=a.UNSIGNED_INT,a.bufferData(a.ELEMENT_ARRAY_BUFFER,new Uint32Array(e),a.STATIC_DRAW)):256>=b.length&&256>=e.length?(g=a.UNSIGNED_BYTE,a.bufferData(a.ELEMENT_ARRAY_BUFFER,new Uint8Array(e),a.STATIC_DRAW)):a.bufferData(a.ELEMENT_ARRAY_BUFFER,new Uint16Array(e),
a.STATIC_DRAW);return{W:c,P:d,Q:e.length,type:g,format:f}}
function da(a){var b,e;function f(a,e,b,c){return a[e]==a[b]&&a[e+1]==a[b+1]&&a[e+2]==a[b+2]||a[c]==a[b]&&a[c+1]==a[b+1]&&a[c+2]==a[b+2]||a[e]==a[c]&&a[e+1]==a[c+1]&&a[e+2]==a[c+2]}b=1;var c,d,g;"undefined"==typeof b&&(b=1);"undefined"==typeof e&&(e=6);if(0>=e)throw Error("div must be 1 or more");e=1<<e;for(var h=[],m=[],k=[],n=[],p=[],t,l=e-1;0<=l;l--){var u=-90+180*l/e;if(0==l)h[0]=0,h[1]=-1;else{var w=Math.PI/180*u,u=Math.cos(w),w=Math.sin(w);h[2*l]=u;h[2*l+1]=w}l==e-1?(m[2*l]=0,m[2*l+1]=1):(m[2*
l]=h[2*l+2],m[2*l+1]=h[2*l+3])}k[0]=1;k[1]=0;for(l=1;l<2*e;l++){var u=Math.PI/180*(360*l/e),r=Math.cos(u),x=Math.sin(u);k.push(r,x)}for(l=0;l<e;l++){t=!0;for(var u=h[2*l],w=h[2*l+1],z=m[2*l],B=m[2*l+1],D=1*l/e,E=1*(l+1)/e,q=0;q<2*e;q++){var r=k[2*q],x=k[2*q+1],F=y,y=1*(e-q)/e,y=y-.25;0>y&&(y+=1);c=-r*u;d=w;g=x*u;p.push(b*c,b*d,b*g,-c,-d,-g,0,0);c=-r*z;d=B;g=x*z;p.push(b*c,b*d,b*g,-c,-d,-g,0,0);t||(r=p.length/8-4,c=8*r,d=c+6,p[d]=F,p[d+1]=D,p[d+8]=F,p[d+9]=E,p[d+16]=y,p[d+17]=E,p[d+24]=y,p[d+25]=D,
0==l||l==e-1?(f(p,c,c+8,c+16)||n.push(r,r+1,r+2),f(p,c+8,c+16,c+24)||n.push(r+2,r+1,r+3)):n.push(r,r+1,r+2,r+2,r+1,r+3));t=!1}}return G(a,p,n)}function I(){return[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]}
function ea(a,b,e){b=b*Math.PI/180;var f=Math.cos(b),c=Math.sin(b),d,g;d=e[0];g=e[1];b=e[2];if(1==d&&0==g&&0==b)return[a[0],a[1],a[2],a[3],f*a[4]+a[8]*c,f*a[5]+a[9]*c,f*a[6]+a[10]*c,f*a[7]+a[11]*c,f*a[8]-c*a[4],f*a[9]-c*a[5],f*a[10]-c*a[6],f*a[11]-c*a[7],a[12],a[13],a[14],a[15]];if(0==d&&1==g&&0==b)return[f*a[0]-c*a[8],f*a[1]-c*a[9],f*a[2]-c*a[10],f*a[3]-c*a[11],a[4],a[5],a[6],a[7],f*a[8]+a[0]*c,f*a[9]+a[1]*c,f*a[10]+a[2]*c,f*a[11]+a[3]*c,a[12],a[13],a[14],a[15]];if(0==d&&0==g&&1==b)return[f*a[0]+
a[4]*c,f*a[1]+a[5]*c,f*a[2]+a[6]*c,f*a[3]+a[7]*c,f*a[4]-c*a[0],f*a[5]-c*a[1],f*a[6]-c*a[2],f*a[7]-c*a[3],a[8],a[9],a[10],a[11],a[12],a[13],a[14],a[15]];if(0==d&&0==g&&0==b)return a.slice(0,16);e=1/Math.sqrt(d*d+g*g+b*b);d*=e;g*=e;b*=e;var h=g*g,m=1-f,k=d*g,n=g*b;e=d*c;g*=c;var p=b*c,c=m*n,t=m*k,l=m*d*b;d=f+m*d*d;k=t+p;n=l-g;h=f+m*h;p=t-p;t=c+e;f+=m*b*b;b=l+g;e=c-e;return[a[0]*d+a[4]*k+a[8]*n,a[1]*d+a[5]*k+a[9]*n,a[10]*n+a[2]*d+a[6]*k,a[11]*n+a[3]*d+a[7]*k,a[0]*p+a[4]*h+a[8]*t,a[1]*p+a[5]*h+a[9]*t,
a[10]*t+a[2]*p+a[6]*h,a[11]*t+a[3]*p+a[7]*h,a[0]*b+a[4]*e+a[8]*f,a[1]*b+a[5]*e+a[9]*f,a[10]*f+a[2]*b+a[6]*e,a[11]*f+a[3]*b+a[7]*e,a[12],a[13],a[14],a[15]]}
function N(a,b,e){null==b&&(b="attribute vec3 position;\nattribute vec3 normal;\nattribute vec2 textureUV;\nattribute vec3 colorAttr;\nuniform mat4 world;\nuniform mat4 view;\nuniform mat4 projection;\nvarying vec2 textureUVVar;\nvarying vec3 colorAttrVar;\nuniform mat4 viewInverse; /* internal */\nuniform mat3 worldInverseTrans3; /* internal */\nuniform float alpha;\nuniform vec4 lightPosition;\nuniform vec3 sa;\nuniform vec3 ma;\nuniform vec3 sd;\nuniform vec3 md;\nuniform vec3 ss;\nuniform vec3 ms;\nuniform float mshin;\nvarying vec3 ambientAndSpecularVar;\nvarying vec3 diffuseVar;\nvoid main(){\nvec4 positionVec4=vec4(position,1.0);\n",b+=
"vec4 worldPosition=world*positionVec4;\nvec3 sdir;\nfloat attenuation;\nif(lightPosition.w == 0.0){\n sdir=normalize(vec3(lightPosition));\n attenuation=1.0;\n} else {\n vec3 vertexToLight=vec3(lightPosition-worldPosition);\n float dist=length(vertexToLight);\n sdir=normalize(vertexToLight);\n attenuation=1.0/(1.0*dist);\n}\nvec3 transformedNormal=normalize(worldInverseTrans3*normal);\nfloat diffInt=dot(transformedNormal,sdir);vec3 viewPosition=normalize(vec3(viewInverse*vec4(0,0,0,1)-worldPosition));\nvec3 ambientAndSpecular=sa*ma;\nif(diffInt>=0.0){\n   // specular reflection\n   ambientAndSpecular+=(ss*ms*pow(max(dot(reflect(-sdir,transformedNormal),      viewPosition),0.0),mshin));\n}\ndiffuseVar=sd*md*max(0.0,dot(transformedNormal,sdir))*attenuation;\nambientAndSpecularVar=ambientAndSpecular;\n",
b+="colorAttrVar=colorAttr;\n",b+="textureUVVar=textureUV;\n",b+="gl_Position=projection*view*world*positionVec4;\n}");null==e&&(e="precision highp float;\nuniform sampler2D sampler;\nuniform float useTexture;\nuniform float useColorAttr;\nvarying vec2 textureUVVar;\nvarying vec3 colorAttrVar;\nvarying vec3 ambientAndSpecularVar;\nvarying vec3 diffuseVar;\n",e+="void main(){\n",e+=" vec4 baseColor;\n",e+=" baseColor=vec4(1.0,1.0,1.0,1.0)*(1.0-useTexture);\n",e+=" baseColor+=texture2D(sampler,textureUVVar)*useTexture;\n baseColor=baseColor*(1.0-useColorAttr) +\n  vec4(colorAttrVar,1.0)*useColorAttr;\n",
e+=" vec3 phong=ambientAndSpecularVar+diffuseVar*baseColor.rgb;\n gl_FragColor=vec4(phong,baseColor.a);\n",e+="}");this.c=fa(a,b,e);this.attributes={};this.a=a;this.q={};this.H={};if(null!=this.c){this.attributes=[];var f=null;b={};e=a.getProgramParameter(this.c,a.ACTIVE_ATTRIBUTES);for(var c=0;c<e;++c)if(f=a.getActiveAttrib(this.c,c),null!==f){var f=f.name,d=a.getAttribLocation(this.c,f);0<=d&&(this.attributes.push(d),b[f]=d)}e=a.getProgramParameter(this.c,a.ACTIVE_UNIFORMS);for(c=0;c<e;++c)d=a.getActiveUniform(this.c,
c),null!==d&&(f=d.name,b[f]=a.getUniformLocation(this.c,f),this.H[f]=d.type);this.q=b}}N.prototype.get=function(a){return this.q.hasOwnProperty(a)?this.q[a]:null};
function O(a,b){for(var e in b)if(b.hasOwnProperty(e)){v=b[e];var f=a.get(e);null!==f&&(3==v.length?a.a.uniform3f(f,v[0],v[1],v[2]):4==v.length?a.a.uniform4f(f,v[0],v[1],v[2],v[3]):16==v.length?a.a.uniformMatrix4fv(f,!1,v):9==v.length?a.a.uniformMatrix3fv(f,!1,v):a.H[e]==a.a.FLOAT?a.a.uniform1f(f,"number"==typeof v?v:v[0]):a.a.uniform1i(f,"number"==typeof v?v:v[0]))}}
function fa(a,b,e){function f(a,e,b){var c=a.createShader(e);a.shaderSource(c,b);a.compileShader(c);return a.getShaderParameter(c,a.COMPILE_STATUS)?c:(console.log((e==a.VERTEX_SHADER?"vertex: ":"fragment: ")+a.getShaderInfoLog(c)),null)}b=b&&0!=b.length?f(a,a.VERTEX_SHADER,b):null;e=e&&0!=e.length?f(a,a.FRAGMENT_SHADER,e):null;var c=null;null!==b&&null!==e&&(c=a.createProgram(),a.attachShader(c,b),a.attachShader(c,e),a.linkProgram(c),a.getProgramParameter(c,a.LINK_STATUS)?a.useProgram(c):(console.log("link: "+
a.getProgramInfoLog(c)),a.deleteProgram(c),c=null));null!==b&&a.deleteShader(b);null!==e&&a.deleteShader(e);return c}N.prototype.k=function(a){if(!a)return this;O(this,{sa:[a.f[0],a.f[1],a.f[2]],lightPosition:a.position,sd:a.h,ss:a.l});return this};function P(){this.f=[0,0,0,1];this.position=[0,0,1,0];this.h=[1,1,1];this.l=[1,1,1]}function ga(){var a=[0,0,1],b=new P;b.f=[.25,.25,.25];b.position=a?[a[0],a[1],a[2],0]:[0,0,1,0];b.h=[1,1,1];b.l=[1,1,1];return b}
(function(){function a(a){this.a=a}function b(e,b,c,d){this.kind=a.J;this.U=null==d?1:Math.min(Math.max(0,d),128);this.f=e||[.2,.2,.2];this.h=b||[.8,.8,.8];this.l=c||[0,0,0]}a.TEXTURE=1;a.J=2;a.prototype.t=function(a,f,c){return"number"==typeof a&&"number"==typeof f&&"number"==typeof c?new b([a,f,c],[a,f,c]):new b(a,a)};b.prototype.bind=function(a){O(a,{useTexture:0,mshin:this.U,ma:this.f,md:this.h,ms:this.l})};window.MaterialShade=b;window.Materials=a})(window);
function Q(a){this.a=a;this.a.viewport(0,0,1*this.a.canvas.width,1*this.a.canvas.height);this.c=new N(a);this.g=[];this.clearColor=[0,0,0,1];this.S=new Materials(a);this.a.enable(a.BLEND);this.a.enable(a.CULL_FACE);this.D=I();this.F=I();this.e=!0;this.C=this.o=null;this.w=new P;this.a.blendFunc(a.SRC_ALPHA,a.ONE_MINUS_SRC_ALPHA);this.a.enable(this.a.DEPTH_TEST);this.a.depthFunc(this.a.LEQUAL);R(this);this.a.clearDepth(999999);this.a.clear(this.a.COLOR_BUFFER_BIT|this.a.DEPTH_BUFFER_BIT)}
Q.prototype.useProgram=function(a){if(!a)throw Error("invalid program");a.a.useProgram(a.c);this.c=a;O(this.c,{sampler:0});this.c.k(this.w);this.e=!0;return this};function R(a){a.a.clearColor(a.clearColor[0],a.clearColor[1],a.clearColor[2],a.clearColor[3]);return a}Q.prototype.t=function(a,b,e,f){return this.S.t(a,b,e,f)};
Q.prototype.p=function(){if(this.e){var a;a=this.F;var b=a[0]*a[10],e=a[0]*a[11],f=a[0]*a[5],c=a[0]*a[6],d=a[0]*a[7],g=a[0]*a[9],h=a[10]*a[12],m=a[10]*a[13],k=a[10]*a[15],n=a[11]*a[12],p=a[11]*a[13],t=a[11]*a[14],l=a[1]*a[4],u=a[1]*a[6],w=a[1]*a[7],r=a[1]*a[8],x=a[2]*a[4],z=a[2]*a[5],B=a[2]*a[7],D=a[2]*a[8],E=a[2]*a[9],q=a[3]*a[4],F=a[3]*a[5],y=a[3]*a[6],S=a[3]*a[8],T=a[3]*a[9],U=a[4]*a[9],V=a[5]*a[8],Y=a[6]*a[8],Z=a[6]*a[9],aa=a[7]*a[8],ba=a[7]*a[9],J=l-f,K=u-z,L=w-F,M=x-c,f=f-l,u=z-u,z=B-y,l=q-
d,w=F-w,B=y-B,c=c-x,x=d-q,d=a[9]*a[12]*B+h*L+n*u+a[8]*a[13]*z+m*l+p*c+a[8]*a[14]*w+a[9]*a[14]*x+t*J+a[8]*a[15]*K+a[9]*a[15]*M+k*f;if(0==d)a=I();else{d=1/d;q=[];q[0]=a[6]*p-a[7]*m+ba*a[14]-a[5]*t-Z*a[15]+a[5]*k;q[1]=a[3]*m-a[2]*p-T*a[14]+a[1]*t+E*a[15]-a[1]*k;q[2]=a[13]*z+a[14]*w+a[15]*K;q[3]=a[9]*B+a[10]*L+a[11]*u;q[4]=a[7]*h-a[6]*n-aa*a[14]+a[4]*t+Y*a[15]-a[4]*k;q[5]=a[2]*n-a[3]*h+a[14]*(S-e)+a[15]*(b-D);q[6]=a[12]*B+a[14]*x+a[15]*M;q[7]=a[8]*z+a[10]*l+a[11]*c;q[8]=a[5]*n-ba*a[12]+aa*a[13]-a[4]*
p+a[15]*(U-V);q[9]=T*a[12]-a[1]*n+a[13]*(e-S)+a[15]*(r-g);q[10]=a[12]*L+a[13]*l+a[15]*f;q[11]=a[8]*w+a[9]*x+a[11]*J;q[12]=Z*a[12]-a[5]*h-Y*a[13]+a[4]*m+a[14]*(V-U);q[13]=a[1]*h-E*a[12]+a[13]*(D-b)+a[14]*(g-r);q[14]=a[12]*u+a[13]*c+a[14]*J;q[15]=a[8]*K+a[9]*M+a[10]*f;for(a=0;16>a;a++)q[a]*=d;a=q}this.C=a;O(this.c,{view:this.F,projection:this.D,viewInverse:this.C});this.e=!1}};Q.prototype.k=function(a){this.w=a;this.c.k(this.w);return this};
Q.prototype.B=function(){this.p();this.a.clear(this.a.COLOR_BUFFER_BIT);for(var a=0;a<this.g.length;a++)this.g[a].B(this.c);this.a.flush()};function W(a,b){this.n=b;this.a=a;this.A=new MaterialShade;this.scale=[1,1,1];this.r=0;this.position=[0,0,0];this.I=[0,0,0];this.N=!1;this.e=!0;this.o=[1,0,0,0,1,0,0,0,1];this.d=I()}var H=6;
W.prototype.p=function(){this.e=!1;var a=this.scale;this.d=[a[0],0,0,0,0,a[1],0,0,0,0,a[2],0,0,0,0,1];0!=this.r&&(this.d=ea(this.d,this.r,this.I));this.d[12]+=this.position[0];this.d[13]+=this.position[1];this.d[14]+=this.position[2];var a=this.d,a=[a[0],a[1],a[2],a[4],a[5],a[6],a[8],a[9],a[10]],b=a[0]*a[4]*a[8]+a[3]*a[7]*a[2]+a[6]*a[1]*a[5]-a[6]*a[4]*a[2]-a[3]*a[1]*a[8]-a[0]*a[7]*a[5];0==b?a=[1,0,0,0,1,0,0,0,1]:(b=1/b,a=[(-a[5]*a[7]+a[4]*a[8])*b,(a[5]*a[6]-a[3]*a[8])*b,(-a[4]*a[6]+a[3]*a[7])*b,(a[2]*
a[7]-a[1]*a[8])*b,(-a[2]*a[6]+a[0]*a[8])*b,(a[1]*a[6]-a[0]*a[7])*b,(-a[2]*a[4]+a[1]*a[5])*b,(a[2]*a[3]-a[0]*a[5])*b,(-a[1]*a[3]+a[0]*a[4])*b]);this.o=a};
W.prototype.B=function(a){this.A&&this.A.bind(a);var b=this.a,e=this.n,f=a.get("position"),c=a.get("normal"),d=a.get("textureUV"),g=a.get("colorAttr");b.bindBuffer(b.ARRAY_BUFFER,e.W);b.bindBuffer(b.ELEMENT_ARRAY_BUFFER,e.P);e=e.format;5==e?(X(b,f,3,b.FLOAT,24,0),X(b,c,3,b.FLOAT,24,12)):e==H?(X(b,f,3,b.FLOAT,32,0),X(b,c,3,b.FLOAT,32,12),X(b,d,2,b.FLOAT,32,24)):7==e?(X(b,f,3,b.FLOAT,24,0),X(b,g,3,b.FLOAT,24,12)):2==e?X(b,f,2,b.FLOAT,8,0):3==e&&X(b,f,3,b.FLOAT,12,0);b={};null!==a.get("world")&&(this.e&&
this.p(),b.world=this.d,b.worldInverseTrans3=this.o);b.useColorAttr=7==this.n.format?1:0;O(a,b);this.a.drawElements(this.N?this.a.LINES:this.a.TRIANGLES,this.n.Q,this.n.type,0)};function X(a,b,e,f,c,d){null!==b&&(a.enableVertexAttribArray(b),a.vertexAttribPointer(b,e,f,!1,c,d))}
(function(a){function b(a){a=a||"#ff0000";this.height=this.width=1E3;var b=$("<canvas>").attr("width",this.width+"").attr("height",this.height+"").css({width:"100%",height:"100%",left:"0px",zIndex:-1,top:"0px",position:"fixed"});$("body").append(b);this.m=!0;this.count=0;if(b=b.get(0)){var c=null,d={antialias:!0};try{c=b.getContext("webgl",d)}catch(g){c=null}if(!c)try{c=b.getContext("experimental-webgl",d)}catch(h){c=null}if(!c)try{c=b.getContext("moz-webgl",d)}catch(m){c=null}if(!c)try{c=b.getContext("webkit-3d",
d)}catch(k){c=null}if(!c)try{c=b.getContext("2d",d)}catch(n){c=null}C(c)&&(c.getExtension("OES_element_index_uint"),c.getExtension("EXT_texture_filter_anisotropic"));b=c}else b=null;this.a=b;this.m=C(this.a);this.g=[];this.setColor(a)}b.V=function(a){var f=a[0]-7.5+b.b(15);360<=f?f=360-f:0>f&&(f=360+f);var c=a[1],c=15>=c?b.b(30):240<c?240+b.b(30):c-15+b.b(30),d=a=a[2],d=15>=d?b.b(30):240<d?240+b.b(30):d+b.b(30);0<a&&0<c&&255>c&&(25>=c&&(c=25),242<=c&&(c=242));return[f,c,d]};b.b=function(a){return Math.random()*
a|0};b.T=function(a){var b=a[0],c=a[1];a=a[2];var d=b;c>d&&(d=c);a>d&&(d=a);var g=b;c<g&&(g=c);a<g&&(g=a);var h=d+g,m=h/2;if(d===g)return[0,0>m?0:255<m?255:m,0];var g=d-g,h=255*g/(127.5>=m?h:510-h),k=0,k=g/2,k=b===d?(60*(d-a)+k)/g-(60*(d-c)+k)/g:a===d?240+(60*(d-c)+k)/g-(60*(d-b)+k)/g:120+(60*(d-b)+k)/g-(60*(d-a)+k)/g;if(0>k||360<=k)k=(k%360+360)%360;return[k,0>m?0:255<m?255:m,0>h?0:255<h?255:h]};b.v=function(a){var b=1*a[0],c=1*a[1],d=1*a[2],c=0>c?0:255<c?255:c,d=0>d?0:255<d?255:d;if(0===d)return[c,
c,c];a=0;127.5>=c?a=c*(255+d)/255:(a=c*d/255,a=c+d-a);var g=2*c-a;if(0>b||360<=b)b=(b%360+360)%360;var h=b+120;360<=h&&(h-=360);c=60>h?g+(a-g)*h/60:180>h?a:240>h?g+(a-g)*(240-h)/60:g;h=b;d=60>h?g+(a-g)*h/60:180>h?a:240>h?g+(a-g)*(240-h)/60:g;h=b-120;0>h&&(h+=360);b=60>h?g+(a-g)*h/60:180>h?a:240>h?g+(a-g)*(240-h)/60:g;return[0>c?0:255<c?255:c,0>d?0:255<d?255:d,0>b?0:255<b?255:b]};b.s=function(a){a="0"+(a|0).toString(16);return a.substring(a.length-2,a.length)};b.u=function(a){a=b.v(a);return"#"+b.s(a[0])+
b.s(a[1])+b.s(a[2])};b.R=function(a){return null==a||"undefined"==typeof a?null:(a=/^\#([A-F0-9]{2})([A-F0-9]{2})([A-F0-9]{2})$/i.exec(a))?[parseInt(a[1],16),parseInt(a[2],16),parseInt(a[3],16)]:null};b.prototype.start=function(){ca(this.K.bind(this))};b.prototype.setColor=function(a){a=this.constructor.R(a);if(!a)throw Error("invalid color parameter");this.color=a;this.i=this.constructor.T(a);this.M()};b.prototype.M=function(){document.body.style.backgroundColor=this.constructor.u(this.i);if(this.m){var a=
this.constructor.v(this.i);this.L=G(this.a,[-1,-1,1,-1,0,0,1,1,-1,1,-1,-1,0,0,0,0,-1,1,1,-1,0,0,1,0,-1,-1,-1,-1,0,0,0,1,1,-1,-1,1,0,0,1,1,1,1,1,1,0,0,0,0,1,1,-1,1,0,0,1,0,1,-1,1,1,0,0,0,1,1,-1,-1,0,-1,0,1,1,-1,-1,1,0,-1,0,0,0,1,-1,1,0,-1,0,1,0,-1,-1,-1,0,-1,0,0,1,1,1,1,0,1,0,1,1,-1,1,-1,0,1,0,0,0,1,1,-1,0,1,0,1,0,-1,1,1,0,1,0,0,1,-1,-1,-1,0,0,-1,1,1,1,1,-1,0,0,-1,0,0,-1,1,-1,0,0,-1,1,0,1,-1,-1,0,0,-1,0,1,1,-1,1,0,0,1,1,1,-1,1,1,0,0,1,0,0,1,1,1,0,0,1,1,0,-1,-1,1,0,0,1,0,1],[0,1,2,0,3,1,4,5,6,4,7,5,
8,9,10,8,11,9,12,13,14,12,15,13,16,17,18,16,19,17,20,21,22,20,23,21]);this.G=da(this.a);var b=(new Q(this.a)).k(ga());b.D=I().slice(0,16);b.e=!0;b.clearColor=[a[0]/255,a[1]/255,a[2]/255,1];this.j=R(b)}else this.a.fillStyle=this.constructor.u(this.i),this.a.fillRect(0,0,this.width,this.height)};b.prototype.K=function(){this.count++;4<=this.count&&(this.count=0,this.O());this.m&&this.j.B()};b.prototype.O=function(){var a=this.constructor.V(this.i);if(this.m){300<this.g.length&&this.j.g.shift();var b=
this.constructor.b(2E3)/1E3-1,c=this.constructor.b(2E3)/1E3-1,d=this.constructor.b(60)/60,g=0==this.constructor.b(2)?this.L:this.G,h=(16+this.constructor.b(100))/1E3,m=this.constructor.v(a);m[0]/=255;m[1]/=255;m[2]/=255;var a=this.constructor.b(160),k=[this.constructor.b(360)/360,this.constructor.b(360)/360,this.constructor.b(30)/30],n=k[0],p=k[1],t=k[2];len=Math.sqrt(n*n+p*p+t*t);0!=len&&(len=1/len,k[0]*=len,k[1]*=len,k[2]*=len);n=new W(this.a,g);n.scale=[h,h,h];n.e=!0;h=this.j.t(m);if(g!=this.G||
h.kind==Materials.TEXTURE)n.r=a%360,n.I=k,n.e=!0;n.position=[b,c,d];n.e=!0;n.A=h;this.j.g.push(n)}else b=[this.constructor.b(this.width+30)-30,this.constructor.b(this.height+30)-30,32+this.constructor.b(200),32+this.constructor.b(200)],this.a.fillStyle=this.constructor.u(a),this.a.fillRect(b[0],b[1],b[2],b[3])};b.colorBackground=function(a){$(document).ready(function(){(new b(a)).start()})};a.CanvasBackground=b})(this);
