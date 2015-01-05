/* This file is in the public domain. Peter O., 2015. http://upokecenter.dreamhosters.com
    Public domain dedication: http://creativecommons.org/publicdomain/zero/1.0/  */
    
function CanvasBackground(color){
  "use strict";
  color=color||"#ff0000";
  var canvas=$("<canvas>")
   .attr("width","1000")
   .attr("height","1000")
   .css({"maxWidth":"100%",
          "left":"0px",
          "zIndex":-1,
          "top":"0px",
         "position":"fixed"});
  $("body").append(canvas);
  this.canvas=canvas;
  this.context=canvas.get(0).getContext("2d");
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
 this.context.fillStyle=this.constructor.hls2hex(this.hls);
 this.context.fillRect(0,0,1000,1000);
}
CanvasBackground.prototype.drawOne=function(){
 var newhls=this.constructor.varyColor(this.hls);
 this.context.fillStyle=this.constructor.hls2hex(newhls);
 this.context.fillRect(
   this.constructor.rand(1000),
   this.constructor.rand(1000),
   32+this.constructor.rand(200),
   32+this.constructor.rand(200));
};
CanvasBackground.colorBackground=function(color){
$(document).ready(function(){
 var canvas=new CanvasBackground(color);
 window.setInterval(function(){
   canvas.drawOne();
 },100);
});
};
