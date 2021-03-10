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

var LightningThreats =
/** @class */
function (_super) {
  __extends(LightningThreats, _super);

  function LightningThreats() {
    return _super !== null && _super.apply(this, arguments) || this;
  }

  Object.defineProperty(LightningThreats.prototype, "id", {
    get: function () {
      return 'lightningthreats';
    },
    enumerable: false,
    configurable: true
  });

  LightningThreats.prototype.source = function () {
    var _this = this;

    var properties = {
      root: 'features',
      path: 'geometry'
    };
    return {
      type: 'vector',
      requreBounds: true,
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
              color: '#FFDB00',
              opacity: 0.6
            }
          };
        }
      }
    };
  };

  LightningThreats.prototype.controls = function () {
    return {
      value: this.id,
      title: 'Lightning Threats'
    };
  };

  LightningThreats.prototype.onInit = function () {
    var request = this.account.api().endpoint('lightning/summary').format('geojson').filter('threat,geo').from('-15minutes');
    this.request = request;
  };

  return LightningThreats;
}(_MapSourceModule.default);

var _default = LightningThreats;
exports.default = _default;
module.exports = exports.default;