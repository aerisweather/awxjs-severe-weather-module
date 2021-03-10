/*!
 * 
 * awxjs-severe-weather-module - 1.0.0
 * (c) 2021 Ben Collin
 * License: MIT
 * https://www.aerisweather.com/support/docs/toolkits/aeris-js-sdk/
 * 
 */
(this.webpackJsonp=this.webpackJsonp||[]).push([[3],{W03g:function(t,e,r){"use strict";r.r(e);var n,a=r("CUUi"),o=r.n(a),i=r("+mSH"),c=r("jNhv"),s=r("fdqv"),u=(n=function(t,e){return(n=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var r in e)e.hasOwnProperty(r)&&(t[r]=e[r])})(t,e)},function(t,e){function r(){this.constructor=t}n(t,e),t.prototype=null===e?Object.create(e):(r.prototype=e.prototype,new r)}),l=function(t){switch(t=t.toLowerCase()){case"avalanche":return"#639fec";case"blizzard":return"#4100e2";case"flood":return"#117d00";case"fog":return"#767676";case"ice":return"#e100e2";case"hail":return"#62def7";case"lightning":return"#8c8c8c";case"rain":return"#38e600";case"snow":return"#175cef";case"tides":return"#40db83";case"tornado":return"#c50000";case"wind":return"#d8cc00";default:return"#000000"}},p=function(t){function e(){return null!==t&&t.apply(this,arguments)||this}return u(e,t),Object.defineProperty(e.prototype,"id",{get:function(){return"stormreports"},enumerable:!1,configurable:!0}),e.prototype.source=function(){var t=this;return{type:"vector",requreBounds:!0,data:{service:function(){return t.request}},style:{marker:function(t){var e=Object(c.get)(t,"report.cat");return{className:"marker-stormreport",svg:{shape:{type:"circle",fill:{color:l(e)},stroke:{color:"#ffffff",width:2}}},size:[14,14]}}}}},e.prototype.infopanel=function(){return{views:[{data:function(t){var e=Object(c.get)(t,"stormreports");if(e)return e},renderer:function(t){if(t)return'\n                        <div class="awxjs__app__ui-panel-info__table">\n                            '+[{label:"Location",value:t.report.name},{label:"Description",value:Object(i.ucwords)(t.report.type)},{label:"Magnitude",value:Object(s.b)(t.report)},{label:"Report Time",value:Object(c.formatDate)(new Date(1e3*t.report.timestamp),"h:mm a, MMM d, yyyy")},{label:"Remarks",value:t.report.comments||""}].reduce((function(t,e){return t.push('\n                                <div class="awxjs__ui-row">\n                                    <div class="awxjs__ui-expand label">'+e.label+'</div>\n                                    <div class="awxjs__ui-expand value">'+e.value+"</div>\n                                </div>\n                            "),t}),[]).join("\n")+"\n                        </div>\n                    "}}]}},e.prototype.onMarkerClick=function(t,e){if(e){var r=e.id,n=e.report,a=Object(i.ucwords)(n.type);this.showInfoPanel(""+a).load({p:r},{stormreports:e})}},e.prototype.controls=function(){return{value:this.id,title:"Storm Reports"}},e.prototype.onInit=function(){var t=this.account.api().endpoint("stormreports");this.request=t},e}(o.a);e.default=p},fdqv:function(t,e,r){"use strict";r.d(e,"c",(function(){return s})),r.d(e,"a",(function(){return u})),r.d(e,"b",(function(){return l}));var n=r("jNhv"),a=(r("+mSH"),function(){return(a=Object.assign||function(t){for(var e,r=1,n=arguments.length;r<n;r++)for(var a in e=arguments[r])Object.prototype.hasOwnProperty.call(e,a)&&(t[a]=e[a]);return t}).apply(this,arguments)}),o=function(t){return t*Math.PI/180},i=function(t,e,r,n){var a=o(t),i=o(e),c=o(r),s=o(n),u=Math.sin(s-i)*Math.cos(c),l=Math.cos(a)*Math.sin(c)-Math.sin(a)*Math.cos(c)*Math.cos(s-i),p=Math.atan2(u,l);return((p=180*p/Math.PI)+360)%360},c=function(t){switch(t=t.toLowerCase()){case"general":return"#2ED300";case"hail":return"#EBE100";case"rotating":return"#F17200";case"tornado":return"#FF2600";default:return"#000000"}},s=function(t){var e=t.isCurrent,r=t.isLast,a=Object(n.get)(t,"traits.type");return r?{className:"marker-stormcell",svg:{hidden:!0,shape:{type:"path",path:"M51.9,49.1L30.4,11.8L9,49.1C9,49.1,51.9,49.1,51.9,49.1z",fill:{color:"#ffffff"},transform:"rotate("+(t.bearing?t.bearing:0)+",30,30)"},viewBox:"0 0 60 60"},size:[16,16]}:{className:"marker-stormcell",svg:{shape:{type:"circle",fill:{color:c(a)},stroke:{color:"#ffffff",width:2}}},size:e?[15,15]:[10,10]}},u=function(t){return Object(n.isArray)(t)&&t.forEach((function(t){var e=t.id,r=t.ob,n=t.loc,o=t.forecast,c=t.place,s=t.traits,u=t.points,l=n.lat,p=n.long;u=[a(a({id:e},r),{traits:s,forecast:o,place:c,loc:{lat:n.lat,lon:n.long},isCurrent:!0})],o&&o.locs&&(o.locs||[]).forEach((function(t){var e=t.lat,n=t.long,f=i(l,p,e,n),d=!1;o.locs[o.locs.length-1]===t&&(d=!0,u.push(a(a({},r),{timestamp:t.timestamp,dateTimeISO:t.dateTimeISO,bearing:f,place:c,forecast:o,traits:s,loc:{lat:t.lat,lon:t.long},isCurrent:!1,isLast:d})))})),t.points=u})),t},l=function(t){var e="";return"snow"!==t.cat||Object(n.isEmpty)(t.detail.snowIN)||(e=t.detail.snowIN+" inches"),"wind"!==t.cat||Object(n.isEmpty)(t.detail.windSpeedMPH)||(e=t.detail.windSpeedMPH+" mph"),"rain"!==t.cat||Object(n.isEmpty)(t.detail.rainIN)||(e=t.detail.rainIN+" inches"),"hail"!==t.cat||Object(n.isEmpty)(t.detail.hailIN)||(e=t.detail.hailIN+" inches"),e}}}]);
//# sourceMappingURL=aerisweather.modules.severe.StormReports.js.map