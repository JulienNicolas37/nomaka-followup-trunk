/**
 * JQUERY SPRITE ANIM 0.1.7
 * ========================
 * A jQuery sprite animation library with:
 * - Full support for iPad/iPhone.
 * - Unlimited frames.
 * - Fast loading.
 * - Online generator.
 *
 * Author:   Morten Skyt @ Stupid Studio ApS <morten@stupid-studio.com>
 *
 * Sprite generator tool website:
 *           http://sprite.smplr.com
 *
 * Hosting for generator tool sponsored by:
 *           http://smplr.com
 *
 * Website and source code:
 *           http://github.com/StupidStudio/jQuery-Sprite-Anim
 *
 * License:  The MIT License (see LICENSE)
 */jQuery(function(e){var t=function(e,t){typeof t=="undefined"&&(t=!0);return typeof e=="undefined"?t:e.toLowerCase()==="true"||e>=1?!0:!1},n=function(t){typeof t!="string"&&e.error("String expected.");var n=t.split("x");n.length!==2&&e.error("Should be two elements only.");var r=[];e.each(n,function(){var t=Number(e.trim(this));isNaN(t)&&e.error(this+" is not a digit.");r.push(t)});return r},r=function(e){this.elem=e;this.initialize()};r.prototype.initialize=function(){var r={autoplay:t(e(this.elem).attr("data-autoplay"),!0),autoload:t(e(this.elem).attr("data-autoload"),!0),retina:t(e(this.elem).attr("data-retina"),!1),baseurl:e(this.elem).attr("data-baseurl"),gridsize:n(e(this.elem).attr("data-grid")),blocksize:n(e(this.elem).attr("data-blocksize")),frames:Number(e(this.elem).attr("data-frames")),fps:Number(e(this.elem).attr("data-fps")),forwards:t(e(this.elem).attr("data-forwards"),!0),curFrame:-1};if(isNaN(r.fps)||r.fps<=0)r.fps=12;r.baseurl||e.error("No baseurl defined.");r.gridsize||e.error("No grid size defined.");r.blocksize||e.error("No block size defined.");r.frames||e.error("No frame number defined.");(isNaN(r.frames)||r.frames<1)&&e.error("Frame number must be a positive digit.");e.extend(this,r);this.prepareElements();if(r.autoload){this.loadSheet();this.curFrame=this.getNextFrame();this.showCurrentFrame()}r.autoplay&&e(this.elem).one("sheet-0-loaded",this.play.bind(this))};r.prototype.getNoSheets=function(){var e=this.gridsize[0]*this.gridsize[1];return Math.ceil(this.frames/e)};r.prototype.getCurSheetIdx=function(){var e=this.gridsize[0]*this.gridsize[1];return Math.floor(this.curFrame/e)};r.prototype.getNextSheetIdx=function(){var e=this.getCurSheetIdx(),t;if(this.forwards){var t=e+1;t>=this.getNoSheets()&&(t=0)}else{var t=e-1;t<0&&(t=this.getNoSheets()-1)}return t};r.prototype.prepareElements=function(){var t=e(this.elem);t.css({position:"relative"});var n=this.getNoSheets()>1?2:1;for(var r=0;r<n;r++)t.append(e('<div class="sheet" data-idx="'+r+'">'));var i=t.children("div.sheet");i.css({position:"absolute"});var s=this.retina?.5:1;t.css({width:this.blocksize[0]*s,height:this.blocksize[1]*s,overflow:"hidden"});this.repositionSheets()};r.prototype.repositionSheets=function(){var t=e(this.elem),n=t.children("div.sheet"),r=this.getNoSheets()>1?2:1;n.eq(this.getCurSheetIdx()%r).css({left:"0%"});r===2&&n.eq((this.getCurSheetIdx()+1)%2).css({left:"100%"})};r.prototype.loadSheet=function(t){typeof t=="undefined"&&(t=[0,1]);Array.isArray(t)||(t=[Number(t)]);var n=this.elem;typeof this.loadedSheets=="undefined"&&(this.loadedSheets={});var r=this.loadedSheets,i=function(t){e(n).trigger("sheet-loaded",[t]);e(n).trigger("sheet-"+t+"-loaded",[t])};e.each(t,function(n,s){if(typeof r[s]!="undefined")return i(s);r[t]=1;e("<img>").attr("src",this.baseurl+s+".png").imageLoad(function(){i(s);r[s]=2})}.bind(this))};r.prototype.getNextFrame=function(){var e;if(this.forwards){e=this.curFrame+1;e>=this.frames&&(e=0)}else{e=this.curFrame-1;e<0&&(e=this.frames-1)}return e};r.prototype.play=function(){var t=e.Event("play");e(this.elem).trigger(t);if(t.isDefaultPrevented())return;this.doPlay()};r.prototype.doPlay=function(){var t=this;window.clearInterval(this.timer);var n=Math.round(1e3/this.fps),r=(new Date).getTime(),i=function(){var e=(new Date).getTime();if(r+n>e)return!1;r=(new Date).getTime();return!0},s=function(){if(t.mustStop){t.mustStop=!1;return}requestAnimFrame(s);if(!i())return;if(!e(this.elem).parent().length)return this.stop();var r=this.getNextFrame(),o=e.Event("frame-"+r+"-show");e(this.elem).trigger(o);if(o.isDefaultPrevented())return this.stop();if(r===this.frames-1){var o=e.Event("frame-last-show");e(this.elem).trigger(o);if(o.isDefaultPrevented())return this.stop()}this.curFrame=r;this.showCurrentFrame();var o=e.Event("frame-"+r+"-shown");e(this.elem).trigger(o);if(o.isDefaultPrevented())return this.stop();if(r===this.frames-1){var o=e.Event("frame-last-shown");e(this.elem).trigger(o);if(o.isDefaultPrevented())return this.stop()}}.bind(this);s()};r.prototype.prepareNextSheet=function(){if(this.getNextSheetIdx()===this.getCurSheetIdx())return;var t="url("+this.baseurl+this.getNextSheetIdx()+".png)",n=e(this.elem).children("div.sheet").eq((this.getCurSheetIdx()+1)%2);if(n.css("background-image")===t)return;n.css({"background-image":t})};r.prototype.showCurrentFrame=function(){this.repositionSheets();var t=this.curFrame%(this.gridsize[0]*this.gridsize[1]),n=t%this.gridsize[0],r=Math.floor(t/this.gridsize[0]),i=this.retina?.5:1,s=Math.floor(n*this.blocksize[0]*i),o=Math.floor(r*this.blocksize[1]*i),u=this.getSheetDimensions(this.getCurSheetIdx()),a=e(this.elem).children("div.sheet").eq(this.getCurSheetIdx()%2),f={"background-image":"url("+this.baseurl+this.getCurSheetIdx()+".png)","background-position":s*-1+"px "+o*-1+"px","background-size":u[0]+"px "+u[1]+"px",width:this.blocksize[0],height:this.blocksize[1]};f["background-size"]===a.css("background-size")&&delete f["background-size"];a.css("background-image").search(this.baseurl+this.getCurSheetIdx()+".png")!==-1&&delete f["background-image"];f.width===a.css("width")&&delete f.width;f.height===a.css("height")&&delete f.height;a.css(f);this.prepareNextSheet()};r.prototype.stop=function(){this.mustStop=!0};r.prototype.getSheetDimensions=function(e){var t=this.gridsize[0]*this.gridsize[1],n=e*t,r=n+t;r>this.frames&&(r=this.frames);var i=this.retina?.5:1,s=r-n,o=this.blocksize[0]*s,u=0;s>this.gridsize[0]&&(o=this.blocksize[0]*this.gridsize[0]);u=this.blocksize[1]*Math.ceil(s/this.gridsize[0]);return[o*i,u*i]};var i=function(t){if(e(t).data("spriteanim"))return e(t).data("spriteanim");var n=new r(t);e(t).data("spriteanim",n);return n};e.fn.spriteanim=function(t,n){typeof t=="undefined"&&(t="init");e(this).each(function(){var r=i(this);switch(t){case"init":break;case"stop":r.stop();r.timer=null;break;case"fps":r.fps=n;r.timer&&r.doPlay();break;case"play":r.play();break;case"forwards":r.forwards=n;break;default:e.error("Invalid action.")}});return this}});Function.prototype.bind||(Function.prototype.bind=function(e){if(typeof this!="function")throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");var t=Array.prototype.slice.call(arguments,1),n=this,r=function(){},i=function(){return n.apply(this instanceof r&&e?this:e,t.concat(Array.prototype.slice.call(arguments)))};r.prototype=this.prototype;i.prototype=new r;return i});Array.isArray||(Array.isArray=function(e){return Object.prototype.toString.call(e)==="[object Array]"});(function(e){e.ImageLoader=function(t){var n,r;n=new Image;r=e.Deferred(function(t){var r=".ImageLoader",i;i=e.map(["readystatechange","load","abort","error"],function(e){return e+r}).join(" ");e(n).bind(i,function(n){if(n.type==="readystatechange"&&this.readyState!=="complete")return!1;n.type==="abort"||n.type==="error"?t.rejectWith(this,[n]):t.resolveWith(this,[n]);e(this).unbind(r);return!1})}).promise();r.load=function(){n.src||(n.src=t);return this};return r};e.fn.imageLoad=function(t){return this.filter("img").each(function(){var n=this;n.src||e.error("imageLoad: undefined src attribute");e.ImageLoader(n.src).load().then(function(e){t.call(n,e)},function(e){t.call(n,e)})})}})(jQuery);window.requestAnimFrame=function(){return window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.oRequestAnimationFrame||window.msRequestAnimationFrame||function(e){window.setTimeout(e,1e3/60)}}();