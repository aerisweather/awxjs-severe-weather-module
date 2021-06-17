"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getStormReportMarkerContent = exports.getMagnitude = exports.getStormCellForecast = exports.formatStormCells = exports.indexForIntensity = exports.indexForHail = exports.rotationIntensity = exports.round5 = exports.getPercent = exports.getIndexString = exports.getStormCellMarker = exports.getSeverity = exports.indexForSeverity = exports.colorStormCell = void 0;

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
/**
 * Storm Cells
 */


var colorStormCell = function (code) {
  code = code.toLowerCase();

  switch (code) {
    case 'general':
      return '#2ed300';

    case 'hail':
      return '#ebe100';

    case 'rotating':
      return '#f17200';

    case 'tornado':
      return '#ff2600';

    default:
      return '#000000';
  }
};

exports.colorStormCell = colorStormCell;

var indexForSeverity = function (value) {
  // `value` is in the range 0..10 and needs to be converted to an index value in
  // the range 0..5
  var index = Math.floor(value / 2);
  var labels = ['None', 'Minimal', 'Low', 'Moderate', 'High', 'Extreme'];
  return {
    index: index,
    label: labels[index]
  };
};

exports.indexForSeverity = indexForSeverity;

var getSeverity = function (cell) {
  if (cell === void 0) {
    cell = {};
  }

  var hail = cell.hail,
      tvs = cell.tvs,
      traits = cell.traits;
  var severity = 0;

  if ((0, _index.isset)(hail) && hail.probSevere > 0) {
    severity = hail.probSevere / 10;
  }

  if ((0, _index.isset)(traits) && severity < 10) {
    var rotating = traits.rotating,
        tornado = traits.tornado;

    if (rotating) {
      severity = 7;
    }

    if (tornado) {
      severity = 10;
    }
  }

  if (severity < 8 && tvs === 1) {
    severity = 8;
  }

  return severity;
};

exports.getSeverity = getSeverity;

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

var getIndexString = function (index) {
  return ("" + index).replace(/\./g, 'p');
};

exports.getIndexString = getIndexString;

var getPercent = function (index) {
  return Math.round(index / 5 * 1000) / 10;
};

exports.getPercent = getPercent;

var round5 = function (x) {
  return Math.ceil(x / 5) * 5;
};

exports.round5 = round5;

var rotationIntensity = function (value) {
  if (value >= 20) {
    return {
      index: 5,
      label: 'Inense'
    };
  }

  if (value >= 15) {
    return {
      index: 4,
      label: 'Strong'
    };
  }

  if (value >= 10) {
    return {
      index: 3,
      label: 'Moderate'
    };
  }

  if (value >= 5) {
    return {
      index: 2,
      label: 'Weak'
    };
  }

  if (value < 5) {
    return {
      index: 0,
      label: 'None'
    };
  }
}; //pulled from https://www.weather.gov/lwx/skywarn_hail


exports.rotationIntensity = rotationIntensity;

var indexForHail = function (value) {
  if (value >= 4.5) {
    return {
      index: 5,
      label: 'Softball Size'
    };
  }

  if (value >= 4.0) {
    return {
      index: 5,
      label: 'Grapefruit Size'
    };
  }

  if (value >= 3.0) {
    return {
      index: 5,
      label: 'Teacup Size'
    };
  }

  if (value >= 2.75) {
    return {
      index: 5,
      label: 'Baseball Size'
    };
  }

  if (value >= 2.5) {
    return {
      index: 5,
      label: 'Tennis Ball Size'
    };
  }

  if (value >= 2.0) {
    return {
      index: 4,
      label: 'Hen Egg Size'
    };
  }

  if (value >= 1.75) {
    return {
      index: 4,
      label: 'Golf Ball Size'
    };
  }

  if (value >= 1.50) {
    return {
      index: 4,
      label: 'Ping Pong Size'
    };
  }

  if (value >= 1.25) {
    return {
      index: 3,
      label: 'Half Dollar Size'
    };
  }

  if (value >= 1.00) {
    return {
      index: 3,
      label: 'Quarter Size'
    };
  }

  if (value >= 0.75) {
    return {
      index: 2,
      label: 'Penny Size'
    };
  }

  if (value >= 0.5) {
    return {
      index: 1,
      label: 'Small Marble Size'
    };
  }

  if (value >= 0.25) {
    return {
      index: 1,
      label: 'Pea Size'
    };
  }

  return {
    index: 0,
    label: 'None'
  };
};

exports.indexForHail = indexForHail;

var indexForIntensity = function (value) {
  if (value >= 60) {
    return {
      index: 5,
      label: 'Extreme'
    };
  }

  if (value >= 55) {
    return {
      index: 4,
      label: 'Very Heavy'
    };
  }

  if (value >= 50) {
    return {
      index: 3,
      label: 'Heavy'
    };
  }

  if (value >= 35) {
    return {
      index: 2,
      label: 'Moderate'
    };
  }

  if (value >= 20) {
    return {
      index: 1,
      label: 'Light'
    };
  }

  return {
    index: 0,
    label: 'Very Light'
  };
};

exports.indexForIntensity = indexForIntensity;

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
/**
 * Storm Reports
 */


exports.getStormCellForecast = getStormCellForecast;

var getMagnitude = function (data) {
  var _a, _b, _c, _d;

  if (data === void 0) {
    data = {};
  }

  var magnitude = '';

  if (data.cat === 'snow' && !(0, _index.isEmpty)((_a = data.detail) === null || _a === void 0 ? void 0 : _a.snowIN)) {
    magnitude = data.detail.snowIN + " inches";
  }

  if (data.cat === 'wind' && !(0, _index.isEmpty)((_b = data.detail) === null || _b === void 0 ? void 0 : _b.windSpeedMPH)) {
    magnitude = data.detail.windSpeedMPH + " mph";
  }

  if (data.cat === 'rain' && !(0, _index.isEmpty)((_c = data.detail) === null || _c === void 0 ? void 0 : _c.rainIN)) {
    magnitude = data.detail.rainIN + " inches";
  }

  if (data.cat === 'hail' && !(0, _index.isEmpty)((_d = data.detail) === null || _d === void 0 ? void 0 : _d.hailIN)) {
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