/*!
 * 
 * awxjs-severe-weather-module - 1.0.0
 * (c) 2021 Ben Collin
 * License: MIT
 * 
 * 
 */
(this.webpackJsonp=this.webpackJsonp||[]).push([[1],{"RNE/":function(t,n,e){"use strict";e.r(n);var o,r=e("CUUi"),i=(o=function(t,n){return(o=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,n){t.__proto__=n}||function(t,n){for(var e in n)n.hasOwnProperty(e)&&(t[e]=n[e])})(t,n)},function(t,n){function e(){this.constructor=t}o(t,n),t.prototype=null===n?Object.create(n):(e.prototype=n.prototype,new e)}),u=function(t){function n(){return null!==t&&t.apply(this,arguments)||this}return i(n,t),Object.defineProperty(n.prototype,"id",{get:function(){return"lightningthreats"},enumerable:!1,configurable:!0}),n.prototype.source=function(){var t=this;return{type:"vector",requreBounds:!0,data:{service:function(){return t.request},properties:{root:"features",path:"geometry"}},style:{polygon:function(){return{fill:{color:"#FFDB00",opacity:.6}}}}}},n.prototype.controls=function(){return{value:this.id,title:"Lightning Threats"}},n.prototype.onInit=function(){var t=this.account.api().endpoint("lightning/summary").format("geojson").filter("threat,geo").from("-15minutes");this.request=t},n}(e.n(r).a);n.default=u}}]);
//# sourceMappingURL=aerisweather.modules.severe.LightningThreats.js.map