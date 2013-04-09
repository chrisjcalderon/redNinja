/*
 * Superfish v1.6.5 - jQuery menu widget
 * Copyright (c) 2013 Joel Birch
 *
 * Dual licensed under the MIT and GPL licenses:
 * 	http://www.opensource.org/licenses/mit-license.php
 * 	http://www.gnu.org/licenses/gpl.html
 *
 */(function(e){e.fn.superfish=function(t){var n=e.fn.superfish,r=n.c,i=e('<span class="'+r.arrowClass+'"> &#187;</span>'),s=function(){var t=e(this),n=f(t);clearTimeout(n.sfTimer);t.showSuperfishUl().siblings().hideSuperfishUl()},o=function(t){var r=e(this),i=f(r);if(t.type==="click"||n.ios)e.proxy(u,r,i)();else{clearTimeout(i.sfTimer);i.sfTimer=setTimeout(e.proxy(u,r,i),i.delay)}},u=function(t){t.retainPath=e.inArray(this[0],t.$path)>-1;this.hideSuperfishUl();if(!this.parents("."+t.hoverClass).length){t.onIdle.call(a(this));t.$path.length&&e.proxy(s,t.$path)()}},a=function(e){return e.closest("."+r.menuClass)},f=function(e){return a(e).data("sf-options")},l=function(e){e.css("ms-touch-action","none")},c=function(t,r){var i="li:has(ul)";r.useClick||(e.fn.hoverIntent&&!r.disableHI?t.hoverIntent(s,o,i):t.on("mouseenter",i,s).on("mouseleave",i,o));var u="MSPointerDown";n.ios||(u+=" touchstart");n.wp7&&(u+=" mousedown");t.on("focusin","li",s).on("focusout","li",o).on("click","a",r,p).on(u,"a",h)},h=function(t){var n=e(this),r=n.siblings("ul");if(r.length>0&&r.is(":hidden")){n.data("follow",!1);if(t.type==="MSPointerDown"){n.trigger("focus");return!1}}},p=function(t){var n=e(this),r=t.data,i=n.siblings("ul"),u=n.data("follow")===!1?!1:!0;if(i.length&&(r.useClick||!u)){t.preventDefault();i.is(":hidden")?e.proxy(s,n.parent("li"))():r.useClick&&u&&e.proxy(o,n.parent("li"),t)()}},d=function(t,n){return t.find("li."+n.pathClass).slice(0,n.pathLevels).addClass(n.hoverClass+" "+r.bcClass).filter(function(){return e(this).children("ul").hide().show().length}).removeClass(n.pathClass)},v=function(t,n){n.autoArrows&&t.children("a").each(function(){m(e(this))})},m=function(e){e.addClass(r.anchorClass).append(i.clone())};n.getOptions=f;return this.addClass(r.menuClass).each(function(){var i=e(this),s=e.extend({},n.defaults,t),o=i.find("li:has(ul)");s.$path=d(i,s);i.data("sf-options",s);v(o,s);l(i);c(i,s);o.not("."+r.bcClass).hideSuperfishUl(!0);s.onInit.call(this)})};var t=e.fn.superfish;t.o=[];t.op={};t.c={bcClass:"sf-breadcrumb",menuClass:"sf-js-enabled",anchorClass:"sf-with-ul",arrowClass:"sf-sub-indicator"};t.defaults={hoverClass:"sfHover",pathClass:"overrideThisToUse",pathLevels:1,delay:800,animation:{opacity:"show"},animationOut:{opacity:"hide"},speed:"normal",speedOut:"fast",autoArrows:!0,disableHI:!1,useClick:!1,onInit:e.noop,onBeforeShow:e.noop,onShow:e.noop,onBeforeHide:e.noop,onHide:e.noop,onIdle:e.noop};t.ios=/iPhone|iPad|iPod/i.test(navigator.userAgent);t.wp7=function(){var e=document.documentElement.style;return"behavior"in e&&"fill"in e&&/iemobile/i.test(navigator.userAgent)}();e.fn.extend({hideSuperfishUl:function(n){var r=this,i=t.getOptions(r),s=i.retainPath===!0?i.$path:"",o=r.find("li."+i.hoverClass).add(this).not(s).removeClass(i.hoverClass).children("ul"),u=i.speedOut;if(n){o.show();u=0}i.retainPath=!1;i.onBeforeHide.call(o);o.stop(!0,!0).animate(i.animationOut,u,function(){i.onHide.call(e(this));i.useClick&&r.children("a").data("follow",!1)});return this},showSuperfishUl:function(){var e=t.getOptions(this),n=this.addClass(e.hoverClass),r=n.children("ul");e.onBeforeShow.call(r);r.stop(!0,!0).animate(e.animation,e.speed,function(){e.onShow.call(r);n.children("a").data("follow",!0)});return this}});if(t.ios){e(window).load(function(){e("body").children().on("click",e.noop)});e(window).on("pageshow",function(e){e.originalEvent.persisted&&window.location.reload()})}})(jQuery);