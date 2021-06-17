"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _MapSourceModule = _interopRequireDefault(require("@aerisweather/javascript-sdk/dist/modules/MapSourceModule"));

var utils = _interopRequireWildcard(require("@aerisweather/javascript-sdk/dist/utils/index"));

var _strings = require("@aerisweather/javascript-sdk/dist/utils/strings");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

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

var Warnings =
/** @class */
function (_super) {
  __extends(Warnings, _super);

  function Warnings() {
    return _super !== null && _super.apply(this, arguments) || this;
  }

  Object.defineProperty(Warnings.prototype, "id", {
    get: function () {
      var _a;

      return ((_a = this.opts) === null || _a === void 0 ? void 0 : _a.id) || 'warnings';
    },
    enumerable: false,
    configurable: true
  });

  Warnings.prototype.source = function () {
    var _this = this;

    var properties = {
      root: 'features',
      id: 'properties.details.loc',
      category: 'properties.details.cat',
      path: 'geometry'
    };
    return {
      type: 'vector',
      data: {
        service: function () {
          return _this.request;
        },
        properties: properties
      },
      style: {
        polygon: function (item) {
          return {
            fill: {
              color: "#" + utils.get(item, 'properties.details.color'),
              opacity: 0.4,
              weight: 3
            },
            stroke: {
              color: "#" + utils.get(item, 'properties.details.color'),
              width: 2,
              weight: 3,
              adjustOpacity: false
            }
          };
        }
      }
    };
  };

  Warnings.prototype.controls = function () {
    return {
      value: this.id,
      title: 'Warnings',
      controls: {
        settings: [{
          type: 'opacity'
        }]
      }
    };
  };

  Warnings.prototype.infopanel = function () {
    return {
      views: [{
        data: function (data) {
          if (!(0, utils.isset)(data)) return;
          data = data.alert.details;
          return data;
        },
        renderer: function (data) {
          if (!(0, utils.isset)(data)) return;
          return "<div class=\"alert\">" + (data.body || '').replace(/\n/g, '<br>') + "</div>";
        }
      }]
    };
  };

  Warnings.prototype.onInit = function () {
    var request = this.account.api().endpoint('advisories').action("search"
    /* SEARCH */
    ).filter('usa').query('type:TO.W;type:SV.W;type:FF.W;').fields('details.type,details.name,details.body,details,geoPoly').limit(100).format('geojson');
    this.request = request;
  };

  Warnings.prototype.onShapeClick = function (shape, data) {
    var source = data.awxjs_source;
    var props = data.properties || {};

    if (source === 'warnings') {
      this.showInfoPanel(props.details.name).load("" + (0, _strings.toName)(props.details.name), {
        alert: props
      });
    }
  };

  return Warnings;
}(_MapSourceModule.default);

var _default = Warnings;
exports.default = _default;
module.exports = exports.default;