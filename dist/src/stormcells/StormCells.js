"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _MapSourceModule = _interopRequireDefault(require("@aerisweather/javascript-sdk/dist/modules/MapSourceModule"));

var _index = require("@aerisweather/javascript-sdk/dist/utils/index");

var _strings = require("@aerisweather/javascript-sdk/dist/utils/strings");

var _units = require("@aerisweather/javascript-sdk/dist/utils/units");

var _utils = require("../utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var __extends = void 0 && (void 0).__extends || function () {
  var extendStatics = function (d, b) {
    extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (d, b) {
      d.__proto__ = b;
    } || function (d, b) {
      for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    };

    return extendStatics(d, b);
  };

  return function (d, b) {
    extendStatics(d, b);

    function __() {
      this.constructor = d;
    }

    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();

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

var colors = {
  general: '#2ed300',
  hail: '#ebe100',
  rotating: '#f17200',
  tornado: '#ff2600'
};

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

var getColor = function (code) {
  code = (code || 'none').toLowerCase();
  return colors[code] || '#999999';
};

var StormCells =
/** @class */
function (_super) {
  __extends(StormCells, _super);

  function StormCells() {
    return _super !== null && _super.apply(this, arguments) || this;
  }

  Object.defineProperty(StormCells.prototype, "id", {
    get: function () {
      return 'stormcells';
    },
    enumerable: false,
    configurable: true
  });

  StormCells.prototype.source = function () {
    var _this = this;

    var properties = {
      id: 'id',
      path: 'points',
      category: 'traits.type',
      timestamp: 'ob.timestamp',
      points: 'points'
    };
    return {
      type: 'vector',
      requiresBounds: true,
      data: {
        service: function () {
          return _this.request;
        },
        properties: properties,
        formatter: function (data) {
          return (0, _utils.formatStormCells)(data);
        }
      },
      style: {
        marker: function (data) {
          return (0, _utils.getStormCellMarker)(data);
        },
        polyline: function () {
          return {
            stroke: {
              color: '#ffffff',
              width: 3
            }
          };
        }
      }
    };
  };

  StormCells.prototype.infopanel = function () {
    var _this = this;

    return {
      request: function (data) {
        var locations = (0, _index.get)(data, 'stormcells.forecast.locs') || [];

        if (!locations || locations.length === 0) {
          return;
        }

        var request = _this.account.api();

        locations.forEach(function (_a) {
          var lat = _a.lat,
              long = _a.long;

          var request_ = _this.account.api().endpoint('places').place(lat + "," + long).radius('10mi').fields('place.name,place.state');

          request.addRequest(request_);
        });
        return request;
      },
      views: [{
        // place info
        requiresData: true,
        data: function (data) {
          if (!(0, _index.get)(data, 'stormcells')) return;
          return data;
        },
        renderer: function (data) {
          if (!data) return;
          var _a = data.stormcells,
              place = _a.place,
              movement = _a.movement,
              _b = _a.traits,
              traits = _b === void 0 ? {} : _b,
              metric = data.metric;
          var placeName = (0, _strings.toName)(place.name) + ", " + place.state.toUpperCase();
          var movementBlock = (0, _index.isset)(movement) ? "\n                            <div class=\"awxjs__ui-row\">\n                                <div>\n                                    Moving " + movement.dirTo + "\n                                    at " + (0, _units.formatDataValue)(movement, 'speedMPH', 'speedKMH', metric) + "\n                                </div>\n                            </div>\n                        " : '';
          return "\n                        <div class=\"stormtrack-loc awxjs__app__ui-panel-info__table\">\n                            <div class=\"awxjs__ui-row\">\n                                <div class=\"awxjs__ui-cols align-center\">\n                                    <div class=\"awxjs__ui-expand awxjs__text-lg value\">\n                                        <strong>Near " + placeName + "</strong>\n                                    </div>\n                                    <div>\n                                        <div class=\"indicator\" style=\"background:" + getColor(traits.type) + ";\"></div>\n                                    </div>\n                                </div>\n                            </div>\n                            " + movementBlock + "\n                        </div>\n                    ";
        }
      }, {
        // severity levels
        requiresData: true,
        data: function (data) {
          var stormcells = (0, _index.get)(data, 'stormcells');
          if (!stormcells) return;
          var dbzm = stormcells.dbzm;
          var result = [];

          if ((0, _index.isset)(dbzm)) {
            result.push({
              type: 'intensity',
              name: 'Intensity',
              value: dbzm
            });
          }

          var severity = getSeverity(data.stormcells);
          result.push({
            type: 'severity',
            name: 'Severity',
            value: severity
          });
          return result;
        },
        renderer: function (data) {
          var hazards = data.map(function (hazard) {
            var index = 0;
            var level = '';

            if (hazard.type === 'intensity') {
              var _a = indexForIntensity(hazard.value),
                  hazardIndex = _a.index,
                  label = _a.label;

              index = hazardIndex;
              level = label;
            } else if (hazard.type === 'severity') {
              var _b = indexForSeverity(hazard.value),
                  hazardIndex = _b.index,
                  label = _b.label;

              index = hazardIndex;
              level = label;
            }

            var indexString = ("" + index).replace(/\./g, 'p');
            var percent = Math.round(index / 5 * 1000) / 10;
            return "\n                            <div class=\"awxjs__app__ui-panel-info__hazard awxjs__ui-cols align-center\">\n                                <div class=\"awxjs__app__ui-panel-info__hazard-label\">\n                                    " + hazard.name + "\n                                </div>\n                                <div class=\"awxjs__app__ui-panel-info__hazard-bar\">\n                                    <div class=\"awxjs__app__ui-panel-info__hazard-bar-inner\">\n                                        <div\n                                            class=\"awxjs__app__ui-panel-info__hazard-bar-progress\n                                                awxjs__app__ui-panel-info__hazard-indice-fill-" + indexString + "\"\n                                            style=\"width:" + percent + "%;\"\n                                        ></div>\n                                    </div>\n                                </div>\n                                <div\n                                    class=\"awxjs__app__ui-panel-info__hazard-value\n                                        awxjs__app__ui-panel-info__hazard-value-" + indexString + "\"\n                                    >" + level + "</div>\n                            </div>\n                        ";
          });
          return "\n                        <div class=\"awxjs__app__ui-panel-info__hazards\">\n                            " + hazards.join('') + "\n                        </div>\n                    ";
        }
      }, {
        // forecast track
        title: 'Forecast Track',
        requiresData: true,
        data: function (data) {
          var locations = (0, _index.get)(data, 'stormcells.forecast.locs');
          if (!locations) return; // filter out invalid place results

          var places = locations.map(function (loc) {
            var key = "places_" + loc.lat + "_" + loc.long;
            var place = data[key];

            if (place && (0, _index.isset)(place.place)) {
              return __assign({
                timestamp: loc.timestamp
              }, place);
            }

            return false;
          }).filter(function (v) {
            return v;
          });
          if (places.length === 0) return;
          data.locations = places;
          return data;
        },
        renderer: function (data) {
          var locations = (0, _index.get)(data, 'locations') || [];
          var names = [];
          var rows = locations.map(function (loc) {
            var place = loc.place,
                timestamp = loc.timestamp;

            if (names.includes(place.name)) {
              return;
            }

            names.push(place.name);
            var time = (0, _index.formatDate)(new Date(timestamp * 1000), 'h:mm a');
            return "\n                            <div class=\"awxjs__ui-row\">\n                                <div class=\"awxjs__ui-expand label\">" + place.name + "</div>\n                                <div class=\"awxjs__ui-expand value\">" + time + "</div>\n                            </div>\n                        ";
          });
          return "\n                        <div class=\"awxjs__app__ui-panel-info__table\">\n                            " + rows.filter(function (v) {
            return typeof v !== 'undefined';
          }).join('\n') + "\n                        </div>\n                    ";
        }
      }, {
        // details
        requiresData: true,
        data: function (data) {
          var payload = (0, _index.get)(data, 'stormcells');

          if (!payload) {
            return;
          }

          return payload;
        },
        renderer: function (data) {
          var metric = data.metric,
              timestamp = data.timestamp,
              radarID = data.radarID,
              dbzm = data.dbzm,
              tvs = data.tvs,
              mda = data.mda,
              vil = data.vil;
          var rows = [{
            label: 'Observed',
            value: (0, _index.formatDate)(new Date(timestamp * 1000), 'h:mm a, MMM d, yyyy')
          }, {
            label: 'Radar Station',
            value: radarID
          }, {
            label: 'Max Reflectivity',
            value: dbzm + " dbz"
          }, {
            label: 'Echo Top',
            value: (0, _units.formatDataValue)(data, 'topFT', 'topM', metric)
          }, {
            label: 'TVS',
            value: tvs === 1 ? 'Yes' : 'No'
          }, {
            label: 'Hail',
            value: ((0, _index.get)(data, 'hail.prob') || 0) + "% Probability"
          }, {
            label: 'Severe Hail',
            value: ((0, _index.get)(data, 'hail.probSevere') || 0) + "% Probability"
          }, {
            label: 'Max Hail Size',
            value: (0, _units.formatDataValue)(data, 'hail.maxSizeIN', 'hail.maxSizeCM', metric)
          }, {
            label: 'MDA',
            value: mda
          }, {
            label: 'VIL',
            value: vil
          }];
          var content = rows.reduce(function (result, row) {
            result.push("\n                            <div class=\"awxjs__ui-row\">\n                                <div class=\"awxjs__ui-expand label\">" + row.label + "</div>\n                                <div class=\"awxjs__ui-expand value\">" + row.value + "</div>\n                            </div>\n                        ");
            return result;
          }, []).join('\n');
          return "\n                        <div class=\"awxjs__app__ui-panel-info__table\">\n                            " + content + "\n                        </div>\n                    ";
        }
      }]
    };
  };

  StormCells.prototype.controls = function () {
    return {
      value: this.id,
      title: 'Storm Tracks',
      filter: true,
      multiselect: true,
      segments: [{
        value: 'all',
        title: 'All'
      }, {
        value: 'hail',
        title: 'Hail'
      }, {
        value: 'rotating',
        title: 'Rotating'
      }, {
        value: 'tornado',
        title: 'Tornadic'
      }]
    };
  };

  StormCells.prototype.onInit = function () {
    var request = this.account.api().endpoint('stormcells');
    this.request = request;
  };

  StormCells.prototype.onMarkerClick = function (marker, data) {
    if (!data) return;
    var id = data.id,
        radarID = data.radarID,
        cellID = data.cellID;
    var cellId = radarID + "_" + cellID;
    this.showInfoPanel("Cell " + cellId).load({
      p: id
    }, {
      stormcells: data
    });
  };

  return StormCells;
}(_MapSourceModule.default);

var _default = StormCells;
exports.default = _default;
module.exports = exports.default;