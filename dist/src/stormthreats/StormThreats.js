"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _MapSourceModule = _interopRequireDefault(require("@aerisweather/javascript-sdk/dist/modules/MapSourceModule"));

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

var StormThreats =
/** @class */
function (_super) {
  __extends(StormThreats, _super);

  function StormThreats() {
    return _super !== null && _super.apply(this, arguments) || this;
  }

  Object.defineProperty(StormThreats.prototype, "id", {
    get: function () {
      return 'stormthreats';
    },
    enumerable: false,
    configurable: true
  });

  StormThreats.prototype.source = function () {
    var _this = this;

    var properties = {
      root: 'features',
      path: 'geometry'
    };
    return {
      type: 'vector',
      requiresBounds: true,
      data: {
        service: function () {
          return _this.request;
        },
        properties: properties
      },
      style: {
        polygon: function () {
          return {
            fill: {
              color: '#ffa500',
              opacity: 0.65
            }
          };
        }
      }
    };
  };

  StormThreats.prototype.controls = function () {
    return {
      value: this.id,
      title: 'Storm Threats',
      controls: {
        settings: [{
          type: 'opacity'
        }]
      }
    };
  };

  StormThreats.prototype.onInit = function () {
    var request = this.account.api().endpoint('stormcells/summary').format('geojson').limit(1).filter('threat,geo');
    this.request = request;
  };

  return StormThreats;
}(_MapSourceModule.default);

var _default = StormThreats;
exports.default = _default;
module.exports = exports.default;