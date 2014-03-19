/*!
 * VERSION: beta 1.4.0
 * DATE: 2013-02-27
 * UPDATES AND DOCS AT: http://www.greensock.com
 *
 * @license Copyright (c) 2008-2013, GreenSock. All rights reserved.
 * This work is subject to the terms at http://www.greensock.com/terms_of_use.html or for
 * Club GreenSock members, the software agreement that was issued with your membership.
 * 
 * @author: Jack Doyle, jack@greensock.com
 **/(window._gsQueue||(window._gsQueue=[])).push(function(){"use strict";var e=window._gsDefine.plugin({propName:"roundProps",priority:-1,API:2,init:function(e,t,n){return this._tween=n,!0}}),t=e.prototype;t._onInitAllProps=function(){for(var e,t,n,r=this._tween,i=r.vars.roundProps instanceof Array?r.vars.roundProps:r.vars.roundProps.split(","),s=i.length,o={},u=r._propLookup.roundProps;--s>-1;)o[i[s]]=1;for(s=i.length;--s>-1;)for(e=i[s],t=r._firstPT;t;)n=t._next,t.pg?t.t._roundProps(o,!0):t.n===e&&(this._add(t.t,e,t.s,t.c),n&&(n._prev=t._prev),t._prev?t._prev._next=n:r._firstPT===t&&(r._firstPT=n),t._next=t._prev=null,r._propLookup[e]=u),t=n;return!1},t._add=function(e,t,n,r){this._addTween(e,t,n,n+r,t,!0),this._overwriteProps.push(t)}}),window._gsDefine&&window._gsQueue.pop()();