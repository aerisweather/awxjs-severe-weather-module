"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _MapSourceModule = _interopRequireDefault(require("@aerisweather/javascript-sdk/dist/modules/MapSourceModule"));

var _strings = require("@aerisweather/javascript-sdk/dist/utils/strings");

var _index = require("@aerisweather/javascript-sdk/dist/utils/index");

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

var color = function (code) {
  code = code.toLowerCase();

  switch (code) {
    case 'avalanche':
      return '#639fec';

    case 'blizzard':
      return '#4100e2';

    case 'flood':
      return '#117d00';

    case 'fog':
      return '#767676';

    case 'ice':
      return '#e100e2';

    case 'hail':
      return '#62def7';

    case 'lightning':
      return '#8c8c8c';

    case 'rain':
      return '#38e600';

    case 'snow':
      return '#175cef';

    case 'tides':
      return '#40db83';

    case 'tornado':
      return '#c50000';

    case 'wind':
      return '#d8cc00';

    default:
      return '#000000';
  }
};

var StormReports =
/** @class */
function (_super) {
  __extends(StormReports, _super);

  function StormReports() {
    return _super !== null && _super.apply(this, arguments) || this;
  }

  Object.defineProperty(StormReports.prototype, "id", {
    get: function () {
      return 'stormreports';
    },
    enumerable: false,
    configurable: true
  });

  StormReports.prototype.source = function () {
    var _this = this;

    return {
      type: 'vector',
      requreBounds: true,
      data: {
        service: function () {
          return _this.request;
        }
      },
      style: {
        marker: function (data) {
          var type = (0, _index.get)(data, 'report.cat');
          return {
            className: 'marker-stormreport',
            svg: {
              shape: {
                type: 'circle',
                fill: {
                  color: color(type)
                },
                stroke: {
                  color: '#ffffff',
                  width: 2
                }
              }
            },
            size: [14, 14]
          };
        }
      }
    };
  };

  StormReports.prototype.controls = function () {
    return {
      value: this.id,
      title: 'Storm Reports'
    };
  };

  StormReports.prototype.infopanel = function () {
    return {
      views: [{
        data: function (data) {
          var payload = (0, _index.get)(data, 'stormreports');

          if (!payload) {
            return;
          }

          return payload;
        },
        renderer: function (data) {
          if (!data) return;
          var rows = [{
            label: 'Location',
            value: data.report.name
          }, {
            label: 'Description',
            value: (0, _strings.ucwords)(data.report.type)
          }, {
            label: 'Magnitude',
            value: (0, _utils.getMagnitude)(data.report)
          }, {
            label: 'Report Time',
            value: (0, _index.formatDate)(new Date(data.report.timestamp * 1000), 'h:mm a, MMM d, yyyy')
          }, {
            label: 'Remarks',
            value: data.report.comments || ''
          }];
          var content = rows.reduce(function (result, row) {
            result.push("\n                                <div class=\"awxjs__ui-row\">\n                                    <div class=\"awxjs__ui-expand label\">" + row.label + "</div>\n                                    <div class=\"awxjs__ui-expand value\">" + row.value + "</div>\n                                </div>\n                            ");
            return result;
          }, []).join('\n');
          return "\n                        <div class=\"awxjs__app__ui-panel-info__table\">\n                            " + content + "\n                        </div>\n                    ";
        }
      }]
    };
  };

  StormReports.prototype.onMarkerClick = function (marker, data) {
    if (!data) return;
    var id = data.id,
        report = data.report;
    var type = (0, _strings.ucwords)(report.type);
    this.showInfoPanel("" + type).load({
      p: id
    }, {
      stormreports: data
    });
  };

  StormReports.prototype.onInit = function () {
    var request = this.account.api().endpoint('stormreports');
    this.request = request;
  };

  return StormReports;
}(_MapSourceModule.default);

var _default = StormReports;
exports.default = _default;
module.exports = exports.default;