// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

(function (modules, entry, mainEntry, parcelRequireName, globalName) {
  /* eslint-disable no-undef */
  var globalObject =
    typeof globalThis !== 'undefined'
      ? globalThis
      : typeof self !== 'undefined'
      ? self
      : typeof window !== 'undefined'
      ? window
      : typeof global !== 'undefined'
      ? global
      : {};
  /* eslint-enable no-undef */

  // Save the require from previous bundle to this closure if any
  var previousRequire =
    typeof globalObject[parcelRequireName] === 'function' &&
    globalObject[parcelRequireName];

  var cache = previousRequire.cache || {};
  // Do not use `require` to prevent Webpack from trying to bundle this call
  var nodeRequire =
    typeof module !== 'undefined' &&
    typeof module.require === 'function' &&
    module.require.bind(module);

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire =
          typeof globalObject[parcelRequireName] === 'function' &&
          globalObject[parcelRequireName];
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error("Cannot find module '" + name + "'");
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = (cache[name] = new newRequire.Module(name));

      modules[name][0].call(
        module.exports,
        localRequire,
        module,
        module.exports,
        this
      );
    }

    return cache[name].exports;

    function localRequire(x) {
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x) {
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [
      function (require, module) {
        module.exports = exports;
      },
      {},
    ];
  };

  Object.defineProperty(newRequire, 'root', {
    get: function () {
      return globalObject[parcelRequireName];
    },
  });

  globalObject[parcelRequireName] = newRequire;

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (mainEntry) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(mainEntry);

    // CommonJS
    if (typeof exports === 'object' && typeof module !== 'undefined') {
      module.exports = mainExports;

      // RequireJS
    } else if (typeof define === 'function' && define.amd) {
      define(function () {
        return mainExports;
      });

      // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }
})({"2BVkE":[function(require,module,exports) {
var HMR_HOST = null;
var HMR_PORT = null;
var HMR_SECURE = false;
var HMR_ENV_HASH = "4a236f9275d0a351";
module.bundle.HMR_BUNDLE_ID = "9d10f64f2d0fb0e7";
"use strict";
function _createForOfIteratorHelper(o, allowArrayLike) {
    var it;
    if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) {
        if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
            if (it) o = it;
            var i = 0;
            var F = function F() {
            };
            return {
                s: F,
                n: function n() {
                    if (i >= o.length) return {
                        done: true
                    };
                    return {
                        done: false,
                        value: o[i++]
                    };
                },
                e: function e(_e) {
                    throw _e;
                },
                f: F
            };
        }
        throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }
    var normalCompletion = true, didErr = false, err;
    return {
        s: function s() {
            it = o[Symbol.iterator]();
        },
        n: function n() {
            var step = it.next();
            normalCompletion = step.done;
            return step;
        },
        e: function e(_e2) {
            didErr = true;
            err = _e2;
        },
        f: function f() {
            try {
                if (!normalCompletion && it.return != null) it.return();
            } finally{
                if (didErr) throw err;
            }
        }
    };
}
function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}
function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
    return arr2;
}
/* global HMR_HOST, HMR_PORT, HMR_ENV_HASH, HMR_SECURE */ /*::
import type {
  HMRAsset,
  HMRMessage,
} from '@parcel/reporter-dev-server/src/HMRServer.js';
interface ParcelRequire {
  (string): mixed;
  cache: {|[string]: ParcelModule|};
  hotData: mixed;
  Module: any;
  parent: ?ParcelRequire;
  isParcelRequire: true;
  modules: {|[string]: [Function, {|[string]: string|}]|};
  HMR_BUNDLE_ID: string;
  root: ParcelRequire;
}
interface ParcelModule {
  hot: {|
    data: mixed,
    accept(cb: (Function) => void): void,
    dispose(cb: (mixed) => void): void,
    // accept(deps: Array<string> | string, cb: (Function) => void): void,
    // decline(): void,
    _acceptCallbacks: Array<(Function) => void>,
    _disposeCallbacks: Array<(mixed) => void>,
  |};
}
declare var module: {bundle: ParcelRequire, ...};
declare var HMR_HOST: string;
declare var HMR_PORT: string;
declare var HMR_ENV_HASH: string;
declare var HMR_SECURE: boolean;
*/ var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;
function Module(moduleName) {
    OldModule.call(this, moduleName);
    this.hot = {
        data: module.bundle.hotData,
        _acceptCallbacks: [],
        _disposeCallbacks: [],
        accept: function accept(fn) {
            this._acceptCallbacks.push(fn || function() {
            });
        },
        dispose: function dispose(fn) {
            this._disposeCallbacks.push(fn);
        }
    };
    module.bundle.hotData = undefined;
}
module.bundle.Module = Module;
var checkedAssets, acceptedAssets, assetsToAccept;
function getHostname() {
    return HMR_HOST || (location.protocol.indexOf('http') === 0 ? location.hostname : 'localhost');
}
function getPort() {
    return HMR_PORT || location.port;
} // eslint-disable-next-line no-redeclare
var parent = module.bundle.parent;
if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
    var hostname = getHostname();
    var port = getPort();
    var protocol = HMR_SECURE || location.protocol == 'https:' && !/localhost|127.0.0.1|0.0.0.0/.test(hostname) ? 'wss' : 'ws';
    var ws = new WebSocket(protocol + '://' + hostname + (port ? ':' + port : '') + '/'); // $FlowFixMe
    ws.onmessage = function(event) {
        checkedAssets = {
        };
        acceptedAssets = {
        };
        assetsToAccept = [];
        var data = JSON.parse(event.data);
        if (data.type === 'update') {
            // Remove error overlay if there is one
            if (typeof document !== 'undefined') removeErrorOverlay();
            var assets = data.assets.filter(function(asset) {
                return asset.envHash === HMR_ENV_HASH;
            }); // Handle HMR Update
            var handled = assets.every(function(asset) {
                return asset.type === 'css' || asset.type === 'js' && hmrAcceptCheck(module.bundle.root, asset.id, asset.depsByBundle);
            });
            if (handled) {
                console.clear();
                assets.forEach(function(asset) {
                    hmrApply(module.bundle.root, asset);
                });
                for(var i = 0; i < assetsToAccept.length; i++){
                    var id = assetsToAccept[i][1];
                    if (!acceptedAssets[id]) hmrAcceptRun(assetsToAccept[i][0], id);
                }
            } else window.location.reload();
        }
        if (data.type === 'error') {
            // Log parcel errors to console
            var _iterator = _createForOfIteratorHelper(data.diagnostics.ansi), _step;
            try {
                for(_iterator.s(); !(_step = _iterator.n()).done;){
                    var ansiDiagnostic = _step.value;
                    var stack = ansiDiagnostic.codeframe ? ansiDiagnostic.codeframe : ansiDiagnostic.stack;
                    console.error('🚨 [parcel]: ' + ansiDiagnostic.message + '\n' + stack + '\n\n' + ansiDiagnostic.hints.join('\n'));
                }
            } catch (err) {
                _iterator.e(err);
            } finally{
                _iterator.f();
            }
            if (typeof document !== 'undefined') {
                // Render the fancy html overlay
                removeErrorOverlay();
                var overlay = createErrorOverlay(data.diagnostics.html); // $FlowFixMe
                document.body.appendChild(overlay);
            }
        }
    };
    ws.onerror = function(e) {
        console.error(e.message);
    };
    ws.onclose = function() {
        console.warn('[parcel] 🚨 Connection to the HMR server was lost');
    };
}
function removeErrorOverlay() {
    var overlay = document.getElementById(OVERLAY_ID);
    if (overlay) {
        overlay.remove();
        console.log('[parcel] ✨ Error resolved');
    }
}
function createErrorOverlay(diagnostics) {
    var overlay = document.createElement('div');
    overlay.id = OVERLAY_ID;
    var errorHTML = '<div style="background: black; opacity: 0.85; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; font-family: Menlo, Consolas, monospace; z-index: 9999;">';
    var _iterator2 = _createForOfIteratorHelper(diagnostics), _step2;
    try {
        for(_iterator2.s(); !(_step2 = _iterator2.n()).done;){
            var diagnostic = _step2.value;
            var stack = diagnostic.codeframe ? diagnostic.codeframe : diagnostic.stack;
            errorHTML += "\n      <div>\n        <div style=\"font-size: 18px; font-weight: bold; margin-top: 20px;\">\n          \uD83D\uDEA8 ".concat(diagnostic.message, "\n        </div>\n        <pre>").concat(stack, "</pre>\n        <div>\n          ").concat(diagnostic.hints.map(function(hint) {
                return '<div>💡 ' + hint + '</div>';
            }).join(''), "\n        </div>\n        ").concat(diagnostic.documentation ? "<div>\uD83D\uDCDD <a style=\"color: violet\" href=\"".concat(diagnostic.documentation, "\" target=\"_blank\">Learn more</a></div>") : '', "\n      </div>\n    ");
        }
    } catch (err) {
        _iterator2.e(err);
    } finally{
        _iterator2.f();
    }
    errorHTML += '</div>';
    overlay.innerHTML = errorHTML;
    return overlay;
}
function getParents(bundle, id) /*: Array<[ParcelRequire, string]> */ {
    var modules = bundle.modules;
    if (!modules) return [];
    var parents = [];
    var k, d, dep;
    for(k in modules)for(d in modules[k][1]){
        dep = modules[k][1][d];
        if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) parents.push([
            bundle,
            k
        ]);
    }
    if (bundle.parent) parents = parents.concat(getParents(bundle.parent, id));
    return parents;
}
function updateLink(link) {
    var newLink = link.cloneNode();
    newLink.onload = function() {
        if (link.parentNode !== null) // $FlowFixMe
        link.parentNode.removeChild(link);
    };
    newLink.setAttribute('href', link.getAttribute('href').split('?')[0] + '?' + Date.now()); // $FlowFixMe
    link.parentNode.insertBefore(newLink, link.nextSibling);
}
var cssTimeout = null;
function reloadCSS() {
    if (cssTimeout) return;
    cssTimeout = setTimeout(function() {
        var links = document.querySelectorAll('link[rel="stylesheet"]');
        for(var i = 0; i < links.length; i++){
            // $FlowFixMe[incompatible-type]
            var href = links[i].getAttribute('href');
            var hostname = getHostname();
            var servedFromHMRServer = hostname === 'localhost' ? new RegExp('^(https?:\\/\\/(0.0.0.0|127.0.0.1)|localhost):' + getPort()).test(href) : href.indexOf(hostname + ':' + getPort());
            var absolute = /^https?:\/\//i.test(href) && href.indexOf(window.location.origin) !== 0 && !servedFromHMRServer;
            if (!absolute) updateLink(links[i]);
        }
        cssTimeout = null;
    }, 50);
}
function hmrApply(bundle, asset) {
    var modules = bundle.modules;
    if (!modules) return;
    if (asset.type === 'css') reloadCSS();
    else if (asset.type === 'js') {
        var deps = asset.depsByBundle[bundle.HMR_BUNDLE_ID];
        if (deps) {
            var fn = new Function('require', 'module', 'exports', asset.output);
            modules[asset.id] = [
                fn,
                deps
            ];
        } else if (bundle.parent) hmrApply(bundle.parent, asset);
    }
}
function hmrAcceptCheck(bundle, id, depsByBundle) {
    var modules = bundle.modules;
    if (!modules) return;
    if (depsByBundle && !depsByBundle[bundle.HMR_BUNDLE_ID]) {
        // If we reached the root bundle without finding where the asset should go,
        // there's nothing to do. Mark as "accepted" so we don't reload the page.
        if (!bundle.parent) return true;
        return hmrAcceptCheck(bundle.parent, id, depsByBundle);
    }
    if (checkedAssets[id]) return true;
    checkedAssets[id] = true;
    var cached = bundle.cache[id];
    assetsToAccept.push([
        bundle,
        id
    ]);
    if (cached && cached.hot && cached.hot._acceptCallbacks.length) return true;
    var parents = getParents(module.bundle.root, id); // If no parents, the asset is new. Prevent reloading the page.
    if (!parents.length) return true;
    return parents.some(function(v) {
        return hmrAcceptCheck(v[0], v[1], null);
    });
}
function hmrAcceptRun(bundle, id) {
    var cached = bundle.cache[id];
    bundle.hotData = {
    };
    if (cached && cached.hot) cached.hot.data = bundle.hotData;
    if (cached && cached.hot && cached.hot._disposeCallbacks.length) cached.hot._disposeCallbacks.forEach(function(cb) {
        cb(bundle.hotData);
    });
    delete bundle.cache[id];
    bundle(id);
    cached = bundle.cache[id];
    if (cached && cached.hot && cached.hot._acceptCallbacks.length) cached.hot._acceptCallbacks.forEach(function(cb) {
        var assetsToAlsoAccept = cb(function() {
            return getParents(module.bundle.root, id);
        });
        if (assetsToAlsoAccept && assetsToAccept.length) // $FlowFixMe[method-unbinding]
        assetsToAccept.push.apply(assetsToAccept, assetsToAlsoAccept);
    });
    acceptedAssets[id] = true;
}

},{}],"hz7aF":[function(require,module,exports) {
!function() {
    function e1(e, t) {
        var n = new XMLHttpRequest;
        n.onreadystatechange = function() {
            4 === n.readyState && t(n.responseText);
        }, n.open("GET", e, !0), n.send();
    }
    function t1(e, t, n) {
        Object.defineProperty ? Object.defineProperty(e, t, n) : e[t] = n.get();
    }
    var n1, r1 = window.CSS;
    r1 || (window.CSS = r1 = {
    }), r1.supports || (r1.supports = function e(t, n) {
        if ("paint" == t) return !0;
        if (n) {
            var r = u1.contentDocument.body;
            return r.style.cssText = t + ":" + n, r.style.cssText.length > 0;
        }
        for(var i, o, a, s, l = /(^|not|(or)|(and))\s*\(\s*(.+?)\s*:(.+?)\)\s*|(.)/gi; a = l.exec(t);){
            if (a[6]) return !1;
            s = e(a[4], a[5]), o = a[2] ? o || s : a[3] ? o && s : (i = !a[1], s);
        }
        return o == i;
    }), r1.escape || (r1.escape = function(e) {
        return e.replace(/([^\w-])/g, "\\$1");
    });
    var i1 = {
    };
    function o1(e, t) {
        var n = parseFloat(e);
        this.value = isNaN(n) ? e : n, this.unit = t;
    }
    r1.registerProperty || (r1.registerProperty = function(e) {
        i1[e.name] = e;
    }), o1.prototype.toString = function() {
        return this.value + ("number" == this.unit ? "" : this.unit);
    }, o1.prototype.valueOf = function() {
        return this.value;
    }, "Hz Q ch cm deg dpcm dpi ddpx em ex fr grad in kHz mm ms number pc percent pt px rad rem s turn vh vmax vmin vw".split(" ").forEach(function(e) {
        r1[e] || (r1[e] = function(t) {
            return new o1(t, e);
        });
    });
    var a1 = /(background|mask|cursor|-image|-source)/, s1 = !!r1.paintWorklet;
    s1 || (n1 = new ie1, t1(r1, "paintWorklet", {
        enumerable: !0,
        configurable: !0,
        get: function() {
            return n1;
        }
    }));
    var l1 = "css-paint-polyfill", c1 = document.createElement(l1);
    s1 || document.documentElement.appendChild(c1);
    var u1 = document.createElement("iframe");
    u1.style.cssText = "position:absolute; left:0; top:-999px; width:1px; height:1px;", c1.appendChild(u1);
    var p1 = document.createElement("style");
    p1.id = l1, p1.$$isPaint = !0, c1.appendChild(p1);
    var d1 = p1.sheet, f1 = c1.style, v1 = !1, h1 = [], m1 = /(paint\(|-moz-element\(#paint-|-webkit-canvas\(paint-|[('"]blob:[^'"#]+#paint=|[('"]data:image\/paint-)/, g1 = "getCSSCanvasContext" in document, y = (f1.backgroundImage = "-moz-element(#" + l1 + ")") === f1.backgroundImage, $1 = "function" == typeof Promise;
    f1.cssText = "display:none !important;";
    var b1 = window.requestAnimationFrame || setTimeout, w = function() {
        return window.devicePixelRatio || 1;
    }, P = {
    }, x1 = {
    }, R1 = 0;
    function S(e) {
        var t = e.bit ^= 1;
        return e.instances[t] || (e.instances[t] = new e.Painter);
    }
    function O1(e2, t2) {
        var n2 = e2.cssText, r2 = m1.test(n2);
        if (!0 === t2.isNew && r2 && n2 !== (n2 = z1(n2)) && (e2 = (function(e, t) {
            for(var n = e.parentStyleSheet, r = e.parentRule, i = (r || n).cssRules, o = i.length - 1, a = 0; a <= o; a++)if (i[a] === e) {
                (r || n).deleteRule(a), o = a;
                break;
            }
            if (null != t) {
                if (r) {
                    var s = r.appendRule(t);
                    return r.cssRules[s];
                }
                return n.insertRule(t, o), n.cssRules[o];
            }
        })(e2, n2)), r2) {
            var i2, o2, a2, s = e2.selectorText, l = B1(e2.style);
            if (i2 = null == t2.counters[s] ? t2.counters[s] = 1 : ++t2.counters[s], null != x1[o2 = "sheet" + t2.sheetId + "\n" + s + "\n" + i2]) {
                if ((a2 = x1[o2]).selector === s) return a2.rule = e2, void (a2.cssText !== l && t2.toProcess.push(a2));
                t2.toRemove.push(a2);
            } else a2 = x1[o2] = {
                key: o2,
                selector: s,
                cssText: l,
                properties: {
                },
                rule: e2
            }, t2.toProcess.push(a2.selector);
        }
    }
    function C1(e, t) {
        if (!("ownerSVGElement" in e)) {
            t(e);
            for(var n = e.firstElementChild; n;)C1(n, t), n = n.nextElementSibling;
        }
    }
    function T1() {
        for(var e, t = [].slice.call(document.styleSheets), n = {
            toProcess: [],
            toRemove: [],
            counters: {
            },
            isNew: !1,
            sheetId: null,
            rules: null
        }, r = 0; r < t.length; r++){
            var i = t[r].ownerNode;
            if (!i.$$isPaint) {
                try {
                    n.rules = i.sheet.cssRules;
                } catch (e3) {
                    continue;
                }
                if (n.sheetId = i.$$paintid, n.isNew = null == n.sheetId, n.isNew) {
                    if (n.sheetId = i.$$paintid = ++R1, !1 === k1(i)) continue;
                    e = !0;
                }
                E1(i.sheet, O1, n);
            }
        }
        for(var o = n.toRemove.length; o--;)delete x1[n.toRemove[o].key];
        n.toProcess.length > 0 && F1(n.toProcess.join(", ")), e && F1("[data-css-paint]", !0);
    }
    function E1(t, n, r) {
        var i = [
            [
                0,
                t.cssRules
            ]
        ], o = i[0], a = o[1];
        if (a) for(var s = 0; i.length > 0; s++)if (s >= a.length) {
            i.pop();
            var l = i.length;
            l > 0 && (a = (o = i[l - 1])[1], s = o[0]);
        } else {
            o[0] = s;
            var c = a[s];
            if (3 !== c.type) {
                if (1 === c.type) {
                    var u = n(c, r);
                    void 0 !== u && (r = u);
                } else c.cssRules && c.cssRules.length > 0 && i.push([
                    0,
                    c.cssRules
                ]);
            } else {
                if (c.$$isPaint) continue;
                var p = c.media && c.media.mediaText;
                if (p && !self.matchMedia(p).matches) continue;
                if (/ts\.g.{7}is\.com\/css/.test(c.href)) continue;
                c.$$isPaint = !0, e1(c.href, N1);
            }
        }
        return r;
    }
    function k1(t) {
        if (!t.$$isPaint) {
            if (t.href) return e1(t.href, N1), !1;
            for(var n = t.childNodes.length; n--;){
                var r = t.childNodes[n].nodeValue, i = z1(r);
                i !== r && (t.childNodes[n].nodeValue = i);
            }
        }
    }
    function N1(e4) {
        var t3 = function(e) {
            var t = u1.contentDocument.body, n = document.createElement("style");
            return n.media = "print", n.$$paintid = ++R1, n.appendChild(document.createTextNode(e)), t.appendChild(n), n.sheet.remove = function() {
                return t.removeChild(n);
            }, n.sheet;
        }(z1(e4));
        try {
            t3._ = t3.cssRules.length;
        } catch (e) {
            var n3 = function() {
                t3 && G1(t3), t3 = null, clearTimeout(r);
            };
            t3.ownerNode.onload = t3.ownerNode.onerror = n3;
            var r = setTimeout(n3, 5000);
            return;
        }
        G1(t3);
    }
    function G1(e5) {
        var t = "";
        if (E1(e5, function(e) {
            if (1 === e.type) {
                for(var n = "", r = 0; r < e.style.length; r++){
                    var i = e.style.item(r), o = e.style.getPropertyValue(i);
                    m1.test(o) && (n = i + ": " + o + e.style.getPropertyPriority(i) + ";");
                }
                if (n) {
                    n = e.selectorText + "{" + n + "}";
                    for(var a = e; a = a.parentRule;)n = "" + a.cssText.match(/^[\s\S]+?\{/)[0] + n + "}";
                    t += n;
                }
            }
        }), e5.remove(), t) {
            var n4 = document.createElement("style");
            n4.appendChild(document.createTextNode(t)), c1.appendChild(n4), T1();
        }
    }
    function z1(e) {
        return e.replace(/(;|,|\b)paint\s*\(\s*(['"]?)(.+?)\2\s*\)(;|,|!|\b|$)/g, "$1url(data:image/paint-$3,=)$4");
    }
    var V, D, L, j1 = [];
    function A1(e, t) {
        t && (e.$$paintObservedProperties = null, e.$$paintGeometry && !e.$$paintGeometry.live && (e.$$paintGeometry = null)), !0 !== e.$$paintPending && (e.$$paintPending = !0, -1 === j1.indexOf(e) && 1 === j1.push(e) && b1(I1));
    }
    function I1() {
        for(var e6, t = 0; t < j1.length; t++)j1[t] && "style" === j1[t].localName && (e6 = !0, j1[t] = null);
        if (e6) return b1(I1), void T1();
        var n = j1.length && j1.some(function(e) {
            return e && !0 === e.$$needsOverrides;
        });
        for(n && K(); j1.length;){
            var r = j1.pop();
            r && W1(r);
        }
        n && Y();
    }
    function F1(e, t) {
        try {
            for(var n = document.querySelectorAll(e), r = 0; r < n.length; r++)A1(n[r], t);
        } catch (e7) {
        }
    }
    function M(e, t, n) {
        for(var r = e.length, i = function() {
            --r || t.apply(null, n || h1);
        }, o = 0; o < e.length; o++){
            var a = new Image;
            a.onload = i, a.onerror = onerror, a.src = e[o];
        }
    }
    function H(e) {
        var t = e.$$paintId;
        return null == t && (t = e.$$paintId = ++Z1), t;
    }
    function U(e) {
        var t = e.$$paintRule, n = H(e);
        if (Number(e.getAttribute("data-css-paint")) !== n && e.setAttribute("data-css-paint", n), null == t) {
            var r = d1.insertRule('[data-css-paint="' + n + '"] {}', d1.cssRules.length);
            t = e.$$paintRule = d1.cssRules[r];
        }
        return t;
    }
    function B1(e) {
        var t = e.cssText;
        if (t) return t;
        t = "";
        for(var n = 0, r = void 0; n < e.length; n++)r = e[n], 0 !== n && (t += " "), t += r, t += ":", t += e.getPropertyValue(r), t += ";";
        return t;
    }
    function W1(e) {
        var t = getComputedStyle(e);
        if (e.$$paintObservedProperties && !e.$$needsOverrides) for(var n = 0; n < e.$$paintObservedProperties.length; n++){
            var r = e.$$paintObservedProperties[n];
            if (t.getPropertyValue(r).trim() !== e.$$paintedPropertyValues[r]) {
                _1(e, t);
                break;
            }
        }
        else if (e.$$paintId || m1.test(B1(t))) _1(e, t);
        else {
            var i = e.getAttribute("style");
            m1.test(i) && (e.style.cssText = i.replace(/;\s*$/, "") + "; " + e.style.cssText, _1(e));
        }
        e.$$paintPending = !1;
    }
    function q1(e) {
        e.$$paintGeometry && !e.$$paintGeometry.live && (e.$$paintGeometry = null), A1(e);
    }
    var Q = {
        get: function(e) {
            var t = i1[e], n = t && !1 === t.inherits ? D.style.getPropertyValue(e) : Q.getRaw(e);
            if (null == n && t) n = t.initialValue;
            else if (t && t.syntax) {
                var o = t.syntax.replace(/[<>\s]/g, "");
                "function" == typeof r1[o] && (n = r1[o](n));
            }
            return "string" == typeof n && (n = n.trim()), n;
        },
        getRaw: function(e) {
            if (e in L) return L[e];
            var t = V.getPropertyValue(e);
            return "string" == typeof t && (t = t.trim()), L[e] = t;
        }
    };
    var X = window.ResizeObserver && new window.ResizeObserver(function(e) {
        for(var t = 0; t < e.length; t++){
            var n = e[t], r = n.target.$$paintGeometry;
            r ? r.live = !0 : r = n.target.$$paintGeometry = {
                width: 0,
                height: 0,
                live: !0
            };
            var i = n.borderBoxSize;
            if (i && i.length && (i = i[0]), i) r.width = 0 | i.inlineSize, r.height = 0 | i.blockSize;
            else {
                var o = getComputedStyle(n.target), a = parseFloat(o.paddingLeft) + parseFloat(o.paddingRight), s = parseFloat(o.paddingTop) + parseFloat(o.paddingBottom);
                r.width = Math.round((n.contentRect.right - n.contentRect.left || n.contentRect.width) + a), r.height = Math.round((n.contentRect.bottom - n.contentRect.top || n.contentRect.height) + s);
            }
            A1(n.target, !0);
        }
    });
    var Z1 = 0;
    function _1(e8, t) {
        !0 === e8.$$needsOverrides && K();
        var n, r = V = null == t ? getComputedStyle(e8) : t;
        D = e8, L = {
        };
        var i = [];
        e8.$$paintPending = !1;
        var o = function(e) {
            return e.$$paintGeometry || (e.$$paintGeometry = {
                width: e.clientWidth,
                height: e.clientHeight,
                live: !1
            });
        }(e8);
        !function(e) {
            X && !e.$$paintGeometry.live && (e.$$paintGeometry.live = !0, X.observe(e));
        }(e8), o = {
            width: o.width,
            height: o.height
        };
        for(var s = w(), l = e8.$$paintedProperties, u = 0; u < r.length; u++){
            var p = r[u], d = Q.getRaw(p), f = /(,|\b|^)(?:url\((['"]?))?((?:-moz-element\(#|-webkit-canvas\()paint-\d+-([^;,]+)|(?:data:image\/paint-|blob:[^'"#]+#paint=)([^"';, ]+)(?:[;,].*?)?)\2\)(;|,|\s|\b|$)/g, v = "", h = 0, m = [], $ = !1, b = !1, x = void 0, R = void 0, O = !1, C = o;
            if (a1.test(p) && "-webkit-border-image" !== p) {
                if (/border-image/.test(p)) {
                    var T = C.width, E = C.height, k = re(Q.getRaw("border-image-slice").replace(/\sfill/, "").split(" ")), N = re(Q.getRaw("border-width").split(" ")), G = re(Q.getRaw("border-image-outset").split(" "));
                    T += ne("0" != k.left && parseFloat(N.left) || 0, G.left || 0, !0), T += ne("0" != k.right && parseFloat(N.right) || 0, G.right || 0, !0), E += ne("0" != k.top && parseFloat(N.top) || 0, G.top || 0, !0), O = !0, C = {
                        width: T,
                        height: E += ne("0" != k.bottom && parseFloat(N.bottom) || 0, G.bottom || 0, !0)
                    };
                }
                for(; R = f.exec(d);){
                    !1 === b && (x = H(e8)), b = !0, v += d.substring(0, R.index);
                    var z = R[4] || R[5], j = R[3], A = P[z], I = A && A.Painter.contextOptions || {
                    }, F = O || !1 === I.scaling ? 1 : s, B = void 0;
                    A && (A.Painter.inputProperties && i.push.apply(i, A.Painter.inputProperties), B = S(A)), !0 === I.nativePixels && (C.width *= s, C.height *= s, F = 1);
                    var W = F * C.width, q = F * C.height, Z = e8.$$paintContext, _ = "paint-" + x + "-" + z, J = Z && Z.canvas;
                    if (!J || J.width != W || J.height != q || !0 === g1 && Z && _ !== Z.id) {
                        if (!0 === g1) (Z = document.getCSSCanvasContext("2d", _, W, q)).id = _, e8.$$paintContext && Z.clearRect(0, 0, W, q);
                        else {
                            var ie = !1;
                            J || ((J = document.createElement("canvas")).id = _, ie = y), J.width = W, J.height = q, ie && (J.style.display = "none", c1.appendChild(J)), Z = J.getContext("2d");
                        }
                        e8.$$paintContext = Z, Z.imageSmoothingEnabled = !1, 1 !== F && Z.scale(F, F);
                    } else Z.clearRect(0, 0, W, q);
                    if (B && (Z.save(), Z.beginPath(), B.paint(Z, C, Q), Z.closePath(), Z.restore(), !1 === g1 && !y && "resetTransform" in Z && Z.resetTransform()), v += R[1], !0 === g1) v += "-webkit-canvas(" + _ + ")", (null == R[4] || J && J.id !== _) && ($ = !0);
                    else if (!0 === y) v += "-moz-element(#" + _ + ")", null == R[4] && ($ = !0), J && J.id !== _ && (J.id = _, $ = !0);
                    else {
                        var oe = J.toDataURL("image/png").replace("/png", "/paint-" + z);
                        if ("function" == typeof MSBlobBuilder && (oe = ee(oe, z)), m.push(oe), v += 'url("' + oe + '")', oe !== j || !n) {
                            var ae = j ? j.indexOf("#") : -1;
                            ~ae && URL.revokeObjectURL(j.substring(0, ae)), $ = !0;
                        }
                        j = oe;
                    }
                    v += R[6], h = R.index + R[0].length;
                }
                !1 !== b || null == l || null == l[p] ? (v += d.substring(h), $ && (n || (n = U(e8)), null == l && (l = e8.$$paintedProperties = {
                }), l[p] = !0, "background" === p.substring(0, 10) && 1 !== s && te(n.style, "background-size", "100% 100%"), /mask/.test(p) && 1 !== s && (te(n.style, "mask-size", "contain"), g1 && te(n.style, "-webkit-mask-size", "contain")), /border-image/.test(p) && g1 && (te(n.style, "border-color", "initial"), te(n.style, "image-rendering", "optimizeSpeed")), 0 === m.length ? te(n.style, p, v) : M(m, te, [
                    n.style,
                    p,
                    v
                ]))) : (n || (n = U(e8)), n.style.removeProperty(p), X && X.unobserve(e8), e8.$$paintGeometry && (e8.$$paintGeometry.live = !1));
            }
        }
        e8.$$paintObservedProperties = 0 === i.length ? null : i;
        for(var se = e8.$$paintedPropertyValues = {
        }, le = 0; le < i.length; le++){
            var ce = i[le];
            se[ce] = Q.getRaw(ce);
        }
        !0 === e8.$$needsOverrides && Y(), e8.$$needsOverrides = null;
    }
    var J1 = 0;
    function K() {
        J1++ || (p1.disabled = !0);
    }
    function Y() {
        --J1 || (p1.disabled = !1);
    }
    function ee(e, t) {
        for(var n = atob(e.split(",")[1]), r = new Uint8Array(n.length), i = 0; i < n.length; i++)r[i] = n.charCodeAt(i);
        return URL.createObjectURL(new Blob([
            r
        ])) + "#paint=" + t;
    }
    function te(e, t, n) {
        var r = v1;
        v1 = !0, e.setProperty(t, n, "important"), v1 = r;
    }
    function ne(e, t, n) {
        var r = n ? 0 : e, i = parseFloat(t);
        return t ? t.match("px") ? r + i : (t.match("%") && (i /= 100), e * i) : r;
    }
    function re(e) {
        return {
            top: e[0],
            bottom: e[2] || e[0],
            left: e[3] || e[1] || e[0],
            right: e[1] || e[0]
        };
    }
    function ie1() {
    }
    if (ie1.prototype.addModule = function(n5) {
        var r3, i3, o3 = this;
        return $1 && (r3 = new Promise(function(e) {
            return i3 = e;
        })), e1(n5, function(e9) {
            var n6 = {
                registerPaint: function(e10, t4) {
                    !function(e, t, n) {
                        P[e] = {
                            worklet: n,
                            Painter: t,
                            properties: t.inputProperties ? [].slice.call(t.inputProperties) : [],
                            bit: 0,
                            instances: []
                        };
                        for(var r = "", i = d1.cssRules.length; i--;){
                            var o = d1.cssRules[i];
                            -1 !== o.style.cssText.indexOf("-" + e) && (r += o.selectorText);
                        }
                        r && F1(r, !0);
                    }(e10, t4, {
                        context: n6,
                        realm: r4
                    });
                }
            };
            t1(n6, "devicePixelRatio", {
                get: w
            }), n6.self = n6;
            var r4 = new function(e, t) {
                var n = document.createElement("iframe");
                n.style.cssText = "position:absolute; left:0; top:-999px; width:1px; height:1px;", t.appendChild(n);
                var r = n.contentWindow, i = r.document, o = "var window,$hook";
                for(var a in r)a in e || "eval" === a || (o += ",", o += a);
                for(var s in e)o += ",", o += s, o += "=self.", o += s;
                var l = i.createElement("script");
                l.appendChild(i.createTextNode('function $hook(self,console) {"use strict";\n\t\t' + o + ";return function() {return eval(arguments[0])}}")), i.body.appendChild(l), this.exec = r.$hook(e, console);
            }(n6, u1.contentDocument && u1.contentDocument.body || c1);
            e9 = (o3.transpile || String)(e9), r4.exec(e9), i3 && i3();
        }), r3;
    }, !s1) try {
        !function() {
            var e11 = !1;
            new MutationObserver(function(t) {
                if (!0 !== e11 && !J1) {
                    e11 = !0;
                    for(var n = 0; n < t.length; n++){
                        var r = t[n], i = r.target, o = void 0, a = void 0;
                        if (!(i && "ownerSVGElement" in i)) {
                            if ("childList" === r.type) {
                                if (o = r.addedNodes) for(var s = 0; s < o.length; s++)1 === o[s].nodeType && C1(o[s], A1);
                                if (a = r.removedNodes) for(var l = 0; l < a.length; l++)X && a[l].$$paintGeometry && (a[l].$$paintGeometry.live = !1, X && X.unobserve(a[l]));
                            } else if ("attributes" === r.type && 1 === i.nodeType) {
                                if ("data-css-paint" === r.attributeName && r.oldValue && null != i.$$paintId && !i.getAttribute("data-css-paint")) {
                                    H(i);
                                    continue;
                                }
                                C1(i, q1);
                            }
                        }
                    }
                    e11 = !1;
                }
            }).observe(document.body, {
                childList: !0,
                attributes: !0,
                attributeOldValue: !0,
                subtree: !0
            });
            var n7 = Object.getOwnPropertyDescriptor(Element.prototype, "setAttribute"), r5 = n7.value;
            n7.value = function(e, t) {
                return "style" === e && m1.test(t) && (t = z1(t), H(this), this.$$needsOverrides = !0, q1(this)), r5.call(this, e, t);
            }, t1(Element.prototype, "setAttribute", n7);
            var i4 = Object.getOwnPropertyDescriptor(Element.prototype, "removeAttribute"), o4 = i4.value;
            i4.value = function(e) {
                if ("data-css-paint" !== e) return o4.call(this, e);
            }, t1(Element.prototype, "removeAttribute", i4);
            var s2 = Object.getOwnPropertyDescriptor(HTMLElement.prototype, "style"), l2 = s2.get;
            s2.set = function(e) {
                return s2.get.call(this).cssText = e;
            }, s2.get = function() {
                var e = l2.call(this);
                return e.ownerElement !== this && t1(e, "ownerElement", {
                    value: this
                }), e;
            }, t1(HTMLElement.prototype, "style", s2);
            var c = {
            }, u = Object.getOwnPropertyDescriptor(CSSStyleDeclaration.prototype, "cssText"), p = u.set;
            u.set = function(e) {
                if (!J1 && m1.test(e)) {
                    e = e && z1(e);
                    var t = this.ownerElement;
                    t && (H(t), t.$$needsOverrides = !0, q1(t));
                }
                return p.call(this, e);
            }, c.cssText = u, Object.keys((window.CSS2Properties || CSSStyleDeclaration).prototype).filter(function(e) {
                return a1.test(e);
            }).forEach(function(e12) {
                var t = e12.replace(/([A-Z])/g, "-$1").toLowerCase();
                c[e12] = {
                    configurable: !0,
                    enumerable: !0,
                    get: function() {
                        var e = this.getPropertyPriority(t);
                        return this.getPropertyValue(t) + (e ? " !" + e : "");
                    },
                    set: function(n) {
                        var r = String(n).match(/^(.*?)\s*(?:!\s*(important)\s*)?$/);
                        return this.setProperty(t, r[1], r[2]), this[e12];
                    }
                };
            });
            var d = Object.getOwnPropertyDescriptor(CSSStyleDeclaration.prototype, "setProperty"), f = d.value;
            d.value = function(e, t, n) {
                if (!v1 && !J1 && m1.test(t)) {
                    t = t && z1(t);
                    var r = this.ownerElement;
                    r && (H(r), r.$$needsOverrides = !0, q1(r));
                }
                f.call(this, e, t, n);
            }, c.setProperty = d, Object.defineProperties(CSSStyleDeclaration.prototype, c), window.CSS2Properties && Object.defineProperties(window.CSS2Properties.prototype, c), addEventListener("resize", function() {
                F1("[data-css-paint]");
            });
            var h = {
                passive: !0
            };
            function g(e) {
                for(var t = e.target; t;)1 === t.nodeType && A1(t), t = t.parentNode;
            }
            [
                "animationiteration",
                "animationend",
                "animationstart",
                "transitionstart",
                "transitionend",
                "transitionrun",
                "transitioncancel",
                "mouseover",
                "mouseout",
                "mousedown",
                "mouseup",
                "focus",
                "blur"
            ].forEach(function(e) {
                addEventListener(e, g, h);
            }), T1();
        }();
    } catch (e) {
    }
}();

},{}]},["2BVkE"], null, "parcelRequire18a3")

//# sourceMappingURL=css-paint-polyfill.2d0fb0e7.js.map
