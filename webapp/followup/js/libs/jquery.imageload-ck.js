/*
 * jquery.imageload -  reliable image load event 
 *
 * Copyright (c) 2011 Jess Thrysoee (jess@thrysoee.dk)
 * Licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) license.
 *//*jshint jquery:true*/(function(e){e.ImageLoader=function(t){var n,r;n=new Image;r=e.Deferred(function(t){var r=".ImageLoader",i;i=e.map(["readystatechange","load","abort","error"],function(e){return e+r}).join(" ");e(n).bind(i,function(n){if(n.type==="readystatechange"&&this.readyState!=="complete")return!1;n.type==="abort"||n.type==="error"?t.rejectWith(this,[n]):t.resolveWith(this,[n]);e(this).unbind(r);return!1})}).promise();r.load=function(){n.src||(n.src=t);return this};return r};e.fn.imageLoad=function(t){return this.filter("img").each(function(){var n=this;n.src||e.error("imageLoad: undefined src attribute");e.ImageLoader(n.src).load().then(function(e){t.call(n,e)},function(e){t.call(n,e)})})}})(jQuery);