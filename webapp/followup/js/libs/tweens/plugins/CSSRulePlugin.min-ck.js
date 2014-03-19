/*!
 * VERSION: beta 0.6.0
 * DATE: 2013-07-03
 * UPDATES AND DOCS AT: http://www.greensock.com
 *
 * @license Copyright (c) 2008-2013, GreenSock. All rights reserved.
 * This work is subject to the terms at http://www.greensock.com/terms_of_use.html or for
 * Club GreenSock members, the software agreement that was issued with your membership.
 * 
 * @author: Jack Doyle, jack@greensock.com
 */(window._gsQueue||(window._gsQueue=[])).push(function(){"use strict";window._gsDefine("plugins.CSSRulePlugin",["plugins.TweenPlugin","TweenLite","plugins.CSSPlugin"],function(e,t,n){var r=function(){e.call(this,"cssRule"),this._overwriteProps.length=0},i=window.document,s=n.prototype.setRatio,o=r.prototype=new n;return o._propName="cssRule",o.constructor=r,r.API=2,r.getRule=function(e){var t,n,r,s,o=i.all?"rules":"cssRules",u=i.styleSheets,a=u.length,f=":"===e.charAt(0);for(e=(f?"":",")+e.toLowerCase()+",",f&&(s=[]);--a>-1;){try{n=u[a][o]}catch(l){console.log(l);continue}for(t=n.length;--t>-1;)if(r=n[t],r.selectorText&&-1!==(","+r.selectorText.split("::").join(":").toLowerCase()+",").indexOf(e)){if(!f)return r.style;s.push(r.style)}}return s},o._onInitTween=function(e,t,r){if(void 0===e.cssText)return!1;var s=i.createElement("div");return this._ss=e,this._proxy=s.style,s.style.cssText=e.cssText,n.prototype._onInitTween.call(this,s,t,r),!0},o.setRatio=function(e){s.call(this,e),this._ss.cssText=this._proxy.cssText},e.activate([r]),r},!0)}),window._gsDefine&&window._gsQueue.pop()();