/*
 Highcharts JS v7.1.1 (2019-04-09)

 Highcharts Drilldown module

 Author: Torstein Honsi
 License: www.highcharts.com/license

*/
(function(f){"object"===typeof module&&module.exports?(f["default"]=f,module.exports=f):"function"===typeof define&&define.amd?define("highcharts/modules/drilldown",["highcharts"],function(n){f(n);f.Highcharts=n;return f}):f("undefined"!==typeof Highcharts?Highcharts:void 0)})(function(f){function n(d,f,n,u){d.hasOwnProperty(f)||(d[f]=u.apply(null,n))}f=f?f._modules:{};n(f,"modules/drilldown.src.js",[f["parts/Globals.js"]],function(d){var f=d.animObject,n=d.noop,u=d.color,x=d.defaultOptions,q=d.extend,
C=d.format,y=d.objectEach,t=d.pick,m=d.Chart,p=d.seriesTypes,z=p.pie,p=p.column,A=d.Tick,v=d.fireEvent,B=1;q(x.lang,{drillUpText:"\u25c1 Back to {series.name}"});x.drilldown={activeAxisLabelStyle:{cursor:"pointer",color:"#003399",fontWeight:"bold",textDecoration:"underline"},activeDataLabelStyle:{cursor:"pointer",color:"#003399",fontWeight:"bold",textDecoration:"underline"},animation:{duration:500},drillUpButton:{position:{align:"right",x:-10,y:10}}};d.SVGRenderer.prototype.Element.prototype.fadeIn=
function(a){this.attr({opacity:.1,visibility:"inherit"}).animate({opacity:t(this.newOpacity,1)},a||{duration:250})};m.prototype.addSeriesAsDrilldown=function(a,b){this.addSingleSeriesAsDrilldown(a,b);this.applyDrilldown()};m.prototype.addSingleSeriesAsDrilldown=function(a,b){var c=a.series,g=c.xAxis,e=c.yAxis,k,h=[],r=[],l,f,m;m=this.styledMode?{colorIndex:t(a.colorIndex,c.colorIndex)}:{color:a.color||c.color};this.drilldownLevels||(this.drilldownLevels=[]);l=c.options._levelNumber||0;(f=this.drilldownLevels[this.drilldownLevels.length-
1])&&f.levelNumber!==l&&(f=void 0);b=q(q({_ddSeriesId:B++},m),b);k=c.points.indexOf(a);c.chart.series.forEach(function(a){a.xAxis!==g||a.isDrilling||(a.options._ddSeriesId=a.options._ddSeriesId||B++,a.options._colorIndex=a.userOptions._colorIndex,a.options._levelNumber=a.options._levelNumber||l,f?(h=f.levelSeries,r=f.levelSeriesOptions):(h.push(a),r.push(a.options)))});a=q({levelNumber:l,seriesOptions:c.options,levelSeriesOptions:r,levelSeries:h,shapeArgs:a.shapeArgs,bBox:a.graphic?a.graphic.getBBox():
{},color:a.isNull?(new d.Color(u)).setOpacity(0).get():u,lowerSeriesOptions:b,pointOptions:c.options.data[k],pointIndex:k,oldExtremes:{xMin:g&&g.userMin,xMax:g&&g.userMax,yMin:e&&e.userMin,yMax:e&&e.userMax},resetZoomButton:this.resetZoomButton},m);this.drilldownLevels.push(a);g&&g.names&&(g.names.length=0);b=a.lowerSeries=this.addSeries(b,!1);b.options._levelNumber=l+1;g&&(g.oldPos=g.pos,g.userMin=g.userMax=null,e.userMin=e.userMax=null);c.type===b.type&&(b.animate=b.animateDrilldown||n,b.options.animation=
!0)};m.prototype.applyDrilldown=function(){var a=this.drilldownLevels,b;a&&0<a.length&&(b=a[a.length-1].levelNumber,this.drilldownLevels.forEach(function(a){a.levelNumber===b&&a.levelSeries.forEach(function(a){a.options&&a.options._levelNumber===b&&a.remove(!1)})}));this.resetZoomButton&&(this.resetZoomButton.hide(),delete this.resetZoomButton);this.pointer.reset();this.redraw();this.showDrillUpButton();v(this,"afterDrilldown")};m.prototype.getDrilldownBackText=function(){var a=this.drilldownLevels;
if(a&&0<a.length)return a=a[a.length-1],a.series=a.seriesOptions,C(this.options.lang.drillUpText,a)};m.prototype.showDrillUpButton=function(){var a=this,b=this.getDrilldownBackText(),c=a.options.drilldown.drillUpButton,g,e;this.drillUpButton?this.drillUpButton.attr({text:b}).align():(e=(g=c.theme)&&g.states,this.drillUpButton=this.renderer.button(b,null,null,function(){a.drillUp()},g,e&&e.hover,e&&e.select).addClass("highcharts-drillup-button").attr({align:c.position.align,zIndex:7}).add().align(c.position,
!1,c.relativeTo||"plotBox"))};m.prototype.drillUp=function(){if(this.drilldownLevels&&0!==this.drilldownLevels.length){for(var a=this,b=a.drilldownLevels,c=b[b.length-1].levelNumber,g=b.length,e=a.series,k,h,d,l,f=function(b){var c;e.forEach(function(a){a.options._ddSeriesId===b._ddSeriesId&&(c=a)});c=c||a.addSeries(b,!1);c.type===d.type&&c.animateDrillupTo&&(c.animate=c.animateDrillupTo);b===h.seriesOptions&&(l=c)};g--;)if(h=b[g],h.levelNumber===c){b.pop();d=h.lowerSeries;if(!d.chart)for(k=e.length;k--;)if(e[k].options.id===
h.lowerSeriesOptions.id&&e[k].options._levelNumber===c+1){d=e[k];break}d.xData=[];h.levelSeriesOptions.forEach(f);v(a,"drillup",{seriesOptions:h.seriesOptions});l.type===d.type&&(l.drilldownLevel=h,l.options.animation=a.options.drilldown.animation,d.animateDrillupFrom&&d.chart&&d.animateDrillupFrom(h));l.options._levelNumber=c;d.remove(!1);l.xAxis&&(k=h.oldExtremes,l.xAxis.setExtremes(k.xMin,k.xMax,!1),l.yAxis.setExtremes(k.yMin,k.yMax,!1));h.resetZoomButton&&(a.resetZoomButton=h.resetZoomButton,
a.resetZoomButton.show())}this.redraw();0===this.drilldownLevels.length?this.drillUpButton=this.drillUpButton.destroy():this.drillUpButton.attr({text:this.getDrilldownBackText()}).align();this.ddDupes.length=[];v(a,"drillupall")}};m.prototype.callbacks.push(function(){var a=this;a.drilldown={update:function(b,c){d.merge(!0,a.options.drilldown,b);t(c,!0)&&a.redraw()}}});d.addEvent(m,"beforeShowResetZoom",function(){if(this.drillUpButton)return!1});d.addEvent(m,"render",function(){(this.xAxis||[]).forEach(function(a){a.ddPoints=
{};a.series.forEach(function(b){var c,g=b.xData||[],e=b.points,d;for(c=0;c<g.length;c++)d=b.options.data[c],"number"!==typeof d&&(d=b.pointClass.prototype.optionsToObject.call({series:b},d),d.drilldown&&(a.ddPoints[g[c]]||(a.ddPoints[g[c]]=[]),a.ddPoints[g[c]].push(e?e[c]:!0)))});y(a.ticks,A.prototype.drillable)})});p.prototype.animateDrillupTo=function(a){if(!a){var b=this,c=b.drilldownLevel;this.points.forEach(function(a){var b=a.dataLabel;a.graphic&&a.graphic.hide();b&&(b.hidden="hidden"===b.attr("visibility"),
b.hidden||(b.hide(),a.connector&&a.connector.hide()))});d.syncTimeout(function(){b.points&&b.points.forEach(function(a,b){b=b===(c&&c.pointIndex)?"show":"fadeIn";var g="show"===b?!0:void 0,d=a.dataLabel;if(a.graphic)a.graphic[b](g);d&&!d.hidden&&(d.fadeIn(),a.connector&&a.connector.fadeIn())})},Math.max(this.chart.options.drilldown.animation.duration-50,0));this.animate=n}};p.prototype.animateDrilldown=function(a){var b=this,c=this.chart,d=c.drilldownLevels,e,k=f(c.options.drilldown.animation),h=
this.xAxis,r=c.styledMode;a||(d.forEach(function(a){b.options._ddSeriesId===a.lowerSeriesOptions._ddSeriesId&&(e=a.shapeArgs,r||(e.fill=a.color))}),e.x+=t(h.oldPos,h.pos)-h.pos,this.points.forEach(function(a){var c=a.shapeArgs;r||(c.fill=a.color);a.graphic&&a.graphic.attr(e).animate(q(a.shapeArgs,{fill:a.color||b.color}),k);a.dataLabel&&a.dataLabel.fadeIn(k)}),this.animate=null)};p.prototype.animateDrillupFrom=function(a){var b=f(this.chart.options.drilldown.animation),c=this.group,g=c!==this.chart.columnGroup,
e=this;e.trackerGroups.forEach(function(a){if(e[a])e[a].on("mouseover")});g&&delete this.group;this.points.forEach(function(k){var h=k.graphic,f=a.shapeArgs,l=function(){h.destroy();c&&g&&(c=c.destroy())};h&&(delete k.graphic,e.chart.styledMode||(f.fill=a.color),b.duration?h.animate(f,d.merge(b,{complete:l})):(h.attr(f),l()))})};z&&q(z.prototype,{animateDrillupTo:p.prototype.animateDrillupTo,animateDrillupFrom:p.prototype.animateDrillupFrom,animateDrilldown:function(a){var b=this.chart.drilldownLevels[this.chart.drilldownLevels.length-
1],c=this.chart.options.drilldown.animation,g=b.shapeArgs,e=g.start,k=(g.end-e)/this.points.length,f=this.chart.styledMode;a||(this.points.forEach(function(a,h){var l=a.shapeArgs;f||(g.fill=b.color,l.fill=a.color);if(a.graphic)a.graphic.attr(d.merge(g,{start:e+h*k,end:e+(h+1)*k}))[c?"animate":"attr"](l,c)}),this.animate=null)}});d.Point.prototype.doDrilldown=function(a,b,c){var d=this.series.chart,e=d.options.drilldown,f=(e.series||[]).length,h;d.ddDupes||(d.ddDupes=[]);for(;f--&&!h;)e.series[f].id===
this.drilldown&&-1===d.ddDupes.indexOf(this.drilldown)&&(h=e.series[f],d.ddDupes.push(this.drilldown));v(d,"drilldown",{point:this,seriesOptions:h,category:b,originalEvent:c,points:void 0!==b&&this.series.xAxis.getDDPoints(b).slice(0)},function(b){var c=b.point.series&&b.point.series.chart,d=b.seriesOptions;c&&d&&(a?c.addSingleSeriesAsDrilldown(b.point,d):c.addSeriesAsDrilldown(b.point,d))})};d.Axis.prototype.drilldownCategory=function(a,b){y(this.getDDPoints(a),function(c){c&&c.series&&c.series.visible&&
c.doDrilldown&&c.doDrilldown(!0,a,b)});this.chart.applyDrilldown()};d.Axis.prototype.getDDPoints=function(a){return this.ddPoints&&this.ddPoints[a]};A.prototype.drillable=function(){var a=this.pos,b=this.label,c=this.axis,g="xAxis"===c.coll&&c.getDDPoints,e=g&&c.getDDPoints(a),f=c.chart.styledMode;g&&(b&&e&&e.length?(b.drillable=!0,b.basicStyles||f||(b.basicStyles=d.merge(b.styles)),b.addClass("highcharts-drilldown-axis-label").on("click",function(b){c.drilldownCategory(a,b)}),f||b.css(c.chart.options.drilldown.activeAxisLabelStyle)):
b&&b.drillable&&(f||(b.styles={},b.css(b.basicStyles)),b.on("click",null),b.removeClass("highcharts-drilldown-axis-label")))};d.addEvent(d.Point,"afterInit",function(){var a=this,b=a.series;a.drilldown&&d.addEvent(a,"click",function(c){b.xAxis&&!1===b.chart.options.drilldown.allowPointDrilldown?b.xAxis.drilldownCategory(a.x,c):a.doDrilldown(void 0,void 0,c)});return a});d.addEvent(d.Series,"afterDrawDataLabels",function(){var a=this.chart.options.drilldown.activeDataLabelStyle,b=this.chart.renderer,
c=this.chart.styledMode;this.points.forEach(function(d){var e=d.options.dataLabels,f=t(d.dlOptions,e&&e.style,{});d.drilldown&&d.dataLabel&&("contrast"!==a.color||c||(f.color=b.getContrast(d.color||this.color)),e&&e.color&&(f.color=e.color),d.dataLabel.addClass("highcharts-drilldown-data-label"),c||d.dataLabel.css(a).css(f))},this)});var w=function(a,b,c,d){a[c?"addClass":"removeClass"]("highcharts-drilldown-point");d||a.css({cursor:b})};d.addEvent(d.Series,"afterDrawTracker",function(){var a=this.chart.styledMode;
this.points.forEach(function(b){b.drilldown&&b.graphic&&w(b.graphic,"pointer",!0,a)})});d.addEvent(d.Point,"afterSetState",function(){var a=this.series.chart.styledMode;this.drilldown&&this.series.halo&&"hover"===this.state?w(this.series.halo,"pointer",!0,a):this.series.halo&&w(this.series.halo,"auto",!1,a)})});n(f,"masters/modules/drilldown.src.js",[],function(){})});
