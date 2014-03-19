/*!
 * VERSION: 0.2.0
 * DATE: 2013-07-10
 * UPDATES AND DOCS AT: http://www.greensock.com
 *
 * @license Copyright (c) 2008-2013, GreenSock. All rights reserved.
 * This work is subject to the terms at http://www.greensock.com/terms_of_use.html or for
 * Club GreenSock members, the software agreement that was issued with your membership.
 * 
 * @author: Jack Doyle, jack@greensock.com
 */(window._gsQueue||(window._gsQueue=[])).push(function(){"use strict";window._gsDefine.plugin({propName:"attr",API:2,init:function(e,t){var n;if("function"!=typeof e.setAttribute)return!1;this._target=e,this._proxy={};for(n in t)this._addTween(this._proxy,n,parseFloat(e.getAttribute(n)),t[n],n)&&this._overwriteProps.push(n);return!0},set:function(e){this._super.setRatio.call(this,e);for(var t,n=this._overwriteProps,r=n.length;--r>-1;)t=n[r],this._target.setAttribute(t,this._proxy[t]+"")}})}),window._gsDefine&&window._gsQueue.pop()();