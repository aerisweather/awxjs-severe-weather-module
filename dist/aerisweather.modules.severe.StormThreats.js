/*!
 * 
 * awxjs-severe-weather-module - 1.0.0
 * (c) 2021 Ben Collin
 * License: MIT
 * https://www.aerisweather.com/support/docs/toolkits/aeris-js-sdk/
 * 
 */
(this.webpackJsonp=this.webpackJsonp||[]).push([[4],{YBPh:function(t,o,r){"use strict";r.r(o);var e,n=r("CUUi"),i=(e=function(t,o){return(e=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,o){t.__proto__=o}||function(t,o){for(var r in o)o.hasOwnProperty(r)&&(t[r]=o[r])})(t,o)},function(t,o){function r(){this.constructor=t}e(t,o),t.prototype=null===o?Object.create(o):(r.prototype=o.prototype,new r)}),u=function(t){function o(){return null!==t&&t.apply(this,arguments)||this}return i(o,t),Object.defineProperty(o.prototype,"id",{get:function(){return"stormthreats"},enumerable:!1,configurable:!0}),o.prototype.source=function(){var t=this;return{type:"vector",requiresBounds:!0,data:{service:function(){return t.request},properties:{root:"features",path:"geometry"}},style:{polygon:function(){return{fill:{color:"#ffa500",opacity:.65}}}}}},o.prototype.controls=function(){return{value:this.id,title:"Storm Threats"}},o.prototype.onInit=function(){var t=this.account.api().endpoint("stormcells/summary").format("geojson").limit(1).filter("threat,geo");this.request=t},o}(r.n(n).a);o.default=u}}]);
//# sourceMappingURL=aerisweather.modules.severe.StormThreats.js.map