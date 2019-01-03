/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/eventemitter3/index.js":
/*!*********************************************!*\
  !*** ./node_modules/eventemitter3/index.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var has = Object.prototype.hasOwnProperty
  , prefix = '~';

/**
 * Constructor to create a storage for our `EE` objects.
 * An `Events` instance is a plain object whose properties are event names.
 *
 * @constructor
 * @private
 */
function Events() {}

//
// We try to not inherit from `Object.prototype`. In some engines creating an
// instance in this way is faster than calling `Object.create(null)` directly.
// If `Object.create(null)` is not supported we prefix the event names with a
// character to make sure that the built-in object properties are not
// overridden or used as an attack vector.
//
if (Object.create) {
  Events.prototype = Object.create(null);

  //
  // This hack is needed because the `__proto__` property is still inherited in
  // some old browsers like Android 4, iPhone 5.1, Opera 11 and Safari 5.
  //
  if (!new Events().__proto__) prefix = false;
}

/**
 * Representation of a single event listener.
 *
 * @param {Function} fn The listener function.
 * @param {*} context The context to invoke the listener with.
 * @param {Boolean} [once=false] Specify if the listener is a one-time listener.
 * @constructor
 * @private
 */
function EE(fn, context, once) {
  this.fn = fn;
  this.context = context;
  this.once = once || false;
}

/**
 * Add a listener for a given event.
 *
 * @param {EventEmitter} emitter Reference to the `EventEmitter` instance.
 * @param {(String|Symbol)} event The event name.
 * @param {Function} fn The listener function.
 * @param {*} context The context to invoke the listener with.
 * @param {Boolean} once Specify if the listener is a one-time listener.
 * @returns {EventEmitter}
 * @private
 */
function addListener(emitter, event, fn, context, once) {
  if (typeof fn !== 'function') {
    throw new TypeError('The listener must be a function');
  }

  var listener = new EE(fn, context || emitter, once)
    , evt = prefix ? prefix + event : event;

  if (!emitter._events[evt]) emitter._events[evt] = listener, emitter._eventsCount++;
  else if (!emitter._events[evt].fn) emitter._events[evt].push(listener);
  else emitter._events[evt] = [emitter._events[evt], listener];

  return emitter;
}

/**
 * Clear event by name.
 *
 * @param {EventEmitter} emitter Reference to the `EventEmitter` instance.
 * @param {(String|Symbol)} evt The Event name.
 * @private
 */
function clearEvent(emitter, evt) {
  if (--emitter._eventsCount === 0) emitter._events = new Events();
  else delete emitter._events[evt];
}

/**
 * Minimal `EventEmitter` interface that is molded against the Node.js
 * `EventEmitter` interface.
 *
 * @constructor
 * @public
 */
function EventEmitter() {
  this._events = new Events();
  this._eventsCount = 0;
}

/**
 * Return an array listing the events for which the emitter has registered
 * listeners.
 *
 * @returns {Array}
 * @public
 */
EventEmitter.prototype.eventNames = function eventNames() {
  var names = []
    , events
    , name;

  if (this._eventsCount === 0) return names;

  for (name in (events = this._events)) {
    if (has.call(events, name)) names.push(prefix ? name.slice(1) : name);
  }

  if (Object.getOwnPropertySymbols) {
    return names.concat(Object.getOwnPropertySymbols(events));
  }

  return names;
};

/**
 * Return the listeners registered for a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @returns {Array} The registered listeners.
 * @public
 */
EventEmitter.prototype.listeners = function listeners(event) {
  var evt = prefix ? prefix + event : event
    , handlers = this._events[evt];

  if (!handlers) return [];
  if (handlers.fn) return [handlers.fn];

  for (var i = 0, l = handlers.length, ee = new Array(l); i < l; i++) {
    ee[i] = handlers[i].fn;
  }

  return ee;
};

/**
 * Return the number of listeners listening to a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @returns {Number} The number of listeners.
 * @public
 */
EventEmitter.prototype.listenerCount = function listenerCount(event) {
  var evt = prefix ? prefix + event : event
    , listeners = this._events[evt];

  if (!listeners) return 0;
  if (listeners.fn) return 1;
  return listeners.length;
};

/**
 * Calls each of the listeners registered for a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @returns {Boolean} `true` if the event had listeners, else `false`.
 * @public
 */
EventEmitter.prototype.emit = function emit(event, a1, a2, a3, a4, a5) {
  var evt = prefix ? prefix + event : event;

  if (!this._events[evt]) return false;

  var listeners = this._events[evt]
    , len = arguments.length
    , args
    , i;

  if (listeners.fn) {
    if (listeners.once) this.removeListener(event, listeners.fn, undefined, true);

    switch (len) {
      case 1: return listeners.fn.call(listeners.context), true;
      case 2: return listeners.fn.call(listeners.context, a1), true;
      case 3: return listeners.fn.call(listeners.context, a1, a2), true;
      case 4: return listeners.fn.call(listeners.context, a1, a2, a3), true;
      case 5: return listeners.fn.call(listeners.context, a1, a2, a3, a4), true;
      case 6: return listeners.fn.call(listeners.context, a1, a2, a3, a4, a5), true;
    }

    for (i = 1, args = new Array(len -1); i < len; i++) {
      args[i - 1] = arguments[i];
    }

    listeners.fn.apply(listeners.context, args);
  } else {
    var length = listeners.length
      , j;

    for (i = 0; i < length; i++) {
      if (listeners[i].once) this.removeListener(event, listeners[i].fn, undefined, true);

      switch (len) {
        case 1: listeners[i].fn.call(listeners[i].context); break;
        case 2: listeners[i].fn.call(listeners[i].context, a1); break;
        case 3: listeners[i].fn.call(listeners[i].context, a1, a2); break;
        case 4: listeners[i].fn.call(listeners[i].context, a1, a2, a3); break;
        default:
          if (!args) for (j = 1, args = new Array(len -1); j < len; j++) {
            args[j - 1] = arguments[j];
          }

          listeners[i].fn.apply(listeners[i].context, args);
      }
    }
  }

  return true;
};

/**
 * Add a listener for a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @param {Function} fn The listener function.
 * @param {*} [context=this] The context to invoke the listener with.
 * @returns {EventEmitter} `this`.
 * @public
 */
EventEmitter.prototype.on = function on(event, fn, context) {
  return addListener(this, event, fn, context, false);
};

/**
 * Add a one-time listener for a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @param {Function} fn The listener function.
 * @param {*} [context=this] The context to invoke the listener with.
 * @returns {EventEmitter} `this`.
 * @public
 */
EventEmitter.prototype.once = function once(event, fn, context) {
  return addListener(this, event, fn, context, true);
};

/**
 * Remove the listeners of a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @param {Function} fn Only remove the listeners that match this function.
 * @param {*} context Only remove the listeners that have this context.
 * @param {Boolean} once Only remove one-time listeners.
 * @returns {EventEmitter} `this`.
 * @public
 */
EventEmitter.prototype.removeListener = function removeListener(event, fn, context, once) {
  var evt = prefix ? prefix + event : event;

  if (!this._events[evt]) return this;
  if (!fn) {
    clearEvent(this, evt);
    return this;
  }

  var listeners = this._events[evt];

  if (listeners.fn) {
    if (
      listeners.fn === fn &&
      (!once || listeners.once) &&
      (!context || listeners.context === context)
    ) {
      clearEvent(this, evt);
    }
  } else {
    for (var i = 0, events = [], length = listeners.length; i < length; i++) {
      if (
        listeners[i].fn !== fn ||
        (once && !listeners[i].once) ||
        (context && listeners[i].context !== context)
      ) {
        events.push(listeners[i]);
      }
    }

    //
    // Reset the array, or remove it completely if we have no more listeners.
    //
    if (events.length) this._events[evt] = events.length === 1 ? events[0] : events;
    else clearEvent(this, evt);
  }

  return this;
};

/**
 * Remove all listeners, or those of the specified event.
 *
 * @param {(String|Symbol)} [event] The event name.
 * @returns {EventEmitter} `this`.
 * @public
 */
EventEmitter.prototype.removeAllListeners = function removeAllListeners(event) {
  var evt;

  if (event) {
    evt = prefix ? prefix + event : event;
    if (this._events[evt]) clearEvent(this, evt);
  } else {
    this._events = new Events();
    this._eventsCount = 0;
  }

  return this;
};

//
// Alias methods names because people roll like that.
//
EventEmitter.prototype.off = EventEmitter.prototype.removeListener;
EventEmitter.prototype.addListener = EventEmitter.prototype.on;

//
// Expose the prefix.
//
EventEmitter.prefixed = prefix;

//
// Allow `EventEmitter` to be imported as module namespace.
//
EventEmitter.EventEmitter = EventEmitter;

//
// Expose the module.
//
if (true) {
  module.exports = EventEmitter;
}


/***/ }),

/***/ "./src/Providers/Cocoon.ts":
/*!*********************************!*\
  !*** ./src/Providers/Cocoon.ts ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! ../index */ "./src/index.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, index_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var CocoonProvider;
    (function (CocoonProvider) {
        CocoonProvider[CocoonProvider["AdMob"] = 0] = "AdMob";
        CocoonProvider[CocoonProvider["MoPub"] = 1] = "MoPub";
        CocoonProvider[CocoonProvider["Chartboost"] = 2] = "Chartboost";
        CocoonProvider[CocoonProvider["Heyzap"] = 3] = "Heyzap";
    })(CocoonProvider = exports.CocoonProvider || (exports.CocoonProvider = {}));
    var CocoonAdType;
    (function (CocoonAdType) {
        CocoonAdType[CocoonAdType["banner"] = 0] = "banner";
        CocoonAdType[CocoonAdType["interstitial"] = 1] = "interstitial";
        CocoonAdType[CocoonAdType["insentive"] = 2] = "insentive";
    })(CocoonAdType = exports.CocoonAdType || (exports.CocoonAdType = {}));
    var CocoonAds = /** @class */ (function () {
        function CocoonAds(provider, config) {
            this.adsEnabled = false;
            this.banner = null;
            this.bannerShowable = false;
            this.interstitial = null;
            this.interstitialShowable = false;
            this.insentive = null;
            this.insentiveShowable = false;
            //TODO: Add cordova check
            if (Cocoon && Cocoon.Ad) {
                this.adsEnabled = true;
            }
            else {
                return;
            }
            switch (provider) {
                default:
                case CocoonProvider.AdMob:
                    this.cocoonProvider = Cocoon.Ad.AdMob;
                    break;
                case CocoonProvider.Chartboost:
                    this.cocoonProvider = Cocoon.Ad.Chartboost;
                    break;
                case CocoonProvider.Heyzap:
                    this.cocoonProvider = Cocoon.Ad.Heyzap;
                    break;
                case CocoonProvider.MoPub:
                    this.cocoonProvider = Cocoon.Ad.MoPub;
                    break;
            }
            this.cocoonProvider.configure(config);
        }
        CocoonAds.prototype.setManager = function (manager) {
            this.adManager = manager;
        };
        CocoonAds.prototype.showAd = function (adType) {
            if (!this.adsEnabled) {
                this.adManager.unMuteAfterAd();
                if (!(adType === CocoonAdType.banner)) {
                    this.adManager.emit(index_1.default.CONTENT_RESUMED);
                }
                return;
            }
            if (adType === CocoonAdType.banner) {
                if (!this.bannerShowable || null === this.banner) {
                    this.adManager.unMuteAfterAd();
                    //No banner ad available, skipping
                    //this.adManager.onContentResumed.dispatch(CocoonAdType.banner);
                    return;
                }
                this.adManager.emit(index_1.default.BANNER_SHOWN, this.banner.width, this.banner.height);
                this.adManager.bannerActive = true;
                this.banner.show();
            }
            if (adType === CocoonAdType.interstitial) {
                if (!this.interstitialShowable || null === this.interstitial) {
                    this.adManager.unMuteAfterAd();
                    //No banner ad available, skipping
                    this.adManager.emit(index_1.default.CONTENT_RESUMED, CocoonAdType.interstitial);
                    return;
                }
                this.interstitial.show();
            }
            if (adType === CocoonAdType.insentive) {
                if (!this.insentiveShowable || null === this.insentive) {
                    this.adManager.unMuteAfterAd();
                    //No banner ad available, skipping
                    this.adManager.emit(index_1.default.CONTENT_RESUMED, CocoonAdType.insentive);
                    return;
                }
                this.insentive.show();
            }
        };
        CocoonAds.prototype.preloadAd = function (adType, adId, bannerPosition) {
            var _this = this;
            if (!this.adsEnabled) {
                return;
            }
            //Some cleanup before preloading a new ad
            this.destroyAd(adType);
            if (adType === CocoonAdType.banner) {
                this.banner = this.cocoonProvider.createBanner(adId);
                if (bannerPosition) {
                    this.banner.setLayout(bannerPosition);
                }
                this.banner.on('load', function () {
                    _this.bannerShowable = true;
                });
                this.banner.on('fail', function () {
                    _this.bannerShowable = false;
                    _this.banner = null;
                });
                this.banner.on('click', function () {
                    _this.adManager.emit(index_1.default.AD_CLICKED, CocoonAdType.banner);
                });
                //Banner don't pause or resume content
                this.banner.on('show', function () {
                    /*this.adManager.onBannerShown.dispatch(this.banner.width, this.banner.height);
                     this.adManager.bannerActive = true;*/
                    // this.adManager.onContentPaused.dispatch(CocoonAdType.banner);
                });
                this.banner.on('dismiss', function () {
                    /*this.adManager.bannerActive = false;
                     this.adManager.onBannerHidden.dispatch(this.banner.width, this.banner.height);*/
                    // this.adManager.onContentResumed.dispatch(CocoonAdType.banner);
                    // this.bannerShowable = false;
                    // this.banner = null;
                });
                this.banner.load();
            }
            if (adType === CocoonAdType.interstitial) {
                this.interstitial = this.cocoonProvider.createInterstitial(adId);
                this.interstitial.on('load', function () {
                    _this.interstitialShowable = true;
                });
                this.interstitial.on('fail', function () {
                    _this.interstitialShowable = false;
                    _this.interstitial = null;
                });
                this.interstitial.on('click', function () {
                    _this.adManager.emit(index_1.default.AD_CLICKED, CocoonAdType.interstitial);
                });
                this.interstitial.on('show', function () {
                    _this.adManager.emit(index_1.default.CONTENT_PAUSED, CocoonAdType.interstitial);
                });
                this.interstitial.on('dismiss', function () {
                    _this.adManager.unMuteAfterAd();
                    _this.adManager.emit(index_1.default.CONTENT_RESUMED, CocoonAdType.interstitial);
                    _this.interstitialShowable = false;
                    _this.interstitial = null;
                });
                this.interstitial.load();
            }
            if (adType === CocoonAdType.insentive) {
                this.insentive = this.cocoonProvider.createRewardedVideo(adId);
                this.insentive.on('load', function () {
                    _this.insentiveShowable = true;
                });
                this.insentive.on('fail', function () {
                    _this.insentiveShowable = false;
                    _this.insentive = null;
                });
                this.insentive.on('click', function () {
                    _this.adManager.emit(index_1.default.AD_CLICKED, CocoonAdType.insentive);
                });
                this.insentive.on('show', function () {
                    _this.adManager.emit(index_1.default.CONTENT_PAUSED, CocoonAdType.insentive);
                });
                this.insentive.on('dismiss', function () {
                    _this.adManager.unMuteAfterAd();
                    _this.adManager.emit(index_1.default.CONTENT_RESUMED, CocoonAdType.insentive);
                    _this.insentiveShowable = false;
                    _this.insentive = null;
                });
                this.insentive.on('reward', function () {
                    _this.adManager.unMuteAfterAd();
                    _this.adManager.emit(index_1.default.AD_REWARDED, CocoonAdType.insentive);
                    _this.insentiveShowable = false;
                    _this.insentive = null;
                });
                this.insentive.load();
            }
        };
        CocoonAds.prototype.destroyAd = function (adType) {
            if (!this.adsEnabled) {
                return;
            }
            if (adType === CocoonAdType.banner && null !== this.banner) {
                //Releasing banners will fail on cocoon due to:
                // https://github.com/ludei/atomic-plugins-ads/pull/12
                try {
                    this.cocoonProvider.releaseBanner(this.banner);
                }
                catch (e) {
                    //silently ignore
                }
                this.banner = null;
                this.bannerShowable = false;
            }
            if (adType === CocoonAdType.interstitial && null !== this.interstitial) {
                this.cocoonProvider.releaseInterstitial(this.interstitial);
                this.interstitial = null;
                this.interstitialShowable = false;
            }
        };
        CocoonAds.prototype.hideAd = function (adType) {
            if (!this.adsEnabled) {
                return;
            }
            if (adType === CocoonAdType.interstitial && null !== this.interstitial) {
                this.interstitial.hide();
                // this.adManager.onContentResumed.dispatch(CocoonAdType.interstitial);
            }
            if (adType === CocoonAdType.banner && null !== this.banner) {
                if (this.adManager.bannerActive) {
                    this.adManager.bannerActive = false;
                    this.adManager.emit(index_1.default.BANNER_HIDDEN, this.banner.width, this.banner.height);
                }
                this.banner.hide();
                // this.adManager.onContentResumed.dispatch(CocoonAdType.banner);
            }
            if (adType === CocoonAdType.insentive && null !== this.insentive) {
                this.insentive.hide();
                // this.adManager.onContentResumed.dispatch(CocoonAdType.insentive);
            }
        };
        return CocoonAds;
    }());
    exports.default = CocoonAds;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./src/Providers/CordovaGameDistribution.ts":
/*!**************************************************!*\
  !*** ./src/Providers/CordovaGameDistribution.ts ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! ../index */ "./src/index.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, index_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var CordovaGameDistribution = /** @class */ (function () {
        function CordovaGameDistribution(gameId, userId, debug) {
            if (debug === void 0) { debug = false; }
            this.adsEnabled = false;
            if (cordova.plugins === undefined ||
                (cordova.plugins !== undefined && cordova.plugins.gdApi === undefined)) {
                console.log('gdApi not available!');
                return;
            }
            if (debug) {
                cordova.plugins.gdApi.enableTestAds();
            }
            this.setAdListeners();
            cordova.plugins.gdApi.init([
                gameId,
                userId
            ], function (data) {
                console.log('API init success!', data);
            }, function (error) {
                console.log('API init error!', error);
            });
        }
        CordovaGameDistribution.prototype.setAdListeners = function () {
            var _this = this;
            cordova.plugins.gdApi.setAdListener(function (data) {
                console.log('banner reply, data.event', data.event, data);
                switch (data.event) {
                    case 'BANNER_STARTED':
                        _this.adManager.emit(index_1.default.CONTENT_PAUSED);
                        break;
                    case 'API_IS_READY':
                        //Send post init
                        _this.adsEnabled = true;
                        break;
                    case 'API_ALREADY_INITIALIZED':
                        break;
                    case 'BANNER_CLOSED':
                    case 'API_NOT_READY':
                    case 'BANNER_FAILED':
                        _this.adManager.emit(index_1.default.CONTENT_RESUMED);
                        break;
                }
            }, function (error) {
                console.log('Set listener error:', error);
                _this.adsEnabled = false;
            });
        };
        CordovaGameDistribution.prototype.setManager = function (manager) {
            this.adManager = manager;
        };
        CordovaGameDistribution.prototype.showAd = function () {
            var _this = this;
            if (this.adsEnabled) {
                console.log('show banner called');
                cordova.plugins.gdApi.showBanner(function (data) {
                    console.log('Show banner worked', data);
                }, function (data) {
                    console.log('Could not show banner:', data);
                    _this.adManager.emit(index_1.default.CONTENT_RESUMED);
                });
            }
            else {
                console.log('Ads not enabled, resuming');
                this.adManager.emit(index_1.default.CONTENT_RESUMED);
            }
        };
        //Does nothing, but needed for Provider interface
        CordovaGameDistribution.prototype.preloadAd = function () {
            return;
        };
        //Does nothing, but needed for Provider interface
        CordovaGameDistribution.prototype.destroyAd = function () {
            return;
        };
        //Does nothing, but needed for Provider interface
        CordovaGameDistribution.prototype.hideAd = function () {
            return;
        };
        return CordovaGameDistribution;
    }());
    exports.default = CordovaGameDistribution;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./src/Providers/CordovaHeyzap.ts":
/*!****************************************!*\
  !*** ./src/Providers/CordovaHeyzap.ts ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! ../index */ "./src/index.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, index_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var HeyzapAdTypes;
    (function (HeyzapAdTypes) {
        HeyzapAdTypes[HeyzapAdTypes["Interstitial"] = 0] = "Interstitial";
        HeyzapAdTypes[HeyzapAdTypes["Video"] = 1] = "Video";
        HeyzapAdTypes[HeyzapAdTypes["Rewarded"] = 2] = "Rewarded";
        HeyzapAdTypes[HeyzapAdTypes["Banner"] = 3] = "Banner";
    })(HeyzapAdTypes = exports.HeyzapAdTypes || (exports.HeyzapAdTypes = {}));
    var CordovaHeyzap = /** @class */ (function () {
        function CordovaHeyzap(publisherId) {
            var _this = this;
            this.adsEnabled = false;
            //TODO: Add cordova check
            if (true) {
                this.adsEnabled = true;
            }
            else {}
            HeyzapAds.start(publisherId).then(function () {
                // Native call successful.
            }, function (error) {
                //Failed to start heyzap, disabling ads
                _this.adsEnabled = false;
            });
        }
        CordovaHeyzap.prototype.setManager = function (manager) {
            this.adManager = manager;
        };
        CordovaHeyzap.prototype.showAd = function (adType, bannerAdPositions) {
            var _this = this;
            if (!this.adsEnabled) {
                this.adManager.unMuteAfterAd();
                this.adManager.emit(index_1.default.CONTENT_RESUMED);
            }
            switch (adType) {
                case HeyzapAdTypes.Interstitial:
                    //Register event listeners
                    HeyzapAds.InterstitialAd.addEventListener(HeyzapAds.InterstitialAd.Events.HIDE, function () {
                        _this.adManager.unMuteAfterAd();
                        _this.adManager.emit(index_1.default.CONTENT_RESUMED, HeyzapAds.InterstitialAd.Events.HIDE);
                    });
                    HeyzapAds.InterstitialAd.addEventListener(HeyzapAds.InterstitialAd.Events.SHOW_FAILED, function () {
                        _this.adManager.unMuteAfterAd();
                        _this.adManager.emit(index_1.default.CONTENT_RESUMED, HeyzapAds.InterstitialAd.Events.SHOW_FAILED);
                    });
                    HeyzapAds.InterstitialAd.addEventListener(HeyzapAds.InterstitialAd.Events.CLICKED, function () {
                        _this.adManager.emit(index_1.default.AD_CLICKED, HeyzapAds.InterstitialAd.Events.CLICKED);
                    });
                    HeyzapAds.InterstitialAd.show().then(function () {
                        // Native call successful.
                        _this.adManager.emit(index_1.default.CONTENT_PAUSED);
                    }, function (error) {
                        _this.adManager.unMuteAfterAd();
                        //Failed to show insentive ad, continue operations
                        _this.adManager.emit(index_1.default.CONTENT_RESUMED);
                    });
                    break;
                case HeyzapAdTypes.Video:
                    HeyzapAds.VideoAd.addEventListener(HeyzapAds.VideoAd.Events.HIDE, function () {
                        _this.adManager.unMuteAfterAd();
                        _this.adManager.emit(index_1.default.CONTENT_RESUMED, HeyzapAds.VideoAd.Events.HIDE);
                    });
                    HeyzapAds.VideoAd.addEventListener(HeyzapAds.VideoAd.Events.SHOW_FAILED, function () {
                        _this.adManager.unMuteAfterAd();
                        _this.adManager.emit(index_1.default.CONTENT_RESUMED, HeyzapAds.VideoAd.Events.SHOW_FAILED);
                    });
                    HeyzapAds.VideoAd.addEventListener(HeyzapAds.VideoAd.Events.CLICKED, function () {
                        _this.adManager.emit(index_1.default.AD_CLICKED, HeyzapAds.VideoAd.Events.CLICKED);
                    });
                    HeyzapAds.VideoAd.show().then(function () {
                        // Native call successful.
                        _this.adManager.emit(index_1.default.CONTENT_PAUSED);
                    }, function (error) {
                        _this.adManager.unMuteAfterAd();
                        //Failed to show insentive ad, continue operations
                        _this.adManager.emit(index_1.default.CONTENT_RESUMED);
                    });
                    break;
                case HeyzapAdTypes.Rewarded:
                    HeyzapAds.IncentivizedAd.addEventListener(HeyzapAds.IncentivizedAd.Events.HIDE, function () {
                        _this.adManager.unMuteAfterAd();
                        _this.adManager.emit(index_1.default.CONTENT_RESUMED, HeyzapAds.IncentivizedAd.Events.HIDE);
                    });
                    HeyzapAds.IncentivizedAd.addEventListener(HeyzapAds.IncentivizedAd.Events.SHOW_FAILED, function () {
                        _this.adManager.unMuteAfterAd();
                        _this.adManager.emit(index_1.default.CONTENT_RESUMED, HeyzapAds.IncentivizedAd.Events.SHOW_FAILED);
                    });
                    HeyzapAds.IncentivizedAd.addEventListener(HeyzapAds.IncentivizedAd.Events.CLICKED, function () {
                        _this.adManager.emit(index_1.default.AD_CLICKED, HeyzapAds.IncentivizedAd.Events.CLICKED);
                    });
                    HeyzapAds.IncentivizedAd.show().then(function () {
                        // Native call successful.
                        _this.adManager.emit(index_1.default.CONTENT_PAUSED);
                    }, function (error) {
                        _this.adManager.unMuteAfterAd();
                        //Failed to show insentive ad, continue operations
                        _this.adManager.emit(index_1.default.CONTENT_RESUMED);
                    });
                    break;
                case HeyzapAdTypes.Banner:
                    HeyzapAds.BannerAd.show(bannerAdPositions).then(function () {
                        // Native call successful.
                    }, function (error) {
                        // Handle Error
                    });
                    break;
            }
        };
        CordovaHeyzap.prototype.preloadAd = function (adType) {
            if (!this.adsEnabled) {
                return;
            }
            if (adType === HeyzapAdTypes.Rewarded) {
                HeyzapAds.IncentivizedAd.fetch().then(function () {
                    // Native call successful.
                }, function (error) {
                    // Handle Error
                });
            }
            return;
        };
        CordovaHeyzap.prototype.destroyAd = function (adType) {
            if (!this.adsEnabled) {
                return;
            }
            if (adType === HeyzapAdTypes.Banner) {
                HeyzapAds.BannerAd.destroy().then(function () {
                    // Native call successful.
                }, function (error) {
                    // Handle Error
                });
            }
            return;
        };
        CordovaHeyzap.prototype.hideAd = function (adType) {
            if (!this.adsEnabled) {
                return;
            }
            if (adType === HeyzapAdTypes.Banner) {
                HeyzapAds.BannerAd.hide().then(function () {
                    // Native call successful.
                }, function (error) {
                    // Handle Error
                });
            }
            return;
        };
        return CordovaHeyzap;
    }());
    exports.default = CordovaHeyzap;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./src/Providers/GameDistributionAds.ts":
/*!**********************************************!*\
  !*** ./src/Providers/GameDistributionAds.ts ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! ../index */ "./src/index.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, index_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var GameDistributionAds = /** @class */ (function () {
        function GameDistributionAds(gameId, userId) {
            var _this = this;
            this.adsEnabled = true;
            this.areAdsEnabled();
            window.GD_OPTIONS = {
                gameId: gameId,
                userId: userId,
                advertisementSettings: {
                    autoplay: false
                },
                onEvent: function (event) {
                    switch (event.name) {
                        case 'SDK_GAME_START':
                            if (typeof gdApi !== 'undefined') {
                                gdApi.play();
                            }
                            _this.adManager.unMuteAfterAd();
                            _this.adManager.emit(index_1.default.CONTENT_RESUMED);
                            break;
                        case 'SDK_GAME_PAUSE':
                            _this.adManager.emit(index_1.default.CONTENT_PAUSED);
                            break;
                        case 'SDK_READY':
                            //add something here
                            break;
                        case 'SDK_ERROR':
                            break;
                    }
                }
            };
            //Include script. even when adblock is enabled, this script also allows us to track our users;
            (function (d, s, id) {
                var js;
                var fjs = d.getElementsByTagName(s)[0];
                if (d.getElementById(id)) {
                    return;
                }
                js = d.createElement(s);
                js.id = id;
                js.src = '//html5.api.gamedistribution.com/main.min.js';
                fjs.parentNode.insertBefore(js, fjs);
            }(document, 'script', 'gamedistribution-jssdk'));
        }
        GameDistributionAds.prototype.setManager = function (manager) {
            this.adManager = manager;
        };
        GameDistributionAds.prototype.showAd = function () {
            if (!this.adsEnabled) {
                this.adManager.unMuteAfterAd();
                this.adManager.emit(index_1.default.CONTENT_RESUMED);
            }
            else {
                if (typeof gdApi === 'undefined' || (gdApi && typeof gdApi.showBanner === 'undefined')) {
                    //So gdApi isn't available OR
                    //gdApi is available, but showBanner is not there (weird but can happen)
                    this.adsEnabled = false;
                    this.adManager.unMuteAfterAd();
                    this.adManager.emit(index_1.default.CONTENT_RESUMED);
                    return;
                }
                gdApi.showBanner();
            }
        };
        //Does nothing, but needed for Provider interface
        GameDistributionAds.prototype.preloadAd = function () {
            return;
        };
        //Does nothing, but needed for Provider interface
        GameDistributionAds.prototype.destroyAd = function () {
            return;
        };
        //Does nothing, but needed for Provider interface
        GameDistributionAds.prototype.hideAd = function () {
            return;
        };
        /**
         * Checks if the ads are enabled (e.g; adblock is enabled or not)
         * @returns {boolean}
         */
        GameDistributionAds.prototype.areAdsEnabled = function () {
            var _this = this;
            var test = document.createElement('div');
            test.innerHTML = '&nbsp;';
            test.className = 'adsbox';
            test.style.position = 'absolute';
            test.style.fontSize = '10px';
            document.body.appendChild(test);
            // let adsEnabled: boolean;
            var isEnabled = function () {
                var enabled = true;
                if (test.offsetHeight === 0) {
                    enabled = false;
                }
                test.parentNode.removeChild(test);
                return enabled;
            };
            window.setTimeout(function () {
                _this.adsEnabled = isEnabled();
            }, 100);
        };
        return GameDistributionAds;
    }());
    exports.default = GameDistributionAds;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./src/Providers/Ima3.ts":
/*!*******************************!*\
  !*** ./src/Providers/Ima3.ts ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! ../index */ "./src/index.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, index_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Ima3 = /** @class */ (function () {
        function Ima3(canvas, adTagUrl) {
            this.adsManager = null;
            this.googleEnabled = false;
            this.adsEnabled = true;
            this.adTagUrl = '';
            this.adRequested = false;
            this.adManager = null;
            this.resizeListener = null;
            this.areAdsEnabled();
            if (typeof google === 'undefined') {
                return;
            }
            this.googleEnabled = true;
            this.gameContent = (typeof canvas.parentElement === 'string') ? document.getElementById(canvas.parentElement) : canvas.parentElement;
            // this.gameContent.currentTime = 100;
            this.gameContent.style.position = 'absolute';
            this.gameContent.style.width = '100%';
            this.adContent = this.gameContent.parentNode.appendChild(document.createElement('div'));
            this.adContent.id = 'phaser-ad-container';
            this.adContent.style.position = 'absolute';
            this.adContent.style.zIndex = '9999';
            this.adContent.style.display = 'none';
            this.adContent.style.top = '0';
            this.adContent.style.left = '0';
            this.adContent.style.width = '100%';
            this.adContent.style.height = '100%';
            this.adContent.style.overflow = 'hidden';
            this.adTagUrl = adTagUrl;
            // Create the ad display container.
            this.adDisplay = new google.ima.AdDisplayContainer(this.adContent);
            //Set vpaid enabled, and update locale
            google.ima.settings.setVpaidMode(google.ima.ImaSdkSettings.VpaidMode.ENABLED);
            google.ima.settings.setLocale('nl');
            // Create ads loader, and register events
            this.adLoader = new google.ima.AdsLoader(this.adDisplay);
            this.adLoader.addEventListener(google.ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED, this.onAdManagerLoader, false, this);
            this.adLoader.addEventListener(google.ima.AdErrorEvent.Type.AD_ERROR, this.onAdError, false, this);
        }
        Ima3.prototype.setManager = function (manager) {
            this.adManager = manager;
        };
        /**
         * Doing an ad request, if anything is wrong with the lib (missing ima3, failed request) we just dispatch the contentResumed event
         * Otherwise we display an ad
         */
        Ima3.prototype.showAd = function (customParams) {
            console.log('Ad Requested');
            if (this.adRequested) {
                return;
            }
            if (!this.adsEnabled) {
                this.adManager.emit(index_1.default.AD_DISABLED, true);
            }
            if (!this.googleEnabled) {
                this.onContentResumeRequested();
                return;
            }
            //For mobile this ad request needs to be handled post user click
            this.adDisplay.initialize();
            // Request video ads.
            var adsRequest = new google.ima.AdsRequest();
            adsRequest.adTagUrl = this.adTagUrl + this.parseCustomParams(customParams);
            var width = window.innerWidth; //parseInt(<string>(!this.game.canvas.style.width ? this.game.canvas.width : this.game.canvas.style.width), 10);
            var height = window.innerHeight; //parseInt(<string>(!this.game.canvas.style.height ? this.game.canvas.height : this.game.canvas.style.height), 10);
            //Here we check if phaser is fullscreen or not, if we are fullscreen, we subtract some of the width and height, to counter for the resize (
            //Fullscreen should be disabled for the ad, (onContentPaused) and requested for again when the game resumes
            if (document.body.clientHeight < window.innerHeight) {
                height = document.body.clientHeight;
                width = document.body.clientWidth;
            }
            // Specify the linear and nonlinear slot sizes. This helps the SDK to
            // select the correct creative if multiple are returned.
            adsRequest.linearAdSlotWidth = width;
            adsRequest.linearAdSlotHeight = height;
            adsRequest.nonLinearAdSlotWidth = width;
            adsRequest.nonLinearAdSlotHeight = height;
            //Required for games, see:
            //http://googleadsdeveloper.blogspot.nl/2015/10/important-changes-for-gaming-publishers.html
            adsRequest.forceNonLinearFullSlot = true;
            try {
                this.adRequested = true;
                this.adLoader.requestAds(adsRequest);
            }
            catch (e) {
                console.log(e);
                this.onContentResumeRequested();
            }
        };
        //Does nothing, but needed for Provider interface
        Ima3.prototype.preloadAd = function () {
            return;
        };
        //Does nothing, but needed for Provider interface
        Ima3.prototype.destroyAd = function () {
            return;
        };
        //Does nothing, but needed for Provider interface
        Ima3.prototype.hideAd = function () {
            return;
        };
        /**
         * Called when the ads manager was loaded.
         * We register all ad related events here, and initialize the manager with the game width/height
         *
         * @param adsManagerLoadedEvent
         */
        Ima3.prototype.onAdManagerLoader = function (adsManagerLoadedEvent) {
            var _this = this;
            console.log('AdsManager loaded');
            // Get the ads manager.
            var adsRenderingSettings = new google.ima.AdsRenderingSettings();
            adsRenderingSettings.restoreCustomPlaybackStateOnAdBreakComplete = true;
            // videoContent should be set to the content video element.
            var adsManager = adsManagerLoadedEvent.getAdsManager(this.gameContent, adsRenderingSettings);
            this.adsManager = adsManager;
            console.log(adsManager.isCustomClickTrackingUsed());
            // Add listeners to the required events.
            adsManager.addEventListener(google.ima.AdEvent.Type.CONTENT_PAUSE_REQUESTED, this.onContentPauseRequested, false, this);
            adsManager.addEventListener(google.ima.AdEvent.Type.CONTENT_RESUME_REQUESTED, this.onContentResumeRequested, false, this);
            adsManager.addEventListener(google.ima.AdErrorEvent.Type.AD_ERROR, this.onAdError, false, this);
            [
                google.ima.AdEvent.Type.ALL_ADS_COMPLETED,
                google.ima.AdEvent.Type.CLICK,
                google.ima.AdEvent.Type.COMPLETE,
                google.ima.AdEvent.Type.FIRST_QUARTILE,
                google.ima.AdEvent.Type.LOADED,
                google.ima.AdEvent.Type.MIDPOINT,
                google.ima.AdEvent.Type.PAUSED,
                google.ima.AdEvent.Type.STARTED,
                google.ima.AdEvent.Type.THIRD_QUARTILE
            ].forEach(function (event) {
                adsManager.addEventListener(event, _this.onAdEvent, false, _this);
            });
            try {
                //Show the ad elements, we only need to show the faux videoelement on iOS, because the ad is displayed in there.
                this.adContent.style.display = 'block';
                // Initialize the ads manager. Ad rules playlist will start at this time.
                var width = window.innerWidth; //parseInt(<string>(!this.game.canvas.style.width ? this.game.canvas.width : this.game.canvas.style.width), 10);
                var height = window.innerHeight; //parseInt(<string>(!this.game.canvas.style.height ? this.game.canvas.height : this.game.canvas.style.height), 10);
                this.adsManager.init(width, height, google.ima.ViewMode.NORMAL);
                // Call play to start showing the ad. Single video and overlay ads will
                // start at this time; the call will be ignored for ad rules.
                this.adsManager.start();
                this.resizeListener = function () {
                    if (_this.adsManager === null) {
                        return;
                    }
                    //Window was resized, so expect something similar
                    console.log('Resizing ad size');
                    _this.adsManager.resize(window.innerWidth, window.innerHeight, google.ima.ViewMode.NORMAL);
                };
                window.addEventListener('resize', this.resizeListener);
            }
            catch (adError) {
                console.log('Adsmanager error:', adError);
                this.onAdError(adError);
            }
        };
        /**
         * Generic ad events are handled here
         * @param adEvent
         */
        Ima3.prototype.onAdEvent = function (adEvent) {
            console.log('onAdEvent', adEvent);
            switch (adEvent.type) {
                case google.ima.AdEvent.Type.CLICK:
                    this.adManager.emit(index_1.default.AD_CLICKED);
                    break;
                case google.ima.AdEvent.Type.LOADED:
                    this.adRequested = false;
                    var ad = adEvent.getAd();
                    console.log('is ad linear?', ad.isLinear());
                    if (!ad.isLinear()) {
                        this.onContentResumeRequested();
                    }
                    break;
                case google.ima.AdEvent.Type.STARTED:
                    this.adManager.emit(index_1.default.AD_PROGRESSION, index_1.AdEvent.start);
                    break;
                case google.ima.AdEvent.Type.FIRST_QUARTILE:
                    this.adManager.emit(index_1.default.AD_PROGRESSION, index_1.AdEvent.firstQuartile);
                    break;
                case google.ima.AdEvent.Type.MIDPOINT:
                    this.adManager.emit(index_1.default.AD_PROGRESSION, index_1.AdEvent.midPoint);
                    break;
                case google.ima.AdEvent.Type.THIRD_QUARTILE:
                    this.adManager.emit(index_1.default.AD_PROGRESSION, index_1.AdEvent.thirdQuartile);
                    break;
                case google.ima.AdEvent.Type.COMPLETE:
                    this.adManager.emit(index_1.default.AD_PROGRESSION, index_1.AdEvent.complete);
                    break;
                case google.ima.AdEvent.Type.ALL_ADS_COMPLETED:
                    this.onContentResumeRequested();
                    break;
            }
        };
        Ima3.prototype.onAdError = function (error) {
            console.log('gneric ad error', error);
            if (null !== this.adsManager) {
                this.adsManager.destroy();
                this.adsManager = null;
                if (null !== this.resizeListener) {
                    window.removeEventListener('resize', this.resizeListener);
                    this.resizeListener = null;
                }
            }
            if (this.adRequested) {
                this.adRequested = false;
            }
            //We silently ignore adLoader errors, it just means there is no ad available
            this.onContentResumeRequested();
        };
        /**
         * When the ad starts playing, and the game should be paused
         */
        Ima3.prototype.onContentPauseRequested = function () {
            console.log('onContentPauseRequested', arguments);
            this.adManager.emit(index_1.default.CONTENT_PAUSED);
        };
        /**
         * When the ad is finished and the game should be resumed
         */
        Ima3.prototype.onContentResumeRequested = function () {
            console.log('onContentResumeRequested', arguments);
            if (typeof google === 'undefined') {
                this.adManager.unMuteAfterAd();
                this.adManager.emit(index_1.default.CONTENT_RESUMED);
                return;
            }
            this.adContent.style.display = 'none';
            this.adManager.unMuteAfterAd();
            this.adManager.emit(index_1.default.CONTENT_RESUMED);
        };
        Ima3.prototype.parseCustomParams = function (customParams) {
            if (undefined !== customParams) {
                var customDataString = '';
                for (var key in customParams) {
                    if (customParams.hasOwnProperty(key)) {
                        if (customDataString.length > 0) {
                            customDataString += '' +
                                '&';
                        }
                        var param = (Array.isArray(customParams[key])) ? customParams[key].join(',') : customParams[key];
                        customDataString += key + '=' + param;
                    }
                }
                return '&cust_params=' + encodeURIComponent(customDataString);
            }
            return '';
        };
        /**
         * Checks if the ads are enabled (e.g; adblock is enabled or not)
         * @returns {boolean}
         */
        Ima3.prototype.areAdsEnabled = function () {
            var _this = this;
            var test = document.createElement('div');
            test.innerHTML = '&nbsp;';
            test.className = 'adsbox';
            test.style.position = 'absolute';
            test.style.fontSize = '10px';
            document.body.appendChild(test);
            // let adsEnabled: boolean;
            var isEnabled = function () {
                var enabled = true;
                if (test.offsetHeight === 0) {
                    enabled = false;
                }
                test.parentNode.removeChild(test);
                return enabled;
            };
            window.setTimeout(function () {
                _this.adsEnabled = isEnabled();
            }, 100);
        };
        return Ima3;
    }());
    exports.default = Ima3;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(/*! ./Providers/Cocoon */ "./src/Providers/Cocoon.ts"), __webpack_require__(/*! eventemitter3 */ "./node_modules/eventemitter3/index.js"), __webpack_require__(/*! ./Providers/Cocoon */ "./src/Providers/Cocoon.ts"), __webpack_require__(/*! ./Providers/CordovaGameDistribution */ "./src/Providers/CordovaGameDistribution.ts"), __webpack_require__(/*! ./Providers/CordovaHeyzap */ "./src/Providers/CordovaHeyzap.ts"), __webpack_require__(/*! ./Providers/GameDistributionAds */ "./src/Providers/GameDistributionAds.ts"), __webpack_require__(/*! ./Providers/Ima3 */ "./src/Providers/Ima3.ts")], __WEBPACK_AMD_DEFINE_RESULT__ = (function (require, exports, Cocoon_1, eventemitter3_1, Cocoon_2, CordovaGameDistribution_1, CordovaHeyzap_1, GameDistributionAds_1, Ima3_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CocoonAds = Cocoon_2.default;
    exports.CordovaGameDistribution = CordovaGameDistribution_1.default;
    exports.CordovaHeyzap = CordovaHeyzap_1.default;
    exports.GameDistributionAds = GameDistributionAds_1.default;
    exports.Ima3 = Ima3_1.default;
    var AdEvent;
    (function (AdEvent) {
        AdEvent[AdEvent["start"] = 0] = "start";
        AdEvent[AdEvent["firstQuartile"] = 1] = "firstQuartile";
        AdEvent[AdEvent["midPoint"] = 2] = "midPoint";
        AdEvent[AdEvent["thirdQuartile"] = 3] = "thirdQuartile";
        AdEvent[AdEvent["complete"] = 4] = "complete";
    })(AdEvent = exports.AdEvent || (exports.GoogleAdEvent = {}));
    var PhaserAds = /** @class */ (function (_super) {
        __extends(PhaserAds, _super);
        function PhaserAds() {
            var _this = _super.call(this) || this;
            _this.bannerActive = false;
            _this.provider = null;
            return _this;
            // console.log(arguments)
        }
        PhaserAds.prototype.init = function () {
            // console.log('init', arguments, this);
        };
        ;
        PhaserAds.prototype.start = function () {
            // console.log('start', arguments, this);
        };
        ;
        PhaserAds.prototype.stop = function () {
            // console.log('stop', arguments, this);
        };
        ;
        PhaserAds.prototype.boot = function () {
            // console.log('boot', arguments, this);
        };
        ;
        PhaserAds.prototype.destroy = function () {
            // console.log('destroy', arguments, this);
        };
        ;
        /**
         * Here we set an adprovider, any can be given as long as it implements the IProvider interface
         *
         * @param provider
         */
        PhaserAds.prototype.setAdProvider = function (provider) {
            this.provider = provider;
            this.provider.setManager(this);
        };
        /**
         * Here we request an ad, the arguments passed depend on the provider used!
         * @param args
         */
        PhaserAds.prototype.showAd = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            if (null === this.provider) {
                throw new Error('Can not request an ad without an provider, please attach an ad provider!');
            }
            //Let's not do this for banner's
            if (args[0] !== Cocoon_1.CocoonAdType.banner) {
                //first we check if the sound was already muted before we requested an add
                //Let's mute audio for the game, we can resume the audi playback once the add has played
            }
            this.provider.showAd.apply(this.provider, args);
        };
        /**
         * Some providers might require you to preload an ad before showing it, that can be done here
         *
         * @param args
         */
        PhaserAds.prototype.preloadAd = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            if (null === this.provider) {
                throw new Error('Can not preload an ad without an provider, please attach an ad provider!');
            }
            this.provider.preloadAd.apply(this.provider, args);
        };
        /**
         * Some providers require you to destroy an add after it was shown, that can be done here.
         *
         * @param args
         */
        PhaserAds.prototype.destroyAd = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            if (null === this.provider) {
                throw new Error('Can not destroy an ad without an provider, please attach an ad provider!');
            }
            this.provider.destroyAd.apply(this.provider, args);
        };
        /**
         * Some providers allow you to hide an ad, you might think of an banner ad that is shown in show cases
         *
         * @param args
         */
        PhaserAds.prototype.hideAd = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            if (null === this.provider) {
                throw new Error('Can not hide an ad without an provider, please attach an ad provider!');
            }
            this.unMuteAfterAd();
            this.provider.hideAd.apply(this.provider, args);
        };
        /**
         * Checks if ads are enabled or blocked
         *
         * @param args
         */
        PhaserAds.prototype.adsEnabled = function () {
            return this.provider.adsEnabled;
        };
        /**
         * Should be called after ad was(n't) shown, demutes the game so we can peacefully continue
         */
        PhaserAds.prototype.unMuteAfterAd = function () {
            //Here we unmute audio, but only if it wasn't muted before requesting an add
        };
        PhaserAds.CONTENT_PAUSED = 'onContentPaused';
        PhaserAds.CONTENT_RESUMED = 'onContentResumed';
        PhaserAds.AD_PROGRESSION = 'onAdProgression';
        PhaserAds.AD_DISABLED = 'onAdsDisabled';
        PhaserAds.AD_CLICKED = 'onAdClicked';
        PhaserAds.AD_REWARDED = 'onAdRewardGranted';
        PhaserAds.BANNER_SHOWN = 'onBannerShown';
        PhaserAds.BANNER_HIDDEN = 'onBannerHidden';
        return PhaserAds;
    }(eventemitter3_1.EventEmitter));
    exports.default = PhaserAds;
}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2V2ZW50ZW1pdHRlcjMvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL1Byb3ZpZGVycy9Db2Nvb24udHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL1Byb3ZpZGVycy9Db3Jkb3ZhR2FtZURpc3RyaWJ1dGlvbi50cyIsIndlYnBhY2s6Ly8vLi9zcmMvUHJvdmlkZXJzL0NvcmRvdmFIZXl6YXAudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL1Byb3ZpZGVycy9HYW1lRGlzdHJpYnV0aW9uQWRzLnRzIiwid2VicGFjazovLy8uL3NyYy9Qcm92aWRlcnMvSW1hMy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0Esa0RBQTBDLGdDQUFnQztBQUMxRTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGdFQUF3RCxrQkFBa0I7QUFDMUU7QUFDQSx5REFBaUQsY0FBYztBQUMvRDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaURBQXlDLGlDQUFpQztBQUMxRSx3SEFBZ0gsbUJBQW1CLEVBQUU7QUFDckk7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBMkIsMEJBQTBCLEVBQUU7QUFDdkQseUNBQWlDLGVBQWU7QUFDaEQ7QUFDQTtBQUNBOztBQUVBO0FBQ0EsOERBQXNELCtEQUErRDs7QUFFckg7QUFDQTs7O0FBR0E7QUFDQTs7Ozs7Ozs7Ozs7OztBQ2xGYTs7QUFFYjtBQUNBOztBQUVB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QUMsUUFBUSxFQUFFO2dCQUN4QixNQUFNLElBQUksS0FBSyxDQUFDLHVFQUF1RSxDQUFDLENBQUM7YUFDNUY7WUFFRCxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7WUFFckIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDcEQsQ0FBQztRQUVEOzs7O1dBSUc7UUFDSSw4QkFBVSxHQUFqQjtZQUNJLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUM7UUFDcEMsQ0FBQztRQUVEOztXQUVHO1FBQ0ksaUNBQWEsR0FBcEI7WUFDSSw0RUFBNEU7UUFDaEYsQ0FBQztRQWhJYSx3QkFBYyxHQUFXLGlCQUFpQixDQUFDO1FBRTNDLHlCQUFlLEdBQVcsa0JBQWtCLENBQUM7UUFFN0Msd0JBQWMsR0FBVyxpQkFBaUIsQ0FBQztRQUUzQyxxQkFBVyxHQUFXLGVBQWUsQ0FBQztRQUV0QyxvQkFBVSxHQUFXLGFBQWEsQ0FBQztRQUVuQyxxQkFBVyxHQUFXLG1CQUFtQixDQUFDO1FBRTFDLHNCQUFZLEdBQVcsZUFBZSxDQUFDO1FBRXZDLHVCQUFhLEdBQVcsZ0JBQWdCLENBQUM7UUFtSDNELGdCQUFDO0tBQUEsQ0FsSXNDLDRCQUFZLEdBa0lsRDtzQkFsSW9CLFNBQVMiLCJmaWxlIjoicGx1Z2luLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuIFx0XHR9XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3RcbiBcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3RcbiBcdC8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbiBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuIFx0XHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbiBcdFx0cmV0dXJuIG5zO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IFwiLi9zcmMvaW5kZXgudHNcIik7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBoYXMgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5XG4gICwgcHJlZml4ID0gJ34nO1xuXG4vKipcbiAqIENvbnN0cnVjdG9yIHRvIGNyZWF0ZSBhIHN0b3JhZ2UgZm9yIG91ciBgRUVgIG9iamVjdHMuXG4gKiBBbiBgRXZlbnRzYCBpbnN0YW5jZSBpcyBhIHBsYWluIG9iamVjdCB3aG9zZSBwcm9wZXJ0aWVzIGFyZSBldmVudCBuYW1lcy5cbiAqXG4gKiBAY29uc3RydWN0b3JcbiAqIEBwcml2YXRlXG4gKi9cbmZ1bmN0aW9uIEV2ZW50cygpIHt9XG5cbi8vXG4vLyBXZSB0cnkgdG8gbm90IGluaGVyaXQgZnJvbSBgT2JqZWN0LnByb3RvdHlwZWAuIEluIHNvbWUgZW5naW5lcyBjcmVhdGluZyBhblxuLy8gaW5zdGFuY2UgaW4gdGhpcyB3YXkgaXMgZmFzdGVyIHRoYW4gY2FsbGluZyBgT2JqZWN0LmNyZWF0ZShudWxsKWAgZGlyZWN0bHkuXG4vLyBJZiBgT2JqZWN0LmNyZWF0ZShudWxsKWAgaXMgbm90IHN1cHBvcnRlZCB3ZSBwcmVmaXggdGhlIGV2ZW50IG5hbWVzIHdpdGggYVxuLy8gY2hhcmFjdGVyIHRvIG1ha2Ugc3VyZSB0aGF0IHRoZSBidWlsdC1pbiBvYmplY3QgcHJvcGVydGllcyBhcmUgbm90XG4vLyBvdmVycmlkZGVuIG9yIHVzZWQgYXMgYW4gYXR0YWNrIHZlY3Rvci5cbi8vXG5pZiAoT2JqZWN0LmNyZWF0ZSkge1xuICBFdmVudHMucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcblxuICAvL1xuICAvLyBUaGlzIGhhY2sgaXMgbmVlZGVkIGJlY2F1c2UgdGhlIGBfX3Byb3RvX19gIHByb3BlcnR5IGlzIHN0aWxsIGluaGVyaXRlZCBpblxuICAvLyBzb21lIG9sZCBicm93c2VycyBsaWtlIEFuZHJvaWQgNCwgaVBob25lIDUuMSwgT3BlcmEgMTEgYW5kIFNhZmFyaSA1LlxuICAvL1xuICBpZiAoIW5ldyBFdmVudHMoKS5fX3Byb3RvX18pIHByZWZpeCA9IGZhbHNlO1xufVxuXG4vKipcbiAqIFJlcHJlc2VudGF0aW9uIG9mIGEgc2luZ2xlIGV2ZW50IGxpc3RlbmVyLlxuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuIFRoZSBsaXN0ZW5lciBmdW5jdGlvbi5cbiAqIEBwYXJhbSB7Kn0gY29udGV4dCBUaGUgY29udGV4dCB0byBpbnZva2UgdGhlIGxpc3RlbmVyIHdpdGguXG4gKiBAcGFyYW0ge0Jvb2xlYW59IFtvbmNlPWZhbHNlXSBTcGVjaWZ5IGlmIHRoZSBsaXN0ZW5lciBpcyBhIG9uZS10aW1lIGxpc3RlbmVyLlxuICogQGNvbnN0cnVjdG9yXG4gKiBAcHJpdmF0ZVxuICovXG5mdW5jdGlvbiBFRShmbiwgY29udGV4dCwgb25jZSkge1xuICB0aGlzLmZuID0gZm47XG4gIHRoaXMuY29udGV4dCA9IGNvbnRleHQ7XG4gIHRoaXMub25jZSA9IG9uY2UgfHwgZmFsc2U7XG59XG5cbi8qKlxuICogQWRkIGEgbGlzdGVuZXIgZm9yIGEgZ2l2ZW4gZXZlbnQuXG4gKlxuICogQHBhcmFtIHtFdmVudEVtaXR0ZXJ9IGVtaXR0ZXIgUmVmZXJlbmNlIHRvIHRoZSBgRXZlbnRFbWl0dGVyYCBpbnN0YW5jZS5cbiAqIEBwYXJhbSB7KFN0cmluZ3xTeW1ib2wpfSBldmVudCBUaGUgZXZlbnQgbmFtZS5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuIFRoZSBsaXN0ZW5lciBmdW5jdGlvbi5cbiAqIEBwYXJhbSB7Kn0gY29udGV4dCBUaGUgY29udGV4dCB0byBpbnZva2UgdGhlIGxpc3RlbmVyIHdpdGguXG4gKiBAcGFyYW0ge0Jvb2xlYW59IG9uY2UgU3BlY2lmeSBpZiB0aGUgbGlzdGVuZXIgaXMgYSBvbmUtdGltZSBsaXN0ZW5lci5cbiAqIEByZXR1cm5zIHtFdmVudEVtaXR0ZXJ9XG4gKiBAcHJpdmF0ZVxuICovXG5mdW5jdGlvbiBhZGRMaXN0ZW5lcihlbWl0dGVyLCBldmVudCwgZm4sIGNvbnRleHQsIG9uY2UpIHtcbiAgaWYgKHR5cGVvZiBmbiAhPT0gJ2Z1bmN0aW9uJykge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1RoZSBsaXN0ZW5lciBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcbiAgfVxuXG4gIHZhciBsaXN0ZW5lciA9IG5ldyBFRShmbiwgY29udGV4dCB8fCBlbWl0dGVyLCBvbmNlKVxuICAgICwgZXZ0ID0gcHJlZml4ID8gcHJlZml4ICsgZXZlbnQgOiBldmVudDtcblxuICBpZiAoIWVtaXR0ZXIuX2V2ZW50c1tldnRdKSBlbWl0dGVyLl9ldmVudHNbZXZ0XSA9IGxpc3RlbmVyLCBlbWl0dGVyLl9ldmVudHNDb3VudCsrO1xuICBlbHNlIGlmICghZW1pdHRlci5fZXZlbnRzW2V2dF0uZm4pIGVtaXR0ZXIuX2V2ZW50c1tldnRdLnB1c2gobGlzdGVuZXIpO1xuICBlbHNlIGVtaXR0ZXIuX2V2ZW50c1tldnRdID0gW2VtaXR0ZXIuX2V2ZW50c1tldnRdLCBsaXN0ZW5lcl07XG5cbiAgcmV0dXJuIGVtaXR0ZXI7XG59XG5cbi8qKlxuICogQ2xlYXIgZXZlbnQgYnkgbmFtZS5cbiAqXG4gKiBAcGFyYW0ge0V2ZW50RW1pdHRlcn0gZW1pdHRlciBSZWZlcmVuY2UgdG8gdGhlIGBFdmVudEVtaXR0ZXJgIGluc3RhbmNlLlxuICogQHBhcmFtIHsoU3RyaW5nfFN5bWJvbCl9IGV2dCBUaGUgRXZlbnQgbmFtZS5cbiAqIEBwcml2YXRlXG4gKi9cbmZ1bmN0aW9uIGNsZWFyRXZlbnQoZW1pdHRlciwgZXZ0KSB7XG4gIGlmICgtLWVtaXR0ZXIuX2V2ZW50c0NvdW50ID09PSAwKSBlbWl0dGVyLl9ldmVudHMgPSBuZXcgRXZlbnRzKCk7XG4gIGVsc2UgZGVsZXRlIGVtaXR0ZXIuX2V2ZW50c1tldnRdO1xufVxuXG4vKipcbiAqIE1pbmltYWwgYEV2ZW50RW1pdHRlcmAgaW50ZXJmYWNlIHRoYXQgaXMgbW9sZGVkIGFnYWluc3QgdGhlIE5vZGUuanNcbiAqIGBFdmVudEVtaXR0ZXJgIGludGVyZmFjZS5cbiAqXG4gKiBAY29uc3RydWN0b3JcbiAqIEBwdWJsaWNcbiAqL1xuZnVuY3Rpb24gRXZlbnRFbWl0dGVyKCkge1xuICB0aGlzLl9ldmVudHMgPSBuZXcgRXZlbnRzKCk7XG4gIHRoaXMuX2V2ZW50c0NvdW50ID0gMDtcbn1cblxuLyoqXG4gKiBSZXR1cm4gYW4gYXJyYXkgbGlzdGluZyB0aGUgZXZlbnRzIGZvciB3aGljaCB0aGUgZW1pdHRlciBoYXMgcmVnaXN0ZXJlZFxuICogbGlzdGVuZXJzLlxuICpcbiAqIEByZXR1cm5zIHtBcnJheX1cbiAqIEBwdWJsaWNcbiAqL1xuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5ldmVudE5hbWVzID0gZnVuY3Rpb24gZXZlbnROYW1lcygpIHtcbiAgdmFyIG5hbWVzID0gW11cbiAgICAsIGV2ZW50c1xuICAgICwgbmFtZTtcblxuICBpZiAodGhpcy5fZXZlbnRzQ291bnQgPT09IDApIHJldHVybiBuYW1lcztcblxuICBmb3IgKG5hbWUgaW4gKGV2ZW50cyA9IHRoaXMuX2V2ZW50cykpIHtcbiAgICBpZiAoaGFzLmNhbGwoZXZlbnRzLCBuYW1lKSkgbmFtZXMucHVzaChwcmVmaXggPyBuYW1lLnNsaWNlKDEpIDogbmFtZSk7XG4gIH1cblxuICBpZiAoT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scykge1xuICAgIHJldHVybiBuYW1lcy5jb25jYXQoT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyhldmVudHMpKTtcbiAgfVxuXG4gIHJldHVybiBuYW1lcztcbn07XG5cbi8qKlxuICogUmV0dXJuIHRoZSBsaXN0ZW5lcnMgcmVnaXN0ZXJlZCBmb3IgYSBnaXZlbiBldmVudC5cbiAqXG4gKiBAcGFyYW0geyhTdHJpbmd8U3ltYm9sKX0gZXZlbnQgVGhlIGV2ZW50IG5hbWUuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFRoZSByZWdpc3RlcmVkIGxpc3RlbmVycy5cbiAqIEBwdWJsaWNcbiAqL1xuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5saXN0ZW5lcnMgPSBmdW5jdGlvbiBsaXN0ZW5lcnMoZXZlbnQpIHtcbiAgdmFyIGV2dCA9IHByZWZpeCA/IHByZWZpeCArIGV2ZW50IDogZXZlbnRcbiAgICAsIGhhbmRsZXJzID0gdGhpcy5fZXZlbnRzW2V2dF07XG5cbiAgaWYgKCFoYW5kbGVycykgcmV0dXJuIFtdO1xuICBpZiAoaGFuZGxlcnMuZm4pIHJldHVybiBbaGFuZGxlcnMuZm5dO1xuXG4gIGZvciAodmFyIGkgPSAwLCBsID0gaGFuZGxlcnMubGVuZ3RoLCBlZSA9IG5ldyBBcnJheShsKTsgaSA8IGw7IGkrKykge1xuICAgIGVlW2ldID0gaGFuZGxlcnNbaV0uZm47XG4gIH1cblxuICByZXR1cm4gZWU7XG59O1xuXG4vKipcbiAqIFJldHVybiB0aGUgbnVtYmVyIG9mIGxpc3RlbmVycyBsaXN0ZW5pbmcgdG8gYSBnaXZlbiBldmVudC5cbiAqXG4gKiBAcGFyYW0geyhTdHJpbmd8U3ltYm9sKX0gZXZlbnQgVGhlIGV2ZW50IG5hbWUuXG4gKiBAcmV0dXJucyB7TnVtYmVyfSBUaGUgbnVtYmVyIG9mIGxpc3RlbmVycy5cbiAqIEBwdWJsaWNcbiAqL1xuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5saXN0ZW5lckNvdW50ID0gZnVuY3Rpb24gbGlzdGVuZXJDb3VudChldmVudCkge1xuICB2YXIgZXZ0ID0gcHJlZml4ID8gcHJlZml4ICsgZXZlbnQgOiBldmVudFxuICAgICwgbGlzdGVuZXJzID0gdGhpcy5fZXZlbnRzW2V2dF07XG5cbiAgaWYgKCFsaXN0ZW5lcnMpIHJldHVybiAwO1xuICBpZiAobGlzdGVuZXJzLmZuKSByZXR1cm4gMTtcbiAgcmV0dXJuIGxpc3RlbmVycy5sZW5ndGg7XG59O1xuXG4vKipcbiAqIENhbGxzIGVhY2ggb2YgdGhlIGxpc3RlbmVycyByZWdpc3RlcmVkIGZvciBhIGdpdmVuIGV2ZW50LlxuICpcbiAqIEBwYXJhbSB7KFN0cmluZ3xTeW1ib2wpfSBldmVudCBUaGUgZXZlbnQgbmFtZS5cbiAqIEByZXR1cm5zIHtCb29sZWFufSBgdHJ1ZWAgaWYgdGhlIGV2ZW50IGhhZCBsaXN0ZW5lcnMsIGVsc2UgYGZhbHNlYC5cbiAqIEBwdWJsaWNcbiAqL1xuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5lbWl0ID0gZnVuY3Rpb24gZW1pdChldmVudCwgYTEsIGEyLCBhMywgYTQsIGE1KSB7XG4gIHZhciBldnQgPSBwcmVmaXggPyBwcmVmaXggKyBldmVudCA6IGV2ZW50O1xuXG4gIGlmICghdGhpcy5fZXZlbnRzW2V2dF0pIHJldHVybiBmYWxzZTtcblxuICB2YXIgbGlzdGVuZXJzID0gdGhpcy5fZXZlbnRzW2V2dF1cbiAgICAsIGxlbiA9IGFyZ3VtZW50cy5sZW5ndGhcbiAgICAsIGFyZ3NcbiAgICAsIGk7XG5cbiAgaWYgKGxpc3RlbmVycy5mbikge1xuICAgIGlmIChsaXN0ZW5lcnMub25jZSkgdGhpcy5yZW1vdmVMaXN0ZW5lcihldmVudCwgbGlzdGVuZXJzLmZuLCB1bmRlZmluZWQsIHRydWUpO1xuXG4gICAgc3dpdGNoIChsZW4pIHtcbiAgICAgIGNhc2UgMTogcmV0dXJuIGxpc3RlbmVycy5mbi5jYWxsKGxpc3RlbmVycy5jb250ZXh0KSwgdHJ1ZTtcbiAgICAgIGNhc2UgMjogcmV0dXJuIGxpc3RlbmVycy5mbi5jYWxsKGxpc3RlbmVycy5jb250ZXh0LCBhMSksIHRydWU7XG4gICAgICBjYXNlIDM6IHJldHVybiBsaXN0ZW5lcnMuZm4uY2FsbChsaXN0ZW5lcnMuY29udGV4dCwgYTEsIGEyKSwgdHJ1ZTtcbiAgICAgIGNhc2UgNDogcmV0dXJuIGxpc3RlbmVycy5mbi5jYWxsKGxpc3RlbmVycy5jb250ZXh0LCBhMSwgYTIsIGEzKSwgdHJ1ZTtcbiAgICAgIGNhc2UgNTogcmV0dXJuIGxpc3RlbmVycy5mbi5jYWxsKGxpc3RlbmVycy5jb250ZXh0LCBhMSwgYTIsIGEzLCBhNCksIHRydWU7XG4gICAgICBjYXNlIDY6IHJldHVybiBsaXN0ZW5lcnMuZm4uY2FsbChsaXN0ZW5lcnMuY29udGV4dCwgYTEsIGEyLCBhMywgYTQsIGE1KSwgdHJ1ZTtcbiAgICB9XG5cbiAgICBmb3IgKGkgPSAxLCBhcmdzID0gbmV3IEFycmF5KGxlbiAtMSk7IGkgPCBsZW47IGkrKykge1xuICAgICAgYXJnc1tpIC0gMV0gPSBhcmd1bWVudHNbaV07XG4gICAgfVxuXG4gICAgbGlzdGVuZXJzLmZuLmFwcGx5KGxpc3RlbmVycy5jb250ZXh0LCBhcmdzKTtcbiAgfSBlbHNlIHtcbiAgICB2YXIgbGVuZ3RoID0gbGlzdGVuZXJzLmxlbmd0aFxuICAgICAgLCBqO1xuXG4gICAgZm9yIChpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAobGlzdGVuZXJzW2ldLm9uY2UpIHRoaXMucmVtb3ZlTGlzdGVuZXIoZXZlbnQsIGxpc3RlbmVyc1tpXS5mbiwgdW5kZWZpbmVkLCB0cnVlKTtcblxuICAgICAgc3dpdGNoIChsZW4pIHtcbiAgICAgICAgY2FzZSAxOiBsaXN0ZW5lcnNbaV0uZm4uY2FsbChsaXN0ZW5lcnNbaV0uY29udGV4dCk7IGJyZWFrO1xuICAgICAgICBjYXNlIDI6IGxpc3RlbmVyc1tpXS5mbi5jYWxsKGxpc3RlbmVyc1tpXS5jb250ZXh0LCBhMSk7IGJyZWFrO1xuICAgICAgICBjYXNlIDM6IGxpc3RlbmVyc1tpXS5mbi5jYWxsKGxpc3RlbmVyc1tpXS5jb250ZXh0LCBhMSwgYTIpOyBicmVhaztcbiAgICAgICAgY2FzZSA0OiBsaXN0ZW5lcnNbaV0uZm4uY2FsbChsaXN0ZW5lcnNbaV0uY29udGV4dCwgYTEsIGEyLCBhMyk7IGJyZWFrO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIGlmICghYXJncykgZm9yIChqID0gMSwgYXJncyA9IG5ldyBBcnJheShsZW4gLTEpOyBqIDwgbGVuOyBqKyspIHtcbiAgICAgICAgICAgIGFyZ3NbaiAtIDFdID0gYXJndW1lbnRzW2pdO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGxpc3RlbmVyc1tpXS5mbi5hcHBseShsaXN0ZW5lcnNbaV0uY29udGV4dCwgYXJncyk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRydWU7XG59O1xuXG4vKipcbiAqIEFkZCBhIGxpc3RlbmVyIGZvciBhIGdpdmVuIGV2ZW50LlxuICpcbiAqIEBwYXJhbSB7KFN0cmluZ3xTeW1ib2wpfSBldmVudCBUaGUgZXZlbnQgbmFtZS5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuIFRoZSBsaXN0ZW5lciBmdW5jdGlvbi5cbiAqIEBwYXJhbSB7Kn0gW2NvbnRleHQ9dGhpc10gVGhlIGNvbnRleHQgdG8gaW52b2tlIHRoZSBsaXN0ZW5lciB3aXRoLlxuICogQHJldHVybnMge0V2ZW50RW1pdHRlcn0gYHRoaXNgLlxuICogQHB1YmxpY1xuICovXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLm9uID0gZnVuY3Rpb24gb24oZXZlbnQsIGZuLCBjb250ZXh0KSB7XG4gIHJldHVybiBhZGRMaXN0ZW5lcih0aGlzLCBldmVudCwgZm4sIGNvbnRleHQsIGZhbHNlKTtcbn07XG5cbi8qKlxuICogQWRkIGEgb25lLXRpbWUgbGlzdGVuZXIgZm9yIGEgZ2l2ZW4gZXZlbnQuXG4gKlxuICogQHBhcmFtIHsoU3RyaW5nfFN5bWJvbCl9IGV2ZW50IFRoZSBldmVudCBuYW1lLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gVGhlIGxpc3RlbmVyIGZ1bmN0aW9uLlxuICogQHBhcmFtIHsqfSBbY29udGV4dD10aGlzXSBUaGUgY29udGV4dCB0byBpbnZva2UgdGhlIGxpc3RlbmVyIHdpdGguXG4gKiBAcmV0dXJucyB7RXZlbnRFbWl0dGVyfSBgdGhpc2AuXG4gKiBAcHVibGljXG4gKi9cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUub25jZSA9IGZ1bmN0aW9uIG9uY2UoZXZlbnQsIGZuLCBjb250ZXh0KSB7XG4gIHJldHVybiBhZGRMaXN0ZW5lcih0aGlzLCBldmVudCwgZm4sIGNvbnRleHQsIHRydWUpO1xufTtcblxuLyoqXG4gKiBSZW1vdmUgdGhlIGxpc3RlbmVycyBvZiBhIGdpdmVuIGV2ZW50LlxuICpcbiAqIEBwYXJhbSB7KFN0cmluZ3xTeW1ib2wpfSBldmVudCBUaGUgZXZlbnQgbmFtZS5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuIE9ubHkgcmVtb3ZlIHRoZSBsaXN0ZW5lcnMgdGhhdCBtYXRjaCB0aGlzIGZ1bmN0aW9uLlxuICogQHBhcmFtIHsqfSBjb250ZXh0IE9ubHkgcmVtb3ZlIHRoZSBsaXN0ZW5lcnMgdGhhdCBoYXZlIHRoaXMgY29udGV4dC5cbiAqIEBwYXJhbSB7Qm9vbGVhbn0gb25jZSBPbmx5IHJlbW92ZSBvbmUtdGltZSBsaXN0ZW5lcnMuXG4gKiBAcmV0dXJucyB7RXZlbnRFbWl0dGVyfSBgdGhpc2AuXG4gKiBAcHVibGljXG4gKi9cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUucmVtb3ZlTGlzdGVuZXIgPSBmdW5jdGlvbiByZW1vdmVMaXN0ZW5lcihldmVudCwgZm4sIGNvbnRleHQsIG9uY2UpIHtcbiAgdmFyIGV2dCA9IHByZWZpeCA/IHByZWZpeCArIGV2ZW50IDogZXZlbnQ7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHNbZXZ0XSkgcmV0dXJuIHRoaXM7XG4gIGlmICghZm4pIHtcbiAgICBjbGVhckV2ZW50KHRoaXMsIGV2dCk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICB2YXIgbGlzdGVuZXJzID0gdGhpcy5fZXZlbnRzW2V2dF07XG5cbiAgaWYgKGxpc3RlbmVycy5mbikge1xuICAgIGlmIChcbiAgICAgIGxpc3RlbmVycy5mbiA9PT0gZm4gJiZcbiAgICAgICghb25jZSB8fCBsaXN0ZW5lcnMub25jZSkgJiZcbiAgICAgICghY29udGV4dCB8fCBsaXN0ZW5lcnMuY29udGV4dCA9PT0gY29udGV4dClcbiAgICApIHtcbiAgICAgIGNsZWFyRXZlbnQodGhpcywgZXZ0KTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgZm9yICh2YXIgaSA9IDAsIGV2ZW50cyA9IFtdLCBsZW5ndGggPSBsaXN0ZW5lcnMubGVuZ3RoOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChcbiAgICAgICAgbGlzdGVuZXJzW2ldLmZuICE9PSBmbiB8fFxuICAgICAgICAob25jZSAmJiAhbGlzdGVuZXJzW2ldLm9uY2UpIHx8XG4gICAgICAgIChjb250ZXh0ICYmIGxpc3RlbmVyc1tpXS5jb250ZXh0ICE9PSBjb250ZXh0KVxuICAgICAgKSB7XG4gICAgICAgIGV2ZW50cy5wdXNoKGxpc3RlbmVyc1tpXSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy9cbiAgICAvLyBSZXNldCB0aGUgYXJyYXksIG9yIHJlbW92ZSBpdCBjb21wbGV0ZWx5IGlmIHdlIGhhdmUgbm8gbW9yZSBsaXN0ZW5lcnMuXG4gICAgLy9cbiAgICBpZiAoZXZlbnRzLmxlbmd0aCkgdGhpcy5fZXZlbnRzW2V2dF0gPSBldmVudHMubGVuZ3RoID09PSAxID8gZXZlbnRzWzBdIDogZXZlbnRzO1xuICAgIGVsc2UgY2xlYXJFdmVudCh0aGlzLCBldnQpO1xuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIFJlbW92ZSBhbGwgbGlzdGVuZXJzLCBvciB0aG9zZSBvZiB0aGUgc3BlY2lmaWVkIGV2ZW50LlxuICpcbiAqIEBwYXJhbSB7KFN0cmluZ3xTeW1ib2wpfSBbZXZlbnRdIFRoZSBldmVudCBuYW1lLlxuICogQHJldHVybnMge0V2ZW50RW1pdHRlcn0gYHRoaXNgLlxuICogQHB1YmxpY1xuICovXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUFsbExpc3RlbmVycyA9IGZ1bmN0aW9uIHJlbW92ZUFsbExpc3RlbmVycyhldmVudCkge1xuICB2YXIgZXZ0O1xuXG4gIGlmIChldmVudCkge1xuICAgIGV2dCA9IHByZWZpeCA/IHByZWZpeCArIGV2ZW50IDogZXZlbnQ7XG4gICAgaWYgKHRoaXMuX2V2ZW50c1tldnRdKSBjbGVhckV2ZW50KHRoaXMsIGV2dCk7XG4gIH0gZWxzZSB7XG4gICAgdGhpcy5fZXZlbnRzID0gbmV3IEV2ZW50cygpO1xuICAgIHRoaXMuX2V2ZW50c0NvdW50ID0gMDtcbiAgfVxuXG4gIHJldHVybiB0aGlzO1xufTtcblxuLy9cbi8vIEFsaWFzIG1ldGhvZHMgbmFtZXMgYmVjYXVzZSBwZW9wbGUgcm9sbCBsaWtlIHRoYXQuXG4vL1xuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5vZmYgPSBFdmVudEVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUxpc3RlbmVyO1xuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5hZGRMaXN0ZW5lciA9IEV2ZW50RW1pdHRlci5wcm90b3R5cGUub247XG5cbi8vXG4vLyBFeHBvc2UgdGhlIHByZWZpeC5cbi8vXG5FdmVudEVtaXR0ZXIucHJlZml4ZWQgPSBwcmVmaXg7XG5cbi8vXG4vLyBBbGxvdyBgRXZlbnRFbWl0dGVyYCB0byBiZSBpbXBvcnRlZCBhcyBtb2R1bGUgbmFtZXNwYWNlLlxuLy9cbkV2ZW50RW1pdHRlci5FdmVudEVtaXR0ZXIgPSBFdmVudEVtaXR0ZXI7XG5cbi8vXG4vLyBFeHBvc2UgdGhlIG1vZHVsZS5cbi8vXG5pZiAoJ3VuZGVmaW5lZCcgIT09IHR5cGVvZiBtb2R1bGUpIHtcbiAgbW9kdWxlLmV4cG9ydHMgPSBFdmVudEVtaXR0ZXI7XG59XG4iLCJpbXBvcnQge0lQcm92aWRlcn0gZnJvbSAnLi9JUHJvdmlkZXInO1xuaW1wb3J0IFBoYXNlckFkcyBmcm9tICcuLi9pbmRleCc7XG5cbmV4cG9ydCBlbnVtIENvY29vblByb3ZpZGVyIHtcbiAgICBBZE1vYixcbiAgICBNb1B1YixcbiAgICBDaGFydGJvb3N0LFxuICAgIEhleXphcFxufVxuXG5leHBvcnQgZW51bSBDb2Nvb25BZFR5cGUge1xuICAgIGJhbm5lcixcbiAgICBpbnRlcnN0aXRpYWwsXG4gICAgaW5zZW50aXZlXG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENvY29vbkFkcyBpbXBsZW1lbnRzIElQcm92aWRlciB7XG4gICAgcHVibGljIGFkTWFuYWdlcjogUGhhc2VyQWRzO1xuXG4gICAgcHVibGljIGFkc0VuYWJsZWQ6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAgIHByaXZhdGUgY29jb29uUHJvdmlkZXI6IENvY29vbi5BZC5JQWRQcm92aWRlcjtcblxuICAgIHByaXZhdGUgYmFubmVyOiBDb2Nvb24uQWQuSUJhbm5lciA9IG51bGw7XG5cbiAgICBwcml2YXRlIGJhbm5lclNob3dhYmxlOiBib29sZWFuID0gZmFsc2U7XG5cbiAgICBwcml2YXRlIGludGVyc3RpdGlhbDogQ29jb29uLkFkLklCYW5uZXIgPSBudWxsO1xuXG4gICAgcHJpdmF0ZSBpbnRlcnN0aXRpYWxTaG93YWJsZTogYm9vbGVhbiA9IGZhbHNlO1xuXG4gICAgcHJpdmF0ZSBpbnNlbnRpdmU6IENvY29vbi5BZC5JQmFubmVyID0gbnVsbDtcblxuICAgIHByaXZhdGUgaW5zZW50aXZlU2hvd2FibGU6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAgIGNvbnN0cnVjdG9yKHByb3ZpZGVyOiBDb2Nvb25Qcm92aWRlciwgY29uZmlnPzogYW55KSB7XG4gICAgICAgIC8vVE9ETzogQWRkIGNvcmRvdmEgY2hlY2tcbiAgICAgICAgaWYgKENvY29vbiAmJiBDb2Nvb24uQWQpIHtcbiAgICAgICAgICAgIHRoaXMuYWRzRW5hYmxlZCA9IHRydWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBzd2l0Y2ggKHByb3ZpZGVyKSB7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgY2FzZSBDb2Nvb25Qcm92aWRlci5BZE1vYjpcbiAgICAgICAgICAgICAgICB0aGlzLmNvY29vblByb3ZpZGVyID0gQ29jb29uLkFkLkFkTW9iO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBDb2Nvb25Qcm92aWRlci5DaGFydGJvb3N0OlxuICAgICAgICAgICAgICAgIHRoaXMuY29jb29uUHJvdmlkZXIgPSBDb2Nvb24uQWQuQ2hhcnRib29zdDtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgQ29jb29uUHJvdmlkZXIuSGV5emFwOlxuICAgICAgICAgICAgICAgIHRoaXMuY29jb29uUHJvdmlkZXIgPSBDb2Nvb24uQWQuSGV5emFwO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBDb2Nvb25Qcm92aWRlci5Nb1B1YjpcbiAgICAgICAgICAgICAgICB0aGlzLmNvY29vblByb3ZpZGVyID0gQ29jb29uLkFkLk1vUHViO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5jb2Nvb25Qcm92aWRlci5jb25maWd1cmUoY29uZmlnKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgc2V0TWFuYWdlcihtYW5hZ2VyOiBQaGFzZXJBZHMpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5hZE1hbmFnZXIgPSBtYW5hZ2VyO1xuICAgIH1cblxuICAgIHB1YmxpYyBzaG93QWQoYWRUeXBlOiBDb2Nvb25BZFR5cGUpOiB2b2lkIHtcbiAgICAgICAgaWYgKCF0aGlzLmFkc0VuYWJsZWQpIHtcbiAgICAgICAgICAgIHRoaXMuYWRNYW5hZ2VyLnVuTXV0ZUFmdGVyQWQoKTtcbiAgICAgICAgICAgIGlmICghKGFkVHlwZSA9PT0gQ29jb29uQWRUeXBlLmJhbm5lcikpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmFkTWFuYWdlci5lbWl0KFBoYXNlckFkcy5DT05URU5UX1JFU1VNRUQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGFkVHlwZSA9PT0gQ29jb29uQWRUeXBlLmJhbm5lcikge1xuICAgICAgICAgICAgaWYgKCF0aGlzLmJhbm5lclNob3dhYmxlIHx8IG51bGwgPT09IHRoaXMuYmFubmVyKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5hZE1hbmFnZXIudW5NdXRlQWZ0ZXJBZCgpO1xuICAgICAgICAgICAgICAgIC8vTm8gYmFubmVyIGFkIGF2YWlsYWJsZSwgc2tpcHBpbmdcbiAgICAgICAgICAgICAgICAvL3RoaXMuYWRNYW5hZ2VyLm9uQ29udGVudFJlc3VtZWQuZGlzcGF0Y2goQ29jb29uQWRUeXBlLmJhbm5lcik7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5hZE1hbmFnZXIuZW1pdChQaGFzZXJBZHMuQkFOTkVSX1NIT1dOLCB0aGlzLmJhbm5lci53aWR0aCwgdGhpcy5iYW5uZXIuaGVpZ2h0KTtcblxuICAgICAgICAgICAgdGhpcy5hZE1hbmFnZXIuYmFubmVyQWN0aXZlID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMuYmFubmVyLnNob3coKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChhZFR5cGUgPT09IENvY29vbkFkVHlwZS5pbnRlcnN0aXRpYWwpIHtcbiAgICAgICAgICAgIGlmICghdGhpcy5pbnRlcnN0aXRpYWxTaG93YWJsZSB8fCBudWxsID09PSB0aGlzLmludGVyc3RpdGlhbCkge1xuICAgICAgICAgICAgICAgIHRoaXMuYWRNYW5hZ2VyLnVuTXV0ZUFmdGVyQWQoKTtcbiAgICAgICAgICAgICAgICAvL05vIGJhbm5lciBhZCBhdmFpbGFibGUsIHNraXBwaW5nXG4gICAgICAgICAgICAgICAgdGhpcy5hZE1hbmFnZXIuZW1pdChQaGFzZXJBZHMuQ09OVEVOVF9SRVNVTUVELCBDb2Nvb25BZFR5cGUuaW50ZXJzdGl0aWFsKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuaW50ZXJzdGl0aWFsLnNob3coKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChhZFR5cGUgPT09IENvY29vbkFkVHlwZS5pbnNlbnRpdmUpIHtcbiAgICAgICAgICAgIGlmICghdGhpcy5pbnNlbnRpdmVTaG93YWJsZSB8fCBudWxsID09PSB0aGlzLmluc2VudGl2ZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuYWRNYW5hZ2VyLnVuTXV0ZUFmdGVyQWQoKTtcbiAgICAgICAgICAgICAgICAvL05vIGJhbm5lciBhZCBhdmFpbGFibGUsIHNraXBwaW5nXG4gICAgICAgICAgICAgICAgdGhpcy5hZE1hbmFnZXIuZW1pdChQaGFzZXJBZHMuQ09OVEVOVF9SRVNVTUVELCBDb2Nvb25BZFR5cGUuaW5zZW50aXZlKTtcblxuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5pbnNlbnRpdmUuc2hvdygpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIHByZWxvYWRBZChhZFR5cGU6IENvY29vbkFkVHlwZSwgYWRJZD86IHN0cmluZywgYmFubmVyUG9zaXRpb24/OiBzdHJpbmcpOiB2b2lkIHtcbiAgICAgICAgaWYgKCF0aGlzLmFkc0VuYWJsZWQpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vU29tZSBjbGVhbnVwIGJlZm9yZSBwcmVsb2FkaW5nIGEgbmV3IGFkXG4gICAgICAgIHRoaXMuZGVzdHJveUFkKGFkVHlwZSk7XG5cbiAgICAgICAgaWYgKGFkVHlwZSA9PT0gQ29jb29uQWRUeXBlLmJhbm5lcikge1xuICAgICAgICAgICAgdGhpcy5iYW5uZXIgPSB0aGlzLmNvY29vblByb3ZpZGVyLmNyZWF0ZUJhbm5lcihhZElkKTtcbiAgICAgICAgICAgIGlmIChiYW5uZXJQb3NpdGlvbikge1xuICAgICAgICAgICAgICAgIHRoaXMuYmFubmVyLnNldExheW91dChiYW5uZXJQb3NpdGlvbik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmJhbm5lci5vbignbG9hZCcsICgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmJhbm5lclNob3dhYmxlID0gdHJ1ZTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5iYW5uZXIub24oJ2ZhaWwnLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5iYW5uZXJTaG93YWJsZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHRoaXMuYmFubmVyID0gbnVsbDtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5iYW5uZXIub24oJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgIHRoaXMuYWRNYW5hZ2VyLmVtaXQoUGhhc2VyQWRzLkFEX0NMSUNLRUQsIENvY29vbkFkVHlwZS5iYW5uZXIpO1xuXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLy9CYW5uZXIgZG9uJ3QgcGF1c2Ugb3IgcmVzdW1lIGNvbnRlbnRcbiAgICAgICAgICAgIHRoaXMuYmFubmVyLm9uKCdzaG93JywgKCkgPT4ge1xuICAgICAgICAgICAgICAgIC8qdGhpcy5hZE1hbmFnZXIub25CYW5uZXJTaG93bi5kaXNwYXRjaCh0aGlzLmJhbm5lci53aWR0aCwgdGhpcy5iYW5uZXIuaGVpZ2h0KTtcbiAgICAgICAgICAgICAgICAgdGhpcy5hZE1hbmFnZXIuYmFubmVyQWN0aXZlID0gdHJ1ZTsqL1xuICAgICAgICAgICAgICAgIC8vIHRoaXMuYWRNYW5hZ2VyLm9uQ29udGVudFBhdXNlZC5kaXNwYXRjaChDb2Nvb25BZFR5cGUuYmFubmVyKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB0aGlzLmJhbm5lci5vbignZGlzbWlzcycsICgpID0+IHtcbiAgICAgICAgICAgICAgICAvKnRoaXMuYWRNYW5hZ2VyLmJhbm5lckFjdGl2ZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICB0aGlzLmFkTWFuYWdlci5vbkJhbm5lckhpZGRlbi5kaXNwYXRjaCh0aGlzLmJhbm5lci53aWR0aCwgdGhpcy5iYW5uZXIuaGVpZ2h0KTsqL1xuICAgICAgICAgICAgICAgIC8vIHRoaXMuYWRNYW5hZ2VyLm9uQ29udGVudFJlc3VtZWQuZGlzcGF0Y2goQ29jb29uQWRUeXBlLmJhbm5lcik7XG4gICAgICAgICAgICAgICAgLy8gdGhpcy5iYW5uZXJTaG93YWJsZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIC8vIHRoaXMuYmFubmVyID0gbnVsbDtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5iYW5uZXIubG9hZCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGFkVHlwZSA9PT0gQ29jb29uQWRUeXBlLmludGVyc3RpdGlhbCkge1xuICAgICAgICAgICAgdGhpcy5pbnRlcnN0aXRpYWwgPSB0aGlzLmNvY29vblByb3ZpZGVyLmNyZWF0ZUludGVyc3RpdGlhbChhZElkKTtcbiAgICAgICAgICAgIHRoaXMuaW50ZXJzdGl0aWFsLm9uKCdsb2FkJywgKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuaW50ZXJzdGl0aWFsU2hvd2FibGUgPSB0cnVlO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLmludGVyc3RpdGlhbC5vbignZmFpbCcsICgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmludGVyc3RpdGlhbFNob3dhYmxlID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgdGhpcy5pbnRlcnN0aXRpYWwgPSBudWxsO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLmludGVyc3RpdGlhbC5vbignY2xpY2snLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5hZE1hbmFnZXIuZW1pdChQaGFzZXJBZHMuQURfQ0xJQ0tFRCwgQ29jb29uQWRUeXBlLmludGVyc3RpdGlhbCk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdGhpcy5pbnRlcnN0aXRpYWwub24oJ3Nob3cnLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5hZE1hbmFnZXIuZW1pdChQaGFzZXJBZHMuQ09OVEVOVF9QQVVTRUQsIENvY29vbkFkVHlwZS5pbnRlcnN0aXRpYWwpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHRoaXMuaW50ZXJzdGl0aWFsLm9uKCdkaXNtaXNzJywgKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuYWRNYW5hZ2VyLnVuTXV0ZUFmdGVyQWQoKTtcbiAgICAgICAgICAgICAgICB0aGlzLmFkTWFuYWdlci5lbWl0KFBoYXNlckFkcy5DT05URU5UX1JFU1VNRUQsIENvY29vbkFkVHlwZS5pbnRlcnN0aXRpYWwpO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5pbnRlcnN0aXRpYWxTaG93YWJsZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHRoaXMuaW50ZXJzdGl0aWFsID0gbnVsbDtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5pbnRlcnN0aXRpYWwubG9hZCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGFkVHlwZSA9PT0gQ29jb29uQWRUeXBlLmluc2VudGl2ZSkge1xuICAgICAgICAgICAgdGhpcy5pbnNlbnRpdmUgPSB0aGlzLmNvY29vblByb3ZpZGVyLmNyZWF0ZVJld2FyZGVkVmlkZW8oYWRJZCk7XG4gICAgICAgICAgICB0aGlzLmluc2VudGl2ZS5vbignbG9hZCcsICgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmluc2VudGl2ZVNob3dhYmxlID0gdHJ1ZTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5pbnNlbnRpdmUub24oJ2ZhaWwnLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5pbnNlbnRpdmVTaG93YWJsZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHRoaXMuaW5zZW50aXZlID0gbnVsbDtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5pbnNlbnRpdmUub24oJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuYWRNYW5hZ2VyLmVtaXQoUGhhc2VyQWRzLkFEX0NMSUNLRUQsIENvY29vbkFkVHlwZS5pbnNlbnRpdmUpO1xuXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdGhpcy5pbnNlbnRpdmUub24oJ3Nob3cnLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5hZE1hbmFnZXIuZW1pdChQaGFzZXJBZHMuQ09OVEVOVF9QQVVTRUQsIENvY29vbkFkVHlwZS5pbnNlbnRpdmUpO1xuXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdGhpcy5pbnNlbnRpdmUub24oJ2Rpc21pc3MnLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5hZE1hbmFnZXIudW5NdXRlQWZ0ZXJBZCgpO1xuICAgICAgICAgICAgICAgIHRoaXMuYWRNYW5hZ2VyLmVtaXQoUGhhc2VyQWRzLkNPTlRFTlRfUkVTVU1FRCwgQ29jb29uQWRUeXBlLmluc2VudGl2ZSk7XG4gICAgICAgICAgICAgICAgdGhpcy5pbnNlbnRpdmVTaG93YWJsZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHRoaXMuaW5zZW50aXZlID0gbnVsbDtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB0aGlzLmluc2VudGl2ZS5vbigncmV3YXJkJywgKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuYWRNYW5hZ2VyLnVuTXV0ZUFmdGVyQWQoKTtcbiAgICAgICAgICAgICAgICB0aGlzLmFkTWFuYWdlci5lbWl0KFBoYXNlckFkcy5BRF9SRVdBUkRFRCwgQ29jb29uQWRUeXBlLmluc2VudGl2ZSk7XG4gICAgICAgICAgICAgICAgdGhpcy5pbnNlbnRpdmVTaG93YWJsZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHRoaXMuaW5zZW50aXZlID0gbnVsbDtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5pbnNlbnRpdmUubG9hZCgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIGRlc3Ryb3lBZChhZFR5cGU6IENvY29vbkFkVHlwZSk6IHZvaWQge1xuICAgICAgICBpZiAoIXRoaXMuYWRzRW5hYmxlZCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGFkVHlwZSA9PT0gQ29jb29uQWRUeXBlLmJhbm5lciAmJiBudWxsICE9PSB0aGlzLmJhbm5lcikge1xuICAgICAgICAgICAgLy9SZWxlYXNpbmcgYmFubmVycyB3aWxsIGZhaWwgb24gY29jb29uIGR1ZSB0bzpcbiAgICAgICAgICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9sdWRlaS9hdG9taWMtcGx1Z2lucy1hZHMvcHVsbC8xMlxuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICB0aGlzLmNvY29vblByb3ZpZGVyLnJlbGVhc2VCYW5uZXIodGhpcy5iYW5uZXIpO1xuICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgIC8vc2lsZW50bHkgaWdub3JlXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmJhbm5lciA9IG51bGw7XG4gICAgICAgICAgICB0aGlzLmJhbm5lclNob3dhYmxlID0gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoYWRUeXBlID09PSBDb2Nvb25BZFR5cGUuaW50ZXJzdGl0aWFsICYmIG51bGwgIT09IHRoaXMuaW50ZXJzdGl0aWFsKSB7XG4gICAgICAgICAgICB0aGlzLmNvY29vblByb3ZpZGVyLnJlbGVhc2VJbnRlcnN0aXRpYWwodGhpcy5pbnRlcnN0aXRpYWwpO1xuICAgICAgICAgICAgdGhpcy5pbnRlcnN0aXRpYWwgPSBudWxsO1xuICAgICAgICAgICAgdGhpcy5pbnRlcnN0aXRpYWxTaG93YWJsZSA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIGhpZGVBZChhZFR5cGU6IENvY29vbkFkVHlwZSk6IHZvaWQge1xuICAgICAgICBpZiAoIXRoaXMuYWRzRW5hYmxlZCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGFkVHlwZSA9PT0gQ29jb29uQWRUeXBlLmludGVyc3RpdGlhbCAmJiBudWxsICE9PSB0aGlzLmludGVyc3RpdGlhbCkge1xuICAgICAgICAgICAgdGhpcy5pbnRlcnN0aXRpYWwuaGlkZSgpO1xuXG4gICAgICAgICAgICAvLyB0aGlzLmFkTWFuYWdlci5vbkNvbnRlbnRSZXN1bWVkLmRpc3BhdGNoKENvY29vbkFkVHlwZS5pbnRlcnN0aXRpYWwpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGFkVHlwZSA9PT0gQ29jb29uQWRUeXBlLmJhbm5lciAmJiBudWxsICE9PSB0aGlzLmJhbm5lcikge1xuICAgICAgICAgICAgaWYgKHRoaXMuYWRNYW5hZ2VyLmJhbm5lckFjdGl2ZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuYWRNYW5hZ2VyLmJhbm5lckFjdGl2ZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHRoaXMuYWRNYW5hZ2VyLmVtaXQoUGhhc2VyQWRzLkJBTk5FUl9ISURERU4sIHRoaXMuYmFubmVyLndpZHRoLCB0aGlzLmJhbm5lci5oZWlnaHQpO1xuXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmJhbm5lci5oaWRlKCk7XG5cbiAgICAgICAgICAgIC8vIHRoaXMuYWRNYW5hZ2VyLm9uQ29udGVudFJlc3VtZWQuZGlzcGF0Y2goQ29jb29uQWRUeXBlLmJhbm5lcik7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoYWRUeXBlID09PSBDb2Nvb25BZFR5cGUuaW5zZW50aXZlICYmIG51bGwgIT09IHRoaXMuaW5zZW50aXZlKSB7XG4gICAgICAgICAgICB0aGlzLmluc2VudGl2ZS5oaWRlKCk7XG5cbiAgICAgICAgICAgIC8vIHRoaXMuYWRNYW5hZ2VyLm9uQ29udGVudFJlc3VtZWQuZGlzcGF0Y2goQ29jb29uQWRUeXBlLmluc2VudGl2ZSk7XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCJpbXBvcnQge0lQcm92aWRlcn0gZnJvbSAnLi9JUHJvdmlkZXInO1xuaW1wb3J0IFBoYXNlckFkcyBmcm9tICcuLi9pbmRleCc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENvcmRvdmFHYW1lRGlzdHJpYnV0aW9uIGltcGxlbWVudHMgSVByb3ZpZGVyIHtcbiAgICBwdWJsaWMgYWRNYW5hZ2VyOiBQaGFzZXJBZHM7XG5cbiAgICBwdWJsaWMgYWRzRW5hYmxlZDogYm9vbGVhbiA9IGZhbHNlO1xuXG4gICAgY29uc3RydWN0b3IoZ2FtZUlkOiBzdHJpbmcsIHVzZXJJZDogc3RyaW5nLCBkZWJ1ZzogYm9vbGVhbiA9IGZhbHNlKSB7XG4gICAgICAgIGlmIChjb3Jkb3ZhLnBsdWdpbnMgPT09IHVuZGVmaW5lZCB8fFxuICAgICAgICAgICAgKGNvcmRvdmEucGx1Z2lucyAhPT0gdW5kZWZpbmVkICYmIGNvcmRvdmEucGx1Z2lucy5nZEFwaSA9PT0gdW5kZWZpbmVkKVxuICAgICAgICApIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdnZEFwaSBub3QgYXZhaWxhYmxlIScpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGRlYnVnKSB7XG4gICAgICAgICAgICBjb3Jkb3ZhLnBsdWdpbnMuZ2RBcGkuZW5hYmxlVGVzdEFkcygpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5zZXRBZExpc3RlbmVycygpO1xuICAgICAgICAoPENvcmRvdmFQbHVnaW5HZEFwaT5jb3Jkb3ZhLnBsdWdpbnMuZ2RBcGkpLmluaXQoW1xuICAgICAgICAgICAgZ2FtZUlkLFxuICAgICAgICAgICAgdXNlcklkXG4gICAgICAgIF0sIChkYXRhOiBhbnkpID0+IHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdBUEkgaW5pdCBzdWNjZXNzIScsIGRhdGEpO1xuICAgICAgICB9LCAoZXJyb3I6IGFueSkgPT4ge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ0FQSSBpbml0IGVycm9yIScsIGVycm9yKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzZXRBZExpc3RlbmVycygpOiB2b2lkIHtcbiAgICAgICAgKDxDb3Jkb3ZhUGx1Z2luR2RBcGk+Y29yZG92YS5wbHVnaW5zLmdkQXBpKS5zZXRBZExpc3RlbmVyKChkYXRhOiBhbnkpID0+IHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdiYW5uZXIgcmVwbHksIGRhdGEuZXZlbnQnLCBkYXRhLmV2ZW50LCBkYXRhKTtcbiAgICAgICAgICAgIHN3aXRjaCAoZGF0YS5ldmVudCkge1xuICAgICAgICAgICAgICAgIGNhc2UgJ0JBTk5FUl9TVEFSVEVEJzpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hZE1hbmFnZXIuZW1pdChQaGFzZXJBZHMuQ09OVEVOVF9QQVVTRUQpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICdBUElfSVNfUkVBRFknOlxuICAgICAgICAgICAgICAgICAgICAvL1NlbmQgcG9zdCBpbml0XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYWRzRW5hYmxlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ0FQSV9BTFJFQURZX0lOSVRJQUxJWkVEJzpcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnQkFOTkVSX0NMT1NFRCc6XG4gICAgICAgICAgICAgICAgY2FzZSAnQVBJX05PVF9SRUFEWSc6XG4gICAgICAgICAgICAgICAgY2FzZSAnQkFOTkVSX0ZBSUxFRCc6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYWRNYW5hZ2VyLmVtaXQoUGhhc2VyQWRzLkNPTlRFTlRfUkVTVU1FRCk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LCAoZXJyb3I6IGFueSkgPT4ge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ1NldCBsaXN0ZW5lciBlcnJvcjonLCBlcnJvcik7XG4gICAgICAgICAgICB0aGlzLmFkc0VuYWJsZWQgPSBmYWxzZTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHVibGljIHNldE1hbmFnZXIobWFuYWdlcjogUGhhc2VyQWRzKTogdm9pZCB7XG4gICAgICAgIHRoaXMuYWRNYW5hZ2VyID0gbWFuYWdlcjtcbiAgICB9XG5cbiAgICBwdWJsaWMgc2hvd0FkKCk6IHZvaWQge1xuICAgICAgICBpZiAodGhpcy5hZHNFbmFibGVkKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnc2hvdyBiYW5uZXIgY2FsbGVkJyk7XG4gICAgICAgICAgICAoPENvcmRvdmFQbHVnaW5HZEFwaT5jb3Jkb3ZhLnBsdWdpbnMuZ2RBcGkpLnNob3dCYW5uZXIoKGRhdGE6IGFueSkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdTaG93IGJhbm5lciB3b3JrZWQnLCBkYXRhKTtcbiAgICAgICAgICAgIH0sIChkYXRhOiBhbnkpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnQ291bGQgbm90IHNob3cgYmFubmVyOicsIGRhdGEpO1xuICAgICAgICAgICAgICAgIHRoaXMuYWRNYW5hZ2VyLmVtaXQoUGhhc2VyQWRzLkNPTlRFTlRfUkVTVU1FRCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdBZHMgbm90IGVuYWJsZWQsIHJlc3VtaW5nJyk7XG4gICAgICAgICAgICB0aGlzLmFkTWFuYWdlci5lbWl0KFBoYXNlckFkcy5DT05URU5UX1JFU1VNRUQpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy9Eb2VzIG5vdGhpbmcsIGJ1dCBuZWVkZWQgZm9yIFByb3ZpZGVyIGludGVyZmFjZVxuICAgIHB1YmxpYyBwcmVsb2FkQWQoKTogdm9pZCB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvL0RvZXMgbm90aGluZywgYnV0IG5lZWRlZCBmb3IgUHJvdmlkZXIgaW50ZXJmYWNlXG4gICAgcHVibGljIGRlc3Ryb3lBZCgpOiB2b2lkIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vRG9lcyBub3RoaW5nLCBidXQgbmVlZGVkIGZvciBQcm92aWRlciBpbnRlcmZhY2VcbiAgICBwdWJsaWMgaGlkZUFkKCk6IHZvaWQge1xuICAgICAgICByZXR1cm47XG4gICAgfVxufVxuIiwiaW1wb3J0IHtJUHJvdmlkZXJ9IGZyb20gJy4vSVByb3ZpZGVyJztcbmltcG9ydCBQaGFzZXJBZHMgZnJvbSAnLi4vaW5kZXgnO1xuZXhwb3J0IGVudW0gSGV5emFwQWRUeXBlcyB7XG4gICAgSW50ZXJzdGl0aWFsLFxuICAgIFZpZGVvLFxuICAgIFJld2FyZGVkLFxuICAgIEJhbm5lclxufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb3Jkb3ZhSGV5emFwIGltcGxlbWVudHMgSVByb3ZpZGVyIHtcbiAgICBwdWJsaWMgYWRNYW5hZ2VyOiBQaGFzZXJBZHM7XG5cbiAgICBwdWJsaWMgYWRzRW5hYmxlZDogYm9vbGVhbiA9IGZhbHNlO1xuXG4gICAgY29uc3RydWN0b3IocHVibGlzaGVySWQ6IHN0cmluZykge1xuICAgICAgICAvL1RPRE86IEFkZCBjb3Jkb3ZhIGNoZWNrXG4gICAgICAgIGlmICh0cnVlKSB7XG4gICAgICAgICAgICB0aGlzLmFkc0VuYWJsZWQgPSB0cnVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgSGV5emFwQWRzLnN0YXJ0KHB1Ymxpc2hlcklkKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIC8vIE5hdGl2ZSBjYWxsIHN1Y2Nlc3NmdWwuXG4gICAgICAgIH0sIChlcnJvcjogYW55KSA9PiB7XG4gICAgICAgICAgICAvL0ZhaWxlZCB0byBzdGFydCBoZXl6YXAsIGRpc2FibGluZyBhZHNcbiAgICAgICAgICAgIHRoaXMuYWRzRW5hYmxlZCA9IGZhbHNlO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwdWJsaWMgc2V0TWFuYWdlcihtYW5hZ2VyOiBQaGFzZXJBZHMpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5hZE1hbmFnZXIgPSBtYW5hZ2VyO1xuICAgIH1cblxuICAgIHB1YmxpYyBzaG93QWQoYWRUeXBlOiBIZXl6YXBBZFR5cGVzLCBiYW5uZXJBZFBvc2l0aW9ucz86IHN0cmluZyk6IHZvaWQge1xuICAgICAgICBpZiAoIXRoaXMuYWRzRW5hYmxlZCkge1xuICAgICAgICAgICAgdGhpcy5hZE1hbmFnZXIudW5NdXRlQWZ0ZXJBZCgpO1xuICAgICAgICAgICAgdGhpcy5hZE1hbmFnZXIuZW1pdChQaGFzZXJBZHMuQ09OVEVOVF9SRVNVTUVEKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHN3aXRjaCAoYWRUeXBlKSB7XG4gICAgICAgICAgICBjYXNlIEhleXphcEFkVHlwZXMuSW50ZXJzdGl0aWFsOlxuICAgICAgICAgICAgICAgIC8vUmVnaXN0ZXIgZXZlbnQgbGlzdGVuZXJzXG4gICAgICAgICAgICAgICAgSGV5emFwQWRzLkludGVyc3RpdGlhbEFkLmFkZEV2ZW50TGlzdGVuZXIoSGV5emFwQWRzLkludGVyc3RpdGlhbEFkLkV2ZW50cy5ISURFLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYWRNYW5hZ2VyLnVuTXV0ZUFmdGVyQWQoKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hZE1hbmFnZXIuZW1pdChQaGFzZXJBZHMuQ09OVEVOVF9SRVNVTUVELCBIZXl6YXBBZHMuSW50ZXJzdGl0aWFsQWQuRXZlbnRzLkhJREUpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIEhleXphcEFkcy5JbnRlcnN0aXRpYWxBZC5hZGRFdmVudExpc3RlbmVyKEhleXphcEFkcy5JbnRlcnN0aXRpYWxBZC5FdmVudHMuU0hPV19GQUlMRUQsICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hZE1hbmFnZXIudW5NdXRlQWZ0ZXJBZCgpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmFkTWFuYWdlci5lbWl0KFBoYXNlckFkcy5DT05URU5UX1JFU1VNRUQsIEhleXphcEFkcy5JbnRlcnN0aXRpYWxBZC5FdmVudHMuU0hPV19GQUlMRUQpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIEhleXphcEFkcy5JbnRlcnN0aXRpYWxBZC5hZGRFdmVudExpc3RlbmVyKEhleXphcEFkcy5JbnRlcnN0aXRpYWxBZC5FdmVudHMuQ0xJQ0tFRCwgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmFkTWFuYWdlci5lbWl0KFBoYXNlckFkcy5BRF9DTElDS0VELCBIZXl6YXBBZHMuSW50ZXJzdGl0aWFsQWQuRXZlbnRzLkNMSUNLRUQpO1xuXG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICBIZXl6YXBBZHMuSW50ZXJzdGl0aWFsQWQuc2hvdygpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAvLyBOYXRpdmUgY2FsbCBzdWNjZXNzZnVsLlxuICAgICAgICAgICAgICAgICAgICB0aGlzLmFkTWFuYWdlci5lbWl0KFBoYXNlckFkcy5DT05URU5UX1BBVVNFRCk7XG4gICAgICAgICAgICAgICAgfSwgKGVycm9yOiBhbnkpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hZE1hbmFnZXIudW5NdXRlQWZ0ZXJBZCgpO1xuICAgICAgICAgICAgICAgICAgICAvL0ZhaWxlZCB0byBzaG93IGluc2VudGl2ZSBhZCwgY29udGludWUgb3BlcmF0aW9uc1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmFkTWFuYWdlci5lbWl0KFBoYXNlckFkcy5DT05URU5UX1JFU1VNRUQpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBIZXl6YXBBZFR5cGVzLlZpZGVvOlxuICAgICAgICAgICAgICAgIEhleXphcEFkcy5WaWRlb0FkLmFkZEV2ZW50TGlzdGVuZXIoSGV5emFwQWRzLlZpZGVvQWQuRXZlbnRzLkhJREUsICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hZE1hbmFnZXIudW5NdXRlQWZ0ZXJBZCgpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmFkTWFuYWdlci5lbWl0KFBoYXNlckFkcy5DT05URU5UX1JFU1VNRUQsIEhleXphcEFkcy5WaWRlb0FkLkV2ZW50cy5ISURFKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBIZXl6YXBBZHMuVmlkZW9BZC5hZGRFdmVudExpc3RlbmVyKEhleXphcEFkcy5WaWRlb0FkLkV2ZW50cy5TSE9XX0ZBSUxFRCwgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmFkTWFuYWdlci51bk11dGVBZnRlckFkKCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYWRNYW5hZ2VyLmVtaXQoUGhhc2VyQWRzLkNPTlRFTlRfUkVTVU1FRCwgSGV5emFwQWRzLlZpZGVvQWQuRXZlbnRzLlNIT1dfRkFJTEVEKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBIZXl6YXBBZHMuVmlkZW9BZC5hZGRFdmVudExpc3RlbmVyKEhleXphcEFkcy5WaWRlb0FkLkV2ZW50cy5DTElDS0VELCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYWRNYW5hZ2VyLmVtaXQoUGhhc2VyQWRzLkFEX0NMSUNLRUQsIEhleXphcEFkcy5WaWRlb0FkLkV2ZW50cy5DTElDS0VEKTtcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIEhleXphcEFkcy5WaWRlb0FkLnNob3coKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgLy8gTmF0aXZlIGNhbGwgc3VjY2Vzc2Z1bC5cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hZE1hbmFnZXIuZW1pdChQaGFzZXJBZHMuQ09OVEVOVF9QQVVTRUQpO1xuICAgICAgICAgICAgICAgIH0sIChlcnJvcjogYW55KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYWRNYW5hZ2VyLnVuTXV0ZUFmdGVyQWQoKTtcbiAgICAgICAgICAgICAgICAgICAgLy9GYWlsZWQgdG8gc2hvdyBpbnNlbnRpdmUgYWQsIGNvbnRpbnVlIG9wZXJhdGlvbnNcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hZE1hbmFnZXIuZW1pdChQaGFzZXJBZHMuQ09OVEVOVF9SRVNVTUVEKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgSGV5emFwQWRUeXBlcy5SZXdhcmRlZDpcbiAgICAgICAgICAgICAgICBIZXl6YXBBZHMuSW5jZW50aXZpemVkQWQuYWRkRXZlbnRMaXN0ZW5lcihIZXl6YXBBZHMuSW5jZW50aXZpemVkQWQuRXZlbnRzLkhJREUsICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hZE1hbmFnZXIudW5NdXRlQWZ0ZXJBZCgpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmFkTWFuYWdlci5lbWl0KFBoYXNlckFkcy5DT05URU5UX1JFU1VNRUQsIEhleXphcEFkcy5JbmNlbnRpdml6ZWRBZC5FdmVudHMuSElERSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgSGV5emFwQWRzLkluY2VudGl2aXplZEFkLmFkZEV2ZW50TGlzdGVuZXIoSGV5emFwQWRzLkluY2VudGl2aXplZEFkLkV2ZW50cy5TSE9XX0ZBSUxFRCwgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmFkTWFuYWdlci51bk11dGVBZnRlckFkKCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYWRNYW5hZ2VyLmVtaXQoUGhhc2VyQWRzLkNPTlRFTlRfUkVTVU1FRCwgSGV5emFwQWRzLkluY2VudGl2aXplZEFkLkV2ZW50cy5TSE9XX0ZBSUxFRCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgSGV5emFwQWRzLkluY2VudGl2aXplZEFkLmFkZEV2ZW50TGlzdGVuZXIoSGV5emFwQWRzLkluY2VudGl2aXplZEFkLkV2ZW50cy5DTElDS0VELCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYWRNYW5hZ2VyLmVtaXQoUGhhc2VyQWRzLkFEX0NMSUNLRUQsIEhleXphcEFkcy5JbmNlbnRpdml6ZWRBZC5FdmVudHMuQ0xJQ0tFRCk7XG5cbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIEhleXphcEFkcy5JbmNlbnRpdml6ZWRBZC5zaG93KCkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIC8vIE5hdGl2ZSBjYWxsIHN1Y2Nlc3NmdWwuXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYWRNYW5hZ2VyLmVtaXQoUGhhc2VyQWRzLkNPTlRFTlRfUEFVU0VEKTtcbiAgICAgICAgICAgICAgICB9LCAoZXJyb3I6IGFueSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmFkTWFuYWdlci51bk11dGVBZnRlckFkKCk7XG4gICAgICAgICAgICAgICAgICAgIC8vRmFpbGVkIHRvIHNob3cgaW5zZW50aXZlIGFkLCBjb250aW51ZSBvcGVyYXRpb25zXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYWRNYW5hZ2VyLmVtaXQoUGhhc2VyQWRzLkNPTlRFTlRfUkVTVU1FRCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIEhleXphcEFkVHlwZXMuQmFubmVyOlxuICAgICAgICAgICAgICAgIEhleXphcEFkcy5CYW5uZXJBZC5zaG93KGJhbm5lckFkUG9zaXRpb25zKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgLy8gTmF0aXZlIGNhbGwgc3VjY2Vzc2Z1bC5cbiAgICAgICAgICAgICAgICB9LCAoZXJyb3I6IGFueSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAvLyBIYW5kbGUgRXJyb3JcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyBwcmVsb2FkQWQoYWRUeXBlOiBIZXl6YXBBZFR5cGVzKTogdm9pZCB7XG4gICAgICAgIGlmICghdGhpcy5hZHNFbmFibGVkKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoYWRUeXBlID09PSBIZXl6YXBBZFR5cGVzLlJld2FyZGVkKSB7XG4gICAgICAgICAgICBIZXl6YXBBZHMuSW5jZW50aXZpemVkQWQuZmV0Y2goKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICAvLyBOYXRpdmUgY2FsbCBzdWNjZXNzZnVsLlxuICAgICAgICAgICAgfSwgKGVycm9yOiBhbnkpID0+IHtcbiAgICAgICAgICAgICAgICAvLyBIYW5kbGUgRXJyb3JcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHB1YmxpYyBkZXN0cm95QWQoYWRUeXBlOiBIZXl6YXBBZFR5cGVzKTogdm9pZCB7XG4gICAgICAgIGlmICghdGhpcy5hZHNFbmFibGVkKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoYWRUeXBlID09PSBIZXl6YXBBZFR5cGVzLkJhbm5lcikge1xuICAgICAgICAgICAgSGV5emFwQWRzLkJhbm5lckFkLmRlc3Ryb3koKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICAvLyBOYXRpdmUgY2FsbCBzdWNjZXNzZnVsLlxuICAgICAgICAgICAgfSwgKGVycm9yOiBhbnkpID0+IHtcbiAgICAgICAgICAgICAgICAvLyBIYW5kbGUgRXJyb3JcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHB1YmxpYyBoaWRlQWQoYWRUeXBlOiBIZXl6YXBBZFR5cGVzKTogdm9pZCB7XG4gICAgICAgIGlmICghdGhpcy5hZHNFbmFibGVkKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoYWRUeXBlID09PSBIZXl6YXBBZFR5cGVzLkJhbm5lcikge1xuICAgICAgICAgICAgSGV5emFwQWRzLkJhbm5lckFkLmhpZGUoKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICAvLyBOYXRpdmUgY2FsbCBzdWNjZXNzZnVsLlxuICAgICAgICAgICAgfSwgKGVycm9yOiBhbnkpID0+IHtcbiAgICAgICAgICAgICAgICAvLyBIYW5kbGUgRXJyb3JcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbn1cbiIsImltcG9ydCB7SVByb3ZpZGVyfSBmcm9tICcuL0lQcm92aWRlcic7XG5pbXBvcnQgUGhhc2VyQWRzIGZyb20gJy4uL2luZGV4JztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgR2FtZURpc3RyaWJ1dGlvbkFkcyBpbXBsZW1lbnRzIElQcm92aWRlciB7XG4gICAgcHVibGljIGFkTWFuYWdlcjogUGhhc2VyQWRzO1xuXG4gICAgcHVibGljIGFkc0VuYWJsZWQ6IGJvb2xlYW4gPSB0cnVlO1xuXG4gICAgY29uc3RydWN0b3IoZ2FtZUlkOiBzdHJpbmcsIHVzZXJJZDogc3RyaW5nKSB7XG4gICAgICAgIHRoaXMuYXJlQWRzRW5hYmxlZCgpO1xuXG4gICAgICAgICg8YW55PndpbmRvdykuR0RfT1BUSU9OUyA9IDxJR2FtZURpc3RyaWJ1dGlvblNldHRpbmdzPntcbiAgICAgICAgICAgIGdhbWVJZDogZ2FtZUlkLFxuICAgICAgICAgICAgdXNlcklkOiB1c2VySWQsXG4gICAgICAgICAgICBhZHZlcnRpc2VtZW50U2V0dGluZ3M6IHtcbiAgICAgICAgICAgICAgICBhdXRvcGxheTogZmFsc2VcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBvbkV2ZW50OiAoZXZlbnQ6IGFueSk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgICAgIHN3aXRjaCAoZXZlbnQubmFtZSkge1xuICAgICAgICAgICAgICAgICAgICBjYXNlICdTREtfR0FNRV9TVEFSVCc6XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGdkQXBpICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdkQXBpLnBsYXkoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYWRNYW5hZ2VyLnVuTXV0ZUFmdGVyQWQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYWRNYW5hZ2VyLmVtaXQoUGhhc2VyQWRzLkNPTlRFTlRfUkVTVU1FRCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnU0RLX0dBTUVfUEFVU0UnOlxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5hZE1hbmFnZXIuZW1pdChQaGFzZXJBZHMuQ09OVEVOVF9QQVVTRUQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ1NES19SRUFEWSc6XG4gICAgICAgICAgICAgICAgICAgICAgICAvL2FkZCBzb21ldGhpbmcgaGVyZVxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ1NES19FUlJPUic6XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgLy9JbmNsdWRlIHNjcmlwdC4gZXZlbiB3aGVuIGFkYmxvY2sgaXMgZW5hYmxlZCwgdGhpcyBzY3JpcHQgYWxzbyBhbGxvd3MgdXMgdG8gdHJhY2sgb3VyIHVzZXJzO1xuICAgICAgICAoZnVuY3Rpb24gKGQ6IERvY3VtZW50LCBzOiBzdHJpbmcsIGlkOiBzdHJpbmcpOiB2b2lkIHtcbiAgICAgICAgICAgIGxldCBqczogSFRNTFNjcmlwdEVsZW1lbnQ7XG4gICAgICAgICAgICBsZXQgZmpzOiBIVE1MU2NyaXB0RWxlbWVudCA9IDxIVE1MU2NyaXB0RWxlbWVudD5kLmdldEVsZW1lbnRzQnlUYWdOYW1lKHMpWzBdO1xuICAgICAgICAgICAgaWYgKGQuZ2V0RWxlbWVudEJ5SWQoaWQpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAganMgPSA8SFRNTFNjcmlwdEVsZW1lbnQ+ZC5jcmVhdGVFbGVtZW50KHMpO1xuICAgICAgICAgICAganMuaWQgPSBpZDtcbiAgICAgICAgICAgIGpzLnNyYyA9ICcvL2h0bWw1LmFwaS5nYW1lZGlzdHJpYnV0aW9uLmNvbS9tYWluLm1pbi5qcyc7XG4gICAgICAgICAgICBmanMucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUoanMsIGZqcyk7XG4gICAgICAgIH0oZG9jdW1lbnQsICdzY3JpcHQnLCAnZ2FtZWRpc3RyaWJ1dGlvbi1qc3NkaycpKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgc2V0TWFuYWdlcihtYW5hZ2VyOiBQaGFzZXJBZHMpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5hZE1hbmFnZXIgPSBtYW5hZ2VyO1xuICAgIH1cblxuICAgIHB1YmxpYyBzaG93QWQoKTogdm9pZCB7XG4gICAgICAgIGlmICghdGhpcy5hZHNFbmFibGVkKSB7XG4gICAgICAgICAgICB0aGlzLmFkTWFuYWdlci51bk11dGVBZnRlckFkKCk7XG4gICAgICAgICAgICB0aGlzLmFkTWFuYWdlci5lbWl0KFBoYXNlckFkcy5DT05URU5UX1JFU1VNRUQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBnZEFwaSA9PT0gJ3VuZGVmaW5lZCcgfHwgKGdkQXBpICYmIHR5cGVvZiBnZEFwaS5zaG93QmFubmVyID09PSAndW5kZWZpbmVkJykpIHtcbiAgICAgICAgICAgICAgICAvL1NvIGdkQXBpIGlzbid0IGF2YWlsYWJsZSBPUlxuICAgICAgICAgICAgICAgIC8vZ2RBcGkgaXMgYXZhaWxhYmxlLCBidXQgc2hvd0Jhbm5lciBpcyBub3QgdGhlcmUgKHdlaXJkIGJ1dCBjYW4gaGFwcGVuKVxuICAgICAgICAgICAgICAgIHRoaXMuYWRzRW5hYmxlZCA9IGZhbHNlO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5hZE1hbmFnZXIudW5NdXRlQWZ0ZXJBZCgpO1xuICAgICAgICAgICAgICAgIHRoaXMuYWRNYW5hZ2VyLmVtaXQoUGhhc2VyQWRzLkNPTlRFTlRfUkVTVU1FRCk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBnZEFwaS5zaG93QmFubmVyKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvL0RvZXMgbm90aGluZywgYnV0IG5lZWRlZCBmb3IgUHJvdmlkZXIgaW50ZXJmYWNlXG4gICAgcHVibGljIHByZWxvYWRBZCgpOiB2b2lkIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vRG9lcyBub3RoaW5nLCBidXQgbmVlZGVkIGZvciBQcm92aWRlciBpbnRlcmZhY2VcbiAgICBwdWJsaWMgZGVzdHJveUFkKCk6IHZvaWQge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy9Eb2VzIG5vdGhpbmcsIGJ1dCBuZWVkZWQgZm9yIFByb3ZpZGVyIGludGVyZmFjZVxuICAgIHB1YmxpYyBoaWRlQWQoKTogdm9pZCB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDaGVja3MgaWYgdGhlIGFkcyBhcmUgZW5hYmxlZCAoZS5nOyBhZGJsb2NrIGlzIGVuYWJsZWQgb3Igbm90KVxuICAgICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgICAqL1xuICAgIHByaXZhdGUgYXJlQWRzRW5hYmxlZCgpOiB2b2lkIHtcbiAgICAgICAgbGV0IHRlc3Q6IEhUTUxFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIHRlc3QuaW5uZXJIVE1MID0gJyZuYnNwOyc7XG4gICAgICAgIHRlc3QuY2xhc3NOYW1lID0gJ2Fkc2JveCc7XG4gICAgICAgIHRlc3Quc3R5bGUucG9zaXRpb24gPSAnYWJzb2x1dGUnO1xuICAgICAgICB0ZXN0LnN0eWxlLmZvbnRTaXplID0gJzEwcHgnO1xuICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHRlc3QpO1xuXG4gICAgICAgIC8vIGxldCBhZHNFbmFibGVkOiBib29sZWFuO1xuICAgICAgICBsZXQgaXNFbmFibGVkOiAoKSA9PiBib29sZWFuID0gKCkgPT4ge1xuICAgICAgICAgICAgbGV0IGVuYWJsZWQ6IGJvb2xlYW4gPSB0cnVlO1xuICAgICAgICAgICAgaWYgKHRlc3Qub2Zmc2V0SGVpZ2h0ID09PSAwKSB7XG4gICAgICAgICAgICAgICAgZW5hYmxlZCA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGVzdC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHRlc3QpO1xuXG4gICAgICAgICAgICByZXR1cm4gZW5hYmxlZDtcbiAgICAgICAgfTtcblxuICAgICAgICB3aW5kb3cuc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmFkc0VuYWJsZWQgPSBpc0VuYWJsZWQoKTtcbiAgICAgICAgfSwgMTAwKTtcbiAgICB9XG59XG4iLCJpbXBvcnQge0lQcm92aWRlcn0gZnJvbSAnLi9JUHJvdmlkZXInO1xuaW1wb3J0IHtBZEV2ZW50LCBkZWZhdWx0IGFzIFBoYXNlckFkc30gZnJvbSAnLi4vaW5kZXgnO1xuXG5leHBvcnQgaW50ZXJmYWNlIElDdXN0b21QYXJhbXMge1xuICAgIFtuYW1lOiBzdHJpbmddOiBzdHJpbmcgfCBudW1iZXJ8IGFueVtdO1xufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBJbWEzIGltcGxlbWVudHMgSVByb3ZpZGVyIHtcbiAgICBwcml2YXRlIGdhbWVDb250ZW50OiBhbnk7XG5cbiAgICBwcml2YXRlIGFkQ29udGVudDogSFRNTEVsZW1lbnQ7XG5cbiAgICBwcml2YXRlIGFkRGlzcGxheTogR29vZ2xlQWRzLmltYS5BZERpc3BsYXlDb250YWluZXI7XG5cbiAgICBwcml2YXRlIGFkTG9hZGVyOiBHb29nbGVBZHMuaW1hLkFkc0xvYWRlcjtcblxuICAgIHByaXZhdGUgYWRzTWFuYWdlcjogR29vZ2xlQWRzLmltYS5BZHNNYW5hZ2VyID0gbnVsbDtcblxuICAgIHByaXZhdGUgZ29vZ2xlRW5hYmxlZDogYm9vbGVhbiA9IGZhbHNlO1xuXG4gICAgcHVibGljIGFkc0VuYWJsZWQ6IGJvb2xlYW4gPSB0cnVlO1xuXG4gICAgcHJpdmF0ZSBhZFRhZ1VybDogc3RyaW5nID0gJyc7XG5cbiAgICBwcml2YXRlIGFkUmVxdWVzdGVkOiBib29sZWFuID0gZmFsc2U7XG5cbiAgICBwdWJsaWMgYWRNYW5hZ2VyOiBQaGFzZXJBZHMgPSBudWxsO1xuXG4gICAgcHJpdmF0ZSByZXNpemVMaXN0ZW5lcjogKCkgPT4gdm9pZCA9IG51bGw7XG5cbiAgICBjb25zdHJ1Y3RvcihjYW52YXM6IEhUTUxDYW52YXNFbGVtZW50LCBhZFRhZ1VybDogc3RyaW5nKSB7XG4gICAgICAgIHRoaXMuYXJlQWRzRW5hYmxlZCgpO1xuXG4gICAgICAgIGlmICh0eXBlb2YgZ29vZ2xlID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5nb29nbGVFbmFibGVkID0gdHJ1ZTtcblxuICAgICAgICB0aGlzLmdhbWVDb250ZW50ID0gKHR5cGVvZiBjYW52YXMucGFyZW50RWxlbWVudCA9PT0gJ3N0cmluZycpID8gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoPHN0cmluZz5jYW52YXMucGFyZW50RWxlbWVudCkgOiBjYW52YXMucGFyZW50RWxlbWVudDtcbiAgICAgICAgLy8gdGhpcy5nYW1lQ29udGVudC5jdXJyZW50VGltZSA9IDEwMDtcbiAgICAgICAgdGhpcy5nYW1lQ29udGVudC5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSc7XG4gICAgICAgIHRoaXMuZ2FtZUNvbnRlbnQuc3R5bGUud2lkdGggPSAnMTAwJSc7XG5cbiAgICAgICAgdGhpcy5hZENvbnRlbnQgPSB0aGlzLmdhbWVDb250ZW50LnBhcmVudE5vZGUuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JykpO1xuICAgICAgICB0aGlzLmFkQ29udGVudC5pZCA9ICdwaGFzZXItYWQtY29udGFpbmVyJztcbiAgICAgICAgdGhpcy5hZENvbnRlbnQuc3R5bGUucG9zaXRpb24gPSAnYWJzb2x1dGUnO1xuICAgICAgICB0aGlzLmFkQ29udGVudC5zdHlsZS56SW5kZXggPSAnOTk5OSc7XG4gICAgICAgIHRoaXMuYWRDb250ZW50LnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICAgIHRoaXMuYWRDb250ZW50LnN0eWxlLnRvcCA9ICcwJztcbiAgICAgICAgdGhpcy5hZENvbnRlbnQuc3R5bGUubGVmdCA9ICcwJztcbiAgICAgICAgdGhpcy5hZENvbnRlbnQuc3R5bGUud2lkdGggPSAnMTAwJSc7XG4gICAgICAgIHRoaXMuYWRDb250ZW50LnN0eWxlLmhlaWdodCA9ICcxMDAlJztcbiAgICAgICAgdGhpcy5hZENvbnRlbnQuc3R5bGUub3ZlcmZsb3cgPSAnaGlkZGVuJztcblxuICAgICAgICB0aGlzLmFkVGFnVXJsID0gYWRUYWdVcmw7XG5cbiAgICAgICAgLy8gQ3JlYXRlIHRoZSBhZCBkaXNwbGF5IGNvbnRhaW5lci5cbiAgICAgICAgdGhpcy5hZERpc3BsYXkgPSBuZXcgZ29vZ2xlLmltYS5BZERpc3BsYXlDb250YWluZXIodGhpcy5hZENvbnRlbnQpO1xuXG4gICAgICAgIC8vU2V0IHZwYWlkIGVuYWJsZWQsIGFuZCB1cGRhdGUgbG9jYWxlXG4gICAgICAgICg8YW55Pmdvb2dsZS5pbWEuc2V0dGluZ3MpLnNldFZwYWlkTW9kZSgoPGFueT5nb29nbGUuaW1hKS5JbWFTZGtTZXR0aW5ncy5WcGFpZE1vZGUuRU5BQkxFRCk7XG4gICAgICAgICg8YW55Pmdvb2dsZS5pbWEuc2V0dGluZ3MpLnNldExvY2FsZSgnbmwnKTtcblxuICAgICAgICAvLyBDcmVhdGUgYWRzIGxvYWRlciwgYW5kIHJlZ2lzdGVyIGV2ZW50c1xuICAgICAgICB0aGlzLmFkTG9hZGVyID0gbmV3IGdvb2dsZS5pbWEuQWRzTG9hZGVyKHRoaXMuYWREaXNwbGF5KTtcbiAgICAgICAgdGhpcy5hZExvYWRlci5hZGRFdmVudExpc3RlbmVyKGdvb2dsZS5pbWEuQWRzTWFuYWdlckxvYWRlZEV2ZW50LlR5cGUuQURTX01BTkFHRVJfTE9BREVELCB0aGlzLm9uQWRNYW5hZ2VyTG9hZGVyLCBmYWxzZSwgdGhpcyk7XG4gICAgICAgIHRoaXMuYWRMb2FkZXIuYWRkRXZlbnRMaXN0ZW5lcihnb29nbGUuaW1hLkFkRXJyb3JFdmVudC5UeXBlLkFEX0VSUk9SLCB0aGlzLm9uQWRFcnJvciwgZmFsc2UsIHRoaXMpO1xuICAgIH1cblxuICAgIHB1YmxpYyBzZXRNYW5hZ2VyKG1hbmFnZXI6IFBoYXNlckFkcyk6IHZvaWQge1xuICAgICAgICB0aGlzLmFkTWFuYWdlciA9IG1hbmFnZXI7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRG9pbmcgYW4gYWQgcmVxdWVzdCwgaWYgYW55dGhpbmcgaXMgd3Jvbmcgd2l0aCB0aGUgbGliIChtaXNzaW5nIGltYTMsIGZhaWxlZCByZXF1ZXN0KSB3ZSBqdXN0IGRpc3BhdGNoIHRoZSBjb250ZW50UmVzdW1lZCBldmVudFxuICAgICAqIE90aGVyd2lzZSB3ZSBkaXNwbGF5IGFuIGFkXG4gICAgICovXG4gICAgcHVibGljIHNob3dBZChjdXN0b21QYXJhbXM/OiBJQ3VzdG9tUGFyYW1zKTogdm9pZCB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdBZCBSZXF1ZXN0ZWQnKTtcbiAgICAgICAgaWYgKHRoaXMuYWRSZXF1ZXN0ZWQpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghdGhpcy5hZHNFbmFibGVkKSB7XG4gICAgICAgICAgICB0aGlzLmFkTWFuYWdlci5lbWl0KFBoYXNlckFkcy5BRF9ESVNBQkxFRCwgdHJ1ZSlcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghdGhpcy5nb29nbGVFbmFibGVkKSB7XG4gICAgICAgICAgICB0aGlzLm9uQ29udGVudFJlc3VtZVJlcXVlc3RlZCgpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLy9Gb3IgbW9iaWxlIHRoaXMgYWQgcmVxdWVzdCBuZWVkcyB0byBiZSBoYW5kbGVkIHBvc3QgdXNlciBjbGlja1xuICAgICAgICB0aGlzLmFkRGlzcGxheS5pbml0aWFsaXplKCk7XG5cbiAgICAgICAgLy8gUmVxdWVzdCB2aWRlbyBhZHMuXG4gICAgICAgIGxldCBhZHNSZXF1ZXN0OiBHb29nbGVBZHMuaW1hLkFkc1JlcXVlc3QgPSBuZXcgZ29vZ2xlLmltYS5BZHNSZXF1ZXN0KCk7XG4gICAgICAgIGFkc1JlcXVlc3QuYWRUYWdVcmwgPSB0aGlzLmFkVGFnVXJsICsgdGhpcy5wYXJzZUN1c3RvbVBhcmFtcyhjdXN0b21QYXJhbXMpO1xuXG4gICAgICAgIGxldCB3aWR0aDogbnVtYmVyID0gd2luZG93LmlubmVyV2lkdGg7IC8vcGFyc2VJbnQoPHN0cmluZz4oIXRoaXMuZ2FtZS5jYW52YXMuc3R5bGUud2lkdGggPyB0aGlzLmdhbWUuY2FudmFzLndpZHRoIDogdGhpcy5nYW1lLmNhbnZhcy5zdHlsZS53aWR0aCksIDEwKTtcbiAgICAgICAgbGV0IGhlaWdodDogbnVtYmVyID0gd2luZG93LmlubmVySGVpZ2h0OyAvL3BhcnNlSW50KDxzdHJpbmc+KCF0aGlzLmdhbWUuY2FudmFzLnN0eWxlLmhlaWdodCA/IHRoaXMuZ2FtZS5jYW52YXMuaGVpZ2h0IDogdGhpcy5nYW1lLmNhbnZhcy5zdHlsZS5oZWlnaHQpLCAxMCk7XG5cbiAgICAgICAgLy9IZXJlIHdlIGNoZWNrIGlmIHBoYXNlciBpcyBmdWxsc2NyZWVuIG9yIG5vdCwgaWYgd2UgYXJlIGZ1bGxzY3JlZW4sIHdlIHN1YnRyYWN0IHNvbWUgb2YgdGhlIHdpZHRoIGFuZCBoZWlnaHQsIHRvIGNvdW50ZXIgZm9yIHRoZSByZXNpemUgKFxuICAgICAgICAvL0Z1bGxzY3JlZW4gc2hvdWxkIGJlIGRpc2FibGVkIGZvciB0aGUgYWQsIChvbkNvbnRlbnRQYXVzZWQpIGFuZCByZXF1ZXN0ZWQgZm9yIGFnYWluIHdoZW4gdGhlIGdhbWUgcmVzdW1lc1xuICAgICAgICBpZiAoZG9jdW1lbnQuYm9keS5jbGllbnRIZWlnaHQgPCB3aW5kb3cuaW5uZXJIZWlnaHQpIHtcbiAgICAgICAgICAgIGhlaWdodCA9IGRvY3VtZW50LmJvZHkuY2xpZW50SGVpZ2h0O1xuICAgICAgICAgICAgd2lkdGggPSBkb2N1bWVudC5ib2R5LmNsaWVudFdpZHRoO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gU3BlY2lmeSB0aGUgbGluZWFyIGFuZCBub25saW5lYXIgc2xvdCBzaXplcy4gVGhpcyBoZWxwcyB0aGUgU0RLIHRvXG4gICAgICAgIC8vIHNlbGVjdCB0aGUgY29ycmVjdCBjcmVhdGl2ZSBpZiBtdWx0aXBsZSBhcmUgcmV0dXJuZWQuXG4gICAgICAgIGFkc1JlcXVlc3QubGluZWFyQWRTbG90V2lkdGggPSB3aWR0aDtcbiAgICAgICAgYWRzUmVxdWVzdC5saW5lYXJBZFNsb3RIZWlnaHQgPSBoZWlnaHQ7XG4gICAgICAgIGFkc1JlcXVlc3Qubm9uTGluZWFyQWRTbG90V2lkdGggPSB3aWR0aDtcbiAgICAgICAgYWRzUmVxdWVzdC5ub25MaW5lYXJBZFNsb3RIZWlnaHQgPSBoZWlnaHQ7XG5cbiAgICAgICAgLy9SZXF1aXJlZCBmb3IgZ2FtZXMsIHNlZTpcbiAgICAgICAgLy9odHRwOi8vZ29vZ2xlYWRzZGV2ZWxvcGVyLmJsb2dzcG90Lm5sLzIwMTUvMTAvaW1wb3J0YW50LWNoYW5nZXMtZm9yLWdhbWluZy1wdWJsaXNoZXJzLmh0bWxcbiAgICAgICAgYWRzUmVxdWVzdC5mb3JjZU5vbkxpbmVhckZ1bGxTbG90ID0gdHJ1ZTtcblxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgdGhpcy5hZFJlcXVlc3RlZCA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLmFkTG9hZGVyLnJlcXVlc3RBZHMoYWRzUmVxdWVzdCk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGUpO1xuICAgICAgICAgICAgdGhpcy5vbkNvbnRlbnRSZXN1bWVSZXF1ZXN0ZWQoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vRG9lcyBub3RoaW5nLCBidXQgbmVlZGVkIGZvciBQcm92aWRlciBpbnRlcmZhY2VcbiAgICBwdWJsaWMgcHJlbG9hZEFkKCk6IHZvaWQge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy9Eb2VzIG5vdGhpbmcsIGJ1dCBuZWVkZWQgZm9yIFByb3ZpZGVyIGludGVyZmFjZVxuICAgIHB1YmxpYyBkZXN0cm95QWQoKTogdm9pZCB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvL0RvZXMgbm90aGluZywgYnV0IG5lZWRlZCBmb3IgUHJvdmlkZXIgaW50ZXJmYWNlXG4gICAgcHVibGljIGhpZGVBZCgpOiB2b2lkIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENhbGxlZCB3aGVuIHRoZSBhZHMgbWFuYWdlciB3YXMgbG9hZGVkLlxuICAgICAqIFdlIHJlZ2lzdGVyIGFsbCBhZCByZWxhdGVkIGV2ZW50cyBoZXJlLCBhbmQgaW5pdGlhbGl6ZSB0aGUgbWFuYWdlciB3aXRoIHRoZSBnYW1lIHdpZHRoL2hlaWdodFxuICAgICAqXG4gICAgICogQHBhcmFtIGFkc01hbmFnZXJMb2FkZWRFdmVudFxuICAgICAqL1xuICAgIHByaXZhdGUgb25BZE1hbmFnZXJMb2FkZXIoYWRzTWFuYWdlckxvYWRlZEV2ZW50OiBHb29nbGVBZHMuaW1hLkFkc01hbmFnZXJMb2FkZWRFdmVudCk6IHZvaWQge1xuICAgICAgICBjb25zb2xlLmxvZygnQWRzTWFuYWdlciBsb2FkZWQnKTtcbiAgICAgICAgLy8gR2V0IHRoZSBhZHMgbWFuYWdlci5cbiAgICAgICAgbGV0IGFkc1JlbmRlcmluZ1NldHRpbmdzOiBHb29nbGVBZHMuaW1hLkFkc1JlbmRlcmluZ1NldHRpbmdzID0gbmV3IGdvb2dsZS5pbWEuQWRzUmVuZGVyaW5nU2V0dGluZ3MoKTtcbiAgICAgICAgYWRzUmVuZGVyaW5nU2V0dGluZ3MucmVzdG9yZUN1c3RvbVBsYXliYWNrU3RhdGVPbkFkQnJlYWtDb21wbGV0ZSA9IHRydWU7XG5cbiAgICAgICAgLy8gdmlkZW9Db250ZW50IHNob3VsZCBiZSBzZXQgdG8gdGhlIGNvbnRlbnQgdmlkZW8gZWxlbWVudC5cbiAgICAgICAgbGV0IGFkc01hbmFnZXI6IEdvb2dsZUFkcy5pbWEuQWRzTWFuYWdlciA9IGFkc01hbmFnZXJMb2FkZWRFdmVudC5nZXRBZHNNYW5hZ2VyKHRoaXMuZ2FtZUNvbnRlbnQsIGFkc1JlbmRlcmluZ1NldHRpbmdzKTtcbiAgICAgICAgdGhpcy5hZHNNYW5hZ2VyID0gYWRzTWFuYWdlcjtcbiAgICAgICAgY29uc29sZS5sb2coYWRzTWFuYWdlci5pc0N1c3RvbUNsaWNrVHJhY2tpbmdVc2VkKCkpO1xuXG4gICAgICAgIC8vIEFkZCBsaXN0ZW5lcnMgdG8gdGhlIHJlcXVpcmVkIGV2ZW50cy5cbiAgICAgICAgYWRzTWFuYWdlci5hZGRFdmVudExpc3RlbmVyKGdvb2dsZS5pbWEuQWRFdmVudC5UeXBlLkNPTlRFTlRfUEFVU0VfUkVRVUVTVEVELCB0aGlzLm9uQ29udGVudFBhdXNlUmVxdWVzdGVkLCBmYWxzZSwgdGhpcyk7XG4gICAgICAgIGFkc01hbmFnZXIuYWRkRXZlbnRMaXN0ZW5lcihnb29nbGUuaW1hLkFkRXZlbnQuVHlwZS5DT05URU5UX1JFU1VNRV9SRVFVRVNURUQsIHRoaXMub25Db250ZW50UmVzdW1lUmVxdWVzdGVkLCBmYWxzZSwgdGhpcyk7XG4gICAgICAgIGFkc01hbmFnZXIuYWRkRXZlbnRMaXN0ZW5lcihnb29nbGUuaW1hLkFkRXJyb3JFdmVudC5UeXBlLkFEX0VSUk9SLCB0aGlzLm9uQWRFcnJvciwgZmFsc2UsIHRoaXMpO1xuXG4gICAgICAgIFtcbiAgICAgICAgICAgIGdvb2dsZS5pbWEuQWRFdmVudC5UeXBlLkFMTF9BRFNfQ09NUExFVEVELFxuICAgICAgICAgICAgZ29vZ2xlLmltYS5BZEV2ZW50LlR5cGUuQ0xJQ0ssXG4gICAgICAgICAgICBnb29nbGUuaW1hLkFkRXZlbnQuVHlwZS5DT01QTEVURSxcbiAgICAgICAgICAgIGdvb2dsZS5pbWEuQWRFdmVudC5UeXBlLkZJUlNUX1FVQVJUSUxFLFxuICAgICAgICAgICAgZ29vZ2xlLmltYS5BZEV2ZW50LlR5cGUuTE9BREVELFxuICAgICAgICAgICAgZ29vZ2xlLmltYS5BZEV2ZW50LlR5cGUuTUlEUE9JTlQsXG4gICAgICAgICAgICBnb29nbGUuaW1hLkFkRXZlbnQuVHlwZS5QQVVTRUQsXG4gICAgICAgICAgICBnb29nbGUuaW1hLkFkRXZlbnQuVHlwZS5TVEFSVEVELFxuICAgICAgICAgICAgZ29vZ2xlLmltYS5BZEV2ZW50LlR5cGUuVEhJUkRfUVVBUlRJTEVcbiAgICAgICAgXS5mb3JFYWNoKChldmVudDogc3RyaW5nKSA9PiB7XG4gICAgICAgICAgICBhZHNNYW5hZ2VyLmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICAgICAgICAgICAgZXZlbnQsXG4gICAgICAgICAgICAgICAgdGhpcy5vbkFkRXZlbnQsXG4gICAgICAgICAgICAgICAgZmFsc2UsXG4gICAgICAgICAgICAgICAgdGhpcyk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvL1Nob3cgdGhlIGFkIGVsZW1lbnRzLCB3ZSBvbmx5IG5lZWQgdG8gc2hvdyB0aGUgZmF1eCB2aWRlb2VsZW1lbnQgb24gaU9TLCBiZWNhdXNlIHRoZSBhZCBpcyBkaXNwbGF5ZWQgaW4gdGhlcmUuXG4gICAgICAgICAgICB0aGlzLmFkQ29udGVudC5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcblxuICAgICAgICAgICAgLy8gSW5pdGlhbGl6ZSB0aGUgYWRzIG1hbmFnZXIuIEFkIHJ1bGVzIHBsYXlsaXN0IHdpbGwgc3RhcnQgYXQgdGhpcyB0aW1lLlxuICAgICAgICAgICAgbGV0IHdpZHRoOiBudW1iZXIgPSB3aW5kb3cuaW5uZXJXaWR0aDsgLy9wYXJzZUludCg8c3RyaW5nPighdGhpcy5nYW1lLmNhbnZhcy5zdHlsZS53aWR0aCA/IHRoaXMuZ2FtZS5jYW52YXMud2lkdGggOiB0aGlzLmdhbWUuY2FudmFzLnN0eWxlLndpZHRoKSwgMTApO1xuICAgICAgICAgICAgbGV0IGhlaWdodDogbnVtYmVyID0gd2luZG93LmlubmVySGVpZ2h0OyAvL3BhcnNlSW50KDxzdHJpbmc+KCF0aGlzLmdhbWUuY2FudmFzLnN0eWxlLmhlaWdodCA/IHRoaXMuZ2FtZS5jYW52YXMuaGVpZ2h0IDogdGhpcy5nYW1lLmNhbnZhcy5zdHlsZS5oZWlnaHQpLCAxMCk7XG4gICAgICAgICAgICB0aGlzLmFkc01hbmFnZXIuaW5pdCh3aWR0aCwgaGVpZ2h0LCBnb29nbGUuaW1hLlZpZXdNb2RlLk5PUk1BTCk7XG5cbiAgICAgICAgICAgIC8vIENhbGwgcGxheSB0byBzdGFydCBzaG93aW5nIHRoZSBhZC4gU2luZ2xlIHZpZGVvIGFuZCBvdmVybGF5IGFkcyB3aWxsXG4gICAgICAgICAgICAvLyBzdGFydCBhdCB0aGlzIHRpbWU7IHRoZSBjYWxsIHdpbGwgYmUgaWdub3JlZCBmb3IgYWQgcnVsZXMuXG4gICAgICAgICAgICB0aGlzLmFkc01hbmFnZXIuc3RhcnQoKTtcblxuICAgICAgICAgICAgdGhpcy5yZXNpemVMaXN0ZW5lciA9ICgpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5hZHNNYW5hZ2VyID09PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvL1dpbmRvdyB3YXMgcmVzaXplZCwgc28gZXhwZWN0IHNvbWV0aGluZyBzaW1pbGFyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ1Jlc2l6aW5nIGFkIHNpemUnKTtcbiAgICAgICAgICAgICAgICB0aGlzLmFkc01hbmFnZXIucmVzaXplKHdpbmRvdy5pbm5lcldpZHRoLCB3aW5kb3cuaW5uZXJIZWlnaHQsIGdvb2dsZS5pbWEuVmlld01vZGUuTk9STUFMKTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCB0aGlzLnJlc2l6ZUxpc3RlbmVyKTtcbiAgICAgICAgfSBjYXRjaCAoYWRFcnJvcikge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ0Fkc21hbmFnZXIgZXJyb3I6JywgYWRFcnJvcik7XG4gICAgICAgICAgICB0aGlzLm9uQWRFcnJvcihhZEVycm9yKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdlbmVyaWMgYWQgZXZlbnRzIGFyZSBoYW5kbGVkIGhlcmVcbiAgICAgKiBAcGFyYW0gYWRFdmVudFxuICAgICAqL1xuICAgIHByaXZhdGUgb25BZEV2ZW50KGFkRXZlbnQ6IGFueSk6IHZvaWQge1xuICAgICAgICBjb25zb2xlLmxvZygnb25BZEV2ZW50JywgYWRFdmVudCk7XG5cbiAgICAgICAgc3dpdGNoIChhZEV2ZW50LnR5cGUpIHtcbiAgICAgICAgICAgIGNhc2UgZ29vZ2xlLmltYS5BZEV2ZW50LlR5cGUuQ0xJQ0s6XG4gICAgICAgICAgICAgICAgdGhpcy5hZE1hbmFnZXIuZW1pdChQaGFzZXJBZHMuQURfQ0xJQ0tFRCk7XG5cbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgZ29vZ2xlLmltYS5BZEV2ZW50LlR5cGUuTE9BREVEOlxuICAgICAgICAgICAgICAgIHRoaXMuYWRSZXF1ZXN0ZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBsZXQgYWQ6IGFueSA9IGFkRXZlbnQuZ2V0QWQoKTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnaXMgYWQgbGluZWFyPycsIGFkLmlzTGluZWFyKCkpO1xuICAgICAgICAgICAgICAgIGlmICghYWQuaXNMaW5lYXIoKSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm9uQ29udGVudFJlc3VtZVJlcXVlc3RlZCgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgZ29vZ2xlLmltYS5BZEV2ZW50LlR5cGUuU1RBUlRFRDpcbiAgICAgICAgICAgICAgICB0aGlzLmFkTWFuYWdlci5lbWl0KFBoYXNlckFkcy5BRF9QUk9HUkVTU0lPTiwgQWRFdmVudC5zdGFydCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIGdvb2dsZS5pbWEuQWRFdmVudC5UeXBlLkZJUlNUX1FVQVJUSUxFOlxuICAgICAgICAgICAgICAgIHRoaXMuYWRNYW5hZ2VyLmVtaXQoUGhhc2VyQWRzLkFEX1BST0dSRVNTSU9OLCBBZEV2ZW50LmZpcnN0UXVhcnRpbGUpO1xuXG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIGdvb2dsZS5pbWEuQWRFdmVudC5UeXBlLk1JRFBPSU5UOlxuICAgICAgICAgICAgICAgIHRoaXMuYWRNYW5hZ2VyLmVtaXQoUGhhc2VyQWRzLkFEX1BST0dSRVNTSU9OLCBBZEV2ZW50Lm1pZFBvaW50KTtcblxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBnb29nbGUuaW1hLkFkRXZlbnQuVHlwZS5USElSRF9RVUFSVElMRTpcbiAgICAgICAgICAgICAgICB0aGlzLmFkTWFuYWdlci5lbWl0KFBoYXNlckFkcy5BRF9QUk9HUkVTU0lPTiwgQWRFdmVudC50aGlyZFF1YXJ0aWxlKTtcblxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBnb29nbGUuaW1hLkFkRXZlbnQuVHlwZS5DT01QTEVURTpcbiAgICAgICAgICAgICAgICB0aGlzLmFkTWFuYWdlci5lbWl0KFBoYXNlckFkcy5BRF9QUk9HUkVTU0lPTiwgQWRFdmVudC5jb21wbGV0ZSk7XG5cbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgZ29vZ2xlLmltYS5BZEV2ZW50LlR5cGUuQUxMX0FEU19DT01QTEVURUQ6XG4gICAgICAgICAgICAgICAgdGhpcy5vbkNvbnRlbnRSZXN1bWVSZXF1ZXN0ZWQoKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgb25BZEVycm9yKGVycm9yOiBhbnkpOiB2b2lkIHtcbiAgICAgICAgY29uc29sZS5sb2coJ2duZXJpYyBhZCBlcnJvcicsIGVycm9yKTtcbiAgICAgICAgaWYgKG51bGwgIT09IHRoaXMuYWRzTWFuYWdlcikge1xuICAgICAgICAgICAgdGhpcy5hZHNNYW5hZ2VyLmRlc3Ryb3koKTtcbiAgICAgICAgICAgIHRoaXMuYWRzTWFuYWdlciA9IG51bGw7XG5cbiAgICAgICAgICAgIGlmIChudWxsICE9PSB0aGlzLnJlc2l6ZUxpc3RlbmVyKSB7XG4gICAgICAgICAgICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHRoaXMucmVzaXplTGlzdGVuZXIpO1xuICAgICAgICAgICAgICAgIHRoaXMucmVzaXplTGlzdGVuZXIgPSBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuYWRSZXF1ZXN0ZWQpIHtcbiAgICAgICAgICAgIHRoaXMuYWRSZXF1ZXN0ZWQgPSBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vV2Ugc2lsZW50bHkgaWdub3JlIGFkTG9hZGVyIGVycm9ycywgaXQganVzdCBtZWFucyB0aGVyZSBpcyBubyBhZCBhdmFpbGFibGVcbiAgICAgICAgdGhpcy5vbkNvbnRlbnRSZXN1bWVSZXF1ZXN0ZWQoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBXaGVuIHRoZSBhZCBzdGFydHMgcGxheWluZywgYW5kIHRoZSBnYW1lIHNob3VsZCBiZSBwYXVzZWRcbiAgICAgKi9cbiAgICBwcml2YXRlIG9uQ29udGVudFBhdXNlUmVxdWVzdGVkKCk6IHZvaWQge1xuICAgICAgICBjb25zb2xlLmxvZygnb25Db250ZW50UGF1c2VSZXF1ZXN0ZWQnLCBhcmd1bWVudHMpO1xuICAgICAgICB0aGlzLmFkTWFuYWdlci5lbWl0KFBoYXNlckFkcy5DT05URU5UX1BBVVNFRCk7XG5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBXaGVuIHRoZSBhZCBpcyBmaW5pc2hlZCBhbmQgdGhlIGdhbWUgc2hvdWxkIGJlIHJlc3VtZWRcbiAgICAgKi9cbiAgICBwcml2YXRlIG9uQ29udGVudFJlc3VtZVJlcXVlc3RlZCgpOiB2b2lkIHtcbiAgICAgICAgY29uc29sZS5sb2coJ29uQ29udGVudFJlc3VtZVJlcXVlc3RlZCcsIGFyZ3VtZW50cyk7XG5cbiAgICAgICAgaWYgKHR5cGVvZiBnb29nbGUgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICB0aGlzLmFkTWFuYWdlci51bk11dGVBZnRlckFkKCk7XG4gICAgICAgICAgICB0aGlzLmFkTWFuYWdlci5lbWl0KFBoYXNlckFkcy5DT05URU5UX1JFU1VNRUQpO1xuXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmFkQ29udGVudC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgICB0aGlzLmFkTWFuYWdlci51bk11dGVBZnRlckFkKCk7XG4gICAgICAgIHRoaXMuYWRNYW5hZ2VyLmVtaXQoUGhhc2VyQWRzLkNPTlRFTlRfUkVTVU1FRCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBwYXJzZUN1c3RvbVBhcmFtcyhjdXN0b21QYXJhbXM6IElDdXN0b21QYXJhbXMpOiBzdHJpbmcge1xuICAgICAgICBpZiAodW5kZWZpbmVkICE9PSBjdXN0b21QYXJhbXMpIHtcbiAgICAgICAgICAgIGxldCBjdXN0b21EYXRhU3RyaW5nOiBzdHJpbmcgPSAnJztcbiAgICAgICAgICAgIGZvciAobGV0IGtleSBpbiBjdXN0b21QYXJhbXMpIHtcbiAgICAgICAgICAgICAgICBpZiAoY3VzdG9tUGFyYW1zLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGN1c3RvbURhdGFTdHJpbmcubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY3VzdG9tRGF0YVN0cmluZyArPSAnJyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJyYnO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGxldCBwYXJhbTogYW55ID0gKEFycmF5LmlzQXJyYXkoY3VzdG9tUGFyYW1zW2tleV0pKSA/ICg8YW55W10+Y3VzdG9tUGFyYW1zW2tleV0pLmpvaW4oJywnKSA6IGN1c3RvbVBhcmFtc1trZXldO1xuICAgICAgICAgICAgICAgICAgICBjdXN0b21EYXRhU3RyaW5nICs9IGtleSArICc9JyArIHBhcmFtO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiAnJmN1c3RfcGFyYW1zPScgKyBlbmNvZGVVUklDb21wb25lbnQoY3VzdG9tRGF0YVN0cmluZyk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gJyc7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ2hlY2tzIGlmIHRoZSBhZHMgYXJlIGVuYWJsZWQgKGUuZzsgYWRibG9jayBpcyBlbmFibGVkIG9yIG5vdClcbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICAgKi9cbiAgICBwcml2YXRlIGFyZUFkc0VuYWJsZWQoKTogdm9pZCB7XG4gICAgICAgIGxldCB0ZXN0OiBIVE1MRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICB0ZXN0LmlubmVySFRNTCA9ICcmbmJzcDsnO1xuICAgICAgICB0ZXN0LmNsYXNzTmFtZSA9ICdhZHNib3gnO1xuICAgICAgICB0ZXN0LnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcbiAgICAgICAgdGVzdC5zdHlsZS5mb250U2l6ZSA9ICcxMHB4JztcbiAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0ZXN0KTtcblxuICAgICAgICAvLyBsZXQgYWRzRW5hYmxlZDogYm9vbGVhbjtcbiAgICAgICAgbGV0IGlzRW5hYmxlZDogKCkgPT4gYm9vbGVhbiA9ICgpID0+IHtcbiAgICAgICAgICAgIGxldCBlbmFibGVkOiBib29sZWFuID0gdHJ1ZTtcbiAgICAgICAgICAgIGlmICh0ZXN0Lm9mZnNldEhlaWdodCA9PT0gMCkge1xuICAgICAgICAgICAgICAgIGVuYWJsZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRlc3QucGFyZW50Tm9kZS5yZW1vdmVDaGlsZCh0ZXN0KTtcblxuICAgICAgICAgICAgcmV0dXJuIGVuYWJsZWQ7XG4gICAgICAgIH07XG5cbiAgICAgICAgd2luZG93LnNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5hZHNFbmFibGVkID0gaXNFbmFibGVkKCk7XG4gICAgICAgIH0sIDEwMCk7XG4gICAgfVxufVxuIiwiaW1wb3J0IHtJUHJvdmlkZXJ9IGZyb20gJy4vUHJvdmlkZXJzL0lQcm92aWRlcic7XG5pbXBvcnQge0NvY29vbkFkVHlwZX0gZnJvbSAnLi9Qcm92aWRlcnMvQ29jb29uJztcbmltcG9ydCB7RXZlbnRFbWl0dGVyfSBmcm9tICdldmVudGVtaXR0ZXIzJztcblxuZXhwb3J0IHtkZWZhdWx0IGFzIENvY29vbkFkc30gZnJvbSAnLi9Qcm92aWRlcnMvQ29jb29uJztcbmV4cG9ydCB7ZGVmYXVsdCBhcyBDb3Jkb3ZhR2FtZURpc3RyaWJ1dGlvbn0gZnJvbSAnLi9Qcm92aWRlcnMvQ29yZG92YUdhbWVEaXN0cmlidXRpb24nO1xuZXhwb3J0IHtkZWZhdWx0IGFzIENvcmRvdmFIZXl6YXB9IGZyb20gJy4vUHJvdmlkZXJzL0NvcmRvdmFIZXl6YXAnO1xuZXhwb3J0IHtkZWZhdWx0IGFzIEdhbWVEaXN0cmlidXRpb25BZHN9IGZyb20gJy4vUHJvdmlkZXJzL0dhbWVEaXN0cmlidXRpb25BZHMnO1xuZXhwb3J0IHtkZWZhdWx0IGFzIEltYTN9IGZyb20gJy4vUHJvdmlkZXJzL0ltYTMnO1xuZXhwb3J0IHtkZWZhdWx0IGFzIElTdG9yYWdlfSBmcm9tICcuL1Byb3ZpZGVycy9JUHJvdmlkZXInO1xuXG5leHBvcnQgZW51bSBBZEV2ZW50IHtcbiAgICBzdGFydCxcbiAgICBmaXJzdFF1YXJ0aWxlLFxuICAgIG1pZFBvaW50LFxuICAgIHRoaXJkUXVhcnRpbGUsXG4gICAgY29tcGxldGVcbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUGhhc2VyQWRzIGV4dGVuZHMgRXZlbnRFbWl0dGVyIHtcbiAgICBwdWJsaWMgc3RhdGljIENPTlRFTlRfUEFVU0VEOiBzdHJpbmcgPSAnb25Db250ZW50UGF1c2VkJztcblxuICAgIHB1YmxpYyBzdGF0aWMgQ09OVEVOVF9SRVNVTUVEOiBzdHJpbmcgPSAnb25Db250ZW50UmVzdW1lZCc7XG5cbiAgICBwdWJsaWMgc3RhdGljIEFEX1BST0dSRVNTSU9OOiBzdHJpbmcgPSAnb25BZFByb2dyZXNzaW9uJztcblxuICAgIHB1YmxpYyBzdGF0aWMgQURfRElTQUJMRUQ6IHN0cmluZyA9ICdvbkFkc0Rpc2FibGVkJztcblxuICAgIHB1YmxpYyBzdGF0aWMgQURfQ0xJQ0tFRDogc3RyaW5nID0gJ29uQWRDbGlja2VkJztcblxuICAgIHB1YmxpYyBzdGF0aWMgQURfUkVXQVJERUQ6IHN0cmluZyA9ICdvbkFkUmV3YXJkR3JhbnRlZCc7XG5cbiAgICBwdWJsaWMgc3RhdGljIEJBTk5FUl9TSE9XTjogc3RyaW5nID0gJ29uQmFubmVyU2hvd24nO1xuXG4gICAgcHVibGljIHN0YXRpYyBCQU5ORVJfSElEREVOOiBzdHJpbmcgPSAnb25CYW5uZXJIaWRkZW4nO1xuXG4gICAgcHVibGljIGJhbm5lckFjdGl2ZTogYm9vbGVhbiA9IGZhbHNlO1xuXG4gICAgcHJpdmF0ZSBwcm92aWRlcjogSVByb3ZpZGVyID0gbnVsbDtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhhcmd1bWVudHMpXG4gICAgfVxuXG4gICAgcHVibGljIGluaXQoKTogdm9pZCB7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdpbml0JywgYXJndW1lbnRzLCB0aGlzKTtcbiAgICB9O1xuICAgIHB1YmxpYyBzdGFydCgpOiB2b2lkIHtcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ3N0YXJ0JywgYXJndW1lbnRzLCB0aGlzKTtcblxuICAgIH07XG4gICAgcHVibGljIHN0b3AoKTogdm9pZCB7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdzdG9wJywgYXJndW1lbnRzLCB0aGlzKTtcblxuICAgIH07XG4gICAgcHVibGljIGJvb3QoKTogdm9pZCB7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdib290JywgYXJndW1lbnRzLCB0aGlzKTtcblxuICAgIH07XG4gICAgcHVibGljIGRlc3Ryb3koKTogdm9pZCB7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdkZXN0cm95JywgYXJndW1lbnRzLCB0aGlzKTtcblxuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBIZXJlIHdlIHNldCBhbiBhZHByb3ZpZGVyLCBhbnkgY2FuIGJlIGdpdmVuIGFzIGxvbmcgYXMgaXQgaW1wbGVtZW50cyB0aGUgSVByb3ZpZGVyIGludGVyZmFjZVxuICAgICAqXG4gICAgICogQHBhcmFtIHByb3ZpZGVyXG4gICAgICovXG4gICAgcHVibGljIHNldEFkUHJvdmlkZXIocHJvdmlkZXI6IElQcm92aWRlcik6IHZvaWQge1xuICAgICAgICB0aGlzLnByb3ZpZGVyID0gcHJvdmlkZXI7XG4gICAgICAgIHRoaXMucHJvdmlkZXIuc2V0TWFuYWdlcih0aGlzKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBIZXJlIHdlIHJlcXVlc3QgYW4gYWQsIHRoZSBhcmd1bWVudHMgcGFzc2VkIGRlcGVuZCBvbiB0aGUgcHJvdmlkZXIgdXNlZCFcbiAgICAgKiBAcGFyYW0gYXJnc1xuICAgICAqL1xuICAgIHB1YmxpYyBzaG93QWQoLi4uYXJnczogYW55W10pOiB2b2lkIHtcbiAgICAgICAgaWYgKG51bGwgPT09IHRoaXMucHJvdmlkZXIpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignQ2FuIG5vdCByZXF1ZXN0IGFuIGFkIHdpdGhvdXQgYW4gcHJvdmlkZXIsIHBsZWFzZSBhdHRhY2ggYW4gYWQgcHJvdmlkZXIhJyk7XG4gICAgICAgIH1cblxuICAgICAgICAvL0xldCdzIG5vdCBkbyB0aGlzIGZvciBiYW5uZXInc1xuICAgICAgICBpZiAoYXJnc1swXSAhPT0gQ29jb29uQWRUeXBlLmJhbm5lcikge1xuICAgICAgICAgICAgLy9maXJzdCB3ZSBjaGVjayBpZiB0aGUgc291bmQgd2FzIGFscmVhZHkgbXV0ZWQgYmVmb3JlIHdlIHJlcXVlc3RlZCBhbiBhZGRcbiAgICAgICAgICAgIC8vTGV0J3MgbXV0ZSBhdWRpbyBmb3IgdGhlIGdhbWUsIHdlIGNhbiByZXN1bWUgdGhlIGF1ZGkgcGxheWJhY2sgb25jZSB0aGUgYWRkIGhhcyBwbGF5ZWRcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMucHJvdmlkZXIuc2hvd0FkLmFwcGx5KHRoaXMucHJvdmlkZXIsIGFyZ3MpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNvbWUgcHJvdmlkZXJzIG1pZ2h0IHJlcXVpcmUgeW91IHRvIHByZWxvYWQgYW4gYWQgYmVmb3JlIHNob3dpbmcgaXQsIHRoYXQgY2FuIGJlIGRvbmUgaGVyZVxuICAgICAqXG4gICAgICogQHBhcmFtIGFyZ3NcbiAgICAgKi9cbiAgICBwdWJsaWMgcHJlbG9hZEFkKC4uLmFyZ3M6IGFueVtdKTogdm9pZCB7XG4gICAgICAgIGlmIChudWxsID09PSB0aGlzLnByb3ZpZGVyKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0NhbiBub3QgcHJlbG9hZCBhbiBhZCB3aXRob3V0IGFuIHByb3ZpZGVyLCBwbGVhc2UgYXR0YWNoIGFuIGFkIHByb3ZpZGVyIScpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5wcm92aWRlci5wcmVsb2FkQWQuYXBwbHkodGhpcy5wcm92aWRlciwgYXJncyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU29tZSBwcm92aWRlcnMgcmVxdWlyZSB5b3UgdG8gZGVzdHJveSBhbiBhZGQgYWZ0ZXIgaXQgd2FzIHNob3duLCB0aGF0IGNhbiBiZSBkb25lIGhlcmUuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gYXJnc1xuICAgICAqL1xuICAgIHB1YmxpYyBkZXN0cm95QWQoLi4uYXJnczogYW55W10pOiB2b2lkIHtcbiAgICAgICAgaWYgKG51bGwgPT09IHRoaXMucHJvdmlkZXIpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignQ2FuIG5vdCBkZXN0cm95IGFuIGFkIHdpdGhvdXQgYW4gcHJvdmlkZXIsIHBsZWFzZSBhdHRhY2ggYW4gYWQgcHJvdmlkZXIhJyk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnByb3ZpZGVyLmRlc3Ryb3lBZC5hcHBseSh0aGlzLnByb3ZpZGVyLCBhcmdzKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTb21lIHByb3ZpZGVycyBhbGxvdyB5b3UgdG8gaGlkZSBhbiBhZCwgeW91IG1pZ2h0IHRoaW5rIG9mIGFuIGJhbm5lciBhZCB0aGF0IGlzIHNob3duIGluIHNob3cgY2FzZXNcbiAgICAgKlxuICAgICAqIEBwYXJhbSBhcmdzXG4gICAgICovXG4gICAgcHVibGljIGhpZGVBZCguLi5hcmdzOiBhbnlbXSk6IHZvaWQge1xuICAgICAgICBpZiAobnVsbCA9PT0gdGhpcy5wcm92aWRlcikge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdDYW4gbm90IGhpZGUgYW4gYWQgd2l0aG91dCBhbiBwcm92aWRlciwgcGxlYXNlIGF0dGFjaCBhbiBhZCBwcm92aWRlciEnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMudW5NdXRlQWZ0ZXJBZCgpO1xuXG4gICAgICAgIHRoaXMucHJvdmlkZXIuaGlkZUFkLmFwcGx5KHRoaXMucHJvdmlkZXIsIGFyZ3MpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENoZWNrcyBpZiBhZHMgYXJlIGVuYWJsZWQgb3IgYmxvY2tlZFxuICAgICAqXG4gICAgICogQHBhcmFtIGFyZ3NcbiAgICAgKi9cbiAgICBwdWJsaWMgYWRzRW5hYmxlZCgpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucHJvdmlkZXIuYWRzRW5hYmxlZDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTaG91bGQgYmUgY2FsbGVkIGFmdGVyIGFkIHdhcyhuJ3QpIHNob3duLCBkZW11dGVzIHRoZSBnYW1lIHNvIHdlIGNhbiBwZWFjZWZ1bGx5IGNvbnRpbnVlXG4gICAgICovXG4gICAgcHVibGljIHVuTXV0ZUFmdGVyQWQoKTogdm9pZCB7XG4gICAgICAgIC8vSGVyZSB3ZSB1bm11dGUgYXVkaW8sIGJ1dCBvbmx5IGlmIGl0IHdhc24ndCBtdXRlZCBiZWZvcmUgcmVxdWVzdGluZyBhbiBhZGRcbiAgICB9XG59XG4iXSwic291cmNlUm9vdCI6IiJ9
