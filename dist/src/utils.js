"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getStormReportMarkerContent = exports.getMagnitude = exports.getStormCellForecast = exports.formatStormCells = exports.getStormCellMarker = void 0;

var _index = require("@aerisweather/javascript-sdk/dist/utils/index");

var strings = _interopRequireWildcard(require("@aerisweather/javascript-sdk/dist/utils/strings"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var __assign = void 0 && (void 0).__assign || function () {
  __assign = Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];

      for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
    }

    return t;
  };

  return __assign.apply(this, arguments);
};

var toRadians = function (degrees) {
  return degrees * Math.PI / 180;
};

var toDegrees = function (radians) {
  return radians * 180 / Math.PI;
};

var getBearing = function (startLat, startLng, endLat, endLng) {
  var sy = toRadians(startLat);
  var sx = toRadians(startLng);
  var ey = toRadians(endLat);
  var ex = toRadians(endLng);
  var y = Math.sin(ex - sx) * Math.cos(ey);
  var x = Math.cos(sy) * Math.sin(ey) - Math.sin(sy) * Math.cos(ey) * Math.cos(ex - sx);
  var result = Math.atan2(y, x);
  result = toDegrees(result);
  return (result + 360) % 360;
};

var colorStormCell = function (code) {
  code = code.toLowerCase();

  switch (code) {
    case 'general':
      return '#2ED300';

    case 'hail':
      return '#EBE100';

    case 'rotating':
      return '#F17200';

    case 'tornado':
      return '#FF2600';

    default:
      return '#000000';
  }
};

var getStormCellMarker = function (data) {
  var isCurrent = data.isCurrent;
  var isLast = data.isLast;
  var type = (0, _index.get)(data, 'traits.type');

  if (isLast) {
    var bearing = data.bearing ? data.bearing : 0;
    return {
      className: 'marker-stormcell',
      svg: {
        hidden: true,
        shape: {
          type: 'path',
          path: 'M51.9,49.1L30.4,11.8L9,49.1C9,49.1,51.9,49.1,51.9,49.1z',
          fill: {
            color: '#ffffff'
          },
          transform: "rotate(" + bearing + ",30,30)"
        },
        viewBox: '0 0 60 60'
      },
      size: [16, 16]
    };
  }

  return {
    className: 'marker-stormcell',
    svg: {
      shape: {
        type: 'circle',
        fill: {
          color: colorStormCell(type)
        },
        stroke: {
          color: '#ffffff',
          width: 2
        }
      }
    },
    size: isCurrent ? [15, 15] : [10, 10]
  };
};

exports.getStormCellMarker = getStormCellMarker;

var formatStormCells = function (data) {
  if ((0, _index.isArray)(data)) {
    data.forEach(function (cell) {
      var id = cell.id,
          ob = cell.ob,
          loc = cell.loc,
          forecast = cell.forecast,
          place = cell.place,
          traits = cell.traits;
      var points = cell.points;
      var startLat = loc.lat;
      var startLng = loc.long;
      points = [__assign(__assign({
        id: id
      }, ob), {
        traits: traits,
        forecast: forecast,
        place: place,
        loc: {
          lat: loc.lat,
          lon: loc.long
        },
        isCurrent: true
      })];

      if (forecast && forecast.locs) {
        (forecast.locs || []).forEach(function (forecastLoc) {
          var endLat = forecastLoc.lat;
          var endLng = forecastLoc.long;
          var trueBearing = getBearing(startLat, startLng, endLat, endLng);
          var isLast = false;

          if (forecast.locs[forecast.locs.length - 1] === forecastLoc) {
            isLast = true;
            points.push(__assign(__assign({}, ob), {
              timestamp: forecastLoc.timestamp,
              dateTimeISO: forecastLoc.dateTimeISO,
              bearing: trueBearing,
              place: place,
              forecast: forecast,
              traits: traits,
              loc: {
                lat: forecastLoc.lat,
                lon: forecastLoc.long
              },
              isCurrent: false,
              isLast: isLast
            }));
          }
        });
      }

      cell.points = points;
    });
  }

  return data;
};

exports.formatStormCells = formatStormCells;

var getStormCellForecast = function (aeris, forecast) {
  var utils = aeris.utils;
  var request = aeris.api();
  var final = [];

  for (var i = 0; i < forecast.locs.length; i += 1) {
    request.addRequest(aeris.api().endpoint('places').place(forecast.locs[i].lat + "," + forecast.locs[i].long).fields('place.name,place.state'));
  }

  request.get().then(function (result) {
    for (var i = 0; i < forecast.locs.length; i += 1) {
      var object = {};
      var place = "\n                " + result.data.responses[i].response.place.name + ",\n                " + result.data.responses[i].response.place.state + "\n            ";
      var time = utils.dates.format(new Date(forecast.locs[i].timestamp * 1000), 'h:mm a, MMM d, yyyy');
      object.place = place;
      object.time = time;
      final.push(object);
    }
  });
  return final;
};

exports.getStormCellForecast = getStormCellForecast;

var getMagnitude = function (data) {
  var magnitude = '';

  if (data.cat === 'snow' && !(0, _index.isEmpty)(data.detail.snowIN)) {
    magnitude = data.detail.snowIN + " inches";
  }

  if (data.cat === 'wind' && !(0, _index.isEmpty)(data.detail.windSpeedMPH)) {
    magnitude = data.detail.windSpeedMPH + " mph";
  }

  if (data.cat === 'rain' && !(0, _index.isEmpty)(data.detail.rainIN)) {
    magnitude = data.detail.rainIN + " inches";
  }

  if (data.cat === 'hail' && !(0, _index.isEmpty)(data.detail.hailIN)) {
    magnitude = data.detail.hailIN + " inches";
  }

  return magnitude;
};

exports.getMagnitude = getMagnitude;

var getStormReportMarkerContent = function (data) {
  var details = '';

  if (data.report.cat === 'hail' && !(0, _index.isEmpty)(data.report.detail.hailIN)) {
    details = "\n            <div class=\"row\">\n                <div class=\"label\">Hail Diameter:</div>\n                <div class=\"value\">\n                    " + data.report.detail.hailIN.toFixed(2) + " in\n                </div>\n            </div>";
  }

  if (data.report.cat === 'wind' && !(0, _index.isEmpty)(data.report.detail.windSpeedMPH)) {
    details = "\n            <div class=\"row\">\n                <div class=\"label\">Wind Speed:</div>\n                <div class=\"value\">\n                    " + data.report.detail.windSpeedMPH + " mph\n                </div>\n            </div>";
  }

  if (data.report.cat === 'rain' && !(0, _index.isEmpty)(data.report.detail.rainIN)) {
    details = "\n            <div class=\"row\">\n                <div class=\"label\">Rainfall:</div>\n                <div class=\"value\">\n                    " + data.report.detail.rainIN.toFixed(2) + " in\n                </div>\n            </div>";
  }

  return "\n        <div class=\"content\">\n            <div class=\"title\">\n                " + strings.toName(data.report.type) + "\n            </div>\n            <div class=\"row\">\n                <div class=\"label\">Location:</div>\n                <div class=\"value\">\n                    " + data.report.name + "\n                </div>\n            </div>\n            <div class=\"row\">\n                <div class=\"label\">Date:</div>\n                <div class=\"value\">\n                    " + (0, _index.formatDate)(new Date(data.report.timestamp * 1000), 'h:mm a, MMM d, yyyy') + "\n                </div>\n            </div>\n            " + details + "\n            <div class=\"row\">\n                <div class=\"label\">Reporter:</div>\n                <div class=\"value\">\n                    " + data.report.reporter + "\n                </div>\n            </div>\n            <div class=\"row\">\n                <div class=\"label\">WFO:</div>\n                <div class=\"value\">\n                    " + data.report.wfo.toUpperCase() + "\n                </div>\n            </div>\n            " + (!(0, _index.isEmpty)(data.report.comments) ? "\n            <div class=\"row\">\n                <div class=\"label\">Comments</div>\n                <div class=\"value\">\n                    " + data.report.comments + "\n                </div>\n            </div>\n            " : '') + "\n        </div>\n    ";
};

exports.getStormReportMarkerContent = getStormReportMarkerContent;