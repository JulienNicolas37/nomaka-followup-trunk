/*!
 * VERSION: beta 0.2.0
 * DATE: 2013-05-07
 * UPDATES AND DOCS AT: http://www.greensock.com
 *
 * @license Copyright (c) 2008-2013, GreenSock. All rights reserved.
 * This work is subject to the terms at http://www.greensock.com/terms_of_use.html or for
 * Club GreenSock members, the software agreement that was issued with your membership.
 * 
 * @author: Jack Doyle, jack@greensock.com
 **/(window._gsQueue||(window._gsQueue=[])).push(function(){"use strict";window._gsDefine.plugin({propName:"directionalRotation",API:2,init:function(e,t){"object"!=typeof t&&(t={rotation:t}),this.finals={};var n,r,i,s,o,u,a=t.useRadians===!0?2*Math.PI:360,f=1e-6;for(n in t)"useRadians"!==n&&(u=(t[n]+"").split("_"),r=u[0],i=parseFloat("function"!=typeof e[n]?e[n]:e[n.indexOf("set")||"function"!=typeof e["get"+n.substr(3)]?n:"get"+n.substr(3)]()),s=this.finals[n]="string"==typeof r&&"="===r.charAt(1)?i+parseInt(r.charAt(0)+"1",10)*Number(r.substr(2)):Number(r)||0,o=s-i,u.length&&(r=u.join("_"),-1!==r.indexOf("short")&&(o%=a,o!==o%(a/2)&&(o=0>o?o+a:o-a)),-1!==r.indexOf("_cw")&&0>o?o=(o+9999999999*a)%a-(0|o/a)*a:-1!==r.indexOf("ccw")&&o>0&&(o=(o-9999999999*a)%a-(0|o/a)*a)),(o>f||-f>o)&&(this._addTween(e,n,i,i+o,n),this._overwriteProps.push(n)));return!0},set:function(e){var t;if(1!==e)this._super.setRatio.call(this,e);else for(t=this._firstPT;t;)t.f?t.t[t.p](this.finals[t.p]):t.t[t.p]=this.finals[t.p],t=t._next}})._autoCSS=!0}),window._gsDefine&&window._gsQueue.pop()();