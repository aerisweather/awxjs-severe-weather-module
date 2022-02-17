"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _ModuleGroup = _interopRequireDefault(require("@aerisweather/javascript-sdk/dist/modules/ModuleGroup"));

var _index = require("@aerisweather/javascript-sdk/dist/utils/index");

var _strings = require("@aerisweather/javascript-sdk/dist/utils/strings");

var _StormCells = _interopRequireDefault(require("./stormcells/StormCells"));

var _StormReports = _interopRequireDefault(require("./stormreports/StormReports"));

var _LightningThreats = _interopRequireDefault(require("./lightningthreats/LightningThreats"));

var _StormThreats = _interopRequireDefault(require("./stormthreats/StormThreats"));

var _Warnings = _interopRequireDefault(require("./warnings/Warnings"));

var _utils = require("./utils");

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

var __awaiter = void 0 && (void 0).__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

var __generator = void 0 && (void 0).__generator || function (thisArg, body) {
  var _ = {
    label: 0,
    sent: function () {
      if (t[0] & 1) throw t[1];
      return t[1];
    },
    trys: [],
    ops: []
  },
      f,
      y,
      t,
      g;
  return g = {
    next: verb(0),
    "throw": verb(1),
    "return": verb(2)
  }, typeof Symbol === "function" && (g[Symbol.iterator] = function () {
    return this;
  }), g;

  function verb(n) {
    return function (v) {
      return step([n, v]);
    };
  }

  function step(op) {
    if (f) throw new TypeError("Generator is already executing.");

    while (_) try {
      if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
      if (y = 0, t) op = [op[0] & 2, t.value];

      switch (op[0]) {
        case 0:
        case 1:
          t = op;
          break;

        case 4:
          _.label++;
          return {
            value: op[1],
            done: false
          };

        case 5:
          _.label++;
          y = op[1];
          op = [0];
          continue;

        case 7:
          op = _.ops.pop();

          _.trys.pop();

          continue;

        default:
          if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
            _ = 0;
            continue;
          }

          if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
            _.label = op[1];
            break;
          }

          if (op[0] === 6 && _.label < t[1]) {
            _.label = t[1];
            t = op;
            break;
          }

          if (t && _.label < t[2]) {
            _.label = t[2];

            _.ops.push(op);

            break;
          }

          if (t[2]) _.ops.pop();

          _.trys.pop();

          continue;
      }

      op = body.call(thisArg, _);
    } catch (e) {
      op = [6, e];
      y = 0;
    } finally {
      f = t = 0;
    }

    if (op[0] & 5) throw op[1];
    return {
      value: op[0] ? op[1] : void 0,
      done: true
    };
  }
};
/* eslint-disable max-len */


var Severe =
/** @class */
function (_super) {
  __extends(Severe, _super);

  function Severe(args) {
    var _this = _super.call(this) || this;

    _this._showThreats = false;
    if (args) _this._showThreats = args.showThreats;
    return _this;
  }

  Object.defineProperty(Severe.prototype, "id", {
    get: function () {
      return 'severe';
    },
    enumerable: false,
    configurable: true
  });

  Severe.prototype.load = function () {
    return __awaiter(this, void 0, void 0, function () {
      var _this = this;

      return __generator(this, function (_a) {
        return [2
        /*return*/
        , new Promise(function (resolve) {
          _this._modules = [new _Warnings.default(), new _StormCells.default(), new _StormReports.default(), new _StormThreats.default(), new _LightningThreats.default()];
          resolve(_this._modules);
        })];
      });
    });
  };

  Severe.prototype.controls = function () {
    var buttons = this.modules ? this.modules.map(function (m) {
      return m.controls();
    }) : []; // insert raster lightning strikes control in third position

    buttons.splice(2, 0, {
      value: 'lightning-strikes-15m-icons',
      title: 'Lightning Strikes',
      controls: {
        settings: [{
          type: 'opacity'
        }]
      }
    });
    return {
      title: 'Severe Weather',
      buttons: buttons
    };
  };

  Severe.prototype.initialize = function (account, app, map) {
    var _this = this;

    _super.prototype.initialize.call(this, account, app, map);

    if (!this._showThreats) return; // do custom info panel stuff...

    var localWeatherConfig = {
      request: function () {
        var request = _this.account.api().endpoint('threats');

        _this._request = request;
        return request;
      },
      views: [{
        requresData: true,
        // Location info and threat phrase
        data: function (data) {
          return data;
        },
        renderer: function (data) {
          if (!data[0]) return;
          var place = data[0].place;
          return "\n                        <div class=\"awxjs__app__ui-panel-info__place\">\n                            <div class=\"awxjs__app__ui-panel-info__place-name\">\n                                " + (0, _strings.toName)(place.name) + ", " + place.state.toUpperCase() + "\n                            </div>\n                            <div class=\"awxjs__app__ui-panel-info__obs-timestamp\" style=\"font-size:14px\">\n                                " + (0, _index.formatDate)(new Date(data[0].periods[0].timestamp * 1000), 'h:mm a, MMM d, yyyy') + "\n                            </div>\n                        </div>\n                    ";
        }
      }, {
        title: 'Active Threats',
        renderer: function (data) {
          if (!data[0]) return;
          var threatPhrase = data[0].periods[0].storms ? data[0].periods[0].storms.phrase.long : 'No Immediate Threats';
          return "\n                        <div class=\"awxjs__app__ui-panel-info__threats\">\n                            <div class=\"awxjs__app__ui-panel-info__threats-row\">" + threatPhrase + "</div>\n                        </div>\n                    ";
        }
      }, {
        requiresData: true,
        data: function (data) {
          return (0, _index.get)(data, '[0].periods[0].storms');
        },
        renderer: function (data) {
          var intensity = (0, _utils.indexForIntensity)(data.dbz.max);
          var hailSize = {};
          var rotationScale = {};
          rotationScale = (0, _index.isset)(data.mda) ? (0, _utils.rotationIntensity)(data.mda.max) : {
            index: 0,
            label: 'None'
          };
          hailSize = (0, _index.isset)(data.hail) ? (0, _utils.indexForHail)(data.hail.maxSizeIN) : {
            index: 0,
            label: 'None'
          };
          var rows = [{
            type: 'Precip Intensity',
            indexString: (0, _utils.getIndexString)(intensity.index),
            percent: (0, _utils.getPercent)(intensity.index),
            label: intensity.label
          }, {
            type: 'Max Hail Size',
            indexString: (0, _utils.getIndexString)(hailSize.index),
            percent: (0, _utils.getPercent)(hailSize.index),
            label: hailSize.label
          }, {
            type: 'Rotation',
            indexString: (0, _utils.getIndexString)(rotationScale.index),
            percent: (0, _utils.getPercent)(rotationScale.index),
            label: rotationScale.label
          }];
          return rows.reduce(function (result, row) {
            result.push("<div class=\"awxjs__app__ui-panel-info__hazard awxjs__ui-cols align-center\">\n                            <div class=\"awxjs__app__ui-panel-info__hazard-label\">\n                                " + row.type + "\n                            </div>\n                            <div class=\"awxjs__app__ui-panel-info__hazard-bar\">\n                                <div class=\"awxjs__app__ui-panel-info__hazard-bar-inner\">\n                                    <div\n                                        class=\"awxjs__app__ui-panel-info__hazard-bar-progress\n                                            awxjs__app__ui-panel-info__hazard-indice-fill-" + row.indexString + "\"\n                                        style=\"width:" + row.percent + "%;\"\n                                    ></div>\n                                </div>\n                            </div>\n                            <div\n                                class=\"awxjs__app__ui-panel-info__hazard-value\n                                    awxjs__app__ui-panel-info__hazard-value-" + row.indexString + "\"\n                                >" + row.label + "</div>\n                            </div>");
            return result;
          }, []).join('\n');
        }
      }, {
        requiresData: true,
        data: function (data) {
          return (0, _index.get)(data, '[0].periods[0].storms');
        },
        renderer: function (data) {
          var rows = [{
            label: 'Approaching',
            value: data.approaching ? 'Yes' : 'No'
          }, {
            label: 'Tornadoes',
            value: data.tornadic ? 'Possible' : 'No'
          }];
          var content = rows.reduce(function (result, row) {
            result.push("\n                                <div class=\"awxjs__ui-row\">\n                                    <div class=\"awxjs__ui-expand label\">" + row.label + "</div>\n                                    <div class=\"awxjs__ui-expand value\">" + row.value + "</div>\n                                </div>\n                            ");
            return result;
          }, []).join('\n');
          return "\n                            <div class=\"awxjs__app__ui-panel-info__table\">\n                                " + content + "\n                            </div>\n                        ";
        }
      }, {
        title: 'Affecting Storms',
        requiresData: true,
        data: function (data) {
          return (0, _index.get)(data, '[0].periods[0].storms');
        },
        renderer: function (data) {
          return "\n                    <div class=\"awxjs__app__ui-panel-info__table\">\n                        <div class=\"awxjs__ui-row\">\n                            <div class=\"awxjs__ui-expand label\">Location</div>\n                            <div class=\"awxjs__ui-expand value\">\n                                " + data.distance.avgMI + " mi\n                                " + data.direction.from + " (" + data.direction.fromDEG + "&deg;)\n                            </div>\n                        </div>\n                        <div class=\"awxjs__ui-row\">\n                            <div class=\"awxjs__ui-expand label\">Movement</div>\n                            <div class=\"awxjs__ui-expand value\">\n                                " + data.direction.to + "\n                                at " + (0, _utils.round5)(data.speed.avgMPH) + " mph\n                            </div>\n                        </div>\n                    </div>\n                ";
        }
      }]
    };
    this.app.panels.info.setContentView('threats', localWeatherConfig);
    this.app.map.on('click', function (e) {
      _this.app.showInfoAtCoord(e.data.coord, 'threats', 'Storm Threats');
    });
  };

  return Severe;
}(_ModuleGroup.default);

var _default = Severe;
exports.default = _default;
module.exports = exports.default;