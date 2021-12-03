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
})({"8YQT9":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
var _interface = require("./interface");
var _interfaceDefault = parcelHelpers.interopDefault(_interface);
var _marioGb = require("data-url:./mario.gb");
var _marioGbDefault = parcelHelpers.interopDefault(_marioGb);
var Buffer = require("buffer").Buffer;
function dataUriToBuffer(uri) {
    if (!/^data:/i.test(uri)) throw new TypeError('`uri` does not appear to be a Data URI (must begin with "data:")');
    // strip newlines
    uri = uri.replace(/\r?\n/g, "");
    // split the URI up into the "metadata" and the "data" portions
    const firstComma = uri.indexOf(",");
    if (firstComma === -1 || firstComma <= 4) throw new TypeError("malformed data: URI");
    // remove the "data:" scheme and parse the metadata
    const meta = uri.substring(5, firstComma).split(";");
    let charset = "";
    let base64 = false;
    const type = meta[0] || "text/plain";
    let typeFull = type;
    for(let i = 1; i < meta.length; i++)if (meta[i] === "base64") base64 = true;
    else {
        typeFull += `;${meta[i]}`;
        if (meta[i].indexOf("charset=") === 0) charset = meta[i].substring(8);
    }
    // defaults to US-ASCII only if type is not provided
    if (!meta[0] && !charset.length) {
        typeFull += ";charset=US-ASCII";
        charset = "US-ASCII";
    }
    // get the encoded data portion and decode URI-encoded chars
    const encoding = base64 ? "base64" : "ascii";
    const data = unescape(uri.substring(firstComma + 1));
    const buffer = Buffer.from(data, encoding);
    // set `.type` and `.typeFull` properties to MIME type
    buffer.type = type;
    buffer.typeFull = typeFull;
    // set the `.charset` property
    buffer.charset = charset;
    return buffer;
}
class GameboyPainter {
    constructor(){
        this.gb = new _interfaceDefault.default();
        this.isPainting = false;
        //console.log(fetch);
        this.gb.loadRom(dataUriToBuffer(_marioGbDefault.default));
    }
    static get inputProperties() {
        return [
            "--frame",
            "--button-a",
            "--button-b",
            "--button-up",
            "--button-down",
            "--button-left",
            "--button-right",
            "--button-start",
            "--button-select", 
        ];
    }
    propToVar(propName1) {
        return propName1.substr(2).replace(/-([a-z])/g, function(g) {
            return g[1].toUpperCase();
        });
    }
    parseProps(props) {
        const parsed = {
        };
        this.constructor.inputProperties.forEach((propName)=>{
            parsed[this.propToVar(propName)] = this.parseProp(propName, props);
        });
        return parsed;
    }
    parseProp(propName, props1) {
        const prop = props1.get(propName);
        // Cater for browsers that don't speak CSS Typed OM and
        // for browsers that do speak it, but haven't registered the props
        if (typeof CSSUnparsedValue === "undefined" || prop instanceof CSSUnparsedValue) {
            if (!prop.length || prop === "") return undefined;
            switch(propName){
                case "--frame":
                    return parseInt(prop.toString());
                case "--button-a":
                case "--button-b":
                case "--button-up":
                case "--button-down":
                case "--button-left":
                case "--button-right":
                case "--button-start":
                case "--button-select":
                    return parseInt(prop.toString());
                default:
                    return prop.toString().trim();
            }
        }
        if (prop instanceof CSSUnparsedValue && !prop.length) return undefined;
        // Prop is a UnitValue (Number, Percentage, Integer, …)
        // ~> Return the value
        if (prop instanceof CSSUnitValue) return prop.value;
        // All others (such as CSSKeywordValue)
        //~> Return the string
        return prop.toString().trim();
    }
    paint(ctx, geom, props2) {
        const SCALE = 2;
        const { buttonA , buttonB , buttonLeft , buttonRight , buttonUp , buttonDown , buttonStart , buttonSelect , frame: frameNumber ,  } = this.parseProps(props2);
        //console.log(this.parseProps(props));
        const pressed = [];
        if (buttonA) pressed.push("a");
        if (buttonB) pressed.push("b");
        if (buttonLeft) pressed.push("left");
        if (buttonRight) pressed.push("right");
        if (buttonUp) pressed.push("up");
        if (buttonDown) pressed.push("down");
        if (buttonStart) pressed.push("start");
        if (buttonSelect) pressed.push("select");
        this.gb.pressKeys(pressed);
        if (!this.isPainting) {
            this.isPainting = true;
            const frame = this.gb.doFrame();
            for(let x = 0; x < 160; x++)for(let y = 0; y < 144; y++){
                const start = (x + y * 160) * 4;
                const r = frame[start];
                const b = frame[start + 1];
                const g = frame[start + 2];
                ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
                ctx.fillRect(x * SCALE, y * SCALE, SCALE, SCALE);
            }
            this.isPainting = false;
        } else ctx.clearRect(0, 0, geom.width, geom.height);
    }
}
registerPaint("gameboy", GameboyPainter);

},{"buffer":"3MW4v","./interface":"d0FxK","data-url:./mario.gb":"kp9cl","@parcel/transformer-js/src/esmodule-helpers.js":"5AFiq"}],"3MW4v":[function(require,module,exports) {
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */ /* eslint-disable no-proto */ 'use strict';
var base64 = require('base64-js');
var ieee754 = require('ieee754');
var customInspectSymbol = typeof Symbol === 'function' && typeof Symbol['for'] === 'function' ? Symbol['for']('nodejs.util.inspect.custom') // eslint-disable-line dot-notation
 : null;
exports.Buffer = Buffer;
exports.SlowBuffer = SlowBuffer;
exports.INSPECT_MAX_BYTES = 50;
var K_MAX_LENGTH = 2147483647;
exports.kMaxLength = K_MAX_LENGTH;
/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Print warning and recommend using `buffer` v4.x which has an Object
 *               implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * We report that the browser does not support typed arrays if the are not subclassable
 * using __proto__. Firefox 4-29 lacks support for adding new properties to `Uint8Array`
 * (See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438). IE 10 lacks support
 * for __proto__ and has a buggy typed array implementation.
 */ Buffer.TYPED_ARRAY_SUPPORT = typedArraySupport();
if (!Buffer.TYPED_ARRAY_SUPPORT && typeof console !== 'undefined' && typeof console.error === 'function') console.error("This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support.");
function typedArraySupport() {
    // Can typed array instances can be augmented?
    try {
        var arr = new Uint8Array(1);
        var proto = {
            foo: function() {
                return 42;
            }
        };
        Object.setPrototypeOf(proto, Uint8Array.prototype);
        Object.setPrototypeOf(arr, proto);
        return arr.foo() === 42;
    } catch (e) {
        return false;
    }
}
Object.defineProperty(Buffer.prototype, 'parent', {
    enumerable: true,
    get: function() {
        if (!Buffer.isBuffer(this)) return undefined;
        return this.buffer;
    }
});
Object.defineProperty(Buffer.prototype, 'offset', {
    enumerable: true,
    get: function() {
        if (!Buffer.isBuffer(this)) return undefined;
        return this.byteOffset;
    }
});
function createBuffer(length) {
    if (length > K_MAX_LENGTH) throw new RangeError('The value "' + length + '" is invalid for option "size"');
    // Return an augmented `Uint8Array` instance
    var buf = new Uint8Array(length);
    Object.setPrototypeOf(buf, Buffer.prototype);
    return buf;
}
/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */ function Buffer(arg, encodingOrOffset, length) {
    // Common case.
    if (typeof arg === 'number') {
        if (typeof encodingOrOffset === 'string') throw new TypeError('The "string" argument must be of type string. Received type number');
        return allocUnsafe(arg);
    }
    return from(arg, encodingOrOffset, length);
}
Buffer.poolSize = 8192 // not used by this implementation
;
function from(value, encodingOrOffset, length) {
    if (typeof value === 'string') return fromString(value, encodingOrOffset);
    if (ArrayBuffer.isView(value)) return fromArrayView(value);
    if (value == null) throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof value);
    if (isInstance(value, ArrayBuffer) || value && isInstance(value.buffer, ArrayBuffer)) return fromArrayBuffer(value, encodingOrOffset, length);
    if (typeof SharedArrayBuffer !== 'undefined' && (isInstance(value, SharedArrayBuffer) || value && isInstance(value.buffer, SharedArrayBuffer))) return fromArrayBuffer(value, encodingOrOffset, length);
    if (typeof value === 'number') throw new TypeError('The "value" argument must not be of type number. Received type number');
    var valueOf = value.valueOf && value.valueOf();
    if (valueOf != null && valueOf !== value) return Buffer.from(valueOf, encodingOrOffset, length);
    var b = fromObject(value);
    if (b) return b;
    if (typeof Symbol !== 'undefined' && Symbol.toPrimitive != null && typeof value[Symbol.toPrimitive] === 'function') return Buffer.from(value[Symbol.toPrimitive]('string'), encodingOrOffset, length);
    throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof value);
}
/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/ Buffer.from = function(value, encodingOrOffset, length) {
    return from(value, encodingOrOffset, length);
};
// Note: Change prototype *after* Buffer.from is defined to workaround Chrome bug:
// https://github.com/feross/buffer/pull/148
Object.setPrototypeOf(Buffer.prototype, Uint8Array.prototype);
Object.setPrototypeOf(Buffer, Uint8Array);
function assertSize(size) {
    if (typeof size !== 'number') throw new TypeError('"size" argument must be of type number');
    else if (size < 0) throw new RangeError('The value "' + size + '" is invalid for option "size"');
}
function alloc(size, fill, encoding) {
    assertSize(size);
    if (size <= 0) return createBuffer(size);
    if (fill !== undefined) // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpreted as a start offset.
    return typeof encoding === 'string' ? createBuffer(size).fill(fill, encoding) : createBuffer(size).fill(fill);
    return createBuffer(size);
}
/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/ Buffer.alloc = function(size, fill, encoding) {
    return alloc(size, fill, encoding);
};
function allocUnsafe(size) {
    assertSize(size);
    return createBuffer(size < 0 ? 0 : checked(size) | 0);
}
/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */ Buffer.allocUnsafe = function(size) {
    return allocUnsafe(size);
};
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */ Buffer.allocUnsafeSlow = function(size) {
    return allocUnsafe(size);
};
function fromString(string, encoding) {
    if (typeof encoding !== 'string' || encoding === '') encoding = 'utf8';
    if (!Buffer.isEncoding(encoding)) throw new TypeError('Unknown encoding: ' + encoding);
    var length = byteLength1(string, encoding) | 0;
    var buf = createBuffer(length);
    var actual = buf.write(string, encoding);
    if (actual !== length) // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    buf = buf.slice(0, actual);
    return buf;
}
function fromArrayLike(array) {
    var length = array.length < 0 ? 0 : checked(array.length) | 0;
    var buf = createBuffer(length);
    for(var i = 0; i < length; i += 1)buf[i] = array[i] & 255;
    return buf;
}
function fromArrayView(arrayView) {
    if (isInstance(arrayView, Uint8Array)) {
        var copy = new Uint8Array(arrayView);
        return fromArrayBuffer(copy.buffer, copy.byteOffset, copy.byteLength);
    }
    return fromArrayLike(arrayView);
}
function fromArrayBuffer(array, byteOffset, length) {
    if (byteOffset < 0 || array.byteLength < byteOffset) throw new RangeError('"offset" is outside of buffer bounds');
    if (array.byteLength < byteOffset + (length || 0)) throw new RangeError('"length" is outside of buffer bounds');
    var buf;
    if (byteOffset === undefined && length === undefined) buf = new Uint8Array(array);
    else if (length === undefined) buf = new Uint8Array(array, byteOffset);
    else buf = new Uint8Array(array, byteOffset, length);
    // Return an augmented `Uint8Array` instance
    Object.setPrototypeOf(buf, Buffer.prototype);
    return buf;
}
function fromObject(obj) {
    if (Buffer.isBuffer(obj)) {
        var len = checked(obj.length) | 0;
        var buf = createBuffer(len);
        if (buf.length === 0) return buf;
        obj.copy(buf, 0, 0, len);
        return buf;
    }
    if (obj.length !== undefined) {
        if (typeof obj.length !== 'number' || numberIsNaN(obj.length)) return createBuffer(0);
        return fromArrayLike(obj);
    }
    if (obj.type === 'Buffer' && Array.isArray(obj.data)) return fromArrayLike(obj.data);
}
function checked(length) {
    // Note: cannot use `length < K_MAX_LENGTH` here because that fails when
    // length is NaN (which is otherwise coerced to zero.)
    if (length >= K_MAX_LENGTH) throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + K_MAX_LENGTH.toString(16) + ' bytes');
    return length | 0;
}
function SlowBuffer(length) {
    if (+length != length) length = 0;
    return Buffer.alloc(+length);
}
Buffer.isBuffer = function isBuffer(b) {
    return b != null && b._isBuffer === true && b !== Buffer.prototype // so Buffer.isBuffer(Buffer.prototype) will be false
    ;
};
Buffer.compare = function compare(a, b) {
    if (isInstance(a, Uint8Array)) a = Buffer.from(a, a.offset, a.byteLength);
    if (isInstance(b, Uint8Array)) b = Buffer.from(b, b.offset, b.byteLength);
    if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) throw new TypeError('The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array');
    if (a === b) return 0;
    var x = a.length;
    var y = b.length;
    for(var i = 0, len = Math.min(x, y); i < len; ++i)if (a[i] !== b[i]) {
        x = a[i];
        y = b[i];
        break;
    }
    if (x < y) return -1;
    if (y < x) return 1;
    return 0;
};
Buffer.isEncoding = function isEncoding(encoding) {
    switch(String(encoding).toLowerCase()){
        case 'hex':
        case 'utf8':
        case 'utf-8':
        case 'ascii':
        case 'latin1':
        case 'binary':
        case 'base64':
        case 'ucs2':
        case 'ucs-2':
        case 'utf16le':
        case 'utf-16le':
            return true;
        default:
            return false;
    }
};
Buffer.concat = function concat(list, length) {
    if (!Array.isArray(list)) throw new TypeError('"list" argument must be an Array of Buffers');
    if (list.length === 0) return Buffer.alloc(0);
    var i;
    if (length === undefined) {
        length = 0;
        for(i = 0; i < list.length; ++i)length += list[i].length;
    }
    var buffer = Buffer.allocUnsafe(length);
    var pos = 0;
    for(i = 0; i < list.length; ++i){
        var buf = list[i];
        if (isInstance(buf, Uint8Array)) {
            if (pos + buf.length > buffer.length) Buffer.from(buf).copy(buffer, pos);
            else Uint8Array.prototype.set.call(buffer, buf, pos);
        } else if (!Buffer.isBuffer(buf)) throw new TypeError('"list" argument must be an Array of Buffers');
        else buf.copy(buffer, pos);
        pos += buf.length;
    }
    return buffer;
};
function byteLength1(string, encoding) {
    if (Buffer.isBuffer(string)) return string.length;
    if (ArrayBuffer.isView(string) || isInstance(string, ArrayBuffer)) return string.byteLength;
    if (typeof string !== 'string') throw new TypeError("The \"string\" argument must be one of type string, Buffer, or ArrayBuffer. Received type " + typeof string);
    var len = string.length;
    var mustMatch = arguments.length > 2 && arguments[2] === true;
    if (!mustMatch && len === 0) return 0;
    // Use a for loop to avoid recursion
    var loweredCase = false;
    for(;;)switch(encoding){
        case 'ascii':
        case 'latin1':
        case 'binary':
            return len;
        case 'utf8':
        case 'utf-8':
            return utf8ToBytes(string).length;
        case 'ucs2':
        case 'ucs-2':
        case 'utf16le':
        case 'utf-16le':
            return len * 2;
        case 'hex':
            return len >>> 1;
        case 'base64':
            return base64ToBytes(string).length;
        default:
            if (loweredCase) return mustMatch ? -1 : utf8ToBytes(string).length // assume utf8
            ;
            encoding = ('' + encoding).toLowerCase();
            loweredCase = true;
    }
}
Buffer.byteLength = byteLength1;
function slowToString(encoding, start, end) {
    var loweredCase = false;
    // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
    // property of a typed array.
    // This behaves neither like String nor Uint8Array in that we set start/end
    // to their upper/lower bounds if the value passed is out of range.
    // undefined is handled specially as per ECMA-262 6th Edition,
    // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
    if (start === undefined || start < 0) start = 0;
    // Return early if start > this.length. Done here to prevent potential uint32
    // coercion fail below.
    if (start > this.length) return '';
    if (end === undefined || end > this.length) end = this.length;
    if (end <= 0) return '';
    // Force coercion to uint32. This will also coerce falsey/NaN values to 0.
    end >>>= 0;
    start >>>= 0;
    if (end <= start) return '';
    if (!encoding) encoding = 'utf8';
    while(true)switch(encoding){
        case 'hex':
            return hexSlice(this, start, end);
        case 'utf8':
        case 'utf-8':
            return utf8Slice(this, start, end);
        case 'ascii':
            return asciiSlice(this, start, end);
        case 'latin1':
        case 'binary':
            return latin1Slice(this, start, end);
        case 'base64':
            return base64Slice(this, start, end);
        case 'ucs2':
        case 'ucs-2':
        case 'utf16le':
        case 'utf-16le':
            return utf16leSlice(this, start, end);
        default:
            if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding);
            encoding = (encoding + '').toLowerCase();
            loweredCase = true;
    }
}
// This property is used by `Buffer.isBuffer` (and the `is-buffer` npm package)
// to detect a Buffer instance. It's not possible to use `instanceof Buffer`
// reliably in a browserify context because there could be multiple different
// copies of the 'buffer' package in use. This method works even for Buffer
// instances that were created from another copy of the `buffer` package.
// See: https://github.com/feross/buffer/issues/154
Buffer.prototype._isBuffer = true;
function swap(b, n, m) {
    var i = b[n];
    b[n] = b[m];
    b[m] = i;
}
Buffer.prototype.swap16 = function swap16() {
    var len = this.length;
    if (len % 2 !== 0) throw new RangeError('Buffer size must be a multiple of 16-bits');
    for(var i = 0; i < len; i += 2)swap(this, i, i + 1);
    return this;
};
Buffer.prototype.swap32 = function swap32() {
    var len = this.length;
    if (len % 4 !== 0) throw new RangeError('Buffer size must be a multiple of 32-bits');
    for(var i = 0; i < len; i += 4){
        swap(this, i, i + 3);
        swap(this, i + 1, i + 2);
    }
    return this;
};
Buffer.prototype.swap64 = function swap64() {
    var len = this.length;
    if (len % 8 !== 0) throw new RangeError('Buffer size must be a multiple of 64-bits');
    for(var i = 0; i < len; i += 8){
        swap(this, i, i + 7);
        swap(this, i + 1, i + 6);
        swap(this, i + 2, i + 5);
        swap(this, i + 3, i + 4);
    }
    return this;
};
Buffer.prototype.toString = function toString() {
    var length = this.length;
    if (length === 0) return '';
    if (arguments.length === 0) return utf8Slice(this, 0, length);
    return slowToString.apply(this, arguments);
};
Buffer.prototype.toLocaleString = Buffer.prototype.toString;
Buffer.prototype.equals = function equals(b) {
    if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer');
    if (this === b) return true;
    return Buffer.compare(this, b) === 0;
};
Buffer.prototype.inspect = function inspect() {
    var str = '';
    var max = exports.INSPECT_MAX_BYTES;
    str = this.toString('hex', 0, max).replace(/(.{2})/g, '$1 ').trim();
    if (this.length > max) str += ' ... ';
    return '<Buffer ' + str + '>';
};
if (customInspectSymbol) Buffer.prototype[customInspectSymbol] = Buffer.prototype.inspect;
Buffer.prototype.compare = function compare(target, start, end, thisStart, thisEnd) {
    if (isInstance(target, Uint8Array)) target = Buffer.from(target, target.offset, target.byteLength);
    if (!Buffer.isBuffer(target)) throw new TypeError("The \"target\" argument must be one of type Buffer or Uint8Array. Received type " + typeof target);
    if (start === undefined) start = 0;
    if (end === undefined) end = target ? target.length : 0;
    if (thisStart === undefined) thisStart = 0;
    if (thisEnd === undefined) thisEnd = this.length;
    if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) throw new RangeError('out of range index');
    if (thisStart >= thisEnd && start >= end) return 0;
    if (thisStart >= thisEnd) return -1;
    if (start >= end) return 1;
    start >>>= 0;
    end >>>= 0;
    thisStart >>>= 0;
    thisEnd >>>= 0;
    if (this === target) return 0;
    var x = thisEnd - thisStart;
    var y = end - start;
    var len = Math.min(x, y);
    var thisCopy = this.slice(thisStart, thisEnd);
    var targetCopy = target.slice(start, end);
    for(var i = 0; i < len; ++i)if (thisCopy[i] !== targetCopy[i]) {
        x = thisCopy[i];
        y = targetCopy[i];
        break;
    }
    if (x < y) return -1;
    if (y < x) return 1;
    return 0;
};
// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf(buffer, val, byteOffset, encoding, dir) {
    // Empty buffer means no match
    if (buffer.length === 0) return -1;
    // Normalize byteOffset
    if (typeof byteOffset === 'string') {
        encoding = byteOffset;
        byteOffset = 0;
    } else if (byteOffset > 2147483647) byteOffset = 2147483647;
    else if (byteOffset < -2147483648) byteOffset = -2147483648;
    byteOffset = +byteOffset // Coerce to Number.
    ;
    if (numberIsNaN(byteOffset)) // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : buffer.length - 1;
    // Normalize byteOffset: negative offsets start from the end of the buffer
    if (byteOffset < 0) byteOffset = buffer.length + byteOffset;
    if (byteOffset >= buffer.length) {
        if (dir) return -1;
        else byteOffset = buffer.length - 1;
    } else if (byteOffset < 0) {
        if (dir) byteOffset = 0;
        else return -1;
    }
    // Normalize val
    if (typeof val === 'string') val = Buffer.from(val, encoding);
    // Finally, search either indexOf (if dir is true) or lastIndexOf
    if (Buffer.isBuffer(val)) {
        // Special case: looking for empty string/buffer always fails
        if (val.length === 0) return -1;
        return arrayIndexOf(buffer, val, byteOffset, encoding, dir);
    } else if (typeof val === 'number') {
        val = val & 255 // Search for a byte value [0-255]
        ;
        if (typeof Uint8Array.prototype.indexOf === 'function') {
            if (dir) return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset);
            else return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset);
        }
        return arrayIndexOf(buffer, [
            val
        ], byteOffset, encoding, dir);
    }
    throw new TypeError('val must be string, number or Buffer');
}
function arrayIndexOf(arr, val, byteOffset, encoding, dir) {
    var indexSize = 1;
    var arrLength = arr.length;
    var valLength = val.length;
    if (encoding !== undefined) {
        encoding = String(encoding).toLowerCase();
        if (encoding === 'ucs2' || encoding === 'ucs-2' || encoding === 'utf16le' || encoding === 'utf-16le') {
            if (arr.length < 2 || val.length < 2) return -1;
            indexSize = 2;
            arrLength /= 2;
            valLength /= 2;
            byteOffset /= 2;
        }
    }
    function read(buf, i) {
        if (indexSize === 1) return buf[i];
        else return buf.readUInt16BE(i * indexSize);
    }
    var i1;
    if (dir) {
        var foundIndex = -1;
        for(i1 = byteOffset; i1 < arrLength; i1++)if (read(arr, i1) === read(val, foundIndex === -1 ? 0 : i1 - foundIndex)) {
            if (foundIndex === -1) foundIndex = i1;
            if (i1 - foundIndex + 1 === valLength) return foundIndex * indexSize;
        } else {
            if (foundIndex !== -1) i1 -= i1 - foundIndex;
            foundIndex = -1;
        }
    } else {
        if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength;
        for(i1 = byteOffset; i1 >= 0; i1--){
            var found = true;
            for(var j = 0; j < valLength; j++)if (read(arr, i1 + j) !== read(val, j)) {
                found = false;
                break;
            }
            if (found) return i1;
        }
    }
    return -1;
}
Buffer.prototype.includes = function includes(val, byteOffset, encoding) {
    return this.indexOf(val, byteOffset, encoding) !== -1;
};
Buffer.prototype.indexOf = function indexOf(val, byteOffset, encoding) {
    return bidirectionalIndexOf(this, val, byteOffset, encoding, true);
};
Buffer.prototype.lastIndexOf = function lastIndexOf(val, byteOffset, encoding) {
    return bidirectionalIndexOf(this, val, byteOffset, encoding, false);
};
function hexWrite(buf, string, offset, length) {
    offset = Number(offset) || 0;
    var remaining = buf.length - offset;
    if (!length) length = remaining;
    else {
        length = Number(length);
        if (length > remaining) length = remaining;
    }
    var strLen = string.length;
    if (length > strLen / 2) length = strLen / 2;
    for(var i = 0; i < length; ++i){
        var parsed = parseInt(string.substr(i * 2, 2), 16);
        if (numberIsNaN(parsed)) return i;
        buf[offset + i] = parsed;
    }
    return i;
}
function utf8Write(buf, string, offset, length) {
    return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length);
}
function asciiWrite(buf, string, offset, length) {
    return blitBuffer(asciiToBytes(string), buf, offset, length);
}
function base64Write(buf, string, offset, length) {
    return blitBuffer(base64ToBytes(string), buf, offset, length);
}
function ucs2Write(buf, string, offset, length) {
    return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length);
}
Buffer.prototype.write = function write(string, offset, length, encoding) {
    // Buffer#write(string)
    if (offset === undefined) {
        encoding = 'utf8';
        length = this.length;
        offset = 0;
    // Buffer#write(string, encoding)
    } else if (length === undefined && typeof offset === 'string') {
        encoding = offset;
        length = this.length;
        offset = 0;
    // Buffer#write(string, offset[, length][, encoding])
    } else if (isFinite(offset)) {
        offset = offset >>> 0;
        if (isFinite(length)) {
            length = length >>> 0;
            if (encoding === undefined) encoding = 'utf8';
        } else {
            encoding = length;
            length = undefined;
        }
    } else throw new Error('Buffer.write(string, encoding, offset[, length]) is no longer supported');
    var remaining = this.length - offset;
    if (length === undefined || length > remaining) length = remaining;
    if (string.length > 0 && (length < 0 || offset < 0) || offset > this.length) throw new RangeError('Attempt to write outside buffer bounds');
    if (!encoding) encoding = 'utf8';
    var loweredCase = false;
    for(;;)switch(encoding){
        case 'hex':
            return hexWrite(this, string, offset, length);
        case 'utf8':
        case 'utf-8':
            return utf8Write(this, string, offset, length);
        case 'ascii':
        case 'latin1':
        case 'binary':
            return asciiWrite(this, string, offset, length);
        case 'base64':
            // Warning: maxLength not taken into account in base64Write
            return base64Write(this, string, offset, length);
        case 'ucs2':
        case 'ucs-2':
        case 'utf16le':
        case 'utf-16le':
            return ucs2Write(this, string, offset, length);
        default:
            if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding);
            encoding = ('' + encoding).toLowerCase();
            loweredCase = true;
    }
};
Buffer.prototype.toJSON = function toJSON() {
    return {
        type: 'Buffer',
        data: Array.prototype.slice.call(this._arr || this, 0)
    };
};
function base64Slice(buf, start, end) {
    if (start === 0 && end === buf.length) return base64.fromByteArray(buf);
    else return base64.fromByteArray(buf.slice(start, end));
}
function utf8Slice(buf, start, end) {
    end = Math.min(buf.length, end);
    var res = [];
    var i = start;
    while(i < end){
        var firstByte = buf[i];
        var codePoint = null;
        var bytesPerSequence = firstByte > 239 ? 4 : firstByte > 223 ? 3 : firstByte > 191 ? 2 : 1;
        if (i + bytesPerSequence <= end) {
            var secondByte, thirdByte, fourthByte, tempCodePoint;
            switch(bytesPerSequence){
                case 1:
                    if (firstByte < 128) codePoint = firstByte;
                    break;
                case 2:
                    secondByte = buf[i + 1];
                    if ((secondByte & 192) === 128) {
                        tempCodePoint = (firstByte & 31) << 6 | secondByte & 63;
                        if (tempCodePoint > 127) codePoint = tempCodePoint;
                    }
                    break;
                case 3:
                    secondByte = buf[i + 1];
                    thirdByte = buf[i + 2];
                    if ((secondByte & 192) === 128 && (thirdByte & 192) === 128) {
                        tempCodePoint = (firstByte & 15) << 12 | (secondByte & 63) << 6 | thirdByte & 63;
                        if (tempCodePoint > 2047 && (tempCodePoint < 55296 || tempCodePoint > 57343)) codePoint = tempCodePoint;
                    }
                    break;
                case 4:
                    secondByte = buf[i + 1];
                    thirdByte = buf[i + 2];
                    fourthByte = buf[i + 3];
                    if ((secondByte & 192) === 128 && (thirdByte & 192) === 128 && (fourthByte & 192) === 128) {
                        tempCodePoint = (firstByte & 15) << 18 | (secondByte & 63) << 12 | (thirdByte & 63) << 6 | fourthByte & 63;
                        if (tempCodePoint > 65535 && tempCodePoint < 1114112) codePoint = tempCodePoint;
                    }
            }
        }
        if (codePoint === null) {
            // we did not generate a valid codePoint so insert a
            // replacement char (U+FFFD) and advance only 1 byte
            codePoint = 65533;
            bytesPerSequence = 1;
        } else if (codePoint > 65535) {
            // encode to utf16 (surrogate pair dance)
            codePoint -= 65536;
            res.push(codePoint >>> 10 & 1023 | 55296);
            codePoint = 56320 | codePoint & 1023;
        }
        res.push(codePoint);
        i += bytesPerSequence;
    }
    return decodeCodePointsArray(res);
}
// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 4096;
function decodeCodePointsArray(codePoints) {
    var len = codePoints.length;
    if (len <= MAX_ARGUMENTS_LENGTH) return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
    ;
    // Decode in chunks to avoid "call stack size exceeded".
    var res = '';
    var i = 0;
    while(i < len)res += String.fromCharCode.apply(String, codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH));
    return res;
}
function asciiSlice(buf, start, end) {
    var ret = '';
    end = Math.min(buf.length, end);
    for(var i = start; i < end; ++i)ret += String.fromCharCode(buf[i] & 127);
    return ret;
}
function latin1Slice(buf, start, end) {
    var ret = '';
    end = Math.min(buf.length, end);
    for(var i = start; i < end; ++i)ret += String.fromCharCode(buf[i]);
    return ret;
}
function hexSlice(buf, start, end) {
    var len = buf.length;
    if (!start || start < 0) start = 0;
    if (!end || end < 0 || end > len) end = len;
    var out = '';
    for(var i = start; i < end; ++i)out += hexSliceLookupTable[buf[i]];
    return out;
}
function utf16leSlice(buf, start, end) {
    var bytes = buf.slice(start, end);
    var res = '';
    // If bytes.length is odd, the last 8 bits must be ignored (same as node.js)
    for(var i = 0; i < bytes.length - 1; i += 2)res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256);
    return res;
}
Buffer.prototype.slice = function slice(start, end) {
    var len = this.length;
    start = ~~start;
    end = end === undefined ? len : ~~end;
    if (start < 0) {
        start += len;
        if (start < 0) start = 0;
    } else if (start > len) start = len;
    if (end < 0) {
        end += len;
        if (end < 0) end = 0;
    } else if (end > len) end = len;
    if (end < start) end = start;
    var newBuf = this.subarray(start, end);
    // Return an augmented `Uint8Array` instance
    Object.setPrototypeOf(newBuf, Buffer.prototype);
    return newBuf;
};
/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */ function checkOffset(offset, ext, length) {
    if (offset % 1 !== 0 || offset < 0) throw new RangeError('offset is not uint');
    if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length');
}
Buffer.prototype.readUintLE = Buffer.prototype.readUIntLE = function readUIntLE(offset, byteLength, noAssert) {
    offset = offset >>> 0;
    byteLength = byteLength >>> 0;
    if (!noAssert) checkOffset(offset, byteLength, this.length);
    var val = this[offset];
    var mul = 1;
    var i = 0;
    while(++i < byteLength && (mul *= 256))val += this[offset + i] * mul;
    return val;
};
Buffer.prototype.readUintBE = Buffer.prototype.readUIntBE = function readUIntBE(offset, byteLength, noAssert) {
    offset = offset >>> 0;
    byteLength = byteLength >>> 0;
    if (!noAssert) checkOffset(offset, byteLength, this.length);
    var val = this[offset + --byteLength];
    var mul = 1;
    while(byteLength > 0 && (mul *= 256))val += this[offset + --byteLength] * mul;
    return val;
};
Buffer.prototype.readUint8 = Buffer.prototype.readUInt8 = function readUInt8(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert) checkOffset(offset, 1, this.length);
    return this[offset];
};
Buffer.prototype.readUint16LE = Buffer.prototype.readUInt16LE = function readUInt16LE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert) checkOffset(offset, 2, this.length);
    return this[offset] | this[offset + 1] << 8;
};
Buffer.prototype.readUint16BE = Buffer.prototype.readUInt16BE = function readUInt16BE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert) checkOffset(offset, 2, this.length);
    return this[offset] << 8 | this[offset + 1];
};
Buffer.prototype.readUint32LE = Buffer.prototype.readUInt32LE = function readUInt32LE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert) checkOffset(offset, 4, this.length);
    return (this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16) + this[offset + 3] * 16777216;
};
Buffer.prototype.readUint32BE = Buffer.prototype.readUInt32BE = function readUInt32BE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert) checkOffset(offset, 4, this.length);
    return this[offset] * 16777216 + (this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3]);
};
Buffer.prototype.readIntLE = function readIntLE(offset, byteLength, noAssert) {
    offset = offset >>> 0;
    byteLength = byteLength >>> 0;
    if (!noAssert) checkOffset(offset, byteLength, this.length);
    var val = this[offset];
    var mul = 1;
    var i = 0;
    while(++i < byteLength && (mul *= 256))val += this[offset + i] * mul;
    mul *= 128;
    if (val >= mul) val -= Math.pow(2, 8 * byteLength);
    return val;
};
Buffer.prototype.readIntBE = function readIntBE(offset, byteLength, noAssert) {
    offset = offset >>> 0;
    byteLength = byteLength >>> 0;
    if (!noAssert) checkOffset(offset, byteLength, this.length);
    var i = byteLength;
    var mul = 1;
    var val = this[offset + --i];
    while(i > 0 && (mul *= 256))val += this[offset + --i] * mul;
    mul *= 128;
    if (val >= mul) val -= Math.pow(2, 8 * byteLength);
    return val;
};
Buffer.prototype.readInt8 = function readInt8(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert) checkOffset(offset, 1, this.length);
    if (!(this[offset] & 128)) return this[offset];
    return (255 - this[offset] + 1) * -1;
};
Buffer.prototype.readInt16LE = function readInt16LE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert) checkOffset(offset, 2, this.length);
    var val = this[offset] | this[offset + 1] << 8;
    return val & 32768 ? val | 4294901760 : val;
};
Buffer.prototype.readInt16BE = function readInt16BE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert) checkOffset(offset, 2, this.length);
    var val = this[offset + 1] | this[offset] << 8;
    return val & 32768 ? val | 4294901760 : val;
};
Buffer.prototype.readInt32LE = function readInt32LE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert) checkOffset(offset, 4, this.length);
    return this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16 | this[offset + 3] << 24;
};
Buffer.prototype.readInt32BE = function readInt32BE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert) checkOffset(offset, 4, this.length);
    return this[offset] << 24 | this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3];
};
Buffer.prototype.readFloatLE = function readFloatLE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert) checkOffset(offset, 4, this.length);
    return ieee754.read(this, offset, true, 23, 4);
};
Buffer.prototype.readFloatBE = function readFloatBE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert) checkOffset(offset, 4, this.length);
    return ieee754.read(this, offset, false, 23, 4);
};
Buffer.prototype.readDoubleLE = function readDoubleLE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert) checkOffset(offset, 8, this.length);
    return ieee754.read(this, offset, true, 52, 8);
};
Buffer.prototype.readDoubleBE = function readDoubleBE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert) checkOffset(offset, 8, this.length);
    return ieee754.read(this, offset, false, 52, 8);
};
function checkInt(buf, value, offset, ext, max, min) {
    if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance');
    if (value > max || value < min) throw new RangeError('"value" argument is out of bounds');
    if (offset + ext > buf.length) throw new RangeError('Index out of range');
}
Buffer.prototype.writeUintLE = Buffer.prototype.writeUIntLE = function writeUIntLE(value, offset, byteLength, noAssert) {
    value = +value;
    offset = offset >>> 0;
    byteLength = byteLength >>> 0;
    if (!noAssert) {
        var maxBytes = Math.pow(2, 8 * byteLength) - 1;
        checkInt(this, value, offset, byteLength, maxBytes, 0);
    }
    var mul = 1;
    var i = 0;
    this[offset] = value & 255;
    while(++i < byteLength && (mul *= 256))this[offset + i] = value / mul & 255;
    return offset + byteLength;
};
Buffer.prototype.writeUintBE = Buffer.prototype.writeUIntBE = function writeUIntBE(value, offset, byteLength, noAssert) {
    value = +value;
    offset = offset >>> 0;
    byteLength = byteLength >>> 0;
    if (!noAssert) {
        var maxBytes = Math.pow(2, 8 * byteLength) - 1;
        checkInt(this, value, offset, byteLength, maxBytes, 0);
    }
    var i = byteLength - 1;
    var mul = 1;
    this[offset + i] = value & 255;
    while(--i >= 0 && (mul *= 256))this[offset + i] = value / mul & 255;
    return offset + byteLength;
};
Buffer.prototype.writeUint8 = Buffer.prototype.writeUInt8 = function writeUInt8(value, offset, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert) checkInt(this, value, offset, 1, 255, 0);
    this[offset] = value & 255;
    return offset + 1;
};
Buffer.prototype.writeUint16LE = Buffer.prototype.writeUInt16LE = function writeUInt16LE(value, offset, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert) checkInt(this, value, offset, 2, 65535, 0);
    this[offset] = value & 255;
    this[offset + 1] = value >>> 8;
    return offset + 2;
};
Buffer.prototype.writeUint16BE = Buffer.prototype.writeUInt16BE = function writeUInt16BE(value, offset, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert) checkInt(this, value, offset, 2, 65535, 0);
    this[offset] = value >>> 8;
    this[offset + 1] = value & 255;
    return offset + 2;
};
Buffer.prototype.writeUint32LE = Buffer.prototype.writeUInt32LE = function writeUInt32LE(value, offset, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert) checkInt(this, value, offset, 4, 4294967295, 0);
    this[offset + 3] = value >>> 24;
    this[offset + 2] = value >>> 16;
    this[offset + 1] = value >>> 8;
    this[offset] = value & 255;
    return offset + 4;
};
Buffer.prototype.writeUint32BE = Buffer.prototype.writeUInt32BE = function writeUInt32BE(value, offset, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert) checkInt(this, value, offset, 4, 4294967295, 0);
    this[offset] = value >>> 24;
    this[offset + 1] = value >>> 16;
    this[offset + 2] = value >>> 8;
    this[offset + 3] = value & 255;
    return offset + 4;
};
Buffer.prototype.writeIntLE = function writeIntLE(value, offset, byteLength, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert) {
        var limit = Math.pow(2, 8 * byteLength - 1);
        checkInt(this, value, offset, byteLength, limit - 1, -limit);
    }
    var i = 0;
    var mul = 1;
    var sub = 0;
    this[offset] = value & 255;
    while(++i < byteLength && (mul *= 256)){
        if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) sub = 1;
        this[offset + i] = (value / mul >> 0) - sub & 255;
    }
    return offset + byteLength;
};
Buffer.prototype.writeIntBE = function writeIntBE(value, offset, byteLength, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert) {
        var limit = Math.pow(2, 8 * byteLength - 1);
        checkInt(this, value, offset, byteLength, limit - 1, -limit);
    }
    var i = byteLength - 1;
    var mul = 1;
    var sub = 0;
    this[offset + i] = value & 255;
    while(--i >= 0 && (mul *= 256)){
        if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) sub = 1;
        this[offset + i] = (value / mul >> 0) - sub & 255;
    }
    return offset + byteLength;
};
Buffer.prototype.writeInt8 = function writeInt8(value, offset, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert) checkInt(this, value, offset, 1, 127, -128);
    if (value < 0) value = 255 + value + 1;
    this[offset] = value & 255;
    return offset + 1;
};
Buffer.prototype.writeInt16LE = function writeInt16LE(value, offset, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert) checkInt(this, value, offset, 2, 32767, -32768);
    this[offset] = value & 255;
    this[offset + 1] = value >>> 8;
    return offset + 2;
};
Buffer.prototype.writeInt16BE = function writeInt16BE(value, offset, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert) checkInt(this, value, offset, 2, 32767, -32768);
    this[offset] = value >>> 8;
    this[offset + 1] = value & 255;
    return offset + 2;
};
Buffer.prototype.writeInt32LE = function writeInt32LE(value, offset, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert) checkInt(this, value, offset, 4, 2147483647, -2147483648);
    this[offset] = value & 255;
    this[offset + 1] = value >>> 8;
    this[offset + 2] = value >>> 16;
    this[offset + 3] = value >>> 24;
    return offset + 4;
};
Buffer.prototype.writeInt32BE = function writeInt32BE(value, offset, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert) checkInt(this, value, offset, 4, 2147483647, -2147483648);
    if (value < 0) value = 4294967295 + value + 1;
    this[offset] = value >>> 24;
    this[offset + 1] = value >>> 16;
    this[offset + 2] = value >>> 8;
    this[offset + 3] = value & 255;
    return offset + 4;
};
function checkIEEE754(buf, value, offset, ext, max, min) {
    if (offset + ext > buf.length) throw new RangeError('Index out of range');
    if (offset < 0) throw new RangeError('Index out of range');
}
function writeFloat(buf, value, offset, littleEndian, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert) checkIEEE754(buf, value, offset, 4, 340282346638528860000000000000000000000, -340282346638528860000000000000000000000);
    ieee754.write(buf, value, offset, littleEndian, 23, 4);
    return offset + 4;
}
Buffer.prototype.writeFloatLE = function writeFloatLE(value, offset, noAssert) {
    return writeFloat(this, value, offset, true, noAssert);
};
Buffer.prototype.writeFloatBE = function writeFloatBE(value, offset, noAssert) {
    return writeFloat(this, value, offset, false, noAssert);
};
function writeDouble(buf, value, offset, littleEndian, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert) checkIEEE754(buf, value, offset, 8, 179769313486231570000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000, -179769313486231570000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000);
    ieee754.write(buf, value, offset, littleEndian, 52, 8);
    return offset + 8;
}
Buffer.prototype.writeDoubleLE = function writeDoubleLE(value, offset, noAssert) {
    return writeDouble(this, value, offset, true, noAssert);
};
Buffer.prototype.writeDoubleBE = function writeDoubleBE(value, offset, noAssert) {
    return writeDouble(this, value, offset, false, noAssert);
};
// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy(target, targetStart, start, end) {
    if (!Buffer.isBuffer(target)) throw new TypeError('argument should be a Buffer');
    if (!start) start = 0;
    if (!end && end !== 0) end = this.length;
    if (targetStart >= target.length) targetStart = target.length;
    if (!targetStart) targetStart = 0;
    if (end > 0 && end < start) end = start;
    // Copy 0 bytes; we're done
    if (end === start) return 0;
    if (target.length === 0 || this.length === 0) return 0;
    // Fatal error conditions
    if (targetStart < 0) throw new RangeError('targetStart out of bounds');
    if (start < 0 || start >= this.length) throw new RangeError('Index out of range');
    if (end < 0) throw new RangeError('sourceEnd out of bounds');
    // Are we oob?
    if (end > this.length) end = this.length;
    if (target.length - targetStart < end - start) end = target.length - targetStart + start;
    var len = end - start;
    if (this === target && typeof Uint8Array.prototype.copyWithin === 'function') // Use built-in when available, missing from IE11
    this.copyWithin(targetStart, start, end);
    else Uint8Array.prototype.set.call(target, this.subarray(start, end), targetStart);
    return len;
};
// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill(val, start, end, encoding) {
    // Handle string cases:
    if (typeof val === 'string') {
        if (typeof start === 'string') {
            encoding = start;
            start = 0;
            end = this.length;
        } else if (typeof end === 'string') {
            encoding = end;
            end = this.length;
        }
        if (encoding !== undefined && typeof encoding !== 'string') throw new TypeError('encoding must be a string');
        if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) throw new TypeError('Unknown encoding: ' + encoding);
        if (val.length === 1) {
            var code = val.charCodeAt(0);
            if (encoding === 'utf8' && code < 128 || encoding === 'latin1') // Fast path: If `val` fits into a single byte, use that numeric value.
            val = code;
        }
    } else if (typeof val === 'number') val = val & 255;
    else if (typeof val === 'boolean') val = Number(val);
    // Invalid ranges are not set to a default, so can range check early.
    if (start < 0 || this.length < start || this.length < end) throw new RangeError('Out of range index');
    if (end <= start) return this;
    start = start >>> 0;
    end = end === undefined ? this.length : end >>> 0;
    if (!val) val = 0;
    var i;
    if (typeof val === 'number') for(i = start; i < end; ++i)this[i] = val;
    else {
        var bytes = Buffer.isBuffer(val) ? val : Buffer.from(val, encoding);
        var len = bytes.length;
        if (len === 0) throw new TypeError('The value "' + val + '" is invalid for argument "value"');
        for(i = 0; i < end - start; ++i)this[i + start] = bytes[i % len];
    }
    return this;
};
// HELPER FUNCTIONS
// ================
var INVALID_BASE64_RE = /[^+/0-9A-Za-z-_]/g;
function base64clean(str) {
    // Node takes equal signs as end of the Base64 encoding
    str = str.split('=')[0];
    // Node strips out invalid characters like \n and \t from the string, base64-js does not
    str = str.trim().replace(INVALID_BASE64_RE, '');
    // Node converts strings with length < 2 to ''
    if (str.length < 2) return '';
    // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
    while(str.length % 4 !== 0)str = str + '=';
    return str;
}
function utf8ToBytes(string, units) {
    units = units || Infinity;
    var codePoint;
    var length = string.length;
    var leadSurrogate = null;
    var bytes = [];
    for(var i = 0; i < length; ++i){
        codePoint = string.charCodeAt(i);
        // is surrogate component
        if (codePoint > 55295 && codePoint < 57344) {
            // last char was a lead
            if (!leadSurrogate) {
                // no lead yet
                if (codePoint > 56319) {
                    // unexpected trail
                    if ((units -= 3) > -1) bytes.push(239, 191, 189);
                    continue;
                } else if (i + 1 === length) {
                    // unpaired lead
                    if ((units -= 3) > -1) bytes.push(239, 191, 189);
                    continue;
                }
                // valid lead
                leadSurrogate = codePoint;
                continue;
            }
            // 2 leads in a row
            if (codePoint < 56320) {
                if ((units -= 3) > -1) bytes.push(239, 191, 189);
                leadSurrogate = codePoint;
                continue;
            }
            // valid surrogate pair
            codePoint = (leadSurrogate - 55296 << 10 | codePoint - 56320) + 65536;
        } else if (leadSurrogate) // valid bmp char, but last char was a lead
        {
            if ((units -= 3) > -1) bytes.push(239, 191, 189);
        }
        leadSurrogate = null;
        // encode utf8
        if (codePoint < 128) {
            if ((units -= 1) < 0) break;
            bytes.push(codePoint);
        } else if (codePoint < 2048) {
            if ((units -= 2) < 0) break;
            bytes.push(codePoint >> 6 | 192, codePoint & 63 | 128);
        } else if (codePoint < 65536) {
            if ((units -= 3) < 0) break;
            bytes.push(codePoint >> 12 | 224, codePoint >> 6 & 63 | 128, codePoint & 63 | 128);
        } else if (codePoint < 1114112) {
            if ((units -= 4) < 0) break;
            bytes.push(codePoint >> 18 | 240, codePoint >> 12 & 63 | 128, codePoint >> 6 & 63 | 128, codePoint & 63 | 128);
        } else throw new Error('Invalid code point');
    }
    return bytes;
}
function asciiToBytes(str) {
    var byteArray = [];
    for(var i = 0; i < str.length; ++i)// Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 255);
    return byteArray;
}
function utf16leToBytes(str, units) {
    var c, hi, lo;
    var byteArray = [];
    for(var i = 0; i < str.length; ++i){
        if ((units -= 2) < 0) break;
        c = str.charCodeAt(i);
        hi = c >> 8;
        lo = c % 256;
        byteArray.push(lo);
        byteArray.push(hi);
    }
    return byteArray;
}
function base64ToBytes(str) {
    return base64.toByteArray(base64clean(str));
}
function blitBuffer(src, dst, offset, length) {
    for(var i = 0; i < length; ++i){
        if (i + offset >= dst.length || i >= src.length) break;
        dst[i + offset] = src[i];
    }
    return i;
}
// ArrayBuffer or Uint8Array objects from other contexts (i.e. iframes) do not pass
// the `instanceof` check but they should be treated as of that type.
// See: https://github.com/feross/buffer/issues/166
function isInstance(obj, type) {
    return obj instanceof type || obj != null && obj.constructor != null && obj.constructor.name != null && obj.constructor.name === type.name;
}
function numberIsNaN(obj) {
    // For IE11 support
    return obj !== obj // eslint-disable-line no-self-compare
    ;
}
// Create lookup table for `toString('hex')`
// See: https://github.com/feross/buffer/issues/219
var hexSliceLookupTable = function() {
    var alphabet = '0123456789abcdef';
    var table = new Array(256);
    for(var i = 0; i < 16; ++i){
        var i16 = i * 16;
        for(var j = 0; j < 16; ++j)table[i16 + j] = alphabet[i] + alphabet[j];
    }
    return table;
}();

},{"base64-js":"8sRoe","ieee754":"9mxr9"}],"8sRoe":[function(require,module,exports) {
'use strict';
exports.byteLength = byteLength;
exports.toByteArray = toByteArray;
exports.fromByteArray = fromByteArray;
var lookup = [];
var revLookup = [];
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array;
var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
for(var i1 = 0, len1 = code.length; i1 < len1; ++i1){
    lookup[i1] = code[i1];
    revLookup[code.charCodeAt(i1)] = i1;
}
// Support decoding URL-safe base64 strings, as Node.js does.
// See: https://en.wikipedia.org/wiki/Base64#URL_applications
revLookup['-'.charCodeAt(0)] = 62;
revLookup['_'.charCodeAt(0)] = 63;
function getLens(b64) {
    var len = b64.length;
    if (len % 4 > 0) throw new Error('Invalid string. Length must be a multiple of 4');
    // Trim off extra bytes after placeholder bytes are found
    // See: https://github.com/beatgammit/base64-js/issues/42
    var validLen = b64.indexOf('=');
    if (validLen === -1) validLen = len;
    var placeHoldersLen = validLen === len ? 0 : 4 - validLen % 4;
    return [
        validLen,
        placeHoldersLen
    ];
}
// base64 is 4/3 + up to two characters of the original data
function byteLength(b64) {
    var lens = getLens(b64);
    var validLen = lens[0];
    var placeHoldersLen = lens[1];
    return (validLen + placeHoldersLen) * 3 / 4 - placeHoldersLen;
}
function _byteLength(b64, validLen, placeHoldersLen) {
    return (validLen + placeHoldersLen) * 3 / 4 - placeHoldersLen;
}
function toByteArray(b64) {
    var tmp;
    var lens = getLens(b64);
    var validLen = lens[0];
    var placeHoldersLen = lens[1];
    var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen));
    var curByte = 0;
    // if there are placeholders, only get up to the last complete 4 chars
    var len = placeHoldersLen > 0 ? validLen - 4 : validLen;
    var i;
    for(i = 0; i < len; i += 4){
        tmp = revLookup[b64.charCodeAt(i)] << 18 | revLookup[b64.charCodeAt(i + 1)] << 12 | revLookup[b64.charCodeAt(i + 2)] << 6 | revLookup[b64.charCodeAt(i + 3)];
        arr[curByte++] = tmp >> 16 & 255;
        arr[curByte++] = tmp >> 8 & 255;
        arr[curByte++] = tmp & 255;
    }
    if (placeHoldersLen === 2) {
        tmp = revLookup[b64.charCodeAt(i)] << 2 | revLookup[b64.charCodeAt(i + 1)] >> 4;
        arr[curByte++] = tmp & 255;
    }
    if (placeHoldersLen === 1) {
        tmp = revLookup[b64.charCodeAt(i)] << 10 | revLookup[b64.charCodeAt(i + 1)] << 4 | revLookup[b64.charCodeAt(i + 2)] >> 2;
        arr[curByte++] = tmp >> 8 & 255;
        arr[curByte++] = tmp & 255;
    }
    return arr;
}
function tripletToBase64(num) {
    return lookup[num >> 18 & 63] + lookup[num >> 12 & 63] + lookup[num >> 6 & 63] + lookup[num & 63];
}
function encodeChunk(uint8, start, end) {
    var tmp;
    var output = [];
    for(var i = start; i < end; i += 3){
        tmp = (uint8[i] << 16 & 16711680) + (uint8[i + 1] << 8 & 65280) + (uint8[i + 2] & 255);
        output.push(tripletToBase64(tmp));
    }
    return output.join('');
}
function fromByteArray(uint8) {
    var tmp;
    var len = uint8.length;
    var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
    ;
    var parts = [];
    var maxChunkLength = 16383 // must be multiple of 3
    ;
    // go through the array every three bytes, we'll deal with trailing stuff later
    for(var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength)parts.push(encodeChunk(uint8, i, i + maxChunkLength > len2 ? len2 : i + maxChunkLength));
    // pad the end with zeros, but make sure to not forget the extra bytes
    if (extraBytes === 1) {
        tmp = uint8[len - 1];
        parts.push(lookup[tmp >> 2] + lookup[tmp << 4 & 63] + '==');
    } else if (extraBytes === 2) {
        tmp = (uint8[len - 2] << 8) + uint8[len - 1];
        parts.push(lookup[tmp >> 10] + lookup[tmp >> 4 & 63] + lookup[tmp << 2 & 63] + '=');
    }
    return parts.join('');
}

},{}],"9mxr9":[function(require,module,exports) {
/*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */ exports.read = function(buffer, offset, isLE, mLen, nBytes) {
    var e, m;
    var eLen = nBytes * 8 - mLen - 1;
    var eMax = (1 << eLen) - 1;
    var eBias = eMax >> 1;
    var nBits = -7;
    var i = isLE ? nBytes - 1 : 0;
    var d = isLE ? -1 : 1;
    var s = buffer[offset + i];
    i += d;
    e = s & (1 << -nBits) - 1;
    s >>= -nBits;
    nBits += eLen;
    for(; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8);
    m = e & (1 << -nBits) - 1;
    e >>= -nBits;
    nBits += mLen;
    for(; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8);
    if (e === 0) e = 1 - eBias;
    else if (e === eMax) return m ? NaN : (s ? -1 : 1) * Infinity;
    else {
        m = m + Math.pow(2, mLen);
        e = e - eBias;
    }
    return (s ? -1 : 1) * m * Math.pow(2, e - mLen);
};
exports.write = function(buffer, value, offset, isLE, mLen, nBytes) {
    var e, m, c;
    var eLen = nBytes * 8 - mLen - 1;
    var eMax = (1 << eLen) - 1;
    var eBias = eMax >> 1;
    var rt = mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0;
    var i = isLE ? 0 : nBytes - 1;
    var d = isLE ? 1 : -1;
    var s = value < 0 || value === 0 && 1 / value < 0 ? 1 : 0;
    value = Math.abs(value);
    if (isNaN(value) || value === Infinity) {
        m = isNaN(value) ? 1 : 0;
        e = eMax;
    } else {
        e = Math.floor(Math.log(value) / Math.LN2);
        if (value * (c = Math.pow(2, -e)) < 1) {
            e--;
            c *= 2;
        }
        if (e + eBias >= 1) value += rt / c;
        else value += rt * Math.pow(2, 1 - eBias);
        if (value * c >= 2) {
            e++;
            c /= 2;
        }
        if (e + eBias >= eMax) {
            m = 0;
            e = eMax;
        } else if (e + eBias >= 1) {
            m = (value * c - 1) * Math.pow(2, mLen);
            e = e + eBias;
        } else {
            m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
            e = 0;
        }
    }
    for(; mLen >= 8; buffer[offset + i] = m & 255, i += d, m /= 256, mLen -= 8);
    e = e << mLen | m;
    eLen += mLen;
    for(; eLen > 0; buffer[offset + i] = e & 255, i += d, e /= 256, eLen -= 8);
    buffer[offset + i - d] |= s * 128;
};

},{}],"d0FxK":[function(require,module,exports) {
"use-strict";
var GameBoyCore = require("./gameboy_core/gameboy.js");
const KEYMAP = {
    RIGHT: 0,
    LEFT: 1,
    UP: 2,
    DOWN: 3,
    A: 4,
    B: 5,
    SELECT: 6,
    START: 7
};
const PRIVATE = "_";
function Interface() {
    let _that = this[PRIVATE] = {
        __proto__: Interface._prototype,
        gameboy: null,
        frames: 0,
        pressed: new Array(Object.keys(KEYMAP).length)
    };
    _that[PRIVATE] = _that;
}
Interface._prototype = {
    //Check to make sure the gameboy object has been created.
    initialized: function() {
        let _that = this[PRIVATE];
        return typeof _that.gameboy === "object" && _that.gameboy != null;
    },
    /*
   *Make sure that the emulator is "running" (note that this is different than play/pause)
   *Think of it like turning the key in your ignition before you start driving your car
   *TODO: does `true` mean it's running or does `true` mean it's stopped?
   */ running: function() {
        let _that = this[PRIVATE];
        return (_that.gameboy.stopEmulator & 2) == 0;
    },
    /*
   * Presses or releases a key
   * - note that in the gameboy core, a key will stay pressed until it has been explicitly released.
   * - will do nothing if the emulator is running
   *
   * @param keycode 1-8 number of the key to press (see Interface.KEYCODES)
   * @param `true` to press key, `false` to release
   */ sendKey: function(keycode, down) {
        let _that = this[PRIVATE];
        if (_that.initialized() && _that.running()) _that.gameboy.JoyPadEvent(keycode, down);
    },
    //Stop emulator, reset relevant variables
    shutdownEmulation: function() {
        let _that = this[PRIVATE];
        if (_that.initialized() && _that.running()) {
            _that.gameboy.stopEmulator |= 2;
            _that.frames = 0; //Reset internal variables
        }
    }
};
Interface.prototype = {
    constructor: Interface,
    /*
   * Load a ROM - like popping in a new cartridge
   * - Won't do anything if the emulator hasn't been initialized.
   *
   * TODO: better documentation on what ROMs are and how they should be formatted.
   */ loadRom: function(ROM, saveData) {
        let that = this;
        let _that = this[PRIVATE];
        // if (!_that.initialized()) {
        //     return false;
        // }
        //TODO: autosave last state?
        _that.shutdownEmulation(); //Will shut down emulator if it's still running.
        _that.gameboy = new GameBoyCore(ROM);
        _that.gameboy.openMBC = function(title) {
            /* TODO: you can load in from a specific title? Kind of cool, I guess. */ return saveData || [];
        };
        //Start emulator (some logic in here that needs to be documented)
        _that.gameboy.start();
        _that.gameboy.stopEmulator &= 1;
        _that.gameboy.iterations = 0;
        return true;
    },
    /*
   * Emulates a single frame
   *
   * TODO: add documentation for imageData
   * @param partial - DEPRECATED - whether or not to render the entire screen or just the changed bits
   * @returns Array - image data for that frame, which can later be converted into a canvas writeable format
   */ doFrame: function(partial) {
        let _that = this[PRIVATE];
        //Press required keys
        for(let i = _that.pressed.length - 1; i >= 0; i--)if (_that.pressed[i]) _that.sendKey(i, true);
        _that.gameboy.frameDone = false;
        while(!_that.gameboy.frameDone)_that.gameboy.run(); //Run internal logic until the entire frame as finished.
        //Release all keys
        for(let i1 = _that.pressed.length - 1; i1 >= 0; i1--){
            _that.pressed[i1] = false;
            _that.sendKey(i1, false);
        }
        ++_that.frames;
        return partial ? _that.gameboy.partialScreen : _that.gameboy.currentScreen;
    },
    /*
   * Pass in an array of keys you want pressed
   * - this array should be propogated with values from ``Interface.KEYMAP``
   * - you can not undo a press. Once a key is pressed it stays pressed until the end of the frame.
   */ pressKeys: function(keys) {
        keys = keys || [];
        let that = this;
        for(let i = keys.length - 1; i >= 0; i--)that.pressKey(keys[i]);
    },
    /*
   * Presses a key corresponding with ``Interface.KEYMAP``
   * - you can not undo a press. Once a key is pressed it stays pressed until the end of the frame.
   */ pressKey: function(key) {
        let _that = this[PRIVATE];
        key = KEYMAP[key.toUpperCase()];
        if (key < _that.pressed.length && key != null) _that.pressed[key] = true;
    },
    /*
   * Returns an array of all currently pressed keys
   * - built using the enum ``Interface.KEYMAP``
   */ getKeys: function() {
        let _that = this[PRIVATE];
        return _that.pressed.slice(0);
    },
    getScreen: function() {
        var _that = this[PRIVATE];
        return _that.gameboy.currentScreen;
    },
    /*
   * Gets a block of memory, you can specify a start and an end if you want
   * - this is an expensive operation and should be called sparingly
   *
   * TODO perf test ``slice`` vs a ``for`` loop
   */ getMemory: function(start, end) {
        let _that = this[PRIVATE];
        start = start || 0;
        end = end || _that.gameboy.memory.length - 1;
        start = Math.max(start, 0);
        end = Math.min(end, _that.gameboy.memory.length - 1);
        if (start === 0 && end === _that.gameboy.memory.length - 1) return _that.gameboy.memory;
        return _that.gameboy.memory.slice(start, end); //Why are you doing this functionally instead of just returning the entire object?
    //Is it for speed?
    },
    getAudio: function() {
        let _that = this[PRIVATE];
        return _that.gameboy.audioBuffer;
    },
    getSaveData: function() {
        let _that = this[PRIVATE];
        return _that.gameboy.saveSRAMState();
    },
    setMemory: function(start, data) {
        let _that = this[PRIVATE];
        start = Math.max(start, 0);
        for(let i = 0; i < start.length; i++)_that.gameboy.memory[start + i] = data[i];
    }
};
Interface.KEYMAP = KEYMAP;
module.exports = Interface;

},{"./gameboy_core/gameboy.js":"bic6f"}],"bic6f":[function(require,module,exports) {
"use strict";
/*
 * JavaScript GameBoy Color Emulator
 * Copyright (C) 2010 - 2012 Grant Galitz
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * version 2 as published by the Free Software Foundation.
 * The full license is available at http://www.gnu.org/licenses/gpl.html
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 */ var Instance = require("./instance.js");
var settings = require("./settings.js");
var saving = require("./saveState.js");
//I need to mock a whole bunch of stuff on top of this.
//var XAudioServer = require('./audio/XAudioServer.js');
//TODO: Fix and reimplement missing function.
function cout() {
}
function pause() {
}
function GameBoyCore(ROMImage) {
    Instance.call(this, ROMImage);
    this.ROMImageIsString = 'string' == typeof ROMImage;
}
GameBoyCore.prototype = {
    constructor: GameBoyCore,
    //-----------------ARCHITECTURE-------------------------
    GBBOOTROM: [],
    GBCBOOTROM: [],
    ffxxDump: require('./architecture/ffxxDump.js'),
    OPCODE: require('./architecture/OPCODE.js'),
    CBOPCODE: require('./architecture/CBOPCODE.js'),
    TICKTable: require('./architecture/TICKTable.js'),
    SecondaryTICKTable: require('./architecture/SecondaryTICKTable.js'),
    //-------------------------------------------------------
    //------------SAVE/LOAD----------------------------------
    saveState: saving.saveState,
    saving: saving.returnFromState,
    saveSRAMState: function() {
        if (!this.cBATT || this.MBCRam.length == 0) return []; //No bettery backup...
        return this.fromTypedArray(this.MBCRam);
    },
    saveRTCState: function() {
        if (!this.cTIMER) return []; //No battery backup
        //Return the MBC RAM for backup...
        return [
            this.lastIteration,
            this.RTCisLatched,
            this.latchedSeconds,
            this.latchedMinutes,
            this.latchedHours,
            this.latchedLDays,
            this.latchedHDays,
            this.RTCSeconds,
            this.RTCMinutes,
            this.RTCHours,
            this.RTCDays,
            this.RTCDayOverFlow,
            this.RTCHALT
        ];
    }
};
GameBoyCore.prototype.returnFromRTCState = function() {
    if (typeof this.openRTC == "function" && this.cTIMER) {
        var rtcData = this.openRTC(this.name);
        var index = 0;
        this.lastIteration = rtcData[index++];
        this.RTCisLatched = rtcData[index++];
        this.latchedSeconds = rtcData[index++];
        this.latchedMinutes = rtcData[index++];
        this.latchedHours = rtcData[index++];
        this.latchedLDays = rtcData[index++];
        this.latchedHDays = rtcData[index++];
        this.RTCSeconds = rtcData[index++];
        this.RTCMinutes = rtcData[index++];
        this.RTCHours = rtcData[index++];
        this.RTCDays = rtcData[index++];
        this.RTCDayOverFlow = rtcData[index++];
        this.RTCHALT = rtcData[index];
    }
};
GameBoyCore.prototype.start = function() {
    this.initMemory(); //Write the startup memory.
    this.ROMLoad(); //Load the ROM into memory and get cartridge information from it.
    this.initLCD(); //Initialize the graphics.
    this.initSound(); //Sound object initialization. Optional.
    this.run(); //Start the emulation.
};
GameBoyCore.prototype.initMemory = function() {
    //Initialize the RAM:
    this.memory = this.getTypedArray(65536, 0, "uint8");
    this.frameBuffer = this.getTypedArray(23040, 16316664, "int32");
    this.BGCHRBank1 = this.getTypedArray(2048, 0, "uint8");
    this.TICKTable = this.toTypedArray(this.TICKTable, "uint8");
    this.SecondaryTICKTable = this.toTypedArray(this.SecondaryTICKTable, "uint8");
    this.channel3PCM = this.getTypedArray(32, 0, "int8");
};
GameBoyCore.prototype.generateCacheArray = function(tileAmount) {
    var tileArray = [];
    var tileNumber = 0;
    while(tileNumber < tileAmount)tileArray[tileNumber++] = this.getTypedArray(64, 0, "uint8");
    return tileArray;
};
GameBoyCore.prototype.initSkipBootstrap = function() {
    //Fill in the boot ROM set register values
    //Default values to the GB boot ROM values, then fill in the GBC boot ROM values after ROM loading
    var index = 255;
    while(index >= 0){
        if (index >= 48 && index < 64) this.memoryWrite(65280 | index, this.ffxxDump[index]);
        else switch(index){
            case 0:
            case 1:
            case 2:
            case 5:
            case 7:
            case 15:
            case 255:
                this.memoryWrite(65280 | index, this.ffxxDump[index]);
                break;
            default:
                this.memory[65280 | index] = this.ffxxDump[index];
        }
        --index;
    }
    if (this.cGBC) {
        this.memory[65388] = 254;
        this.memory[65396] = 254;
    } else {
        this.memory[65352] = 255;
        this.memory[65353] = 255;
        this.memory[65388] = 255;
        this.memory[65396] = 255;
    }
    //Start as an unset device:
    cout("Starting without the GBC boot ROM.", 0);
    this.registerA = this.cGBC ? 17 : 1;
    this.registerB = 0;
    this.registerC = 19;
    this.registerD = 0;
    this.registerE = 216;
    this.FZero = true;
    this.FSubtract = false;
    this.FHalfCarry = true;
    this.FCarry = true;
    this.registersHL = 333;
    this.LCDCONTROL = this.LINECONTROL;
    this.IME = false;
    this.IRQLineMatched = 0;
    this.interruptsRequested = 225;
    this.interruptsEnabled = 0;
    this.hdmaRunning = false;
    this.CPUTicks = 12;
    this.STATTracker = 0;
    this.modeSTAT = 1;
    this.spriteCount = 252;
    this.LYCMatchTriggerSTAT = false;
    this.mode2TriggerSTAT = false;
    this.mode1TriggerSTAT = false;
    this.mode0TriggerSTAT = false;
    this.LCDisOn = true;
    this.channel1FrequencyTracker = 8192;
    this.channel1DutyTracker = 0;
    this.channel1CachedDuty = this.dutyLookup[2];
    this.channel1totalLength = 0;
    this.channel1envelopeVolume = 0;
    this.channel1envelopeType = false;
    this.channel1envelopeSweeps = 0;
    this.channel1envelopeSweepsLast = 0;
    this.channel1consecutive = true;
    this.channel1frequency = 1985;
    this.channel1SweepFault = true;
    this.channel1ShadowFrequency = 1985;
    this.channel1timeSweep = 1;
    this.channel1lastTimeSweep = 0;
    this.channel1Swept = false;
    this.channel1frequencySweepDivider = 0;
    this.channel1decreaseSweep = false;
    this.channel2FrequencyTracker = 8192;
    this.channel2DutyTracker = 0;
    this.channel2CachedDuty = this.dutyLookup[2];
    this.channel2totalLength = 0;
    this.channel2envelopeVolume = 0;
    this.channel2envelopeType = false;
    this.channel2envelopeSweeps = 0;
    this.channel2envelopeSweepsLast = 0;
    this.channel2consecutive = true;
    this.channel2frequency = 0;
    this.channel3canPlay = false;
    this.channel3totalLength = 0;
    this.channel3patternType = 4;
    this.channel3frequency = 0;
    this.channel3consecutive = true;
    this.channel3Counter = 1048;
    this.channel4FrequencyPeriod = 8;
    this.channel4totalLength = 0;
    this.channel4envelopeVolume = 0;
    this.channel4currentVolume = 0;
    this.channel4envelopeType = false;
    this.channel4envelopeSweeps = 0;
    this.channel4envelopeSweepsLast = 0;
    this.channel4consecutive = true;
    this.channel4BitRange = 32767;
    this.channel4VolumeShifter = 15;
    this.channel1FrequencyCounter = 512;
    this.channel2FrequencyCounter = 512;
    this.channel3Counter = 2048;
    this.channel3FrequencyPeriod = 2048;
    this.channel3lastSampleLookup = 0;
    this.channel4lastSampleLookup = 0;
    this.VinLeftChannelMasterVolume = 8;
    this.VinRightChannelMasterVolume = 8;
    this.soundMasterEnabled = true;
    this.leftChannel1 = true;
    this.leftChannel2 = true;
    this.leftChannel3 = true;
    this.leftChannel4 = true;
    this.rightChannel1 = true;
    this.rightChannel2 = true;
    this.rightChannel3 = false;
    this.rightChannel4 = false;
    this.DIVTicks = 27044;
    this.LCDTicks = 160;
    this.timerTicks = 0;
    this.TIMAEnabled = false;
    this.TACClocker = 1024;
    this.serialTimer = 0;
    this.serialShiftTimer = 0;
    this.serialShiftTimerAllocated = 0;
    this.IRQEnableDelay = 0;
    this.actualScanLine = 144;
    this.lastUnrenderedLine = 0;
    this.gfxWindowDisplay = false;
    this.gfxSpriteShow = false;
    this.gfxSpriteNormalHeight = true;
    this.bgEnabled = true;
    this.BGPriorityEnabled = true;
    this.gfxWindowCHRBankPosition = 0;
    this.gfxBackgroundCHRBankPosition = 0;
    this.gfxBackgroundBankOffset = 0;
    this.windowY = 0;
    this.windowX = 0;
    this.drewBlank = 0;
    this.midScanlineOffset = -1;
    this.currentX = 0;
};
GameBoyCore.prototype.initBootstrap = function() {
    //Start as an unset device:
    cout("Starting the selected boot ROM.", 0);
    this.programCounter = 0;
    this.stackPointer = 0;
    this.IME = false;
    this.LCDTicks = 0;
    this.DIVTicks = 0;
    this.registerA = 0;
    this.registerB = 0;
    this.registerC = 0;
    this.registerD = 0;
    this.registerE = 0;
    this.FZero = this.FSubtract = this.FHalfCarry = this.FCarry = false;
    this.registersHL = 0;
    this.leftChannel1 = false;
    this.leftChannel2 = false;
    this.leftChannel3 = false;
    this.leftChannel4 = false;
    this.rightChannel1 = false;
    this.rightChannel2 = false;
    this.rightChannel3 = false;
    this.rightChannel4 = false;
    this.channel2frequency = this.channel1frequency = 0;
    this.channel4consecutive = this.channel2consecutive = this.channel1consecutive = false;
    this.VinLeftChannelMasterVolume = 8;
    this.VinRightChannelMasterVolume = 8;
    this.memory[65280] = 15; //Set the joypad state.
};
GameBoyCore.prototype.ROMLoad = function() {
    //Load the first two ROM banks (0x0000 - 0x7FFF) into regular gameboy memory:
    this.ROM = [];
    this.usedBootROM = settings[1] && (!settings[11] && this.GBCBOOTROM.length == 2048 || settings[11] && this.GBBOOTROM.length == 256);
    var maxLength = this.ROMImage.length;
    if (maxLength < 16384) throw new Error("ROM image size too small.");
    this.ROM = this.getTypedArray(maxLength, 0, "uint8");
    var romIndex = 0;
    if (this.usedBootROM) {
        if (!settings[11]) {
            //Patch in the GBC boot ROM into the memory map:
            if (this.ROMImageIsString) {
                for(; romIndex < 256; ++romIndex){
                    this.memory[romIndex] = this.GBCBOOTROM[romIndex]; //Load in the GameBoy Color BOOT ROM.
                    this.ROM[romIndex] = this.ROMImage.charCodeAt(romIndex) & 255; //Decode the ROM binary for the switch out.
                }
                for(; romIndex < 512; ++romIndex)this.memory[romIndex] = this.ROM[romIndex] = this.ROMImage.charCodeAt(romIndex) & 255; //Load in the game ROM.
                for(; romIndex < 2304; ++romIndex){
                    this.memory[romIndex] = this.GBCBOOTROM[romIndex - 256]; //Load in the GameBoy Color BOOT ROM.
                    this.ROM[romIndex] = this.ROMImage.charCodeAt(romIndex) & 255; //Decode the ROM binary for the switch out.
                }
            } else {
                for(; romIndex < 256; ++romIndex){
                    this.memory[romIndex] = this.GBCBOOTROM[romIndex]; //Load in the GameBoy Color BOOT ROM.
                    this.ROM[romIndex] = this.ROMImage[romIndex]; //Decode the ROM binary for the switch out.
                }
                for(; romIndex < 512; ++romIndex)this.memory[romIndex] = this.ROM[romIndex] = this.ROMImage[romIndex]; //Load in the game ROM.
                for(; romIndex < 2304; ++romIndex){
                    this.memory[romIndex] = this.GBCBOOTROM[romIndex - 256]; //Load in the GameBoy Color BOOT ROM.
                    this.ROM[romIndex] = this.ROMImage[romIndex]; //Decode the ROM binary for the switch out.
                }
            }
            this.usedGBCBootROM = true;
        } else {
            if (this.ROMImageIsString) //Patch in the GBC boot ROM into the memory map:
            for(; romIndex < 256; ++romIndex){
                this.memory[romIndex] = this.GBBOOTROM[romIndex]; //Load in the GameBoy Color BOOT ROM.
                this.ROM[romIndex] = this.ROMImage.charCodeAt(romIndex) & 255; //Decode the ROM binary for the switch out.
            }
            else //Patch in the GBC boot ROM into the memory map:
            for(; romIndex < 256; ++romIndex){
                this.memory[romIndex] = this.GBBOOTROM[romIndex]; //Load in the GameBoy Color BOOT ROM.
                this.ROM[romIndex] = this.ROMImage.romIndex; //Decode the ROM binary for the switch out.
            }
        }
        if (this.ROMImageIsString) for(; romIndex < 16384; ++romIndex)this.memory[romIndex] = this.ROM[romIndex] = this.ROMImage.charCodeAt(romIndex) & 255; //Load in the game ROM.
        else for(; romIndex < 16384; ++romIndex)this.memory[romIndex] = this.ROM[romIndex] = this.ROMImage[romIndex]; //Load in the game ROM.
    } else {
        if (this.ROMImageIsString) //Don't load in the boot ROM:
        for(; romIndex < 16384; ++romIndex)this.memory[romIndex] = this.ROM[romIndex] = this.ROMImage.charCodeAt(romIndex) & 255; //Load in the game ROM.
        else //Don't load in the boot ROM:
        for(; romIndex < 16384; ++romIndex)this.memory[romIndex] = this.ROM[romIndex] = this.ROMImage[romIndex]; //Load in the game ROM.
    }
    //Finish the decoding of the ROM binary:
    if (this.ROMImageIsString) for(; romIndex < maxLength; ++romIndex)this.ROM[romIndex] = this.ROMImage.charCodeAt(romIndex) & 255;
    else for(; romIndex < maxLength; ++romIndex)this.ROM[romIndex] = this.ROMImage[romIndex];
    this.ROMBankEdge = Math.floor(this.ROM.length / 16384);
    //Set up the emulator for the cartidge specifics:
    this.interpretCartridge();
    //Check for IRQ matching upon initialization:
    this.checkIRQMatching();
};
GameBoyCore.prototype.getROMImage = function() {
    //Return the binary version of the ROM image currently running:
    if (this.ROMImage.length > 0) return this.ROMImage.length;
    var length = this.ROM.length;
    for(var index = 0; index < length; index++)this.ROMImage += String.fromCharCode(this.ROM[index]);
    return this.ROMImage;
};
GameBoyCore.prototype.interpretCartridge = function() {
    var extra;
    if (this.ROMImageIsString) {
        // ROM name
        for(var index = 308; index < 319; index++)if (this.ROMImage[index] > 0) this.name += this.ROMImage[index];
        // ROM game code (for newer games)
        for(var index = 319; index < 323; index++)if (this.ROMImage[index] > 0) this.gameCode += this.ROMImage[index];
        extra = this.ROMImage[323];
    } else {
        // ROM name
        for(var index = 308; index < 319; index++)if (this.ROMImage[index] > 0) this.name += String.fromCharCode(this.ROMImage[index]);
        // ROM game code (for newer games)
        for(var index = 319; index < 323; index++)if (this.ROMImage[index] > 0) this.gameCode += String.fromCharCode(this.ROMImage[index]);
        extra = String.fromCharCode(this.ROMImage[323]);
    }
    // You don't want extra output, do you?
    // console.log("Game Title: " + this.name + "[" + this.gameCode + "][" + this.ROMImage[0x143] + "]");
    // Cartridge type
    this.cartridgeType = this.ROM[327];
    //console.log("Cartridge type #" + this.cartridgeType);
    //Map out ROM cartridge sub-types.
    var MBCType = "";
    switch(this.cartridgeType){
        case 0:
            //ROM w/o bank switching
            if (!settings[9]) {
                MBCType = "ROM";
                break;
            }
        case 1:
            this.cMBC1 = true;
            MBCType = "MBC1";
            break;
        case 2:
            this.cMBC1 = true;
            this.cSRAM = true;
            MBCType = "MBC1 + SRAM";
            break;
        case 3:
            this.cMBC1 = true;
            this.cSRAM = true;
            this.cBATT = true;
            MBCType = "MBC1 + SRAM + BATT";
            break;
        case 5:
            this.cMBC2 = true;
            MBCType = "MBC2";
            break;
        case 6:
            this.cMBC2 = true;
            this.cBATT = true;
            MBCType = "MBC2 + BATT";
            break;
        case 8:
            this.cSRAM = true;
            MBCType = "ROM + SRAM";
            break;
        case 9:
            this.cSRAM = true;
            this.cBATT = true;
            MBCType = "ROM + SRAM + BATT";
            break;
        case 11:
            this.cMMMO1 = true;
            MBCType = "MMMO1";
            break;
        case 12:
            this.cMMMO1 = true;
            this.cSRAM = true;
            MBCType = "MMMO1 + SRAM";
            break;
        case 13:
            this.cMMMO1 = true;
            this.cSRAM = true;
            this.cBATT = true;
            MBCType = "MMMO1 + SRAM + BATT";
            break;
        case 15:
            this.cMBC3 = true;
            this.cTIMER = true;
            this.cBATT = true;
            MBCType = "MBC3 + TIMER + BATT";
            break;
        case 16:
            this.cMBC3 = true;
            this.cTIMER = true;
            this.cBATT = true;
            this.cSRAM = true;
            MBCType = "MBC3 + TIMER + BATT + SRAM";
            break;
        case 17:
            this.cMBC3 = true;
            MBCType = "MBC3";
            break;
        case 18:
            this.cMBC3 = true;
            this.cSRAM = true;
            MBCType = "MBC3 + SRAM";
            break;
        case 19:
            this.cMBC3 = true;
            this.cSRAM = true;
            this.cBATT = true;
            MBCType = "MBC3 + SRAM + BATT";
            break;
        case 25:
            this.cMBC5 = true;
            MBCType = "MBC5";
            break;
        case 26:
            this.cMBC5 = true;
            this.cSRAM = true;
            MBCType = "MBC5 + SRAM";
            break;
        case 27:
            this.cMBC5 = true;
            this.cSRAM = true;
            this.cBATT = true;
            MBCType = "MBC5 + SRAM + BATT";
            break;
        case 28:
            this.cRUMBLE = true;
            MBCType = "RUMBLE";
            break;
        case 29:
            this.cRUMBLE = true;
            this.cSRAM = true;
            MBCType = "RUMBLE + SRAM";
            break;
        case 30:
            this.cRUMBLE = true;
            this.cSRAM = true;
            this.cBATT = true;
            MBCType = "RUMBLE + SRAM + BATT";
            break;
        case 31:
            this.cCamera = true;
            MBCType = "GameBoy Camera";
            break;
        case 34:
            this.cMBC7 = true;
            this.cSRAM = true;
            this.cBATT = true;
            MBCType = "MBC7 + SRAM + BATT";
            break;
        case 253:
            this.cTAMA5 = true;
            MBCType = "TAMA5";
            break;
        case 254:
            this.cHuC3 = true;
            MBCType = "HuC3";
            break;
        case 255:
            this.cHuC1 = true;
            MBCType = "HuC1";
            break;
        default:
            MBCType = "Unknown";
            console.log("Cartridge type is unknown.");
            pause();
    }
    cout("Cartridge Type: " + MBCType + ".", 0);
    // ROM and RAM banks
    this.numROMBanks = this.ROMBanks[this.ROM[328]];
    cout(this.numROMBanks + " ROM banks.", 0);
    switch(this.RAMBanks[this.ROM[329]]){
        case 0:
            cout("No RAM banking requested for allocation or MBC is of type 2.", 0);
            break;
        case 2:
            cout("1 RAM bank requested for allocation.", 0);
            break;
        case 3:
            cout("4 RAM banks requested for allocation.", 0);
            break;
        case 4:
            cout("16 RAM banks requested for allocation.", 0);
            break;
        default:
            cout("RAM bank amount requested is unknown, will use maximum allowed by specified MBC type.", 0);
    }
    //Check the GB/GBC mode byte:
    if (!this.usedBootROM) {
        switch(this.ROM[323]){
            case 0:
                this.cGBC = false;
                cout("Only GB mode detected.", 0);
                break;
            case 50:
                if (!settings[2] && this.name + this.gameCode + this.ROM[323] == "Game and Watch 50") {
                    this.cGBC = true;
                    cout("Created a boot exception for Game and Watch Gallery 2 (GBC ID byte is wrong on the cartridge).", 1);
                } else this.cGBC = false;
                break;
            case 128:
                this.cGBC = !settings[2];
                cout("GB and GBC mode detected.", 0);
                break;
            case 192:
                this.cGBC = true;
                cout("Only GBC mode detected.", 0);
                break;
            default:
                this.cGBC = false;
                cout("Unknown GameBoy game type code #" + this.ROM[323] + ", defaulting to GB mode (Old games don't have a type code).", 1);
        }
        this.inBootstrap = false;
        this.setupRAM(); //CPU/(V)RAM initialization.
        this.initSkipBootstrap();
    } else {
        this.cGBC = this.usedGBCBootROM; //Allow the GBC boot ROM to run in GBC mode...
        this.setupRAM(); //CPU/(V)RAM initialization.
        this.initBootstrap();
    }
    this.initializeModeSpecificArrays();
    //License Code Lookup:
    var cOldLicense = this.ROM[331];
    var cNewLicense = this.ROM[324] & 65280 | this.ROM[325] & 255;
    if (cOldLicense != 51) //Old Style License Header
    cout("Old style license code: " + cOldLicense, 0);
    else //New Style License Header
    cout("New style license code: " + cNewLicense, 0);
    this.ROMImage = ""; //Memory consumption reduction.
};
GameBoyCore.prototype.disableBootROM = function() {
    //Remove any traces of the boot ROM from ROM memory.
    for(var index = 0; index < 256; ++index)this.memory[index] = this.ROM[index]; //Replace the GameBoy or GameBoy Color boot ROM with the game ROM.
    if (this.usedGBCBootROM) {
        //Remove any traces of the boot ROM from ROM memory.
        for(index = 512; index < 2304; ++index)this.memory[index] = this.ROM[index]; //Replace the GameBoy Color boot ROM with the game ROM.
        if (!this.cGBC) //Clean up the post-boot (GB mode only) state:
        this.GBCtoGBModeAdjust();
        else this.recompileBootIOWriteHandling();
    } else this.recompileBootIOWriteHandling();
};
GameBoyCore.prototype.initializeTiming = function() {
    //Emulator Timing:
    this.clocksPerSecond = this.emulatorSpeed * 4194304;
    this.baseCPUCyclesPerIteration = this.clocksPerSecond / 1000 * settings[6];
    this.CPUCyclesTotalRoundoff = this.baseCPUCyclesPerIteration % 4;
    this.CPUCyclesTotalBase = this.CPUCyclesTotal = this.baseCPUCyclesPerIteration - this.CPUCyclesTotalRoundoff | 0;
    this.CPUCyclesTotalCurrent = 0;
};
GameBoyCore.prototype.setSpeed = function(speed) {
    this.emulatorSpeed = speed;
    this.initializeTiming();
    if (this.audioHandle) this.initSound();
};
GameBoyCore.prototype.setupRAM = function() {
    //Setup the auxilliary/switchable RAM:
    if (this.cMBC2) this.numRAMBanks = 0.0625;
    else if (this.cMBC1 || this.cRUMBLE || this.cMBC3 || this.cHuC3) this.numRAMBanks = 4;
    else if (this.cMBC5) this.numRAMBanks = 16;
    else if (this.cSRAM) this.numRAMBanks = 1;
    if (this.numRAMBanks > 0) {
        if (!this.MBCRAMUtilized()) //For ROM and unknown MBC cartridges using the external RAM:
        this.MBCRAMBanksEnabled = true;
        //Switched RAM Used
        var MBCRam = typeof this.openMBC == "function" ? this.openMBC(this.name) : [];
        if (MBCRam.length > 0) //Flash the SRAM into memory:
        this.MBCRam = this.toTypedArray(MBCRam, "uint8");
        else this.MBCRam = this.getTypedArray(this.numRAMBanks * 8192, 0, "uint8");
    }
    cout("Actual bytes of MBC RAM allocated: " + this.numRAMBanks * 8192, 0);
    this.returnFromRTCState();
    //Setup the RAM for GBC mode.
    if (this.cGBC) {
        this.VRAM = this.getTypedArray(8192, 0, "uint8");
        this.GBCMemory = this.getTypedArray(28672, 0, "uint8");
    }
    this.memoryReadJumpCompile();
    this.memoryWriteJumpCompile();
};
GameBoyCore.prototype.MBCRAMUtilized = function() {
    return this.cMBC1 || this.cMBC2 || this.cMBC3 || this.cMBC5 || this.cMBC7 || this.cRUMBLE;
};
GameBoyCore.prototype.recomputeDimension = function() {
    //Cache some dimension info:
    this.onscreenWidth = 160;
    this.onscreenHeight = 144;
    this.offscreenWidth = 160;
    this.offscreenHeight = 144;
    this.offscreenRGBCount = this.offscreenWidth * this.offscreenHeight * 4;
};
GameBoyCore.prototype.initLCD = function() {
    this.recomputeDimension();
    if (this.offscreenRGBCount != 92160) //Only create the resizer handle if we need it:
    this.compileResizeFrameBufferFunction();
    else //Resizer not needed:
    this.resizer = null;
    try {
        this.canvasBuffer = {
            "data": new Uint8ClampedArray(92160),
            "height": 144,
            "width": 160
        };
    //Taking canvas out of the picture.
    //this.canvasBuffer = this.drawContextOffScreen.createImageData(144, 160);
    //this.canvasBuffer.prototype = ImageData;
    //new ImageData(160, 144);//{'width':160, 'height':144, 'data':new Array(160*144*4)};//this.drawContextOffscreen.createImageData(this.offscreenWidth, this.offscreenHeight);
    } catch (error) {
        console.log('hack failed: ' + error.message + ': falling back to getImageData initialization');
    //cout("Falling back to the getImageData initialization (Error \"" + error.message + "\").", 1);
    //this.canvasBuffer = this.drawContextOffscreen.getImageData(0, 0, this.offscreenWidth, this.offscreenHeight);
    }
    var index = this.offscreenRGBCount;
    while(index > 0){
        this.canvasBuffer.data[index -= 4] = 248;
        this.canvasBuffer.data[index + 1] = 248;
        this.canvasBuffer.data[index + 2] = 248;
        this.canvasBuffer.data[index + 3] = 255;
    }
    //this.graphicsBlit();
    if (this.swizzledFrame == null) this.swizzledFrame = this.getTypedArray(69120, 255, "uint8");
    //Test the draw system and browser vblank latching:
    this.drewFrame = true; //Copy the latest graphics to buffer.
    this.requestDraw();
};
//I think I'm just copying out framebuffer.  So maybe I dont' need to do anything?
GameBoyCore.prototype.graphicsBlit = function() {
    if (!this.currentScreenFixed) this.currentScreenFixed = [];
    this.lastScreen = this.currentScreenFixed;
    this.currentScreen = []; //new Uint8Array(this.canvasBuffer.data.length);
    this.partialScreen = [];
    for(var i = 0; i < this.canvasBuffer.data.length; i++){
        //Build partial frame.
        if (this.lastScreen[i] != this.canvasBuffer.data[i]) {
            this.partialScreen.push(i);
            this.partialScreen.push(this.canvasBuffer.data[i]);
        }
        //Build full frame.
        this.currentScreenFixed[i] = this.canvasBuffer.data[i];
        //this.currentScreen.push(i);
        this.currentScreen.push(this.canvasBuffer.data[i]);
    }
};
GameBoyCore.prototype.JoyPadEvent = function(key, down) {
    if (down) {
        this.JoyPad &= 255 ^ 1 << key;
        if (!this.cGBC && (!this.usedBootROM || !this.usedGBCBootROM)) {
            this.interruptsRequested |= 16; //A real GBC doesn't set this!
            this.remainingClocks = 0;
            this.checkIRQMatching();
        }
    } else this.JoyPad |= 1 << key;
    this.memory[65280] = (this.memory[65280] & 48) + (((this.memory[65280] & 32) == 0 ? this.JoyPad >> 4 : 15) & ((this.memory[65280] & 16) == 0 ? this.JoyPad & 15 : 15));
    this.CPUStopped = false;
};
GameBoyCore.prototype.GyroEvent = function(x, y) {
    x *= -100;
    x += 2047;
    this.highX = x >> 8;
    this.lowX = x & 255;
    y *= -100;
    y += 2047;
    this.highY = y >> 8;
    this.lowY = y & 255;
};
GameBoyCore.prototype.initSound = function() {
    this.audioResamplerFirstPassFactor = Math.max(Math.min(Math.floor(this.clocksPerSecond / 44100), Math.floor(136.53125)), 1);
    this.downSampleInputDivider = 1 / (this.audioResamplerFirstPassFactor * 240);
    if (settings[0]) // this.audioHandle = new XAudioServer(
    //     2,
    //     this.clocksPerSecond / this.audioResamplerFirstPassFactor,
    //     0,
    //     Math.max(this.baseCPUCyclesPerIteration * settings[8] / this.audioResamplerFirstPassFactor, 8192) << 1,
    //     null,
    //     settings[3],
    //     function () {
    //         settings[0] = false;
    //     });
    // console.log('Initializing Audio Buffer:');
    // console.log(`Sample Rate: ${ this.clocksPerSecond / this.audioResamplerFirstPassFactor }`);
    // console.log(`Max Buffer Size: ${ Math.max(this.baseCPUCyclesPerIteration * settings[8] / this.audioResamplerFirstPassFactor, 8192) << 1 }`);
    this.initAudioBuffer();
    else if (this.audioHandle) //Mute the audio output, as it has an immediate silencing effect:
    this.audioHandle.changeVolume(0);
};
GameBoyCore.prototype.changeVolume = function() {
    if (settings[0] && this.audioHandle) this.audioHandle.changeVolume(settings[3]);
};
GameBoyCore.prototype.initAudioBuffer = function() {
    this.audioIndex = 0;
    this.audioDestinationPosition = 0;
    this.downsampleInput = 0;
    this.bufferContainAmount = Math.max(this.baseCPUCyclesPerIteration * settings[7] / this.audioResamplerFirstPassFactor, 4096) << 1;
    this.numSamplesTotal = this.baseCPUCyclesPerIteration / this.audioResamplerFirstPassFactor << 1;
    this.audioBuffer = this.getTypedArray(this.numSamplesTotal, 0, "float32");
};
GameBoyCore.prototype.intializeWhiteNoise = function() {
    //Noise Sample Tables:
    var randomFactor = 1;
    //15-bit LSFR Cache Generation:
    this.LSFR15Table = this.getTypedArray(524288, 0, "int8");
    var LSFR = 32767; //Seed value has all its bits set.
    var LSFRShifted = 16383;
    for(var index = 0; index < 32768; ++index){
        //Normalize the last LSFR value for usage:
        randomFactor = 1 - (LSFR & 1); //Docs say it's the inverse.
        //Cache the different volume level results:
        this.LSFR15Table[32768 | index] = randomFactor;
        this.LSFR15Table[65536 | index] = randomFactor * 2;
        this.LSFR15Table[98304 | index] = randomFactor * 3;
        this.LSFR15Table[131072 | index] = randomFactor * 4;
        this.LSFR15Table[163840 | index] = randomFactor * 5;
        this.LSFR15Table[196608 | index] = randomFactor * 6;
        this.LSFR15Table[229376 | index] = randomFactor * 7;
        this.LSFR15Table[262144 | index] = randomFactor * 8;
        this.LSFR15Table[294912 | index] = randomFactor * 9;
        this.LSFR15Table[327680 | index] = randomFactor * 10;
        this.LSFR15Table[360448 | index] = randomFactor * 11;
        this.LSFR15Table[393216 | index] = randomFactor * 12;
        this.LSFR15Table[425984 | index] = randomFactor * 13;
        this.LSFR15Table[458752 | index] = randomFactor * 14;
        this.LSFR15Table[491520 | index] = randomFactor * 15;
        //Recompute the LSFR algorithm:
        LSFRShifted = LSFR >> 1;
        LSFR = LSFRShifted | ((LSFRShifted ^ LSFR) & 1) << 14;
    }
    //7-bit LSFR Cache Generation:
    this.LSFR7Table = this.getTypedArray(2048, 0, "int8");
    LSFR = 127; //Seed value has all its bits set.
    for(index = 0; index < 128; ++index){
        //Normalize the last LSFR value for usage:
        randomFactor = 1 - (LSFR & 1); //Docs say it's the inverse.
        //Cache the different volume level results:
        this.LSFR7Table[128 | index] = randomFactor;
        this.LSFR7Table[256 | index] = randomFactor * 2;
        this.LSFR7Table[384 | index] = randomFactor * 3;
        this.LSFR7Table[512 | index] = randomFactor * 4;
        this.LSFR7Table[640 | index] = randomFactor * 5;
        this.LSFR7Table[768 | index] = randomFactor * 6;
        this.LSFR7Table[896 | index] = randomFactor * 7;
        this.LSFR7Table[1024 | index] = randomFactor * 8;
        this.LSFR7Table[1152 | index] = randomFactor * 9;
        this.LSFR7Table[1280 | index] = randomFactor * 10;
        this.LSFR7Table[1408 | index] = randomFactor * 11;
        this.LSFR7Table[1536 | index] = randomFactor * 12;
        this.LSFR7Table[1664 | index] = randomFactor * 13;
        this.LSFR7Table[1792 | index] = randomFactor * 14;
        this.LSFR7Table[1920 | index] = randomFactor * 15;
        //Recompute the LSFR algorithm:
        LSFRShifted = LSFR >> 1;
        LSFR = LSFRShifted | ((LSFRShifted ^ LSFR) & 1) << 6;
    }
    //Set the default noise table:
    this.noiseSampleTable = this.LSFR15Table;
};
GameBoyCore.prototype.audioUnderrunAdjustment = function() {
    if (settings[0]) {
        //var underrunAmount = this.audioHandle.remainingBuffer();
        var underrunAmount = null; //I don't know what this is or why it matters.
        //From what I can tell, this is basically just "how much space do I have left in this buffer."
        //I'm gonna need to care about that.
        //But I'm not sure how *much* I'm going to need to care about it.
        //If I'm working with the raw buffer, then maybe... maybe I can just change the size to fit?
        //For now I'm going to ignore it and see what happens.
        //I need to know what the output format of the audio is.
        if (typeof underrunAmount == "number") {
            underrunAmount = this.bufferContainAmount - Math.max(underrunAmount, 0);
            if (underrunAmount > 0) this.recalculateIterationClockLimitForAudio((underrunAmount >> 1) * this.audioResamplerFirstPassFactor);
        }
    }
};
GameBoyCore.prototype.initializeAudioStartState = function() {
    this.channel1FrequencyTracker = 8192;
    this.channel1DutyTracker = 0;
    this.channel1CachedDuty = this.dutyLookup[2];
    this.channel1totalLength = 0;
    this.channel1envelopeVolume = 0;
    this.channel1envelopeType = false;
    this.channel1envelopeSweeps = 0;
    this.channel1envelopeSweepsLast = 0;
    this.channel1consecutive = true;
    this.channel1frequency = 0;
    this.channel1SweepFault = false;
    this.channel1ShadowFrequency = 0;
    this.channel1timeSweep = 1;
    this.channel1lastTimeSweep = 0;
    this.channel1Swept = false;
    this.channel1frequencySweepDivider = 0;
    this.channel1decreaseSweep = false;
    this.channel2FrequencyTracker = 8192;
    this.channel2DutyTracker = 0;
    this.channel2CachedDuty = this.dutyLookup[2];
    this.channel2totalLength = 0;
    this.channel2envelopeVolume = 0;
    this.channel2envelopeType = false;
    this.channel2envelopeSweeps = 0;
    this.channel2envelopeSweepsLast = 0;
    this.channel2consecutive = true;
    this.channel2frequency = 0;
    this.channel3canPlay = false;
    this.channel3totalLength = 0;
    this.channel3patternType = 4;
    this.channel3frequency = 0;
    this.channel3consecutive = true;
    this.channel3Counter = 2048;
    this.channel4FrequencyPeriod = 8;
    this.channel4totalLength = 0;
    this.channel4envelopeVolume = 0;
    this.channel4currentVolume = 0;
    this.channel4envelopeType = false;
    this.channel4envelopeSweeps = 0;
    this.channel4envelopeSweepsLast = 0;
    this.channel4consecutive = true;
    this.channel4BitRange = 32767;
    this.noiseSampleTable = this.LSFR15Table;
    this.channel4VolumeShifter = 15;
    this.channel1FrequencyCounter = 8192;
    this.channel2FrequencyCounter = 8192;
    this.channel3Counter = 2048;
    this.channel3FrequencyPeriod = 2048;
    this.channel3lastSampleLookup = 0;
    this.channel4lastSampleLookup = 0;
    this.VinLeftChannelMasterVolume = 8;
    this.VinRightChannelMasterVolume = 8;
    this.mixerOutputCache = 0;
    this.sequencerClocks = 8192;
    this.sequencePosition = 0;
    this.channel4FrequencyPeriod = 8;
    this.channel4Counter = 8;
    this.cachedChannel3Sample = 0;
    this.cachedChannel4Sample = 0;
    this.channel1Enabled = false;
    this.channel2Enabled = false;
    this.channel3Enabled = false;
    this.channel4Enabled = false;
    this.channel1canPlay = false;
    this.channel2canPlay = false;
    this.channel4canPlay = false;
    this.audioClocksUntilNextEvent = 1;
    this.audioClocksUntilNextEventCounter = 1;
    this.channel1OutputLevelCache();
    this.channel2OutputLevelCache();
    this.channel3OutputLevelCache();
    this.channel4OutputLevelCache();
    this.noiseSampleTable = this.LSFR15Table;
};
GameBoyCore.prototype.outputAudio = function() {
    this.audioBuffer[this.audioDestinationPosition++] = (this.downsampleInput >>> 16) * this.downSampleInputDivider - 1;
    this.audioBuffer[this.audioDestinationPosition++] = (this.downsampleInput & 65535) * this.downSampleInputDivider - 1;
    if (this.audioDestinationPosition == this.numSamplesTotal) //this.audioHandle.writeAudioNoCallback(this.audioBuffer);
    this.audioDestinationPosition = 0;
    this.downsampleInput = 0;
};
//Below are the audio generation functions timed against the CPU:
GameBoyCore.prototype.generateAudio = function(numSamples) {
    var multiplier = 0;
    if (this.soundMasterEnabled && !this.CPUStopped) for(var clockUpTo = 0; numSamples > 0;){
        clockUpTo = Math.min(this.audioClocksUntilNextEventCounter, this.sequencerClocks, numSamples);
        this.audioClocksUntilNextEventCounter -= clockUpTo;
        this.sequencerClocks -= clockUpTo;
        numSamples -= clockUpTo;
        while(clockUpTo > 0){
            multiplier = Math.min(clockUpTo, this.audioResamplerFirstPassFactor - this.audioIndex);
            clockUpTo -= multiplier;
            this.audioIndex += multiplier;
            this.downsampleInput += this.mixerOutputCache * multiplier;
            if (this.audioIndex == this.audioResamplerFirstPassFactor) {
                this.audioIndex = 0;
                this.outputAudio();
            }
        }
        if (this.sequencerClocks == 0) {
            this.audioComputeSequencer();
            this.sequencerClocks = 8192;
        }
        if (this.audioClocksUntilNextEventCounter == 0) this.computeAudioChannels();
    }
    else //SILENT OUTPUT:
    while(numSamples > 0){
        multiplier = Math.min(numSamples, this.audioResamplerFirstPassFactor - this.audioIndex);
        numSamples -= multiplier;
        this.audioIndex += multiplier;
        if (this.audioIndex == this.audioResamplerFirstPassFactor) {
            this.audioIndex = 0;
            this.outputAudio();
        }
    }
};
//Generate audio, but don't actually output it (Used for when sound is disabled by user/browser):
GameBoyCore.prototype.generateAudioFake = function(numSamples) {
    if (this.soundMasterEnabled && !this.CPUStopped) for(var clockUpTo = 0; numSamples > 0;){
        clockUpTo = Math.min(this.audioClocksUntilNextEventCounter, this.sequencerClocks, numSamples);
        this.audioClocksUntilNextEventCounter -= clockUpTo;
        this.sequencerClocks -= clockUpTo;
        numSamples -= clockUpTo;
        if (this.sequencerClocks == 0) {
            this.audioComputeSequencer();
            this.sequencerClocks = 8192;
        }
        if (this.audioClocksUntilNextEventCounter == 0) this.computeAudioChannels();
    }
};
GameBoyCore.prototype.audioJIT = function() {
    //Audio Sample Generation Timing:
    if (settings[0]) this.generateAudio(this.audioTicks);
    else this.generateAudioFake(this.audioTicks);
    this.audioTicks = 0;
};
GameBoyCore.prototype.audioComputeSequencer = function() {
    switch(this.sequencePosition++){
        case 0:
            this.clockAudioLength();
            break;
        case 2:
            this.clockAudioLength();
            this.clockAudioSweep();
            break;
        case 4:
            this.clockAudioLength();
            break;
        case 6:
            this.clockAudioLength();
            this.clockAudioSweep();
            break;
        case 7:
            this.clockAudioEnvelope();
            this.sequencePosition = 0;
    }
};
GameBoyCore.prototype.clockAudioLength = function() {
    //Channel 1:
    if (this.channel1totalLength > 1) --this.channel1totalLength;
    else if (this.channel1totalLength == 1) {
        this.channel1totalLength = 0;
        this.channel1EnableCheck();
        this.memory[65318] &= 254; //Channel #1 On Flag Off
    }
    //Channel 2:
    if (this.channel2totalLength > 1) --this.channel2totalLength;
    else if (this.channel2totalLength == 1) {
        this.channel2totalLength = 0;
        this.channel2EnableCheck();
        this.memory[65318] &= 253; //Channel #2 On Flag Off
    }
    //Channel 3:
    if (this.channel3totalLength > 1) --this.channel3totalLength;
    else if (this.channel3totalLength == 1) {
        this.channel3totalLength = 0;
        this.channel3EnableCheck();
        this.memory[65318] &= 251; //Channel #3 On Flag Off
    }
    //Channel 4:
    if (this.channel4totalLength > 1) --this.channel4totalLength;
    else if (this.channel4totalLength == 1) {
        this.channel4totalLength = 0;
        this.channel4EnableCheck();
        this.memory[65318] &= 247; //Channel #4 On Flag Off
    }
};
GameBoyCore.prototype.clockAudioSweep = function() {
    //Channel 1:
    if (!this.channel1SweepFault && this.channel1timeSweep > 0) {
        if (--this.channel1timeSweep == 0) this.runAudioSweep();
    }
};
GameBoyCore.prototype.runAudioSweep = function() {
    //Channel 1:
    if (this.channel1lastTimeSweep > 0) {
        if (this.channel1frequencySweepDivider > 0) {
            this.channel1Swept = true;
            if (this.channel1decreaseSweep) {
                this.channel1ShadowFrequency -= this.channel1ShadowFrequency >> this.channel1frequencySweepDivider;
                this.channel1frequency = this.channel1ShadowFrequency & 2047;
                this.channel1FrequencyTracker = 2048 - this.channel1frequency << 2;
            } else {
                this.channel1ShadowFrequency += this.channel1ShadowFrequency >> this.channel1frequencySweepDivider;
                this.channel1frequency = this.channel1ShadowFrequency;
                if (this.channel1ShadowFrequency <= 2047) {
                    this.channel1FrequencyTracker = 2048 - this.channel1frequency << 2;
                    //Run overflow check twice:
                    if (this.channel1ShadowFrequency + (this.channel1ShadowFrequency >> this.channel1frequencySweepDivider) > 2047) {
                        this.channel1SweepFault = true;
                        this.channel1EnableCheck();
                        this.memory[65318] &= 254; //Channel #1 On Flag Off
                    }
                } else {
                    this.channel1frequency &= 2047;
                    this.channel1SweepFault = true;
                    this.channel1EnableCheck();
                    this.memory[65318] &= 254; //Channel #1 On Flag Off
                }
            }
            this.channel1timeSweep = this.channel1lastTimeSweep;
        } else {
            //Channel has sweep disabled and timer becomes a length counter:
            this.channel1SweepFault = true;
            this.channel1EnableCheck();
        }
    }
};
GameBoyCore.prototype.channel1AudioSweepPerformDummy = function() {
    //Channel 1:
    if (this.channel1frequencySweepDivider > 0) {
        if (!this.channel1decreaseSweep) {
            var channel1ShadowFrequency = this.channel1ShadowFrequency + (this.channel1ShadowFrequency >> this.channel1frequencySweepDivider);
            if (channel1ShadowFrequency <= 2047) //Run overflow check twice:
            {
                if (channel1ShadowFrequency + (channel1ShadowFrequency >> this.channel1frequencySweepDivider) > 2047) {
                    this.channel1SweepFault = true;
                    this.channel1EnableCheck();
                    this.memory[65318] &= 254; //Channel #1 On Flag Off
                }
            } else {
                this.channel1SweepFault = true;
                this.channel1EnableCheck();
                this.memory[65318] &= 254; //Channel #1 On Flag Off
            }
        }
    }
};
GameBoyCore.prototype.clockAudioEnvelope = function() {
    //Channel 1:
    if (this.channel1envelopeSweepsLast > -1) {
        if (this.channel1envelopeSweeps > 0) --this.channel1envelopeSweeps;
        else {
            if (!this.channel1envelopeType) {
                if (this.channel1envelopeVolume > 0) {
                    --this.channel1envelopeVolume;
                    this.channel1envelopeSweeps = this.channel1envelopeSweepsLast;
                    this.channel1OutputLevelCache();
                } else this.channel1envelopeSweepsLast = -1;
            } else if (this.channel1envelopeVolume < 15) {
                ++this.channel1envelopeVolume;
                this.channel1envelopeSweeps = this.channel1envelopeSweepsLast;
                this.channel1OutputLevelCache();
            } else this.channel1envelopeSweepsLast = -1;
        }
    }
    //Channel 2:
    if (this.channel2envelopeSweepsLast > -1) {
        if (this.channel2envelopeSweeps > 0) --this.channel2envelopeSweeps;
        else {
            if (!this.channel2envelopeType) {
                if (this.channel2envelopeVolume > 0) {
                    --this.channel2envelopeVolume;
                    this.channel2envelopeSweeps = this.channel2envelopeSweepsLast;
                    this.channel2OutputLevelCache();
                } else this.channel2envelopeSweepsLast = -1;
            } else if (this.channel2envelopeVolume < 15) {
                ++this.channel2envelopeVolume;
                this.channel2envelopeSweeps = this.channel2envelopeSweepsLast;
                this.channel2OutputLevelCache();
            } else this.channel2envelopeSweepsLast = -1;
        }
    }
    //Channel 4:
    if (this.channel4envelopeSweepsLast > -1) {
        if (this.channel4envelopeSweeps > 0) --this.channel4envelopeSweeps;
        else {
            if (!this.channel4envelopeType) {
                if (this.channel4envelopeVolume > 0) {
                    this.channel4currentVolume = --this.channel4envelopeVolume << this.channel4VolumeShifter;
                    this.channel4envelopeSweeps = this.channel4envelopeSweepsLast;
                    this.channel4UpdateCache();
                } else this.channel4envelopeSweepsLast = -1;
            } else if (this.channel4envelopeVolume < 15) {
                this.channel4currentVolume = ++this.channel4envelopeVolume << this.channel4VolumeShifter;
                this.channel4envelopeSweeps = this.channel4envelopeSweepsLast;
                this.channel4UpdateCache();
            } else this.channel4envelopeSweepsLast = -1;
        }
    }
};
GameBoyCore.prototype.computeAudioChannels = function() {
    //Clock down the four audio channels to the next closest audio event:
    this.channel1FrequencyCounter -= this.audioClocksUntilNextEvent;
    this.channel2FrequencyCounter -= this.audioClocksUntilNextEvent;
    this.channel3Counter -= this.audioClocksUntilNextEvent;
    this.channel4Counter -= this.audioClocksUntilNextEvent;
    //Channel 1 counter:
    if (this.channel1FrequencyCounter == 0) {
        this.channel1FrequencyCounter = this.channel1FrequencyTracker;
        this.channel1DutyTracker = this.channel1DutyTracker + 1 & 7;
        this.channel1OutputLevelTrimaryCache();
    }
    //Channel 2 counter:
    if (this.channel2FrequencyCounter == 0) {
        this.channel2FrequencyCounter = this.channel2FrequencyTracker;
        this.channel2DutyTracker = this.channel2DutyTracker + 1 & 7;
        this.channel2OutputLevelTrimaryCache();
    }
    //Channel 3 counter:
    if (this.channel3Counter == 0) {
        if (this.channel3canPlay) this.channel3lastSampleLookup = this.channel3lastSampleLookup + 1 & 31;
        this.channel3Counter = this.channel3FrequencyPeriod;
        this.channel3UpdateCache();
    }
    //Channel 4 counter:
    if (this.channel4Counter == 0) {
        this.channel4lastSampleLookup = this.channel4lastSampleLookup + 1 & this.channel4BitRange;
        this.channel4Counter = this.channel4FrequencyPeriod;
        this.channel4UpdateCache();
    }
    //Find the number of clocks to next closest counter event:
    this.audioClocksUntilNextEventCounter = this.audioClocksUntilNextEvent = Math.min(this.channel1FrequencyCounter, this.channel2FrequencyCounter, this.channel3Counter, this.channel4Counter);
};
GameBoyCore.prototype.channel1EnableCheck = function() {
    this.channel1Enabled = (this.channel1consecutive || this.channel1totalLength > 0) && !this.channel1SweepFault && this.channel1canPlay;
    this.channel1OutputLevelSecondaryCache();
};
GameBoyCore.prototype.channel1VolumeEnableCheck = function() {
    this.channel1canPlay = this.memory[65298] > 7;
    this.channel1EnableCheck();
    this.channel1OutputLevelSecondaryCache();
};
GameBoyCore.prototype.channel1OutputLevelCache = function() {
    this.channel1currentSampleLeft = this.leftChannel1 ? this.channel1envelopeVolume : 0;
    this.channel1currentSampleRight = this.rightChannel1 ? this.channel1envelopeVolume : 0;
    this.channel1OutputLevelSecondaryCache();
};
GameBoyCore.prototype.channel1OutputLevelSecondaryCache = function() {
    if (this.channel1Enabled) {
        this.channel1currentSampleLeftSecondary = this.channel1currentSampleLeft;
        this.channel1currentSampleRightSecondary = this.channel1currentSampleRight;
    } else {
        this.channel1currentSampleLeftSecondary = 0;
        this.channel1currentSampleRightSecondary = 0;
    }
    this.channel1OutputLevelTrimaryCache();
};
GameBoyCore.prototype.channel1OutputLevelTrimaryCache = function() {
    if (this.channel1CachedDuty[this.channel1DutyTracker] && settings[14][0]) {
        this.channel1currentSampleLeftTrimary = this.channel1currentSampleLeftSecondary;
        this.channel1currentSampleRightTrimary = this.channel1currentSampleRightSecondary;
    } else {
        this.channel1currentSampleLeftTrimary = 0;
        this.channel1currentSampleRightTrimary = 0;
    }
    this.mixerOutputLevelCache();
};
GameBoyCore.prototype.channel2EnableCheck = function() {
    this.channel2Enabled = (this.channel2consecutive || this.channel2totalLength > 0) && this.channel2canPlay;
    this.channel2OutputLevelSecondaryCache();
};
GameBoyCore.prototype.channel2VolumeEnableCheck = function() {
    this.channel2canPlay = this.memory[65303] > 7;
    this.channel2EnableCheck();
    this.channel2OutputLevelSecondaryCache();
};
GameBoyCore.prototype.channel2OutputLevelCache = function() {
    this.channel2currentSampleLeft = this.leftChannel2 ? this.channel2envelopeVolume : 0;
    this.channel2currentSampleRight = this.rightChannel2 ? this.channel2envelopeVolume : 0;
    this.channel2OutputLevelSecondaryCache();
};
GameBoyCore.prototype.channel2OutputLevelSecondaryCache = function() {
    if (this.channel2Enabled) {
        this.channel2currentSampleLeftSecondary = this.channel2currentSampleLeft;
        this.channel2currentSampleRightSecondary = this.channel2currentSampleRight;
    } else {
        this.channel2currentSampleLeftSecondary = 0;
        this.channel2currentSampleRightSecondary = 0;
    }
    this.channel2OutputLevelTrimaryCache();
};
GameBoyCore.prototype.channel2OutputLevelTrimaryCache = function() {
    if (this.channel2CachedDuty[this.channel2DutyTracker] && settings[14][1]) {
        this.channel2currentSampleLeftTrimary = this.channel2currentSampleLeftSecondary;
        this.channel2currentSampleRightTrimary = this.channel2currentSampleRightSecondary;
    } else {
        this.channel2currentSampleLeftTrimary = 0;
        this.channel2currentSampleRightTrimary = 0;
    }
    this.mixerOutputLevelCache();
};
GameBoyCore.prototype.channel3EnableCheck = function() {
    this.channel3Enabled = this.channel3consecutive || this.channel3totalLength > 0;
    this.channel3OutputLevelSecondaryCache();
};
GameBoyCore.prototype.channel3OutputLevelCache = function() {
    this.channel3currentSampleLeft = this.leftChannel3 ? this.cachedChannel3Sample : 0;
    this.channel3currentSampleRight = this.rightChannel3 ? this.cachedChannel3Sample : 0;
    this.channel3OutputLevelSecondaryCache();
};
GameBoyCore.prototype.channel3OutputLevelSecondaryCache = function() {
    if (this.channel3Enabled && settings[14][2]) {
        this.channel3currentSampleLeftSecondary = this.channel3currentSampleLeft;
        this.channel3currentSampleRightSecondary = this.channel3currentSampleRight;
    } else {
        this.channel3currentSampleLeftSecondary = 0;
        this.channel3currentSampleRightSecondary = 0;
    }
    this.mixerOutputLevelCache();
};
GameBoyCore.prototype.channel4EnableCheck = function() {
    this.channel4Enabled = (this.channel4consecutive || this.channel4totalLength > 0) && this.channel4canPlay;
    this.channel4OutputLevelSecondaryCache();
};
GameBoyCore.prototype.channel4VolumeEnableCheck = function() {
    this.channel4canPlay = this.memory[65313] > 7;
    this.channel4EnableCheck();
    this.channel4OutputLevelSecondaryCache();
};
GameBoyCore.prototype.channel4OutputLevelCache = function() {
    this.channel4currentSampleLeft = this.leftChannel4 ? this.cachedChannel4Sample : 0;
    this.channel4currentSampleRight = this.rightChannel4 ? this.cachedChannel4Sample : 0;
    this.channel4OutputLevelSecondaryCache();
};
GameBoyCore.prototype.channel4OutputLevelSecondaryCache = function() {
    if (this.channel4Enabled && settings[14][3]) {
        this.channel4currentSampleLeftSecondary = this.channel4currentSampleLeft;
        this.channel4currentSampleRightSecondary = this.channel4currentSampleRight;
    } else {
        this.channel4currentSampleLeftSecondary = 0;
        this.channel4currentSampleRightSecondary = 0;
    }
    this.mixerOutputLevelCache();
};
GameBoyCore.prototype.mixerOutputLevelCache = function() {
    this.mixerOutputCache = (this.channel1currentSampleLeftTrimary + this.channel2currentSampleLeftTrimary + this.channel3currentSampleLeftSecondary + this.channel4currentSampleLeftSecondary) * this.VinLeftChannelMasterVolume << 16 | (this.channel1currentSampleRightTrimary + this.channel2currentSampleRightTrimary + this.channel3currentSampleRightSecondary + this.channel4currentSampleRightSecondary) * this.VinRightChannelMasterVolume;
};
GameBoyCore.prototype.channel3UpdateCache = function() {
    this.cachedChannel3Sample = this.channel3PCM[this.channel3lastSampleLookup] >> this.channel3patternType;
    this.channel3OutputLevelCache();
};
GameBoyCore.prototype.channel3WriteRAM = function(address, data) {
    if (this.channel3canPlay) this.audioJIT();
    this.memory[65328 | address] = data;
    address <<= 1;
    this.channel3PCM[address] = data >> 4;
    this.channel3PCM[address | 1] = data & 15;
};
GameBoyCore.prototype.channel4UpdateCache = function() {
    this.cachedChannel4Sample = this.noiseSampleTable[this.channel4currentVolume | this.channel4lastSampleLookup];
    this.channel4OutputLevelCache();
};
GameBoyCore.prototype.run = function() {
    //The preprocessing before the actual iteration loop:
    if ((this.stopEmulator & 2) == 0) {
        if ((this.stopEmulator & 1) == 1) {
            if (!this.CPUStopped) {
                this.stopEmulator = 0;
                this.audioUnderrunAdjustment();
                this.clockUpdate(); //RTC clocking.
                if (!this.halt) this.executeIteration();
                else {
                    this.CPUTicks = 0;
                    this.calculateHALTPeriod();
                    if (this.halt) {
                        this.updateCore();
                        this.iterationEndRoutine();
                    } else this.executeIteration();
                }
                //Request the graphics target to be updated:
                this.requestDraw();
                this.frameDone = true;
            } else {
                this.audioUnderrunAdjustment();
                this.audioTicks += this.CPUCyclesTotal;
                this.audioJIT();
                this.stopEmulator |= 1; //End current loop.
            }
        } else {
            console.log("Iterator restarted a faulted core.");
            pause();
        }
    }
};
GameBoyCore.prototype.executeIteration = function() {
    //Iterate the interpreter loop:
    var opcodeToExecute = 0;
    var timedTicks = 0;
    while(this.stopEmulator == 0){
        //Interrupt Arming:
        switch(this.IRQEnableDelay){
            case 1:
                this.IME = true;
                this.checkIRQMatching();
            case 2:
                --this.IRQEnableDelay;
        }
        //Is an IRQ set to fire?:
        if (this.IRQLineMatched > 0) //IME is true and and interrupt was matched:
        this.launchIRQ();
        //Fetch the current opcode:
        opcodeToExecute = this.memoryReader[this.programCounter](this, this.programCounter);
        //Increment the program counter to the next instruction:
        this.programCounter = this.programCounter + 1 & 65535;
        //Check for the program counter quirk:
        if (this.skipPCIncrement) {
            this.programCounter = this.programCounter - 1 & 65535;
            this.skipPCIncrement = false;
        }
        //Get how many CPU cycles the current instruction counts for:
        this.CPUTicks = this.TICKTable[opcodeToExecute];
        //Execute the current instruction:
        this.OPCODE[opcodeToExecute](this);
        //Update the state (Inlined updateCoreFull manually here):
        //Update the clocking for the LCD emulation:
        this.LCDTicks += this.CPUTicks >> this.doubleSpeedShifter; //LCD Timing
        this.LCDCONTROL[this.actualScanLine](this); //Scan Line and STAT Mode Control
        //Single-speed relative timing for A/V emulation:
        timedTicks = this.CPUTicks >> this.doubleSpeedShifter; //CPU clocking can be updated from the LCD handling.
        this.audioTicks += timedTicks; //Audio Timing
        this.emulatorTicks += timedTicks; //Emulator Timing
        //CPU Timers:
        this.DIVTicks += this.CPUTicks; //DIV Timing
        if (this.TIMAEnabled) {
            this.timerTicks += this.CPUTicks;
            while(this.timerTicks >= this.TACClocker){
                this.timerTicks -= this.TACClocker;
                if (++this.memory[65285] == 256) {
                    this.memory[65285] = this.memory[65286];
                    this.interruptsRequested |= 4;
                    this.checkIRQMatching();
                }
            }
        }
        if (this.serialTimer > 0) {
            //IRQ Counter:
            this.serialTimer -= this.CPUTicks;
            if (this.serialTimer <= 0) {
                this.interruptsRequested |= 8;
                this.checkIRQMatching();
            }
            //Bit Shit Counter:
            this.serialShiftTimer -= this.CPUTicks;
            if (this.serialShiftTimer <= 0) {
                this.serialShiftTimer = this.serialShiftTimerAllocated;
                this.memory[65281] = this.memory[65281] << 1 & 254 | 1; //We could shift in actual link data here if we were to implement such!!!
            }
        }
        //End of iteration routine:
        if (this.emulatorTicks >= this.CPUCyclesTotal) this.iterationEndRoutine();
    }
};
GameBoyCore.prototype.iterationEndRoutine = function() {
    if ((this.stopEmulator & 1) == 0) {
        this.audioJIT(); //Make sure we at least output once per iteration.
        //Update DIV Alignment (Integer overflow safety):
        this.memory[65284] = this.memory[65284] + (this.DIVTicks >> 8) & 255;
        this.DIVTicks &= 255;
        //Update emulator flags:
        this.stopEmulator |= 1; //End current loop.
        this.emulatorTicks -= this.CPUCyclesTotal;
        this.CPUCyclesTotalCurrent += this.CPUCyclesTotalRoundoff;
        this.recalculateIterationClockLimit();
    }
};
GameBoyCore.prototype.handleSTOP = function() {
    this.CPUStopped = true; //Stop CPU until joypad input changes.
    this.iterationEndRoutine();
    if (this.emulatorTicks < 0) {
        this.audioTicks -= this.emulatorTicks;
        this.audioJIT();
    }
};
GameBoyCore.prototype.recalculateIterationClockLimit = function() {
    var endModulus = this.CPUCyclesTotalCurrent % 4;
    this.CPUCyclesTotal = this.CPUCyclesTotalBase + this.CPUCyclesTotalCurrent - endModulus;
    this.CPUCyclesTotalCurrent = endModulus;
};
GameBoyCore.prototype.recalculateIterationClockLimitForAudio = function(audioClocking) {
    this.CPUCyclesTotal += Math.min(audioClocking >> 2 << 2, this.CPUCyclesTotalBase << 1);
};
GameBoyCore.prototype.scanLineMode2 = function() {
    if (this.STATTracker != 1) {
        if (this.mode2TriggerSTAT) {
            this.interruptsRequested |= 2;
            this.checkIRQMatching();
        }
        this.STATTracker = 1;
        this.modeSTAT = 2;
    }
};
GameBoyCore.prototype.scanLineMode3 = function() {
    if (this.modeSTAT != 3) {
        if (this.STATTracker == 0 && this.mode2TriggerSTAT) {
            this.interruptsRequested |= 2;
            this.checkIRQMatching();
        }
        this.STATTracker = 1;
        this.modeSTAT = 3;
    }
};
GameBoyCore.prototype.scanLineMode0 = function() {
    if (this.modeSTAT != 0) {
        if (this.STATTracker != 2) {
            if (this.STATTracker == 0) {
                if (this.mode2TriggerSTAT) {
                    this.interruptsRequested |= 2;
                    this.checkIRQMatching();
                }
                this.modeSTAT = 3;
            }
            this.incrementScanLineQueue();
            this.updateSpriteCount(this.actualScanLine);
            this.STATTracker = 2;
        }
        if (this.LCDTicks >= this.spriteCount) {
            if (this.hdmaRunning) this.executeHDMA();
            if (this.mode0TriggerSTAT) {
                this.interruptsRequested |= 2;
                this.checkIRQMatching();
            }
            this.STATTracker = 3;
            this.modeSTAT = 0;
        }
    }
};
GameBoyCore.prototype.clocksUntilLYCMatch = function() {
    if (this.memory[65349] != 0) {
        if (this.memory[65349] > this.actualScanLine) return 456 * (this.memory[65349] - this.actualScanLine);
        return 456 * (154 - this.actualScanLine + this.memory[65349]);
    }
    return 456 * (this.actualScanLine == 153 && this.memory[65348] == 0 ? 154 : 153 - this.actualScanLine) + 8;
};
GameBoyCore.prototype.clocksUntilMode0 = function() {
    switch(this.modeSTAT){
        case 0:
            if (this.actualScanLine == 143) {
                this.updateSpriteCount(0);
                return this.spriteCount + 5016;
            }
            this.updateSpriteCount(this.actualScanLine + 1);
            return this.spriteCount + 456;
        case 2:
        case 3:
            this.updateSpriteCount(this.actualScanLine);
            return this.spriteCount;
        case 1:
            this.updateSpriteCount(0);
            return this.spriteCount + 456 * (154 - this.actualScanLine);
    }
};
GameBoyCore.prototype.updateSpriteCount = function(line) {
    this.spriteCount = 252;
    if (this.cGBC && this.gfxSpriteShow) {
        var lineAdjusted = line + 16;
        var yoffset = 0;
        var yCap = this.gfxSpriteNormalHeight ? 8 : 16;
        for(var OAMAddress = 65024; OAMAddress < 65184 && this.spriteCount < 312; OAMAddress += 4){
            yoffset = lineAdjusted - this.memory[OAMAddress];
            if (yoffset > -1 && yoffset < yCap) this.spriteCount += 6;
        }
    }
};
GameBoyCore.prototype.matchLYC = function() {
    if (this.memory[65348] == this.memory[65349]) {
        this.memory[65345] |= 4;
        if (this.LYCMatchTriggerSTAT) {
            this.interruptsRequested |= 2;
            this.checkIRQMatching();
        }
    } else this.memory[65345] &= 123;
};
GameBoyCore.prototype.updateCore = function() {
    //Update the clocking for the LCD emulation:
    this.LCDTicks += this.CPUTicks >> this.doubleSpeedShifter; //LCD Timing
    this.LCDCONTROL[this.actualScanLine](this); //Scan Line and STAT Mode Control
    //Single-speed relative timing for A/V emulation:
    var timedTicks = this.CPUTicks >> this.doubleSpeedShifter; //CPU clocking can be updated from the LCD handling.
    this.audioTicks += timedTicks; //Audio Timing
    this.emulatorTicks += timedTicks; //Emulator Timing
    //CPU Timers:
    this.DIVTicks += this.CPUTicks; //DIV Timing
    if (this.TIMAEnabled) {
        this.timerTicks += this.CPUTicks;
        while(this.timerTicks >= this.TACClocker){
            this.timerTicks -= this.TACClocker;
            if (++this.memory[65285] == 256) {
                this.memory[65285] = this.memory[65286];
                this.interruptsRequested |= 4;
                this.checkIRQMatching();
            }
        }
    }
    if (this.serialTimer > 0) {
        //IRQ Counter:
        this.serialTimer -= this.CPUTicks;
        if (this.serialTimer <= 0) {
            this.interruptsRequested |= 8;
            this.checkIRQMatching();
        }
        //Bit Shit Counter:
        this.serialShiftTimer -= this.CPUTicks;
        if (this.serialShiftTimer <= 0) {
            this.serialShiftTimer = this.serialShiftTimerAllocated;
            this.memory[65281] = this.memory[65281] << 1 & 254 | 1; //We could shift in actual link data here if we were to implement such!!!
        }
    }
};
GameBoyCore.prototype.updateCoreFull = function() {
    //Update the state machine:
    this.updateCore();
    //End of iteration routine:
    if (this.emulatorTicks >= this.CPUCyclesTotal) this.iterationEndRoutine();
};
GameBoyCore.prototype.initializeLCDController = function() {
    //Display on hanlding:
    var line = 0;
    while(line < 154){
        if (line < 143) //We're on a normal scan line:
        this.LINECONTROL[line] = function(parentObj) {
            if (parentObj.LCDTicks < 80) parentObj.scanLineMode2();
            else if (parentObj.LCDTicks < 252) parentObj.scanLineMode3();
            else if (parentObj.LCDTicks < 456) parentObj.scanLineMode0();
            else {
                //We're on a new scan line:
                parentObj.LCDTicks -= 456;
                if (parentObj.STATTracker != 3) {
                    //Make sure the mode 0 handler was run at least once per scan line:
                    if (parentObj.STATTracker != 2) {
                        if (parentObj.STATTracker == 0 && parentObj.mode2TriggerSTAT) parentObj.interruptsRequested |= 2;
                        parentObj.incrementScanLineQueue();
                    }
                    if (parentObj.hdmaRunning) parentObj.executeHDMA();
                    if (parentObj.mode0TriggerSTAT) parentObj.interruptsRequested |= 2;
                }
                //Update the scanline registers and assert the LYC counter:
                parentObj.actualScanLine = ++parentObj.memory[65348];
                //Perform a LYC counter assert:
                if (parentObj.actualScanLine == parentObj.memory[65349]) {
                    parentObj.memory[65345] |= 4;
                    if (parentObj.LYCMatchTriggerSTAT) parentObj.interruptsRequested |= 2;
                } else parentObj.memory[65345] &= 123;
                parentObj.checkIRQMatching();
                //Reset our mode contingency variables:
                parentObj.STATTracker = 0;
                parentObj.modeSTAT = 2;
                parentObj.LINECONTROL[parentObj.actualScanLine](parentObj); //Scan Line and STAT Mode Control.
            }
        };
        else if (line == 143) //We're on the last visible scan line of the LCD screen:
        this.LINECONTROL[143] = function(parentObj) {
            if (parentObj.LCDTicks < 80) parentObj.scanLineMode2();
            else if (parentObj.LCDTicks < 252) parentObj.scanLineMode3();
            else if (parentObj.LCDTicks < 456) parentObj.scanLineMode0();
            else {
                //Starting V-Blank:
                //Just finished the last visible scan line:
                parentObj.LCDTicks -= 456;
                if (parentObj.STATTracker != 3) {
                    //Make sure the mode 0 handler was run at least once per scan line:
                    if (parentObj.STATTracker != 2) {
                        if (parentObj.STATTracker == 0 && parentObj.mode2TriggerSTAT) parentObj.interruptsRequested |= 2;
                        parentObj.incrementScanLineQueue();
                    }
                    if (parentObj.hdmaRunning) parentObj.executeHDMA();
                    if (parentObj.mode0TriggerSTAT) parentObj.interruptsRequested |= 2;
                }
                //Update the scanline registers and assert the LYC counter:
                parentObj.actualScanLine = parentObj.memory[65348] = 144;
                //Perform a LYC counter assert:
                if (parentObj.memory[65349] == 144) {
                    parentObj.memory[65345] |= 4;
                    if (parentObj.LYCMatchTriggerSTAT) parentObj.interruptsRequested |= 2;
                } else parentObj.memory[65345] &= 123;
                //Reset our mode contingency variables:
                parentObj.STATTracker = 0;
                //Update our state for v-blank:
                parentObj.modeSTAT = 1;
                parentObj.interruptsRequested |= parentObj.mode1TriggerSTAT ? 3 : 1;
                parentObj.checkIRQMatching();
                //Attempt to blit out to our canvas:
                if (parentObj.drewBlank == 0) //Ensure JIT framing alignment:
                {
                    if (parentObj.totalLinesPassed < 144 || parentObj.totalLinesPassed == 144 && parentObj.midScanlineOffset > -1) {
                        //Make sure our gfx are up-to-date:
                        parentObj.graphicsJITVBlank();
                        //Draw the frame:
                        parentObj.prepareFrame();
                    }
                } else //LCD off takes at least 2 frames:
                --parentObj.drewBlank;
                parentObj.LINECONTROL[144](parentObj); //Scan Line and STAT Mode Control.
            }
        };
        else if (line < 153) //In VBlank
        this.LINECONTROL[line] = function(parentObj) {
            if (parentObj.LCDTicks >= 456) {
                //We're on a new scan line:
                parentObj.LCDTicks -= 456;
                parentObj.actualScanLine = ++parentObj.memory[65348];
                //Perform a LYC counter assert:
                if (parentObj.actualScanLine == parentObj.memory[65349]) {
                    parentObj.memory[65345] |= 4;
                    if (parentObj.LYCMatchTriggerSTAT) {
                        parentObj.interruptsRequested |= 2;
                        parentObj.checkIRQMatching();
                    }
                } else parentObj.memory[65345] &= 123;
                parentObj.LINECONTROL[parentObj.actualScanLine](parentObj); //Scan Line and STAT Mode Control.
            }
        };
        else //VBlank Ending (We're on the last actual scan line)
        this.LINECONTROL[153] = function(parentObj) {
            if (parentObj.LCDTicks >= 8) {
                if (parentObj.STATTracker != 4 && parentObj.memory[65348] == 153) {
                    parentObj.memory[65348] = 0; //LY register resets to 0 early.
                    //Perform a LYC counter assert:
                    if (parentObj.memory[65349] == 0) {
                        parentObj.memory[65345] |= 4;
                        if (parentObj.LYCMatchTriggerSTAT) {
                            parentObj.interruptsRequested |= 2;
                            parentObj.checkIRQMatching();
                        }
                    } else parentObj.memory[65345] &= 123;
                    parentObj.STATTracker = 4;
                }
                if (parentObj.LCDTicks >= 456) {
                    //We reset back to the beginning:
                    parentObj.LCDTicks -= 456;
                    parentObj.STATTracker = parentObj.actualScanLine = 0;
                    parentObj.LINECONTROL[0](parentObj); //Scan Line and STAT Mode Control.
                }
            }
        };
        ++line;
    }
};
GameBoyCore.prototype.DisplayShowOff = function() {
    if (this.drewBlank == 0) {
        //Output a blank screen to the output framebuffer:
        this.clearFrameBuffer();
        this.drewFrame = true;
    }
    this.drewBlank = 2;
};
GameBoyCore.prototype.executeHDMA = function() {
    this.DMAWrite(1);
    if (this.halt) {
        if (this.LCDTicks - this.spriteCount < (4 >> this.doubleSpeedShifter | 32)) {
            //HALT clocking correction:
            this.CPUTicks = 4 + (32 + this.spriteCount << this.doubleSpeedShifter);
            this.LCDTicks = this.spriteCount + (4 >> this.doubleSpeedShifter | 32);
        }
    } else this.LCDTicks += 4 >> this.doubleSpeedShifter | 32; //LCD Timing Update For HDMA.
    if (this.memory[65365] == 0) {
        this.hdmaRunning = false;
        this.memory[65365] = 255; //Transfer completed ("Hidden last step," since some ROMs don't imply this, but most do).
    } else --this.memory[65365];
};
GameBoyCore.prototype.clockUpdate = function() {
    if (this.cTIMER) {
        var dateObj = new Date();
        var newTime = dateObj.getTime();
        var timeElapsed = newTime - this.lastIteration; //Get the numnber of milliseconds since this last executed.
        this.lastIteration = newTime;
        if (this.cTIMER && !this.RTCHALT) {
            //Update the MBC3 RTC:
            this.RTCSeconds += timeElapsed / 1000;
            while(this.RTCSeconds >= 60){
                this.RTCSeconds -= 60;
                ++this.RTCMinutes;
                if (this.RTCMinutes >= 60) {
                    this.RTCMinutes -= 60;
                    ++this.RTCHours;
                    if (this.RTCHours >= 24) {
                        this.RTCHours -= 24;
                        ++this.RTCDays;
                        if (this.RTCDays >= 512) {
                            this.RTCDays -= 512;
                            this.RTCDayOverFlow = true;
                        }
                    }
                }
            }
        }
    }
};
GameBoyCore.prototype.prepareFrame = function() {
    //Copy the internal frame buffer to the output buffer:
    this.swizzleFrameBuffer();
    this.drewFrame = true;
};
GameBoyCore.prototype.requestDraw = function() {
    if (this.drewFrame) this.dispatchDraw();
};
GameBoyCore.prototype.dispatchDraw = function() {
    if (this.offscreenRGBCount > 0) {
        //We actually updated the graphics internally, so copy out:
        if (this.offscreenRGBCount == 92160) this.processDraw(this.swizzledFrame);
        else this.resizeFrameBuffer();
    }
};
//ToDo: Remove this method, I don't think it's necessary.
//Converts rgb canvas into rgba.
GameBoyCore.prototype.processDraw = function(frameBuffer) {
    var canvasRGBALength = this.offscreenRGBCount;
    var canvasData = this.canvasBuffer.data;
    var bufferIndex = 0;
    for(var canvasIndex = 0; canvasIndex < canvasRGBALength; ++canvasIndex){
        canvasData[canvasIndex++] = frameBuffer[bufferIndex++];
        canvasData[canvasIndex++] = frameBuffer[bufferIndex++];
        canvasData[canvasIndex++] = frameBuffer[bufferIndex++];
    }
    this.graphicsBlit();
    this.drewFrame = false;
};
//Which means I want to grab the swizzledFrame, not the normal frameBuffer(?)
//ToDo: I believe (but am not sure) that I can remove this too.
GameBoyCore.prototype.swizzleFrameBuffer = function() {
    //Convert our dirty 24-bit (24-bit, with internal render flags above it) framebuffer to an 8-bit buffer with separate indices for the RGB channels:
    var frameBuffer = this.frameBuffer;
    var swizzledFrame = this.swizzledFrame;
    var bufferIndex = 0;
    for(var canvasIndex = 0; canvasIndex < 69120;){
        swizzledFrame[canvasIndex++] = frameBuffer[bufferIndex] >> 16 & 255; //Red
        swizzledFrame[canvasIndex++] = frameBuffer[bufferIndex] >> 8 & 255; //Green
        swizzledFrame[canvasIndex++] = frameBuffer[bufferIndex++] & 255; //Blue
    }
};
GameBoyCore.prototype.clearFrameBuffer = function() {
    var bufferIndex = 0;
    var frameBuffer = this.swizzledFrame;
    if (this.cGBC || this.colorizedGBPalettes) while(bufferIndex < 69120)frameBuffer[bufferIndex++] = 248;
    else while(bufferIndex < 69120){
        frameBuffer[bufferIndex++] = 239;
        frameBuffer[bufferIndex++] = 255;
        frameBuffer[bufferIndex++] = 222;
    }
};
GameBoyCore.prototype.resizeFrameBuffer = function() {
    //Resize in javascript with resize.js:
    if (this.resizePathClear) {
        this.resizePathClear = false;
        this.resizer.resize(this.swizzledFrame);
    }
};
GameBoyCore.prototype.compileResizeFrameBufferFunction = function() {
    if (this.offscreenRGBCount > 0) {
        var parentObj = this;
        this.resizer = new Resize(160, 144, this.offscreenWidth, this.offscreenHeight, false, settings[13], false, function(buffer) {
            if (buffer.length / 3 * 4 == parentObj.offscreenRGBCount) parentObj.processDraw(buffer);
            parentObj.resizePathClear = true;
        });
    }
};
GameBoyCore.prototype.renderScanLine = function(scanlineToRender) {
    this.pixelStart = scanlineToRender * 160;
    if (this.bgEnabled) {
        this.pixelEnd = 160;
        this.BGLayerRender(scanlineToRender);
        this.WindowLayerRender(scanlineToRender);
    } else {
        var pixelLine = (scanlineToRender + 1) * 160;
        var defaultColor = this.cGBC || this.colorizedGBPalettes ? 16316664 : 15728606;
        for(var pixelPosition = scanlineToRender * 160 + this.currentX; pixelPosition < pixelLine; pixelPosition++)this.frameBuffer[pixelPosition] = defaultColor;
    }
    this.SpriteLayerRender(scanlineToRender);
    this.currentX = 0;
    this.midScanlineOffset = -1;
};
GameBoyCore.prototype.renderMidScanLine = function() {
    if (this.actualScanLine < 144 && this.modeSTAT == 3) {
        //TODO: Get this accurate:
        if (this.midScanlineOffset == -1) this.midScanlineOffset = this.backgroundX & 7;
        if (this.LCDTicks >= 82) {
            this.pixelEnd = this.LCDTicks - 74;
            this.pixelEnd = Math.min(this.pixelEnd - this.midScanlineOffset - this.pixelEnd % 8, 160);
            if (this.bgEnabled) {
                this.pixelStart = this.lastUnrenderedLine * 160;
                this.BGLayerRender(this.lastUnrenderedLine);
                this.WindowLayerRender(this.lastUnrenderedLine);
            //TODO: Do midscanline JIT for sprites...
            } else {
                var pixelLine = this.lastUnrenderedLine * 160 + this.pixelEnd;
                var defaultColor = this.cGBC || this.colorizedGBPalettes ? 16316664 : 15728606;
                for(var pixelPosition = this.lastUnrenderedLine * 160 + this.currentX; pixelPosition < pixelLine; pixelPosition++)this.frameBuffer[pixelPosition] = defaultColor;
            }
            this.currentX = this.pixelEnd;
        }
    }
};
GameBoyCore.prototype.initializeModeSpecificArrays = function() {
    this.LCDCONTROL = this.LCDisOn ? this.LINECONTROL : this.DISPLAYOFFCONTROL;
    if (this.cGBC) {
        this.gbcOBJRawPalette = this.getTypedArray(64, 0, "uint8");
        this.gbcBGRawPalette = this.getTypedArray(64, 0, "uint8");
        this.gbcOBJPalette = this.getTypedArray(32, 16777216, "int32");
        this.gbcBGPalette = this.getTypedArray(64, 0, "int32");
        this.BGCHRBank2 = this.getTypedArray(2048, 0, "uint8");
        this.BGCHRCurrentBank = this.currVRAMBank > 0 ? this.BGCHRBank2 : this.BGCHRBank1;
        this.tileCache = this.generateCacheArray(3968);
    } else {
        this.gbOBJPalette = this.getTypedArray(8, 0, "int32");
        this.gbBGPalette = this.getTypedArray(4, 0, "int32");
        this.BGPalette = this.gbBGPalette;
        this.OBJPalette = this.gbOBJPalette;
        this.tileCache = this.generateCacheArray(1792);
        this.sortBuffer = this.getTypedArray(256, 0, "uint8");
        this.OAMAddressCache = this.getTypedArray(10, 0, "int32");
    }
    this.renderPathBuild();
};
GameBoyCore.prototype.GBCtoGBModeAdjust = function() {
    cout("Stepping down from GBC mode.", 0);
    this.VRAM = this.GBCMemory = this.BGCHRCurrentBank = this.BGCHRBank2 = null;
    this.tileCache.length = 1792;
    if (settings[4]) {
        this.gbBGColorizedPalette = this.getTypedArray(4, 0, "int32");
        this.gbOBJColorizedPalette = this.getTypedArray(8, 0, "int32");
        this.cachedBGPaletteConversion = this.getTypedArray(4, 0, "int32");
        this.cachedOBJPaletteConversion = this.getTypedArray(8, 0, "int32");
        this.BGPalette = this.gbBGColorizedPalette;
        this.OBJPalette = this.gbOBJColorizedPalette;
        this.gbOBJPalette = this.gbBGPalette = null;
        this.getGBCColor();
    } else {
        this.gbOBJPalette = this.getTypedArray(8, 0, "int32");
        this.gbBGPalette = this.getTypedArray(4, 0, "int32");
        this.BGPalette = this.gbBGPalette;
        this.OBJPalette = this.gbOBJPalette;
    }
    this.sortBuffer = this.getTypedArray(256, 0, "uint8");
    this.OAMAddressCache = this.getTypedArray(10, 0, "int32");
    this.renderPathBuild();
    this.memoryReadJumpCompile();
    this.memoryWriteJumpCompile();
};
GameBoyCore.prototype.renderPathBuild = function() {
    if (!this.cGBC) {
        this.BGLayerRender = this.BGGBLayerRender;
        this.WindowLayerRender = this.WindowGBLayerRender;
        this.SpriteLayerRender = this.SpriteGBLayerRender;
    } else {
        this.priorityFlaggingPathRebuild();
        this.SpriteLayerRender = this.SpriteGBCLayerRender;
    }
};
GameBoyCore.prototype.priorityFlaggingPathRebuild = function() {
    if (this.BGPriorityEnabled) {
        this.BGLayerRender = this.BGGBCLayerRender;
        this.WindowLayerRender = this.WindowGBCLayerRender;
    } else {
        this.BGLayerRender = this.BGGBCLayerRenderNoPriorityFlagging;
        this.WindowLayerRender = this.WindowGBCLayerRenderNoPriorityFlagging;
    }
};
GameBoyCore.prototype.initializeReferencesFromSaveState = function() {
    this.LCDCONTROL = this.LCDisOn ? this.LINECONTROL : this.DISPLAYOFFCONTROL;
    var tileIndex = 0;
    if (!this.cGBC) {
        if (this.colorizedGBPalettes) {
            this.BGPalette = this.gbBGColorizedPalette;
            this.OBJPalette = this.gbOBJColorizedPalette;
            this.updateGBBGPalette = this.updateGBColorizedBGPalette;
            this.updateGBOBJPalette = this.updateGBColorizedOBJPalette;
        } else {
            this.BGPalette = this.gbBGPalette;
            this.OBJPalette = this.gbOBJPalette;
        }
        this.tileCache = this.generateCacheArray(1792);
        for(tileIndex = 32768; tileIndex < 36864; tileIndex += 2)this.generateGBOAMTileLine(tileIndex);
        for(tileIndex = 36864; tileIndex < 38912; tileIndex += 2)this.generateGBTileLine(tileIndex);
        this.sortBuffer = this.getTypedArray(256, 0, "uint8");
        this.OAMAddressCache = this.getTypedArray(10, 0, "int32");
    } else {
        this.BGCHRCurrentBank = this.currVRAMBank > 0 ? this.BGCHRBank2 : this.BGCHRBank1;
        this.tileCache = this.generateCacheArray(3968);
        for(; tileIndex < 6144; tileIndex += 16){
            this.generateGBCTileBank1(tileIndex);
            this.generateGBCTileBank2(tileIndex);
        }
    }
    this.renderPathBuild();
};
GameBoyCore.prototype.RGBTint = function(value) {
    //Adjustment for the GBC's tinting (According to Gambatte):
    var r = value & 31;
    var g = value >> 5 & 31;
    var b = value >> 10 & 31;
    return r * 13 + g * 2 + b >> 1 << 16 | g * 3 + b << 9 | r * 3 + g * 2 + b * 11 >> 1;
};
GameBoyCore.prototype.getGBCColor = function() {
    //GBC Colorization of DMG ROMs:
    //BG
    for(var counter = 0; counter < 4; counter++){
        var adjustedIndex = counter << 1;
        //BG
        this.cachedBGPaletteConversion[counter] = this.RGBTint(this.gbcBGRawPalette[adjustedIndex | 1] << 8 | this.gbcBGRawPalette[adjustedIndex]);
        //OBJ 1
        this.cachedOBJPaletteConversion[counter] = this.RGBTint(this.gbcOBJRawPalette[adjustedIndex | 1] << 8 | this.gbcOBJRawPalette[adjustedIndex]);
    }
    //OBJ 2
    for(counter = 4; counter < 8; counter++){
        adjustedIndex = counter << 1;
        this.cachedOBJPaletteConversion[counter] = this.RGBTint(this.gbcOBJRawPalette[adjustedIndex | 1] << 8 | this.gbcOBJRawPalette[adjustedIndex]);
    }
    //Update the palette entries:
    this.updateGBBGPalette = this.updateGBColorizedBGPalette;
    this.updateGBOBJPalette = this.updateGBColorizedOBJPalette;
    this.updateGBBGPalette(this.memory[65351]);
    this.updateGBOBJPalette(0, this.memory[65352]);
    this.updateGBOBJPalette(1, this.memory[65353]);
    this.colorizedGBPalettes = true;
};
GameBoyCore.prototype.updateGBRegularBGPalette = function(data) {
    this.gbBGPalette[0] = this.colors[data & 3] | 33554432;
    this.gbBGPalette[1] = this.colors[data >> 2 & 3];
    this.gbBGPalette[2] = this.colors[data >> 4 & 3];
    this.gbBGPalette[3] = this.colors[data >> 6];
};
GameBoyCore.prototype.updateGBColorizedBGPalette = function(data) {
    //GB colorization:
    this.gbBGColorizedPalette[0] = this.cachedBGPaletteConversion[data & 3] | 33554432;
    this.gbBGColorizedPalette[1] = this.cachedBGPaletteConversion[data >> 2 & 3];
    this.gbBGColorizedPalette[2] = this.cachedBGPaletteConversion[data >> 4 & 3];
    this.gbBGColorizedPalette[3] = this.cachedBGPaletteConversion[data >> 6];
};
GameBoyCore.prototype.updateGBRegularOBJPalette = function(index, data) {
    this.gbOBJPalette[index | 1] = this.colors[data >> 2 & 3];
    this.gbOBJPalette[index | 2] = this.colors[data >> 4 & 3];
    this.gbOBJPalette[index | 3] = this.colors[data >> 6];
};
GameBoyCore.prototype.updateGBColorizedOBJPalette = function(index, data) {
    //GB colorization:
    this.gbOBJColorizedPalette[index | 1] = this.cachedOBJPaletteConversion[index | data >> 2 & 3];
    this.gbOBJColorizedPalette[index | 2] = this.cachedOBJPaletteConversion[index | data >> 4 & 3];
    this.gbOBJColorizedPalette[index | 3] = this.cachedOBJPaletteConversion[index | data >> 6];
};
GameBoyCore.prototype.updateGBCBGPalette = function(index, data) {
    if (this.gbcBGRawPalette[index] != data) {
        this.midScanLineJIT();
        //Update the color palette for BG tiles since it changed:
        this.gbcBGRawPalette[index] = data;
        if ((index & 6) == 0) {
            //Palette 0 (Special tile Priority stuff)
            data = 33554432 | this.RGBTint(this.gbcBGRawPalette[index | 1] << 8 | this.gbcBGRawPalette[index & 62]);
            index >>= 1;
            this.gbcBGPalette[index] = data;
            this.gbcBGPalette[32 | index] = 16777216 | data;
        } else {
            //Regular Palettes (No special crap)
            data = this.RGBTint(this.gbcBGRawPalette[index | 1] << 8 | this.gbcBGRawPalette[index & 62]);
            index >>= 1;
            this.gbcBGPalette[index] = data;
            this.gbcBGPalette[32 | index] = 16777216 | data;
        }
    }
};
GameBoyCore.prototype.updateGBCOBJPalette = function(index, data) {
    if (this.gbcOBJRawPalette[index] != data) {
        //Update the color palette for OBJ tiles since it changed:
        this.gbcOBJRawPalette[index] = data;
        if ((index & 6) > 0) {
            //Regular Palettes (No special crap)
            this.midScanLineJIT();
            this.gbcOBJPalette[index >> 1] = 16777216 | this.RGBTint(this.gbcOBJRawPalette[index | 1] << 8 | this.gbcOBJRawPalette[index & 62]);
        }
    }
};
GameBoyCore.prototype.BGGBLayerRender = function(scanlineToRender) {
    var scrollYAdjusted = this.backgroundY + scanlineToRender & 255; //The line of the BG we're at.
    var tileYLine = (scrollYAdjusted & 7) << 3;
    var tileYDown = this.gfxBackgroundCHRBankPosition | (scrollYAdjusted & 248) << 2; //The row of cached tiles we're fetching from.
    var scrollXAdjusted = this.backgroundX + this.currentX & 255; //The scroll amount of the BG.
    var pixelPosition = this.pixelStart + this.currentX; //Current pixel we're working on.
    var pixelPositionEnd = this.pixelStart + (this.gfxWindowDisplay && scanlineToRender - this.windowY >= 0 ? Math.min(Math.max(this.windowX, 0) + this.currentX, this.pixelEnd) : this.pixelEnd); //Make sure we do at most 160 pixels a scanline.
    var tileNumber = tileYDown + (scrollXAdjusted >> 3);
    var chrCode = this.BGCHRBank1[tileNumber];
    if (chrCode < this.gfxBackgroundBankOffset) chrCode |= 256;
    var tile = this.tileCache[chrCode];
    for(var texel = scrollXAdjusted & 7; texel < 8 && pixelPosition < pixelPositionEnd && scrollXAdjusted < 256; ++scrollXAdjusted)this.frameBuffer[pixelPosition++] = this.BGPalette[tile[tileYLine | texel++]];
    var scrollXAdjustedAligned = Math.min(pixelPositionEnd - pixelPosition, 256 - scrollXAdjusted) >> 3;
    scrollXAdjusted += scrollXAdjustedAligned << 3;
    scrollXAdjustedAligned += tileNumber;
    while(tileNumber < scrollXAdjustedAligned){
        chrCode = this.BGCHRBank1[++tileNumber];
        if (chrCode < this.gfxBackgroundBankOffset) chrCode |= 256;
        tile = this.tileCache[chrCode];
        texel = tileYLine;
        this.frameBuffer[pixelPosition++] = this.BGPalette[tile[texel++]];
        this.frameBuffer[pixelPosition++] = this.BGPalette[tile[texel++]];
        this.frameBuffer[pixelPosition++] = this.BGPalette[tile[texel++]];
        this.frameBuffer[pixelPosition++] = this.BGPalette[tile[texel++]];
        this.frameBuffer[pixelPosition++] = this.BGPalette[tile[texel++]];
        this.frameBuffer[pixelPosition++] = this.BGPalette[tile[texel++]];
        this.frameBuffer[pixelPosition++] = this.BGPalette[tile[texel++]];
        this.frameBuffer[pixelPosition++] = this.BGPalette[tile[texel]];
    }
    if (pixelPosition < pixelPositionEnd) {
        if (scrollXAdjusted < 256) {
            chrCode = this.BGCHRBank1[++tileNumber];
            if (chrCode < this.gfxBackgroundBankOffset) chrCode |= 256;
            tile = this.tileCache[chrCode];
            for(texel = tileYLine - 1; pixelPosition < pixelPositionEnd && scrollXAdjusted < 256; ++scrollXAdjusted)this.frameBuffer[pixelPosition++] = this.BGPalette[tile[++texel]];
        }
        scrollXAdjustedAligned = (pixelPositionEnd - pixelPosition >> 3) + tileYDown;
        while(tileYDown < scrollXAdjustedAligned){
            chrCode = this.BGCHRBank1[tileYDown++];
            if (chrCode < this.gfxBackgroundBankOffset) chrCode |= 256;
            tile = this.tileCache[chrCode];
            texel = tileYLine;
            this.frameBuffer[pixelPosition++] = this.BGPalette[tile[texel++]];
            this.frameBuffer[pixelPosition++] = this.BGPalette[tile[texel++]];
            this.frameBuffer[pixelPosition++] = this.BGPalette[tile[texel++]];
            this.frameBuffer[pixelPosition++] = this.BGPalette[tile[texel++]];
            this.frameBuffer[pixelPosition++] = this.BGPalette[tile[texel++]];
            this.frameBuffer[pixelPosition++] = this.BGPalette[tile[texel++]];
            this.frameBuffer[pixelPosition++] = this.BGPalette[tile[texel++]];
            this.frameBuffer[pixelPosition++] = this.BGPalette[tile[texel]];
        }
        if (pixelPosition < pixelPositionEnd) {
            chrCode = this.BGCHRBank1[tileYDown];
            if (chrCode < this.gfxBackgroundBankOffset) chrCode |= 256;
            tile = this.tileCache[chrCode];
            switch(pixelPositionEnd - pixelPosition){
                case 7:
                    this.frameBuffer[pixelPosition + 6] = this.BGPalette[tile[tileYLine | 6]];
                case 6:
                    this.frameBuffer[pixelPosition + 5] = this.BGPalette[tile[tileYLine | 5]];
                case 5:
                    this.frameBuffer[pixelPosition + 4] = this.BGPalette[tile[tileYLine | 4]];
                case 4:
                    this.frameBuffer[pixelPosition + 3] = this.BGPalette[tile[tileYLine | 3]];
                case 3:
                    this.frameBuffer[pixelPosition + 2] = this.BGPalette[tile[tileYLine | 2]];
                case 2:
                    this.frameBuffer[pixelPosition + 1] = this.BGPalette[tile[tileYLine | 1]];
                case 1:
                    this.frameBuffer[pixelPosition] = this.BGPalette[tile[tileYLine]];
            }
        }
    }
};
GameBoyCore.prototype.BGGBCLayerRender = function(scanlineToRender) {
    var scrollYAdjusted = this.backgroundY + scanlineToRender & 255; //The line of the BG we're at.
    var tileYLine = (scrollYAdjusted & 7) << 3;
    var tileYDown = this.gfxBackgroundCHRBankPosition | (scrollYAdjusted & 248) << 2; //The row of cached tiles we're fetching from.
    var scrollXAdjusted = this.backgroundX + this.currentX & 255; //The scroll amount of the BG.
    var pixelPosition = this.pixelStart + this.currentX; //Current pixel we're working on.
    var pixelPositionEnd = this.pixelStart + (this.gfxWindowDisplay && scanlineToRender - this.windowY >= 0 ? Math.min(Math.max(this.windowX, 0) + this.currentX, this.pixelEnd) : this.pixelEnd); //Make sure we do at most 160 pixels a scanline.
    var tileNumber = tileYDown + (scrollXAdjusted >> 3);
    var chrCode = this.BGCHRBank1[tileNumber];
    if (chrCode < this.gfxBackgroundBankOffset) chrCode |= 256;
    var attrCode = this.BGCHRBank2[tileNumber];
    var tile = this.tileCache[(attrCode & 8) << 8 | (attrCode & 96) << 4 | chrCode];
    var palette = (attrCode & 7) << 2 | (attrCode & 128) >> 2;
    for(var texel = scrollXAdjusted & 7; texel < 8 && pixelPosition < pixelPositionEnd && scrollXAdjusted < 256; ++scrollXAdjusted)this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[tileYLine | texel++]];
    var scrollXAdjustedAligned = Math.min(pixelPositionEnd - pixelPosition, 256 - scrollXAdjusted) >> 3;
    scrollXAdjusted += scrollXAdjustedAligned << 3;
    scrollXAdjustedAligned += tileNumber;
    while(tileNumber < scrollXAdjustedAligned){
        chrCode = this.BGCHRBank1[++tileNumber];
        if (chrCode < this.gfxBackgroundBankOffset) chrCode |= 256;
        attrCode = this.BGCHRBank2[tileNumber];
        tile = this.tileCache[(attrCode & 8) << 8 | (attrCode & 96) << 4 | chrCode];
        palette = (attrCode & 7) << 2 | (attrCode & 128) >> 2;
        texel = tileYLine;
        this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[texel++]];
        this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[texel++]];
        this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[texel++]];
        this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[texel++]];
        this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[texel++]];
        this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[texel++]];
        this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[texel++]];
        this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[texel]];
    }
    if (pixelPosition < pixelPositionEnd) {
        if (scrollXAdjusted < 256) {
            chrCode = this.BGCHRBank1[++tileNumber];
            if (chrCode < this.gfxBackgroundBankOffset) chrCode |= 256;
            attrCode = this.BGCHRBank2[tileNumber];
            tile = this.tileCache[(attrCode & 8) << 8 | (attrCode & 96) << 4 | chrCode];
            palette = (attrCode & 7) << 2 | (attrCode & 128) >> 2;
            for(texel = tileYLine - 1; pixelPosition < pixelPositionEnd && scrollXAdjusted < 256; ++scrollXAdjusted)this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[++texel]];
        }
        scrollXAdjustedAligned = (pixelPositionEnd - pixelPosition >> 3) + tileYDown;
        while(tileYDown < scrollXAdjustedAligned){
            chrCode = this.BGCHRBank1[tileYDown];
            if (chrCode < this.gfxBackgroundBankOffset) chrCode |= 256;
            attrCode = this.BGCHRBank2[tileYDown++];
            tile = this.tileCache[(attrCode & 8) << 8 | (attrCode & 96) << 4 | chrCode];
            palette = (attrCode & 7) << 2 | (attrCode & 128) >> 2;
            texel = tileYLine;
            this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[texel++]];
            this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[texel++]];
            this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[texel++]];
            this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[texel++]];
            this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[texel++]];
            this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[texel++]];
            this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[texel++]];
            this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[texel]];
        }
        if (pixelPosition < pixelPositionEnd) {
            chrCode = this.BGCHRBank1[tileYDown];
            if (chrCode < this.gfxBackgroundBankOffset) chrCode |= 256;
            attrCode = this.BGCHRBank2[tileYDown];
            tile = this.tileCache[(attrCode & 8) << 8 | (attrCode & 96) << 4 | chrCode];
            palette = (attrCode & 7) << 2 | (attrCode & 128) >> 2;
            switch(pixelPositionEnd - pixelPosition){
                case 7:
                    this.frameBuffer[pixelPosition + 6] = this.gbcBGPalette[palette | tile[tileYLine | 6]];
                case 6:
                    this.frameBuffer[pixelPosition + 5] = this.gbcBGPalette[palette | tile[tileYLine | 5]];
                case 5:
                    this.frameBuffer[pixelPosition + 4] = this.gbcBGPalette[palette | tile[tileYLine | 4]];
                case 4:
                    this.frameBuffer[pixelPosition + 3] = this.gbcBGPalette[palette | tile[tileYLine | 3]];
                case 3:
                    this.frameBuffer[pixelPosition + 2] = this.gbcBGPalette[palette | tile[tileYLine | 2]];
                case 2:
                    this.frameBuffer[pixelPosition + 1] = this.gbcBGPalette[palette | tile[tileYLine | 1]];
                case 1:
                    this.frameBuffer[pixelPosition] = this.gbcBGPalette[palette | tile[tileYLine]];
            }
        }
    }
};
GameBoyCore.prototype.BGGBCLayerRenderNoPriorityFlagging = function(scanlineToRender) {
    var scrollYAdjusted = this.backgroundY + scanlineToRender & 255; //The line of the BG we're at.
    var tileYLine = (scrollYAdjusted & 7) << 3;
    var tileYDown = this.gfxBackgroundCHRBankPosition | (scrollYAdjusted & 248) << 2; //The row of cached tiles we're fetching from.
    var scrollXAdjusted = this.backgroundX + this.currentX & 255; //The scroll amount of the BG.
    var pixelPosition = this.pixelStart + this.currentX; //Current pixel we're working on.
    var pixelPositionEnd = this.pixelStart + (this.gfxWindowDisplay && scanlineToRender - this.windowY >= 0 ? Math.min(Math.max(this.windowX, 0) + this.currentX, this.pixelEnd) : this.pixelEnd); //Make sure we do at most 160 pixels a scanline.
    var tileNumber = tileYDown + (scrollXAdjusted >> 3);
    var chrCode = this.BGCHRBank1[tileNumber];
    if (chrCode < this.gfxBackgroundBankOffset) chrCode |= 256;
    var attrCode = this.BGCHRBank2[tileNumber];
    var tile = this.tileCache[(attrCode & 8) << 8 | (attrCode & 96) << 4 | chrCode];
    var palette = (attrCode & 7) << 2;
    for(var texel = scrollXAdjusted & 7; texel < 8 && pixelPosition < pixelPositionEnd && scrollXAdjusted < 256; ++scrollXAdjusted)this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[tileYLine | texel++]];
    var scrollXAdjustedAligned = Math.min(pixelPositionEnd - pixelPosition, 256 - scrollXAdjusted) >> 3;
    scrollXAdjusted += scrollXAdjustedAligned << 3;
    scrollXAdjustedAligned += tileNumber;
    while(tileNumber < scrollXAdjustedAligned){
        chrCode = this.BGCHRBank1[++tileNumber];
        if (chrCode < this.gfxBackgroundBankOffset) chrCode |= 256;
        attrCode = this.BGCHRBank2[tileNumber];
        tile = this.tileCache[(attrCode & 8) << 8 | (attrCode & 96) << 4 | chrCode];
        palette = (attrCode & 7) << 2;
        texel = tileYLine;
        this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[texel++]];
        this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[texel++]];
        this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[texel++]];
        this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[texel++]];
        this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[texel++]];
        this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[texel++]];
        this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[texel++]];
        this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[texel]];
    }
    if (pixelPosition < pixelPositionEnd) {
        if (scrollXAdjusted < 256) {
            chrCode = this.BGCHRBank1[++tileNumber];
            if (chrCode < this.gfxBackgroundBankOffset) chrCode |= 256;
            attrCode = this.BGCHRBank2[tileNumber];
            tile = this.tileCache[(attrCode & 8) << 8 | (attrCode & 96) << 4 | chrCode];
            palette = (attrCode & 7) << 2;
            for(texel = tileYLine - 1; pixelPosition < pixelPositionEnd && scrollXAdjusted < 256; ++scrollXAdjusted)this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[++texel]];
        }
        scrollXAdjustedAligned = (pixelPositionEnd - pixelPosition >> 3) + tileYDown;
        while(tileYDown < scrollXAdjustedAligned){
            chrCode = this.BGCHRBank1[tileYDown];
            if (chrCode < this.gfxBackgroundBankOffset) chrCode |= 256;
            attrCode = this.BGCHRBank2[tileYDown++];
            tile = this.tileCache[(attrCode & 8) << 8 | (attrCode & 96) << 4 | chrCode];
            palette = (attrCode & 7) << 2;
            texel = tileYLine;
            this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[texel++]];
            this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[texel++]];
            this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[texel++]];
            this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[texel++]];
            this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[texel++]];
            this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[texel++]];
            this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[texel++]];
            this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[texel]];
        }
        if (pixelPosition < pixelPositionEnd) {
            chrCode = this.BGCHRBank1[tileYDown];
            if (chrCode < this.gfxBackgroundBankOffset) chrCode |= 256;
            attrCode = this.BGCHRBank2[tileYDown];
            tile = this.tileCache[(attrCode & 8) << 8 | (attrCode & 96) << 4 | chrCode];
            palette = (attrCode & 7) << 2;
            switch(pixelPositionEnd - pixelPosition){
                case 7:
                    this.frameBuffer[pixelPosition + 6] = this.gbcBGPalette[palette | tile[tileYLine | 6]];
                case 6:
                    this.frameBuffer[pixelPosition + 5] = this.gbcBGPalette[palette | tile[tileYLine | 5]];
                case 5:
                    this.frameBuffer[pixelPosition + 4] = this.gbcBGPalette[palette | tile[tileYLine | 4]];
                case 4:
                    this.frameBuffer[pixelPosition + 3] = this.gbcBGPalette[palette | tile[tileYLine | 3]];
                case 3:
                    this.frameBuffer[pixelPosition + 2] = this.gbcBGPalette[palette | tile[tileYLine | 2]];
                case 2:
                    this.frameBuffer[pixelPosition + 1] = this.gbcBGPalette[palette | tile[tileYLine | 1]];
                case 1:
                    this.frameBuffer[pixelPosition] = this.gbcBGPalette[palette | tile[tileYLine]];
            }
        }
    }
};
GameBoyCore.prototype.WindowGBLayerRender = function(scanlineToRender) {
    if (this.gfxWindowDisplay) {
        var scrollYAdjusted = scanlineToRender - this.windowY; //The line of the BG we're at.
        if (scrollYAdjusted >= 0) {
            var scrollXRangeAdjusted = this.windowX > 0 ? this.windowX + this.currentX : this.currentX;
            var pixelPosition = this.pixelStart + scrollXRangeAdjusted;
            var pixelPositionEnd = this.pixelStart + this.pixelEnd;
            if (pixelPosition < pixelPositionEnd) {
                var tileYLine = (scrollYAdjusted & 7) << 3;
                var tileNumber = (this.gfxWindowCHRBankPosition | (scrollYAdjusted & 248) << 2) + (this.currentX >> 3);
                var chrCode = this.BGCHRBank1[tileNumber];
                if (chrCode < this.gfxBackgroundBankOffset) chrCode |= 256;
                var tile = this.tileCache[chrCode];
                var texel = scrollXRangeAdjusted - this.windowX & 7;
                scrollXRangeAdjusted = Math.min(8, texel + pixelPositionEnd - pixelPosition);
                while(texel < scrollXRangeAdjusted)this.frameBuffer[pixelPosition++] = this.BGPalette[tile[tileYLine | texel++]];
                scrollXRangeAdjusted = tileNumber + (pixelPositionEnd - pixelPosition >> 3);
                while(tileNumber < scrollXRangeAdjusted){
                    chrCode = this.BGCHRBank1[++tileNumber];
                    if (chrCode < this.gfxBackgroundBankOffset) chrCode |= 256;
                    tile = this.tileCache[chrCode];
                    texel = tileYLine;
                    this.frameBuffer[pixelPosition++] = this.BGPalette[tile[texel++]];
                    this.frameBuffer[pixelPosition++] = this.BGPalette[tile[texel++]];
                    this.frameBuffer[pixelPosition++] = this.BGPalette[tile[texel++]];
                    this.frameBuffer[pixelPosition++] = this.BGPalette[tile[texel++]];
                    this.frameBuffer[pixelPosition++] = this.BGPalette[tile[texel++]];
                    this.frameBuffer[pixelPosition++] = this.BGPalette[tile[texel++]];
                    this.frameBuffer[pixelPosition++] = this.BGPalette[tile[texel++]];
                    this.frameBuffer[pixelPosition++] = this.BGPalette[tile[texel]];
                }
                if (pixelPosition < pixelPositionEnd) {
                    chrCode = this.BGCHRBank1[++tileNumber];
                    if (chrCode < this.gfxBackgroundBankOffset) chrCode |= 256;
                    tile = this.tileCache[chrCode];
                    switch(pixelPositionEnd - pixelPosition){
                        case 7:
                            this.frameBuffer[pixelPosition + 6] = this.BGPalette[tile[tileYLine | 6]];
                        case 6:
                            this.frameBuffer[pixelPosition + 5] = this.BGPalette[tile[tileYLine | 5]];
                        case 5:
                            this.frameBuffer[pixelPosition + 4] = this.BGPalette[tile[tileYLine | 4]];
                        case 4:
                            this.frameBuffer[pixelPosition + 3] = this.BGPalette[tile[tileYLine | 3]];
                        case 3:
                            this.frameBuffer[pixelPosition + 2] = this.BGPalette[tile[tileYLine | 2]];
                        case 2:
                            this.frameBuffer[pixelPosition + 1] = this.BGPalette[tile[tileYLine | 1]];
                        case 1:
                            this.frameBuffer[pixelPosition] = this.BGPalette[tile[tileYLine]];
                    }
                }
            }
        }
    }
};
GameBoyCore.prototype.WindowGBCLayerRender = function(scanlineToRender) {
    if (this.gfxWindowDisplay) {
        var scrollYAdjusted = scanlineToRender - this.windowY; //The line of the BG we're at.
        if (scrollYAdjusted >= 0) {
            var scrollXRangeAdjusted = this.windowX > 0 ? this.windowX + this.currentX : this.currentX;
            var pixelPosition = this.pixelStart + scrollXRangeAdjusted;
            var pixelPositionEnd = this.pixelStart + this.pixelEnd;
            if (pixelPosition < pixelPositionEnd) {
                var tileYLine = (scrollYAdjusted & 7) << 3;
                var tileNumber = (this.gfxWindowCHRBankPosition | (scrollYAdjusted & 248) << 2) + (this.currentX >> 3);
                var chrCode = this.BGCHRBank1[tileNumber];
                if (chrCode < this.gfxBackgroundBankOffset) chrCode |= 256;
                var attrCode = this.BGCHRBank2[tileNumber];
                var tile = this.tileCache[(attrCode & 8) << 8 | (attrCode & 96) << 4 | chrCode];
                var palette = (attrCode & 7) << 2 | (attrCode & 128) >> 2;
                var texel = scrollXRangeAdjusted - this.windowX & 7;
                scrollXRangeAdjusted = Math.min(8, texel + pixelPositionEnd - pixelPosition);
                while(texel < scrollXRangeAdjusted)this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[tileYLine | texel++]];
                scrollXRangeAdjusted = tileNumber + (pixelPositionEnd - pixelPosition >> 3);
                while(tileNumber < scrollXRangeAdjusted){
                    chrCode = this.BGCHRBank1[++tileNumber];
                    if (chrCode < this.gfxBackgroundBankOffset) chrCode |= 256;
                    attrCode = this.BGCHRBank2[tileNumber];
                    tile = this.tileCache[(attrCode & 8) << 8 | (attrCode & 96) << 4 | chrCode];
                    palette = (attrCode & 7) << 2 | (attrCode & 128) >> 2;
                    texel = tileYLine;
                    this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[texel++]];
                    this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[texel++]];
                    this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[texel++]];
                    this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[texel++]];
                    this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[texel++]];
                    this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[texel++]];
                    this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[texel++]];
                    this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[texel]];
                }
                if (pixelPosition < pixelPositionEnd) {
                    chrCode = this.BGCHRBank1[++tileNumber];
                    if (chrCode < this.gfxBackgroundBankOffset) chrCode |= 256;
                    attrCode = this.BGCHRBank2[tileNumber];
                    tile = this.tileCache[(attrCode & 8) << 8 | (attrCode & 96) << 4 | chrCode];
                    palette = (attrCode & 7) << 2 | (attrCode & 128) >> 2;
                    switch(pixelPositionEnd - pixelPosition){
                        case 7:
                            this.frameBuffer[pixelPosition + 6] = this.gbcBGPalette[palette | tile[tileYLine | 6]];
                        case 6:
                            this.frameBuffer[pixelPosition + 5] = this.gbcBGPalette[palette | tile[tileYLine | 5]];
                        case 5:
                            this.frameBuffer[pixelPosition + 4] = this.gbcBGPalette[palette | tile[tileYLine | 4]];
                        case 4:
                            this.frameBuffer[pixelPosition + 3] = this.gbcBGPalette[palette | tile[tileYLine | 3]];
                        case 3:
                            this.frameBuffer[pixelPosition + 2] = this.gbcBGPalette[palette | tile[tileYLine | 2]];
                        case 2:
                            this.frameBuffer[pixelPosition + 1] = this.gbcBGPalette[palette | tile[tileYLine | 1]];
                        case 1:
                            this.frameBuffer[pixelPosition] = this.gbcBGPalette[palette | tile[tileYLine]];
                    }
                }
            }
        }
    }
};
GameBoyCore.prototype.WindowGBCLayerRenderNoPriorityFlagging = function(scanlineToRender) {
    if (this.gfxWindowDisplay) {
        var scrollYAdjusted = scanlineToRender - this.windowY; //The line of the BG we're at.
        if (scrollYAdjusted >= 0) {
            var scrollXRangeAdjusted = this.windowX > 0 ? this.windowX + this.currentX : this.currentX;
            var pixelPosition = this.pixelStart + scrollXRangeAdjusted;
            var pixelPositionEnd = this.pixelStart + this.pixelEnd;
            if (pixelPosition < pixelPositionEnd) {
                var tileYLine = (scrollYAdjusted & 7) << 3;
                var tileNumber = (this.gfxWindowCHRBankPosition | (scrollYAdjusted & 248) << 2) + (this.currentX >> 3);
                var chrCode = this.BGCHRBank1[tileNumber];
                if (chrCode < this.gfxBackgroundBankOffset) chrCode |= 256;
                var attrCode = this.BGCHRBank2[tileNumber];
                var tile = this.tileCache[(attrCode & 8) << 8 | (attrCode & 96) << 4 | chrCode];
                var palette = (attrCode & 7) << 2;
                var texel = scrollXRangeAdjusted - this.windowX & 7;
                scrollXRangeAdjusted = Math.min(8, texel + pixelPositionEnd - pixelPosition);
                while(texel < scrollXRangeAdjusted)this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[tileYLine | texel++]];
                scrollXRangeAdjusted = tileNumber + (pixelPositionEnd - pixelPosition >> 3);
                while(tileNumber < scrollXRangeAdjusted){
                    chrCode = this.BGCHRBank1[++tileNumber];
                    if (chrCode < this.gfxBackgroundBankOffset) chrCode |= 256;
                    attrCode = this.BGCHRBank2[tileNumber];
                    tile = this.tileCache[(attrCode & 8) << 8 | (attrCode & 96) << 4 | chrCode];
                    palette = (attrCode & 7) << 2;
                    texel = tileYLine;
                    this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[texel++]];
                    this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[texel++]];
                    this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[texel++]];
                    this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[texel++]];
                    this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[texel++]];
                    this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[texel++]];
                    this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[texel++]];
                    this.frameBuffer[pixelPosition++] = this.gbcBGPalette[palette | tile[texel]];
                }
                if (pixelPosition < pixelPositionEnd) {
                    chrCode = this.BGCHRBank1[++tileNumber];
                    if (chrCode < this.gfxBackgroundBankOffset) chrCode |= 256;
                    attrCode = this.BGCHRBank2[tileNumber];
                    tile = this.tileCache[(attrCode & 8) << 8 | (attrCode & 96) << 4 | chrCode];
                    palette = (attrCode & 7) << 2;
                    switch(pixelPositionEnd - pixelPosition){
                        case 7:
                            this.frameBuffer[pixelPosition + 6] = this.gbcBGPalette[palette | tile[tileYLine | 6]];
                        case 6:
                            this.frameBuffer[pixelPosition + 5] = this.gbcBGPalette[palette | tile[tileYLine | 5]];
                        case 5:
                            this.frameBuffer[pixelPosition + 4] = this.gbcBGPalette[palette | tile[tileYLine | 4]];
                        case 4:
                            this.frameBuffer[pixelPosition + 3] = this.gbcBGPalette[palette | tile[tileYLine | 3]];
                        case 3:
                            this.frameBuffer[pixelPosition + 2] = this.gbcBGPalette[palette | tile[tileYLine | 2]];
                        case 2:
                            this.frameBuffer[pixelPosition + 1] = this.gbcBGPalette[palette | tile[tileYLine | 1]];
                        case 1:
                            this.frameBuffer[pixelPosition] = this.gbcBGPalette[palette | tile[tileYLine]];
                    }
                }
            }
        }
    }
};
GameBoyCore.prototype.SpriteGBLayerRender = function(scanlineToRender) {
    if (this.gfxSpriteShow) {
        var lineAdjusted = scanlineToRender + 16;
        var OAMAddress = 65024;
        var yoffset = 0;
        var xcoord = 1;
        var xCoordStart = 0;
        var xCoordEnd = 0;
        var attrCode = 0;
        var palette = 0;
        var tile = null;
        var data = 0;
        var spriteCount = 0;
        var length = 0;
        var currentPixel = 0;
        var linePixel = 0;
        //Clear our x-coord sort buffer:
        while(xcoord < 168)this.sortBuffer[xcoord++] = 255;
        if (this.gfxSpriteNormalHeight) //Draw the visible sprites:
        for(var length = this.findLowestSpriteDrawable(lineAdjusted, 7); spriteCount < length; ++spriteCount){
            OAMAddress = this.OAMAddressCache[spriteCount];
            yoffset = lineAdjusted - this.memory[OAMAddress] << 3;
            attrCode = this.memory[OAMAddress | 3];
            palette = (attrCode & 16) >> 2;
            tile = this.tileCache[(attrCode & 96) << 4 | this.memory[OAMAddress | 2]];
            linePixel = xCoordStart = this.memory[OAMAddress | 1];
            xCoordEnd = Math.min(168 - linePixel, 8);
            xcoord = linePixel > 7 ? 0 : 8 - linePixel;
            for(currentPixel = this.pixelStart + (linePixel > 8 ? linePixel - 8 : 0); xcoord < xCoordEnd; ++xcoord, ++currentPixel, ++linePixel)if (this.sortBuffer[linePixel] > xCoordStart) {
                if (this.frameBuffer[currentPixel] >= 33554432) {
                    data = tile[yoffset | xcoord];
                    if (data > 0) {
                        this.frameBuffer[currentPixel] = this.OBJPalette[palette | data];
                        this.sortBuffer[linePixel] = xCoordStart;
                    }
                } else if (this.frameBuffer[currentPixel] < 16777216) {
                    data = tile[yoffset | xcoord];
                    if (data > 0 && attrCode < 128) {
                        this.frameBuffer[currentPixel] = this.OBJPalette[palette | data];
                        this.sortBuffer[linePixel] = xCoordStart;
                    }
                }
            }
        }
        else //Draw the visible sprites:
        for(var length = this.findLowestSpriteDrawable(lineAdjusted, 15); spriteCount < length; ++spriteCount){
            OAMAddress = this.OAMAddressCache[spriteCount];
            yoffset = lineAdjusted - this.memory[OAMAddress] << 3;
            attrCode = this.memory[OAMAddress | 3];
            palette = (attrCode & 16) >> 2;
            if ((attrCode & 64) == (64 & yoffset)) tile = this.tileCache[(attrCode & 96) << 4 | this.memory[OAMAddress | 2] & 254];
            else tile = this.tileCache[(attrCode & 96) << 4 | this.memory[OAMAddress | 2] | 1];
            yoffset &= 63;
            linePixel = xCoordStart = this.memory[OAMAddress | 1];
            xCoordEnd = Math.min(168 - linePixel, 8);
            xcoord = linePixel > 7 ? 0 : 8 - linePixel;
            for(currentPixel = this.pixelStart + (linePixel > 8 ? linePixel - 8 : 0); xcoord < xCoordEnd; ++xcoord, ++currentPixel, ++linePixel)if (this.sortBuffer[linePixel] > xCoordStart) {
                if (this.frameBuffer[currentPixel] >= 33554432) {
                    data = tile[yoffset | xcoord];
                    if (data > 0) {
                        this.frameBuffer[currentPixel] = this.OBJPalette[palette | data];
                        this.sortBuffer[linePixel] = xCoordStart;
                    }
                } else if (this.frameBuffer[currentPixel] < 16777216) {
                    data = tile[yoffset | xcoord];
                    if (data > 0 && attrCode < 128) {
                        this.frameBuffer[currentPixel] = this.OBJPalette[palette | data];
                        this.sortBuffer[linePixel] = xCoordStart;
                    }
                }
            }
        }
    }
};
GameBoyCore.prototype.findLowestSpriteDrawable = function(scanlineToRender, drawableRange) {
    var address = 65024;
    var spriteCount = 0;
    var diff = 0;
    while(address < 65184 && spriteCount < 10){
        diff = scanlineToRender - this.memory[address];
        if ((diff & drawableRange) == diff) this.OAMAddressCache[spriteCount++] = address;
        address += 4;
    }
    return spriteCount;
};
GameBoyCore.prototype.SpriteGBCLayerRender = function(scanlineToRender) {
    if (this.gfxSpriteShow) {
        var OAMAddress = 65024;
        var lineAdjusted = scanlineToRender + 16;
        var yoffset = 0;
        var xcoord = 0;
        var endX = 0;
        var xCounter = 0;
        var attrCode = 0;
        var palette = 0;
        var tile = null;
        var data = 0;
        var currentPixel = 0;
        var spriteCount = 0;
        if (this.gfxSpriteNormalHeight) for(; OAMAddress < 65184 && spriteCount < 10; OAMAddress += 4){
            yoffset = lineAdjusted - this.memory[OAMAddress];
            if ((yoffset & 7) == yoffset) {
                xcoord = this.memory[OAMAddress | 1] - 8;
                endX = Math.min(160, xcoord + 8);
                attrCode = this.memory[OAMAddress | 3];
                palette = (attrCode & 7) << 2;
                tile = this.tileCache[(attrCode & 8) << 8 | (attrCode & 96) << 4 | this.memory[OAMAddress | 2]];
                xCounter = xcoord > 0 ? xcoord : 0;
                xcoord -= yoffset << 3;
                for(currentPixel = this.pixelStart + xCounter; xCounter < endX; ++xCounter, ++currentPixel){
                    if (this.frameBuffer[currentPixel] >= 33554432) {
                        data = tile[xCounter - xcoord];
                        if (data > 0) this.frameBuffer[currentPixel] = this.gbcOBJPalette[palette | data];
                    } else if (this.frameBuffer[currentPixel] < 16777216) {
                        data = tile[xCounter - xcoord];
                        if (data > 0 && attrCode < 128) this.frameBuffer[currentPixel] = this.gbcOBJPalette[palette | data];
                    }
                }
                ++spriteCount;
            }
        }
        else for(; OAMAddress < 65184 && spriteCount < 10; OAMAddress += 4){
            yoffset = lineAdjusted - this.memory[OAMAddress];
            if ((yoffset & 15) == yoffset) {
                xcoord = this.memory[OAMAddress | 1] - 8;
                endX = Math.min(160, xcoord + 8);
                attrCode = this.memory[OAMAddress | 3];
                palette = (attrCode & 7) << 2;
                if ((attrCode & 64) == (64 & yoffset << 3)) tile = this.tileCache[(attrCode & 8) << 8 | (attrCode & 96) << 4 | this.memory[OAMAddress | 2] & 254];
                else tile = this.tileCache[(attrCode & 8) << 8 | (attrCode & 96) << 4 | this.memory[OAMAddress | 2] | 1];
                xCounter = xcoord > 0 ? xcoord : 0;
                xcoord -= (yoffset & 7) << 3;
                for(currentPixel = this.pixelStart + xCounter; xCounter < endX; ++xCounter, ++currentPixel){
                    if (this.frameBuffer[currentPixel] >= 33554432) {
                        data = tile[xCounter - xcoord];
                        if (data > 0) this.frameBuffer[currentPixel] = this.gbcOBJPalette[palette | data];
                    } else if (this.frameBuffer[currentPixel] < 16777216) {
                        data = tile[xCounter - xcoord];
                        if (data > 0 && attrCode < 128) this.frameBuffer[currentPixel] = this.gbcOBJPalette[palette | data];
                    }
                }
                ++spriteCount;
            }
        }
    }
};
//Generate only a single tile line for the GB tile cache mode:
GameBoyCore.prototype.generateGBTileLine = function(address) {
    var lineCopy = this.memory[1 | address] << 8 | this.memory[40958 & address];
    var tileBlock = this.tileCache[(address & 8176) >> 4];
    address = (address & 14) << 2;
    tileBlock[address | 7] = (lineCopy & 256) >> 7 | lineCopy & 1;
    tileBlock[address | 6] = (lineCopy & 512) >> 8 | (lineCopy & 2) >> 1;
    tileBlock[address | 5] = (lineCopy & 1024) >> 9 | (lineCopy & 4) >> 2;
    tileBlock[address | 4] = (lineCopy & 2048) >> 10 | (lineCopy & 8) >> 3;
    tileBlock[address | 3] = (lineCopy & 4096) >> 11 | (lineCopy & 16) >> 4;
    tileBlock[address | 2] = (lineCopy & 8192) >> 12 | (lineCopy & 32) >> 5;
    tileBlock[address | 1] = (lineCopy & 16384) >> 13 | (lineCopy & 64) >> 6;
    tileBlock[address] = (lineCopy & 32768) >> 14 | (lineCopy & 128) >> 7;
};
//Generate only a single tile line for the GBC tile cache mode (Bank 1):
GameBoyCore.prototype.generateGBCTileLineBank1 = function(address) {
    var lineCopy = this.memory[1 | address] << 8 | this.memory[40958 & address];
    address &= 8190;
    var tileBlock1 = this.tileCache[address >> 4];
    var tileBlock2 = this.tileCache[512 | address >> 4];
    var tileBlock3 = this.tileCache[1024 | address >> 4];
    var tileBlock4 = this.tileCache[1536 | address >> 4];
    address = (address & 14) << 2;
    var addressFlipped = 56 - address;
    tileBlock4[addressFlipped] = tileBlock2[address] = tileBlock3[addressFlipped | 7] = tileBlock1[address | 7] = (lineCopy & 256) >> 7 | lineCopy & 1;
    tileBlock4[addressFlipped | 1] = tileBlock2[address | 1] = tileBlock3[addressFlipped | 6] = tileBlock1[address | 6] = (lineCopy & 512) >> 8 | (lineCopy & 2) >> 1;
    tileBlock4[addressFlipped | 2] = tileBlock2[address | 2] = tileBlock3[addressFlipped | 5] = tileBlock1[address | 5] = (lineCopy & 1024) >> 9 | (lineCopy & 4) >> 2;
    tileBlock4[addressFlipped | 3] = tileBlock2[address | 3] = tileBlock3[addressFlipped | 4] = tileBlock1[address | 4] = (lineCopy & 2048) >> 10 | (lineCopy & 8) >> 3;
    tileBlock4[addressFlipped | 4] = tileBlock2[address | 4] = tileBlock3[addressFlipped | 3] = tileBlock1[address | 3] = (lineCopy & 4096) >> 11 | (lineCopy & 16) >> 4;
    tileBlock4[addressFlipped | 5] = tileBlock2[address | 5] = tileBlock3[addressFlipped | 2] = tileBlock1[address | 2] = (lineCopy & 8192) >> 12 | (lineCopy & 32) >> 5;
    tileBlock4[addressFlipped | 6] = tileBlock2[address | 6] = tileBlock3[addressFlipped | 1] = tileBlock1[address | 1] = (lineCopy & 16384) >> 13 | (lineCopy & 64) >> 6;
    tileBlock4[addressFlipped | 7] = tileBlock2[address | 7] = tileBlock3[addressFlipped] = tileBlock1[address] = (lineCopy & 32768) >> 14 | (lineCopy & 128) >> 7;
};
//Generate all the flip combinations for a full GBC VRAM bank 1 tile:
GameBoyCore.prototype.generateGBCTileBank1 = function(vramAddress) {
    var address = vramAddress >> 4;
    var tileBlock1 = this.tileCache[address];
    var tileBlock2 = this.tileCache[512 | address];
    var tileBlock3 = this.tileCache[1024 | address];
    var tileBlock4 = this.tileCache[1536 | address];
    var lineCopy = 0;
    vramAddress |= 32768;
    address = 0;
    var addressFlipped = 56;
    do {
        lineCopy = this.memory[1 | vramAddress] << 8 | this.memory[vramAddress];
        tileBlock4[addressFlipped] = tileBlock2[address] = tileBlock3[addressFlipped | 7] = tileBlock1[address | 7] = (lineCopy & 256) >> 7 | lineCopy & 1;
        tileBlock4[addressFlipped | 1] = tileBlock2[address | 1] = tileBlock3[addressFlipped | 6] = tileBlock1[address | 6] = (lineCopy & 512) >> 8 | (lineCopy & 2) >> 1;
        tileBlock4[addressFlipped | 2] = tileBlock2[address | 2] = tileBlock3[addressFlipped | 5] = tileBlock1[address | 5] = (lineCopy & 1024) >> 9 | (lineCopy & 4) >> 2;
        tileBlock4[addressFlipped | 3] = tileBlock2[address | 3] = tileBlock3[addressFlipped | 4] = tileBlock1[address | 4] = (lineCopy & 2048) >> 10 | (lineCopy & 8) >> 3;
        tileBlock4[addressFlipped | 4] = tileBlock2[address | 4] = tileBlock3[addressFlipped | 3] = tileBlock1[address | 3] = (lineCopy & 4096) >> 11 | (lineCopy & 16) >> 4;
        tileBlock4[addressFlipped | 5] = tileBlock2[address | 5] = tileBlock3[addressFlipped | 2] = tileBlock1[address | 2] = (lineCopy & 8192) >> 12 | (lineCopy & 32) >> 5;
        tileBlock4[addressFlipped | 6] = tileBlock2[address | 6] = tileBlock3[addressFlipped | 1] = tileBlock1[address | 1] = (lineCopy & 16384) >> 13 | (lineCopy & 64) >> 6;
        tileBlock4[addressFlipped | 7] = tileBlock2[address | 7] = tileBlock3[addressFlipped] = tileBlock1[address] = (lineCopy & 32768) >> 14 | (lineCopy & 128) >> 7;
        address += 8;
        addressFlipped -= 8;
        vramAddress += 2;
    }while (addressFlipped > -1)
};
//Generate only a single tile line for the GBC tile cache mode (Bank 2):
GameBoyCore.prototype.generateGBCTileLineBank2 = function(address) {
    var lineCopy = this.VRAM[1 | address] << 8 | this.VRAM[8190 & address];
    var tileBlock1 = this.tileCache[2048 | address >> 4];
    var tileBlock2 = this.tileCache[2560 | address >> 4];
    var tileBlock3 = this.tileCache[3072 | address >> 4];
    var tileBlock4 = this.tileCache[3584 | address >> 4];
    address = (address & 14) << 2;
    var addressFlipped = 56 - address;
    tileBlock4[addressFlipped] = tileBlock2[address] = tileBlock3[addressFlipped | 7] = tileBlock1[address | 7] = (lineCopy & 256) >> 7 | lineCopy & 1;
    tileBlock4[addressFlipped | 1] = tileBlock2[address | 1] = tileBlock3[addressFlipped | 6] = tileBlock1[address | 6] = (lineCopy & 512) >> 8 | (lineCopy & 2) >> 1;
    tileBlock4[addressFlipped | 2] = tileBlock2[address | 2] = tileBlock3[addressFlipped | 5] = tileBlock1[address | 5] = (lineCopy & 1024) >> 9 | (lineCopy & 4) >> 2;
    tileBlock4[addressFlipped | 3] = tileBlock2[address | 3] = tileBlock3[addressFlipped | 4] = tileBlock1[address | 4] = (lineCopy & 2048) >> 10 | (lineCopy & 8) >> 3;
    tileBlock4[addressFlipped | 4] = tileBlock2[address | 4] = tileBlock3[addressFlipped | 3] = tileBlock1[address | 3] = (lineCopy & 4096) >> 11 | (lineCopy & 16) >> 4;
    tileBlock4[addressFlipped | 5] = tileBlock2[address | 5] = tileBlock3[addressFlipped | 2] = tileBlock1[address | 2] = (lineCopy & 8192) >> 12 | (lineCopy & 32) >> 5;
    tileBlock4[addressFlipped | 6] = tileBlock2[address | 6] = tileBlock3[addressFlipped | 1] = tileBlock1[address | 1] = (lineCopy & 16384) >> 13 | (lineCopy & 64) >> 6;
    tileBlock4[addressFlipped | 7] = tileBlock2[address | 7] = tileBlock3[addressFlipped] = tileBlock1[address] = (lineCopy & 32768) >> 14 | (lineCopy & 128) >> 7;
};
//Generate all the flip combinations for a full GBC VRAM bank 2 tile:
GameBoyCore.prototype.generateGBCTileBank2 = function(vramAddress) {
    var address = vramAddress >> 4;
    var tileBlock1 = this.tileCache[2048 | address];
    var tileBlock2 = this.tileCache[2560 | address];
    var tileBlock3 = this.tileCache[3072 | address];
    var tileBlock4 = this.tileCache[3584 | address];
    var lineCopy = 0;
    address = 0;
    var addressFlipped = 56;
    do {
        lineCopy = this.VRAM[1 | vramAddress] << 8 | this.VRAM[vramAddress];
        tileBlock4[addressFlipped] = tileBlock2[address] = tileBlock3[addressFlipped | 7] = tileBlock1[address | 7] = (lineCopy & 256) >> 7 | lineCopy & 1;
        tileBlock4[addressFlipped | 1] = tileBlock2[address | 1] = tileBlock3[addressFlipped | 6] = tileBlock1[address | 6] = (lineCopy & 512) >> 8 | (lineCopy & 2) >> 1;
        tileBlock4[addressFlipped | 2] = tileBlock2[address | 2] = tileBlock3[addressFlipped | 5] = tileBlock1[address | 5] = (lineCopy & 1024) >> 9 | (lineCopy & 4) >> 2;
        tileBlock4[addressFlipped | 3] = tileBlock2[address | 3] = tileBlock3[addressFlipped | 4] = tileBlock1[address | 4] = (lineCopy & 2048) >> 10 | (lineCopy & 8) >> 3;
        tileBlock4[addressFlipped | 4] = tileBlock2[address | 4] = tileBlock3[addressFlipped | 3] = tileBlock1[address | 3] = (lineCopy & 4096) >> 11 | (lineCopy & 16) >> 4;
        tileBlock4[addressFlipped | 5] = tileBlock2[address | 5] = tileBlock3[addressFlipped | 2] = tileBlock1[address | 2] = (lineCopy & 8192) >> 12 | (lineCopy & 32) >> 5;
        tileBlock4[addressFlipped | 6] = tileBlock2[address | 6] = tileBlock3[addressFlipped | 1] = tileBlock1[address | 1] = (lineCopy & 16384) >> 13 | (lineCopy & 64) >> 6;
        tileBlock4[addressFlipped | 7] = tileBlock2[address | 7] = tileBlock3[addressFlipped] = tileBlock1[address] = (lineCopy & 32768) >> 14 | (lineCopy & 128) >> 7;
        address += 8;
        addressFlipped -= 8;
        vramAddress += 2;
    }while (addressFlipped > -1)
};
//Generate only a single tile line for the GB tile cache mode (OAM accessible range):
GameBoyCore.prototype.generateGBOAMTileLine = function(address) {
    var lineCopy = this.memory[1 | address] << 8 | this.memory[40958 & address];
    address &= 8190;
    var tileBlock1 = this.tileCache[address >> 4];
    var tileBlock2 = this.tileCache[512 | address >> 4];
    var tileBlock3 = this.tileCache[1024 | address >> 4];
    var tileBlock4 = this.tileCache[1536 | address >> 4];
    address = (address & 14) << 2;
    var addressFlipped = 56 - address;
    tileBlock4[addressFlipped] = tileBlock2[address] = tileBlock3[addressFlipped | 7] = tileBlock1[address | 7] = (lineCopy & 256) >> 7 | lineCopy & 1;
    tileBlock4[addressFlipped | 1] = tileBlock2[address | 1] = tileBlock3[addressFlipped | 6] = tileBlock1[address | 6] = (lineCopy & 512) >> 8 | (lineCopy & 2) >> 1;
    tileBlock4[addressFlipped | 2] = tileBlock2[address | 2] = tileBlock3[addressFlipped | 5] = tileBlock1[address | 5] = (lineCopy & 1024) >> 9 | (lineCopy & 4) >> 2;
    tileBlock4[addressFlipped | 3] = tileBlock2[address | 3] = tileBlock3[addressFlipped | 4] = tileBlock1[address | 4] = (lineCopy & 2048) >> 10 | (lineCopy & 8) >> 3;
    tileBlock4[addressFlipped | 4] = tileBlock2[address | 4] = tileBlock3[addressFlipped | 3] = tileBlock1[address | 3] = (lineCopy & 4096) >> 11 | (lineCopy & 16) >> 4;
    tileBlock4[addressFlipped | 5] = tileBlock2[address | 5] = tileBlock3[addressFlipped | 2] = tileBlock1[address | 2] = (lineCopy & 8192) >> 12 | (lineCopy & 32) >> 5;
    tileBlock4[addressFlipped | 6] = tileBlock2[address | 6] = tileBlock3[addressFlipped | 1] = tileBlock1[address | 1] = (lineCopy & 16384) >> 13 | (lineCopy & 64) >> 6;
    tileBlock4[addressFlipped | 7] = tileBlock2[address | 7] = tileBlock3[addressFlipped] = tileBlock1[address] = (lineCopy & 32768) >> 14 | (lineCopy & 128) >> 7;
};
GameBoyCore.prototype.graphicsJIT = function() {
    if (this.LCDisOn) {
        this.totalLinesPassed = 0; //Mark frame for ensuring a JIT pass for the next framebuffer output.
        this.graphicsJITScanlineGroup();
    }
};
GameBoyCore.prototype.graphicsJITVBlank = function() {
    //JIT the graphics to v-blank framing:
    this.totalLinesPassed += this.queuedScanLines;
    this.graphicsJITScanlineGroup();
};
GameBoyCore.prototype.graphicsJITScanlineGroup = function() {
    //Normal rendering JIT, where we try to do groups of scanlines at once:
    while(this.queuedScanLines > 0){
        this.renderScanLine(this.lastUnrenderedLine);
        if (this.lastUnrenderedLine < 143) ++this.lastUnrenderedLine;
        else this.lastUnrenderedLine = 0;
        --this.queuedScanLines;
    }
};
GameBoyCore.prototype.incrementScanLineQueue = function() {
    if (this.queuedScanLines < 144) ++this.queuedScanLines;
    else {
        this.currentX = 0;
        this.midScanlineOffset = -1;
        if (this.lastUnrenderedLine < 143) ++this.lastUnrenderedLine;
        else this.lastUnrenderedLine = 0;
    }
};
GameBoyCore.prototype.midScanLineJIT = function() {
    this.graphicsJIT();
    this.renderMidScanLine();
};
//Check for the highest priority IRQ to fire:
GameBoyCore.prototype.launchIRQ = function() {
    var bitShift = 0;
    var testbit = 1;
    do {
        //Check to see if an interrupt is enabled AND requested.
        if ((testbit & this.IRQLineMatched) == testbit) {
            this.IME = false; //Reset the interrupt enabling.
            this.interruptsRequested -= testbit; //Reset the interrupt request.
            this.IRQLineMatched = 0; //Reset the IRQ assertion.
            //Interrupts have a certain clock cycle length:
            this.CPUTicks = 20;
            //Set the stack pointer to the current program counter value:
            this.stackPointer = this.stackPointer - 1 & 65535;
            this.memoryWriter[this.stackPointer](this, this.stackPointer, this.programCounter >> 8);
            this.stackPointer = this.stackPointer - 1 & 65535;
            this.memoryWriter[this.stackPointer](this, this.stackPointer, this.programCounter & 255);
            //Set the program counter to the interrupt's address:
            this.programCounter = 64 | bitShift << 3;
            //Clock the core for mid-instruction updates:
            this.updateCore();
            return; //We only want the highest priority interrupt.
        }
        testbit = 1 << ++bitShift;
    }while (bitShift < 5)
};
/*
    Check for IRQs to be fired while not in HALT:
*/ GameBoyCore.prototype.checkIRQMatching = function() {
    if (this.IME) this.IRQLineMatched = this.interruptsEnabled & this.interruptsRequested & 31;
};
/*
    Handle the HALT opcode by predicting all IRQ cases correctly,
    then selecting the next closest IRQ firing from the prediction to
    clock up to. This prevents hacky looping that doesn't predict, but
    instead just clocks through the core update procedure by one which
    is very slow. Not many emulators do this because they have to cover
    all the IRQ prediction cases and they usually get them wrong.
*/ GameBoyCore.prototype.calculateHALTPeriod = function() {
    //Initialize our variables and start our prediction:
    if (!this.halt) {
        this.halt = true;
        var currentClocks = -1;
        var temp_var = 0;
        if (this.LCDisOn) {
            //If the LCD is enabled, then predict the LCD IRQs enabled:
            if ((this.interruptsEnabled & 1) == 1) currentClocks = 456 * ((this.modeSTAT == 1 ? 298 : 144) - this.actualScanLine) - this.LCDTicks << this.doubleSpeedShifter;
            if ((this.interruptsEnabled & 2) == 2) {
                if (this.mode0TriggerSTAT) {
                    temp_var = this.clocksUntilMode0() - this.LCDTicks << this.doubleSpeedShifter;
                    if (temp_var <= currentClocks || currentClocks == -1) currentClocks = temp_var;
                }
                if (this.mode1TriggerSTAT && (this.interruptsEnabled & 1) == 0) {
                    temp_var = 456 * ((this.modeSTAT == 1 ? 298 : 144) - this.actualScanLine) - this.LCDTicks << this.doubleSpeedShifter;
                    if (temp_var <= currentClocks || currentClocks == -1) currentClocks = temp_var;
                }
                if (this.mode2TriggerSTAT) {
                    temp_var = (this.actualScanLine >= 143 ? 456 * (154 - this.actualScanLine) : 456) - this.LCDTicks << this.doubleSpeedShifter;
                    if (temp_var <= currentClocks || currentClocks == -1) currentClocks = temp_var;
                }
                if (this.LYCMatchTriggerSTAT && this.memory[65349] <= 153) {
                    temp_var = this.clocksUntilLYCMatch() - this.LCDTicks << this.doubleSpeedShifter;
                    if (temp_var <= currentClocks || currentClocks == -1) currentClocks = temp_var;
                }
            }
        }
        if (this.TIMAEnabled && (this.interruptsEnabled & 4) == 4) {
            //CPU timer IRQ prediction:
            temp_var = (256 - this.memory[65285]) * this.TACClocker - this.timerTicks;
            if (temp_var <= currentClocks || currentClocks == -1) currentClocks = temp_var;
        }
        if (this.serialTimer > 0 && (this.interruptsEnabled & 8) == 8) //Serial IRQ prediction:
        {
            if (this.serialTimer <= currentClocks || currentClocks == -1) currentClocks = this.serialTimer;
        }
    } else var currentClocks = this.remainingClocks;
    var maxClocks = this.CPUCyclesTotal - this.emulatorTicks << this.doubleSpeedShifter;
    if (currentClocks >= 0) {
        if (currentClocks <= maxClocks) {
            //Exit out of HALT normally:
            this.CPUTicks = Math.max(currentClocks, this.CPUTicks);
            this.updateCoreFull();
            this.halt = false;
            this.CPUTicks = 0;
        } else {
            //Still in HALT, clock only up to the clocks specified per iteration:
            this.CPUTicks = Math.max(maxClocks, this.CPUTicks);
            this.remainingClocks = currentClocks - this.CPUTicks;
        }
    } else //Still in HALT, clock only up to the clocks specified per iteration:
    //Will stay in HALT forever (Stuck in HALT forever), but the APU and LCD are still clocked, so don't pause:
    this.CPUTicks += maxClocks;
};
//Memory Reading:
GameBoyCore.prototype.memoryRead = function(address) {
    //Act as a wrapper for reading the returns from the compiled jumps to memory.
    return this.memoryReader[address](this, address); //This seems to be faster than the usual if/else.
};
GameBoyCore.prototype.memoryHighRead = function(address) {
    //Act as a wrapper for reading the returns from the compiled jumps to memory.
    return this.memoryHighReader[address](this, address); //This seems to be faster than the usual if/else.
};
GameBoyCore.prototype.memoryReadJumpCompile = function() {
    //Faster in some browsers, since we are doing less conditionals overall by implementing them in advance.
    for(var index = 0; index <= 65535; index++){
        if (index < 16384) this.memoryReader[index] = this.memoryReadNormal;
        else if (index < 32768) this.memoryReader[index] = this.memoryReadROM;
        else if (index < 38912) this.memoryReader[index] = this.cGBC ? this.VRAMDATAReadCGBCPU : this.VRAMDATAReadDMGCPU;
        else if (index < 40960) this.memoryReader[index] = this.cGBC ? this.VRAMCHRReadCGBCPU : this.VRAMCHRReadDMGCPU;
        else if (index >= 40960 && index < 49152) {
            if (this.numRAMBanks == 0.0625 && index < 41472 || this.numRAMBanks >= 1) {
                if (this.cMBC7) this.memoryReader[index] = this.memoryReadMBC7;
                else if (!this.cMBC3) this.memoryReader[index] = this.memoryReadMBC;
                else //MBC3 RTC + RAM:
                this.memoryReader[index] = this.memoryReadMBC3;
            } else this.memoryReader[index] = this.memoryReadBAD;
        } else if (index >= 49152 && index < 57344) {
            if (!this.cGBC || index < 53248) this.memoryReader[index] = this.memoryReadNormal;
            else this.memoryReader[index] = this.memoryReadGBCMemory;
        } else if (index >= 57344 && index < 65024) {
            if (!this.cGBC || index < 61440) this.memoryReader[index] = this.memoryReadECHONormal;
            else this.memoryReader[index] = this.memoryReadECHOGBCMemory;
        } else if (index < 65184) this.memoryReader[index] = this.memoryReadOAM;
        else if (this.cGBC && index >= 65184 && index < 65280) this.memoryReader[index] = this.memoryReadNormal;
        else if (index >= 65280) switch(index){
            case 65280:
                //JOYPAD:
                this.memoryHighReader[0] = this.memoryReader[65280] = function(parentObj, address) {
                    return 192 | parentObj.memory[65280]; //Top nibble returns as set.
                };
                break;
            case 65281:
                //SB
                this.memoryHighReader[1] = this.memoryReader[65281] = function(parentObj, address) {
                    return parentObj.memory[65282] < 128 ? parentObj.memory[65281] : 255;
                };
                break;
            case 65282:
                //SC
                if (this.cGBC) this.memoryHighReader[2] = this.memoryReader[65282] = function(parentObj, address) {
                    return (parentObj.serialTimer <= 0 ? 124 : 252) | parentObj.memory[65282];
                };
                else this.memoryHighReader[2] = this.memoryReader[65282] = function(parentObj, address) {
                    return (parentObj.serialTimer <= 0 ? 126 : 254) | parentObj.memory[65282];
                };
                break;
            case 65283:
                this.memoryHighReader[3] = this.memoryReader[65283] = this.memoryReadBAD;
                break;
            case 65284:
                //DIV
                this.memoryHighReader[4] = this.memoryReader[65284] = function(parentObj, address) {
                    parentObj.memory[65284] = parentObj.memory[65284] + (parentObj.DIVTicks >> 8) & 255;
                    parentObj.DIVTicks &= 255;
                    return parentObj.memory[65284];
                };
                break;
            case 65285:
            case 65286:
                this.memoryHighReader[index & 255] = this.memoryHighReadNormal;
                this.memoryReader[index] = this.memoryReadNormal;
                break;
            case 65287:
                this.memoryHighReader[7] = this.memoryReader[65287] = function(parentObj, address) {
                    return 248 | parentObj.memory[65287];
                };
                break;
            case 65288:
            case 65289:
            case 65290:
            case 65291:
            case 65292:
            case 65293:
            case 65294:
                this.memoryHighReader[index & 255] = this.memoryReader[index] = this.memoryReadBAD;
                break;
            case 65295:
                //IF
                this.memoryHighReader[15] = this.memoryReader[65295] = function(parentObj, address) {
                    return 224 | parentObj.interruptsRequested;
                };
                break;
            case 65296:
                this.memoryHighReader[16] = this.memoryReader[65296] = function(parentObj, address) {
                    return 128 | parentObj.memory[65296];
                };
                break;
            case 65297:
                this.memoryHighReader[17] = this.memoryReader[65297] = function(parentObj, address) {
                    return 63 | parentObj.memory[65297];
                };
                break;
            case 65298:
                this.memoryHighReader[18] = this.memoryHighReadNormal;
                this.memoryReader[65298] = this.memoryReadNormal;
                break;
            case 65299:
                this.memoryHighReader[19] = this.memoryReader[65299] = this.memoryReadBAD;
                break;
            case 65300:
                this.memoryHighReader[20] = this.memoryReader[65300] = function(parentObj, address) {
                    return 191 | parentObj.memory[65300];
                };
                break;
            case 65301:
                this.memoryHighReader[21] = this.memoryReadBAD;
                this.memoryReader[65301] = this.memoryReadBAD;
                break;
            case 65302:
                this.memoryHighReader[22] = this.memoryReader[65302] = function(parentObj, address) {
                    return 63 | parentObj.memory[65302];
                };
                break;
            case 65303:
                this.memoryHighReader[23] = this.memoryHighReadNormal;
                this.memoryReader[65303] = this.memoryReadNormal;
                break;
            case 65304:
                this.memoryHighReader[24] = this.memoryReader[65304] = this.memoryReadBAD;
                break;
            case 65305:
                this.memoryHighReader[25] = this.memoryReader[65305] = function(parentObj, address) {
                    return 191 | parentObj.memory[65305];
                };
                break;
            case 65306:
                this.memoryHighReader[26] = this.memoryReader[65306] = function(parentObj, address) {
                    return 127 | parentObj.memory[65306];
                };
                break;
            case 65307:
                this.memoryHighReader[27] = this.memoryReader[65307] = this.memoryReadBAD;
                break;
            case 65308:
                this.memoryHighReader[28] = this.memoryReader[65308] = function(parentObj, address) {
                    return 159 | parentObj.memory[65308];
                };
                break;
            case 65309:
                this.memoryHighReader[29] = this.memoryReader[65309] = this.memoryReadBAD;
                break;
            case 65310:
                this.memoryHighReader[30] = this.memoryReader[65310] = function(parentObj, address) {
                    return 191 | parentObj.memory[65310];
                };
                break;
            case 65311:
            case 65312:
                this.memoryHighReader[index & 255] = this.memoryReader[index] = this.memoryReadBAD;
                break;
            case 65313:
            case 65314:
                this.memoryHighReader[index & 255] = this.memoryHighReadNormal;
                this.memoryReader[index] = this.memoryReadNormal;
                break;
            case 65315:
                this.memoryHighReader[35] = this.memoryReader[65315] = function(parentObj, address) {
                    return 191 | parentObj.memory[65315];
                };
                break;
            case 65316:
            case 65317:
                this.memoryHighReader[index & 255] = this.memoryHighReadNormal;
                this.memoryReader[index] = this.memoryReadNormal;
                break;
            case 65318:
                this.memoryHighReader[38] = this.memoryReader[65318] = function(parentObj, address) {
                    parentObj.audioJIT();
                    return 112 | parentObj.memory[65318];
                };
                break;
            case 65319:
            case 65320:
            case 65321:
            case 65322:
            case 65323:
            case 65324:
            case 65325:
            case 65326:
            case 65327:
                this.memoryHighReader[index & 255] = this.memoryReader[index] = this.memoryReadBAD;
                break;
            case 65328:
            case 65329:
            case 65330:
            case 65331:
            case 65332:
            case 65333:
            case 65334:
            case 65335:
            case 65336:
            case 65337:
            case 65338:
            case 65339:
            case 65340:
            case 65341:
            case 65342:
            case 65343:
                this.memoryReader[index] = function(parentObj, address) {
                    return parentObj.channel3canPlay ? parentObj.memory[65280 | parentObj.channel3lastSampleLookup >> 1] : parentObj.memory[address];
                };
                this.memoryHighReader[index & 255] = function(parentObj, address) {
                    return parentObj.channel3canPlay ? parentObj.memory[65280 | parentObj.channel3lastSampleLookup >> 1] : parentObj.memory[65280 | address];
                };
                break;
            case 65344:
                this.memoryHighReader[64] = this.memoryHighReadNormal;
                this.memoryReader[65344] = this.memoryReadNormal;
                break;
            case 65345:
                this.memoryHighReader[65] = this.memoryReader[65345] = function(parentObj, address) {
                    return 128 | parentObj.memory[65345] | parentObj.modeSTAT;
                };
                break;
            case 65346:
                this.memoryHighReader[66] = this.memoryReader[65346] = function(parentObj, address) {
                    return parentObj.backgroundY;
                };
                break;
            case 65347:
                this.memoryHighReader[67] = this.memoryReader[65347] = function(parentObj, address) {
                    return parentObj.backgroundX;
                };
                break;
            case 65348:
                this.memoryHighReader[68] = this.memoryReader[65348] = function(parentObj, address) {
                    return parentObj.LCDisOn ? parentObj.memory[65348] : 0;
                };
                break;
            case 65349:
            case 65350:
            case 65351:
            case 65352:
            case 65353:
                this.memoryHighReader[index & 255] = this.memoryHighReadNormal;
                this.memoryReader[index] = this.memoryReadNormal;
                break;
            case 65354:
                //WY
                this.memoryHighReader[74] = this.memoryReader[65354] = function(parentObj, address) {
                    return parentObj.windowY;
                };
                break;
            case 65355:
                this.memoryHighReader[75] = this.memoryHighReadNormal;
                this.memoryReader[65355] = this.memoryReadNormal;
                break;
            case 65356:
                this.memoryHighReader[76] = this.memoryReader[65356] = this.memoryReadBAD;
                break;
            case 65357:
                this.memoryHighReader[77] = this.memoryHighReadNormal;
                this.memoryReader[65357] = this.memoryReadNormal;
                break;
            case 65358:
                this.memoryHighReader[78] = this.memoryReader[65358] = this.memoryReadBAD;
                break;
            case 65359:
                this.memoryHighReader[79] = this.memoryReader[65359] = function(parentObj, address) {
                    return parentObj.currVRAMBank;
                };
                break;
            case 65360:
            case 65361:
            case 65362:
            case 65363:
            case 65364:
                this.memoryHighReader[index & 255] = this.memoryHighReadNormal;
                this.memoryReader[index] = this.memoryReadNormal;
                break;
            case 65365:
                if (this.cGBC) this.memoryHighReader[85] = this.memoryReader[65365] = function(parentObj, address) {
                    if (!parentObj.LCDisOn && parentObj.hdmaRunning) {
                        //DMA
                        parentObj.DMAWrite((parentObj.memory[65365] & 127) + 1);
                        parentObj.memory[65365] = 255; //Transfer completed.
                        parentObj.hdmaRunning = false;
                    }
                    return parentObj.memory[65365];
                };
                else {
                    this.memoryReader[65365] = this.memoryReadNormal;
                    this.memoryHighReader[85] = this.memoryHighReadNormal;
                }
                break;
            case 65366:
                if (this.cGBC) this.memoryHighReader[86] = this.memoryReader[65366] = function(parentObj, address) {
                    //Return IR "not connected" status:
                    return 60 | (parentObj.memory[65366] >= 192 ? 2 | parentObj.memory[65366] & 193 : parentObj.memory[65366] & 195);
                };
                else {
                    this.memoryReader[65366] = this.memoryReadNormal;
                    this.memoryHighReader[86] = this.memoryHighReadNormal;
                }
                break;
            case 65367:
            case 65368:
            case 65369:
            case 65370:
            case 65371:
            case 65372:
            case 65373:
            case 65374:
            case 65375:
            case 65376:
            case 65377:
            case 65378:
            case 65379:
            case 65380:
            case 65381:
            case 65382:
            case 65383:
                this.memoryHighReader[index & 255] = this.memoryReader[index] = this.memoryReadBAD;
                break;
            case 65384:
            case 65385:
            case 65386:
            case 65387:
                this.memoryHighReader[index & 255] = this.memoryHighReadNormal;
                this.memoryReader[index] = this.memoryReadNormal;
                break;
            case 65388:
                if (this.cGBC) this.memoryHighReader[108] = this.memoryReader[65388] = function(parentObj, address) {
                    return 254 | parentObj.memory[65388];
                };
                else this.memoryHighReader[108] = this.memoryReader[65388] = this.memoryReadBAD;
                break;
            case 65389:
            case 65390:
            case 65391:
                this.memoryHighReader[index & 255] = this.memoryReader[index] = this.memoryReadBAD;
                break;
            case 65392:
                if (this.cGBC) //SVBK
                this.memoryHighReader[112] = this.memoryReader[65392] = function(parentObj, address) {
                    return 64 | parentObj.memory[65392];
                };
                else this.memoryHighReader[112] = this.memoryReader[65392] = this.memoryReadBAD;
                break;
            case 65393:
                this.memoryHighReader[113] = this.memoryReader[65393] = this.memoryReadBAD;
                break;
            case 65394:
            case 65395:
                this.memoryHighReader[index & 255] = this.memoryReader[index] = this.memoryReadNormal;
                break;
            case 65396:
                if (this.cGBC) this.memoryHighReader[116] = this.memoryReader[65396] = this.memoryReadNormal;
                else this.memoryHighReader[116] = this.memoryReader[65396] = this.memoryReadBAD;
                break;
            case 65397:
                this.memoryHighReader[117] = this.memoryReader[65397] = function(parentObj, address) {
                    return 143 | parentObj.memory[65397];
                };
                break;
            case 65398:
            case 65399:
                this.memoryHighReader[index & 255] = this.memoryReader[index] = function(parentObj, address) {
                    return 0;
                };
                break;
            case 65400:
            case 65401:
            case 65402:
            case 65403:
            case 65404:
            case 65405:
            case 65406:
            case 65407:
                this.memoryHighReader[index & 255] = this.memoryReader[index] = this.memoryReadBAD;
                break;
            case 65535:
                //IE
                this.memoryHighReader[255] = this.memoryReader[65535] = function(parentObj, address) {
                    return parentObj.interruptsEnabled;
                };
                break;
            default:
                this.memoryReader[index] = this.memoryReadNormal;
                this.memoryHighReader[index & 255] = this.memoryHighReadNormal;
        }
        else this.memoryReader[index] = this.memoryReadBAD;
    }
};
GameBoyCore.prototype.memoryReadNormal = function(parentObj, address) {
    return parentObj.memory[address];
};
GameBoyCore.prototype.memoryHighReadNormal = function(parentObj, address) {
    return parentObj.memory[65280 | address];
};
GameBoyCore.prototype.memoryReadROM = function(parentObj, address) {
    return parentObj.ROM[parentObj.currentROMBank + address];
};
GameBoyCore.prototype.memoryReadMBC = function(parentObj, address) {
    //Switchable RAM
    if (parentObj.MBCRAMBanksEnabled || settings[10]) return parentObj.MBCRam[address + parentObj.currMBCRAMBankPosition];
    //cout("Reading from disabled RAM.", 1);
    return 255;
};
GameBoyCore.prototype.memoryReadMBC7 = function(parentObj, address) {
    //Switchable RAM
    if (parentObj.MBCRAMBanksEnabled || settings[10]) switch(address){
        case 40960:
        case 41056:
        case 41072:
            return 0;
        case 41088:
            //TODO: Gyro Control Register
            return 0;
        case 41040:
            //Y High Byte
            return parentObj.highY;
        case 41024:
            //Y Low Byte
            return parentObj.lowY;
        case 41008:
            //X High Byte
            return parentObj.highX;
        case 40992:
            //X Low Byte:
            return parentObj.lowX;
        default:
            return parentObj.MBCRam[address + parentObj.currMBCRAMBankPosition];
    }
    //cout("Reading from disabled RAM.", 1);
    return 255;
};
GameBoyCore.prototype.memoryReadMBC3 = function(parentObj, address) {
    //Switchable RAM
    if (parentObj.MBCRAMBanksEnabled || settings[10]) switch(parentObj.currMBCRAMBank){
        case 0:
        case 1:
        case 2:
        case 3:
            return parentObj.MBCRam[address + parentObj.currMBCRAMBankPosition];
        case 8:
            return parentObj.latchedSeconds;
        case 9:
            return parentObj.latchedMinutes;
        case 10:
            return parentObj.latchedHours;
        case 11:
            return parentObj.latchedLDays;
        case 12:
            return (parentObj.RTCDayOverFlow ? 128 : 0) + (parentObj.RTCHALT ? 64 : 0) + parentObj.latchedHDays;
    }
    //cout("Reading from invalid or disabled RAM.", 1);
    return 255;
};
GameBoyCore.prototype.memoryReadGBCMemory = function(parentObj, address) {
    return parentObj.GBCMemory[address + parentObj.gbcRamBankPosition];
};
GameBoyCore.prototype.memoryReadOAM = function(parentObj, address) {
    return parentObj.modeSTAT > 1 ? 255 : parentObj.memory[address];
};
GameBoyCore.prototype.memoryReadECHOGBCMemory = function(parentObj, address) {
    return parentObj.GBCMemory[address + parentObj.gbcRamBankPositionECHO];
};
GameBoyCore.prototype.memoryReadECHONormal = function(parentObj, address) {
    return parentObj.memory[address - 8192];
};
GameBoyCore.prototype.memoryReadBAD = function(parentObj, address) {
    return 255;
};
GameBoyCore.prototype.VRAMDATAReadCGBCPU = function(parentObj, address) {
    //CPU Side Reading The VRAM (Optimized for GameBoy Color)
    return parentObj.modeSTAT > 2 ? 255 : parentObj.currVRAMBank == 0 ? parentObj.memory[address] : parentObj.VRAM[address & 8191];
};
GameBoyCore.prototype.VRAMDATAReadDMGCPU = function(parentObj, address) {
    //CPU Side Reading The VRAM (Optimized for classic GameBoy)
    return parentObj.modeSTAT > 2 ? 255 : parentObj.memory[address];
};
GameBoyCore.prototype.VRAMCHRReadCGBCPU = function(parentObj, address) {
    //CPU Side Reading the Character Data Map:
    return parentObj.modeSTAT > 2 ? 255 : parentObj.BGCHRCurrentBank[address & 2047];
};
GameBoyCore.prototype.VRAMCHRReadDMGCPU = function(parentObj, address) {
    //CPU Side Reading the Character Data Map:
    return parentObj.modeSTAT > 2 ? 255 : parentObj.BGCHRBank1[address & 2047];
};
GameBoyCore.prototype.setCurrentMBC1ROMBank = function() {
    //Read the cartridge ROM data from RAM memory:
    switch(this.ROMBank1offs){
        case 0:
        case 32:
        case 64:
        case 96:
            //Bank calls for 0x00, 0x20, 0x40, and 0x60 are really for 0x01, 0x21, 0x41, and 0x61.
            this.currentROMBank = this.ROMBank1offs % this.ROMBankEdge << 14;
            break;
        default:
            this.currentROMBank = this.ROMBank1offs % this.ROMBankEdge - 1 << 14;
    }
};
GameBoyCore.prototype.setCurrentMBC2AND3ROMBank = function() {
    //Read the cartridge ROM data from RAM memory:
    //Only map bank 0 to bank 1 here (MBC2 is like MBC1, but can only do 16 banks, so only the bank 0 quirk appears for MBC2):
    this.currentROMBank = Math.max(this.ROMBank1offs % this.ROMBankEdge - 1, 0) << 14;
};
GameBoyCore.prototype.setCurrentMBC5ROMBank = function() {
    //Read the cartridge ROM data from RAM memory:
    this.currentROMBank = this.ROMBank1offs % this.ROMBankEdge - 1 << 14;
};
//Memory Writing:
GameBoyCore.prototype.memoryWrite = function(address, data) {
    //Act as a wrapper for writing by compiled jumps to specific memory writing functions.
    this.memoryWriter[address](this, address, data);
};
//0xFFXX fast path:
GameBoyCore.prototype.memoryHighWrite = function(address, data) {
    //Act as a wrapper for writing by compiled jumps to specific memory writing functions.
    this.memoryHighWriter[address](this, address, data);
};
GameBoyCore.prototype.memoryWriteJumpCompile = function() {
    //Faster in some browsers, since we are doing less conditionals overall by implementing them in advance.
    for(var index = 0; index <= 65535; index++){
        if (index < 32768) {
            if (this.cMBC1) {
                if (index < 8192) this.memoryWriter[index] = this.MBCWriteEnable;
                else if (index < 16384) this.memoryWriter[index] = this.MBC1WriteROMBank;
                else if (index < 24576) this.memoryWriter[index] = this.MBC1WriteRAMBank;
                else this.memoryWriter[index] = this.MBC1WriteType;
            } else if (this.cMBC2) {
                if (index < 4096) this.memoryWriter[index] = this.MBCWriteEnable;
                else if (index >= 8448 && index < 8704) this.memoryWriter[index] = this.MBC2WriteROMBank;
                else this.memoryWriter[index] = this.cartIgnoreWrite;
            } else if (this.cMBC3) {
                if (index < 8192) this.memoryWriter[index] = this.MBCWriteEnable;
                else if (index < 16384) this.memoryWriter[index] = this.MBC3WriteROMBank;
                else if (index < 24576) this.memoryWriter[index] = this.MBC3WriteRAMBank;
                else this.memoryWriter[index] = this.MBC3WriteRTCLatch;
            } else if (this.cMBC5 || this.cRUMBLE || this.cMBC7) {
                if (index < 8192) this.memoryWriter[index] = this.MBCWriteEnable;
                else if (index < 12288) this.memoryWriter[index] = this.MBC5WriteROMBankLow;
                else if (index < 16384) this.memoryWriter[index] = this.MBC5WriteROMBankHigh;
                else if (index < 24576) this.memoryWriter[index] = this.cRUMBLE ? this.RUMBLEWriteRAMBank : this.MBC5WriteRAMBank;
                else this.memoryWriter[index] = this.cartIgnoreWrite;
            } else if (this.cHuC3) {
                if (index < 8192) this.memoryWriter[index] = this.MBCWriteEnable;
                else if (index < 16384) this.memoryWriter[index] = this.MBC3WriteROMBank;
                else if (index < 24576) this.memoryWriter[index] = this.HuC3WriteRAMBank;
                else this.memoryWriter[index] = this.cartIgnoreWrite;
            } else this.memoryWriter[index] = this.cartIgnoreWrite;
        } else if (index < 36864) this.memoryWriter[index] = this.cGBC ? this.VRAMGBCDATAWrite : this.VRAMGBDATAWrite;
        else if (index < 38912) this.memoryWriter[index] = this.cGBC ? this.VRAMGBCDATAWrite : this.VRAMGBDATAUpperWrite;
        else if (index < 40960) this.memoryWriter[index] = this.cGBC ? this.VRAMGBCCHRMAPWrite : this.VRAMGBCHRMAPWrite;
        else if (index < 49152) {
            if (this.numRAMBanks == 0.0625 && index < 41472 || this.numRAMBanks >= 1) {
                if (!this.cMBC3) this.memoryWriter[index] = this.memoryWriteMBCRAM;
                else //MBC3 RTC + RAM:
                this.memoryWriter[index] = this.memoryWriteMBC3RAM;
            } else this.memoryWriter[index] = this.cartIgnoreWrite;
        } else if (index < 57344) {
            if (this.cGBC && index >= 53248) this.memoryWriter[index] = this.memoryWriteGBCRAM;
            else this.memoryWriter[index] = this.memoryWriteNormal;
        } else if (index < 65024) {
            if (this.cGBC && index >= 61440) this.memoryWriter[index] = this.memoryWriteECHOGBCRAM;
            else this.memoryWriter[index] = this.memoryWriteECHONormal;
        } else if (index <= 65184) this.memoryWriter[index] = this.memoryWriteOAMRAM;
        else if (index < 65280) {
            if (this.cGBC) this.memoryWriter[index] = this.memoryWriteNormal;
            else this.memoryWriter[index] = this.cartIgnoreWrite;
        } else {
            //Start the I/O initialization by filling in the slots as normal memory:
            this.memoryWriter[index] = this.memoryWriteNormal;
            this.memoryHighWriter[index & 255] = this.memoryHighWriteNormal;
        }
    }
    this.registerWriteJumpCompile(); //Compile the I/O write functions separately...
};
GameBoyCore.prototype.MBCWriteEnable = function(parentObj, address, data) {
    //MBC RAM Bank Enable/Disable:
    parentObj.MBCRAMBanksEnabled = (data & 15) == 10; //If lower nibble is 0x0A, then enable, otherwise disable.
};
GameBoyCore.prototype.MBC1WriteROMBank = function(parentObj, address, data) {
    //MBC1 ROM bank switching:
    parentObj.ROMBank1offs = parentObj.ROMBank1offs & 96 | data & 31;
    parentObj.setCurrentMBC1ROMBank();
};
GameBoyCore.prototype.MBC1WriteRAMBank = function(parentObj, address, data) {
    //MBC1 RAM bank switching
    if (parentObj.MBC1Mode) {
        //4/32 Mode
        parentObj.currMBCRAMBank = data & 3;
        parentObj.currMBCRAMBankPosition = (parentObj.currMBCRAMBank << 13) - 40960;
    } else {
        //16/8 Mode
        parentObj.ROMBank1offs = (data & 3) << 5 | parentObj.ROMBank1offs & 31;
        parentObj.setCurrentMBC1ROMBank();
    }
};
GameBoyCore.prototype.MBC1WriteType = function(parentObj, address, data) {
    //MBC1 mode setting:
    parentObj.MBC1Mode = (data & 1) == 1;
    if (parentObj.MBC1Mode) {
        parentObj.ROMBank1offs &= 31;
        parentObj.setCurrentMBC1ROMBank();
    } else {
        parentObj.currMBCRAMBank = 0;
        parentObj.currMBCRAMBankPosition = -40960;
    }
};
GameBoyCore.prototype.MBC2WriteROMBank = function(parentObj, address, data) {
    //MBC2 ROM bank switching:
    parentObj.ROMBank1offs = data & 15;
    parentObj.setCurrentMBC2AND3ROMBank();
};
GameBoyCore.prototype.MBC3WriteROMBank = function(parentObj, address, data) {
    //MBC3 ROM bank switching:
    parentObj.ROMBank1offs = data & 127;
    parentObj.setCurrentMBC2AND3ROMBank();
};
GameBoyCore.prototype.MBC3WriteRAMBank = function(parentObj, address, data) {
    parentObj.currMBCRAMBank = data;
    if (data < 4) //MBC3 RAM bank switching
    parentObj.currMBCRAMBankPosition = (parentObj.currMBCRAMBank << 13) - 40960;
};
GameBoyCore.prototype.MBC3WriteRTCLatch = function(parentObj, address, data) {
    if (data == 0) parentObj.RTCisLatched = false;
    else if (!parentObj.RTCisLatched) {
        //Copy over the current RTC time for reading.
        parentObj.RTCisLatched = true;
        parentObj.latchedSeconds = parentObj.RTCSeconds | 0;
        parentObj.latchedMinutes = parentObj.RTCMinutes;
        parentObj.latchedHours = parentObj.RTCHours;
        parentObj.latchedLDays = parentObj.RTCDays & 255;
        parentObj.latchedHDays = parentObj.RTCDays >> 8;
    }
};
GameBoyCore.prototype.MBC5WriteROMBankLow = function(parentObj, address, data) {
    //MBC5 ROM bank switching:
    parentObj.ROMBank1offs = parentObj.ROMBank1offs & 256 | data;
    parentObj.setCurrentMBC5ROMBank();
};
GameBoyCore.prototype.MBC5WriteROMBankHigh = function(parentObj, address, data) {
    //MBC5 ROM bank switching (by least significant bit):
    parentObj.ROMBank1offs = (data & 1) << 8 | parentObj.ROMBank1offs & 255;
    parentObj.setCurrentMBC5ROMBank();
};
GameBoyCore.prototype.MBC5WriteRAMBank = function(parentObj, address, data) {
    //MBC5 RAM bank switching
    parentObj.currMBCRAMBank = data & 15;
    parentObj.currMBCRAMBankPosition = (parentObj.currMBCRAMBank << 13) - 40960;
};
GameBoyCore.prototype.RUMBLEWriteRAMBank = function(parentObj, address, data) {
    //MBC5 RAM bank switching
    //Like MBC5, but bit 3 of the lower nibble is used for rumbling and bit 2 is ignored.
    parentObj.currMBCRAMBank = data & 3;
    parentObj.currMBCRAMBankPosition = (parentObj.currMBCRAMBank << 13) - 40960;
};
GameBoyCore.prototype.HuC3WriteRAMBank = function(parentObj, address, data) {
    //HuC3 RAM bank switching
    parentObj.currMBCRAMBank = data & 3;
    parentObj.currMBCRAMBankPosition = (parentObj.currMBCRAMBank << 13) - 40960;
};
GameBoyCore.prototype.cartIgnoreWrite = function(parentObj, address, data) {
//We might have encountered illegal RAM writing or such, so just do nothing...
};
GameBoyCore.prototype.memoryWriteNormal = function(parentObj, address, data) {
    parentObj.memory[address] = data;
};
GameBoyCore.prototype.memoryHighWriteNormal = function(parentObj, address, data) {
    parentObj.memory[65280 | address] = data;
};
GameBoyCore.prototype.memoryWriteMBCRAM = function(parentObj, address, data) {
    if (parentObj.MBCRAMBanksEnabled || settings[10]) parentObj.MBCRam[address + parentObj.currMBCRAMBankPosition] = data;
};
GameBoyCore.prototype.memoryWriteMBC3RAM = function(parentObj, address, data) {
    if (parentObj.MBCRAMBanksEnabled || settings[10]) switch(parentObj.currMBCRAMBank){
        case 0:
        case 1:
        case 2:
        case 3:
            parentObj.MBCRam[address + parentObj.currMBCRAMBankPosition] = data;
            break;
        case 8:
            if (data < 60) parentObj.RTCSeconds = data;
            else cout("(Bank #" + parentObj.currMBCRAMBank + ") RTC write out of range: " + data, 1);
            break;
        case 9:
            if (data < 60) parentObj.RTCMinutes = data;
            else cout("(Bank #" + parentObj.currMBCRAMBank + ") RTC write out of range: " + data, 1);
            break;
        case 10:
            if (data < 24) parentObj.RTCHours = data;
            else cout("(Bank #" + parentObj.currMBCRAMBank + ") RTC write out of range: " + data, 1);
            break;
        case 11:
            parentObj.RTCDays = data & 255 | parentObj.RTCDays & 256;
            break;
        case 12:
            parentObj.RTCDayOverFlow = data > 127;
            parentObj.RTCHalt = (data & 64) == 64;
            parentObj.RTCDays = (data & 1) << 8 | parentObj.RTCDays & 255;
            break;
        default:
            cout("Invalid MBC3 bank address selected: " + parentObj.currMBCRAMBank, 0);
    }
};
GameBoyCore.prototype.memoryWriteGBCRAM = function(parentObj, address, data) {
    parentObj.GBCMemory[address + parentObj.gbcRamBankPosition] = data;
};
GameBoyCore.prototype.memoryWriteOAMRAM = function(parentObj, address, data) {
    if (parentObj.modeSTAT < 2) {
        if (parentObj.memory[address] != data) {
            parentObj.graphicsJIT();
            parentObj.memory[address] = data;
        }
    }
};
GameBoyCore.prototype.memoryWriteECHOGBCRAM = function(parentObj, address, data) {
    parentObj.GBCMemory[address + parentObj.gbcRamBankPositionECHO] = data;
};
GameBoyCore.prototype.memoryWriteECHONormal = function(parentObj, address, data) {
    parentObj.memory[address - 8192] = data;
};
GameBoyCore.prototype.VRAMGBDATAWrite = function(parentObj, address, data) {
    if (parentObj.modeSTAT < 3) {
        if (parentObj.memory[address] != data) {
            //JIT the graphics render queue:
            parentObj.graphicsJIT();
            parentObj.memory[address] = data;
            parentObj.generateGBOAMTileLine(address);
        }
    }
};
GameBoyCore.prototype.VRAMGBDATAUpperWrite = function(parentObj, address, data) {
    if (parentObj.modeSTAT < 3) {
        if (parentObj.memory[address] != data) {
            //JIT the graphics render queue:
            parentObj.graphicsJIT();
            parentObj.memory[address] = data;
            parentObj.generateGBTileLine(address);
        }
    }
};
GameBoyCore.prototype.VRAMGBCDATAWrite = function(parentObj, address, data) {
    if (parentObj.modeSTAT < 3) {
        if (parentObj.currVRAMBank == 0) {
            if (parentObj.memory[address] != data) {
                //JIT the graphics render queue:
                parentObj.graphicsJIT();
                parentObj.memory[address] = data;
                parentObj.generateGBCTileLineBank1(address);
            }
        } else {
            address &= 8191;
            if (parentObj.VRAM[address] != data) {
                //JIT the graphics render queue:
                parentObj.graphicsJIT();
                parentObj.VRAM[address] = data;
                parentObj.generateGBCTileLineBank2(address);
            }
        }
    }
};
GameBoyCore.prototype.VRAMGBCHRMAPWrite = function(parentObj, address, data) {
    if (parentObj.modeSTAT < 3) {
        address &= 2047;
        if (parentObj.BGCHRBank1[address] != data) {
            //JIT the graphics render queue:
            parentObj.graphicsJIT();
            parentObj.BGCHRBank1[address] = data;
        }
    }
};
GameBoyCore.prototype.VRAMGBCCHRMAPWrite = function(parentObj, address, data) {
    if (parentObj.modeSTAT < 3) {
        address &= 2047;
        if (parentObj.BGCHRCurrentBank[address] != data) {
            //JIT the graphics render queue:
            parentObj.graphicsJIT();
            parentObj.BGCHRCurrentBank[address] = data;
        }
    }
};
GameBoyCore.prototype.DMAWrite = function(tilesToTransfer) {
    if (!this.halt) //Clock the CPU for the DMA transfer (CPU is halted during the transfer):
    this.CPUTicks += 4 | tilesToTransfer << 5 << this.doubleSpeedShifter;
    //Source address of the transfer:
    var source = this.memory[65361] << 8 | this.memory[65362];
    //Destination address in the VRAM memory range:
    var destination = this.memory[65363] << 8 | this.memory[65364];
    //Creating some references:
    var memoryReader = this.memoryReader;
    //JIT the graphics render queue:
    this.graphicsJIT();
    var memory = this.memory;
    //Determining which bank we're working on so we can optimize:
    if (this.currVRAMBank == 0) //DMA transfer for VRAM bank 0:
    do {
        if (destination < 6144) {
            memory[32768 | destination] = memoryReader[source](this, source++);
            memory[32769 | destination] = memoryReader[source](this, source++);
            memory[32770 | destination] = memoryReader[source](this, source++);
            memory[32771 | destination] = memoryReader[source](this, source++);
            memory[32772 | destination] = memoryReader[source](this, source++);
            memory[32773 | destination] = memoryReader[source](this, source++);
            memory[32774 | destination] = memoryReader[source](this, source++);
            memory[32775 | destination] = memoryReader[source](this, source++);
            memory[32776 | destination] = memoryReader[source](this, source++);
            memory[32777 | destination] = memoryReader[source](this, source++);
            memory[32778 | destination] = memoryReader[source](this, source++);
            memory[32779 | destination] = memoryReader[source](this, source++);
            memory[32780 | destination] = memoryReader[source](this, source++);
            memory[32781 | destination] = memoryReader[source](this, source++);
            memory[32782 | destination] = memoryReader[source](this, source++);
            memory[32783 | destination] = memoryReader[source](this, source++);
            this.generateGBCTileBank1(destination);
            destination += 16;
        } else {
            destination &= 2032;
            this.BGCHRBank1[destination++] = memoryReader[source](this, source++);
            this.BGCHRBank1[destination++] = memoryReader[source](this, source++);
            this.BGCHRBank1[destination++] = memoryReader[source](this, source++);
            this.BGCHRBank1[destination++] = memoryReader[source](this, source++);
            this.BGCHRBank1[destination++] = memoryReader[source](this, source++);
            this.BGCHRBank1[destination++] = memoryReader[source](this, source++);
            this.BGCHRBank1[destination++] = memoryReader[source](this, source++);
            this.BGCHRBank1[destination++] = memoryReader[source](this, source++);
            this.BGCHRBank1[destination++] = memoryReader[source](this, source++);
            this.BGCHRBank1[destination++] = memoryReader[source](this, source++);
            this.BGCHRBank1[destination++] = memoryReader[source](this, source++);
            this.BGCHRBank1[destination++] = memoryReader[source](this, source++);
            this.BGCHRBank1[destination++] = memoryReader[source](this, source++);
            this.BGCHRBank1[destination++] = memoryReader[source](this, source++);
            this.BGCHRBank1[destination++] = memoryReader[source](this, source++);
            this.BGCHRBank1[destination++] = memoryReader[source](this, source++);
            destination = destination + 6144 & 8176;
        }
        source &= 65520;
        --tilesToTransfer;
    }while (tilesToTransfer > 0)
    else {
        var VRAM = this.VRAM;
        //DMA transfer for VRAM bank 1:
        do {
            if (destination < 6144) {
                VRAM[destination] = memoryReader[source](this, source++);
                VRAM[destination | 1] = memoryReader[source](this, source++);
                VRAM[destination | 2] = memoryReader[source](this, source++);
                VRAM[destination | 3] = memoryReader[source](this, source++);
                VRAM[destination | 4] = memoryReader[source](this, source++);
                VRAM[destination | 5] = memoryReader[source](this, source++);
                VRAM[destination | 6] = memoryReader[source](this, source++);
                VRAM[destination | 7] = memoryReader[source](this, source++);
                VRAM[destination | 8] = memoryReader[source](this, source++);
                VRAM[destination | 9] = memoryReader[source](this, source++);
                VRAM[destination | 10] = memoryReader[source](this, source++);
                VRAM[destination | 11] = memoryReader[source](this, source++);
                VRAM[destination | 12] = memoryReader[source](this, source++);
                VRAM[destination | 13] = memoryReader[source](this, source++);
                VRAM[destination | 14] = memoryReader[source](this, source++);
                VRAM[destination | 15] = memoryReader[source](this, source++);
                this.generateGBCTileBank2(destination);
                destination += 16;
            } else {
                destination &= 2032;
                this.BGCHRBank2[destination++] = memoryReader[source](this, source++);
                this.BGCHRBank2[destination++] = memoryReader[source](this, source++);
                this.BGCHRBank2[destination++] = memoryReader[source](this, source++);
                this.BGCHRBank2[destination++] = memoryReader[source](this, source++);
                this.BGCHRBank2[destination++] = memoryReader[source](this, source++);
                this.BGCHRBank2[destination++] = memoryReader[source](this, source++);
                this.BGCHRBank2[destination++] = memoryReader[source](this, source++);
                this.BGCHRBank2[destination++] = memoryReader[source](this, source++);
                this.BGCHRBank2[destination++] = memoryReader[source](this, source++);
                this.BGCHRBank2[destination++] = memoryReader[source](this, source++);
                this.BGCHRBank2[destination++] = memoryReader[source](this, source++);
                this.BGCHRBank2[destination++] = memoryReader[source](this, source++);
                this.BGCHRBank2[destination++] = memoryReader[source](this, source++);
                this.BGCHRBank2[destination++] = memoryReader[source](this, source++);
                this.BGCHRBank2[destination++] = memoryReader[source](this, source++);
                this.BGCHRBank2[destination++] = memoryReader[source](this, source++);
                destination = destination + 6144 & 8176;
            }
            source &= 65520;
            --tilesToTransfer;
        }while (tilesToTransfer > 0)
    }
    //Update the HDMA registers to their next addresses:
    memory[65361] = source >> 8;
    memory[65362] = source & 240;
    memory[65363] = destination >> 8;
    memory[65364] = destination & 240;
};
GameBoyCore.prototype.registerWriteJumpCompile = function() {
    //I/O Registers (GB + GBC):
    //JoyPad
    this.memoryHighWriter[0] = this.memoryWriter[65280] = function(parentObj, address, data) {
        parentObj.memory[65280] = data & 48 | ((data & 32) == 0 ? parentObj.JoyPad >> 4 : 15) & ((data & 16) == 0 ? parentObj.JoyPad & 15 : 15);
    };
    //SB (Serial Transfer Data)
    this.memoryHighWriter[1] = this.memoryWriter[65281] = function(parentObj, address, data) {
        if (parentObj.memory[65282] < 128) parentObj.memory[65281] = data;
    };
    //SC (Serial Transfer Control):
    this.memoryHighWriter[2] = this.memoryHighWriteNormal;
    this.memoryWriter[65282] = this.memoryWriteNormal;
    //Unmapped I/O:
    this.memoryHighWriter[3] = this.memoryWriter[65283] = this.cartIgnoreWrite;
    //DIV
    this.memoryHighWriter[4] = this.memoryWriter[65284] = function(parentObj, address, data) {
        parentObj.DIVTicks &= 255; //Update DIV for realignment.
        parentObj.memory[65284] = 0;
    };
    //TIMA
    this.memoryHighWriter[5] = this.memoryWriter[65285] = function(parentObj, address, data) {
        parentObj.memory[65285] = data;
    };
    //TMA
    this.memoryHighWriter[6] = this.memoryWriter[65286] = function(parentObj, address, data) {
        parentObj.memory[65286] = data;
    };
    //TAC
    this.memoryHighWriter[7] = this.memoryWriter[65287] = function(parentObj, address, data) {
        parentObj.memory[65287] = data & 7;
        parentObj.TIMAEnabled = (data & 4) == 4;
        parentObj.TACClocker = Math.pow(4, (data & 3) != 0 ? data & 3 : 4) << 2; //TODO: Find a way to not make a conditional in here...
    };
    //Unmapped I/O:
    this.memoryHighWriter[8] = this.memoryWriter[65288] = this.cartIgnoreWrite;
    this.memoryHighWriter[9] = this.memoryWriter[65289] = this.cartIgnoreWrite;
    this.memoryHighWriter[10] = this.memoryWriter[65290] = this.cartIgnoreWrite;
    this.memoryHighWriter[11] = this.memoryWriter[65291] = this.cartIgnoreWrite;
    this.memoryHighWriter[12] = this.memoryWriter[65292] = this.cartIgnoreWrite;
    this.memoryHighWriter[13] = this.memoryWriter[65293] = this.cartIgnoreWrite;
    this.memoryHighWriter[14] = this.memoryWriter[65294] = this.cartIgnoreWrite;
    //IF (Interrupt Request)
    this.memoryHighWriter[15] = this.memoryWriter[65295] = function(parentObj, address, data) {
        parentObj.interruptsRequested = data;
        parentObj.checkIRQMatching();
    };
    //NR10:
    this.memoryHighWriter[16] = this.memoryWriter[65296] = function(parentObj, address, data) {
        if (parentObj.soundMasterEnabled) {
            parentObj.audioJIT();
            if (parentObj.channel1decreaseSweep && (data & 8) == 0) {
                if (parentObj.channel1Swept) parentObj.channel1SweepFault = true;
            }
            parentObj.channel1lastTimeSweep = (data & 112) >> 4;
            parentObj.channel1frequencySweepDivider = data & 7;
            parentObj.channel1decreaseSweep = (data & 8) == 8;
            parentObj.memory[65296] = data;
            parentObj.channel1EnableCheck();
        }
    };
    //NR11:
    this.memoryHighWriter[17] = this.memoryWriter[65297] = function(parentObj, address, data) {
        if (parentObj.soundMasterEnabled || !parentObj.cGBC) {
            if (parentObj.soundMasterEnabled) parentObj.audioJIT();
            else data &= 63;
            parentObj.channel1CachedDuty = parentObj.dutyLookup[data >> 6];
            parentObj.channel1totalLength = 64 - (data & 63);
            parentObj.memory[65297] = data;
            parentObj.channel1EnableCheck();
        }
    };
    //NR12:
    this.memoryHighWriter[18] = this.memoryWriter[65298] = function(parentObj, address, data) {
        if (parentObj.soundMasterEnabled) {
            parentObj.audioJIT();
            if (parentObj.channel1Enabled && parentObj.channel1envelopeSweeps == 0) {
                //Zombie Volume PAPU Bug:
                if (((parentObj.memory[65298] ^ data) & 8) == 8) {
                    if ((parentObj.memory[65298] & 8) == 0) {
                        if ((parentObj.memory[65298] & 7) == 7) parentObj.channel1envelopeVolume += 2;
                        else ++parentObj.channel1envelopeVolume;
                    }
                    parentObj.channel1envelopeVolume = 16 - parentObj.channel1envelopeVolume & 15;
                } else if ((parentObj.memory[65298] & 15) == 8) parentObj.channel1envelopeVolume = 1 + parentObj.channel1envelopeVolume & 15;
                parentObj.channel1OutputLevelCache();
            }
            parentObj.channel1envelopeType = (data & 8) == 8;
            parentObj.memory[65298] = data;
            parentObj.channel1VolumeEnableCheck();
        }
    };
    //NR13:
    this.memoryHighWriter[19] = this.memoryWriter[65299] = function(parentObj, address, data) {
        if (parentObj.soundMasterEnabled) {
            parentObj.audioJIT();
            parentObj.channel1frequency = parentObj.channel1frequency & 1792 | data;
            parentObj.channel1FrequencyTracker = 2048 - parentObj.channel1frequency << 2;
        }
    };
    //NR14:
    this.memoryHighWriter[20] = this.memoryWriter[65300] = function(parentObj, address, data) {
        if (parentObj.soundMasterEnabled) {
            parentObj.audioJIT();
            parentObj.channel1consecutive = (data & 64) == 0;
            parentObj.channel1frequency = (data & 7) << 8 | parentObj.channel1frequency & 255;
            parentObj.channel1FrequencyTracker = 2048 - parentObj.channel1frequency << 2;
            if (data > 127) {
                //Reload 0xFF10:
                parentObj.channel1timeSweep = parentObj.channel1lastTimeSweep;
                parentObj.channel1Swept = false;
                //Reload 0xFF12:
                var nr12 = parentObj.memory[65298];
                parentObj.channel1envelopeVolume = nr12 >> 4;
                parentObj.channel1OutputLevelCache();
                parentObj.channel1envelopeSweepsLast = (nr12 & 7) - 1;
                if (parentObj.channel1totalLength == 0) parentObj.channel1totalLength = 64;
                if (parentObj.channel1lastTimeSweep > 0 || parentObj.channel1frequencySweepDivider > 0) parentObj.memory[65318] |= 1;
                else parentObj.memory[65318] &= 254;
                if ((data & 64) == 64) parentObj.memory[65318] |= 1;
                parentObj.channel1ShadowFrequency = parentObj.channel1frequency;
                //Reset frequency overflow check + frequency sweep type check:
                parentObj.channel1SweepFault = false;
                //Supposed to run immediately:
                parentObj.channel1AudioSweepPerformDummy();
            }
            parentObj.channel1EnableCheck();
            parentObj.memory[65300] = data;
        }
    };
    //NR20 (Unused I/O):
    this.memoryHighWriter[21] = this.memoryWriter[65301] = this.cartIgnoreWrite;
    //NR21:
    this.memoryHighWriter[22] = this.memoryWriter[65302] = function(parentObj, address, data) {
        if (parentObj.soundMasterEnabled || !parentObj.cGBC) {
            if (parentObj.soundMasterEnabled) parentObj.audioJIT();
            else data &= 63;
            parentObj.channel2CachedDuty = parentObj.dutyLookup[data >> 6];
            parentObj.channel2totalLength = 64 - (data & 63);
            parentObj.memory[65302] = data;
            parentObj.channel2EnableCheck();
        }
    };
    //NR22:
    this.memoryHighWriter[23] = this.memoryWriter[65303] = function(parentObj, address, data) {
        if (parentObj.soundMasterEnabled) {
            parentObj.audioJIT();
            if (parentObj.channel2Enabled && parentObj.channel2envelopeSweeps == 0) {
                //Zombie Volume PAPU Bug:
                if (((parentObj.memory[65303] ^ data) & 8) == 8) {
                    if ((parentObj.memory[65303] & 8) == 0) {
                        if ((parentObj.memory[65303] & 7) == 7) parentObj.channel2envelopeVolume += 2;
                        else ++parentObj.channel2envelopeVolume;
                    }
                    parentObj.channel2envelopeVolume = 16 - parentObj.channel2envelopeVolume & 15;
                } else if ((parentObj.memory[65303] & 15) == 8) parentObj.channel2envelopeVolume = 1 + parentObj.channel2envelopeVolume & 15;
                parentObj.channel2OutputLevelCache();
            }
            parentObj.channel2envelopeType = (data & 8) == 8;
            parentObj.memory[65303] = data;
            parentObj.channel2VolumeEnableCheck();
        }
    };
    //NR23:
    this.memoryHighWriter[24] = this.memoryWriter[65304] = function(parentObj, address, data) {
        if (parentObj.soundMasterEnabled) {
            parentObj.audioJIT();
            parentObj.channel2frequency = parentObj.channel2frequency & 1792 | data;
            parentObj.channel2FrequencyTracker = 2048 - parentObj.channel2frequency << 2;
        }
    };
    //NR24:
    this.memoryHighWriter[25] = this.memoryWriter[65305] = function(parentObj, address, data) {
        if (parentObj.soundMasterEnabled) {
            parentObj.audioJIT();
            if (data > 127) {
                //Reload 0xFF17:
                var nr22 = parentObj.memory[65303];
                parentObj.channel2envelopeVolume = nr22 >> 4;
                parentObj.channel2OutputLevelCache();
                parentObj.channel2envelopeSweepsLast = (nr22 & 7) - 1;
                if (parentObj.channel2totalLength == 0) parentObj.channel2totalLength = 64;
                if ((data & 64) == 64) parentObj.memory[65318] |= 2;
            }
            parentObj.channel2consecutive = (data & 64) == 0;
            parentObj.channel2frequency = (data & 7) << 8 | parentObj.channel2frequency & 255;
            parentObj.channel2FrequencyTracker = 2048 - parentObj.channel2frequency << 2;
            parentObj.memory[65305] = data;
            parentObj.channel2EnableCheck();
        }
    };
    //NR30:
    this.memoryHighWriter[26] = this.memoryWriter[65306] = function(parentObj, address, data) {
        if (parentObj.soundMasterEnabled) {
            parentObj.audioJIT();
            if (!parentObj.channel3canPlay && data >= 128) {
                parentObj.channel3lastSampleLookup = 0;
                parentObj.channel3UpdateCache();
            }
            parentObj.channel3canPlay = data > 127;
            if (parentObj.channel3canPlay && parentObj.memory[65306] > 127 && !parentObj.channel3consecutive) parentObj.memory[65318] |= 4;
            parentObj.memory[65306] = data;
        //parentObj.channel3EnableCheck();
        }
    };
    //NR31:
    this.memoryHighWriter[27] = this.memoryWriter[65307] = function(parentObj, address, data) {
        if (parentObj.soundMasterEnabled || !parentObj.cGBC) {
            if (parentObj.soundMasterEnabled) parentObj.audioJIT();
            parentObj.channel3totalLength = 256 - data;
            parentObj.channel3EnableCheck();
        }
    };
    //NR32:
    this.memoryHighWriter[28] = this.memoryWriter[65308] = function(parentObj, address, data) {
        if (parentObj.soundMasterEnabled) {
            parentObj.audioJIT();
            data &= 96;
            parentObj.memory[65308] = data;
            parentObj.channel3patternType = data == 0 ? 4 : (data >> 5) - 1;
        }
    };
    //NR33:
    this.memoryHighWriter[29] = this.memoryWriter[65309] = function(parentObj, address, data) {
        if (parentObj.soundMasterEnabled) {
            parentObj.audioJIT();
            parentObj.channel3frequency = parentObj.channel3frequency & 1792 | data;
            parentObj.channel3FrequencyPeriod = 2048 - parentObj.channel3frequency << 1;
        }
    };
    //NR34:
    this.memoryHighWriter[30] = this.memoryWriter[65310] = function(parentObj, address, data) {
        if (parentObj.soundMasterEnabled) {
            parentObj.audioJIT();
            if (data > 127) {
                if (parentObj.channel3totalLength == 0) parentObj.channel3totalLength = 256;
                parentObj.channel3lastSampleLookup = 0;
                if ((data & 64) == 64) parentObj.memory[65318] |= 4;
            }
            parentObj.channel3consecutive = (data & 64) == 0;
            parentObj.channel3frequency = (data & 7) << 8 | parentObj.channel3frequency & 255;
            parentObj.channel3FrequencyPeriod = 2048 - parentObj.channel3frequency << 1;
            parentObj.memory[65310] = data;
            parentObj.channel3EnableCheck();
        }
    };
    //NR40 (Unused I/O):
    this.memoryHighWriter[31] = this.memoryWriter[65311] = this.cartIgnoreWrite;
    //NR41:
    this.memoryHighWriter[32] = this.memoryWriter[65312] = function(parentObj, address, data) {
        if (parentObj.soundMasterEnabled || !parentObj.cGBC) {
            if (parentObj.soundMasterEnabled) parentObj.audioJIT();
            parentObj.channel4totalLength = 64 - (data & 63);
            parentObj.channel4EnableCheck();
        }
    };
    //NR42:
    this.memoryHighWriter[33] = this.memoryWriter[65313] = function(parentObj, address, data) {
        if (parentObj.soundMasterEnabled) {
            parentObj.audioJIT();
            if (parentObj.channel4Enabled && parentObj.channel4envelopeSweeps == 0) {
                //Zombie Volume PAPU Bug:
                if (((parentObj.memory[65313] ^ data) & 8) == 8) {
                    if ((parentObj.memory[65313] & 8) == 0) {
                        if ((parentObj.memory[65313] & 7) == 7) parentObj.channel4envelopeVolume += 2;
                        else ++parentObj.channel4envelopeVolume;
                    }
                    parentObj.channel4envelopeVolume = 16 - parentObj.channel4envelopeVolume & 15;
                } else if ((parentObj.memory[65313] & 15) == 8) parentObj.channel4envelopeVolume = 1 + parentObj.channel4envelopeVolume & 15;
                parentObj.channel4currentVolume = parentObj.channel4envelopeVolume << parentObj.channel4VolumeShifter;
            }
            parentObj.channel4envelopeType = (data & 8) == 8;
            parentObj.memory[65313] = data;
            parentObj.channel4UpdateCache();
            parentObj.channel4VolumeEnableCheck();
        }
    };
    //NR43:
    this.memoryHighWriter[34] = this.memoryWriter[65314] = function(parentObj, address, data) {
        if (parentObj.soundMasterEnabled) {
            parentObj.audioJIT();
            parentObj.channel4FrequencyPeriod = Math.max((data & 7) << 4, 8) << (data >> 4);
            var bitWidth = data & 8;
            if (bitWidth == 8 && parentObj.channel4BitRange == 32767 || bitWidth == 0 && parentObj.channel4BitRange == 127) {
                parentObj.channel4lastSampleLookup = 0;
                parentObj.channel4BitRange = bitWidth == 8 ? 127 : 32767;
                parentObj.channel4VolumeShifter = bitWidth == 8 ? 7 : 15;
                parentObj.channel4currentVolume = parentObj.channel4envelopeVolume << parentObj.channel4VolumeShifter;
                parentObj.noiseSampleTable = bitWidth == 8 ? parentObj.LSFR7Table : parentObj.LSFR15Table;
            }
            parentObj.memory[65314] = data;
            parentObj.channel4UpdateCache();
        }
    };
    //NR44:
    this.memoryHighWriter[35] = this.memoryWriter[65315] = function(parentObj, address, data) {
        if (parentObj.soundMasterEnabled) {
            parentObj.audioJIT();
            parentObj.memory[65315] = data;
            parentObj.channel4consecutive = (data & 64) == 0;
            if (data > 127) {
                var nr42 = parentObj.memory[65313];
                parentObj.channel4envelopeVolume = nr42 >> 4;
                parentObj.channel4currentVolume = parentObj.channel4envelopeVolume << parentObj.channel4VolumeShifter;
                parentObj.channel4envelopeSweepsLast = (nr42 & 7) - 1;
                if (parentObj.channel4totalLength == 0) parentObj.channel4totalLength = 64;
                if ((data & 64) == 64) parentObj.memory[65318] |= 8;
            }
            parentObj.channel4EnableCheck();
        }
    };
    //NR50:
    this.memoryHighWriter[36] = this.memoryWriter[65316] = function(parentObj, address, data) {
        if (parentObj.soundMasterEnabled && parentObj.memory[65316] != data) {
            parentObj.audioJIT();
            parentObj.memory[65316] = data;
            parentObj.VinLeftChannelMasterVolume = (data >> 4 & 7) + 1;
            parentObj.VinRightChannelMasterVolume = (data & 7) + 1;
            parentObj.mixerOutputLevelCache();
        }
    };
    //NR51:
    this.memoryHighWriter[37] = this.memoryWriter[65317] = function(parentObj, address, data) {
        if (parentObj.soundMasterEnabled && parentObj.memory[65317] != data) {
            parentObj.audioJIT();
            parentObj.memory[65317] = data;
            parentObj.rightChannel1 = (data & 1) == 1;
            parentObj.rightChannel2 = (data & 2) == 2;
            parentObj.rightChannel3 = (data & 4) == 4;
            parentObj.rightChannel4 = (data & 8) == 8;
            parentObj.leftChannel1 = (data & 16) == 16;
            parentObj.leftChannel2 = (data & 32) == 32;
            parentObj.leftChannel3 = (data & 64) == 64;
            parentObj.leftChannel4 = data > 127;
            parentObj.channel1OutputLevelCache();
            parentObj.channel2OutputLevelCache();
            parentObj.channel3OutputLevelCache();
            parentObj.channel4OutputLevelCache();
        }
    };
    //NR52:
    this.memoryHighWriter[38] = this.memoryWriter[65318] = function(parentObj, address, data) {
        parentObj.audioJIT();
        if (!parentObj.soundMasterEnabled && data > 127) {
            parentObj.memory[65318] = 128;
            parentObj.soundMasterEnabled = true;
            parentObj.initializeAudioStartState();
        } else if (parentObj.soundMasterEnabled && data < 128) {
            parentObj.memory[65318] = 0;
            parentObj.soundMasterEnabled = false;
            //GBDev wiki says the registers are written with zeros on power off:
            for(var index = 65296; index < 65318; index++)parentObj.memoryWriter[index](parentObj, index, 0);
        }
    };
    //0xFF27 to 0xFF2F don't do anything...
    this.memoryHighWriter[39] = this.memoryWriter[65319] = this.cartIgnoreWrite;
    this.memoryHighWriter[40] = this.memoryWriter[65320] = this.cartIgnoreWrite;
    this.memoryHighWriter[41] = this.memoryWriter[65321] = this.cartIgnoreWrite;
    this.memoryHighWriter[42] = this.memoryWriter[65322] = this.cartIgnoreWrite;
    this.memoryHighWriter[43] = this.memoryWriter[65323] = this.cartIgnoreWrite;
    this.memoryHighWriter[44] = this.memoryWriter[65324] = this.cartIgnoreWrite;
    this.memoryHighWriter[45] = this.memoryWriter[65325] = this.cartIgnoreWrite;
    this.memoryHighWriter[46] = this.memoryWriter[65326] = this.cartIgnoreWrite;
    this.memoryHighWriter[47] = this.memoryWriter[65327] = this.cartIgnoreWrite;
    //WAVE PCM RAM:
    this.memoryHighWriter[48] = this.memoryWriter[65328] = function(parentObj, address, data) {
        parentObj.channel3WriteRAM(0, data);
    };
    this.memoryHighWriter[49] = this.memoryWriter[65329] = function(parentObj, address, data) {
        parentObj.channel3WriteRAM(1, data);
    };
    this.memoryHighWriter[50] = this.memoryWriter[65330] = function(parentObj, address, data) {
        parentObj.channel3WriteRAM(2, data);
    };
    this.memoryHighWriter[51] = this.memoryWriter[65331] = function(parentObj, address, data) {
        parentObj.channel3WriteRAM(3, data);
    };
    this.memoryHighWriter[52] = this.memoryWriter[65332] = function(parentObj, address, data) {
        parentObj.channel3WriteRAM(4, data);
    };
    this.memoryHighWriter[53] = this.memoryWriter[65333] = function(parentObj, address, data) {
        parentObj.channel3WriteRAM(5, data);
    };
    this.memoryHighWriter[54] = this.memoryWriter[65334] = function(parentObj, address, data) {
        parentObj.channel3WriteRAM(6, data);
    };
    this.memoryHighWriter[55] = this.memoryWriter[65335] = function(parentObj, address, data) {
        parentObj.channel3WriteRAM(7, data);
    };
    this.memoryHighWriter[56] = this.memoryWriter[65336] = function(parentObj, address, data) {
        parentObj.channel3WriteRAM(8, data);
    };
    this.memoryHighWriter[57] = this.memoryWriter[65337] = function(parentObj, address, data) {
        parentObj.channel3WriteRAM(9, data);
    };
    this.memoryHighWriter[58] = this.memoryWriter[65338] = function(parentObj, address, data) {
        parentObj.channel3WriteRAM(10, data);
    };
    this.memoryHighWriter[59] = this.memoryWriter[65339] = function(parentObj, address, data) {
        parentObj.channel3WriteRAM(11, data);
    };
    this.memoryHighWriter[60] = this.memoryWriter[65340] = function(parentObj, address, data) {
        parentObj.channel3WriteRAM(12, data);
    };
    this.memoryHighWriter[61] = this.memoryWriter[65341] = function(parentObj, address, data) {
        parentObj.channel3WriteRAM(13, data);
    };
    this.memoryHighWriter[62] = this.memoryWriter[65342] = function(parentObj, address, data) {
        parentObj.channel3WriteRAM(14, data);
    };
    this.memoryHighWriter[63] = this.memoryWriter[65343] = function(parentObj, address, data) {
        parentObj.channel3WriteRAM(15, data);
    };
    //SCY
    this.memoryHighWriter[66] = this.memoryWriter[65346] = function(parentObj, address, data) {
        if (parentObj.backgroundY != data) {
            parentObj.midScanLineJIT();
            parentObj.backgroundY = data;
        }
    };
    //SCX
    this.memoryHighWriter[67] = this.memoryWriter[65347] = function(parentObj, address, data) {
        if (parentObj.backgroundX != data) {
            parentObj.midScanLineJIT();
            parentObj.backgroundX = data;
        }
    };
    //LY
    this.memoryHighWriter[68] = this.memoryWriter[65348] = function(parentObj, address, data) {
        //Read Only:
        if (parentObj.LCDisOn) {
            //Gambatte says to do this:
            parentObj.modeSTAT = 2;
            parentObj.midScanlineOffset = -1;
            parentObj.totalLinesPassed = parentObj.currentX = parentObj.queuedScanLines = parentObj.lastUnrenderedLine = parentObj.LCDTicks = parentObj.STATTracker = parentObj.actualScanLine = parentObj.memory[65348] = 0;
        }
    };
    //LYC
    this.memoryHighWriter[69] = this.memoryWriter[65349] = function(parentObj, address, data) {
        if (parentObj.memory[65349] != data) {
            parentObj.memory[65349] = data;
            if (parentObj.LCDisOn) parentObj.matchLYC(); //Get the compare of the first scan line.
        }
    };
    //WY
    this.memoryHighWriter[74] = this.memoryWriter[65354] = function(parentObj, address, data) {
        if (parentObj.windowY != data) {
            parentObj.midScanLineJIT();
            parentObj.windowY = data;
        }
    };
    //WX
    this.memoryHighWriter[75] = this.memoryWriter[65355] = function(parentObj, address, data) {
        if (parentObj.memory[65355] != data) {
            parentObj.midScanLineJIT();
            parentObj.memory[65355] = data;
            parentObj.windowX = data - 7;
        }
    };
    this.memoryHighWriter[114] = this.memoryWriter[65394] = function(parentObj, address, data) {
        parentObj.memory[65394] = data;
    };
    this.memoryHighWriter[115] = this.memoryWriter[65395] = function(parentObj, address, data) {
        parentObj.memory[65395] = data;
    };
    this.memoryHighWriter[117] = this.memoryWriter[65397] = function(parentObj, address, data) {
        parentObj.memory[65397] = data;
    };
    this.memoryHighWriter[118] = this.memoryWriter[65398] = this.cartIgnoreWrite;
    this.memoryHighWriter[119] = this.memoryWriter[65399] = this.cartIgnoreWrite;
    //IE (Interrupt Enable)
    this.memoryHighWriter[255] = this.memoryWriter[65535] = function(parentObj, address, data) {
        parentObj.interruptsEnabled = data;
        parentObj.checkIRQMatching();
    };
    this.recompileModelSpecificIOWriteHandling();
    this.recompileBootIOWriteHandling();
};
GameBoyCore.prototype.recompileModelSpecificIOWriteHandling = function() {
    if (this.cGBC) {
        //GameBoy Color Specific I/O:
        //SC (Serial Transfer Control Register)
        this.memoryHighWriter[2] = this.memoryWriter[65282] = function(parentObj, address, data) {
            if ((data & 1) == 1) {
                //Internal clock:
                parentObj.memory[65282] = data & 127;
                parentObj.serialTimer = (data & 2) == 0 ? 4096 : 128; //Set the Serial IRQ counter.
                parentObj.serialShiftTimer = parentObj.serialShiftTimerAllocated = (data & 2) == 0 ? 512 : 16; //Set the transfer data shift counter.
            } else {
                //External clock:
                parentObj.memory[65282] = data;
                parentObj.serialShiftTimer = parentObj.serialShiftTimerAllocated = parentObj.serialTimer = 0; //Zero the timers, since we're emulating as if nothing is connected.
            }
        };
        this.memoryHighWriter[64] = this.memoryWriter[65344] = function(parentObj, address, data) {
            if (parentObj.memory[65344] != data) {
                parentObj.midScanLineJIT();
                var temp_var = data > 127;
                if (temp_var != parentObj.LCDisOn) {
                    //When the display mode changes...
                    parentObj.LCDisOn = temp_var;
                    parentObj.memory[65345] &= 120;
                    parentObj.midScanlineOffset = -1;
                    parentObj.totalLinesPassed = parentObj.currentX = parentObj.queuedScanLines = parentObj.lastUnrenderedLine = parentObj.STATTracker = parentObj.LCDTicks = parentObj.actualScanLine = parentObj.memory[65348] = 0;
                    if (parentObj.LCDisOn) {
                        parentObj.modeSTAT = 2;
                        parentObj.matchLYC(); //Get the compare of the first scan line.
                        parentObj.LCDCONTROL = parentObj.LINECONTROL;
                    } else {
                        parentObj.modeSTAT = 0;
                        parentObj.LCDCONTROL = parentObj.DISPLAYOFFCONTROL;
                        parentObj.DisplayShowOff();
                    }
                    parentObj.interruptsRequested &= 253;
                }
                parentObj.gfxWindowCHRBankPosition = (data & 64) == 64 ? 1024 : 0;
                parentObj.gfxWindowDisplay = (data & 32) == 32;
                parentObj.gfxBackgroundBankOffset = (data & 16) == 16 ? 0 : 128;
                parentObj.gfxBackgroundCHRBankPosition = (data & 8) == 8 ? 1024 : 0;
                parentObj.gfxSpriteNormalHeight = (data & 4) == 0;
                parentObj.gfxSpriteShow = (data & 2) == 2;
                parentObj.BGPriorityEnabled = (data & 1) == 1;
                parentObj.priorityFlaggingPathRebuild(); //Special case the priority flagging as an optimization.
                parentObj.memory[65344] = data;
            }
        };
        this.memoryHighWriter[65] = this.memoryWriter[65345] = function(parentObj, address, data) {
            parentObj.LYCMatchTriggerSTAT = (data & 64) == 64;
            parentObj.mode2TriggerSTAT = (data & 32) == 32;
            parentObj.mode1TriggerSTAT = (data & 16) == 16;
            parentObj.mode0TriggerSTAT = (data & 8) == 8;
            parentObj.memory[65345] = data & 120;
        };
        this.memoryHighWriter[70] = this.memoryWriter[65350] = function(parentObj, address, data) {
            parentObj.memory[65350] = data;
            if (data < 224) {
                data <<= 8;
                address = 65024;
                var stat = parentObj.modeSTAT;
                parentObj.modeSTAT = 0;
                var newData = 0;
                do {
                    newData = parentObj.memoryReader[data](parentObj, data++);
                    if (newData != parentObj.memory[address]) {
                        //JIT the graphics render queue:
                        parentObj.modeSTAT = stat;
                        parentObj.graphicsJIT();
                        parentObj.modeSTAT = 0;
                        parentObj.memory[address++] = newData;
                        break;
                    }
                }while (++address < 65184)
                if (address < 65184) do {
                    parentObj.memory[address++] = parentObj.memoryReader[data](parentObj, data++);
                    parentObj.memory[address++] = parentObj.memoryReader[data](parentObj, data++);
                    parentObj.memory[address++] = parentObj.memoryReader[data](parentObj, data++);
                    parentObj.memory[address++] = parentObj.memoryReader[data](parentObj, data++);
                }while (address < 65184)
                parentObj.modeSTAT = stat;
            }
        };
        //KEY1
        this.memoryHighWriter[77] = this.memoryWriter[65357] = function(parentObj, address, data) {
            parentObj.memory[65357] = data & 127 | parentObj.memory[65357] & 128;
        };
        this.memoryHighWriter[79] = this.memoryWriter[65359] = function(parentObj, address, data) {
            parentObj.currVRAMBank = data & 1;
            if (parentObj.currVRAMBank > 0) parentObj.BGCHRCurrentBank = parentObj.BGCHRBank2;
            else parentObj.BGCHRCurrentBank = parentObj.BGCHRBank1;
        //Only writable by GBC.
        };
        this.memoryHighWriter[81] = this.memoryWriter[65361] = function(parentObj, address, data) {
            if (!parentObj.hdmaRunning) parentObj.memory[65361] = data;
        };
        this.memoryHighWriter[82] = this.memoryWriter[65362] = function(parentObj, address, data) {
            if (!parentObj.hdmaRunning) parentObj.memory[65362] = data & 240;
        };
        this.memoryHighWriter[83] = this.memoryWriter[65363] = function(parentObj, address, data) {
            if (!parentObj.hdmaRunning) parentObj.memory[65363] = data & 31;
        };
        this.memoryHighWriter[84] = this.memoryWriter[65364] = function(parentObj, address, data) {
            if (!parentObj.hdmaRunning) parentObj.memory[65364] = data & 240;
        };
        this.memoryHighWriter[85] = this.memoryWriter[65365] = function(parentObj, address, data) {
            if (!parentObj.hdmaRunning) {
                if ((data & 128) == 0) {
                    //DMA
                    parentObj.DMAWrite((data & 127) + 1);
                    parentObj.memory[65365] = 255; //Transfer completed.
                } else {
                    //H-Blank DMA
                    parentObj.hdmaRunning = true;
                    parentObj.memory[65365] = data & 127;
                }
            } else if ((data & 128) == 0) {
                //Stop H-Blank DMA
                parentObj.hdmaRunning = false;
                parentObj.memory[65365] |= 128;
            } else parentObj.memory[65365] = data & 127;
        };
        this.memoryHighWriter[104] = this.memoryWriter[65384] = function(parentObj, address, data) {
            parentObj.memory[65385] = parentObj.gbcBGRawPalette[data & 63];
            parentObj.memory[65384] = data;
        };
        this.memoryHighWriter[105] = this.memoryWriter[65385] = function(parentObj, address, data) {
            parentObj.updateGBCBGPalette(parentObj.memory[65384] & 63, data);
            if (parentObj.memory[65384] > 127) {
                var next = parentObj.memory[65384] + 1 & 63;
                parentObj.memory[65384] = next | 128;
                parentObj.memory[65385] = parentObj.gbcBGRawPalette[next];
            } else parentObj.memory[65385] = data;
        };
        this.memoryHighWriter[106] = this.memoryWriter[65386] = function(parentObj, address, data) {
            parentObj.memory[65387] = parentObj.gbcOBJRawPalette[data & 63];
            parentObj.memory[65386] = data;
        };
        this.memoryHighWriter[107] = this.memoryWriter[65387] = function(parentObj, address, data) {
            parentObj.updateGBCOBJPalette(parentObj.memory[65386] & 63, data);
            if (parentObj.memory[65386] > 127) {
                var next = parentObj.memory[65386] + 1 & 63;
                parentObj.memory[65386] = next | 128;
                parentObj.memory[65387] = parentObj.gbcOBJRawPalette[next];
            } else parentObj.memory[65387] = data;
        };
        //SVBK
        this.memoryHighWriter[112] = this.memoryWriter[65392] = function(parentObj, address, data) {
            var addressCheck = parentObj.memory[65361] << 8 | parentObj.memory[65362]; //Cannot change the RAM bank while WRAM is the source of a running HDMA.
            if (!parentObj.hdmaRunning || addressCheck < 53248 || addressCheck >= 57344) {
                parentObj.gbcRamBank = Math.max(data & 7, 1); //Bank range is from 1-7
                parentObj.gbcRamBankPosition = (parentObj.gbcRamBank - 1 << 12) - 53248;
                parentObj.gbcRamBankPositionECHO = parentObj.gbcRamBankPosition - 8192;
            }
            parentObj.memory[65392] = data; //Bit 6 cannot be written to.
        };
        this.memoryHighWriter[116] = this.memoryWriter[65396] = function(parentObj, address, data) {
            parentObj.memory[65396] = data;
        };
    } else {
        //Fill in the GameBoy Color I/O registers as normal RAM for GameBoy compatibility:
        //SC (Serial Transfer Control Register)
        this.memoryHighWriter[2] = this.memoryWriter[65282] = function(parentObj, address, data) {
            if ((data & 1) == 1) {
                //Internal clock:
                parentObj.memory[65282] = data & 127;
                parentObj.serialTimer = 4096; //Set the Serial IRQ counter.
                parentObj.serialShiftTimer = parentObj.serialShiftTimerAllocated = 512; //Set the transfer data shift counter.
            } else {
                //External clock:
                parentObj.memory[65282] = data;
                parentObj.serialShiftTimer = parentObj.serialShiftTimerAllocated = parentObj.serialTimer = 0; //Zero the timers, since we're emulating as if nothing is connected.
            }
        };
        this.memoryHighWriter[64] = this.memoryWriter[65344] = function(parentObj, address, data) {
            if (parentObj.memory[65344] != data) {
                parentObj.midScanLineJIT();
                var temp_var = data > 127;
                if (temp_var != parentObj.LCDisOn) {
                    //When the display mode changes...
                    parentObj.LCDisOn = temp_var;
                    parentObj.memory[65345] &= 120;
                    parentObj.midScanlineOffset = -1;
                    parentObj.totalLinesPassed = parentObj.currentX = parentObj.queuedScanLines = parentObj.lastUnrenderedLine = parentObj.STATTracker = parentObj.LCDTicks = parentObj.actualScanLine = parentObj.memory[65348] = 0;
                    if (parentObj.LCDisOn) {
                        parentObj.modeSTAT = 2;
                        parentObj.matchLYC(); //Get the compare of the first scan line.
                        parentObj.LCDCONTROL = parentObj.LINECONTROL;
                    } else {
                        parentObj.modeSTAT = 0;
                        parentObj.LCDCONTROL = parentObj.DISPLAYOFFCONTROL;
                        parentObj.DisplayShowOff();
                    }
                    parentObj.interruptsRequested &= 253;
                }
                parentObj.gfxWindowCHRBankPosition = (data & 64) == 64 ? 1024 : 0;
                parentObj.gfxWindowDisplay = (data & 32) == 32;
                parentObj.gfxBackgroundBankOffset = (data & 16) == 16 ? 0 : 128;
                parentObj.gfxBackgroundCHRBankPosition = (data & 8) == 8 ? 1024 : 0;
                parentObj.gfxSpriteNormalHeight = (data & 4) == 0;
                parentObj.gfxSpriteShow = (data & 2) == 2;
                parentObj.bgEnabled = (data & 1) == 1;
                parentObj.memory[65344] = data;
            }
        };
        this.memoryHighWriter[65] = this.memoryWriter[65345] = function(parentObj, address, data) {
            parentObj.LYCMatchTriggerSTAT = (data & 64) == 64;
            parentObj.mode2TriggerSTAT = (data & 32) == 32;
            parentObj.mode1TriggerSTAT = (data & 16) == 16;
            parentObj.mode0TriggerSTAT = (data & 8) == 8;
            parentObj.memory[65345] = data & 120;
            if ((!parentObj.usedBootROM || !parentObj.usedGBCBootROM) && parentObj.LCDisOn && parentObj.modeSTAT < 2) {
                parentObj.interruptsRequested |= 2;
                parentObj.checkIRQMatching();
            }
        };
        this.memoryHighWriter[70] = this.memoryWriter[65350] = function(parentObj, address, data) {
            parentObj.memory[65350] = data;
            if (data > 127 && data < 224) {
                data <<= 8;
                address = 65024;
                var stat = parentObj.modeSTAT;
                parentObj.modeSTAT = 0;
                var newData = 0;
                do {
                    newData = parentObj.memoryReader[data](parentObj, data++);
                    if (newData != parentObj.memory[address]) {
                        //JIT the graphics render queue:
                        parentObj.modeSTAT = stat;
                        parentObj.graphicsJIT();
                        parentObj.modeSTAT = 0;
                        parentObj.memory[address++] = newData;
                        break;
                    }
                }while (++address < 65184)
                if (address < 65184) do {
                    parentObj.memory[address++] = parentObj.memoryReader[data](parentObj, data++);
                    parentObj.memory[address++] = parentObj.memoryReader[data](parentObj, data++);
                    parentObj.memory[address++] = parentObj.memoryReader[data](parentObj, data++);
                    parentObj.memory[address++] = parentObj.memoryReader[data](parentObj, data++);
                }while (address < 65184)
                parentObj.modeSTAT = stat;
            }
        };
        this.memoryHighWriter[71] = this.memoryWriter[65351] = function(parentObj, address, data) {
            if (parentObj.memory[65351] != data) {
                parentObj.midScanLineJIT();
                parentObj.updateGBBGPalette(data);
                parentObj.memory[65351] = data;
            }
        };
        this.memoryHighWriter[72] = this.memoryWriter[65352] = function(parentObj, address, data) {
            if (parentObj.memory[65352] != data) {
                parentObj.midScanLineJIT();
                parentObj.updateGBOBJPalette(0, data);
                parentObj.memory[65352] = data;
            }
        };
        this.memoryHighWriter[73] = this.memoryWriter[65353] = function(parentObj, address, data) {
            if (parentObj.memory[65353] != data) {
                parentObj.midScanLineJIT();
                parentObj.updateGBOBJPalette(4, data);
                parentObj.memory[65353] = data;
            }
        };
        this.memoryHighWriter[77] = this.memoryWriter[65357] = function(parentObj, address, data) {
            parentObj.memory[65357] = data;
        };
        this.memoryHighWriter[79] = this.memoryWriter[65359] = this.cartIgnoreWrite; //Not writable in DMG mode.
        this.memoryHighWriter[85] = this.memoryWriter[65365] = this.cartIgnoreWrite;
        this.memoryHighWriter[104] = this.memoryWriter[65384] = this.cartIgnoreWrite;
        this.memoryHighWriter[105] = this.memoryWriter[65385] = this.cartIgnoreWrite;
        this.memoryHighWriter[106] = this.memoryWriter[65386] = this.cartIgnoreWrite;
        this.memoryHighWriter[107] = this.memoryWriter[65387] = this.cartIgnoreWrite;
        this.memoryHighWriter[108] = this.memoryWriter[65388] = this.cartIgnoreWrite;
        this.memoryHighWriter[112] = this.memoryWriter[65392] = this.cartIgnoreWrite;
        this.memoryHighWriter[116] = this.memoryWriter[65396] = this.cartIgnoreWrite;
    }
};
GameBoyCore.prototype.recompileBootIOWriteHandling = function() {
    //Boot I/O Registers:
    if (this.inBootstrap) {
        this.memoryHighWriter[80] = this.memoryWriter[65360] = function(parentObj, address, data) {
            cout("Boot ROM reads blocked: Bootstrap process has ended.", 0);
            parentObj.inBootstrap = false;
            parentObj.disableBootROM(); //Fill in the boot ROM ranges with ROM  bank 0 ROM ranges
            parentObj.memory[65360] = data; //Bits are sustained in memory?
        };
        if (this.cGBC) this.memoryHighWriter[108] = this.memoryWriter[65388] = function(parentObj, address, data) {
            if (parentObj.inBootstrap) {
                parentObj.cGBC = (data & 1) == 0;
                //Exception to the GBC identifying code:
                if (parentObj.name + parentObj.gameCode + parentObj.ROM[323] == "Game and Watch 50") {
                    parentObj.cGBC = true;
                    cout("Created a boot exception for Game and Watch Gallery 2 (GBC ID byte is wrong on the cartridge).", 1);
                }
                cout("Booted to GBC Mode: " + parentObj.cGBC, 0);
            }
            parentObj.memory[65388] = data;
        };
    } else //Lockout the ROMs from accessing the BOOT ROM control register:
    this.memoryHighWriter[80] = this.memoryWriter[65360] = this.cartIgnoreWrite;
};
//Helper Functions
GameBoyCore.prototype.toTypedArray = function(baseArray, memtype) {
    try {
        if (settings[5]) return baseArray;
        if (!baseArray || !baseArray.length) return [];
        var length = baseArray.length;
        switch(memtype){
            case "uint8":
                var typedArrayTemp = new Uint8Array(length);
                break;
            case "int8":
                var typedArrayTemp = new Int8Array(length);
                break;
            case "int32":
                var typedArrayTemp = new Int32Array(length);
                break;
            case "float32":
                var typedArrayTemp = new Float32Array(length);
        }
        for(var index = 0; index < length; index++)typedArrayTemp[index] = baseArray[index];
        return typedArrayTemp;
    } catch (error) {
        cout("Could not convert an array to a typed array: " + error.message, 1);
        return baseArray;
    }
};
GameBoyCore.prototype.fromTypedArray = function(baseArray) {
    try {
        if (!baseArray || !baseArray.length) return [];
        var arrayTemp = [];
        for(var index = 0; index < baseArray.length; ++index)arrayTemp[index] = baseArray[index];
        return arrayTemp;
    } catch (error) {
        cout("Conversion from a typed array failed: " + error.message, 1);
        return baseArray;
    }
};
GameBoyCore.prototype.getTypedArray = function(length, defaultValue, numberType) {
    try {
        if (settings[5]) throw new Error("Settings forced typed arrays to be disabled.");
        switch(numberType){
            case "int8":
                var arrayHandle = new Int8Array(length);
                break;
            case "uint8":
                var arrayHandle = new Uint8Array(length);
                break;
            case "int32":
                var arrayHandle = new Int32Array(length);
                break;
            case "float32":
                var arrayHandle = new Float32Array(length);
        }
        if (defaultValue != 0) {
            var index = 0;
            while(index < length)arrayHandle[index++] = defaultValue;
        }
    } catch (error) {
        cout("Could not convert an array to a typed array: " + error.message, 1);
        var arrayHandle = [];
        var index = 0;
        while(index < length)arrayHandle[index++] = defaultValue;
    }
    return arrayHandle;
};
module.exports = GameBoyCore; //  LocalWords:  saveSRAMState

},{"./instance.js":"26Q5m","./settings.js":"3esuH","./saveState.js":"fh82g","./architecture/ffxxDump.js":"6mZPE","./architecture/OPCODE.js":"5NkRc","./architecture/CBOPCODE.js":"86Zgb","./architecture/TICKTable.js":"jyqB4","./architecture/SecondaryTICKTable.js":"dyx3a"}],"26Q5m":[function(require,module,exports) {
function Instance(ROMImage) {
    //My added variables--------------
    this.frameDone = false;
    this.currentScreen = []; //this.currentScreenContents;
    this.lastScreen = []; //A copy of the last frame's screen.
    this.partialScreen = {
    }; //An object with the differences from the last screen.
    //Params, etc...
    this.currentFrame = []; //Array of the most recent frame.
    this.drawContext = null; // LCD Context
    this.ROMImage = ROMImage; //The game's ROM. 
    //CPU Registers and Flags:
    this.registerA = 1; //Register A (Accumulator)
    this.FZero = true; //Register F  - Result was zero
    this.FSubtract = false; //Register F  - Subtraction was executed
    this.FHalfCarry = true; //Register F  - Half carry or half borrow
    this.FCarry = true; //Register F  - Carry or borrow
    this.registerB = 0; //Register B
    this.registerC = 19; //Register C
    this.registerD = 0; //Register D
    this.registerE = 216; //Register E
    this.registersHL = 333; //Registers H and L combined
    this.stackPointer = 65534; //Stack Pointer
    this.programCounter = 256; //Program Counter
    //Some CPU Emulation State Variables:
    this.CPUCyclesTotal = 0; //Relative CPU clocking to speed set, rounded appropriately.
    this.CPUCyclesTotalBase = 0; //Relative CPU clocking to speed set base.
    this.CPUCyclesTotalCurrent = 0; //Relative CPU clocking to speed set, the directly used value.
    this.CPUCyclesTotalRoundoff = 0; //Clocking per iteration rounding catch.
    this.baseCPUCyclesPerIteration = 0; //CPU clocks per iteration at 1x speed.
    this.remainingClocks = 0; //HALT clocking overrun carry over.
    this.inBootstrap = true; //Whether we're in the GBC boot ROM.
    this.usedBootROM = false; //Updated upon ROM loading...
    this.usedGBCBootROM = false; //Did we boot to the GBC boot ROM?
    this.halt = false; //Has the CPU been suspended until the next interrupt?
    this.skipPCIncrement = false; //Did we trip the DMG Halt bug?
    this.stopEmulator = 3; //Has the emulation been paused or a frame has ended?
    this.IME = true; //Are interrupts enabled?
    this.IRQLineMatched = 0; //CPU IRQ assertion.
    this.interruptsRequested = 0; //IF Register
    this.interruptsEnabled = 0; //IE Register
    this.hdmaRunning = false; //HDMA Transfer Flag - GBC only
    this.CPUTicks = 0; //The number of clock cycles emulated.
    this.doubleSpeedShifter = 0; //GBC double speed clocking shifter.
    this.JoyPad = 255; //Joypad State (two four-bit states actually)
    this.CPUStopped = false; //CPU STOP status.
    //Main RAM, MBC RAM, GBC Main RAM, VRAM, etc.
    this.memoryReader = []; //Array of functions mapped to read back memory
    this.memoryWriter = []; //Array of functions mapped to write to memory
    this.memoryHighReader = []; //Array of functions mapped to read back 0xFFXX memory
    this.memoryHighWriter = []; //Array of functions mapped to write to 0xFFXX memory
    this.ROM = []; //The full ROM file dumped to an array.
    this.memory = []; //Main Core Memory
    this.MBCRam = []; //Switchable RAM (Used by games for more RAM) for the main memory range 0xA000 - 0xC000.
    this.VRAM = []; //Extra VRAM bank for GBC.
    this.GBCMemory = []; //GBC main RAM Banks
    this.MBC1Mode = false; //MBC1 Type (4/32, 16/8)
    this.MBCRAMBanksEnabled = false; //MBC RAM Access Control.
    this.currMBCRAMBank = 0; //MBC Currently Indexed RAM Bank
    this.currMBCRAMBankPosition = -40960; //MBC Position Adder;
    this.cGBC = false; //GameBoy Color detection.
    this.gbcRamBank = 1; //Currently Switched GameBoy Color ram bank
    this.gbcRamBankPosition = -53248; //GBC RAM offset from address start.
    this.gbcRamBankPositionECHO = -61440; //GBC RAM (ECHO mirroring) offset from address start.
    this.RAMBanks = [
        0,
        1,
        2,
        4,
        16
    ]; //Used to map the RAM banks to maximum size the MBC used can do.
    this.ROMBank1offs = 0; //Offset of the ROM bank switching.
    this.currentROMBank = 0; //The parsed current ROM bank selection.
    this.cartridgeType = 0; //Cartridge Type
    this.name = ""; //Name of the game
    this.gameCode = ""; //Game code (Suffix for older games)
    this.fromSaveState = false; //A boolean to see if this was loaded in as a save state.
    this.savedStateFileName = ""; //When loaded in as a save state, this will not be empty.
    this.STATTracker = 0; //Tracker for STAT triggering.
    this.modeSTAT = 0; //The scan line mode (for lines 1-144 it's 2-3-0, for 145-154 it's 1)
    this.spriteCount = 252; //Mode 3 extra clocking counter (Depends on how many sprites are on the current line.).
    this.LYCMatchTriggerSTAT = false; //Should we trigger an interrupt if LY==LYC?
    this.mode2TriggerSTAT = false; //Should we trigger an interrupt if in mode 2?
    this.mode1TriggerSTAT = false; //Should we trigger an interrupt if in mode 1?
    this.mode0TriggerSTAT = false; //Should we trigger an interrupt if in mode 0?
    this.LCDisOn = false; //Is the emulated LCD controller on?
    this.LINECONTROL = []; //Array of functions to handle each scan line we do (onscreen + offscreen)
    this.DISPLAYOFFCONTROL = [
        function(parentObj) {
        //Array of line 0 function to handle the LCD controller when it's off (Do nothing!).
        }
    ];
    this.LCDCONTROL = null; //Pointer to either LINECONTROL or DISPLAYOFFCONTROL.
    this.initializeLCDController(); //Compile the LCD controller functions.
    //RTC (Real Time Clock for MBC3):
    this.RTCisLatched = false;
    this.latchedSeconds = 0; //RTC latched seconds.
    this.latchedMinutes = 0; //RTC latched minutes.
    this.latchedHours = 0; //RTC latched hours.
    this.latchedLDays = 0; //RTC latched lower 8-bits of the day counter.
    this.latchedHDays = 0; //RTC latched high-bit of the day counter.
    this.RTCSeconds = 0; //RTC seconds counter.
    this.RTCMinutes = 0; //RTC minutes counter.
    this.RTCHours = 0; //RTC hours counter.
    this.RTCDays = 0; //RTC days counter.
    this.RTCDayOverFlow = false; //Did the RTC overflow and wrap the day counter?
    this.RTCHALT = false; //Is the RTC allowed to clock up?
    //Gyro:
    this.highX = 127;
    this.lowX = 127;
    this.highY = 127;
    this.lowY = 127;
    //Sound variables:
    this.audioHandle = null; //XAudioJS handle
    this.numSamplesTotal = 0; //Length of the sound buffers.
    this.dutyLookup = [
        [
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            true
        ],
        [
            true,
            false,
            false,
            false,
            false,
            false,
            false,
            true
        ],
        [
            true,
            false,
            false,
            false,
            false,
            true,
            true,
            true
        ],
        [
            false,
            true,
            true,
            true,
            true,
            true,
            true,
            false
        ]
    ];
    this.bufferContainAmount = 0; //Buffer maintenance metric.
    this.LSFR15Table = null;
    this.LSFR7Table = null;
    this.noiseSampleTable = null;
    this.initializeAudioStartState();
    this.soundMasterEnabled = false; //As its name implies
    this.channel3PCM = null; //Channel 3 adjusted sample buffer.
    //Vin Shit:
    this.VinLeftChannelMasterVolume = 8; //Computed post-mixing volume.
    this.VinRightChannelMasterVolume = 8; //Computed post-mixing volume.
    //Channel paths enabled:
    this.leftChannel1 = false;
    this.leftChannel2 = false;
    this.leftChannel3 = false;
    this.leftChannel4 = false;
    this.rightChannel1 = false;
    this.rightChannel2 = false;
    this.rightChannel3 = false;
    this.rightChannel4 = false;
    this.audioClocksUntilNextEvent = 1;
    this.audioClocksUntilNextEventCounter = 1;
    //Channel output level caches:
    this.channel1currentSampleLeft = 0;
    this.channel1currentSampleRight = 0;
    this.channel2currentSampleLeft = 0;
    this.channel2currentSampleRight = 0;
    this.channel3currentSampleLeft = 0;
    this.channel3currentSampleRight = 0;
    this.channel4currentSampleLeft = 0;
    this.channel4currentSampleRight = 0;
    this.channel1currentSampleLeftSecondary = 0;
    this.channel1currentSampleRightSecondary = 0;
    this.channel2currentSampleLeftSecondary = 0;
    this.channel2currentSampleRightSecondary = 0;
    this.channel3currentSampleLeftSecondary = 0;
    this.channel3currentSampleRightSecondary = 0;
    this.channel4currentSampleLeftSecondary = 0;
    this.channel4currentSampleRightSecondary = 0;
    this.channel1currentSampleLeftTrimary = 0;
    this.channel1currentSampleRightTrimary = 0;
    this.channel2currentSampleLeftTrimary = 0;
    this.channel2currentSampleRightTrimary = 0;
    this.mixerOutputCache = 0;
    //Pre-multipliers to cache some calculations:
    this.emulatorSpeed = 1;
    this.initializeTiming();
    //Audio generation counters:
    this.audioTicks = 0; //Used to sample the audio system every x CPU instructions.
    this.audioIndex = 0; //Used to keep alignment on audio generation.
    this.downsampleInput = 0;
    this.audioDestinationPosition = 0; //Used to keep alignment on audio generation.
    this.rollover = 0; //Used to keep alignment on the number of samples to output (Realign from counter alias).
    //Timing Variables
    this.emulatorTicks = 0; //Times for how many instructions to execute before ending the loop.
    this.DIVTicks = 56; //DIV Ticks Counter (Invisible lower 8-bit)
    this.LCDTicks = 60; //Counter for how many instructions have been executed on a scanline so far.
    this.timerTicks = 0; //Counter for the TIMA timer.
    this.TIMAEnabled = false; //Is TIMA enabled?
    this.TACClocker = 1024; //Timer Max Ticks
    this.serialTimer = 0; //Serial IRQ Timer
    this.serialShiftTimer = 0; //Serial Transfer Shift Timer
    this.serialShiftTimerAllocated = 0; //Serial Transfer Shift Timer Refill
    this.IRQEnableDelay = 0; //Are the interrupts on queue to be enabled?
    var dateVar = new Date();
    this.lastIteration = dateVar.getTime(); //The last time we iterated the main loop.
    dateVar = new Date();
    this.firstIteration = dateVar.getTime();
    this.iterations = 0;
    this.actualScanLine = 0; //Actual scan line...
    this.lastUnrenderedLine = 0; //Last rendered scan line...
    this.queuedScanLines = 0;
    this.totalLinesPassed = 0;
    this.haltPostClocks = 0; //Post-Halt clocking.
    //ROM Cartridge Components:
    this.cMBC1 = false; //Does the cartridge use MBC1?
    this.cMBC2 = false; //Does the cartridge use MBC2?
    this.cMBC3 = false; //Does the cartridge use MBC3?
    this.cMBC5 = false; //Does the cartridge use MBC5?
    this.cMBC7 = false; //Does the cartridge use MBC7?
    this.cSRAM = false; //Does the cartridge use save RAM?
    this.cMMMO1 = false; //...
    this.cRUMBLE = false; //Does the cartridge use the RUMBLE addressing (modified MBC5)?
    this.cCamera = false; //Is the cartridge actually a GameBoy Camera?
    this.cTAMA5 = false; //Does the cartridge use TAMA5? (Tamagotchi Cartridge)
    this.cHuC3 = false; //Does the cartridge use HuC3 (Hudson Soft / modified MBC3)?
    this.cHuC1 = false; //Does the cartridge use HuC1 (Hudson Soft / modified MBC1)?
    this.cTIMER = false; //Does the cartridge have an RTC?
    this.ROMBanks = [
        2,
        4,
        8,
        16,
        32,
        64,
        128,
        256,
        512
    ];
    this.ROMBanks[82] = 72;
    this.ROMBanks[83] = 80;
    this.ROMBanks[84] = 96;
    this.numRAMBanks = 0; //How many RAM banks were actually allocated?
    ////Graphics Variables
    this.currVRAMBank = 0; //Current VRAM bank for GBC.
    this.backgroundX = 0; //Register SCX (X-Scroll)
    this.backgroundY = 0; //Register SCY (Y-Scroll)
    this.gfxWindowDisplay = false; //Is the windows enabled?
    this.gfxSpriteShow = false; //Are sprites enabled?
    this.gfxSpriteNormalHeight = true; //Are we doing 8x8 or 8x16 sprites?
    this.bgEnabled = true; //Is the BG enabled?
    this.BGPriorityEnabled = true; //Can we flag the BG for priority over sprites?
    this.gfxWindowCHRBankPosition = 0; //The current bank of the character map the window uses.
    this.gfxBackgroundCHRBankPosition = 0; //The current bank of the character map the BG uses.
    this.gfxBackgroundBankOffset = 128; //Fast mapping of the tile numbering/
    this.windowY = 0; //Current Y offset of the window.
    this.windowX = 0; //Current X offset of the window.
    this.drewBlank = 0; //To prevent the repeating of drawing a blank screen.
    this.drewFrame = false; //Throttle how many draws we can do to once per iteration.
    this.midScanlineOffset = -1; //mid-scanline rendering offset.
    this.pixelEnd = 0; //track the x-coord limit for line rendering (mid-scanline usage).
    this.currentX = 0; //The x-coord we left off at for mid-scanline rendering.
    //BG Tile Pointer Caches:
    this.BGCHRBank1 = null;
    this.BGCHRBank2 = null;
    this.BGCHRCurrentBank = null;
    //Tile Data Cache:
    this.tileCache = null;
    //Palettes:
    this.colors = [
        15728606,
        11392916,
        5411443,
        1586242
    ]; //"Classic" GameBoy palette colors.
    this.OBJPalette = null;
    this.BGPalette = null;
    this.gbcOBJRawPalette = null;
    this.gbcBGRawPalette = null;
    this.gbOBJPalette = null;
    this.gbBGPalette = null;
    this.gbcOBJPalette = null;
    this.gbcBGPalette = null;
    this.gbBGColorizedPalette = null;
    this.gbOBJColorizedPalette = null;
    this.cachedBGPaletteConversion = null;
    this.cachedOBJPaletteConversion = null;
    this.updateGBBGPalette = this.updateGBRegularBGPalette;
    this.updateGBOBJPalette = this.updateGBRegularOBJPalette;
    this.colorizedGBPalettes = false;
    this.BGLayerRender = null; //Reference to the BG rendering function.
    this.WindowLayerRender = null; //Reference to the window rendering function.
    this.SpriteLayerRender = null; //Reference to the OAM rendering function.
    this.frameBuffer = []; //The internal frame-buffer.
    this.swizzledFrame = null; //The secondary gfx buffer that holds the converted RGBA values.
    this.canvasBuffer = null; //imageData handle
    this.pixelStart = 0; //Temp variable for holding the current working framebuffer offset.
    //Variables used for scaling in JS:
    this.onscreenWidth = this.offscreenWidth = 160;
    this.onscreenHeight = this.offScreenheight = 144;
    this.offscreenRGBCount = this.onscreenWidth * this.onscreenHeight * 4;
    this.resizePathClear = true;
    //Initialize the white noise cache tables ahead of time:
    this.intializeWhiteNoise();
}
module.exports = Instance;

},{}],"3esuH":[function(require,module,exports) {
var settings = [
    true,
    true,
    false,
    1,
    true,
    false,
    8,
    10,
    20,
    false,
    false,
    false,
    false,
    true,
    [
        true,
        true,
        true,
        true
    ] //User controlled channel enables.
];
module.exports = settings;

},{}],"fh82g":[function(require,module,exports) {
var saveState = function() {
    return [
        this.fromTypedArray(this.ROM),
        this.inBootstrap,
        this.registerA,
        this.FZero,
        this.FSubtract,
        this.FHalfCarry,
        this.FCarry,
        this.registerB,
        this.registerC,
        this.registerD,
        this.registerE,
        this.registersHL,
        this.stackPointer,
        this.programCounter,
        this.halt,
        this.IME,
        this.hdmaRunning,
        this.CPUTicks,
        this.doubleSpeedShifter,
        this.fromTypedArray(this.memory),
        this.fromTypedArray(this.MBCRam),
        this.fromTypedArray(this.VRAM),
        this.currVRAMBank,
        this.fromTypedArray(this.GBCMemory),
        this.MBC1Mode,
        this.MBCRAMBanksEnabled,
        this.currMBCRAMBank,
        this.currMBCRAMBankPosition,
        this.cGBC,
        this.gbcRamBank,
        this.gbcRamBankPosition,
        this.ROMBank1offs,
        this.currentROMBank,
        this.cartridgeType,
        this.name,
        this.gameCode,
        this.modeSTAT,
        this.LYCMatchTriggerSTAT,
        this.mode2TriggerSTAT,
        this.mode1TriggerSTAT,
        this.mode0TriggerSTAT,
        this.LCDisOn,
        this.gfxWindowCHRBankPosition,
        this.gfxWindowDisplay,
        this.gfxSpriteShow,
        this.gfxSpriteNormalHeight,
        this.gfxBackgroundCHRBankPosition,
        this.gfxBackgroundBankOffset,
        this.TIMAEnabled,
        this.DIVTicks,
        this.LCDTicks,
        this.timerTicks,
        this.TACClocker,
        this.serialTimer,
        this.serialShiftTimer,
        this.serialShiftTimerAllocated,
        this.IRQEnableDelay,
        this.lastIteration,
        this.cMBC1,
        this.cMBC2,
        this.cMBC3,
        this.cMBC5,
        this.cMBC7,
        this.cSRAM,
        this.cMMMO1,
        this.cRUMBLE,
        this.cCamera,
        this.cTAMA5,
        this.cHuC3,
        this.cHuC1,
        this.drewBlank,
        this.fromTypedArray(this.frameBuffer),
        this.bgEnabled,
        this.BGPriorityEnabled,
        this.channel1FrequencyTracker,
        this.channel1FrequencyCounter,
        this.channel1totalLength,
        this.channel1envelopeVolume,
        this.channel1envelopeType,
        this.channel1envelopeSweeps,
        this.channel1envelopeSweepsLast,
        this.channel1consecutive,
        this.channel1frequency,
        this.channel1SweepFault,
        this.channel1ShadowFrequency,
        this.channel1timeSweep,
        this.channel1lastTimeSweep,
        this.channel1Swept,
        this.channel1frequencySweepDivider,
        this.channel1decreaseSweep,
        this.channel2FrequencyTracker,
        this.channel2FrequencyCounter,
        this.channel2totalLength,
        this.channel2envelopeVolume,
        this.channel2envelopeType,
        this.channel2envelopeSweeps,
        this.channel2envelopeSweepsLast,
        this.channel2consecutive,
        this.channel2frequency,
        this.channel3canPlay,
        this.channel3totalLength,
        this.channel3patternType,
        this.channel3frequency,
        this.channel3consecutive,
        this.fromTypedArray(this.channel3PCM),
        this.channel4FrequencyPeriod,
        this.channel4lastSampleLookup,
        this.channel4totalLength,
        this.channel4envelopeVolume,
        this.channel4currentVolume,
        this.channel4envelopeType,
        this.channel4envelopeSweeps,
        this.channel4envelopeSweepsLast,
        this.channel4consecutive,
        this.channel4BitRange,
        this.soundMasterEnabled,
        this.VinLeftChannelMasterVolume,
        this.VinRightChannelMasterVolume,
        this.leftChannel1,
        this.leftChannel2,
        this.leftChannel3,
        this.leftChannel4,
        this.rightChannel1,
        this.rightChannel2,
        this.rightChannel3,
        this.rightChannel4,
        this.channel1currentSampleLeft,
        this.channel1currentSampleRight,
        this.channel2currentSampleLeft,
        this.channel2currentSampleRight,
        this.channel3currentSampleLeft,
        this.channel3currentSampleRight,
        this.channel4currentSampleLeft,
        this.channel4currentSampleRight,
        this.channel1currentSampleLeftSecondary,
        this.channel1currentSampleRightSecondary,
        this.channel2currentSampleLeftSecondary,
        this.channel2currentSampleRightSecondary,
        this.channel3currentSampleLeftSecondary,
        this.channel3currentSampleRightSecondary,
        this.channel4currentSampleLeftSecondary,
        this.channel4currentSampleRightSecondary,
        this.channel1currentSampleLeftTrimary,
        this.channel1currentSampleRightTrimary,
        this.channel2currentSampleLeftTrimary,
        this.channel2currentSampleRightTrimary,
        this.mixerOutputCache,
        this.channel1DutyTracker,
        this.channel1CachedDuty,
        this.channel2DutyTracker,
        this.channel2CachedDuty,
        this.channel1Enabled,
        this.channel2Enabled,
        this.channel3Enabled,
        this.channel4Enabled,
        this.sequencerClocks,
        this.sequencePosition,
        this.channel3Counter,
        this.channel4Counter,
        this.cachedChannel3Sample,
        this.cachedChannel4Sample,
        this.channel3FrequencyPeriod,
        this.channel3lastSampleLookup,
        this.actualScanLine,
        this.lastUnrenderedLine,
        this.queuedScanLines,
        this.RTCisLatched,
        this.latchedSeconds,
        this.latchedMinutes,
        this.latchedHours,
        this.latchedLDays,
        this.latchedHDays,
        this.RTCSeconds,
        this.RTCMinutes,
        this.RTCHours,
        this.RTCDays,
        this.RTCDayOverFlow,
        this.RTCHALT,
        this.usedBootROM,
        this.skipPCIncrement,
        this.STATTracker,
        this.gbcRamBankPositionECHO,
        this.numRAMBanks,
        this.windowY,
        this.windowX,
        this.fromTypedArray(this.gbcOBJRawPalette),
        this.fromTypedArray(this.gbcBGRawPalette),
        this.fromTypedArray(this.gbOBJPalette),
        this.fromTypedArray(this.gbBGPalette),
        this.fromTypedArray(this.gbcOBJPalette),
        this.fromTypedArray(this.gbcBGPalette),
        this.fromTypedArray(this.gbBGColorizedPalette),
        this.fromTypedArray(this.gbOBJColorizedPalette),
        this.fromTypedArray(this.cachedBGPaletteConversion),
        this.fromTypedArray(this.cachedOBJPaletteConversion),
        this.fromTypedArray(this.BGCHRBank1),
        this.fromTypedArray(this.BGCHRBank2),
        this.haltPostClocks,
        this.interruptsRequested,
        this.interruptsEnabled,
        this.remainingClocks,
        this.colorizedGBPalettes,
        this.backgroundY,
        this.backgroundX,
        this.CPUStopped,
        this.audioClocksUntilNextEvent,
        this.audioClocksUntilNextEventCounter
    ];
};
var returnFromState = function(returnedFrom) {
    var index = 0;
    var state = returnedFrom.slice(0);
    this.ROM = this.toTypedArray(state[index++], "uint8");
    this.ROMBankEdge = Math.floor(this.ROM.length / 16384);
    this.inBootstrap = state[index++];
    this.registerA = state[index++];
    this.FZero = state[index++];
    this.FSubtract = state[index++];
    this.FHalfCarry = state[index++];
    this.FCarry = state[index++];
    this.registerB = state[index++];
    this.registerC = state[index++];
    this.registerD = state[index++];
    this.registerE = state[index++];
    this.registersHL = state[index++];
    this.stackPointer = state[index++];
    this.programCounter = state[index++];
    this.halt = state[index++];
    this.IME = state[index++];
    this.hdmaRunning = state[index++];
    this.CPUTicks = state[index++];
    this.doubleSpeedShifter = state[index++];
    this.memory = this.toTypedArray(state[index++], "uint8");
    this.MBCRam = this.toTypedArray(state[index++], "uint8");
    this.VRAM = this.toTypedArray(state[index++], "uint8");
    this.currVRAMBank = state[index++];
    this.GBCMemory = this.toTypedArray(state[index++], "uint8");
    this.MBC1Mode = state[index++];
    this.MBCRAMBanksEnabled = state[index++];
    this.currMBCRAMBank = state[index++];
    this.currMBCRAMBankPosition = state[index++];
    this.cGBC = state[index++];
    this.gbcRamBank = state[index++];
    this.gbcRamBankPosition = state[index++];
    this.ROMBank1offs = state[index++];
    this.currentROMBank = state[index++];
    this.cartridgeType = state[index++];
    this.name = state[index++];
    this.gameCode = state[index++];
    this.modeSTAT = state[index++];
    this.LYCMatchTriggerSTAT = state[index++];
    this.mode2TriggerSTAT = state[index++];
    this.mode1TriggerSTAT = state[index++];
    this.mode0TriggerSTAT = state[index++];
    this.LCDisOn = state[index++];
    this.gfxWindowCHRBankPosition = state[index++];
    this.gfxWindowDisplay = state[index++];
    this.gfxSpriteShow = state[index++];
    this.gfxSpriteNormalHeight = state[index++];
    this.gfxBackgroundCHRBankPosition = state[index++];
    this.gfxBackgroundBankOffset = state[index++];
    this.TIMAEnabled = state[index++];
    this.DIVTicks = state[index++];
    this.LCDTicks = state[index++];
    this.timerTicks = state[index++];
    this.TACClocker = state[index++];
    this.serialTimer = state[index++];
    this.serialShiftTimer = state[index++];
    this.serialShiftTimerAllocated = state[index++];
    this.IRQEnableDelay = state[index++];
    this.lastIteration = state[index++];
    this.cMBC1 = state[index++];
    this.cMBC2 = state[index++];
    this.cMBC3 = state[index++];
    this.cMBC5 = state[index++];
    this.cMBC7 = state[index++];
    this.cSRAM = state[index++];
    this.cMMMO1 = state[index++];
    this.cRUMBLE = state[index++];
    this.cCamera = state[index++];
    this.cTAMA5 = state[index++];
    this.cHuC3 = state[index++];
    this.cHuC1 = state[index++];
    this.drewBlank = state[index++];
    this.frameBuffer = this.toTypedArray(state[index++], "int32");
    this.bgEnabled = state[index++];
    this.BGPriorityEnabled = state[index++];
    this.channel1FrequencyTracker = state[index++];
    this.channel1FrequencyCounter = state[index++];
    this.channel1totalLength = state[index++];
    this.channel1envelopeVolume = state[index++];
    this.channel1envelopeType = state[index++];
    this.channel1envelopeSweeps = state[index++];
    this.channel1envelopeSweepsLast = state[index++];
    this.channel1consecutive = state[index++];
    this.channel1frequency = state[index++];
    this.channel1SweepFault = state[index++];
    this.channel1ShadowFrequency = state[index++];
    this.channel1timeSweep = state[index++];
    this.channel1lastTimeSweep = state[index++];
    this.channel1Swept = state[index++];
    this.channel1frequencySweepDivider = state[index++];
    this.channel1decreaseSweep = state[index++];
    this.channel2FrequencyTracker = state[index++];
    this.channel2FrequencyCounter = state[index++];
    this.channel2totalLength = state[index++];
    this.channel2envelopeVolume = state[index++];
    this.channel2envelopeType = state[index++];
    this.channel2envelopeSweeps = state[index++];
    this.channel2envelopeSweepsLast = state[index++];
    this.channel2consecutive = state[index++];
    this.channel2frequency = state[index++];
    this.channel3canPlay = state[index++];
    this.channel3totalLength = state[index++];
    this.channel3patternType = state[index++];
    this.channel3frequency = state[index++];
    this.channel3consecutive = state[index++];
    this.channel3PCM = this.toTypedArray(state[index++], "int8");
    this.channel4FrequencyPeriod = state[index++];
    this.channel4lastSampleLookup = state[index++];
    this.channel4totalLength = state[index++];
    this.channel4envelopeVolume = state[index++];
    this.channel4currentVolume = state[index++];
    this.channel4envelopeType = state[index++];
    this.channel4envelopeSweeps = state[index++];
    this.channel4envelopeSweepsLast = state[index++];
    this.channel4consecutive = state[index++];
    this.channel4BitRange = state[index++];
    this.soundMasterEnabled = state[index++];
    this.VinLeftChannelMasterVolume = state[index++];
    this.VinRightChannelMasterVolume = state[index++];
    this.leftChannel1 = state[index++];
    this.leftChannel2 = state[index++];
    this.leftChannel3 = state[index++];
    this.leftChannel4 = state[index++];
    this.rightChannel1 = state[index++];
    this.rightChannel2 = state[index++];
    this.rightChannel3 = state[index++];
    this.rightChannel4 = state[index++];
    this.channel1currentSampleLeft = state[index++];
    this.channel1currentSampleRight = state[index++];
    this.channel2currentSampleLeft = state[index++];
    this.channel2currentSampleRight = state[index++];
    this.channel3currentSampleLeft = state[index++];
    this.channel3currentSampleRight = state[index++];
    this.channel4currentSampleLeft = state[index++];
    this.channel4currentSampleRight = state[index++];
    this.channel1currentSampleLeftSecondary = state[index++];
    this.channel1currentSampleRightSecondary = state[index++];
    this.channel2currentSampleLeftSecondary = state[index++];
    this.channel2currentSampleRightSecondary = state[index++];
    this.channel3currentSampleLeftSecondary = state[index++];
    this.channel3currentSampleRightSecondary = state[index++];
    this.channel4currentSampleLeftSecondary = state[index++];
    this.channel4currentSampleRightSecondary = state[index++];
    this.channel1currentSampleLeftTrimary = state[index++];
    this.channel1currentSampleRightTrimary = state[index++];
    this.channel2currentSampleLeftTrimary = state[index++];
    this.channel2currentSampleRightTrimary = state[index++];
    this.mixerOutputCache = state[index++];
    this.channel1DutyTracker = state[index++];
    this.channel1CachedDuty = state[index++];
    this.channel2DutyTracker = state[index++];
    this.channel2CachedDuty = state[index++];
    this.channel1Enabled = state[index++];
    this.channel2Enabled = state[index++];
    this.channel3Enabled = state[index++];
    this.channel4Enabled = state[index++];
    this.sequencerClocks = state[index++];
    this.sequencePosition = state[index++];
    this.channel3Counter = state[index++];
    this.channel4Counter = state[index++];
    this.cachedChannel3Sample = state[index++];
    this.cachedChannel4Sample = state[index++];
    this.channel3FrequencyPeriod = state[index++];
    this.channel3lastSampleLookup = state[index++];
    this.actualScanLine = state[index++];
    this.lastUnrenderedLine = state[index++];
    this.queuedScanLines = state[index++];
    this.RTCisLatched = state[index++];
    this.latchedSeconds = state[index++];
    this.latchedMinutes = state[index++];
    this.latchedHours = state[index++];
    this.latchedLDays = state[index++];
    this.latchedHDays = state[index++];
    this.RTCSeconds = state[index++];
    this.RTCMinutes = state[index++];
    this.RTCHours = state[index++];
    this.RTCDays = state[index++];
    this.RTCDayOverFlow = state[index++];
    this.RTCHALT = state[index++];
    this.usedBootROM = state[index++];
    this.skipPCIncrement = state[index++];
    this.STATTracker = state[index++];
    this.gbcRamBankPositionECHO = state[index++];
    this.numRAMBanks = state[index++];
    this.windowY = state[index++];
    this.windowX = state[index++];
    this.gbcOBJRawPalette = this.toTypedArray(state[index++], "uint8");
    this.gbcBGRawPalette = this.toTypedArray(state[index++], "uint8");
    this.gbOBJPalette = this.toTypedArray(state[index++], "int32");
    this.gbBGPalette = this.toTypedArray(state[index++], "int32");
    this.gbcOBJPalette = this.toTypedArray(state[index++], "int32");
    this.gbcBGPalette = this.toTypedArray(state[index++], "int32");
    this.gbBGColorizedPalette = this.toTypedArray(state[index++], "int32");
    this.gbOBJColorizedPalette = this.toTypedArray(state[index++], "int32");
    this.cachedBGPaletteConversion = this.toTypedArray(state[index++], "int32");
    this.cachedOBJPaletteConversion = this.toTypedArray(state[index++], "int32");
    this.BGCHRBank1 = this.toTypedArray(state[index++], "uint8");
    this.BGCHRBank2 = this.toTypedArray(state[index++], "uint8");
    this.haltPostClocks = state[index++];
    this.interruptsRequested = state[index++];
    this.interruptsEnabled = state[index++];
    this.checkIRQMatching();
    this.remainingClocks = state[index++];
    this.colorizedGBPalettes = state[index++];
    this.backgroundY = state[index++];
    this.backgroundX = state[index++];
    this.CPUStopped = state[index++];
    this.audioClocksUntilNextEvent = state[index++];
    this.audioClocksUntilNextEventCounter = state[index];
    this.fromSaveState = true;
    this.TICKTable = this.toTypedArray(this.TICKTable, "uint8");
    this.SecondaryTICKTable = this.toTypedArray(this.SecondaryTICKTable, "uint8");
    this.initializeReferencesFromSaveState();
    this.memoryReadJumpCompile();
    this.memoryWriteJumpCompile();
    this.initLCD();
    this.initSound();
    this.noiseSampleTable = this.channel4BitRange == 32767 ? this.LSFR15Table : this.LSFR7Table;
    this.channel4VolumeShifter = this.channel4BitRange == 32767 ? 15 : 7;
};
module.exports.saveState = saveState;
module.exports.returnFromState = returnFromState;

},{}],"6mZPE":[function(require,module,exports) {
//Dump of the post-BOOT I/O register state (From gambatte):
module.exports = [
    15,
    0,
    124,
    255,
    0,
    0,
    0,
    248,
    255,
    255,
    255,
    255,
    255,
    255,
    255,
    1,
    128,
    191,
    243,
    255,
    191,
    255,
    63,
    0,
    255,
    191,
    127,
    255,
    159,
    255,
    191,
    255,
    255,
    0,
    0,
    191,
    119,
    243,
    241,
    255,
    255,
    255,
    255,
    255,
    255,
    255,
    255,
    255,
    0,
    255,
    0,
    255,
    0,
    255,
    0,
    255,
    0,
    255,
    0,
    255,
    0,
    255,
    0,
    255,
    145,
    128,
    0,
    0,
    0,
    0,
    0,
    252,
    0,
    0,
    0,
    0,
    255,
    126,
    255,
    254,
    255,
    255,
    255,
    255,
    255,
    255,
    62,
    255,
    255,
    255,
    255,
    255,
    255,
    255,
    255,
    255,
    255,
    255,
    255,
    255,
    255,
    255,
    255,
    255,
    192,
    255,
    193,
    0,
    254,
    255,
    255,
    255,
    248,
    255,
    0,
    0,
    0,
    143,
    0,
    0,
    255,
    255,
    255,
    255,
    255,
    255,
    255,
    255,
    206,
    237,
    102,
    102,
    204,
    13,
    0,
    11,
    3,
    115,
    0,
    131,
    0,
    12,
    0,
    13,
    0,
    8,
    17,
    31,
    136,
    137,
    0,
    14,
    220,
    204,
    110,
    230,
    221,
    221,
    217,
    153,
    187,
    187,
    103,
    99,
    110,
    14,
    236,
    204,
    221,
    220,
    153,
    159,
    187,
    185,
    51,
    62,
    69,
    236,
    82,
    250,
    8,
    183,
    7,
    93,
    1,
    253,
    192,
    255,
    8,
    252,
    0,
    229,
    11,
    248,
    194,
    206,
    244,
    249,
    15,
    127,
    69,
    109,
    61,
    254,
    70,
    151,
    51,
    94,
    8,
    239,
    241,
    255,
    134,
    131,
    36,
    116,
    18,
    252,
    0,
    159,
    180,
    183,
    6,
    213,
    208,
    122,
    0,
    158,
    4,
    95,
    65,
    47,
    29,
    119,
    54,
    117,
    129,
    170,
    112,
    58,
    152,
    209,
    113,
    2,
    77,
    1,
    193,
    255,
    13,
    0,
    211,
    5,
    249,
    0,
    11,
    0
];

},{}],"5NkRc":[function(require,module,exports) {
var OPCODE = [
    //NOP
    //#0x00:
    function(parentObj) {
    //Do Nothing...
    },
    //LD BC, nn
    //#0x01:
    function(parentObj) {
        parentObj.registerC = parentObj.memoryReader[parentObj.programCounter](parentObj, parentObj.programCounter);
        parentObj.registerB = parentObj.memoryRead(parentObj.programCounter + 1 & 65535);
        parentObj.programCounter = parentObj.programCounter + 2 & 65535;
    },
    //LD (BC), A
    //#0x02:
    function(parentObj) {
        parentObj.memoryWrite(parentObj.registerB << 8 | parentObj.registerC, parentObj.registerA);
    },
    //INC BC
    //#0x03:
    function(parentObj) {
        var temp_var = (parentObj.registerB << 8 | parentObj.registerC) + 1;
        parentObj.registerB = temp_var >> 8 & 255;
        parentObj.registerC = temp_var & 255;
    },
    //INC B
    //#0x04:
    function(parentObj) {
        parentObj.registerB = parentObj.registerB + 1 & 255;
        parentObj.FZero = parentObj.registerB == 0;
        parentObj.FHalfCarry = (parentObj.registerB & 15) == 0;
        parentObj.FSubtract = false;
    },
    //DEC B
    //#0x05:
    function(parentObj) {
        parentObj.registerB = parentObj.registerB - 1 & 255;
        parentObj.FZero = parentObj.registerB == 0;
        parentObj.FHalfCarry = (parentObj.registerB & 15) == 15;
        parentObj.FSubtract = true;
    },
    //LD B, n
    //#0x06:
    function(parentObj) {
        parentObj.registerB = parentObj.memoryReader[parentObj.programCounter](parentObj, parentObj.programCounter);
        parentObj.programCounter = parentObj.programCounter + 1 & 65535;
    },
    //RLCA
    //#0x07:
    function(parentObj) {
        parentObj.FCarry = parentObj.registerA > 127;
        parentObj.registerA = parentObj.registerA << 1 & 255 | parentObj.registerA >> 7;
        parentObj.FZero = parentObj.FSubtract = parentObj.FHalfCarry = false;
    },
    //LD (nn), SP
    //#0x08:
    function(parentObj) {
        var temp_var = parentObj.memoryRead(parentObj.programCounter + 1 & 65535) << 8 | parentObj.memoryReader[parentObj.programCounter](parentObj, parentObj.programCounter);
        parentObj.programCounter = parentObj.programCounter + 2 & 65535;
        parentObj.memoryWrite(temp_var, parentObj.stackPointer & 255);
        parentObj.memoryWrite(temp_var + 1 & 65535, parentObj.stackPointer >> 8);
    },
    //ADD HL, BC
    //#0x09:
    function(parentObj) {
        var dirtySum = parentObj.registersHL + (parentObj.registerB << 8 | parentObj.registerC);
        parentObj.FHalfCarry = (parentObj.registersHL & 4095) > (dirtySum & 4095);
        parentObj.FCarry = dirtySum > 65535;
        parentObj.registersHL = dirtySum & 65535;
        parentObj.FSubtract = false;
    },
    //LD A, (BC)
    //#0x0A:
    function(parentObj) {
        parentObj.registerA = parentObj.memoryRead(parentObj.registerB << 8 | parentObj.registerC);
    },
    //DEC BC
    //#0x0B:
    function(parentObj) {
        var temp_var = (parentObj.registerB << 8 | parentObj.registerC) - 1 & 65535;
        parentObj.registerB = temp_var >> 8;
        parentObj.registerC = temp_var & 255;
    },
    //INC C
    //#0x0C:
    function(parentObj) {
        parentObj.registerC = parentObj.registerC + 1 & 255;
        parentObj.FZero = parentObj.registerC == 0;
        parentObj.FHalfCarry = (parentObj.registerC & 15) == 0;
        parentObj.FSubtract = false;
    },
    //DEC C
    //#0x0D:
    function(parentObj) {
        parentObj.registerC = parentObj.registerC - 1 & 255;
        parentObj.FZero = parentObj.registerC == 0;
        parentObj.FHalfCarry = (parentObj.registerC & 15) == 15;
        parentObj.FSubtract = true;
    },
    //LD C, n
    //#0x0E:
    function(parentObj) {
        parentObj.registerC = parentObj.memoryReader[parentObj.programCounter](parentObj, parentObj.programCounter);
        parentObj.programCounter = parentObj.programCounter + 1 & 65535;
    },
    //RRCA
    //#0x0F:
    function(parentObj) {
        parentObj.registerA = parentObj.registerA >> 1 | (parentObj.registerA & 1) << 7;
        parentObj.FCarry = parentObj.registerA > 127;
        parentObj.FZero = parentObj.FSubtract = parentObj.FHalfCarry = false;
    },
    //STOP
    //#0x10:
    function(parentObj) {
        if (parentObj.cGBC) {
            if ((parentObj.memory[65357] & 1) == 1) {
                if (parentObj.memory[65357] > 127) {
                    // console.log("Going into single clock speed mode.", 0);
                    parentObj.doubleSpeedShifter = 0;
                    parentObj.memory[65357] &= 127; //Clear the double speed mode flag.
                } else {
                    // console.log("Going into double clock speed mode.", 0);
                    parentObj.doubleSpeedShifter = 1;
                    parentObj.memory[65357] |= 128; //Set the double speed mode flag.
                }
                parentObj.memory[65357] &= 254; //Reset the request bit.
            } else parentObj.handleSTOP();
        } else parentObj.handleSTOP();
    },
    //LD DE, nn
    //#0x11:
    function(parentObj) {
        parentObj.registerE = parentObj.memoryReader[parentObj.programCounter](parentObj, parentObj.programCounter);
        parentObj.registerD = parentObj.memoryRead(parentObj.programCounter + 1 & 65535);
        parentObj.programCounter = parentObj.programCounter + 2 & 65535;
    },
    //LD (DE), A
    //#0x12:
    function(parentObj) {
        parentObj.memoryWrite(parentObj.registerD << 8 | parentObj.registerE, parentObj.registerA);
    },
    //INC DE
    //#0x13:
    function(parentObj) {
        var temp_var = (parentObj.registerD << 8 | parentObj.registerE) + 1;
        parentObj.registerD = temp_var >> 8 & 255;
        parentObj.registerE = temp_var & 255;
    },
    //INC D
    //#0x14:
    function(parentObj) {
        parentObj.registerD = parentObj.registerD + 1 & 255;
        parentObj.FZero = parentObj.registerD == 0;
        parentObj.FHalfCarry = (parentObj.registerD & 15) == 0;
        parentObj.FSubtract = false;
    },
    //DEC D
    //#0x15:
    function(parentObj) {
        parentObj.registerD = parentObj.registerD - 1 & 255;
        parentObj.FZero = parentObj.registerD == 0;
        parentObj.FHalfCarry = (parentObj.registerD & 15) == 15;
        parentObj.FSubtract = true;
    },
    //LD D, n
    //#0x16:
    function(parentObj) {
        parentObj.registerD = parentObj.memoryReader[parentObj.programCounter](parentObj, parentObj.programCounter);
        parentObj.programCounter = parentObj.programCounter + 1 & 65535;
    },
    //RLA
    //#0x17:
    function(parentObj) {
        var carry_flag = parentObj.FCarry ? 1 : 0;
        parentObj.FCarry = parentObj.registerA > 127;
        parentObj.registerA = parentObj.registerA << 1 & 255 | carry_flag;
        parentObj.FZero = parentObj.FSubtract = parentObj.FHalfCarry = false;
    },
    //JR n
    //#0x18:
    function(parentObj) {
        parentObj.programCounter = parentObj.programCounter + (parentObj.memoryReader[parentObj.programCounter](parentObj, parentObj.programCounter) << 24 >> 24) + 1 & 65535;
    },
    //ADD HL, DE
    //#0x19:
    function(parentObj) {
        var dirtySum = parentObj.registersHL + (parentObj.registerD << 8 | parentObj.registerE);
        parentObj.FHalfCarry = (parentObj.registersHL & 4095) > (dirtySum & 4095);
        parentObj.FCarry = dirtySum > 65535;
        parentObj.registersHL = dirtySum & 65535;
        parentObj.FSubtract = false;
    },
    //LD A, (DE)
    //#0x1A:
    function(parentObj) {
        parentObj.registerA = parentObj.memoryRead(parentObj.registerD << 8 | parentObj.registerE);
    },
    //DEC DE
    //#0x1B:
    function(parentObj) {
        var temp_var = (parentObj.registerD << 8 | parentObj.registerE) - 1 & 65535;
        parentObj.registerD = temp_var >> 8;
        parentObj.registerE = temp_var & 255;
    },
    //INC E
    //#0x1C:
    function(parentObj) {
        parentObj.registerE = parentObj.registerE + 1 & 255;
        parentObj.FZero = parentObj.registerE == 0;
        parentObj.FHalfCarry = (parentObj.registerE & 15) == 0;
        parentObj.FSubtract = false;
    },
    //DEC E
    //#0x1D:
    function(parentObj) {
        parentObj.registerE = parentObj.registerE - 1 & 255;
        parentObj.FZero = parentObj.registerE == 0;
        parentObj.FHalfCarry = (parentObj.registerE & 15) == 15;
        parentObj.FSubtract = true;
    },
    //LD E, n
    //#0x1E:
    function(parentObj) {
        parentObj.registerE = parentObj.memoryReader[parentObj.programCounter](parentObj, parentObj.programCounter);
        parentObj.programCounter = parentObj.programCounter + 1 & 65535;
    },
    //RRA
    //#0x1F:
    function(parentObj) {
        var carry_flag = parentObj.FCarry ? 128 : 0;
        parentObj.FCarry = (parentObj.registerA & 1) == 1;
        parentObj.registerA = parentObj.registerA >> 1 | carry_flag;
        parentObj.FZero = parentObj.FSubtract = parentObj.FHalfCarry = false;
    },
    //JR NZ, n
    //#0x20:
    function(parentObj) {
        if (!parentObj.FZero) {
            parentObj.programCounter = parentObj.programCounter + (parentObj.memoryReader[parentObj.programCounter](parentObj, parentObj.programCounter) << 24 >> 24) + 1 & 65535;
            parentObj.CPUTicks += 4;
        } else parentObj.programCounter = parentObj.programCounter + 1 & 65535;
    },
    //LD HL, nn
    //#0x21:
    function(parentObj) {
        parentObj.registersHL = parentObj.memoryRead(parentObj.programCounter + 1 & 65535) << 8 | parentObj.memoryReader[parentObj.programCounter](parentObj, parentObj.programCounter);
        parentObj.programCounter = parentObj.programCounter + 2 & 65535;
    },
    //LDI (HL), A
    //#0x22:
    function(parentObj) {
        parentObj.memoryWriter[parentObj.registersHL](parentObj, parentObj.registersHL, parentObj.registerA);
        parentObj.registersHL = parentObj.registersHL + 1 & 65535;
    },
    //INC HL
    //#0x23:
    function(parentObj) {
        parentObj.registersHL = parentObj.registersHL + 1 & 65535;
    },
    //INC H
    //#0x24:
    function(parentObj) {
        var H = (parentObj.registersHL >> 8) + 1 & 255;
        parentObj.FZero = H == 0;
        parentObj.FHalfCarry = (H & 15) == 0;
        parentObj.FSubtract = false;
        parentObj.registersHL = H << 8 | parentObj.registersHL & 255;
    },
    //DEC H
    //#0x25:
    function(parentObj) {
        var H = (parentObj.registersHL >> 8) - 1 & 255;
        parentObj.FZero = H == 0;
        parentObj.FHalfCarry = (H & 15) == 15;
        parentObj.FSubtract = true;
        parentObj.registersHL = H << 8 | parentObj.registersHL & 255;
    },
    //LD H, n
    //#0x26:
    function(parentObj) {
        parentObj.registersHL = parentObj.memoryReader[parentObj.programCounter](parentObj, parentObj.programCounter) << 8 | parentObj.registersHL & 255;
        parentObj.programCounter = parentObj.programCounter + 1 & 65535;
    },
    //DAA
    //#0x27:
    function(parentObj) {
        if (!parentObj.FSubtract) {
            if (parentObj.FCarry || parentObj.registerA > 153) {
                parentObj.registerA = parentObj.registerA + 96 & 255;
                parentObj.FCarry = true;
            }
            if (parentObj.FHalfCarry || (parentObj.registerA & 15) > 9) {
                parentObj.registerA = parentObj.registerA + 6 & 255;
                parentObj.FHalfCarry = false;
            }
        } else if (parentObj.FCarry && parentObj.FHalfCarry) {
            parentObj.registerA = parentObj.registerA + 154 & 255;
            parentObj.FHalfCarry = false;
        } else if (parentObj.FCarry) parentObj.registerA = parentObj.registerA + 160 & 255;
        else if (parentObj.FHalfCarry) {
            parentObj.registerA = parentObj.registerA + 250 & 255;
            parentObj.FHalfCarry = false;
        }
        parentObj.FZero = parentObj.registerA == 0;
    },
    //JR Z, n
    //#0x28:
    function(parentObj) {
        if (parentObj.FZero) {
            parentObj.programCounter = parentObj.programCounter + (parentObj.memoryReader[parentObj.programCounter](parentObj, parentObj.programCounter) << 24 >> 24) + 1 & 65535;
            parentObj.CPUTicks += 4;
        } else parentObj.programCounter = parentObj.programCounter + 1 & 65535;
    },
    //ADD HL, HL
    //#0x29:
    function(parentObj) {
        parentObj.FHalfCarry = (parentObj.registersHL & 4095) > 2047;
        parentObj.FCarry = parentObj.registersHL > 32767;
        parentObj.registersHL = parentObj.registersHL << 1 & 65535;
        parentObj.FSubtract = false;
    },
    //LDI A, (HL)
    //#0x2A:
    function(parentObj) {
        parentObj.registerA = parentObj.memoryReader[parentObj.registersHL](parentObj, parentObj.registersHL);
        parentObj.registersHL = parentObj.registersHL + 1 & 65535;
    },
    //DEC HL
    //#0x2B:
    function(parentObj) {
        parentObj.registersHL = parentObj.registersHL - 1 & 65535;
    },
    //INC L
    //#0x2C:
    function(parentObj) {
        var L = parentObj.registersHL + 1 & 255;
        parentObj.FZero = L == 0;
        parentObj.FHalfCarry = (L & 15) == 0;
        parentObj.FSubtract = false;
        parentObj.registersHL = parentObj.registersHL & 65280 | L;
    },
    //DEC L
    //#0x2D:
    function(parentObj) {
        var L = parentObj.registersHL - 1 & 255;
        parentObj.FZero = L == 0;
        parentObj.FHalfCarry = (L & 15) == 15;
        parentObj.FSubtract = true;
        parentObj.registersHL = parentObj.registersHL & 65280 | L;
    },
    //LD L, n
    //#0x2E:
    function(parentObj) {
        parentObj.registersHL = parentObj.registersHL & 65280 | parentObj.memoryReader[parentObj.programCounter](parentObj, parentObj.programCounter);
        parentObj.programCounter = parentObj.programCounter + 1 & 65535;
    },
    //CPL
    //#0x2F:
    function(parentObj) {
        parentObj.registerA ^= 255;
        parentObj.FSubtract = parentObj.FHalfCarry = true;
    },
    //JR NC, n
    //#0x30:
    function(parentObj) {
        if (!parentObj.FCarry) {
            parentObj.programCounter = parentObj.programCounter + (parentObj.memoryReader[parentObj.programCounter](parentObj, parentObj.programCounter) << 24 >> 24) + 1 & 65535;
            parentObj.CPUTicks += 4;
        } else parentObj.programCounter = parentObj.programCounter + 1 & 65535;
    },
    //LD SP, nn
    //#0x31:
    function(parentObj) {
        parentObj.stackPointer = parentObj.memoryRead(parentObj.programCounter + 1 & 65535) << 8 | parentObj.memoryReader[parentObj.programCounter](parentObj, parentObj.programCounter);
        parentObj.programCounter = parentObj.programCounter + 2 & 65535;
    },
    //LDD (HL), A
    //#0x32:
    function(parentObj) {
        parentObj.memoryWriter[parentObj.registersHL](parentObj, parentObj.registersHL, parentObj.registerA);
        parentObj.registersHL = parentObj.registersHL - 1 & 65535;
    },
    //INC SP
    //#0x33:
    function(parentObj) {
        parentObj.stackPointer = parentObj.stackPointer + 1 & 65535;
    },
    //INC (HL)
    //#0x34:
    function(parentObj) {
        var temp_var = parentObj.memoryReader[parentObj.registersHL](parentObj, parentObj.registersHL) + 1 & 255;
        parentObj.FZero = temp_var == 0;
        parentObj.FHalfCarry = (temp_var & 15) == 0;
        parentObj.FSubtract = false;
        parentObj.memoryWriter[parentObj.registersHL](parentObj, parentObj.registersHL, temp_var);
    },
    //DEC (HL)
    //#0x35:
    function(parentObj) {
        var temp_var = parentObj.memoryReader[parentObj.registersHL](parentObj, parentObj.registersHL) - 1 & 255;
        parentObj.FZero = temp_var == 0;
        parentObj.FHalfCarry = (temp_var & 15) == 15;
        parentObj.FSubtract = true;
        parentObj.memoryWriter[parentObj.registersHL](parentObj, parentObj.registersHL, temp_var);
    },
    //LD (HL), n
    //#0x36:
    function(parentObj) {
        parentObj.memoryWriter[parentObj.registersHL](parentObj, parentObj.registersHL, parentObj.memoryReader[parentObj.programCounter](parentObj, parentObj.programCounter));
        parentObj.programCounter = parentObj.programCounter + 1 & 65535;
    },
    //SCF
    //#0x37:
    function(parentObj) {
        parentObj.FCarry = true;
        parentObj.FSubtract = parentObj.FHalfCarry = false;
    },
    //JR C, n
    //#0x38:
    function(parentObj) {
        if (parentObj.FCarry) {
            parentObj.programCounter = parentObj.programCounter + (parentObj.memoryReader[parentObj.programCounter](parentObj, parentObj.programCounter) << 24 >> 24) + 1 & 65535;
            parentObj.CPUTicks += 4;
        } else parentObj.programCounter = parentObj.programCounter + 1 & 65535;
    },
    //ADD HL, SP
    //#0x39:
    function(parentObj) {
        var dirtySum = parentObj.registersHL + parentObj.stackPointer;
        parentObj.FHalfCarry = (parentObj.registersHL & 4095) > (dirtySum & 4095);
        parentObj.FCarry = dirtySum > 65535;
        parentObj.registersHL = dirtySum & 65535;
        parentObj.FSubtract = false;
    },
    //LDD A, (HL)
    //#0x3A:
    function(parentObj) {
        parentObj.registerA = parentObj.memoryReader[parentObj.registersHL](parentObj, parentObj.registersHL);
        parentObj.registersHL = parentObj.registersHL - 1 & 65535;
    },
    //DEC SP
    //#0x3B:
    function(parentObj) {
        parentObj.stackPointer = parentObj.stackPointer - 1 & 65535;
    },
    //INC A
    //#0x3C:
    function(parentObj) {
        parentObj.registerA = parentObj.registerA + 1 & 255;
        parentObj.FZero = parentObj.registerA == 0;
        parentObj.FHalfCarry = (parentObj.registerA & 15) == 0;
        parentObj.FSubtract = false;
    },
    //DEC A
    //#0x3D:
    function(parentObj) {
        parentObj.registerA = parentObj.registerA - 1 & 255;
        parentObj.FZero = parentObj.registerA == 0;
        parentObj.FHalfCarry = (parentObj.registerA & 15) == 15;
        parentObj.FSubtract = true;
    },
    //LD A, n
    //#0x3E:
    function(parentObj) {
        parentObj.registerA = parentObj.memoryReader[parentObj.programCounter](parentObj, parentObj.programCounter);
        parentObj.programCounter = parentObj.programCounter + 1 & 65535;
    },
    //CCF
    //#0x3F:
    function(parentObj) {
        parentObj.FCarry = !parentObj.FCarry;
        parentObj.FSubtract = parentObj.FHalfCarry = false;
    },
    //LD B, B
    //#0x40:
    function(parentObj) {
    //Do nothing...
    },
    //LD B, C
    //#0x41:
    function(parentObj) {
        parentObj.registerB = parentObj.registerC;
    },
    //LD B, D
    //#0x42:
    function(parentObj) {
        parentObj.registerB = parentObj.registerD;
    },
    //LD B, E
    //#0x43:
    function(parentObj) {
        parentObj.registerB = parentObj.registerE;
    },
    //LD B, H
    //#0x44:
    function(parentObj) {
        parentObj.registerB = parentObj.registersHL >> 8;
    },
    //LD B, L
    //#0x45:
    function(parentObj) {
        parentObj.registerB = parentObj.registersHL & 255;
    },
    //LD B, (HL)
    //#0x46:
    function(parentObj) {
        parentObj.registerB = parentObj.memoryReader[parentObj.registersHL](parentObj, parentObj.registersHL);
    },
    //LD B, A
    //#0x47:
    function(parentObj) {
        parentObj.registerB = parentObj.registerA;
    },
    //LD C, B
    //#0x48:
    function(parentObj) {
        parentObj.registerC = parentObj.registerB;
    },
    //LD C, C
    //#0x49:
    function(parentObj) {
    //Do nothing...
    },
    //LD C, D
    //#0x4A:
    function(parentObj) {
        parentObj.registerC = parentObj.registerD;
    },
    //LD C, E
    //#0x4B:
    function(parentObj) {
        parentObj.registerC = parentObj.registerE;
    },
    //LD C, H
    //#0x4C:
    function(parentObj) {
        parentObj.registerC = parentObj.registersHL >> 8;
    },
    //LD C, L
    //#0x4D:
    function(parentObj) {
        parentObj.registerC = parentObj.registersHL & 255;
    },
    //LD C, (HL)
    //#0x4E:
    function(parentObj) {
        parentObj.registerC = parentObj.memoryReader[parentObj.registersHL](parentObj, parentObj.registersHL);
    },
    //LD C, A
    //#0x4F:
    function(parentObj) {
        parentObj.registerC = parentObj.registerA;
    },
    //LD D, B
    //#0x50:
    function(parentObj) {
        parentObj.registerD = parentObj.registerB;
    },
    //LD D, C
    //#0x51:
    function(parentObj) {
        parentObj.registerD = parentObj.registerC;
    },
    //LD D, D
    //#0x52:
    function(parentObj) {
    //Do nothing...
    },
    //LD D, E
    //#0x53:
    function(parentObj) {
        parentObj.registerD = parentObj.registerE;
    },
    //LD D, H
    //#0x54:
    function(parentObj) {
        parentObj.registerD = parentObj.registersHL >> 8;
    },
    //LD D, L
    //#0x55:
    function(parentObj) {
        parentObj.registerD = parentObj.registersHL & 255;
    },
    //LD D, (HL)
    //#0x56:
    function(parentObj) {
        parentObj.registerD = parentObj.memoryReader[parentObj.registersHL](parentObj, parentObj.registersHL);
    },
    //LD D, A
    //#0x57:
    function(parentObj) {
        parentObj.registerD = parentObj.registerA;
    },
    //LD E, B
    //#0x58:
    function(parentObj) {
        parentObj.registerE = parentObj.registerB;
    },
    //LD E, C
    //#0x59:
    function(parentObj) {
        parentObj.registerE = parentObj.registerC;
    },
    //LD E, D
    //#0x5A:
    function(parentObj) {
        parentObj.registerE = parentObj.registerD;
    },
    //LD E, E
    //#0x5B:
    function(parentObj) {
    //Do nothing...
    },
    //LD E, H
    //#0x5C:
    function(parentObj) {
        parentObj.registerE = parentObj.registersHL >> 8;
    },
    //LD E, L
    //#0x5D:
    function(parentObj) {
        parentObj.registerE = parentObj.registersHL & 255;
    },
    //LD E, (HL)
    //#0x5E:
    function(parentObj) {
        parentObj.registerE = parentObj.memoryReader[parentObj.registersHL](parentObj, parentObj.registersHL);
    },
    //LD E, A
    //#0x5F:
    function(parentObj) {
        parentObj.registerE = parentObj.registerA;
    },
    //LD H, B
    //#0x60:
    function(parentObj) {
        parentObj.registersHL = parentObj.registerB << 8 | parentObj.registersHL & 255;
    },
    //LD H, C
    //#0x61:
    function(parentObj) {
        parentObj.registersHL = parentObj.registerC << 8 | parentObj.registersHL & 255;
    },
    //LD H, D
    //#0x62:
    function(parentObj) {
        parentObj.registersHL = parentObj.registerD << 8 | parentObj.registersHL & 255;
    },
    //LD H, E
    //#0x63:
    function(parentObj) {
        parentObj.registersHL = parentObj.registerE << 8 | parentObj.registersHL & 255;
    },
    //LD H, H
    //#0x64:
    function(parentObj) {
    //Do nothing...
    },
    //LD H, L
    //#0x65:
    function(parentObj) {
        parentObj.registersHL = (parentObj.registersHL & 255) * 257;
    },
    //LD H, (HL)
    //#0x66:
    function(parentObj) {
        parentObj.registersHL = parentObj.memoryReader[parentObj.registersHL](parentObj, parentObj.registersHL) << 8 | parentObj.registersHL & 255;
    },
    //LD H, A
    //#0x67:
    function(parentObj) {
        parentObj.registersHL = parentObj.registerA << 8 | parentObj.registersHL & 255;
    },
    //LD L, B
    //#0x68:
    function(parentObj) {
        parentObj.registersHL = parentObj.registersHL & 65280 | parentObj.registerB;
    },
    //LD L, C
    //#0x69:
    function(parentObj) {
        parentObj.registersHL = parentObj.registersHL & 65280 | parentObj.registerC;
    },
    //LD L, D
    //#0x6A:
    function(parentObj) {
        parentObj.registersHL = parentObj.registersHL & 65280 | parentObj.registerD;
    },
    //LD L, E
    //#0x6B:
    function(parentObj) {
        parentObj.registersHL = parentObj.registersHL & 65280 | parentObj.registerE;
    },
    //LD L, H
    //#0x6C:
    function(parentObj) {
        parentObj.registersHL = parentObj.registersHL & 65280 | parentObj.registersHL >> 8;
    },
    //LD L, L
    //#0x6D:
    function(parentObj) {
    //Do nothing...
    },
    //LD L, (HL)
    //#0x6E:
    function(parentObj) {
        parentObj.registersHL = parentObj.registersHL & 65280 | parentObj.memoryReader[parentObj.registersHL](parentObj, parentObj.registersHL);
    },
    //LD L, A
    //#0x6F:
    function(parentObj) {
        parentObj.registersHL = parentObj.registersHL & 65280 | parentObj.registerA;
    },
    //LD (HL), B
    //#0x70:
    function(parentObj) {
        parentObj.memoryWriter[parentObj.registersHL](parentObj, parentObj.registersHL, parentObj.registerB);
    },
    //LD (HL), C
    //#0x71:
    function(parentObj) {
        parentObj.memoryWriter[parentObj.registersHL](parentObj, parentObj.registersHL, parentObj.registerC);
    },
    //LD (HL), D
    //#0x72:
    function(parentObj) {
        parentObj.memoryWriter[parentObj.registersHL](parentObj, parentObj.registersHL, parentObj.registerD);
    },
    //LD (HL), E
    //#0x73:
    function(parentObj) {
        parentObj.memoryWriter[parentObj.registersHL](parentObj, parentObj.registersHL, parentObj.registerE);
    },
    //LD (HL), H
    //#0x74:
    function(parentObj) {
        parentObj.memoryWriter[parentObj.registersHL](parentObj, parentObj.registersHL, parentObj.registersHL >> 8);
    },
    //LD (HL), L
    //#0x75:
    function(parentObj) {
        parentObj.memoryWriter[parentObj.registersHL](parentObj, parentObj.registersHL, parentObj.registersHL & 255);
    },
    //HALT
    //#0x76:
    function(parentObj) {
        //See if there's already an IRQ match:
        if ((parentObj.interruptsEnabled & parentObj.interruptsRequested & 31) > 0) {
            if (!parentObj.cGBC && !parentObj.usedBootROM) //HALT bug in the DMG CPU model (Program Counter fails to increment for one instruction after HALT):
            parentObj.skipPCIncrement = true;
            else //CGB gets around the HALT PC bug by doubling the hidden NOP.
            parentObj.CPUTicks += 4;
        } else //CPU is stalled until the next IRQ match:
        parentObj.calculateHALTPeriod();
    },
    //LD (HL), A
    //#0x77:
    function(parentObj) {
        parentObj.memoryWriter[parentObj.registersHL](parentObj, parentObj.registersHL, parentObj.registerA);
    },
    //LD A, B
    //#0x78:
    function(parentObj) {
        parentObj.registerA = parentObj.registerB;
    },
    //LD A, C
    //#0x79:
    function(parentObj) {
        parentObj.registerA = parentObj.registerC;
    },
    //LD A, D
    //#0x7A:
    function(parentObj) {
        parentObj.registerA = parentObj.registerD;
    },
    //LD A, E
    //#0x7B:
    function(parentObj) {
        parentObj.registerA = parentObj.registerE;
    },
    //LD A, H
    //#0x7C:
    function(parentObj) {
        parentObj.registerA = parentObj.registersHL >> 8;
    },
    //LD A, L
    //#0x7D:
    function(parentObj) {
        parentObj.registerA = parentObj.registersHL & 255;
    },
    //LD, A, (HL)
    //#0x7E:
    function(parentObj) {
        parentObj.registerA = parentObj.memoryReader[parentObj.registersHL](parentObj, parentObj.registersHL);
    },
    //LD A, A
    //#0x7F:
    function(parentObj) {
    //Do Nothing...
    },
    //ADD A, B
    //#0x80:
    function(parentObj) {
        var dirtySum = parentObj.registerA + parentObj.registerB;
        parentObj.FHalfCarry = (dirtySum & 15) < (parentObj.registerA & 15);
        parentObj.FCarry = dirtySum > 255;
        parentObj.registerA = dirtySum & 255;
        parentObj.FZero = parentObj.registerA == 0;
        parentObj.FSubtract = false;
    },
    //ADD A, C
    //#0x81:
    function(parentObj) {
        var dirtySum = parentObj.registerA + parentObj.registerC;
        parentObj.FHalfCarry = (dirtySum & 15) < (parentObj.registerA & 15);
        parentObj.FCarry = dirtySum > 255;
        parentObj.registerA = dirtySum & 255;
        parentObj.FZero = parentObj.registerA == 0;
        parentObj.FSubtract = false;
    },
    //ADD A, D
    //#0x82:
    function(parentObj) {
        var dirtySum = parentObj.registerA + parentObj.registerD;
        parentObj.FHalfCarry = (dirtySum & 15) < (parentObj.registerA & 15);
        parentObj.FCarry = dirtySum > 255;
        parentObj.registerA = dirtySum & 255;
        parentObj.FZero = parentObj.registerA == 0;
        parentObj.FSubtract = false;
    },
    //ADD A, E
    //#0x83:
    function(parentObj) {
        var dirtySum = parentObj.registerA + parentObj.registerE;
        parentObj.FHalfCarry = (dirtySum & 15) < (parentObj.registerA & 15);
        parentObj.FCarry = dirtySum > 255;
        parentObj.registerA = dirtySum & 255;
        parentObj.FZero = parentObj.registerA == 0;
        parentObj.FSubtract = false;
    },
    //ADD A, H
    //#0x84:
    function(parentObj) {
        var dirtySum = parentObj.registerA + (parentObj.registersHL >> 8);
        parentObj.FHalfCarry = (dirtySum & 15) < (parentObj.registerA & 15);
        parentObj.FCarry = dirtySum > 255;
        parentObj.registerA = dirtySum & 255;
        parentObj.FZero = parentObj.registerA == 0;
        parentObj.FSubtract = false;
    },
    //ADD A, L
    //#0x85:
    function(parentObj) {
        var dirtySum = parentObj.registerA + (parentObj.registersHL & 255);
        parentObj.FHalfCarry = (dirtySum & 15) < (parentObj.registerA & 15);
        parentObj.FCarry = dirtySum > 255;
        parentObj.registerA = dirtySum & 255;
        parentObj.FZero = parentObj.registerA == 0;
        parentObj.FSubtract = false;
    },
    //ADD A, (HL)
    //#0x86:
    function(parentObj) {
        var dirtySum = parentObj.registerA + parentObj.memoryReader[parentObj.registersHL](parentObj, parentObj.registersHL);
        parentObj.FHalfCarry = (dirtySum & 15) < (parentObj.registerA & 15);
        parentObj.FCarry = dirtySum > 255;
        parentObj.registerA = dirtySum & 255;
        parentObj.FZero = parentObj.registerA == 0;
        parentObj.FSubtract = false;
    },
    //ADD A, A
    //#0x87:
    function(parentObj) {
        parentObj.FHalfCarry = (parentObj.registerA & 8) == 8;
        parentObj.FCarry = parentObj.registerA > 127;
        parentObj.registerA = parentObj.registerA << 1 & 255;
        parentObj.FZero = parentObj.registerA == 0;
        parentObj.FSubtract = false;
    },
    //ADC A, B
    //#0x88:
    function(parentObj) {
        var dirtySum = parentObj.registerA + parentObj.registerB + (parentObj.FCarry ? 1 : 0);
        parentObj.FHalfCarry = (parentObj.registerA & 15) + (parentObj.registerB & 15) + (parentObj.FCarry ? 1 : 0) > 15;
        parentObj.FCarry = dirtySum > 255;
        parentObj.registerA = dirtySum & 255;
        parentObj.FZero = parentObj.registerA == 0;
        parentObj.FSubtract = false;
    },
    //ADC A, C
    //#0x89:
    function(parentObj) {
        var dirtySum = parentObj.registerA + parentObj.registerC + (parentObj.FCarry ? 1 : 0);
        parentObj.FHalfCarry = (parentObj.registerA & 15) + (parentObj.registerC & 15) + (parentObj.FCarry ? 1 : 0) > 15;
        parentObj.FCarry = dirtySum > 255;
        parentObj.registerA = dirtySum & 255;
        parentObj.FZero = parentObj.registerA == 0;
        parentObj.FSubtract = false;
    },
    //ADC A, D
    //#0x8A:
    function(parentObj) {
        var dirtySum = parentObj.registerA + parentObj.registerD + (parentObj.FCarry ? 1 : 0);
        parentObj.FHalfCarry = (parentObj.registerA & 15) + (parentObj.registerD & 15) + (parentObj.FCarry ? 1 : 0) > 15;
        parentObj.FCarry = dirtySum > 255;
        parentObj.registerA = dirtySum & 255;
        parentObj.FZero = parentObj.registerA == 0;
        parentObj.FSubtract = false;
    },
    //ADC A, E
    //#0x8B:
    function(parentObj) {
        var dirtySum = parentObj.registerA + parentObj.registerE + (parentObj.FCarry ? 1 : 0);
        parentObj.FHalfCarry = (parentObj.registerA & 15) + (parentObj.registerE & 15) + (parentObj.FCarry ? 1 : 0) > 15;
        parentObj.FCarry = dirtySum > 255;
        parentObj.registerA = dirtySum & 255;
        parentObj.FZero = parentObj.registerA == 0;
        parentObj.FSubtract = false;
    },
    //ADC A, H
    //#0x8C:
    function(parentObj) {
        var tempValue = parentObj.registersHL >> 8;
        var dirtySum = parentObj.registerA + tempValue + (parentObj.FCarry ? 1 : 0);
        parentObj.FHalfCarry = (parentObj.registerA & 15) + (tempValue & 15) + (parentObj.FCarry ? 1 : 0) > 15;
        parentObj.FCarry = dirtySum > 255;
        parentObj.registerA = dirtySum & 255;
        parentObj.FZero = parentObj.registerA == 0;
        parentObj.FSubtract = false;
    },
    //ADC A, L
    //#0x8D:
    function(parentObj) {
        var tempValue = parentObj.registersHL & 255;
        var dirtySum = parentObj.registerA + tempValue + (parentObj.FCarry ? 1 : 0);
        parentObj.FHalfCarry = (parentObj.registerA & 15) + (tempValue & 15) + (parentObj.FCarry ? 1 : 0) > 15;
        parentObj.FCarry = dirtySum > 255;
        parentObj.registerA = dirtySum & 255;
        parentObj.FZero = parentObj.registerA == 0;
        parentObj.FSubtract = false;
    },
    //ADC A, (HL)
    //#0x8E:
    function(parentObj) {
        var tempValue = parentObj.memoryReader[parentObj.registersHL](parentObj, parentObj.registersHL);
        var dirtySum = parentObj.registerA + tempValue + (parentObj.FCarry ? 1 : 0);
        parentObj.FHalfCarry = (parentObj.registerA & 15) + (tempValue & 15) + (parentObj.FCarry ? 1 : 0) > 15;
        parentObj.FCarry = dirtySum > 255;
        parentObj.registerA = dirtySum & 255;
        parentObj.FZero = parentObj.registerA == 0;
        parentObj.FSubtract = false;
    },
    //ADC A, A
    //#0x8F:
    function(parentObj) {
        //shift left register A one bit for some ops here as an optimization:
        var dirtySum = parentObj.registerA << 1 | (parentObj.FCarry ? 1 : 0);
        parentObj.FHalfCarry = (parentObj.registerA << 1 & 30 | (parentObj.FCarry ? 1 : 0)) > 15;
        parentObj.FCarry = dirtySum > 255;
        parentObj.registerA = dirtySum & 255;
        parentObj.FZero = parentObj.registerA == 0;
        parentObj.FSubtract = false;
    },
    //SUB A, B
    //#0x90:
    function(parentObj) {
        var dirtySum = parentObj.registerA - parentObj.registerB;
        parentObj.FHalfCarry = (parentObj.registerA & 15) < (dirtySum & 15);
        parentObj.FCarry = dirtySum < 0;
        parentObj.registerA = dirtySum & 255;
        parentObj.FZero = dirtySum == 0;
        parentObj.FSubtract = true;
    },
    //SUB A, C
    //#0x91:
    function(parentObj) {
        var dirtySum = parentObj.registerA - parentObj.registerC;
        parentObj.FHalfCarry = (parentObj.registerA & 15) < (dirtySum & 15);
        parentObj.FCarry = dirtySum < 0;
        parentObj.registerA = dirtySum & 255;
        parentObj.FZero = dirtySum == 0;
        parentObj.FSubtract = true;
    },
    //SUB A, D
    //#0x92:
    function(parentObj) {
        var dirtySum = parentObj.registerA - parentObj.registerD;
        parentObj.FHalfCarry = (parentObj.registerA & 15) < (dirtySum & 15);
        parentObj.FCarry = dirtySum < 0;
        parentObj.registerA = dirtySum & 255;
        parentObj.FZero = dirtySum == 0;
        parentObj.FSubtract = true;
    },
    //SUB A, E
    //#0x93:
    function(parentObj) {
        var dirtySum = parentObj.registerA - parentObj.registerE;
        parentObj.FHalfCarry = (parentObj.registerA & 15) < (dirtySum & 15);
        parentObj.FCarry = dirtySum < 0;
        parentObj.registerA = dirtySum & 255;
        parentObj.FZero = dirtySum == 0;
        parentObj.FSubtract = true;
    },
    //SUB A, H
    //#0x94:
    function(parentObj) {
        var dirtySum = parentObj.registerA - (parentObj.registersHL >> 8);
        parentObj.FHalfCarry = (parentObj.registerA & 15) < (dirtySum & 15);
        parentObj.FCarry = dirtySum < 0;
        parentObj.registerA = dirtySum & 255;
        parentObj.FZero = dirtySum == 0;
        parentObj.FSubtract = true;
    },
    //SUB A, L
    //#0x95:
    function(parentObj) {
        var dirtySum = parentObj.registerA - (parentObj.registersHL & 255);
        parentObj.FHalfCarry = (parentObj.registerA & 15) < (dirtySum & 15);
        parentObj.FCarry = dirtySum < 0;
        parentObj.registerA = dirtySum & 255;
        parentObj.FZero = dirtySum == 0;
        parentObj.FSubtract = true;
    },
    //SUB A, (HL)
    //#0x96:
    function(parentObj) {
        var dirtySum = parentObj.registerA - parentObj.memoryReader[parentObj.registersHL](parentObj, parentObj.registersHL);
        parentObj.FHalfCarry = (parentObj.registerA & 15) < (dirtySum & 15);
        parentObj.FCarry = dirtySum < 0;
        parentObj.registerA = dirtySum & 255;
        parentObj.FZero = dirtySum == 0;
        parentObj.FSubtract = true;
    },
    //SUB A, A
    //#0x97:
    function(parentObj) {
        //number - same number == 0
        parentObj.registerA = 0;
        parentObj.FHalfCarry = parentObj.FCarry = false;
        parentObj.FZero = parentObj.FSubtract = true;
    },
    //SBC A, B
    //#0x98:
    function(parentObj) {
        var dirtySum = parentObj.registerA - parentObj.registerB - (parentObj.FCarry ? 1 : 0);
        parentObj.FHalfCarry = (parentObj.registerA & 15) - (parentObj.registerB & 15) - (parentObj.FCarry ? 1 : 0) < 0;
        parentObj.FCarry = dirtySum < 0;
        parentObj.registerA = dirtySum & 255;
        parentObj.FZero = parentObj.registerA == 0;
        parentObj.FSubtract = true;
    },
    //SBC A, C
    //#0x99:
    function(parentObj) {
        var dirtySum = parentObj.registerA - parentObj.registerC - (parentObj.FCarry ? 1 : 0);
        parentObj.FHalfCarry = (parentObj.registerA & 15) - (parentObj.registerC & 15) - (parentObj.FCarry ? 1 : 0) < 0;
        parentObj.FCarry = dirtySum < 0;
        parentObj.registerA = dirtySum & 255;
        parentObj.FZero = parentObj.registerA == 0;
        parentObj.FSubtract = true;
    },
    //SBC A, D
    //#0x9A:
    function(parentObj) {
        var dirtySum = parentObj.registerA - parentObj.registerD - (parentObj.FCarry ? 1 : 0);
        parentObj.FHalfCarry = (parentObj.registerA & 15) - (parentObj.registerD & 15) - (parentObj.FCarry ? 1 : 0) < 0;
        parentObj.FCarry = dirtySum < 0;
        parentObj.registerA = dirtySum & 255;
        parentObj.FZero = parentObj.registerA == 0;
        parentObj.FSubtract = true;
    },
    //SBC A, E
    //#0x9B:
    function(parentObj) {
        var dirtySum = parentObj.registerA - parentObj.registerE - (parentObj.FCarry ? 1 : 0);
        parentObj.FHalfCarry = (parentObj.registerA & 15) - (parentObj.registerE & 15) - (parentObj.FCarry ? 1 : 0) < 0;
        parentObj.FCarry = dirtySum < 0;
        parentObj.registerA = dirtySum & 255;
        parentObj.FZero = parentObj.registerA == 0;
        parentObj.FSubtract = true;
    },
    //SBC A, H
    //#0x9C:
    function(parentObj) {
        var temp_var = parentObj.registersHL >> 8;
        var dirtySum = parentObj.registerA - temp_var - (parentObj.FCarry ? 1 : 0);
        parentObj.FHalfCarry = (parentObj.registerA & 15) - (temp_var & 15) - (parentObj.FCarry ? 1 : 0) < 0;
        parentObj.FCarry = dirtySum < 0;
        parentObj.registerA = dirtySum & 255;
        parentObj.FZero = parentObj.registerA == 0;
        parentObj.FSubtract = true;
    },
    //SBC A, L
    //#0x9D:
    function(parentObj) {
        var dirtySum = parentObj.registerA - (parentObj.registersHL & 255) - (parentObj.FCarry ? 1 : 0);
        parentObj.FHalfCarry = (parentObj.registerA & 15) - (parentObj.registersHL & 15) - (parentObj.FCarry ? 1 : 0) < 0;
        parentObj.FCarry = dirtySum < 0;
        parentObj.registerA = dirtySum & 255;
        parentObj.FZero = parentObj.registerA == 0;
        parentObj.FSubtract = true;
    },
    //SBC A, (HL)
    //#0x9E:
    function(parentObj) {
        var temp_var = parentObj.memoryReader[parentObj.registersHL](parentObj, parentObj.registersHL);
        var dirtySum = parentObj.registerA - temp_var - (parentObj.FCarry ? 1 : 0);
        parentObj.FHalfCarry = (parentObj.registerA & 15) - (temp_var & 15) - (parentObj.FCarry ? 1 : 0) < 0;
        parentObj.FCarry = dirtySum < 0;
        parentObj.registerA = dirtySum & 255;
        parentObj.FZero = parentObj.registerA == 0;
        parentObj.FSubtract = true;
    },
    //SBC A, A
    //#0x9F:
    function(parentObj) {
        //Optimized SBC A:
        if (parentObj.FCarry) {
            parentObj.FZero = false;
            parentObj.FSubtract = parentObj.FHalfCarry = parentObj.FCarry = true;
            parentObj.registerA = 255;
        } else {
            parentObj.FHalfCarry = parentObj.FCarry = false;
            parentObj.FSubtract = parentObj.FZero = true;
            parentObj.registerA = 0;
        }
    },
    //AND B
    //#0xA0:
    function(parentObj) {
        parentObj.registerA &= parentObj.registerB;
        parentObj.FZero = parentObj.registerA == 0;
        parentObj.FHalfCarry = true;
        parentObj.FSubtract = parentObj.FCarry = false;
    },
    //AND C
    //#0xA1:
    function(parentObj) {
        parentObj.registerA &= parentObj.registerC;
        parentObj.FZero = parentObj.registerA == 0;
        parentObj.FHalfCarry = true;
        parentObj.FSubtract = parentObj.FCarry = false;
    },
    //AND D
    //#0xA2:
    function(parentObj) {
        parentObj.registerA &= parentObj.registerD;
        parentObj.FZero = parentObj.registerA == 0;
        parentObj.FHalfCarry = true;
        parentObj.FSubtract = parentObj.FCarry = false;
    },
    //AND E
    //#0xA3:
    function(parentObj) {
        parentObj.registerA &= parentObj.registerE;
        parentObj.FZero = parentObj.registerA == 0;
        parentObj.FHalfCarry = true;
        parentObj.FSubtract = parentObj.FCarry = false;
    },
    //AND H
    //#0xA4:
    function(parentObj) {
        parentObj.registerA &= parentObj.registersHL >> 8;
        parentObj.FZero = parentObj.registerA == 0;
        parentObj.FHalfCarry = true;
        parentObj.FSubtract = parentObj.FCarry = false;
    },
    //AND L
    //#0xA5:
    function(parentObj) {
        parentObj.registerA &= parentObj.registersHL;
        parentObj.FZero = parentObj.registerA == 0;
        parentObj.FHalfCarry = true;
        parentObj.FSubtract = parentObj.FCarry = false;
    },
    //AND (HL)
    //#0xA6:
    function(parentObj) {
        parentObj.registerA &= parentObj.memoryReader[parentObj.registersHL](parentObj, parentObj.registersHL);
        parentObj.FZero = parentObj.registerA == 0;
        parentObj.FHalfCarry = true;
        parentObj.FSubtract = parentObj.FCarry = false;
    },
    //AND A
    //#0xA7:
    function(parentObj) {
        //number & same number = same number
        parentObj.FZero = parentObj.registerA == 0;
        parentObj.FHalfCarry = true;
        parentObj.FSubtract = parentObj.FCarry = false;
    },
    //XOR B
    //#0xA8:
    function(parentObj) {
        parentObj.registerA ^= parentObj.registerB;
        parentObj.FZero = parentObj.registerA == 0;
        parentObj.FSubtract = parentObj.FHalfCarry = parentObj.FCarry = false;
    },
    //XOR C
    //#0xA9:
    function(parentObj) {
        parentObj.registerA ^= parentObj.registerC;
        parentObj.FZero = parentObj.registerA == 0;
        parentObj.FSubtract = parentObj.FHalfCarry = parentObj.FCarry = false;
    },
    //XOR D
    //#0xAA:
    function(parentObj) {
        parentObj.registerA ^= parentObj.registerD;
        parentObj.FZero = parentObj.registerA == 0;
        parentObj.FSubtract = parentObj.FHalfCarry = parentObj.FCarry = false;
    },
    //XOR E
    //#0xAB:
    function(parentObj) {
        parentObj.registerA ^= parentObj.registerE;
        parentObj.FZero = parentObj.registerA == 0;
        parentObj.FSubtract = parentObj.FHalfCarry = parentObj.FCarry = false;
    },
    //XOR H
    //#0xAC:
    function(parentObj) {
        parentObj.registerA ^= parentObj.registersHL >> 8;
        parentObj.FZero = parentObj.registerA == 0;
        parentObj.FSubtract = parentObj.FHalfCarry = parentObj.FCarry = false;
    },
    //XOR L
    //#0xAD:
    function(parentObj) {
        parentObj.registerA ^= parentObj.registersHL & 255;
        parentObj.FZero = parentObj.registerA == 0;
        parentObj.FSubtract = parentObj.FHalfCarry = parentObj.FCarry = false;
    },
    //XOR (HL)
    //#0xAE:
    function(parentObj) {
        parentObj.registerA ^= parentObj.memoryReader[parentObj.registersHL](parentObj, parentObj.registersHL);
        parentObj.FZero = parentObj.registerA == 0;
        parentObj.FSubtract = parentObj.FHalfCarry = parentObj.FCarry = false;
    },
    //XOR A
    //#0xAF:
    function(parentObj) {
        //number ^ same number == 0
        parentObj.registerA = 0;
        parentObj.FZero = true;
        parentObj.FSubtract = parentObj.FHalfCarry = parentObj.FCarry = false;
    },
    //OR B
    //#0xB0:
    function(parentObj) {
        parentObj.registerA |= parentObj.registerB;
        parentObj.FZero = parentObj.registerA == 0;
        parentObj.FSubtract = parentObj.FCarry = parentObj.FHalfCarry = false;
    },
    //OR C
    //#0xB1:
    function(parentObj) {
        parentObj.registerA |= parentObj.registerC;
        parentObj.FZero = parentObj.registerA == 0;
        parentObj.FSubtract = parentObj.FCarry = parentObj.FHalfCarry = false;
    },
    //OR D
    //#0xB2:
    function(parentObj) {
        parentObj.registerA |= parentObj.registerD;
        parentObj.FZero = parentObj.registerA == 0;
        parentObj.FSubtract = parentObj.FCarry = parentObj.FHalfCarry = false;
    },
    //OR E
    //#0xB3:
    function(parentObj) {
        parentObj.registerA |= parentObj.registerE;
        parentObj.FZero = parentObj.registerA == 0;
        parentObj.FSubtract = parentObj.FCarry = parentObj.FHalfCarry = false;
    },
    //OR H
    //#0xB4:
    function(parentObj) {
        parentObj.registerA |= parentObj.registersHL >> 8;
        parentObj.FZero = parentObj.registerA == 0;
        parentObj.FSubtract = parentObj.FCarry = parentObj.FHalfCarry = false;
    },
    //OR L
    //#0xB5:
    function(parentObj) {
        parentObj.registerA |= parentObj.registersHL & 255;
        parentObj.FZero = parentObj.registerA == 0;
        parentObj.FSubtract = parentObj.FCarry = parentObj.FHalfCarry = false;
    },
    //OR (HL)
    //#0xB6:
    function(parentObj) {
        parentObj.registerA |= parentObj.memoryReader[parentObj.registersHL](parentObj, parentObj.registersHL);
        parentObj.FZero = parentObj.registerA == 0;
        parentObj.FSubtract = parentObj.FCarry = parentObj.FHalfCarry = false;
    },
    //OR A
    //#0xB7:
    function(parentObj) {
        //number | same number == same number
        parentObj.FZero = parentObj.registerA == 0;
        parentObj.FSubtract = parentObj.FCarry = parentObj.FHalfCarry = false;
    },
    //CP B
    //#0xB8:
    function(parentObj) {
        var dirtySum = parentObj.registerA - parentObj.registerB;
        parentObj.FHalfCarry = (dirtySum & 15) > (parentObj.registerA & 15);
        parentObj.FCarry = dirtySum < 0;
        parentObj.FZero = dirtySum == 0;
        parentObj.FSubtract = true;
    },
    //CP C
    //#0xB9:
    function(parentObj) {
        var dirtySum = parentObj.registerA - parentObj.registerC;
        parentObj.FHalfCarry = (dirtySum & 15) > (parentObj.registerA & 15);
        parentObj.FCarry = dirtySum < 0;
        parentObj.FZero = dirtySum == 0;
        parentObj.FSubtract = true;
    },
    //CP D
    //#0xBA:
    function(parentObj) {
        var dirtySum = parentObj.registerA - parentObj.registerD;
        parentObj.FHalfCarry = (dirtySum & 15) > (parentObj.registerA & 15);
        parentObj.FCarry = dirtySum < 0;
        parentObj.FZero = dirtySum == 0;
        parentObj.FSubtract = true;
    },
    //CP E
    //#0xBB:
    function(parentObj) {
        var dirtySum = parentObj.registerA - parentObj.registerE;
        parentObj.FHalfCarry = (dirtySum & 15) > (parentObj.registerA & 15);
        parentObj.FCarry = dirtySum < 0;
        parentObj.FZero = dirtySum == 0;
        parentObj.FSubtract = true;
    },
    //CP H
    //#0xBC:
    function(parentObj) {
        var dirtySum = parentObj.registerA - (parentObj.registersHL >> 8);
        parentObj.FHalfCarry = (dirtySum & 15) > (parentObj.registerA & 15);
        parentObj.FCarry = dirtySum < 0;
        parentObj.FZero = dirtySum == 0;
        parentObj.FSubtract = true;
    },
    //CP L
    //#0xBD:
    function(parentObj) {
        var dirtySum = parentObj.registerA - (parentObj.registersHL & 255);
        parentObj.FHalfCarry = (dirtySum & 15) > (parentObj.registerA & 15);
        parentObj.FCarry = dirtySum < 0;
        parentObj.FZero = dirtySum == 0;
        parentObj.FSubtract = true;
    },
    //CP (HL)
    //#0xBE:
    function(parentObj) {
        var dirtySum = parentObj.registerA - parentObj.memoryReader[parentObj.registersHL](parentObj, parentObj.registersHL);
        parentObj.FHalfCarry = (dirtySum & 15) > (parentObj.registerA & 15);
        parentObj.FCarry = dirtySum < 0;
        parentObj.FZero = dirtySum == 0;
        parentObj.FSubtract = true;
    },
    //CP A
    //#0xBF:
    function(parentObj) {
        parentObj.FHalfCarry = parentObj.FCarry = false;
        parentObj.FZero = parentObj.FSubtract = true;
    },
    //RET !FZ
    //#0xC0:
    function(parentObj) {
        if (!parentObj.FZero) {
            parentObj.programCounter = parentObj.memoryRead(parentObj.stackPointer + 1 & 65535) << 8 | parentObj.memoryReader[parentObj.stackPointer](parentObj, parentObj.stackPointer);
            parentObj.stackPointer = parentObj.stackPointer + 2 & 65535;
            parentObj.CPUTicks += 12;
        }
    },
    //POP BC
    //#0xC1:
    function(parentObj) {
        parentObj.registerC = parentObj.memoryReader[parentObj.stackPointer](parentObj, parentObj.stackPointer);
        parentObj.registerB = parentObj.memoryRead(parentObj.stackPointer + 1 & 65535);
        parentObj.stackPointer = parentObj.stackPointer + 2 & 65535;
    },
    //JP !FZ, nn
    //#0xC2:
    function(parentObj) {
        if (!parentObj.FZero) {
            parentObj.programCounter = parentObj.memoryRead(parentObj.programCounter + 1 & 65535) << 8 | parentObj.memoryReader[parentObj.programCounter](parentObj, parentObj.programCounter);
            parentObj.CPUTicks += 4;
        } else parentObj.programCounter = parentObj.programCounter + 2 & 65535;
    },
    //JP nn
    //#0xC3:
    function(parentObj) {
        parentObj.programCounter = parentObj.memoryRead(parentObj.programCounter + 1 & 65535) << 8 | parentObj.memoryReader[parentObj.programCounter](parentObj, parentObj.programCounter);
    },
    //CALL !FZ, nn
    //#0xC4:
    function(parentObj) {
        if (!parentObj.FZero) {
            var temp_pc = parentObj.memoryRead(parentObj.programCounter + 1 & 65535) << 8 | parentObj.memoryReader[parentObj.programCounter](parentObj, parentObj.programCounter);
            parentObj.programCounter = parentObj.programCounter + 2 & 65535;
            parentObj.stackPointer = parentObj.stackPointer - 1 & 65535;
            parentObj.memoryWriter[parentObj.stackPointer](parentObj, parentObj.stackPointer, parentObj.programCounter >> 8);
            parentObj.stackPointer = parentObj.stackPointer - 1 & 65535;
            parentObj.memoryWriter[parentObj.stackPointer](parentObj, parentObj.stackPointer, parentObj.programCounter & 255);
            parentObj.programCounter = temp_pc;
            parentObj.CPUTicks += 12;
        } else parentObj.programCounter = parentObj.programCounter + 2 & 65535;
    },
    //PUSH BC
    //#0xC5:
    function(parentObj) {
        parentObj.stackPointer = parentObj.stackPointer - 1 & 65535;
        parentObj.memoryWriter[parentObj.stackPointer](parentObj, parentObj.stackPointer, parentObj.registerB);
        parentObj.stackPointer = parentObj.stackPointer - 1 & 65535;
        parentObj.memoryWriter[parentObj.stackPointer](parentObj, parentObj.stackPointer, parentObj.registerC);
    },
    //ADD, n
    //#0xC6:
    function(parentObj) {
        var dirtySum = parentObj.registerA + parentObj.memoryReader[parentObj.programCounter](parentObj, parentObj.programCounter);
        parentObj.programCounter = parentObj.programCounter + 1 & 65535;
        parentObj.FHalfCarry = (dirtySum & 15) < (parentObj.registerA & 15);
        parentObj.FCarry = dirtySum > 255;
        parentObj.registerA = dirtySum & 255;
        parentObj.FZero = parentObj.registerA == 0;
        parentObj.FSubtract = false;
    },
    //RST 0
    //#0xC7:
    function(parentObj) {
        parentObj.stackPointer = parentObj.stackPointer - 1 & 65535;
        parentObj.memoryWriter[parentObj.stackPointer](parentObj, parentObj.stackPointer, parentObj.programCounter >> 8);
        parentObj.stackPointer = parentObj.stackPointer - 1 & 65535;
        parentObj.memoryWriter[parentObj.stackPointer](parentObj, parentObj.stackPointer, parentObj.programCounter & 255);
        parentObj.programCounter = 0;
    },
    //RET FZ
    //#0xC8:
    function(parentObj) {
        if (parentObj.FZero) {
            parentObj.programCounter = parentObj.memoryRead(parentObj.stackPointer + 1 & 65535) << 8 | parentObj.memoryReader[parentObj.stackPointer](parentObj, parentObj.stackPointer);
            parentObj.stackPointer = parentObj.stackPointer + 2 & 65535;
            parentObj.CPUTicks += 12;
        }
    },
    //RET
    //#0xC9:
    function(parentObj) {
        parentObj.programCounter = parentObj.memoryRead(parentObj.stackPointer + 1 & 65535) << 8 | parentObj.memoryReader[parentObj.stackPointer](parentObj, parentObj.stackPointer);
        parentObj.stackPointer = parentObj.stackPointer + 2 & 65535;
    },
    //JP FZ, nn
    //#0xCA:
    function(parentObj) {
        if (parentObj.FZero) {
            parentObj.programCounter = parentObj.memoryRead(parentObj.programCounter + 1 & 65535) << 8 | parentObj.memoryReader[parentObj.programCounter](parentObj, parentObj.programCounter);
            parentObj.CPUTicks += 4;
        } else parentObj.programCounter = parentObj.programCounter + 2 & 65535;
    },
    //Secondary OP Code Set:
    //#0xCB:
    function(parentObj) {
        var opcode = parentObj.memoryReader[parentObj.programCounter](parentObj, parentObj.programCounter);
        //Increment the program counter to the next instruction:
        parentObj.programCounter = parentObj.programCounter + 1 & 65535;
        //Get how many CPU cycles the current 0xCBXX op code counts for:
        parentObj.CPUTicks += parentObj.SecondaryTICKTable[opcode];
        //Execute secondary OP codes for the 0xCB OP code call.
        parentObj.CBOPCODE[opcode](parentObj);
    },
    //CALL FZ, nn
    //#0xCC:
    function(parentObj) {
        if (parentObj.FZero) {
            var temp_pc = parentObj.memoryRead(parentObj.programCounter + 1 & 65535) << 8 | parentObj.memoryReader[parentObj.programCounter](parentObj, parentObj.programCounter);
            parentObj.programCounter = parentObj.programCounter + 2 & 65535;
            parentObj.stackPointer = parentObj.stackPointer - 1 & 65535;
            parentObj.memoryWriter[parentObj.stackPointer](parentObj, parentObj.stackPointer, parentObj.programCounter >> 8);
            parentObj.stackPointer = parentObj.stackPointer - 1 & 65535;
            parentObj.memoryWriter[parentObj.stackPointer](parentObj, parentObj.stackPointer, parentObj.programCounter & 255);
            parentObj.programCounter = temp_pc;
            parentObj.CPUTicks += 12;
        } else parentObj.programCounter = parentObj.programCounter + 2 & 65535;
    },
    //CALL nn
    //#0xCD:
    function(parentObj) {
        var temp_pc = parentObj.memoryRead(parentObj.programCounter + 1 & 65535) << 8 | parentObj.memoryReader[parentObj.programCounter](parentObj, parentObj.programCounter);
        parentObj.programCounter = parentObj.programCounter + 2 & 65535;
        parentObj.stackPointer = parentObj.stackPointer - 1 & 65535;
        parentObj.memoryWriter[parentObj.stackPointer](parentObj, parentObj.stackPointer, parentObj.programCounter >> 8);
        parentObj.stackPointer = parentObj.stackPointer - 1 & 65535;
        parentObj.memoryWriter[parentObj.stackPointer](parentObj, parentObj.stackPointer, parentObj.programCounter & 255);
        parentObj.programCounter = temp_pc;
    },
    //ADC A, n
    //#0xCE:
    function(parentObj) {
        var tempValue = parentObj.memoryReader[parentObj.programCounter](parentObj, parentObj.programCounter);
        parentObj.programCounter = parentObj.programCounter + 1 & 65535;
        var dirtySum = parentObj.registerA + tempValue + (parentObj.FCarry ? 1 : 0);
        parentObj.FHalfCarry = (parentObj.registerA & 15) + (tempValue & 15) + (parentObj.FCarry ? 1 : 0) > 15;
        parentObj.FCarry = dirtySum > 255;
        parentObj.registerA = dirtySum & 255;
        parentObj.FZero = parentObj.registerA == 0;
        parentObj.FSubtract = false;
    },
    //RST 0x8
    //#0xCF:
    function(parentObj) {
        parentObj.stackPointer = parentObj.stackPointer - 1 & 65535;
        parentObj.memoryWriter[parentObj.stackPointer](parentObj, parentObj.stackPointer, parentObj.programCounter >> 8);
        parentObj.stackPointer = parentObj.stackPointer - 1 & 65535;
        parentObj.memoryWriter[parentObj.stackPointer](parentObj, parentObj.stackPointer, parentObj.programCounter & 255);
        parentObj.programCounter = 8;
    },
    //RET !FC
    //#0xD0:
    function(parentObj) {
        if (!parentObj.FCarry) {
            parentObj.programCounter = parentObj.memoryRead(parentObj.stackPointer + 1 & 65535) << 8 | parentObj.memoryReader[parentObj.stackPointer](parentObj, parentObj.stackPointer);
            parentObj.stackPointer = parentObj.stackPointer + 2 & 65535;
            parentObj.CPUTicks += 12;
        }
    },
    //POP DE
    //#0xD1:
    function(parentObj) {
        parentObj.registerE = parentObj.memoryReader[parentObj.stackPointer](parentObj, parentObj.stackPointer);
        parentObj.registerD = parentObj.memoryRead(parentObj.stackPointer + 1 & 65535);
        parentObj.stackPointer = parentObj.stackPointer + 2 & 65535;
    },
    //JP !FC, nn
    //#0xD2:
    function(parentObj) {
        if (!parentObj.FCarry) {
            parentObj.programCounter = parentObj.memoryRead(parentObj.programCounter + 1 & 65535) << 8 | parentObj.memoryReader[parentObj.programCounter](parentObj, parentObj.programCounter);
            parentObj.CPUTicks += 4;
        } else parentObj.programCounter = parentObj.programCounter + 2 & 65535;
    },
    //0xD3 - Illegal
    //#0xD3:
    function(parentObj) {
        console.log("Illegal op code 0xD3 called, pausing emulation.");
    //pause();
    },
    //CALL !FC, nn
    //#0xD4:
    function(parentObj) {
        if (!parentObj.FCarry) {
            var temp_pc = parentObj.memoryRead(parentObj.programCounter + 1 & 65535) << 8 | parentObj.memoryReader[parentObj.programCounter](parentObj, parentObj.programCounter);
            parentObj.programCounter = parentObj.programCounter + 2 & 65535;
            parentObj.stackPointer = parentObj.stackPointer - 1 & 65535;
            parentObj.memoryWriter[parentObj.stackPointer](parentObj, parentObj.stackPointer, parentObj.programCounter >> 8);
            parentObj.stackPointer = parentObj.stackPointer - 1 & 65535;
            parentObj.memoryWriter[parentObj.stackPointer](parentObj, parentObj.stackPointer, parentObj.programCounter & 255);
            parentObj.programCounter = temp_pc;
            parentObj.CPUTicks += 12;
        } else parentObj.programCounter = parentObj.programCounter + 2 & 65535;
    },
    //PUSH DE
    //#0xD5:
    function(parentObj) {
        parentObj.stackPointer = parentObj.stackPointer - 1 & 65535;
        parentObj.memoryWriter[parentObj.stackPointer](parentObj, parentObj.stackPointer, parentObj.registerD);
        parentObj.stackPointer = parentObj.stackPointer - 1 & 65535;
        parentObj.memoryWriter[parentObj.stackPointer](parentObj, parentObj.stackPointer, parentObj.registerE);
    },
    //SUB A, n
    //#0xD6:
    function(parentObj) {
        var dirtySum = parentObj.registerA - parentObj.memoryReader[parentObj.programCounter](parentObj, parentObj.programCounter);
        parentObj.programCounter = parentObj.programCounter + 1 & 65535;
        parentObj.FHalfCarry = (parentObj.registerA & 15) < (dirtySum & 15);
        parentObj.FCarry = dirtySum < 0;
        parentObj.registerA = dirtySum & 255;
        parentObj.FZero = dirtySum == 0;
        parentObj.FSubtract = true;
    },
    //RST 0x10
    //#0xD7:
    function(parentObj) {
        parentObj.stackPointer = parentObj.stackPointer - 1 & 65535;
        parentObj.memoryWriter[parentObj.stackPointer](parentObj, parentObj.stackPointer, parentObj.programCounter >> 8);
        parentObj.stackPointer = parentObj.stackPointer - 1 & 65535;
        parentObj.memoryWriter[parentObj.stackPointer](parentObj, parentObj.stackPointer, parentObj.programCounter & 255);
        parentObj.programCounter = 16;
    },
    //RET FC
    //#0xD8:
    function(parentObj) {
        if (parentObj.FCarry) {
            parentObj.programCounter = parentObj.memoryRead(parentObj.stackPointer + 1 & 65535) << 8 | parentObj.memoryReader[parentObj.stackPointer](parentObj, parentObj.stackPointer);
            parentObj.stackPointer = parentObj.stackPointer + 2 & 65535;
            parentObj.CPUTicks += 12;
        }
    },
    //RETI
    //#0xD9:
    function(parentObj) {
        parentObj.programCounter = parentObj.memoryRead(parentObj.stackPointer + 1 & 65535) << 8 | parentObj.memoryReader[parentObj.stackPointer](parentObj, parentObj.stackPointer);
        parentObj.stackPointer = parentObj.stackPointer + 2 & 65535;
        //Immediate for HALT:
        parentObj.IRQEnableDelay = parentObj.IRQEnableDelay == 2 || parentObj.memoryReader[parentObj.programCounter](parentObj, parentObj.programCounter) == 118 ? 1 : 2;
    },
    //JP FC, nn
    //#0xDA:
    function(parentObj) {
        if (parentObj.FCarry) {
            parentObj.programCounter = parentObj.memoryRead(parentObj.programCounter + 1 & 65535) << 8 | parentObj.memoryReader[parentObj.programCounter](parentObj, parentObj.programCounter);
            parentObj.CPUTicks += 4;
        } else parentObj.programCounter = parentObj.programCounter + 2 & 65535;
    },
    //0xDB - Illegal
    //#0xDB:
    function(parentObj) {
        console.log("Illegal op code 0xDB called, pausing emulation.");
    //pause();
    },
    //CALL FC, nn
    //#0xDC:
    function(parentObj) {
        if (parentObj.FCarry) {
            var temp_pc = parentObj.memoryRead(parentObj.programCounter + 1 & 65535) << 8 | parentObj.memoryReader[parentObj.programCounter](parentObj, parentObj.programCounter);
            parentObj.programCounter = parentObj.programCounter + 2 & 65535;
            parentObj.stackPointer = parentObj.stackPointer - 1 & 65535;
            parentObj.memoryWriter[parentObj.stackPointer](parentObj, parentObj.stackPointer, parentObj.programCounter >> 8);
            parentObj.stackPointer = parentObj.stackPointer - 1 & 65535;
            parentObj.memoryWriter[parentObj.stackPointer](parentObj, parentObj.stackPointer, parentObj.programCounter & 255);
            parentObj.programCounter = temp_pc;
            parentObj.CPUTicks += 12;
        } else parentObj.programCounter = parentObj.programCounter + 2 & 65535;
    },
    //0xDD - Illegal
    //#0xDD:
    function(parentObj) {
        console.log("Illegal op code 0xDD called, pausing emulation.");
    //pause();
    },
    //SBC A, n
    //#0xDE:
    function(parentObj) {
        var temp_var = parentObj.memoryReader[parentObj.programCounter](parentObj, parentObj.programCounter);
        parentObj.programCounter = parentObj.programCounter + 1 & 65535;
        var dirtySum = parentObj.registerA - temp_var - (parentObj.FCarry ? 1 : 0);
        parentObj.FHalfCarry = (parentObj.registerA & 15) - (temp_var & 15) - (parentObj.FCarry ? 1 : 0) < 0;
        parentObj.FCarry = dirtySum < 0;
        parentObj.registerA = dirtySum & 255;
        parentObj.FZero = parentObj.registerA == 0;
        parentObj.FSubtract = true;
    },
    //RST 0x18
    //#0xDF:
    function(parentObj) {
        parentObj.stackPointer = parentObj.stackPointer - 1 & 65535;
        parentObj.memoryWriter[parentObj.stackPointer](parentObj, parentObj.stackPointer, parentObj.programCounter >> 8);
        parentObj.stackPointer = parentObj.stackPointer - 1 & 65535;
        parentObj.memoryWriter[parentObj.stackPointer](parentObj, parentObj.stackPointer, parentObj.programCounter & 255);
        parentObj.programCounter = 24;
    },
    //LDH (n), A
    //#0xE0:
    function(parentObj) {
        parentObj.memoryHighWrite(parentObj.memoryReader[parentObj.programCounter](parentObj, parentObj.programCounter), parentObj.registerA);
        parentObj.programCounter = parentObj.programCounter + 1 & 65535;
    },
    //POP HL
    //#0xE1:
    function(parentObj) {
        parentObj.registersHL = parentObj.memoryRead(parentObj.stackPointer + 1 & 65535) << 8 | parentObj.memoryReader[parentObj.stackPointer](parentObj, parentObj.stackPointer);
        parentObj.stackPointer = parentObj.stackPointer + 2 & 65535;
    },
    //LD (0xFF00 + C), A
    //#0xE2:
    function(parentObj) {
        parentObj.memoryHighWriter[parentObj.registerC](parentObj, parentObj.registerC, parentObj.registerA);
    },
    //0xE3 - Illegal
    //#0xE3:
    function(parentObj) {
        console.log("Illegal op code 0xE3 called, pausing emulation.", 2);
    //pause();
    },
    //0xE4 - Illegal
    //#0xE4:
    function(parentObj) {
        console.log("Illegal op code 0xE4 called, pausing emulation.", 2);
    //pause();
    },
    //PUSH HL
    //#0xE5:
    function(parentObj) {
        parentObj.stackPointer = parentObj.stackPointer - 1 & 65535;
        parentObj.memoryWriter[parentObj.stackPointer](parentObj, parentObj.stackPointer, parentObj.registersHL >> 8);
        parentObj.stackPointer = parentObj.stackPointer - 1 & 65535;
        parentObj.memoryWriter[parentObj.stackPointer](parentObj, parentObj.stackPointer, parentObj.registersHL & 255);
    },
    //AND n
    //#0xE6:
    function(parentObj) {
        parentObj.registerA &= parentObj.memoryReader[parentObj.programCounter](parentObj, parentObj.programCounter);
        parentObj.programCounter = parentObj.programCounter + 1 & 65535;
        parentObj.FZero = parentObj.registerA == 0;
        parentObj.FHalfCarry = true;
        parentObj.FSubtract = parentObj.FCarry = false;
    },
    //RST 0x20
    //#0xE7:
    function(parentObj) {
        parentObj.stackPointer = parentObj.stackPointer - 1 & 65535;
        parentObj.memoryWriter[parentObj.stackPointer](parentObj, parentObj.stackPointer, parentObj.programCounter >> 8);
        parentObj.stackPointer = parentObj.stackPointer - 1 & 65535;
        parentObj.memoryWriter[parentObj.stackPointer](parentObj, parentObj.stackPointer, parentObj.programCounter & 255);
        parentObj.programCounter = 32;
    },
    //ADD SP, n
    //#0xE8:
    function(parentObj) {
        var temp_value2 = parentObj.memoryReader[parentObj.programCounter](parentObj, parentObj.programCounter) << 24 >> 24;
        parentObj.programCounter = parentObj.programCounter + 1 & 65535;
        var temp_value = parentObj.stackPointer + temp_value2 & 65535;
        temp_value2 = parentObj.stackPointer ^ temp_value2 ^ temp_value;
        parentObj.stackPointer = temp_value;
        parentObj.FCarry = (temp_value2 & 256) == 256;
        parentObj.FHalfCarry = (temp_value2 & 16) == 16;
        parentObj.FZero = parentObj.FSubtract = false;
    },
    //JP, (HL)
    //#0xE9:
    function(parentObj) {
        parentObj.programCounter = parentObj.registersHL;
    },
    //LD n, A
    //#0xEA:
    function(parentObj) {
        parentObj.memoryWrite(parentObj.memoryRead(parentObj.programCounter + 1 & 65535) << 8 | parentObj.memoryReader[parentObj.programCounter](parentObj, parentObj.programCounter), parentObj.registerA);
        parentObj.programCounter = parentObj.programCounter + 2 & 65535;
    },
    //0xEB - Illegal
    //#0xEB:
    function(parentObj) {
        console.log("Illegal op code 0xEB called, pausing emulation.", 2);
    //pause();
    },
    //0xEC - Illegal
    //#0xEC:
    function(parentObj) {
        console.log("Illegal op code 0xEC called, pausing emulation.", 2);
    //pause();
    },
    //0xED - Illegal
    //#0xED:
    function(parentObj) {
        console.log("Illegal op code 0xED called, pausing emulation.", 2);
    //pause();
    },
    //XOR n
    //#0xEE:
    function(parentObj) {
        parentObj.registerA ^= parentObj.memoryReader[parentObj.programCounter](parentObj, parentObj.programCounter);
        parentObj.programCounter = parentObj.programCounter + 1 & 65535;
        parentObj.FZero = parentObj.registerA == 0;
        parentObj.FSubtract = parentObj.FHalfCarry = parentObj.FCarry = false;
    },
    //RST 0x28
    //#0xEF:
    function(parentObj) {
        parentObj.stackPointer = parentObj.stackPointer - 1 & 65535;
        parentObj.memoryWriter[parentObj.stackPointer](parentObj, parentObj.stackPointer, parentObj.programCounter >> 8);
        parentObj.stackPointer = parentObj.stackPointer - 1 & 65535;
        parentObj.memoryWriter[parentObj.stackPointer](parentObj, parentObj.stackPointer, parentObj.programCounter & 255);
        parentObj.programCounter = 40;
    },
    //LDH A, (n)
    //#0xF0:
    function(parentObj) {
        parentObj.registerA = parentObj.memoryHighRead(parentObj.memoryReader[parentObj.programCounter](parentObj, parentObj.programCounter));
        parentObj.programCounter = parentObj.programCounter + 1 & 65535;
    },
    //POP AF
    //#0xF1:
    function(parentObj) {
        var temp_var = parentObj.memoryReader[parentObj.stackPointer](parentObj, parentObj.stackPointer);
        parentObj.FZero = temp_var > 127;
        parentObj.FSubtract = (temp_var & 64) == 64;
        parentObj.FHalfCarry = (temp_var & 32) == 32;
        parentObj.FCarry = (temp_var & 16) == 16;
        parentObj.registerA = parentObj.memoryRead(parentObj.stackPointer + 1 & 65535);
        parentObj.stackPointer = parentObj.stackPointer + 2 & 65535;
    },
    //LD A, (0xFF00 + C)
    //#0xF2:
    function(parentObj) {
        parentObj.registerA = parentObj.memoryHighReader[parentObj.registerC](parentObj, parentObj.registerC);
    },
    //DI
    //#0xF3:
    function(parentObj) {
        parentObj.IME = false;
        parentObj.IRQEnableDelay = 0;
    },
    //0xF4 - Illegal
    //#0xF4:
    function(parentObj) {
        console.log("Illegal op code 0xF4 called, pausing emulation.", 2);
    //pause();
    },
    //PUSH AF
    //#0xF5:
    function(parentObj) {
        parentObj.stackPointer = parentObj.stackPointer - 1 & 65535;
        parentObj.memoryWriter[parentObj.stackPointer](parentObj, parentObj.stackPointer, parentObj.registerA);
        parentObj.stackPointer = parentObj.stackPointer - 1 & 65535;
        parentObj.memoryWriter[parentObj.stackPointer](parentObj, parentObj.stackPointer, (parentObj.FZero ? 128 : 0) | (parentObj.FSubtract ? 64 : 0) | (parentObj.FHalfCarry ? 32 : 0) | (parentObj.FCarry ? 16 : 0));
    },
    //OR n
    //#0xF6:
    function(parentObj) {
        parentObj.registerA |= parentObj.memoryReader[parentObj.programCounter](parentObj, parentObj.programCounter);
        parentObj.FZero = parentObj.registerA == 0;
        parentObj.programCounter = parentObj.programCounter + 1 & 65535;
        parentObj.FSubtract = parentObj.FCarry = parentObj.FHalfCarry = false;
    },
    //RST 0x30
    //#0xF7:
    function(parentObj) {
        parentObj.stackPointer = parentObj.stackPointer - 1 & 65535;
        parentObj.memoryWriter[parentObj.stackPointer](parentObj, parentObj.stackPointer, parentObj.programCounter >> 8);
        parentObj.stackPointer = parentObj.stackPointer - 1 & 65535;
        parentObj.memoryWriter[parentObj.stackPointer](parentObj, parentObj.stackPointer, parentObj.programCounter & 255);
        parentObj.programCounter = 48;
    },
    //LDHL SP, n
    //#0xF8:
    function(parentObj) {
        var temp_var = parentObj.memoryReader[parentObj.programCounter](parentObj, parentObj.programCounter) << 24 >> 24;
        parentObj.programCounter = parentObj.programCounter + 1 & 65535;
        parentObj.registersHL = parentObj.stackPointer + temp_var & 65535;
        temp_var = parentObj.stackPointer ^ temp_var ^ parentObj.registersHL;
        parentObj.FCarry = (temp_var & 256) == 256;
        parentObj.FHalfCarry = (temp_var & 16) == 16;
        parentObj.FZero = parentObj.FSubtract = false;
    },
    //LD SP, HL
    //#0xF9:
    function(parentObj) {
        parentObj.stackPointer = parentObj.registersHL;
    },
    //LD A, (nn)
    //#0xFA:
    function(parentObj) {
        parentObj.registerA = parentObj.memoryRead(parentObj.memoryRead(parentObj.programCounter + 1 & 65535) << 8 | parentObj.memoryReader[parentObj.programCounter](parentObj, parentObj.programCounter));
        parentObj.programCounter = parentObj.programCounter + 2 & 65535;
    },
    //EI
    //#0xFB:
    function(parentObj) {
        //Immediate for HALT:
        parentObj.IRQEnableDelay = parentObj.IRQEnableDelay == 2 || parentObj.memoryReader[parentObj.programCounter](parentObj, parentObj.programCounter) == 118 ? 1 : 2;
    },
    //0xFC - Illegal
    //#0xFC:
    function(parentObj) {
        console.log("Illegal op code 0xFC called, pausing emulation.", 2);
    //pause();
    },
    //0xFD - Illegal
    //#0xFD:
    function(parentObj) {
        console.log("Illegal op code 0xFD called, pausing emulation.", 2);
    //pause();
    },
    //CP n
    //#0xFE:
    function(parentObj) {
        var dirtySum = parentObj.registerA - parentObj.memoryReader[parentObj.programCounter](parentObj, parentObj.programCounter);
        parentObj.programCounter = parentObj.programCounter + 1 & 65535;
        parentObj.FHalfCarry = (dirtySum & 15) > (parentObj.registerA & 15);
        parentObj.FCarry = dirtySum < 0;
        parentObj.FZero = dirtySum == 0;
        parentObj.FSubtract = true;
    },
    //RST 0x38
    //#0xFF:
    function(parentObj) {
        parentObj.stackPointer = parentObj.stackPointer - 1 & 65535;
        parentObj.memoryWriter[parentObj.stackPointer](parentObj, parentObj.stackPointer, parentObj.programCounter >> 8);
        parentObj.stackPointer = parentObj.stackPointer - 1 & 65535;
        parentObj.memoryWriter[parentObj.stackPointer](parentObj, parentObj.stackPointer, parentObj.programCounter & 255);
        parentObj.programCounter = 56;
    }
];
module.exports = OPCODE;

},{}],"86Zgb":[function(require,module,exports) {
var CBOPCODE = [
    //RLC B
    //#0x00:
    function(parentObj) {
        parentObj.FCarry = parentObj.registerB > 127;
        parentObj.registerB = parentObj.registerB << 1 & 255 | (parentObj.FCarry ? 1 : 0);
        parentObj.FHalfCarry = parentObj.FSubtract = false;
        parentObj.FZero = parentObj.registerB == 0;
    },
    function(parentObj) {
        parentObj.FCarry = parentObj.registerC > 127;
        parentObj.registerC = parentObj.registerC << 1 & 255 | (parentObj.FCarry ? 1 : 0);
        parentObj.FHalfCarry = parentObj.FSubtract = false;
        parentObj.FZero = parentObj.registerC == 0;
    },
    function(parentObj) {
        parentObj.FCarry = parentObj.registerD > 127;
        parentObj.registerD = parentObj.registerD << 1 & 255 | (parentObj.FCarry ? 1 : 0);
        parentObj.FHalfCarry = parentObj.FSubtract = false;
        parentObj.FZero = parentObj.registerD == 0;
    },
    function(parentObj) {
        parentObj.FCarry = parentObj.registerE > 127;
        parentObj.registerE = parentObj.registerE << 1 & 255 | (parentObj.FCarry ? 1 : 0);
        parentObj.FHalfCarry = parentObj.FSubtract = false;
        parentObj.FZero = parentObj.registerE == 0;
    },
    function(parentObj) {
        parentObj.FCarry = parentObj.registersHL > 32767;
        parentObj.registersHL = parentObj.registersHL << 1 & 65024 | (parentObj.FCarry ? 256 : 0) | parentObj.registersHL & 255;
        parentObj.FHalfCarry = parentObj.FSubtract = false;
        parentObj.FZero = parentObj.registersHL < 256;
    },
    function(parentObj) {
        parentObj.FCarry = (parentObj.registersHL & 128) == 128;
        parentObj.registersHL = parentObj.registersHL & 65280 | parentObj.registersHL << 1 & 255 | (parentObj.FCarry ? 1 : 0);
        parentObj.FHalfCarry = parentObj.FSubtract = false;
        parentObj.FZero = (parentObj.registersHL & 255) == 0;
    },
    function(parentObj) {
        var temp_var = parentObj.memoryReader[parentObj.registersHL](parentObj, parentObj.registersHL);
        parentObj.FCarry = temp_var > 127;
        temp_var = temp_var << 1 & 255 | (parentObj.FCarry ? 1 : 0);
        parentObj.memoryWriter[parentObj.registersHL](parentObj, parentObj.registersHL, temp_var);
        parentObj.FHalfCarry = parentObj.FSubtract = false;
        parentObj.FZero = temp_var == 0;
    },
    function(parentObj) {
        parentObj.FCarry = parentObj.registerA > 127;
        parentObj.registerA = parentObj.registerA << 1 & 255 | (parentObj.FCarry ? 1 : 0);
        parentObj.FHalfCarry = parentObj.FSubtract = false;
        parentObj.FZero = parentObj.registerA == 0;
    },
    function(parentObj) {
        parentObj.FCarry = (parentObj.registerB & 1) == 1;
        parentObj.registerB = (parentObj.FCarry ? 128 : 0) | parentObj.registerB >> 1;
        parentObj.FHalfCarry = parentObj.FSubtract = false;
        parentObj.FZero = parentObj.registerB == 0;
    },
    function(parentObj) {
        parentObj.FCarry = (parentObj.registerC & 1) == 1;
        parentObj.registerC = (parentObj.FCarry ? 128 : 0) | parentObj.registerC >> 1;
        parentObj.FHalfCarry = parentObj.FSubtract = false;
        parentObj.FZero = parentObj.registerC == 0;
    },
    function(parentObj) {
        parentObj.FCarry = (parentObj.registerD & 1) == 1;
        parentObj.registerD = (parentObj.FCarry ? 128 : 0) | parentObj.registerD >> 1;
        parentObj.FHalfCarry = parentObj.FSubtract = false;
        parentObj.FZero = parentObj.registerD == 0;
    },
    function(parentObj) {
        parentObj.FCarry = (parentObj.registerE & 1) == 1;
        parentObj.registerE = (parentObj.FCarry ? 128 : 0) | parentObj.registerE >> 1;
        parentObj.FHalfCarry = parentObj.FSubtract = false;
        parentObj.FZero = parentObj.registerE == 0;
    },
    function(parentObj) {
        parentObj.FCarry = (parentObj.registersHL & 256) == 256;
        parentObj.registersHL = (parentObj.FCarry ? 32768 : 0) | parentObj.registersHL >> 1 & 65280 | parentObj.registersHL & 255;
        parentObj.FHalfCarry = parentObj.FSubtract = false;
        parentObj.FZero = parentObj.registersHL < 256;
    },
    function(parentObj) {
        parentObj.FCarry = (parentObj.registersHL & 1) == 1;
        parentObj.registersHL = parentObj.registersHL & 65280 | (parentObj.FCarry ? 128 : 0) | (parentObj.registersHL & 255) >> 1;
        parentObj.FHalfCarry = parentObj.FSubtract = false;
        parentObj.FZero = (parentObj.registersHL & 255) == 0;
    },
    function(parentObj) {
        var temp_var = parentObj.memoryReader[parentObj.registersHL](parentObj, parentObj.registersHL);
        parentObj.FCarry = (temp_var & 1) == 1;
        temp_var = (parentObj.FCarry ? 128 : 0) | temp_var >> 1;
        parentObj.memoryWriter[parentObj.registersHL](parentObj, parentObj.registersHL, temp_var);
        parentObj.FHalfCarry = parentObj.FSubtract = false;
        parentObj.FZero = temp_var == 0;
    },
    function(parentObj) {
        parentObj.FCarry = (parentObj.registerA & 1) == 1;
        parentObj.registerA = (parentObj.FCarry ? 128 : 0) | parentObj.registerA >> 1;
        parentObj.FHalfCarry = parentObj.FSubtract = false;
        parentObj.FZero = parentObj.registerA == 0;
    },
    function(parentObj) {
        var newFCarry = parentObj.registerB > 127;
        parentObj.registerB = parentObj.registerB << 1 & 255 | (parentObj.FCarry ? 1 : 0);
        parentObj.FCarry = newFCarry;
        parentObj.FHalfCarry = parentObj.FSubtract = false;
        parentObj.FZero = parentObj.registerB == 0;
    },
    function(parentObj) {
        var newFCarry = parentObj.registerC > 127;
        parentObj.registerC = parentObj.registerC << 1 & 255 | (parentObj.FCarry ? 1 : 0);
        parentObj.FCarry = newFCarry;
        parentObj.FHalfCarry = parentObj.FSubtract = false;
        parentObj.FZero = parentObj.registerC == 0;
    },
    function(parentObj) {
        var newFCarry = parentObj.registerD > 127;
        parentObj.registerD = parentObj.registerD << 1 & 255 | (parentObj.FCarry ? 1 : 0);
        parentObj.FCarry = newFCarry;
        parentObj.FHalfCarry = parentObj.FSubtract = false;
        parentObj.FZero = parentObj.registerD == 0;
    },
    function(parentObj) {
        var newFCarry = parentObj.registerE > 127;
        parentObj.registerE = parentObj.registerE << 1 & 255 | (parentObj.FCarry ? 1 : 0);
        parentObj.FCarry = newFCarry;
        parentObj.FHalfCarry = parentObj.FSubtract = false;
        parentObj.FZero = parentObj.registerE == 0;
    },
    function(parentObj) {
        var newFCarry = parentObj.registersHL > 32767;
        parentObj.registersHL = parentObj.registersHL << 1 & 65024 | (parentObj.FCarry ? 256 : 0) | parentObj.registersHL & 255;
        parentObj.FCarry = newFCarry;
        parentObj.FHalfCarry = parentObj.FSubtract = false;
        parentObj.FZero = parentObj.registersHL < 256;
    },
    function(parentObj) {
        var newFCarry = (parentObj.registersHL & 128) == 128;
        parentObj.registersHL = parentObj.registersHL & 65280 | parentObj.registersHL << 1 & 255 | (parentObj.FCarry ? 1 : 0);
        parentObj.FCarry = newFCarry;
        parentObj.FHalfCarry = parentObj.FSubtract = false;
        parentObj.FZero = (parentObj.registersHL & 255) == 0;
    },
    function(parentObj) {
        var temp_var = parentObj.memoryReader[parentObj.registersHL](parentObj, parentObj.registersHL);
        var newFCarry = temp_var > 127;
        temp_var = temp_var << 1 & 255 | (parentObj.FCarry ? 1 : 0);
        parentObj.FCarry = newFCarry;
        parentObj.memoryWriter[parentObj.registersHL](parentObj, parentObj.registersHL, temp_var);
        parentObj.FHalfCarry = parentObj.FSubtract = false;
        parentObj.FZero = temp_var == 0;
    },
    function(parentObj) {
        var newFCarry = parentObj.registerA > 127;
        parentObj.registerA = parentObj.registerA << 1 & 255 | (parentObj.FCarry ? 1 : 0);
        parentObj.FCarry = newFCarry;
        parentObj.FHalfCarry = parentObj.FSubtract = false;
        parentObj.FZero = parentObj.registerA == 0;
    },
    function(parentObj) {
        var newFCarry = (parentObj.registerB & 1) == 1;
        parentObj.registerB = (parentObj.FCarry ? 128 : 0) | parentObj.registerB >> 1;
        parentObj.FCarry = newFCarry;
        parentObj.FHalfCarry = parentObj.FSubtract = false;
        parentObj.FZero = parentObj.registerB == 0;
    },
    function(parentObj) {
        var newFCarry = (parentObj.registerC & 1) == 1;
        parentObj.registerC = (parentObj.FCarry ? 128 : 0) | parentObj.registerC >> 1;
        parentObj.FCarry = newFCarry;
        parentObj.FHalfCarry = parentObj.FSubtract = false;
        parentObj.FZero = parentObj.registerC == 0;
    },
    function(parentObj) {
        var newFCarry = (parentObj.registerD & 1) == 1;
        parentObj.registerD = (parentObj.FCarry ? 128 : 0) | parentObj.registerD >> 1;
        parentObj.FCarry = newFCarry;
        parentObj.FHalfCarry = parentObj.FSubtract = false;
        parentObj.FZero = parentObj.registerD == 0;
    },
    function(parentObj) {
        var newFCarry = (parentObj.registerE & 1) == 1;
        parentObj.registerE = (parentObj.FCarry ? 128 : 0) | parentObj.registerE >> 1;
        parentObj.FCarry = newFCarry;
        parentObj.FHalfCarry = parentObj.FSubtract = false;
        parentObj.FZero = parentObj.registerE == 0;
    },
    function(parentObj) {
        var newFCarry = (parentObj.registersHL & 256) == 256;
        parentObj.registersHL = (parentObj.FCarry ? 32768 : 0) | parentObj.registersHL >> 1 & 65280 | parentObj.registersHL & 255;
        parentObj.FCarry = newFCarry;
        parentObj.FHalfCarry = parentObj.FSubtract = false;
        parentObj.FZero = parentObj.registersHL < 256;
    },
    function(parentObj) {
        var newFCarry = (parentObj.registersHL & 1) == 1;
        parentObj.registersHL = parentObj.registersHL & 65280 | (parentObj.FCarry ? 128 : 0) | (parentObj.registersHL & 255) >> 1;
        parentObj.FCarry = newFCarry;
        parentObj.FHalfCarry = parentObj.FSubtract = false;
        parentObj.FZero = (parentObj.registersHL & 255) == 0;
    },
    function(parentObj) {
        var temp_var = parentObj.memoryReader[parentObj.registersHL](parentObj, parentObj.registersHL);
        var newFCarry = (temp_var & 1) == 1;
        temp_var = (parentObj.FCarry ? 128 : 0) | temp_var >> 1;
        parentObj.FCarry = newFCarry;
        parentObj.memoryWriter[parentObj.registersHL](parentObj, parentObj.registersHL, temp_var);
        parentObj.FHalfCarry = parentObj.FSubtract = false;
        parentObj.FZero = temp_var == 0;
    },
    function(parentObj) {
        var newFCarry = (parentObj.registerA & 1) == 1;
        parentObj.registerA = (parentObj.FCarry ? 128 : 0) | parentObj.registerA >> 1;
        parentObj.FCarry = newFCarry;
        parentObj.FHalfCarry = parentObj.FSubtract = false;
        parentObj.FZero = parentObj.registerA == 0;
    },
    function(parentObj) {
        parentObj.FCarry = parentObj.registerB > 127;
        parentObj.registerB = parentObj.registerB << 1 & 255;
        parentObj.FHalfCarry = parentObj.FSubtract = false;
        parentObj.FZero = parentObj.registerB == 0;
    },
    function(parentObj) {
        parentObj.FCarry = parentObj.registerC > 127;
        parentObj.registerC = parentObj.registerC << 1 & 255;
        parentObj.FHalfCarry = parentObj.FSubtract = false;
        parentObj.FZero = parentObj.registerC == 0;
    },
    function(parentObj) {
        parentObj.FCarry = parentObj.registerD > 127;
        parentObj.registerD = parentObj.registerD << 1 & 255;
        parentObj.FHalfCarry = parentObj.FSubtract = false;
        parentObj.FZero = parentObj.registerD == 0;
    },
    function(parentObj) {
        parentObj.FCarry = parentObj.registerE > 127;
        parentObj.registerE = parentObj.registerE << 1 & 255;
        parentObj.FHalfCarry = parentObj.FSubtract = false;
        parentObj.FZero = parentObj.registerE == 0;
    },
    function(parentObj) {
        parentObj.FCarry = parentObj.registersHL > 32767;
        parentObj.registersHL = parentObj.registersHL << 1 & 65024 | parentObj.registersHL & 255;
        parentObj.FHalfCarry = parentObj.FSubtract = false;
        parentObj.FZero = parentObj.registersHL < 256;
    },
    function(parentObj) {
        parentObj.FCarry = (parentObj.registersHL & 128) == 128;
        parentObj.registersHL = parentObj.registersHL & 65280 | parentObj.registersHL << 1 & 255;
        parentObj.FHalfCarry = parentObj.FSubtract = false;
        parentObj.FZero = (parentObj.registersHL & 255) == 0;
    },
    function(parentObj) {
        var temp_var = parentObj.memoryReader[parentObj.registersHL](parentObj, parentObj.registersHL);
        parentObj.FCarry = temp_var > 127;
        temp_var = temp_var << 1 & 255;
        parentObj.memoryWriter[parentObj.registersHL](parentObj, parentObj.registersHL, temp_var);
        parentObj.FHalfCarry = parentObj.FSubtract = false;
        parentObj.FZero = temp_var == 0;
    },
    function(parentObj) {
        parentObj.FCarry = parentObj.registerA > 127;
        parentObj.registerA = parentObj.registerA << 1 & 255;
        parentObj.FHalfCarry = parentObj.FSubtract = false;
        parentObj.FZero = parentObj.registerA == 0;
    },
    function(parentObj) {
        parentObj.FCarry = (parentObj.registerB & 1) == 1;
        parentObj.registerB = parentObj.registerB & 128 | parentObj.registerB >> 1;
        parentObj.FHalfCarry = parentObj.FSubtract = false;
        parentObj.FZero = parentObj.registerB == 0;
    },
    function(parentObj) {
        parentObj.FCarry = (parentObj.registerC & 1) == 1;
        parentObj.registerC = parentObj.registerC & 128 | parentObj.registerC >> 1;
        parentObj.FHalfCarry = parentObj.FSubtract = false;
        parentObj.FZero = parentObj.registerC == 0;
    },
    function(parentObj) {
        parentObj.FCarry = (parentObj.registerD & 1) == 1;
        parentObj.registerD = parentObj.registerD & 128 | parentObj.registerD >> 1;
        parentObj.FHalfCarry = parentObj.FSubtract = false;
        parentObj.FZero = parentObj.registerD == 0;
    },
    function(parentObj) {
        parentObj.FCarry = (parentObj.registerE & 1) == 1;
        parentObj.registerE = parentObj.registerE & 128 | parentObj.registerE >> 1;
        parentObj.FHalfCarry = parentObj.FSubtract = false;
        parentObj.FZero = parentObj.registerE == 0;
    },
    function(parentObj) {
        parentObj.FCarry = (parentObj.registersHL & 256) == 256;
        parentObj.registersHL = parentObj.registersHL >> 1 & 65280 | parentObj.registersHL & 33023;
        parentObj.FHalfCarry = parentObj.FSubtract = false;
        parentObj.FZero = parentObj.registersHL < 256;
    },
    function(parentObj) {
        parentObj.FCarry = (parentObj.registersHL & 1) == 1;
        parentObj.registersHL = parentObj.registersHL & 65408 | (parentObj.registersHL & 255) >> 1;
        parentObj.FHalfCarry = parentObj.FSubtract = false;
        parentObj.FZero = (parentObj.registersHL & 255) == 0;
    },
    function(parentObj) {
        var temp_var = parentObj.memoryReader[parentObj.registersHL](parentObj, parentObj.registersHL);
        parentObj.FCarry = (temp_var & 1) == 1;
        temp_var = temp_var & 128 | temp_var >> 1;
        parentObj.memoryWriter[parentObj.registersHL](parentObj, parentObj.registersHL, temp_var);
        parentObj.FHalfCarry = parentObj.FSubtract = false;
        parentObj.FZero = temp_var == 0;
    },
    function(parentObj) {
        parentObj.FCarry = (parentObj.registerA & 1) == 1;
        parentObj.registerA = parentObj.registerA & 128 | parentObj.registerA >> 1;
        parentObj.FHalfCarry = parentObj.FSubtract = false;
        parentObj.FZero = parentObj.registerA == 0;
    },
    function(parentObj) {
        parentObj.registerB = (parentObj.registerB & 15) << 4 | parentObj.registerB >> 4;
        parentObj.FZero = parentObj.registerB == 0;
        parentObj.FCarry = parentObj.FHalfCarry = parentObj.FSubtract = false;
    },
    function(parentObj) {
        parentObj.registerC = (parentObj.registerC & 15) << 4 | parentObj.registerC >> 4;
        parentObj.FZero = parentObj.registerC == 0;
        parentObj.FCarry = parentObj.FHalfCarry = parentObj.FSubtract = false;
    },
    function(parentObj) {
        parentObj.registerD = (parentObj.registerD & 15) << 4 | parentObj.registerD >> 4;
        parentObj.FZero = parentObj.registerD == 0;
        parentObj.FCarry = parentObj.FHalfCarry = parentObj.FSubtract = false;
    },
    function(parentObj) {
        parentObj.registerE = (parentObj.registerE & 15) << 4 | parentObj.registerE >> 4;
        parentObj.FZero = parentObj.registerE == 0;
        parentObj.FCarry = parentObj.FHalfCarry = parentObj.FSubtract = false;
    },
    function(parentObj) {
        parentObj.registersHL = (parentObj.registersHL & 3840) << 4 | (parentObj.registersHL & 61440) >> 4 | parentObj.registersHL & 255;
        parentObj.FZero = parentObj.registersHL < 256;
        parentObj.FCarry = parentObj.FHalfCarry = parentObj.FSubtract = false;
    },
    function(parentObj) {
        parentObj.registersHL = parentObj.registersHL & 65280 | (parentObj.registersHL & 15) << 4 | (parentObj.registersHL & 240) >> 4;
        parentObj.FZero = (parentObj.registersHL & 255) == 0;
        parentObj.FCarry = parentObj.FHalfCarry = parentObj.FSubtract = false;
    },
    function(parentObj) {
        var temp_var = parentObj.memoryReader[parentObj.registersHL](parentObj, parentObj.registersHL);
        temp_var = (temp_var & 15) << 4 | temp_var >> 4;
        parentObj.memoryWriter[parentObj.registersHL](parentObj, parentObj.registersHL, temp_var);
        parentObj.FZero = temp_var == 0;
        parentObj.FCarry = parentObj.FHalfCarry = parentObj.FSubtract = false;
    },
    function(parentObj) {
        parentObj.registerA = (parentObj.registerA & 15) << 4 | parentObj.registerA >> 4;
        parentObj.FZero = parentObj.registerA == 0;
        parentObj.FCarry = parentObj.FHalfCarry = parentObj.FSubtract = false;
    },
    function(parentObj) {
        parentObj.FCarry = (parentObj.registerB & 1) == 1;
        parentObj.registerB >>= 1;
        parentObj.FHalfCarry = parentObj.FSubtract = false;
        parentObj.FZero = parentObj.registerB == 0;
    },
    function(parentObj) {
        parentObj.FCarry = (parentObj.registerC & 1) == 1;
        parentObj.registerC >>= 1;
        parentObj.FHalfCarry = parentObj.FSubtract = false;
        parentObj.FZero = parentObj.registerC == 0;
    },
    function(parentObj) {
        parentObj.FCarry = (parentObj.registerD & 1) == 1;
        parentObj.registerD >>= 1;
        parentObj.FHalfCarry = parentObj.FSubtract = false;
        parentObj.FZero = parentObj.registerD == 0;
    },
    function(parentObj) {
        parentObj.FCarry = (parentObj.registerE & 1) == 1;
        parentObj.registerE >>= 1;
        parentObj.FHalfCarry = parentObj.FSubtract = false;
        parentObj.FZero = parentObj.registerE == 0;
    },
    function(parentObj) {
        parentObj.FCarry = (parentObj.registersHL & 256) == 256;
        parentObj.registersHL = parentObj.registersHL >> 1 & 65280 | parentObj.registersHL & 255;
        parentObj.FHalfCarry = parentObj.FSubtract = false;
        parentObj.FZero = parentObj.registersHL < 256;
    },
    function(parentObj) {
        parentObj.FCarry = (parentObj.registersHL & 1) == 1;
        parentObj.registersHL = parentObj.registersHL & 65280 | (parentObj.registersHL & 255) >> 1;
        parentObj.FHalfCarry = parentObj.FSubtract = false;
        parentObj.FZero = (parentObj.registersHL & 255) == 0;
    },
    function(parentObj) {
        var temp_var = parentObj.memoryReader[parentObj.registersHL](parentObj, parentObj.registersHL);
        parentObj.FCarry = (temp_var & 1) == 1;
        parentObj.memoryWriter[parentObj.registersHL](parentObj, parentObj.registersHL, temp_var >> 1);
        parentObj.FHalfCarry = parentObj.FSubtract = false;
        parentObj.FZero = temp_var < 2;
    },
    function(parentObj) {
        parentObj.FCarry = (parentObj.registerA & 1) == 1;
        parentObj.registerA >>= 1;
        parentObj.FHalfCarry = parentObj.FSubtract = false;
        parentObj.FZero = parentObj.registerA == 0;
    },
    function(parentObj) {
        parentObj.FHalfCarry = true;
        parentObj.FSubtract = false;
        parentObj.FZero = (parentObj.registerB & 1) == 0;
    },
    function(parentObj) {
        parentObj.FHalfCarry = true;
        parentObj.FSubtract = false;
        parentObj.FZero = (parentObj.registerC & 1) == 0;
    },
    function(parentObj) {
        parentObj.FHalfCarry = true;
        parentObj.FSubtract = false;
        parentObj.FZero = (parentObj.registerD & 1) == 0;
    },
    function(parentObj) {
        parentObj.FHalfCarry = true;
        parentObj.FSubtract = false;
        parentObj.FZero = (parentObj.registerE & 1) == 0;
    },
    function(parentObj) {
        parentObj.FHalfCarry = true;
        parentObj.FSubtract = false;
        parentObj.FZero = (parentObj.registersHL & 256) == 0;
    },
    function(parentObj) {
        parentObj.FHalfCarry = true;
        parentObj.FSubtract = false;
        parentObj.FZero = (parentObj.registersHL & 1) == 0;
    },
    function(parentObj) {
        parentObj.FHalfCarry = true;
        parentObj.FSubtract = false;
        parentObj.FZero = (parentObj.memoryReader[parentObj.registersHL](parentObj, parentObj.registersHL) & 1) == 0;
    },
    function(parentObj) {
        parentObj.FHalfCarry = true;
        parentObj.FSubtract = false;
        parentObj.FZero = (parentObj.registerA & 1) == 0;
    },
    function(parentObj) {
        parentObj.FHalfCarry = true;
        parentObj.FSubtract = false;
        parentObj.FZero = (parentObj.registerB & 2) == 0;
    },
    function(parentObj) {
        parentObj.FHalfCarry = true;
        parentObj.FSubtract = false;
        parentObj.FZero = (parentObj.registerC & 2) == 0;
    },
    function(parentObj) {
        parentObj.FHalfCarry = true;
        parentObj.FSubtract = false;
        parentObj.FZero = (parentObj.registerD & 2) == 0;
    },
    function(parentObj) {
        parentObj.FHalfCarry = true;
        parentObj.FSubtract = false;
        parentObj.FZero = (parentObj.registerE & 2) == 0;
    },
    function(parentObj) {
        parentObj.FHalfCarry = true;
        parentObj.FSubtract = false;
        parentObj.FZero = (parentObj.registersHL & 512) == 0;
    },
    function(parentObj) {
        parentObj.FHalfCarry = true;
        parentObj.FSubtract = false;
        parentObj.FZero = (parentObj.registersHL & 2) == 0;
    },
    function(parentObj) {
        parentObj.FHalfCarry = true;
        parentObj.FSubtract = false;
        parentObj.FZero = (parentObj.memoryReader[parentObj.registersHL](parentObj, parentObj.registersHL) & 2) == 0;
    },
    function(parentObj) {
        parentObj.FHalfCarry = true;
        parentObj.FSubtract = false;
        parentObj.FZero = (parentObj.registerA & 2) == 0;
    },
    function(parentObj) {
        parentObj.FHalfCarry = true;
        parentObj.FSubtract = false;
        parentObj.FZero = (parentObj.registerB & 4) == 0;
    },
    function(parentObj) {
        parentObj.FHalfCarry = true;
        parentObj.FSubtract = false;
        parentObj.FZero = (parentObj.registerC & 4) == 0;
    },
    function(parentObj) {
        parentObj.FHalfCarry = true;
        parentObj.FSubtract = false;
        parentObj.FZero = (parentObj.registerD & 4) == 0;
    },
    function(parentObj) {
        parentObj.FHalfCarry = true;
        parentObj.FSubtract = false;
        parentObj.FZero = (parentObj.registerE & 4) == 0;
    },
    function(parentObj) {
        parentObj.FHalfCarry = true;
        parentObj.FSubtract = false;
        parentObj.FZero = (parentObj.registersHL & 1024) == 0;
    },
    function(parentObj) {
        parentObj.FHalfCarry = true;
        parentObj.FSubtract = false;
        parentObj.FZero = (parentObj.registersHL & 4) == 0;
    },
    function(parentObj) {
        parentObj.FHalfCarry = true;
        parentObj.FSubtract = false;
        parentObj.FZero = (parentObj.memoryReader[parentObj.registersHL](parentObj, parentObj.registersHL) & 4) == 0;
    },
    function(parentObj) {
        parentObj.FHalfCarry = true;
        parentObj.FSubtract = false;
        parentObj.FZero = (parentObj.registerA & 4) == 0;
    },
    function(parentObj) {
        parentObj.FHalfCarry = true;
        parentObj.FSubtract = false;
        parentObj.FZero = (parentObj.registerB & 8) == 0;
    },
    function(parentObj) {
        parentObj.FHalfCarry = true;
        parentObj.FSubtract = false;
        parentObj.FZero = (parentObj.registerC & 8) == 0;
    },
    function(parentObj) {
        parentObj.FHalfCarry = true;
        parentObj.FSubtract = false;
        parentObj.FZero = (parentObj.registerD & 8) == 0;
    },
    function(parentObj) {
        parentObj.FHalfCarry = true;
        parentObj.FSubtract = false;
        parentObj.FZero = (parentObj.registerE & 8) == 0;
    },
    function(parentObj) {
        parentObj.FHalfCarry = true;
        parentObj.FSubtract = false;
        parentObj.FZero = (parentObj.registersHL & 2048) == 0;
    },
    function(parentObj) {
        parentObj.FHalfCarry = true;
        parentObj.FSubtract = false;
        parentObj.FZero = (parentObj.registersHL & 8) == 0;
    },
    function(parentObj) {
        parentObj.FHalfCarry = true;
        parentObj.FSubtract = false;
        parentObj.FZero = (parentObj.memoryReader[parentObj.registersHL](parentObj, parentObj.registersHL) & 8) == 0;
    },
    function(parentObj) {
        parentObj.FHalfCarry = true;
        parentObj.FSubtract = false;
        parentObj.FZero = (parentObj.registerA & 8) == 0;
    },
    function(parentObj) {
        parentObj.FHalfCarry = true;
        parentObj.FSubtract = false;
        parentObj.FZero = (parentObj.registerB & 16) == 0;
    },
    function(parentObj) {
        parentObj.FHalfCarry = true;
        parentObj.FSubtract = false;
        parentObj.FZero = (parentObj.registerC & 16) == 0;
    },
    function(parentObj) {
        parentObj.FHalfCarry = true;
        parentObj.FSubtract = false;
        parentObj.FZero = (parentObj.registerD & 16) == 0;
    },
    function(parentObj) {
        parentObj.FHalfCarry = true;
        parentObj.FSubtract = false;
        parentObj.FZero = (parentObj.registerE & 16) == 0;
    },
    function(parentObj) {
        parentObj.FHalfCarry = true;
        parentObj.FSubtract = false;
        parentObj.FZero = (parentObj.registersHL & 4096) == 0;
    },
    function(parentObj) {
        parentObj.FHalfCarry = true;
        parentObj.FSubtract = false;
        parentObj.FZero = (parentObj.registersHL & 16) == 0;
    },
    function(parentObj) {
        parentObj.FHalfCarry = true;
        parentObj.FSubtract = false;
        parentObj.FZero = (parentObj.memoryReader[parentObj.registersHL](parentObj, parentObj.registersHL) & 16) == 0;
    },
    function(parentObj) {
        parentObj.FHalfCarry = true;
        parentObj.FSubtract = false;
        parentObj.FZero = (parentObj.registerA & 16) == 0;
    },
    function(parentObj) {
        parentObj.FHalfCarry = true;
        parentObj.FSubtract = false;
        parentObj.FZero = (parentObj.registerB & 32) == 0;
    },
    function(parentObj) {
        parentObj.FHalfCarry = true;
        parentObj.FSubtract = false;
        parentObj.FZero = (parentObj.registerC & 32) == 0;
    },
    function(parentObj) {
        parentObj.FHalfCarry = true;
        parentObj.FSubtract = false;
        parentObj.FZero = (parentObj.registerD & 32) == 0;
    },
    function(parentObj) {
        parentObj.FHalfCarry = true;
        parentObj.FSubtract = false;
        parentObj.FZero = (parentObj.registerE & 32) == 0;
    },
    function(parentObj) {
        parentObj.FHalfCarry = true;
        parentObj.FSubtract = false;
        parentObj.FZero = (parentObj.registersHL & 8192) == 0;
    },
    function(parentObj) {
        parentObj.FHalfCarry = true;
        parentObj.FSubtract = false;
        parentObj.FZero = (parentObj.registersHL & 32) == 0;
    },
    function(parentObj) {
        parentObj.FHalfCarry = true;
        parentObj.FSubtract = false;
        parentObj.FZero = (parentObj.memoryReader[parentObj.registersHL](parentObj, parentObj.registersHL) & 32) == 0;
    },
    function(parentObj) {
        parentObj.FHalfCarry = true;
        parentObj.FSubtract = false;
        parentObj.FZero = (parentObj.registerA & 32) == 0;
    },
    function(parentObj) {
        parentObj.FHalfCarry = true;
        parentObj.FSubtract = false;
        parentObj.FZero = (parentObj.registerB & 64) == 0;
    },
    function(parentObj) {
        parentObj.FHalfCarry = true;
        parentObj.FSubtract = false;
        parentObj.FZero = (parentObj.registerC & 64) == 0;
    },
    function(parentObj) {
        parentObj.FHalfCarry = true;
        parentObj.FSubtract = false;
        parentObj.FZero = (parentObj.registerD & 64) == 0;
    },
    function(parentObj) {
        parentObj.FHalfCarry = true;
        parentObj.FSubtract = false;
        parentObj.FZero = (parentObj.registerE & 64) == 0;
    },
    function(parentObj) {
        parentObj.FHalfCarry = true;
        parentObj.FSubtract = false;
        parentObj.FZero = (parentObj.registersHL & 16384) == 0;
    },
    function(parentObj) {
        parentObj.FHalfCarry = true;
        parentObj.FSubtract = false;
        parentObj.FZero = (parentObj.registersHL & 64) == 0;
    },
    function(parentObj) {
        parentObj.FHalfCarry = true;
        parentObj.FSubtract = false;
        parentObj.FZero = (parentObj.memoryReader[parentObj.registersHL](parentObj, parentObj.registersHL) & 64) == 0;
    },
    function(parentObj) {
        parentObj.FHalfCarry = true;
        parentObj.FSubtract = false;
        parentObj.FZero = (parentObj.registerA & 64) == 0;
    },
    function(parentObj) {
        parentObj.FHalfCarry = true;
        parentObj.FSubtract = false;
        parentObj.FZero = (parentObj.registerB & 128) == 0;
    },
    function(parentObj) {
        parentObj.FHalfCarry = true;
        parentObj.FSubtract = false;
        parentObj.FZero = (parentObj.registerC & 128) == 0;
    },
    function(parentObj) {
        parentObj.FHalfCarry = true;
        parentObj.FSubtract = false;
        parentObj.FZero = (parentObj.registerD & 128) == 0;
    },
    function(parentObj) {
        parentObj.FHalfCarry = true;
        parentObj.FSubtract = false;
        parentObj.FZero = (parentObj.registerE & 128) == 0;
    },
    function(parentObj) {
        parentObj.FHalfCarry = true;
        parentObj.FSubtract = false;
        parentObj.FZero = (parentObj.registersHL & 32768) == 0;
    },
    function(parentObj) {
        parentObj.FHalfCarry = true;
        parentObj.FSubtract = false;
        parentObj.FZero = (parentObj.registersHL & 128) == 0;
    },
    function(parentObj) {
        parentObj.FHalfCarry = true;
        parentObj.FSubtract = false;
        parentObj.FZero = (parentObj.memoryReader[parentObj.registersHL](parentObj, parentObj.registersHL) & 128) == 0;
    },
    function(parentObj) {
        parentObj.FHalfCarry = true;
        parentObj.FSubtract = false;
        parentObj.FZero = (parentObj.registerA & 128) == 0;
    },
    function(parentObj) {
        parentObj.registerB &= 254;
    },
    function(parentObj) {
        parentObj.registerC &= 254;
    },
    function(parentObj) {
        parentObj.registerD &= 254;
    },
    function(parentObj) {
        parentObj.registerE &= 254;
    },
    function(parentObj) {
        parentObj.registersHL &= 65279;
    },
    function(parentObj) {
        parentObj.registersHL &= 65534;
    },
    function(parentObj) {
        parentObj.memoryWriter[parentObj.registersHL](parentObj, parentObj.registersHL, parentObj.memoryReader[parentObj.registersHL](parentObj, parentObj.registersHL) & 254);
    },
    function(parentObj) {
        parentObj.registerA &= 254;
    },
    function(parentObj) {
        parentObj.registerB &= 253;
    },
    function(parentObj) {
        parentObj.registerC &= 253;
    },
    function(parentObj) {
        parentObj.registerD &= 253;
    },
    function(parentObj) {
        parentObj.registerE &= 253;
    },
    function(parentObj) {
        parentObj.registersHL &= 65023;
    },
    function(parentObj) {
        parentObj.registersHL &= 65533;
    },
    function(parentObj) {
        parentObj.memoryWriter[parentObj.registersHL](parentObj, parentObj.registersHL, parentObj.memoryReader[parentObj.registersHL](parentObj, parentObj.registersHL) & 253);
    },
    function(parentObj) {
        parentObj.registerA &= 253;
    },
    function(parentObj) {
        parentObj.registerB &= 251;
    },
    function(parentObj) {
        parentObj.registerC &= 251;
    },
    function(parentObj) {
        parentObj.registerD &= 251;
    },
    function(parentObj) {
        parentObj.registerE &= 251;
    },
    function(parentObj) {
        parentObj.registersHL &= 64511;
    },
    function(parentObj) {
        parentObj.registersHL &= 65531;
    },
    function(parentObj) {
        parentObj.memoryWriter[parentObj.registersHL](parentObj, parentObj.registersHL, parentObj.memoryReader[parentObj.registersHL](parentObj, parentObj.registersHL) & 251);
    },
    function(parentObj) {
        parentObj.registerA &= 251;
    },
    function(parentObj) {
        parentObj.registerB &= 247;
    },
    function(parentObj) {
        parentObj.registerC &= 247;
    },
    function(parentObj) {
        parentObj.registerD &= 247;
    },
    function(parentObj) {
        parentObj.registerE &= 247;
    },
    function(parentObj) {
        parentObj.registersHL &= 63487;
    },
    function(parentObj) {
        parentObj.registersHL &= 65527;
    },
    function(parentObj) {
        parentObj.memoryWriter[parentObj.registersHL](parentObj, parentObj.registersHL, parentObj.memoryReader[parentObj.registersHL](parentObj, parentObj.registersHL) & 247);
    },
    function(parentObj) {
        parentObj.registerA &= 247;
    },
    function(parentObj) {
        parentObj.registerB &= 239;
    },
    function(parentObj) {
        parentObj.registerC &= 239;
    },
    function(parentObj) {
        parentObj.registerD &= 239;
    },
    function(parentObj) {
        parentObj.registerE &= 239;
    },
    function(parentObj) {
        parentObj.registersHL &= 61439;
    },
    function(parentObj) {
        parentObj.registersHL &= 65519;
    },
    function(parentObj) {
        parentObj.memoryWriter[parentObj.registersHL](parentObj, parentObj.registersHL, parentObj.memoryReader[parentObj.registersHL](parentObj, parentObj.registersHL) & 239);
    },
    function(parentObj) {
        parentObj.registerA &= 239;
    },
    function(parentObj) {
        parentObj.registerB &= 223;
    },
    function(parentObj) {
        parentObj.registerC &= 223;
    },
    function(parentObj) {
        parentObj.registerD &= 223;
    },
    function(parentObj) {
        parentObj.registerE &= 223;
    },
    function(parentObj) {
        parentObj.registersHL &= 57343;
    },
    function(parentObj) {
        parentObj.registersHL &= 65503;
    },
    function(parentObj) {
        parentObj.memoryWriter[parentObj.registersHL](parentObj, parentObj.registersHL, parentObj.memoryReader[parentObj.registersHL](parentObj, parentObj.registersHL) & 223);
    },
    function(parentObj) {
        parentObj.registerA &= 223;
    },
    function(parentObj) {
        parentObj.registerB &= 191;
    },
    function(parentObj) {
        parentObj.registerC &= 191;
    },
    function(parentObj) {
        parentObj.registerD &= 191;
    },
    function(parentObj) {
        parentObj.registerE &= 191;
    },
    function(parentObj) {
        parentObj.registersHL &= 49151;
    },
    function(parentObj) {
        parentObj.registersHL &= 65471;
    },
    function(parentObj) {
        parentObj.memoryWriter[parentObj.registersHL](parentObj, parentObj.registersHL, parentObj.memoryReader[parentObj.registersHL](parentObj, parentObj.registersHL) & 191);
    },
    function(parentObj) {
        parentObj.registerA &= 191;
    },
    function(parentObj) {
        parentObj.registerB &= 127;
    },
    function(parentObj) {
        parentObj.registerC &= 127;
    },
    function(parentObj) {
        parentObj.registerD &= 127;
    },
    function(parentObj) {
        parentObj.registerE &= 127;
    },
    function(parentObj) {
        parentObj.registersHL &= 32767;
    },
    function(parentObj) {
        parentObj.registersHL &= 65407;
    },
    function(parentObj) {
        parentObj.memoryWriter[parentObj.registersHL](parentObj, parentObj.registersHL, parentObj.memoryReader[parentObj.registersHL](parentObj, parentObj.registersHL) & 127);
    },
    function(parentObj) {
        parentObj.registerA &= 127;
    },
    function(parentObj) {
        parentObj.registerB |= 1;
    },
    function(parentObj) {
        parentObj.registerC |= 1;
    },
    function(parentObj) {
        parentObj.registerD |= 1;
    },
    function(parentObj) {
        parentObj.registerE |= 1;
    },
    function(parentObj) {
        parentObj.registersHL |= 256;
    },
    function(parentObj) {
        parentObj.registersHL |= 1;
    },
    function(parentObj) {
        parentObj.memoryWriter[parentObj.registersHL](parentObj, parentObj.registersHL, parentObj.memoryReader[parentObj.registersHL](parentObj, parentObj.registersHL) | 1);
    },
    function(parentObj) {
        parentObj.registerA |= 1;
    },
    function(parentObj) {
        parentObj.registerB |= 2;
    },
    function(parentObj) {
        parentObj.registerC |= 2;
    },
    function(parentObj) {
        parentObj.registerD |= 2;
    },
    function(parentObj) {
        parentObj.registerE |= 2;
    },
    function(parentObj) {
        parentObj.registersHL |= 512;
    },
    function(parentObj) {
        parentObj.registersHL |= 2;
    },
    function(parentObj) {
        parentObj.memoryWriter[parentObj.registersHL](parentObj, parentObj.registersHL, parentObj.memoryReader[parentObj.registersHL](parentObj, parentObj.registersHL) | 2);
    },
    function(parentObj) {
        parentObj.registerA |= 2;
    },
    function(parentObj) {
        parentObj.registerB |= 4;
    },
    function(parentObj) {
        parentObj.registerC |= 4;
    },
    function(parentObj) {
        parentObj.registerD |= 4;
    },
    function(parentObj) {
        parentObj.registerE |= 4;
    },
    function(parentObj) {
        parentObj.registersHL |= 1024;
    },
    function(parentObj) {
        parentObj.registersHL |= 4;
    },
    function(parentObj) {
        parentObj.memoryWriter[parentObj.registersHL](parentObj, parentObj.registersHL, parentObj.memoryReader[parentObj.registersHL](parentObj, parentObj.registersHL) | 4);
    },
    function(parentObj) {
        parentObj.registerA |= 4;
    },
    function(parentObj) {
        parentObj.registerB |= 8;
    },
    function(parentObj) {
        parentObj.registerC |= 8;
    },
    function(parentObj) {
        parentObj.registerD |= 8;
    },
    function(parentObj) {
        parentObj.registerE |= 8;
    },
    function(parentObj) {
        parentObj.registersHL |= 2048;
    },
    function(parentObj) {
        parentObj.registersHL |= 8;
    },
    function(parentObj) {
        parentObj.memoryWriter[parentObj.registersHL](parentObj, parentObj.registersHL, parentObj.memoryReader[parentObj.registersHL](parentObj, parentObj.registersHL) | 8);
    },
    function(parentObj) {
        parentObj.registerA |= 8;
    },
    function(parentObj) {
        parentObj.registerB |= 16;
    },
    function(parentObj) {
        parentObj.registerC |= 16;
    },
    function(parentObj) {
        parentObj.registerD |= 16;
    },
    function(parentObj) {
        parentObj.registerE |= 16;
    },
    function(parentObj) {
        parentObj.registersHL |= 4096;
    },
    function(parentObj) {
        parentObj.registersHL |= 16;
    },
    function(parentObj) {
        parentObj.memoryWriter[parentObj.registersHL](parentObj, parentObj.registersHL, parentObj.memoryReader[parentObj.registersHL](parentObj, parentObj.registersHL) | 16);
    },
    function(parentObj) {
        parentObj.registerA |= 16;
    },
    function(parentObj) {
        parentObj.registerB |= 32;
    },
    function(parentObj) {
        parentObj.registerC |= 32;
    },
    function(parentObj) {
        parentObj.registerD |= 32;
    },
    function(parentObj) {
        parentObj.registerE |= 32;
    },
    function(parentObj) {
        parentObj.registersHL |= 8192;
    },
    function(parentObj) {
        parentObj.registersHL |= 32;
    },
    function(parentObj) {
        parentObj.memoryWriter[parentObj.registersHL](parentObj, parentObj.registersHL, parentObj.memoryReader[parentObj.registersHL](parentObj, parentObj.registersHL) | 32);
    },
    function(parentObj) {
        parentObj.registerA |= 32;
    },
    function(parentObj) {
        parentObj.registerB |= 64;
    },
    function(parentObj) {
        parentObj.registerC |= 64;
    },
    function(parentObj) {
        parentObj.registerD |= 64;
    },
    function(parentObj) {
        parentObj.registerE |= 64;
    },
    function(parentObj) {
        parentObj.registersHL |= 16384;
    },
    function(parentObj) {
        parentObj.registersHL |= 64;
    },
    function(parentObj) {
        parentObj.memoryWriter[parentObj.registersHL](parentObj, parentObj.registersHL, parentObj.memoryReader[parentObj.registersHL](parentObj, parentObj.registersHL) | 64);
    },
    function(parentObj) {
        parentObj.registerA |= 64;
    },
    function(parentObj) {
        parentObj.registerB |= 128;
    },
    function(parentObj) {
        parentObj.registerC |= 128;
    },
    function(parentObj) {
        parentObj.registerD |= 128;
    },
    function(parentObj) {
        parentObj.registerE |= 128;
    },
    function(parentObj) {
        parentObj.registersHL |= 32768;
    },
    function(parentObj) {
        parentObj.registersHL |= 128;
    },
    function(parentObj) {
        parentObj.memoryWriter[parentObj.registersHL](parentObj, parentObj.registersHL, parentObj.memoryReader[parentObj.registersHL](parentObj, parentObj.registersHL) | 128);
    },
    function(parentObj) {
        parentObj.registerA |= 128;
    }
];
module.exports = CBOPCODE;

},{}],"jyqB4":[function(require,module,exports) {
//Number of machine cycles for each instruction:
module.exports = [
    /*   0,  1,  2,  3,  4,  5,  6,  7,      8,  9,  A, B,  C,  D, E,  F*/ 4,
    12,
    8,
    8,
    4,
    4,
    8,
    4,
    20,
    8,
    8,
    8,
    4,
    4,
    8,
    4,
    4,
    12,
    8,
    8,
    4,
    4,
    8,
    4,
    12,
    8,
    8,
    8,
    4,
    4,
    8,
    4,
    8,
    12,
    8,
    8,
    4,
    4,
    8,
    4,
    8,
    8,
    8,
    8,
    4,
    4,
    8,
    4,
    8,
    12,
    8,
    8,
    12,
    12,
    12,
    4,
    8,
    8,
    8,
    8,
    4,
    4,
    8,
    4,
    4,
    4,
    4,
    4,
    4,
    4,
    8,
    4,
    4,
    4,
    4,
    4,
    4,
    4,
    8,
    4,
    4,
    4,
    4,
    4,
    4,
    4,
    8,
    4,
    4,
    4,
    4,
    4,
    4,
    4,
    8,
    4,
    4,
    4,
    4,
    4,
    4,
    4,
    8,
    4,
    4,
    4,
    4,
    4,
    4,
    4,
    8,
    4,
    8,
    8,
    8,
    8,
    8,
    8,
    4,
    8,
    4,
    4,
    4,
    4,
    4,
    4,
    8,
    4,
    4,
    4,
    4,
    4,
    4,
    4,
    8,
    4,
    4,
    4,
    4,
    4,
    4,
    4,
    8,
    4,
    4,
    4,
    4,
    4,
    4,
    4,
    8,
    4,
    4,
    4,
    4,
    4,
    4,
    4,
    8,
    4,
    4,
    4,
    4,
    4,
    4,
    4,
    8,
    4,
    4,
    4,
    4,
    4,
    4,
    4,
    8,
    4,
    4,
    4,
    4,
    4,
    4,
    4,
    8,
    4,
    4,
    4,
    4,
    4,
    4,
    4,
    8,
    4,
    8,
    12,
    12,
    16,
    12,
    16,
    8,
    16,
    8,
    16,
    12,
    0,
    12,
    24,
    8,
    16,
    8,
    12,
    12,
    4,
    12,
    16,
    8,
    16,
    8,
    16,
    12,
    4,
    12,
    4,
    8,
    16,
    12,
    12,
    8,
    4,
    4,
    16,
    8,
    16,
    16,
    4,
    16,
    4,
    4,
    4,
    8,
    16,
    12,
    12,
    8,
    4,
    4,
    16,
    8,
    16,
    12,
    8,
    16,
    4,
    0,
    4,
    8,
    16 //F
];

},{}],"dyx3a":[function(require,module,exports) {
//Number of machine cycles for each 0xCBXX instruction:
module.exports = [
    /*  0, 1, 2, 3, 4, 5,  6, 7,        8, 9, A, B, C, D,  E, F*/ 8,
    8,
    8,
    8,
    8,
    8,
    16,
    8,
    8,
    8,
    8,
    8,
    8,
    8,
    16,
    8,
    8,
    8,
    8,
    8,
    8,
    8,
    16,
    8,
    8,
    8,
    8,
    8,
    8,
    8,
    16,
    8,
    8,
    8,
    8,
    8,
    8,
    8,
    16,
    8,
    8,
    8,
    8,
    8,
    8,
    8,
    16,
    8,
    8,
    8,
    8,
    8,
    8,
    8,
    16,
    8,
    8,
    8,
    8,
    8,
    8,
    8,
    16,
    8,
    8,
    8,
    8,
    8,
    8,
    8,
    12,
    8,
    8,
    8,
    8,
    8,
    8,
    8,
    12,
    8,
    8,
    8,
    8,
    8,
    8,
    8,
    12,
    8,
    8,
    8,
    8,
    8,
    8,
    8,
    12,
    8,
    8,
    8,
    8,
    8,
    8,
    8,
    12,
    8,
    8,
    8,
    8,
    8,
    8,
    8,
    12,
    8,
    8,
    8,
    8,
    8,
    8,
    8,
    12,
    8,
    8,
    8,
    8,
    8,
    8,
    8,
    12,
    8,
    8,
    8,
    8,
    8,
    8,
    8,
    16,
    8,
    8,
    8,
    8,
    8,
    8,
    8,
    16,
    8,
    8,
    8,
    8,
    8,
    8,
    8,
    16,
    8,
    8,
    8,
    8,
    8,
    8,
    8,
    16,
    8,
    8,
    8,
    8,
    8,
    8,
    8,
    16,
    8,
    8,
    8,
    8,
    8,
    8,
    8,
    16,
    8,
    8,
    8,
    8,
    8,
    8,
    8,
    16,
    8,
    8,
    8,
    8,
    8,
    8,
    8,
    16,
    8,
    8,
    8,
    8,
    8,
    8,
    8,
    16,
    8,
    8,
    8,
    8,
    8,
    8,
    8,
    16,
    8,
    8,
    8,
    8,
    8,
    8,
    8,
    16,
    8,
    8,
    8,
    8,
    8,
    8,
    8,
    16,
    8,
    8,
    8,
    8,
    8,
    8,
    8,
    16,
    8,
    8,
    8,
    8,
    8,
    8,
    8,
    16,
    8,
    8,
    8,
    8,
    8,
    8,
    8,
    16,
    8,
    8,
    8,
    8,
    8,
    8,
    8,
    16,
    8 //F
];

},{}],"kp9cl":[function(require,module,exports) {
module.exports = "data:;base64,w4UB%2F%2F%2F%2FAADDhQH%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F4fhXxYAGV4jVtXh6f%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8NgAP%2F%2F%2F%2F%2F%2Fw5UA%2F%2F%2F%2F%2F%2F%2F1PgPqACDN8H%2Fw%2FeoAIPHZ9cXV5c1PIs19G80qHM22%2F80kP81hPc34IyGs%2FzTws%2F46IAUhQP%2FL7q%2FgQ%2BBCPOCF4dHB8dn15fBB5gMg%2BvqlwKcgLPCk4EP63sCnKAX638DgQvCz%2FjogFCFK%2F37%2BQCgeNf6HMAfGCOBF6qXA4fHZIUD%2Fy64%2BD%2BBFr%2BqlwBju9fD7pygGPeD78RjbPv%2FqrcAY9v%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwDDUAHO7WZmzA0ACwNzAIMADAANAAgRH4iJAA7czG7m3d3Zmbu7Z2NuDuzM3dyZn7u5Mz5TVVBFUiBNQVJJT0xBTkQAAAAAAQEAAAEAnkFrw4UBzdE%2B8EHmAyD6RvBB5gMg%2Bn6gyfCfp8B7IaDAhicieo4nIj4Ajid3PgHgsdA%2BmTIyd8k%2BA%2FPgD%2BD%2FPkDgQa%2FgQuBD4KQ%2BgOBA8ET%2BlCD6PgPgQD7k4EfgSD5U4EkhJv8%2BgDI%2B%2FzI2dzH%2Fz68h%2F98OQAYAMgUg%2FA0g%2BSH%2Fnw4grwYAMgUg%2FA0g%2BSH%2F%2FgYAMgUg%2FCH%2B%2FwaAMgUg%2FA62BgwhfT8q4gwFIPqv4OQ%2BEeC06qjAPgLq3MA%2BDuCzPgPqACDqpMA%2BAOrhwOCazfN%2FPgLqACDg%2Ffod2v4DIAs%2B%2F%2Bod2s3oCc0tF%2FD94OE%2BA%2BD96gAgzfJH8OHg%2FeoAIPCfpyAIzcMH8LKnIDwhpv8GAn6nKAE1LAUg9%2FCfpygm8IDLXyAQ8KzmDyAaIdfAfqcoAzUYEPCzpyALPgLqACDg%2FT4O4LPNowJ28IWnKPqv4IUYhRj%2B8LPvEAalBsUGhAvNC2oMwgw3DEANEhYmFmMW0RZtIyIDwwS3BV8Fjj3OPTJYNViePjhYO1g%2BWEFY8A0MDigOVA6NDqAOxA4JDyoPYQ%2F0D0wQkBCgDg0RXBGLEccREhJLEpgSuRLoEoUT5xM4FFEUXRR%2FFNMUcxzfHOccFB2kBq%2FgQPPgpCEAwAafIgUg%2FOCZ6qXA6q3AIdjAIiIi%2BuHA4JohGnkRAJMBAAXNxwUhGn4RAIgBcAHNxwUhYkjwmv4BOAMhck4RwIoBEADNxwUhMlARAJABwALNxwUhMlARAIABoALNxwXNuAWv4OXw5PU%2BDODkzfAH8eDkPjwhAJjNWAUhBJg2lCEimDaVLDaWLDaMIS%2BYNj8sNkwsNk0hosARwsAGAxqWOAkgFR0tBSD1GA4hosARwsAGAzoSHQUg%2BhHCwCFpmc04PyEEwDZ4%2BqbApygp8Jr%2BAjgCGCEhRgQRxpkGCioSHAUg%2BiEAwDaALDaILPqmwHcsNgAsNoAsNigsNqyv4A8%2Bw%2BBA%2Bz4P4LOv4Pk%2BKOrXwOCfIdzANH7%2BA8A2AMkMGBcdEhceDiwr%2BgTA%2FngoS%2FqmwD3qpsD6qMDgtB4A%2FhEoMxz%2BEiguHP4TKCkc%2FiEoJBz%2BIigfHP4jKBoc%2FjEoFRz%2BMigQHP4zKAsc%2FkEoBhz%2BQigBHHvg5MM9Ba%2FqpsDwmv4C0j0FPhHgtK8Y6fqmwKcoFCEEwH7u%2BHcYC%2FCBR8tYIIbLUCDm8Jr%2BAjhFy0AoHfC0PEfmD%2F4EeCACxg3gtPDkPP4MIAU%2BEeC0r%2BDkIQjA8LQGeE%2Fm8Ms3cCw2eCwiLHnmD3AsNogsIixwLDaALDYp%2BtfAp8D63MDLJ18WACFSBRkq4LR%2B4OQ%2BUOrXwD4R4LOv4JrJPhHgs6%2FgD%2BCf6qTAPero3z4H4P%2FJEQASATMIBhQiBSD8ya%2FgQPPwn6cgDK%2FqoMDqocDqosDg%2Bs3QBc24BSEAnAZfPiwiBSD8zfgFPg%2FgRT4H4AchSv82hSw2YK%2FgBuAPPeCn4LE%2BW%2BDpzTkkzRE9zRIczU0c8LTNZA3JIf%2BbAQAEPiwyC3ixIPjJKhITC3ixIPjJITJQEQCQAQAIzccFITJAEQCAAQAQzccFIQNWEQDGBggqEiMTBSD5ySGHPxEAmAYCKhIce%2BYf%2FhQg9h4gBSDxyc2PIc03CPD94OE%2BA%2BD96gAgzfxIAQjCIWQhzQ1JARjCIWQhzQ1JASjCIWQhzQ1JATjCIWQhzQ1JAUjCIWQhzQ1JzZRKzYtJzepKzTxLzW9LzYpLzbVL8OHg%2FeoAIM0kH82IJPD94OE%2BAuD96gAgzURY8OHg%2FeoAIM2DGc3sFs2zF83hCs0kCs36HiHOwH6nyDXNCiHJIab%2FfqfAIQDRERAABgo2%2FxkFIPqv4Jk96qPAPgLgs8nzPgDgQM3LHs1VFiHl%2F%2FD5pygIr%2BD58PU8GAF%2B%2FgMoAT0BDAP%2BBzgfATQH%2Fgs4GAFcC%2F4POBEBhA%2F%2BEzgKAawT%2Fhc4AwHUF3AsNgB56qvAzfAHISuYNiws8LRH5vDLNyJ45g8sdyEAnBGDBwYJGiITBSD6r%2BCz6tPAPsPgQM2MB6%2FgD%2BCk6tLA4O7qHdrgBiEB2iI2BD4o6gDaPlvg6fDkDgr%2BBSgGDgz%2BCyANPg3gs%2FoDwubwseoDws1TJPvJLIQZCh4cDoQs%2BtPAp8A%2BA%2BoAIM3zf%2FD96gAg8PSnIA7w5CG3B18WABl%2B6ujfyT4E6ujfyQcHAwgIBQcDAwYGBfCA5g%2F%2BDyADw4UB8IHLX8jws%2F4O0CFA%2F%2FCy7gHgsigHy%2B4%2BAeDfycuuPgIY9yEUIREAwgZRKhITBSD68JmnKAU%2BEOoDwiHm%2F68GBiIFIPzgo%2BqqwD5A4OkGFPCz%2FgooCPDk%2FgwoAgYbxc2oIc1PIsEFIPXJ8JynKAM94JwR8P8GCiGQ0X7%2B%2FyAFGQUg98ng%2B33g%2FMXlAQoACU4sLH7gm%2FoBwkfwmf4CIAv6A8L%2BGCgEPv6AR3jgoPoBwsYG4KH6AsJH1gPgoj4CgOCP4eXNpgqnylgJ8Pz%2BkMpqCfD7%2FjPKzgnws%2F4NKAb608CnKAQtwzkJ%2BgLCxgZOLZE4evoCwtYGkDByRgUFBfoBwpAwaC0t5QEKAAnLfuEgeM0HCs34KacobyEKwjYALS02DS02ASEDwn7m8PYEdz4D6uDf%2BgLCxvzg6%2FoBwtYQ4OzwnuDt8JynKB3wnf4DKAM84J1H8O3%2BUCgNyycFIPvg7T4y4JwYIa%2FgnRj1LS3608CnICHwmf4DMA7NOyqnKAjwmacgC83oCeHByeHBw0wIzdcJGPPN%2FSqnKO0YkfD7%2FikoMv40KD7%2BKyhG%2Fi4g2fCZ%2FgIgJuC1PgTq4N8%2BEODt%2BgLCxvzg6%2FoBwtYQ4OwtLS02%2Fxiz8Jn%2BAijhPgHgmT5Q4KYY0j746tPAPgzq6N8Yyz7%2F4O0%2BCOrg3z4B6qPAGL%2Fg%2Fj4F6uDfGMQ%2BA%2BCZr%2BC1PlDgpj4G6uDfyfoH0KfAPgPgs6%2FgteAGPgLq6N8%2BgOoAwvoBwurdwMnl1fCb5sDLN8s%2Fyz9fFgAhIAoZfuCe0eHJAQQIUPDup8j%2BwMgREAAGCiEA0X7%2B%2FyAFGQUg98nF5QEKAAnLfiBaTiwsfuCb4eUsLEb6AcKQOElHPhSQOEP%2BBzA%2FLHnmcMs3T37GCA0g%2B09G%2BgLC1gaRMCj6AsLGBpA4IC0tLdXNBwrNGirRpygS%2BgLCxvzg6%2FoBwtYQ4OzwnuDt4cHDOAosLH7GCEfwoJAwLnnmD0d%2BBSgE1ggY%2BUfwoZA4HCzwj0aQOBV55nDLN0d%2BxggFIPtH8KKQMAM%2BAcmvyfoHwv4ByBEQAAYKIQDRfv7%2FIAUZBSD3ycXlAQoACct%2Byn8LfuYP4KAB%2BP8J8KBHfgUoBNYIGPlP4KD6AcLGBkd5kP4HMFgs%2BgLCR36QOAT%2BAzBL5SwsLCwsLCx%2B5nDLN0fhfsYIBSD7R%2FoCwpA4BP4DMCst8KDWCuoBwuUtLc34KeEBCQAJNgGvIQfCIiIiNgEhDMJ%2B%2Fgc4AjYG4cHJ4cHD9AohDMD63cBP1ghXdyz6AsLG%2BEciNg8sNgAscSxwLDYfLDYALHIseMYIRyI2Dyw2ICxxLHAsNh8sNiA%2BBOCzr%2BqswOCZ4PTNyx7J%2BqzAXzzqrMAWACEQDBlGeP5%2FIAn6rMA96qzABgIhDMARBAAOBHiGdxkNIPn%2BtNj6Hdr%2B%2FyAEPjsYBj6Q4KY%2BAeCzyf7%2B%2Fv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8A%2FwAA%2FwAAAAEAAAEAAQEBAQEBAQEBfyGm%2F36nKATNLRfJ%2BgfQpyAEPkDgpj4F4LOv6h3a4AbwtOYP%2FgPAzSEr8LT%2BQ8A%2BBuCzyfC05g%2F%2BAyAHr%2BqrwM2IJPCmp8AhAdoqRrAoND4B6gDa8P3g4T4C4P3qACDNRFjw4eD96gAgERAAzWYBPgHgpq%2FqHdr6AdrmAcA%2BCurg38k%2BBuCzPibgpsnwpqfAr%2Bod2uAG8LTmD%2F4DPhwoG%2FoBwv5gOAj%2BoDAEPggYCT4C4P3qACA%2BEuCzyeCzPgPqACDg%2FSHk%2F37g%2BzYMLK8iIuCjLCx%2B4OA%2BBuCm8LTm8P5AwK%2Fg%2Bz4B6t7APr%2Fg%2FD7%2F4KY%2BJ%2BCzzfN%2FyfN56gAg4P2v4EDN0AXDyg0hpv9%2Bp8D6%2Bd%2BnwPDkPP4MIAGv4OTwtDxH5g%2F%2BBHggAsYN4LTm8Ms3%2FgEOAijC%2FgIOASgI%2FgMOAygCDgFH83nqACDg%2Fa%2FgQHg9PcsnFgBfIeQN1RleI1YhAIoaIhPlATByCeEw9dEh6g0ZXiNW1SEQkxoiE3z%2BlyD44RHBAhkRAMYGCCoSIxMFIPmv4A8%2Bw%2BBA%2Bz4D4OWv6tLA4Pk%2BAuCzzTkkyTJAMkDyRwJEAkTCS%2FOv4EDN%2BAXNEhzNTRyv4A8%2Bw%2BBA%2Bz4I4LPgscnwpqcoDs2oIa%2Fqq8DNiCTNLRfJPkDgpiGz%2FzTJr%2BqrwM2IJPCmp8Dw4NYC%2FkAwAsYgbyaYESABGX3g4D4F4Pw%2BCOCmIbP%2FNMnwpqfA8Pw9KB3g%2FPDgbyaZ1iDg4PBB5gMg%2BjYsPgjgpj4L6uDfyT4Q4KY%2BA%2BD96gAgzfN%2FIbP%2FNMnwpqfAr%2BrSwOoHwjzg%2BSGz%2FzTJzbIO%2BgLC%2FsDYPiDgpiGz%2FzTJPhDggPoDwuYP%2FgrcsxfN7BbJ8KanwM3eDq%2Fg6uCjPqHgpj4P6ujfIbP%2FNMkhAcI2fiw2sCx%2B5vB3IRDCERQhBhAaIhMFIPohEcI2fiw2ACw2IiwsNiDJ8KanKBMhpP80zY8hIQLCNSESwjXNLRfJ8Pvg5CGz%2FzTJPhDggM2zF83sFvoCwv5M2PoDwubw6gPC8ODWQMYER%2Bbw%2FsB4IALWIODjPpjg4q%2Fg%2ByGz%2FzQYvCHYD82BD%2F7%2FwCGz%2FzQ%2BgOoQwj4I4KY%2BCOD7PhLq6N%2FJ8KanwPD7XxYAGX5H%2Fv4oNP7%2FyPDiZ%2FDjb%2FBB5gMg%2BvBB5gMg%2BnAjfODifeYPIBLLZSAOfdYg4OMce%2BD7Pgzgpsl9GPIjKk8GAH718OJn8ONvCcETExjCHREKFxQsIhgeLBYKGxIYI%2F5zGBEoLA0KEhwi%2F%2FCmp8Dw%2Bz0oGeD75gEhLBAgCCE8ED4D6vjfzSAQPgjgpskhEMI2ACGz%2FzTJERzABhAqEhwFIPrJeFgGAHhgBiCAWAZAgGAGYHhYBwB4YAcggFgHQIBgB2DwpqfAIRPCNiABGMIhZCHFzQ1J4S1%2BpyALNgEhE8I2IT5A4KbwrOYBIAkhEsI0fv7QMATNLRfJIbP%2FNhI%2BAuD96gAgyfCnpyAJPgHq%2BN8%2BIOCnr%2BqrwM2IJPCmT%2BYDIBPw%2B%2B4B4PsG%2FCgCBgT638CA6t%2FAef6A0OYfwCHQjQEgAvD8V%2FBB5gMg%2Bn6iX%2FBB5gMg%2BnMjfP6PIAMhkJbLCgt5sCDg8PzLJygJyzfg%2FD4%2F4KbJr%2BrfwOrSwDzg%2BSGz%2FzTJ86%2FgQOD5IQCcAQABzb4FzQgIzd4OIQLCNjgsNhAhEsI2eK%2FgD%2BCk6t%2FA4PshAMAGDCIFIPzNLRc%2BmODiPqXg4z4P6ujfPsPgQPshs%2F80ySF6Ec2BD%2F7%2FwK%2Fg%2Bz6Z4OI%2BAuDjPiPqE8Ihs%2F80yRgRKCwNChIcIv4bDQoSHCL%2FIbYRzYEP8KzmA8AhEsJ%2B%2FkQ4BTXNLRfJIbP%2FNCEwwDZwLDY6LDaELDYAyR0RChcULCIYHiwWChsSGCP%2F8KzmAcAhMMA1Kv4gOBTw%2B6d%2BIAc1%2FjDQ4PvJNP5Q2K8Y9jbwBm0hpZjwQeYDIPrwQeYDIPo2LCMFIO6v4Ps%2BmeDiPgDg4yGz%2FzTJITYSzYEP%2Fv%2FAIRPCNiQsLDYAIUHCNn4sLDYoLCw2ACGz%2FzTJKSIYHhssGh4OHB0sEhwsGB8OGyn%2F8KzmAyAHIRPCfu4BdyFAwn6nICAsLDV%2B%2FlAgBz6A6gDCGBH%2BQCANPoDqEMI%2BQOCmIbP%2FNM2yDs2PIfDl%2FgPA8OanwCFAwjYALCw2wMnwpqfAIUDCEQDCBgYqEhwFIPohA8I2JiFBwjbwIbP%2FNMnNLRfwrEfmAcAhQMI2%2FyEBwjUq%2FlgoBM3dEskhs%2F80PgTg%2B8nwrOYDwCx%2B7gF3yc0FE82PIfCkPMwPEzzMDxPgpPrp36fAPhHq6N%2FJIQLCzd0SzS0XyfXw%2Bz3g%2ByAs4EU%2BIeD7PlTg6c1FEyEQwhF2E81tEyEgwhF7E81tEyEwwhGAE81tEyGz%2FzTxySGwwAYQPiwiBSD8PgHg6gYC8OnWIG8mmPBB5gMg%2BjYsfdYgbwUg8ckGBRoiEwUg%2BskAMNApgIBwECqAgEBwKYDNRxXwpDw84KTmCEfwo7jA7gjgo81FE%2FD7PeD7wK%2FgpD5g4EUhThV84OJ94OM%2B8OCmIbP%2FNMkhEsIREAAGAzV%2B%2FgEgBDb%2BGBX%2B4CAR5fAELYbmf%2F5oMALmPzI2AOEZBSDdyc1HFfCmp8Dw4mfw428RQpp%2B%2Fv4oHCNH8EHmAyD68EHmAyD6eBITe%2F5UKAr%2BkygMGN8GLBjiEYeaIxjVI37%2B%2FyAFPv%2Fq3sB84OJ94OMhs%2F80yc1HFfCs5gPAId%2FANH7%2BIMAhs%2F80PlDgpsnNRxXwpqfAIbP%2FNMnNRxXwrOYDwCHfwDR%2B%2FlDAr%2BrfwPrewP7%2FPjMgAj434LPJzUcVIQLCNH7%2B0MAtNvDlzS0X4S02%2FyFwwBG7FAYYGiITBSD6BhivIgUg%2FD6Q4KbwmjzgmurhwCGz%2FzTJTsxSAE7UUwBO3FQATuxUAE70VQBO%2FFYAzUcV8KanwCFxwH7%2BPCgENTU1ySF1wH7%2BRCD0IXnAfv5MIOwhfcB%2B%2Flwg5CGBwH7%2BZCDcIYXAfv5sINTNIBWv4OTgmeC16qbAPhHgtMnwgafIzfN%2FPgLg%2FeoAIOrcwOqkwK%2FqANrqpcDqrcA%2BA%2BD%2FPg7gs8nNBRPNuxPJGRsYDR4MDhv%2BECMiGBQYEv4NEhsODB0YG%2F4cIxgUCg0K%2FhkbGBAbChYWDhv%2BFiMiChYKFhgdGP4ZGxgQGwoWFg4b%2Fh0jEQobCg0K%2Fg0OHBIQF%2F4RIxYKHRweGBQK%2FhwYHhcN%2FhEjHQoXChQK%2FgoWEg0K%2FhYjIgoWChcKFAr%2BDQ4cEhAX%2FhYKHBESFhj%2BHBkODBIKFSwdEQoXFBwsHRgl%2Fh0KFBL%2BEiceHBES%2FhcKEAodCv4UChcYEf4XEhwREicKIAr%2B%2FyEBwvD4vigFNM3sFsk%2BCuCz4PnJ86%2FgQODmzcsezVUW8PTg5c3wB81TJCEBwjYgLDYdLCw2AK%2FgD%2BCz4KQ%2Bw%2BBA%2B8khP8oBQAKvMgt4sSD5yfCs5gHIIQLC8Pi%2BOAk0IQvCNM3sFsnz8PXg5a%2FgQODmzVUWIfT%2FIiLw91fw9l%2FVzfAH0T6A6gTCIQHCeiLWEuD4e3fw5dYERwcHB4CAxgzqq8Cv4A%2FgpD5b4OnNUyTNyx4%2Bw%2BBAPgzgs82MB%2FvJ8KzmAcghAcLw%2BL4oBTXN7BbJr%2BCz6gTC4PnJzS0X%2BgrCpygu%2BgPC5g%2F%2BCjAlIQvC%2Bg7C%2FiN%2BKB7mAyAWIQPCfv4YKA40fuYP%2FgQ4Bn7m8PYBd80dHcnmASD4GOA%2BDOCOIQDCPsDgjT4F4I%2Fw%2FeDhPgPg%2FeoAIM0jSPDh4P3qACDJ8LP%2BDtIVGMM8G%2FCAy3%2FKVBgB4P984LB94K98xjBnEfT%2FfqfKVBgSHAl%2BEhwJfhIcCX4SHNXN%2Fj7RIQHCKsYQEvCkR%2FCukMYIIiw2gD4J4LP608CnIAU%2BBOro383LHsNUGCEHwn7%2BAcghAcIqxgvgrfCkR36Axv7grs1TAf5wKIr%2B4cpSF%2F5gMDr6DsIGBP4EIAj6B8KnIAIGCPCugOCuzVMB%2FmAwHSEHwn7%2BAsghAcI0NDQhCsI2APoOwqfAPgLqDsLJ%2Fu31IB%2F608CnIBnwmacoDv4EKBD%2BAiAM8c3XCRgh8c3oCRgb8f70IBbl0SHu%2F36nILE2wCxyLHM%2BBerg3xikIQHCfj095vz2BnevIQfCIiIiNgEhDMJ%2B%2FgfYNgbJ8O6nwOV8xjBnfuGnyPDup8DlfMYwZ37hp8rYGf7wKCX%2BwCAoPv%2FqzsDw7qfAPgXq4N%2F6AcLWEODsPsDg7eD%2B%2Bs7ApyBjPoDqLsAYcOCgPoDqLsA%2BB%2Brg3%2BXRIe7%2FfqfANgIscixzeuCwe%2BCvesYwVxrgoM3%2BPiEswPoBwtYLIuDC4PHwpEfwruDykCLgwyw2APCg%2FvDI%2FiggCvCZ%2FgI%2BKCACPi3NRCXJ8O6nwD6C6i7A%2BuDfpyAFPgfq4N%2Fl0SHu%2FzYCLHIsc3rgsHvgr83%2BPiEswPoBwtYLIuDx8KRH8K5P4PKQIiw2AODryfDup8DlfMYwZ37hp8KSGD4F6uDfPoHqLsD6AcLWEODsPsDg7Rir%2BgfC%2FgHAIQHCKsb94K3wpEaAxgLgrs1TAf5fynIY%2FmAwEfCuxvzgrs1TAf5fynIY%2FmDYzWIap8j%2BgigZ%2FvTKThr%2BgSiV%2FoDKfxg%2BAuoHwj4H6uDfyeV8xjBnfuH%2BwMqbGPCZ%2FgLCGhnl0SHu%2F36nwDYBLHIscyEQwhEQAAYE5TYALPoBwsbzdyz6AsLGAncsLCwsLDYBLDYH4RkFIOAhIsJ%2B1gR3IULCftYEdyE4wjYLIUjCNgvwpODzPgLq%2BN8RUADNZgE%2BAuoHwsnl0SHu%2F36nwDbALHIscz4F6uDfyeX1R%2FC05vDLNz3LJ18WACGKGhleI1Ya%2Fv0oBrgoBhMY9fHhyfHhr8mUGpkanhqgGqIaaGlqfP1gYWN8%2FXz9fP18%2FfCz%2Fg4wWREBB%2FCZ%2FgIgCvoDwv4YKAMRAgchAcIqguCt%2BgXCRg76pyACDgZ5gEfwpIDgrtXNUwHNYhrRpygc%2FmA4GP70KBv%2Bdygs%2FvIoSiELwjQ%2BAuoOwj7%2FyRb8HSC6r8nl0SHu%2F36nwDbALHIscz4F6uDfr8nw%2Baco0z4L4LM%2BgOoEwiECwjrGGOD4fub4xgZ3zcsePv%2FJ8Jn%2BAgb%2FKAUGD6%2FgmfoDwqDqA8JH5g%2F%2BCjAGeObw6gPCPgfgs%2FoH0KcgCT4B6ujfPvDgps3LHq%2FqAMLqHdrgBsmv6uLA8P6nxPYbIe7%2Ffv4BKCL%2BAsruG%2F7AKBn%2BBMA2ACxWLF76LsD%2BgigH%2FoHM9hs%2BfxLJRjYALFYsXj4sEnj%2BwCgyIeD%2FGX7%2B9MA2LD4F6uDffOCwfeCvzf4%2B8KRH8K6Q4OvwrcYU4Ow%2BwODtzfYbyTYDGMLN9hvJ8J%2BnwNXlEQABzWYB4dHw%2BsYBJ%2BD6pyAEPOqjwPD6R%2BYP6iqYeObwyzfqKZiv4P486uLAyfCfp8D6o8C3yP7%2F%2BhXaKDL%2BmSgg9T4I6uDf4NPxxgEn6hXa%2BhXaR%2BYP6geYeObwyzfqBpiv6qPAyT454LPqpMAY8qco9NYBGNYhAJwRzhwGERpP8EHmAyD68EHmAyD6cSwTBSDsPhDq6N%2FwtOqowPqiwObwyzdH%2BqbAgP4KOAI%2BCeqmwCEAwK8GoCIFIPzqHdrgBiFK%2FzaPIzYHPv%2Fg%2ByGz%2FzTJLCwsLCwQChYOLCwYHw4bLCz6rcCnxCcVySEAnBELHQ4JGkfwQeYDIPpwLBMNIPIhQP%2FL7j6g4KYhs%2F80ySwdEhYOLB4ZLPCmp8A%2BAeCzySENwn7%2BASAMLX6nIAUsNgAYOTXJIQzCKv4GIAcsfqcgAjYCEQfC8IDLfyA1y2cgVstvwjceIQzCfqcoCa%2FqDsI1LH4Y5yw2ABqnwPoHwqfAIQPCfubwdz4B6gvCr%2BoOwsn18Jn%2BAiAVGqcgET4Y6gPC8IDmMCAJ%2BgzCpygD8Risr%2BoMwvHJIQ3Cfv4gIAPDPx4hBcI2AM2kGqfA8IDLZygd%2BgPC%2FhggCvoDwubw9gHqA8IhDMJ%2B%2FgYoBDQsNhAhAsLw%2BacgNfrSwP4HOAbwpOYMKCg%2BUL4wI82rHkchpP%2BGd82bHs2WLCEBwBEEAA4DfpB3GQ0g%2BSELwjTJzasehnfws%2F4NKPD60sCnKOrwpOb84KR%2B%2FqA438M8GyENwn7%2BECAZNgEtNgj6B8KnwCEDwn7m8PYFdz4B6gvCySEFwjYgzaQap8AhAsJ%2B%2Fg84LOXwgMtvKB36A8L%2BGCAK%2BgPC5vD2AeoDwiEMwn7%2BBigENCw2IOHNqx4vPIZ3IQvCNckhMcARBAAOCH6QdxkNIPnJ1eUhxR76DsJfFgD6D8LuAeoPwoNfGX7h0ckAAQEBAQLlxdUhHMAGNK8iBSD8IQDABgsiBSD84KngquCrIRDCERAABgQ%2BgHcZBSD70cHhyfCs5gPA%2BtPAp8j%2BASgRPerTwPoAwu6A6gDC%2Bunfp8Cv6tPA6gDCzYwHyQYBIan%2FEQHAKqcgCBwcHBwFIPXJ5dXFLfqpwKcoED3qqcDLRihiGjw8Ev6iOAevy4MSdxgwxgP1HRrgrfHNyR84Bn7m%2FPYCd8tWKCEaPT0S%2FhA42tYB4K0cGs3JHzgGfubz9gh3wdHhzQEgGJ8aPDwS%2FqgwucYE4K0cGs3JHzjlfubz9gR3GN0aPT0S%2FgQ4ntYC9R0a4K3xzckfOKt%2B5vz2AXcYo0fwpIDgrtXlzVMB%2FvQgGvCz%2Fg0oHuXRIe7%2FfqcgFTbALHIscz4F6uDf%2FoLMjiD%2BgMyOIOHR%2FmDJ5dXFBgohANF%2B%2Fv8gEtUREAAZ0QUg8sHR4cnh0cEY7sXV5QEKAAnLfiDwTiwsfuCbGuCixgTgjx0a4KAaxgPgoeHlzaYKpyjSLS0tzQcK1fCz%2Fg0gBc2kKhgDzV8q0acoufUa1gjg7Bwa4Ovx%2Fv8gCT4D6uDf8J7g7a8SHRIhq%2F%2FLWyAGLctTIAEtdxiN5cXV9fCz%2Fg0gbeXRIe7%2FfqcgZDYBLHIsc%2FH1%2FoAgC3rGMFcapygDzUQlIRDCERAABgTlNgAs8K3GAHcs8KHGAHcsLCwsLDYBLDYH4RkFIOIhIsJ%2B1gR3IULCftYEdyE4wjYLIUjCNgvwpODzEVAAzWYBPgLq%2BN%2Fx0cHhyfCfp8j628DggMkAhjIAAAAAAAAAAAAAAAAAAQAADwAAAAAAAAAAAAAAAAEAAA8AIAAAAAAAAAAAAAABAAAPAAAAAAAAAAAAAAAAAQAADwAgAAAAAAAAAAAAAAQEAwMCAgICAgICAgIBAQEBAQEBAAEAAQAAfz4D4OrwpEf6qsC4yK%2Fg6snw6qcg6%2FCk5ggho%2F%2B%2BwH7uCHenIAQhq8A0BhAhsMA%2BLCIFIPzw5qcoCPDnZ%2FDobxgfIQBA8OSHXxYAGV4jVtXh8OWHXxYAGSr%2B%2FyhHX1bV4Sr%2B%2FihDEbDAR%2BbwyzeDX3jmDyACPhBHKv79KEoS%2FnAgBc2gIhgX%2FoAgBc0YIxgO%2Fl8gBc0YIxgF%2FoHMGCMcBSDWGL0h0sA0yXzg533g6PDmPP4UIAUh5f80r%2BDm8KTqqsA%2BAeDqyX4SHAUg%2ByPD3yHw6v4BwPDpbzz%2BYCACPkDg6SaYEbDABhDlfMYwZzYA4Rp3%2FnAgBc30IhgX%2FoAgBc1aIxgO%2Fl8gBc1aIxgF%2FoHMWiMc1REgABnRBSDMPgLg6snl1cXw%2BacgSPD94OE%2BA%2BD96gAg8OSHXxYAIRxlGV4jVtXh8OW%2BKA1%2B%2Fv8oHSMjIyMjIxju8OYjviDzIxH0%2FyoSHCoSHCoSHH4S8OHg%2FeoAIMHR4cnw9KfI5dUR4P%2F1fMYwZ%2FF38PUZd%2FD2GXfw9xl3r%2BD04PXR4cnl1cXw%2FeDhPgPg%2FeoAIPDkh18WACE2ZRleI1bV4fDlvigKfv7%2FKBAjIyMY8fDmI74g9iN%2B6s3A8OHg%2FeoAIMHR4cn6zcCnyOX1fMYwZ%2FF3r%2BrNwOHJ8LKnwM2PIc2yT%2FoH0KfEPBvNNwjN7E%2FNGFHw%2FeDhPgPg%2FeoAIM2LSQEYwiFkIc0NSQEowiFkIc0NSQE4wiFkIc0NSQFIwiFkIc0NSc3qSs2KS821S%2FDh4P3qACDNiCTw%2FeDhPgLg%2FeoAIM1EWPDh4P3qACDNLRfNXlHN%2Bh7wrOYDwPoDwu4B6gPCyfoU0KfI8LP%2BDdDwrOYHwPCsy18oBSEAxhgOIa8%2F8LTm8NYQDxYAXxkR0ZUGCCoSExMFIPnJAAABAQEAAAEBAAEAPgzqq8DNUySv6gfQIS0k8OQWAF8ZfuoU0MkhGkDw5AcWAF8ZKl9%2BV2Jr%2BqvAR364MAUjIyMY933qENB86hHQIQDRERAANv8Zff6gwn4kyc2SJM0%2FJs1fJcn6ENBv%2BhHQZ35H%2BqvAkMjYT8sx5SN%2B5h8HBwfGEODCKubAyzfG0JHgw83mJOERAwAZfeoQ0HzqEdAYxfoD0ODA%2Fv%2FIFgBfB4PLEl8hbDMZKuDHGBzwmqcgA8t%2BwH7mf%2BDAFgBfB4PLEl8hbDMZfuDHr%2BDE4MXgyODJ4MvwwBYAXweDyxJfIWwzGSMq4Mp%2B4Mz%2BwDgFPgvq6N8REAAGACEA0X48KAgEGX3%2BkCD1yXjN7izJIZDRd%2FDC5vjGB%2BqS0fDD6pPRzbIsPgvq4N%2FJr%2BoT0A4A%2BhPQ%2FhTQxXnLNyEA0W9%2BPCgdec3cLPDD%2FuA4Cj7%2F4MB5ze4sGAnwwv7AMPDNtyXBDHn%2BCiDKIVDA%2BhPQBwcWAF8Zff6g0rYlPrR3IyMjIxjxya%2FqANAhUMD6E9AHBxYAXxlETSHZL%2FDF5gEgAyGrMPDGBxYAXxkqX35XYmv6E9D%2BFNB%2B%2Fv%2FIy38gNQfLp%2BoA0H7LXygH8MLWCODCfstXKAfwwsYI4MJ%2By08oB%2FDD1gjgw37LRygG8MPGCODDIxjD8MICA%2FDDAgN%2BAgP6ANACAyP6E9A86hPQGKMhANF%2BPCgd5c3iLCGVNPDABxYAXxkqX35XYmvNbSbh5c30LOF9xhBv%2FqDCQibJ8MinKDrwx8tPKBHNsiswBvDCPODCyfDC5vjgwvDJ5vDLN0fwyeYPuCgHBMswsODJyfDJ5g%2FgyfDIPeDIw3Ao5RYA8MRfGX7qAtD%2B%2FyAGr%2BDE4Rjr8MQ84MT6AtDm8P7wKCD6AtDm4P7gIAr6AtDmD%2BDI4RiL%2BgLQ4ME%2BAeDI4cNtJvDEPODEI37qA9D6AtD%2B%2BCAI%2BgPQ4MbhGKT%2B8CB4%2BgPQ5sAoOMt%2FKBPwxeb9R%2FoBwk%2FwwpEXB%2BYCsODF%2BgPQy3coGvoCwk%2Fww0fwyuZwDw%2BAkRfmAUfwxeb%2BsODF%2BgPQ5gwoCB8fR%2FDFqODF%2BgPQy28oDOYC9v1H8MXLz6DgxfoD0MtnKAzmAfb%2BR%2FDFy8eg4MXhw6wm%2FvEgET4Kze4szc0kPgrN3Czhw6wm%2FvIgCfoD0ODH4cOsJv7zICT6A9DgwP7%2Fym4oIcD%2FzbIs4SGVNPDABxYAXxkqX35XYmvDrCb%2B9CAJ%2BgPQ4Mnhw6wm%2FvUgDPAE5gM%2B8Sid4cOsJv72ICD6AsJH8MOQxhT%2BIPoD0D0oAT84CPDEPT3gxOHJ4cOsJv73IAXNISvhyf75IAj6A9Dq%2BN%2Fhyf76IAj6A9Dq4N%2Fhyf77IBn6A9BP%2BgLCR%2FDDkLk4B6%2FgxOHDrCbhw6wm%2FvwgDfoD0ODCPnDgw%2BHDrCb%2B%2FSAI%2BgPQ6ujf4cnhw6wm4cnwweYPymwp8MXLRyBqzXsrMEPwx8tHKAXN2ys4RPDB5g9H8MOQ4MPwy6fKbCn6BcJPxT4g6gXCzaQawacgEPoCwpDqAsL%2BDzAFPg%2FqAsJ56gXCw2wp8MfmDP4AKMD%2BBCAJ8MXLx%2BDFw2wp%2FgzCbCmv4MTgyMNsKc2RKzBj8MfLRygFzfUrOGTwweYPR%2FDDgODD8MunKGb6BcJPxa%2FqBcLNpBrBpyAl%2BgLCgOoCwv5ROBr60sD%2BBzAZ%2BgLC1lBHPlDqAsLwpIDgpM2WLHnqBcIYK%2FCk5gwg4fCk5vzgpBjs8MfmDP4AKKD%2BBCAI8MXLh%2BDFGAn%2BDCAFr%2BDE4MjwwebwyvQp8MXLTyA%2FzRgsMBrwwebwyzdH8MKQ4MLwy6coZfoBwpDqAcIYXPDH5sD%2BACje%2FkDCrSnwxcvP4MUYR%2F7AIEOv4MTgyBg8zbIrMBrwwebwyzdH8MKA4MLwy6coJvoBwoDqAcIYHfDH5jD%2BACje%2FhAgCPDFy4%2FgxRgJ%2FjAgBa%2FgxODIr%2BDLyeV%2BXxYAbyYAyyPLEssjyxIZEX0xGX7hp8jld82yLD7%2F4cnlfl8WAG8mAMsjyxLLI8sSGRF9MRkjfuGnyHfNsiw%2B%2F8nlfl8WAG8mAMsjyxLLI8sSGRF9MRkjI37h%2Fv%2FIp8h3zbIsr8nlfcYMb37mPygXfj134X7%2BMigG%2FggoAhgFPgHq8N8%2B%2Fsnh5X5fFgBvJgDLI8sSyyPLEhkRfTEZIyMjfuGnyHfNsiw%2B%2F8nlfcYMb37mPygifj134X7%2BGigR%2FmEoDf5gKAIYDD4B6vjfGAU%2BAerw3z7%2ByeHlfv5gIAPqB9B%2BXxYAbyYAyyPLEssjyxIZEX0xGSMjIyN%2B4afId82yLD7%2FyeV%2BXxYAbyYAyyPLEssjyxIZEX0xGSMjIyN%2B4afId82yLD7%2FySEA0X7%2B%2FygV5TYnIyMjIzYAIyMjIyM2ACMjNgDhfcYQb%2F6gON4%2BJ%2BDAr%2BDE4Mc86vjfyfDDT%2FCkgcYE4K5P8MXLRxgI8MrmcA%2BB4K7wwuCtzVMB%2Fl%2FY%2FvA%2FyfDDT%2FCkgeCu8MLgrc1TAf5f2P7wP8nww0%2FwpIHGCE%2FwyuZwD4HWCOCu8MLgrc1TAf5f2P7wP8nww0%2FwpIHGBOCuT%2FDFy0cYCPDK5nAPgeCu8MLGCOCtzVMB%2Fl%2FY%2FvA%2FyfDDT%2FCkgcYD4K7wwsYI4K3NUwH%2BX9j%2B8D%2FJ8MNP8KSBxgVP8MrmcA%2BB1gjgrvDCxgjgrc1TAf5f2P7wP8nww0%2FwpIHGBOCuT%2FDFy0cYCPDK5nAPgeCu8MrmBz3LNw9P8MKR4K3NUwH%2BX9j%2B8D%2FJ8MNP8KSBxgPgrvDK5gc9yzcPT%2FDCkeCtzVMB%2Fl%2FY%2FvA%2FyfDDT%2FCkgcYFT%2FDK5nAPkdYI4K7wyuYHPcs3D0%2FwwpHgrc1TAf5f2P7wP8l4p8jww5Dgw%2BXVIQPRERAAfpB3GX3%2BoDj30eHJ5X4WAF8Hg8sSXyFsMxkqRypXfuEjIyMjNgAjIyNwIzYAIzYAI3IjI3fJyzchANFvEcD%2FBg0qEhMFIPrJyzchANFvEcD%2FBg0aIhMFIPrJkP8QkP%2BR%2FyCQ%2F0CTSJL%2FQJVIlP%2BXCJb%2FmQiY%2FxCXGJb%2FEJkYmP%2Ba%2FyCWKJf%2FEIkRiBiH%2FxCMEYsYiv%2BIAYkKh%2F%2BLAYwKiv8QnBGN%2F40BnP8gjSGc%2F5v%2FnRGd%2F54Rnv%2FvAe8B7%2F%2FdAd7%2FIJ0xnQqdEZ3%2FIJ4xngqeEZ7%2Fg%2F%2BE%2F4X%2Fhv9A4P%2Fl%2F0D2%2F0D3%2F0D4%2F%2F7%2F3%2F9A7v%2FvAe%2F%2FsAGxCqABof8QsRGwGqERoP8wwzHCOtMx0v%2ByAbMKogGj%2FxCzEbIaoxGi%2F7QBtQqkAaX%2FELURtBqlEaT%2FtgG3CqYBp%2F8QtxG2GqcRpv%2BoAan%2FEKkRqP8gqCGp%2F7gBuf8QuRG4%2FyC4Ibn%2F0AHRCsABwf8Q0RHQGsERwP%2FSAdMKwgHD%2FxDTEdIawxHC%2F9QB1QrEAcX%2FENUR1BrFEcT%2F1gHXCsYBx%2F8Q1xHWGscRxv%2FIAcn%2FEMkRyP8gyCHJ%2F9gB2f8Q2RHY%2FyDYIdn%2FrP%2Bu%2F6%2F%2FvQG%2BAb%2F%2FEL8RvhG9%2F7r%2Fu%2F%2FGAcf%2FIMYhx%2F%2FWAdf%2FINYh1%2F9A0EjA%2F0DRSMH%2FvAis%2F%2BL%2F4%2F%2FEAcX%2F1AHV%2F5%2F%2Fqv%2Bt%2F9j%2F2f%2B6AbsKqgGr%2F0Dm%2F7sKqgGrEar%2Fuwq6AasRuv%2B7CqwBqxGs%2F6wBrRGs%2FyCsIa0xrP%2FaAdsB3AoCygHLAcwBugoCAs0Bzv%2B7AdYB1woCqwHGAccBqgoCAs0Bzv8gqjGqCqoRqv8gqzGrCqsRq%2F%2B8Ab0KzgHPCr4BvwquAa%2F%2FzAHNCtoB2wrKAcsKugG7%2F0CISIf%2F%2BQH7%2F%2FkB%2Bv8Q%2BRL7%2FxD5Evr%2FzgHPCr4BvwquAa%2F%2FygHLCswBzQq8Ab3%2F0BHQCsARwP%2FREdEKwRHB%2F7oBuwG8Cqv%2FvQG%2BAb8Krv9gk2SS%2F2CVZJT%2FQMxBzUHOQc9KQkK8Qb1BvkG%2FSkJCrEGtQa5Br0rL%2F0DyQfNK8EHx%2F4wBjQGcCgKJAYoBi%2F%2FaAcgByQoCygHbAdz%2FAC0CLQUtBy0KLQ8tHC0hLSYtKC0tLTQtRy1QLVUtVy1bLV8tXy1lLWktci17LX0tfy2BLYMthi2ILYstji2RLZMtlS2YLb0uxS7NLtUu2y6kLb4tzy3gLe0t8i37LQAuDS4eLi8uQC5NLlIuWy5gLmUuZy5pLnEueC56LnwugC6FLokuji6TLpgunC6eLq0t4i73LqAupC4MLxUvHi8uL6guPi9LL1AvVS9hL20vdS%2BRLWkuqi5lLqwufS%2BFL40vki%2BuLrAuly%2ByLrYvvy%2FML7ouAC0CLQUtBy0KLQ8tFC0YLSYtKC07LUEtTC1QLVUtVy1bLV8tXy1lLWktci17LX0tfy2BLYMthi2ILYstji2RLZMtlS2YLb0uxS7NLtUu2y6cLbYtxy3YLekt8i33LQAuBS4WLicuOC5JLlIuVy5gLmUuZy5pLmsueC56LnwugC6FLokuji6TLpgunC6eLq0t4i73LqAupC4MLxUvHi8uL6guPi9DL0cvVS9hL20vdS%2BRLWkuqi5lLqwufS%2BFL40vki%2BuLrAuly%2ByLrYvvy%2FML7ouARH%2FEREAAAAAAAAA%2F%2F%2F%2FAAAAAAAFEv8SEgAAAAAAAAD%2FAAAAAAAAAAAA%2F09P%2F%2F%2F%2F%2F%2F8AAAAAAAAAAAAAAAD%2FAAAAAAAAAA8V%2FxUVAAAAAAD%2FAP8AJwAAAAAAAAAAAAAUAAAAAAAAAAAAAAAAAAAcGf8ZGf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8AAAAAAAAA%2FwBPAAAAAAAAAAAAAAAA%2FwAnAAD%2FAAAAAP8AAP8A%2FyEhAAAAAAAAAP8AAAAA%2FwAA%2FwD%2FACccGf8ZGQAAAAAAAAAAAAAAAAAAAAAoAAAAAAAAAAAAKgAAAAAAAAAAAAAAAAAAAAAAAAAA%2FycnAAD%2FJydAQf9BQQAA%2F09PAAD%2FAAAAAAAAAAAA%2FwAANwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPT7%2FPj4AAAAAAAAAAAAAQEH%2FQUEAAAAAAAAAAAAAQ0T%2FREQAAAAAAAAAAAAAAAD%2FAAAAAP8AAAAA%2FwAAAAD%2FAAAAAAAAAAAAAAAADQ3%2FAA1NAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD%2FAAD%2F%2F%2F%2F%2FJ%2F%2F%2F%2F%2F8nAAD%2FAAAAAP%2F%2F%2F1cV%2FxUVAAAAAAAAAP8AAP%2F%2F%2F%2F8nAAD%2FAAAAAAAAAAAA%2FwD%2FAAD%2FAP8AAP8A%2FwAA%2FwD%2FAAD%2FAE8AAP8AYgAAAAAABhEAAhEAAREAABEABxEAAhEAACIAAJEACTPEByKBALEAALEAAKEAAAAANCJBAiEAABIAABEAABEAAJEACJEAACEAByJAACEAACEAACIAUCTTACEAAiEAACJBACEAABEAACKCACIAABEAABEAACJB4CJBABEAACIAJBEABhEAJBEABhEABBEAABEAABEAACEAACEABiJAACPJAKIADBEAAJEAAJEAAJEAALEAALEAAKEAAKEAMBKCAhEAABEAACKAAiEAACEAACKAAiEAACEAABIAACIANKIAVCL%2FAJIAABEAABFAAJEAAJEAAJEAACIAABEAABEAACJAACJAABEAABFAtCKBAiEAABEAABGJABEAAEPAABEyABECABEFABECAEPYVDLTVCIAWzVlNW01lDWhNas1yjXaNeQ1AjYvNkE2UzZrNoo2wDbINvI29jb6Nv82ETcXNzI3TzdcN2I3cjd6N4Q3kDeYN6E3rTfEN8434jcUOGU4Zzh2OJE4mDizOLo4xDjRONk47jgwOTk5UjlbOXo5kDmUOag5uTnKOdw57jkvOjc6PTpUOlw6YjqGOo46lDqbOsE66DryOg87GTshOyU7NTs8O0g7TjtnO3o7vDvXO%2F47Kjw1PD08WjxkPHg8kTymPLo8zzzkPPw8%2BAD0AgHi%2BAHj%2F%2FgCAO%2Fv7%2FP%2F8CD4BADv9gAQ7wDv%2BAXv%2BATv%2BAXv%2BATv%2BAXv%2BATv8CIQ7wDv7%2B%2F%2F%2BB%2F0AgDv7%2FFH7%2B%2Fv%2F%2FQC%2BAYB4vgH4%2F%2F4CADv7%2FgO5PgI5PgO5PgI5PgO5PgI5PgO5PgI5PNG%2BGXwIvQBEO%2FwIBDvAO%2Fo%2F%2Fho9AHwIBDi8xPwMPQB%2BEgA7%2FhJAO%2F5BPEb6BDv5PkE8RvwIhDv5P%2F0A%2FhWAeL4V%2BL4VuL4V%2BL4VuL4V%2BL4VuL4V%2BL4VuL4V%2BL4VgDo%2BFf5BPFR6P%2F4EvQB8CIQ7u%2Fv7%2FAg7%2B%2Fv7%2F%2F4EvQB8BAB7u%2Fv6PAR7%2B%2Fv6P%2F4E%2FAi9A8A6vQAEO%2Fv7%2B%2Fv7%2B%2Fv7%2B%2Fv7%2F%2FwZBHlAREBEQEB8CIBAREBEQER5SDv7%2B%2Fv7%2B%2Fv7%2B%2F%2F%2BCjwYPQCAOT4KeT4KOT4KeT4KPBgQkIiIvgpEhISAvAi%2BCgCEhIS%2BCkiIkJC%2BChB7%2B%2Fv7%2B%2F%2F%2BCwA7%2B%2Fv8xX4QvAgIO74Q%2B%2F4Qu%2F4Q%2BgQ5wDj%2BELwIgDjEOcg5%2FhD7%2FhC7%2FhD7wDv7%2F%2F4A%2FMN%2BAnzDfhoAO%2F%2F%2BGjwIPQBEO7v7%2B%2Fo9A8A7%2FP%2F%2BQP4LfMN9ALwQPgyAej4M%2Bn4Mun4M%2Bn4Mun4M%2BnxF%2FMY%2BD5w8CAQ7ujwQBHuAe7wIhHuEOfwBBHuAe7v8%2F%2F4QADv7%2B%2Fv7%2B%2Fv7%2FMW%2BQP4N%2FMN%2BE8Q7%2B%2Fo%2BE4A6PkE8R%2Fv%2F%2FAw%2BB83RPMe9AH4NgDv7%2B%2FzGfgq8JD0AhLn%2BCvo%2F%2FhKAef4S%2Bj%2F%2BB%2FwMHBwQPNY%2BCjwCPQCEOP4KeT%2F8CJA8SLwIFBQYPEi%2BBQA7%2FgV7%2Fgf8%2F%2F4RfQBAeP4RuT%2F%2BEXwwPQBEu%2Fv7%2B%2Fv7%2B%2Fv7%2B%2Fv8%2F%2F4KvBgIO74K%2B%2F4KvBg7%2Fgr6BDnAOP4KvBi%2BQTxIwDjEOcg5%2Fgr7%2Fgq8EDv%2BCvvAO%2Fv%2F%2Fgy8CIA7%2B%2F0APYBEOj4M%2Bj4Muj4M%2Bj4Muj4M%2Bj4Muj4M%2Bj4Muj4M%2Bj4MvAg9AHo%2BDPo%2BDLo%2BDPo%2BDLo%2BDPo%2BDLo%2BDPo%2BDLo%2BDPo%2BDLo%2BDPo%2F%2FP%2F%2BBQA5%2FgV6PgU6PgV6PP%2F9AH4FvAxcBHlAREBEQEB8CIBAREBEQER5fMp%2BBb0AQHv%2F%2FQB%2BBfwMXAR5QERAREBAfAiAQERAREBEeXzK%2FgX9AEB7%2F%2F0AfgZ8DFAQPM09ALwIPgaEOP4G%2BPzLvgaAOj4G%2Bj%2F%2BCzwkfQBAe9B8TAB70HxMAHvQfMw8BD4LAHu%2BC7v%2BCzv%2BC7v%2BCzv%2BC7v%2BCzv%2BC7o8ID4LBDv8BH4LhDv%2BCwC7vgu7%2Fgs7%2Fgu7%2Fgs7%2Fgu7%2Fgs7%2Fgu7%2FP%2F9AT4Kgb4Kwb%2F%2BFT0AfEz8AQA5%2FhVBwUA7%2B%2Fv8ED4VAcF%2F%2Fgf8DByckLzR%2FgZ9ALwIDEh5BHkAREB8CIBEQER5CHkMTDv7%2B%2Fv7%2F%2F4IPAi9AH2ARDv7%2B%2Fv7%2B%2Fv7%2B%2Fv7%2B%2F%2F%2BCEA%2F%2Fgh8CIA5xDv7%2B%2Fv7%2B%2Fv7%2B%2Fv7%2B%2F%2F%2BBLwMvQCEe7v6PAxEe7v6P%2F4EvAw9AIR7u%2Fo8DMR7u%2Fo%2F%2Fgi9AHwIhDu7%2B%2Fv8CDv7%2B%2Fv%2F%2Fgi9AHwEAHu7%2B%2Fo8BHv7%2B%2Fo%2F%2Fgj9AHwYDEh4vgk5Pgl4hHh%2BCTkEfgjABEAEfgkAAHwIgEA%2BCURABEA%2BCQR4%2Fgj4yH4JOT4JeT4JDFA7%2B%2Fv7%2B%2F%2F%2BCYA7%2B%2Fv8z75A%2Fgn8w34KvBAAO%2Fv7%2B%2FwQO%2Fv%2BCv5BPEj7%2B%2Fv%2F%2FguAO%2Fv7%2FNB%2BQP4L%2FMN%2BDDwEAHo%2BDHo%2BDDo%2BDHo%2BDDo%2BDEA6Pgw6Pgx8UXo%2BDDo%2BDH%2F%2BDQA7%2B%2Fv80T5A%2Fg18w3wIvhEEO%2F%2F8BAE%2BQH4DwDk%2BBDk%2BA%2Fk%2BBDk%2BA%2Fk%2BBDk%2BA%2Fk%2BBDk%2BA%2Fk%2BBDk8%2F%2F4MfAg9AJCQiIi%2BEcSEhIC8CL4MQISEhL4RyIiQkL4MUHv7%2B%2Fv7%2F%2F0AfhMEe74Te%2F%2F%2BFHwIADvEO8A7%2B%2Fv7%2B%2F6CfFK7%2B%2FwIhDvAO%2Fv7%2F%2F4H%2FAwcDDwQPNL%2BFIB5%2FhT6P%2F4IQD%2F%2BCHwIADnEO7v7%2B%2Fv7%2B%2FzTvgh8BEC7%2F%2F5AfgUAO%2F4Fe%2F5Aff4H%2FCR81r4RvAxdPQAIO%2FoEO%2FwIhDvIO%2Fv7%2B%2Fv7%2B%2F%2F%2BDHwEPQBAu%2Fv5PCQIur6CfFQ%2F%2Fgz8JD0AQLj%2BDLk%2ByD4MkFBQTH4MzExESH4MhEREfgzEQEB8Aj4MgEBEfgzERER%2BDIhETEx%2BDMxQUFBAu%2Fv7%2B%2Fv%2F%2FhF9ANBQUFDMyMkFATwCBQUFDQzMkJBQPAE%2F%2Fhf8CL4XwDvEO8A7%2Fhg7%2Fhf7%2Fhg7%2Fhf7%2Fhg7%2Fhf7%2FAgEO8A7%2B%2Fv%2F%2Fgo8GD0AgDi%2BCni%2BCji%2BCni%2BCjwYEIyMiISEvAiEiIiMjJC%2BChB7%2B%2Fv7%2B%2F%2F9AL4LADv7%2B%2Fv81b4RQHj%2BEbk%2F%2FAI9AL4YRD4YhD4YRD4YhD4YRD4YhD4YRD4YhD%2F9AH4UhLn%2BFPo%2F%2F0T%2BB%2F0DwDv%2BGPwIPQCEO%2Fv7%2FNg%2BB%2FwEAT4ZPAg9AEB6PQA%2BB%2FxX0DxXkDzXfhF8DD0ASHq9ADoAujv7%2B%2Fv7%2B%2Fv%2F%2FhF8DD0AQHq9ADoAu%2Fv7%2B%2Fv7%2B%2F%2F%2BEXwMvQBIer0AOgC6O%2Fv7%2B%2Fv7%2B%2F%2F%2BGPxXPCQEO%2FvAe%2FxXPCREO%2FoAe%2F%2F9AH4ZhHj%2BGfk%2BGbk%2BGfk%2BGbk%2BGfk8VP%2F%2BQH4FADn%2BBXo%2BBTo%2BBXo%2BB%2F8qPNbITDABiCvIgUg%2FCEA2j4oIq8iPgQizXU9PiAiIiIiPvYiIiIiPjAirwYJIgUg%2FD4CIj0iryIiIiI%2BQCKvIiIiPkAirwYIIgUg%2FD4EIj4Rd8n6pMCnwPCz%2FhLQ%2BgDa%2FijAzXU9yREzmPoB2kfmDxIdeObwyzcSHfoC2uYPEskh6N8%2BCXev4EDgpCEAwAagIgUg%2FCEAmAb%2FDgM%2BLCIFIPwG%2Fw0g9xGLmPoV2kfmDxIdeObwyzcSPoPgQD4T4LPJr%2BBAIQCYPvUiBhI%2BnyIFIPw%2B%2FHcRIABrBhAOAj74dxkFIPsuMyUlBhANIPIhIJo%2B%2FyIGEj6fIgUg%2FD7pdyFFmD4LIj4YIj0iPh4iPhwiLD4QIj4KIj4WIj4OdyGHmD7kIiw%2BK3cu4T4tBhIiBSD8LtE%2BKyIuQSQ%2BLQYSIgUg%2FC4xPisiLqE%2BLQYSIgUg%2FC6RPisiLgEkPi0GEiIFIPwu8SU%2BKyIAAQLlAwEC5RFyPvAE5gM8Ez0g%2FCHSmAFgABp3Ewl9%2FlIg9z6D4EA%2BFOCzyQEgABEj2voY2mf6GdpvGncTCfoo2j3qKNog8z4E6ija%2BinaPeop2iDaPhHqKdo%2BFeCzyfCt1hDLP8s%2Fyz8RAABfIQCYBiAZBSD88K7WCMs%2Fyz%2FLPxEAAF8ZfOCwfeCvyfCwV%2FCvXwYEyxrLGwUg%2BXvWhOb%2BBwfGCOCt8K%2FmHxcXF8YI4K7J8LGnyPriwKfA8Or%2BAsgRosAhIJiv4LEOAxpHyzfmDyAo8LGnPgAgAj4sInjmDyAh8LGnPgAgCT4BuT4AKAI%2BLCIdDSDUr%2BCxyfU%2BAeCx8RjZ9T4B4LHxGOc%2BwOBGPig9IP3JFgobEhgrLCwsLCAYGxUNLB0SFg4sLCwsLCwsKissLCwBKQEsLAAAAAAAABA4OCgQAOCxW%2F%2F%2F%2F%2F9%2BPBgAAIFCpQDhM97%2F59v%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F7tV4lUFVrtV4lUFVrtV4lUFVjBWZVaUVrtVEVMFVNVUeVEiUptSEVMFVNVUEVMFVNVUDw8fGDswNyA%2FJzoqOSk%2FJvDw2DjsHPQM9OxUXJSc9GwAAA8PPzh7YHdAf0d6SnlJAADw8Pwc9g76BvrmWlaalgAAAwMHBwwMEh48POP%2FQ0MAAPj4gMDg4Ibm6%2Bkd8X1hAQEDAwYGCw8eHnF%2FJiYPCPz8wOBwcEBweHis5PTEdEQfHzIzelvzkv%2BMfHBwQD8%2FxsYu6n76vqK6onp6amqGhgAABwcYHyc4LzBcYFhgWGAAAAAAAwMMDxMcFxguMCwwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAQMCBwcICA0NHx%2F%2F8L%2BA%2BPjgIPiY8JD4iPAw4CDwMB8QDwkfERccHR8fFR0XDw3IONCw%2BIj4OLjo6Li46PCwPyYfEH9h37j7t7z0flokJPRs6Bj%2Bhvsd3%2B09L35aJCQDAgMCAwIBAQgIDAwEBwMDvyG%2BPrAw%2BHiA%2BPj4APDAwA8IDwgPCAcEIyMxMRgfDw98RHh4cHDwcIDw8PAA4MDAPz95af2NeWkfFg8IHBB%2Ff%2BDgG%2Fsv7c9JzU0rKzg4wMAAAAAAAAAAAAAAAAABAQcGAAA%2FP35Gf3mOit%2FZ%2Fvb8BAAAAAABAQEBAgIPDLexfn78xPiIeAjwEOAgwECAgAAAX0%2Fx8Q4OGRgQEBAQGRgHBvb2%2Fa31F%2F0P6h7qHss%2Fm38EBI6Kjorf0f%2Bv9ZWxkb%2BPGBh8ZP6i%2Fq61lbGRn49%2BfgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHBwkOGhwmJC4sJiQ%2FPwAA4OCQcFg4ZCR0NGQk%2FPwHBwkOGhwmJC4sJiQ%2FPwAA4OCQcFg4ZCR0NGQk%2FPwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHxwXEQoKDAwDAw0MERAhIP4G%2B4ux0anhW8F5x7mH8o4gICAgMTE5OT8mHxAPDwAAvIT8xLyE%2FMx4CPBwwMAAAAcHAQEBAQEBAAAAAAAAAAD9%2F3k%2FcT9meu7yjvJeYn5Gfn4QEHx8EBB8fDg4RER8fBAQfHwQEHx8EBAoKEREfHwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADI8clzSvLL8398UHHRsVGxMPE46Sz1NP%2Fv7KDguNio239%2FyvLLcUnw%2FPwoOOjYqNvv7Tz1NO0o%2B%2FPxQcFxsVGwHBxkeKiw%2FP7bY%2F%2F8UHFRs4OCYeFQ0%2FPxtG%2F%2F%2FKDgqNicgLyA%2FID4hPDMYHw8PAwPEvPj4cPAw8HDw2Oic5DzEAAAAAAAAAAAAAAAAAAAAAAEAAwAFAAkAAQADAAUACQD%2FPP9%2B%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FAAAAAAEBBwYOCB8fHBAfHzw8Vk7%2F%2FzkHfAP%2F%2F%2FwD%2F%2F8AAAAAgIDg4HDw%2BPg4%2BPj4HhYZGRkZHhYcEBwQPz%2FdzH4ZZiVmJX4ZfgF%2BAf%2F%2F72N4%2BJiYmJh4%2BDj4OPj8%2FB%2F%2FAwMHBA8IHxAeEDwgPz8gIP%2F%2FwwCHAA8ADwAfAP%2F%2FAAD%2F%2F8E%2F4B%2FwD%2FgH%2FAP%2F%2FwAAwMDg4HDwOPg4%2BBz8%2FPwcfEB%2Ff3%2BAgID%2F%2F%2F8QEAwMAwMA%2F%2F%2F%2FAAAA%2F%2F%2F%2FCDgw8MDAAP%2F%2F%2FwAAAP%2F%2F%2FxAQDAwDAw7%2B%2Fv4HPwf%2F%2F%2F8IODDwwMD%2F%2F%2F8A%2FwD%2FAP8A%2FwD%2F%2FwAAAAAAAAMDDAwQECAgICBAQAAAAACAgEBAJCQaGgEBBgAAAAAAAAAAAAAAAACAgEBAAQECAgQEDwgHBAMCAQEAAICAAADBAPcA%2FwD%2FQP%2FjPj4TAJkAwQDjAP8A%2F4B%2FQT4%2BQECgIOAgwEDAQICAAAAAAAAAAAAAEAAoABAAAAAAAAAA%2FwD%2FAP8A%2FwD%2FAP8A%2FwD%2FAP8AAAD%2FAAAA%2FwAAAAAAAAAAAAAAAAAAAAMADAAQACAAUgBSAEwA%2FwAAAAAAAAAAAEoASgAyAP8AAAAAAAAAAAAAAAAAAAAAAMAAMAAIAAQAQABAAD8AQAA%2FABAACAAHAAAAAAD%2FAAAA%2FwBIAIQAAwAAAAAA%2FwAAAP8AEgAhAMAAAgACAPwAAgD8AAgAEADgAAEAAgAPABAAPwBAAH8ATACAAEAA8AAIAPwAAgD%2BADL9%2B%2F37%2Ffv9%2B%2F37%2Ffv9%2B%2F0DAAAAAAAYACQAJAAYAAAAAAD%2F%2F%2F8AAAD%2F%2F%2F8AAOcYAADnGAAA5xgAAOcYAADnGAAAgACAAIAAgACAAIAAgACAAAAgAFAAkACgAJAAkABKAE0AVQBJACkAKgAqABQAFAAMAIMAxgBtAP8A%2FwD%2FAP8A%2FwD3AOMAwQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHx9%2Ff%2F%2F%2F%2F%2F%2F%2F%2F5mZmZnm5v%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2BZmZmZZmYAAAAAAAAAAAAAAAAAAAAA%2BPj%2B%2Fv%2F%2F%2F%2F%2F%2F%2F5mZmZlnZ%2B7u7u7u7u7u7u7u7gAAAAB%2Ff8DAoKCfn5iYlJT%2F%2F%2F%2F%2F%2Fv4DAwcH%2B%2FsbGzs7%2F%2F%2F%2F%2F39%2FwMCgoJ%2BfmJiUlJOTkpL%2B%2FgMDBwf7%2BxsbOzvb29vbk5OTk5SUn5%2Bfn6Cg%2F%2F9%2Ff9vb29s7O%2Fv7%2B%2FsHB%2F%2F%2F%2Fv4AgwDGAG0A%2FwD%2FAP8A%2FwD%2FPDx%2FZ%2F%2FM%2F5D%2FkP%2BE%2F%2F%2F%2F%2F3x8%2Fp7%2FM%2F8n%2FwP%2Fl%2F%2F%2F%2F%2F%2F%2Fyf%2Bd%2F%2F%2F%2F3%2F8c%2F3D%2F5%2F%2F%2Ffn7%2Fg%2F%2FJ%2F4H%2Fpf%2BD%2F%2F%2F%2F%2FwcHAwMDAAcBAwADADkZfx%2FAwDAw8HDwMPAQ6AjE5ODwAAADAwEBAQADAAEAAQAAAAAA4OCYmPg4%2BZn%2BDvAA4PAAAD8%2FQESz9%2Fez%2F4D%2FgP%2F%2FAACAgEBAIGAgYKBgoGCgYD8%2Ff0D%2Fu%2F%2BA%2F7%2FPzwcHBweAgEDAoOCgYOAg4KDgoOKiAAADAwMDBwEDAH8fQwEPDwAA4uIyMvw84ADw8Pj4%2FPwAAAcHHB83OCwweGBYYFlgAADg4Dj4nHzMPM4%2Bzj7OPgMDDAwQECQgKCAoICkhISH9%2FQcDAwEBAH18%2F%2F4%2FOr%2ByfQP7B%2F%2BE%2FLTczN%2FM3M%2FfzwAAYGD4uLykpKT8pLj4YGBHBwEAAQEBAQAAAAAAAAAA4PDw4Pi4%2FJzgAMDAYGBAQB8PPw8gAAAAAAAAAAAAAADw%2BPD4%2BHD42PjY%2BJhgYODgf0A%2FP0BB%2F%2F%2BBg%2F%2F%2FQEA%2FP0DAQcGDg4WH291m%2BvwM%2BPjPz%2F%2B%2Ff0A%2FPxAQHx8ICAcH4yPDQ8fFa%2B13%2B87yHCzw8D8%2FfkF%2FQP%2Be%2F4D%2F%2FP%2BAf38AAIGBQ8Pzc81%2F203v656eX2BPcG9wID8wPx8fBwcAAM4%2Bjn4e%2Fhz8fPz4%2BODgAAAjIxERDw%2Fn5Pe0%2B5uelJeXNzL9%2Ff%2F%2FDwA%2FPP%2F%2FxkW%2Bjf%2F%2Fz76%2FcXHhceHh%2FzH%2Fb%2F7j4%2FcVHR0dFf8VF%2F0d%2F%2F0fBwcPCh8RPyI%2FJD8oPyg%2FKAAAAAAwMHFR9pf4n%2FuP%2F4QPDxMTGxsTEz8%2FSEi%2FiP%2BJw8Pl5evp%2F%2FH%2F%2FzEx%2FR3%2F%2FwAAPDx%2Bfk5Obm5PS7%2Bwj4kAAAAAAAAAAPDwmPjuHv4SAAAAADw8fn5OTm5uT0u%2FsQAAcHBYeOjY6JjomMg43j4AAAAAAAAAAB8Azz%2Fw8AAACgYKBhIOdAzEPAj48PAAAAAABwcfGDggMCBgQGBAYEAAAAAABwcJCRUTLSNdQ72D9JT%2FlPeflf2Z%2BZDw4OAAAH5N%2Fnmcg5sHsw7nn358Bwfbh9uH24f%2F%2FzEP%2F%2F9xDv%2F%2F5%2BXDQ8DAgICAgMDAwMDAwB8Yj4jHx%2F39eXkDAwYGBAT%2FiH9IPzAPD3l58fHDw5%2BfnuqJ%2F0h%2FPz8HBwkJDw8HBwcFwsI8%2FODg0NDw8PDw0NC%2Fu8nPfH8HBwAAAAAAAAAAeg68nPDw4OAAAAAAAAAAAI%2BIv7jJznx%2FBwcAAAAAAACeerJ%2B7BwQ8ODgAAAAAAAAmZl%2BZmZCw4HDgWZCfmaZmRgYPDx%2Bfv%2F%2F%2F%2F9%2Bfjw8GBhgQGBAcEA%2BIBEeDg8BAQAAAAB%2Ff%2F%2BAgAAAAEFBQUEAAAAAAADw8PgIHAQMBAoGCgYAAAD%2FAIEAvQClALUAhQD9AAAAfgBCAFoASgB6AAIA%2FgCBAIEAgQCBAIEAgQCBAF4AAAACAEYAJgAUAAgACAAIAAQAAgBiAB0AAQAAAAAAAAAAAAAAAAAQABgAGAAJAAkABgAIABAALABHAMAAgACAAAAAAAAAAAAAAAAAAAgAFAAUACoAJgBVAEkAUQBjAFUAAQADAAUACQARACEAQQBe%2F%2F%2F%2F%2FwD%2F%2F%2F%2F%2F%2FwD%2F%2F%2F%2F%2F%2FwD%2FAP8A%2FwD%2FAP8A%2FwD%2FAP8AAAAeACEAQABAAKAAqACAAAAAAAAAAIAAgABAACAAIAABAAIAAgAEAAQABAAIAAgAEAAQABAAEQARAAoACgAMAAAAAADgABAACAAEAAQABAAIAAgAEAAUACUAJABAAIAACAAEABQAVAAEAAIAAAAAAIQAggAiAAIAAQABAAgAAAAQABAAEAAQABAACAAIAAgAFgApAEAEgF2APkEMMgAMAGgAlgABhADVAP8ANMsANAAAAMAAIIAQgGAAgAAAAAAAAAD%2FAP%2F%2FAAAA%2FwAAAP8AAAEAAQACAAIAAgAEAAQACAAHAAgAEAAQACAAQABAAEAAgABAACAAEAAQAAgACAAIAAAAAAAAAAAAAQABAAIAAgBAAEAAkACUAAAAAAAAAAAABAASABIAAQABAAEAAAAAAAAAAAAAAAAAAAAAAAAAAP37%2Ffv9%2B%2F37%2Ffv9%2B%2F37%2FQMAAAAfACAAQACAQIBAgCBAAAAABwDoABAACAAIAAAAAAAAAI8AUAAgACAAAAAAAAAAAACAAFgAJAAiAAEAAQIBIEAwQBAgHCAHGAAHAAAAAAAACAAIBHYI4xQA4wAAAAAAABAAMABpEN8gAN8AAAAAAgGGAaxCsEwAsAAAAAAAAAAAEAAQAP4AfAA4AHwAxgD%2F%2FwD%2F%2FwAAAP8AAAD%2FAAAAAAD%2FAAAA%2FwAAAP8AAP%2F%2F%2FwAAADwAZgDbAP8A%2FAB7AP8GAggINiLeyj4qDgoGAgAAAAAAAAAAAAAAAAAAAAAAAMfH72j%2FM%2FyH%2BP8A%2FwD%2Fg3zz8%2F88%2F4n%2B4zz%2FAP8C%2FY9wfn7%2Fg%2F%2B7%2F6P%2Fo%2F%2BH%2F%2F9%2BfuDg%2FDz%2Bin%2FnHf8B%2FwP9j3H%2FAf4C%2Fgb8BPwE%2Fgb%2FA%2F8BDw8%2FMH9H%2Bc%2Fw%2F4D%2FgP%2FHuP%2BA%2F8B%2FQH9Af2A%2FID8gf2B%2BfruJu4n%2F%2F7eRt5G3kf%2F%2Ffn6Pgb%2BBv4P%2F%2F35%2BAAAAAH9%2FwMC%2Fv7%2B%2Fv7%2B%2Fv4D%2F%2F%2F%2F%2B%2FgMD%2Ff%2F9%2F%2F3%2F%2Ff8D%2F%2F%2F%2Ff0B%2FQP%2F%2F%2F4D%2FgP%2BA%2F4D%2F%2F%2BYe5h7%2F%2F8c%2Fxz%2FHP8c%2F%2F%2F9%2FQH9Af0A%2FP39Af0B%2FQH9A5h7mHuYe%2FPzmHuYe5h7mHv%2F%2F%2F4HHhd%2Bd353%2Fvf%2BB%2F%2F%2FwrOYBwPrSwP4HOA3wpOYMIAfwpOb84KTJ8KQ84KQGAc2bHs2WLCECwjV%2BpyACNvAOCM3MUCECwjTJ8IDLdyBCy38gLPCAy2cgGMtvyA76zcxQIQLCfv4Q2DX60sD%2BB9A1yQ4IzcxQIQLCfv6g0DTJzYlQ%2Fv8ozSEBwn7%2BlDDFNBjCzUZQ%2Fv8ouyEBwn7%2BMDizNRiwIQHC8JkG%2FacoAgb8KoDgrfCkRoDGAuCuzVMB%2FmAwDPCuxvrgrs1TAf5g2P70KAM%2B%2F8nl0SHu%2FzbALHIscz4F6uDfySEBwirGCuCt8KRHfoDG%2FuCuzVMB%2FmAwE%2FCuxgTgrs1TAf7hyjwb%2FmAwAcn%2B9CAR5dEh7v82wCxyLHM%2BBerg38k%2B%2F8kRAgXwmf4CKAMRAQUhAcIqguCtRnmAR%2FCkgOCu1c1TAdH%2BYDgQ%2FvQoEv7hyjwb%2FoPKPBvhyRb9HSDSyeXRIe7%2FNsAscixzPgXq4N%2FJBgMhqf8RAcAqpyAIHBwcHAUg9cnl1cUtGjw8EuCh4MP%2BqTgHr8uDEncYE8YC9R0a4MLGBuCt8c3JHzgCGObB0eHNASAYxvoCwv4BOAP%2B8Niv4JngtTzgszzq6N8%2BkOCmyQ4TEBATEBENhBIEhBcLhBqTEBsFhByTECEJCyUGCyoPhC0MhC4TAC8FhDQTEDcTEDoTED0TEEATEEEIBEMTEEeTEEmTEEwTpE4TEFEHAFIHAFcEAFgEAFkEAFyTEF6TEGCTEGKTEGaTEGiTEGqTJGyTkG9OAnEPhHgHAHkHAH0LhH2HhH8EAIAEgIQTkIcTJIgIhIuTJI4PhJAICpgICpkQhJwFNpyFNv8MDBYSDIQWCwAXBwQdCwQiBwsjE6QnBwsqDQQxCRY2CQQ3DgA6CYA%2BCRZBDgBECYBGCQRICRZLDgBXjwRYDoRZDABbEyRgjxZlhQprCgtwDQRxE6RzEyR3SwJ4CYR5iwB6yQJ9BQR%2FBYSDE6SHhTaIAwuIiTaJjTb%2FDwWvGQ4vG1MQIw6dJQsdJwidKQUdLQgvL1MQOVMQOwUdPgWdQA0dQw2dQxMQSQcdTRMQTgcvVAggVwgdXwkgaQcgaQ0gcwcvdRMkeAwdfxMkhQogiAwviROkjg8dkg%2Bdmw0gnA%2BdpQegqA8drgtIrwrIsAwa%2Fw%2FMVRHRAhlRAhoL1hsPhBwPVh%2BJCiSHCywPhC1RSS8PVjcOhDmOBDoOVkAOVkEOBEOOBEoPVktRAk0LVk0PhFFRglNRAlRPAlXNSVtOAl4KVl6KBGJNAmNOyWcOOWsKOG%2FPAnHMVXPMVXXRAnnPSXvMVXwPgH3MVX4PAH%2FRAoPPSYXMVYfMVYgPhInRAoqGDI6NC5IGOJWFNpYFNpgFNpiFNpoGNpqGNp0GCqFRgqJRSaNRgqRPgqXNyaeJVq4OVq8OBLGOBLIOVrQJCsLRScTPScWKBMbJSc8FVs8IVs8OVtSQNtUQNtfRSdjPSdnMSd6IOf8PCwQRCYkVDwQZCwQbDwkfUEkgD4QjDQQnCwkpUEkqD4Qtjb8wCz80zVU3CQQ3zVU6zFU%2BzVVAUMlBzVVDUElEzFVHCQRIDwBLDL9NDglTD1RUTAJWB1RZD1RaDwBdD1RgB1RjD1RoDFRqDwRsDVRwj9Ryjgt2jAt6DwR8DFR%2BDwSADVSEj9SGjguKjAuLh9SPDwSRDD%2BUigSVh1SZD1ScB1SdjQSfD1SjDz%2BlDASnjb%2BoigSph1SxD8u1TFW3Bjq8Bja%2FDja%2FizbACDbAhjb%2FEAZTEQ%2FTEwhTFA1TFwpTGQZTGg%2FTHAxTHQlTIwZTJAjTJQpTJw5TKAzTKQpTKwZTLAVSLgXSMAVSNA9SNg%2FSOA9SPAVSPQrSPg9SQgZSQw1STAVTTYtZTgbTTgxSUIVZUg9SUgZTVgZZVw5TWI9ZWgZSWg7SXA9TXQlZXwhTYA1ZYwVTYwpSZQ5TZwlZaAlTaQ7SawlZbAhTcYpZcgdTcwpSdQxSdo9ZeAhSegpTew5ZfQdTfg1TgIxZhQVThw5TiQ7SjgpSkAdSkw1TkwZSz4pU2YfU2wxU3A2G4AgG4QgG7Iph%2F%2F%2FNVrtaSGDNVkpX61cyXW9Y%2Flj%2BWG5ZSlfrV%2BtXb1hKV%2F5Y7llfWv%2FNVrtaSGCjWyJcplwyXYpdMl4yXjJeRF9EXzJdrV%2BmXF9a%2F81WJ2MnYwBhuGFyYrhhAGEAYXJicmK4YSdjJ2NyYnJiAGENZCdjJ2MNZf%2BBbIFs223TZaFmv2eCaL9nHGkcab9n4mnTZYJooWahZqFmgmiCaOJpHGmgalFrHGlRaxts%2F4FsgWzbbaZuYG9gb6Zupm44cDhwYG8jcSNx%2FHG8cvxxvHJ5cyNxeXNCdHx1G2z%2FgWyBbNttT3ZPdk92T3bSdtJ20nZPdk92T3bSdtJ2T3Zad1p3vXfpeRp5GnnpebJ6X3sOfAF9%2FwAA8V3%2B8V3%2B4mBd%2FnI5PeJhXf5UMzY6PuJhXf5bNDdBWFlZWVlZYV3%2BVDU4Oz%2FiYV3%2BcjxA4mFd%2FuJhXf7iYV3%2B4mFd%2FuJhXf7EYFphXf7BYeJjXf7BYfFd%2FoVgWlpaYfFd%2FoFhxGMxMV3%2BgWHxXf6BYfFd%2FohjMTExMTExXf5qYFpaWlpaWlpaXf5hYfFd%2FiGBYWHxXf4hgmFh4mBd%2FiGBYWHiYV3%2BamMxMTExMTExYV3%2B4mFd%2FuJhXf7iYV3%2BpmBaWlphXf6hYeJjXf5qYFpaWmMxMTExXf49YFpaYzExMTExMTExXf4i9GHxXf4xYYFfxGBaWl3%2BIvRhwWHxXf4xYcRjMTFd%2FiL0YfFd%2Fj1jMTExMTExMTExMTFd%2FvFd%2FvFd%2FsRgWlpd%2FsFh8V3%2BxGMxMV3%2B8V3%2B8V3%2BpmBaWlpaXf6hYfFd%2FqZjMTExMV3%2B8V3%2BeWBaWlpaWlpaXf5xYfFd%2FnljMTExMTExMV3%2B8V3%2BTGBaWlpaWlpaWlpaXf5BYfFd%2FkxjMTExMWBaWlpaWl3%2BkWHxXf6RYfFd%2FpdjMTExMTFd%2FuJgXf7iYV3%2BtXBycmFd%2FrVxc3NhXf7iYV3%2B4mFd%2FuJhXf61YFpaYV3%2BsWHiYV3%2BMYF1YFpaWmHiYV3%2BdWMxMTFh4mNd%2FrFh8V3%2BSGBaWlpaWlph8V3%2BMvRhsWHxXf4y9GGI9GBaYzExMV3%2BRmMxMTExYfFd%2FoL0YfFd%2FpFh8V3%2BgvRh8V3%2Bl2MxMTExMV3%2BcWTxXf5xZPFd%2FnFk8V3%2BUfRxZPFd%2FlH0cWTxXf5R9HFk8V3%2BcWTxXf5xZPFd%2FnFk8V3%2BcWTxXf5xZPFd%2FnFk8V3%2BUfRxZPFd%2FlH0cWTxXf5R9HFk8V3%2BcWTxXf5xZPFd%2FnFk8V3%2BMfTxXf4x9PFd%2FvFd%2FnlgWlpaWlpaWl3%2BeWMxMTExMTExXf6xf%2FFd%2FrF%2F8V3%2BtWBaWlpd%2FrVjMTExXf7xXf7xXf6XYFpaWlpaXf6XYzExMTExXf6Rf%2FFd%2FpF%2F8V3%2BkX%2FxXf6Rf%2FFd%2FpF%2F8V3%2BkX%2FxXf6Rf%2FFd%2FohgWlpaWlpaXf6IYzExMTExMV3%2BMUXxXf4iQkbxXf4iQ0fiZF3%2BIkRI4mRd%2FuJkXf7iZF3%2B8V3%2B8V3%2BIoGC8V3%2B8V3%2B8V3%2BMYKxf%2FFd%2FjWC9PT0gvFd%2FkT09PSC8V3%2BNYL09PSC8V3%2BEUU1%2FYLxXf4CQkbxXf4CQ0fxXf4CREjxXf7xXf7xjv7xj%2F7xjv7xj%2F7xjv7xj%2F7xjv7xj%2F7xjv7xj%2F7xjv7xj%2F7xjv7xj%2F7xjv7xj%2F7xjv4hjvGP%2FgATJI%2BOjo6Ojo6Ojo6OEySO%2FgAhVo6Pj4%2BPj4%2BPj4%2BPIVaP%2FgD9f%2F6hX%2FF%2F%2FvF%2F%2FvF%2F%2FgX9f%2FF%2F%2FgV%2F9PT0f%2FF%2F%2FgV%2F9PT0f%2BL9f%2F4Ff%2FT09H%2BhguL9f%2F4Ff%2FT09IJxgqF%2F4v1%2F%2FgZ%2F9PT0f3%2BRgOL9f%2F4Gf%2FT09PR%2Fl%2F1%2F%2FgZ%2F9PT09H%2Bm9PT0f39%2F%2FgZ%2F9PT09H%2BXf%2FT09PT0f%2F4Gf%2FT09PR%2Fl3%2F09PT09H%2F%2BCH%2F09PT0f39%2Fl4KCgvT09H%2F%2BBn%2F09PT0f7WC9PT0f%2F4Gf%2FT09PR%2FtX%2F09PR%2F%2FgZ%2F9PR%2Ff3%2BXdHd%2F9PT0f%2F4Ff%2FT09PSXdXh%2F9PT0f%2F4AcnJycnJycnJydnl%2Ff39%2Ff%2F7xXf7xXf7iZV3%2BQjk94mZd%2FiQzNjo%2B4mVd%2Fi40N0FYWVlZWVlZWVlmXf4kNTg7P%2BJlXf5CPEDiZl3%2B4mVd%2FuJmXf7iZV3%2B4mZd%2FuJlXf4hReJmXf4SQkbiZV3%2BEkNH4mZd%2FhJESLVnaWdpXf61aGpoal3%2Bsmdp8V3%2Bsmhq8V3%2Bsmdp8V3%2Bsmhq8V3%2Bsmdp8V3%2BMUWyaGrxXf4iQkayZ2nxXf4iQ0eyaGrxXf4iREjxXf6xf%2FFd%2FvFd%2FrF%2F8V3%2B8V3%2BsX%2FxXf4RRfFd%2FgJCRrJnafFd%2FgJDR7JoavFd%2FgJCRrJnafFd%2FgJDR2GBsmhq8V3%2BAkRIsmdp8V3%2Bsmhq8V3%2B8V3%2BhGdpZ2nxXf6EaGpoavFd%2FqJnafFd%2FmGBomhq4n9d%2FqJnaeJ%2FXf4R9GZwcnJyaGrif13%2BEfRmcXNzc2dp4n9d%2FqJoauJ%2FXf7if13%2B4n9d%2FkJnafFd%2FkJoavFd%2FvFd%2FoJnafFd%2FoRoamdp8V3%2Bomhq8V3%2Bomdp8V3%2Bomhq8V3%2Bomdp8V3%2BYYGiaGrxXf7xXf7xXf4RRfFd%2FgJCRvFd%2FgJDR%2FFd%2FgJCRvFd%2FgJDR%2FFd%2FgJESPFd%2FvFd%2FvFd%2FvFd%2FvFd%2FvFd%2FiFF8V3%2BEkJG8V3%2BEkNH8V3%2BEkRI8V3%2B8V3%2B8V3%2B8V3%2B8V3%2B8V3%2B03ByXf7TcXNd%2Fgj99OJlXf7iZl3%2B8V3%2B8V3%2BEUXiYl3%2BAkJGwX%2FiYl3%2BAkNHwX%2FiYl3%2BAkRIo2dpf%2BJiXf6FZ2loan%2FiYl3%2Bgmhq4mJd%2FgJnaYJnaeJiXf4AaGpaWlpaWlpoalpaWn9aXf4AZ2kxMTExMTFnaTExMX8xXf4CaGqCaGrRf%2FFd%2FgJnaYRnaWdp0X%2FxXf4CaGqEaGpoatF%2F8V3%2BAmdpQYKEZ2lnaeJ%2FXf4CaGpBgoRoamhq4n9d%2FgJnaUGCgmdp4n9d%2FgJoakGCgmhqwvR%2F8V3%2BAmdpQYKCZ2nC9H%2FxXf4CaGpBgoJoasL0f%2FFd%2FgJnaUGCgmdpwvR%2F8V3%2BAmhqQYKCaGrC9H%2FxXf4CZ2lBgoZnaWdp9H%2FxXf4CaGpBgoZoamhq9H%2FxXf4CZ2lBgoGC4n9d%2FgJoakGCgYKxgOJ%2FXf4CZ2lBgoVnaWdpf%2BJ%2FXf4CaGpBgoVoamhqf%2BJ%2FXf4CZ2lBgoJnaeJ%2FXf4CaGpBgIJoauJ%2FXf4AZ2laWlpaWlpnaVpaWlp%2FXf4AaGoxMTExMTFoajExMTF%2FXf4CZ2mBgrF%2F4n9d%2FgJoaoGC4n9d%2FtF%2F8V3%2B0X%2FxXf7xXf7xXf4hReJlXf4SQkbiZl3%2BEkNH4mVd%2FhJCRuJmXf4SQ0fiZV3%2BEkRI4mZd%2FuJlXf7iZl3%2B4mVd%2FuJmXf7iZV3%2B4mZd%2FtNnaV3%2B02hqXf61Z2lnaV3%2BtWhqaGpd%2FrVnaWdpXf61aGpoal3%2BwX%2FxXf7Bf%2FFd%2FhFFgYHBf%2FFd%2FgJCRkGBgYHBf%2FFd%2FgJDR4GBwX%2FxXf4CQkbBf%2FFd%2FgJDR7JnafFd%2FgJESLJoavFd%2FvFd%2FvFd%2FpdnaWdpZ2ld%2FpdoamhqaGpd%2FmhnaWdpZ2lnafFd%2FmhoamhqaGpoavFd%2FvFd%2FvFd%2FoZwcnJyZ2nxXf6GcXNzc2hq8V3%2BAP1%2F%2FvF%2F%2FuL0f%2F4I%2FX%2Fxf%2F4Bf7Ff4vR%2F%2FgF%2FcX%2Fxf%2F4BfyL0f2L0f%2BL0f%2F4BfzF%2FcX%2Fxf%2F4BfyL0f2H04vR%2F%2FgF%2FMX9xf%2FF%2F%2FgF%2FIvR%2FYfTi9H%2F%2BAX8xf3F%2F8X%2F%2BAX8i9H9h9OL0f%2F4BfzF%2FcX%2Fxf%2F4BfyL0f2H04vR%2F%2FgF%2FMX9xf%2FF%2F%2FgR%2FdHeAYvR%2F4vR%2F%2FgR%2FdXiCcX%2Fxf%2F4EcnZ5f7Ff4vR%2F%2FgBzc3N%2Ff39%2Ff39%2Ff39%2Ff39%2F%2FgNdSl7ibG7%2BA11KXuJtbv4DXUpeoUnEW1xsbv4DXUpecVfibW7%2BA11KXsFJ4mxu%2FgNdSl7ibW7%2BA11KXuJsbv4DXUpe4m1u%2FgNdSl6RV%2BJsbv4DXUpeUVe1SUxQbW7%2BA11KXoFXtVRNUWxu%2FgNdSl61VU5SbW7%2BA11KXsRPU2xu%2FgNdSl7ibW7%2BA11KXv4DXUpe%2FgNdSl7ibG7%2BA11KXuJtbv4DXUpeRv304mxu%2FgNdSl5R9OJtbv4DXUpe4mxu%2FgNdSl7ibW7%2BA11KXnFXsUnibG7%2BA11KXqFXxFtcbW7%2BA11KXkH04mxu%2FgNdSl7ibW7%2BA11KXkH04mxu%2FgNdSl7ibW7%2BA11KXuJsbv4DXUpexIKCbW7%2BA11KXsSAgmxu%2FgNdSl7ibW7%2BA11KXuJsbv4DXUpewfTibW7%2BA11KXkL9guJsbv4DXUpeQoCC4m1u%2FgNdSl7ibG7%2BA11KXsH04m1u%2FgNdSl7ibG7%2BA11KXuJtbv4DXUpexExQbG7%2BA11KXrVUTVFtbv4DXUpekVe1VU5SbG7%2BA11KXrVJT1Ntbv4DXUpe4mxu%2FgNdSl7ibW7%2BA11KXpFs4mxu%2FgNdSl6RbeJtbv4DXUpe4mxu%2FgNdSl7ibW7%2BA11KXuJsbv4DXUpe4m1u%2FgNdSl7ibG7%2BA11KXuJtbv4DXUpe%2FgNdSl6RV%2F4DXUpecWyxSeJsbv4DXUpecW3EW1xtbv4DXUpe4mxu%2FgNdSl7ibW7%2BCV1KbGyCgoKCgqaCgoKCbG7%2BCV1KbW2CgoKCgqaCgoKCbW7%2BCV1KbGyCgoKCgqaAgoKCbG7%2BBF1KbW3ibW7%2BA11KbOJsbv4DXUptofTibW7%2BA11KbKH04mxu%2FgNdSm3ibW7%2BA11KbOJsbv4DXUpt4m1u%2FgNdSmxR9OJsbv4DXUptUfTibW7%2BA11KbOJsbv4DXUpt4m1u%2FgRdSmxs4mxu%2FgddSm1tgoKCiIKCgoKCgm1u%2FgddSmxsgoKCiIKCgoKCgmxu%2FgddSm1tgoKCiICCgoKCgm1u%2FgNdSmzibG7%2BA11KbeJtbv4DXUpeYfTETFBsbv4DXUpeUfS1VE1RbW7%2BA11KXkb99LVVTlJsbv4DXUpexE9TbW7%2BA11KXlX99OJsbv4DXUpeQfRx9MRMUG1u%2FgNdSl5B9HH0tVRNUWxu%2FgNdSl5V%2FfS1VU5SbW7%2BA11KXsRPU2xu%2FgNdSl5G%2FfTibW7%2BA11KXkH0YfTETFBsbv4DXUpeQfRi%2FfS1VE1RbW7%2BA11KXlL99IL99LVVTlJsbv4DXUpexE9TbW7%2BA11KXkb99OJsbv4DXUpexExQbW7%2BA11KXlT99LVUTVFsbv4DXUpeQfSR9LVVTlJtbv4DXUpeQfSR9MRPU2xu%2FgNdSl5U%2FfTibW7%2BDV1sX19fX19fX19fX1%2FibG7%2BAl1t4m1u%2FgJdbOJsbv4CXW3ibW7%2BAl1s4mxu%2FgJdbeJtbv4CXWzibG7%2BAl1t4m1u%2FgJdbOJsbv4CXW3ibW7%2BA11sbNNsbG7%2BA11tbdNtbW7%2BA11sbPFu%2FgNdbW3xbv4AXWxsbH9%2Ff39%2Ff39%2Ff4KCbv4EXW1tbdOCgm7%2BBF1sbGzTgoJu%2FgRdbW1tl%2BF%2Ff39%2Ff27%2BAF1sbGx%2Ff%2Bzs7Ox%2Ff39%2Ff27%2BBl1tbW1%2Ff6Z%2Ff39%2Ff27%2BAjGA4mVm%2FgIyguJh6P4CMYK1cHJyYej%2BAjKCtXFzc2Ho%2FgIxgjI0NeJg6P4AMoIzMzMzMzMzMzMzMzNh6P4CMYJSNjfEODlh6P4CMoLiYej%2BAjGCkYHiYOj%2BAjJ%2FkYHiYOj%2BAjF%2FkYHiYej%2BAjJ%2F4mHo%2FgIxf0w6MzMzMzMzMzMzYej%2BAjJ%2FYjY34mHo%2FgIxf8RwcmDo%2FgIyf8Rxc2Ho%2FgIxf2GApnBycnJg6P4CMn9hgqZxc3NzYej%2BAjF%2FtXBycmDo%2FgIyf7Vxc3NjZP4EMX9%2Ff1I0NeJlZv4AMn9%2FfzMzMzMzMzMzMzNh6P4EMX9%2Ff1E34mNk%2FgQyf39%2FxHBycnL%2BBDF%2Ff3%2FEcXNzc%2F4EMn9%2Ff%2BJlZv4IMX9%2Ff39%2Ff3%2FiYej%2BDDJ%2Ff39%2Ff39tbW1ta%2BJh6P4MMX9%2Ff39%2Ff25ubm5s4mDo%2Fggyf39%2Ff39%2Ff%2BJg6P4IMX9%2Ff39%2Ff3%2FiYej%2BDDJ%2Ff39%2Ff39tbW1ta%2BJh6P4MMX9%2Ff39%2Ff25ubm5s4mHo%2Fgsyf39%2Ff39%2Ff39%2FguJh6P4LMX9%2Ff39%2Ff39%2Ff4LiY2T%2BCzJ%2Ff39%2Ff39%2Ff3%2BC4nBy%2Fgsxf39%2Ff39%2Ff39%2FguJxc%2F4EMn9%2Ff1E1oYDiZWb%2BADF%2Ff38zMzMzMzMzMzMzYej%2BBDJ%2Ff39SNjfiY2T%2BAjFJ%2FgIySf4CMUniZWb%2BAjJJMTVyNDXiYej%2BADFJMzMzMzMzMzMzMzMzYOj%2BAjJJUTfEODlh6P4CMUmhgeJg6P4CMkmhgeJh6P4CMUnBNeJg6P4CMkk9OjMzMzMzMzMzMzNjZP4CMUliNjficHL%2BAjJJ4nFz%2FgIxSeJlZv4CMkniYej%2BAjFJoYHiYOj%2BAjJJoYHiYej%2BAjFJQTXEODlg6P4AMkkzMzMzMzMzMzMzMzNg6P4EMUk2N%2BJh6P4CMkniY2T%2BAjFJ%2FgIySTFGsjQ1%2FgIxSTFHtTozMzMz%2FgIySTFI4Tf%2BAjFJ%2FgIySf4CMUlBNYI0Nf4AMkkzMzMzMzMzMzMzMzMzM%2F4CMUlhN5I2N%2F4CMkmiP0L%2BAjFJkT3%2BAjJJkz5AQ%2F4CMUmTRkFE%2FgIySZFH%2FgIxSZFI%2FgIySf4CMUn%2BAjJJsjQ1%2FgIxSWo6MzMzMzMzMzMz%2FgIySYE3%2FgIxSf4CMkn%2BAjFJ4mVm%2FgIyScQ4OWHo%2FgQxSTQ1YTXiYOj%2BADJJMzMzMzMzMzMzMzMzYej%2BAjFJMTfiYOj%2BAjJJ4mHo%2FgIxSZGC039g6P4CMklRgZGC039h6P4CMUmRgtN%2FYOj%2BAjJJ039h6P4CMUl5OjMzMzMzf2Do%2FgIySYI2N9N%2FYej%2BAjFJUTXTf2Do%2FgIyST06MzMzMzMzMzMzf2Ho%2FgIxSUE3tTg5f2Do%2FgIySdN%2FYOj%2BAjFJ039g6P4CMknTf2Nk%2FgIxSf4CMkn%2BAjFJkj9C4nBy%2FgIySXJGPeJxc%2F4CMUl0Rz5AQ%2BJwcv4CMklxSJJBROJxc%2F4CMUmCP0LicHL%2BAjJJcT3icXP%2BAjFJZEY%2BRUPEcHJycv4CMklhR8Rxc3Nz%2FgIxSWFI%2FgIySaZwcnJycnL%2BAjFJpnFzc3Nzc%2F4CMkmmcHJycnJy%2FgIxSaZxc3Nzc3P%2BAjJJiHBycnJycnJy%2FgIxSYhxc3Nzc3Nzc%2F4CMkn%2BAjFJ4nBy%2FgIySeJxc%2F4CMUn%2BAjJJ%2FgIxSf4DMklfQfRh9IH0ofTB9P4GMUl%2Ff39%2Fpf1%2F%2FgIySVF%2FoX%2F%2BBjFJ9PT0f6F%2F%2FgYySfT09H%2Bhf%2F4GMUn09PR%2FoX%2F%2BBjJJ9PT0f6F%2F%2FgYxSfT09H%2Bhf9I%2FQv4CMkmhf8E9%2FgIxScM%2BQEP%2BAjJJgX%2FDRkFE%2FgIxSYF%2FwUf%2BAjJJgX%2ByP0j%2BAjFJgX%2BhPf4CMkmBf6Q%2BRURG%2FgIxSYF%2F0Uf%2BAjJJgX%2FRSP4CMUn%2BAjJJQTWCNDX%2BADFJMzMzMzMzMzMzMzMzMzP%2BBDJJNjdxN%2F4CMUni%2FX%2F%2BAjJJlzozMzMzf3%2F%2BAjFJsTfi%2FX%2F%2BAjJJ4nBy%2FgIxSZI%2FQuJxc%2F4CMkmBPeJwcv4CMUmDPkBD4nFz%2FgIySYNGQUTicHL%2BAjFJgUficXP%2BAjJJgUjEcHJycv4CMUnEcXNzc%2F4CMkmXcHJycnJycv4CMUmXcXNzc3Nzc%2F4CMklqcHJycnJycnJycv4CMUlqcXNzc3Nzc3Nzc%2F4CMkn%2B8Y7%2B8Y%2F%2B8Y7%2B8Y%2F%2B8Y7%2B8Y%2F%2B8Y7%2BIX%2Fxj%2F7xjv4hf%2FGP%2FvGO%2FiF%2F8Y%2F%2B8Y7%2BIX%2Fxj%2F7xjv4hf%2FGP%2FvGO%2FiGO8Y%2F%2BABMkj46Ojo6Ojo6Ojo4TJI7%2BACFRjo%2BPj4%2BPj4%2BPj48hUY%2F%2BAP1%2F%2FgD09PT09PT09PT09PT09PR%2F%2FgD09PT09PT09PT09PT09PR%2F%2FgD09PT09PT09PT09PT09PR%2F%2FgB%2F9PT09PT09PT09PT09PR%2F%2FgB%2F9PT09PT09PT09PT09PR%2F%2FgB%2F9PT09PT09PT09PT09PR%2F%2FgB%2F9PT09PT09PT09PT09PR%2F%2FgB%2F9PT09PT09PT09PT09PR%2F%2FgB%2F9PT09PT09PT09PT09PR%2F%2FgB%2F9PT09PT09PT09PT09PR%2F%2FgB%2F9PT09PT09PT09PT09PR%2F%2FgB%2F9PT09PT09PT09PT09PR%2F%2FgB%2F9PT09PT09PT09PT09PR%2F%2FgB%2F9PT09PT09PT09PT09PR%2F%2FgB%2F9PT09PT09PT09PT09PR%2F%2FgB%2F9PT09PT09PT09PT09PR%2F%2FgB%2F9PT09PT09PT09PT0dHd%2F%2FgB%2F9PT09PT09PT09PT0dXh%2F%2FgBycnJycnJycnJycnJydnl%2F%2FgD9f%2F7xf%2F7xf%2F4Bf%2FF%2F%2FgF%2Fhf1%2F8X%2F%2BAX%2BF9PT09H%2Fxf%2F4Bf4X09PT0f%2FF%2F%2FgF%2FhfT09PR%2F8X%2F%2BAX%2BF9PT09H%2Fxf%2F4Bf4X09PT0f%2FF%2F%2FgF%2FhfT09PR%2F8X%2F%2BAX%2BF9PT09H%2Fxf%2F4Nf39%2Ff39%2Ff3%2F09PT0f%2FF%2F%2FgF%2Fdn%2F09PT0f%2FF%2F%2FgF%2Fdn%2F09PT0f%2FF%2F%2FgF%2FMX92f%2FT09PR%2F8X%2F%2BAX8xf3b9f%2FF%2F%2FgR%2FdHd%2FcX%2Fxf%2F4Ef3V4f7F%2F8X%2F%2BAHJ2eX9%2Ff39%2Ff39%2Ff39%2Ff3%2F%2BAjFJwj9C8V3%2BAjJJgUaxPfFd%2FgIxSYFHtT5AcHJn%2FgIySYNIP0LEQXFzZ%2F4CMUmBPcFK4v1n%2FgIySYI%2BRbE94v1n%2FgIxSbI%2BReL9Z%2F4CMkni%2FWf%2BAjFJ8V3%2BAjJJ8V3%2BAjFJwWjxXf4CMknBaPFd%2FgIxScRoSkJd%2FgIySbI%2FQvFd%2FgIxSaE98V3%2BAjJJpD5FQ0rxXf4CMUmhaME98V3%2BAjJJoWjCPkXxXf4CMUmhaPFd%2FgIySaFo8V3%2BAjFJ4v1n%2FgIySTFGgWfEP0JnZ%2F4CMUkxR4FnsT3i%2FWf%2BAjJJMUiBZ7U%2BQEJnZ%2F4CMUmBZ7VGQUNnZ%2F4CMkmBZ7FH4v1n%2FgIxSbFI4v1n%2FgIySdNNZ2f%2BAjFJtWdLTmdn%2FgIySXGBtWdMT2dn%2FgIxSXGBsWfi%2FWf%2BAjJJsWfi%2FWf%2BAjFJoj9C4v1n%2FgIySYJnPdM%2FZ2f%2BAjFJhWc%2BRUM94v1n%2FgIySYFnxD5AZ2f%2BAjFJUUaBZ7U%2FQkFnZ%2F4CMklRR6E94v1n%2FgIxSVFIoj5F8V3%2BAjJJ8V3%2BAjFnpv1n%2FggyZ2dngoKCgqb9Z%2F4CMWdxZ%2FFn%2FgIyZ3Fn8Wf%2BAjFncv1n8Wf%2BAjJnQYJ29GdtbW1r8Wf%2BAjFnQYGFZ25ubmzxZ%2F4CMmdBgHL0Z%2FFn%2FgIxZ0GBgWfTcHJn%2FgIyZ0GCcvRn03FzZ%2F4CMWdBgYFn8Wf%2BAjJnQYB29GdtbW1r8Wf%2BAjFnQYGFZ25ubmzxZ%2F4CMmdBgnL0Z%2FFn%2FgIxZ0GBgWfTcG1n%2FgIyZ0GCcvRn03FuZ%2F4CMWdBgYFn4v1n%2FgIyZ0GCdWdnbW1r4v1n%2FgIxZ0GBdWdnbm5s4v1n%2FgIyZ0GC4v1n%2FgUxf2l%2FaeJpf%2F4FMmlqaWriamn%2BBTFqaWpp4mlq%2FgUyaWppatNvamn%2BBTFqaWpp4mlq%2FgUyaWppauJqaf4FMWppamnEcHJpav4FMmlqaWrEcXNqaf4FMWppammXcHJycnJpav4GMmlqaWpvl3Fzc3Nzamn%2BBTFqaWpp4mlq%2FgUyaWppauJqaf4FMWppamniaWr%2BBTJpamlq4mpp%2FgUxamlqaeJpav4FMmlqaWrTb2pp%2FgUxamlqaeJpav4FMmlqaWriamn%2BBTFqaWpp4mlq%2FgUyf2p%2FauJqf%2F4FMX9pf2nxXf4FMmlqaWrxXf4EMWppauJpXf4EMmlqaeJqaf4EMWppauJpav4EMmlqaaGB4mpp%2FgQxamlq4mlq%2FgQyaWpp4mpp%2FgUxamlqaeJpav4FMmlqaWriamn%2BBTFqaWpp4mlq%2FgUyaWppauJqaf4EMWppauJpav4EMmlqabFv4mpp%2FgQxamlq4mlq%2FgQyaWpp4mpp%2FgUxamlqaeJpav4FMmlqaWriamn%2BBTFqaWpp4mlq%2FgUyf2p%2FauJqf%2F4FMX9pf2nRf%2FFd%2FgUyaWppatF%2F8V3%2BBTFqaWpp0W%2FxXf4FMmlqaWrRf%2FFd%2FgUxamlqafFd%2FgUyaWppavFd%2FgUxamlqafFd%2FgUyaWppavFd%2FgUxamlqafFd%2FgUyaWppavFd%2FgUxamlqafFd%2FgUyaWppavFd%2FgUxamlqafFd%2FgUyaWppavFd%2FgUxamlqafFd%2FgUyaWppavFd%2FgYxamlqaW%2FxXf4FMmlqaWrxXf4FMWppamnxXf4FMn9qf2rxXf4FMX9pf2lxX8T9af4FMmlqaWrE%2FWr%2BBTFqaWpp8V3%2BBTJpamlq8V3%2BBTFqaWpp4v1p%2FgUyaWppauL9av4FMWppamni%2FWn%2BBTJpamlq4v1q%2FgUxamlqaeL9af4FMmlqaWri%2FWr%2BBTFqaWppcfS1%2FWn%2BBTJpamlqcfS1%2FWr%2BBTFqaWpp8V3%2BBTJpamlq8V3%2BBTFqaWpp8V3%2BBTJpamlqxP1p%2FgYxamlqaW%2FE%2FWr%2BBTJpamlql%2F1p%2FgUxamlqaZf9av4FMn9qf2rxXf4LMX9pf2l%2FaX9pf2ni%2FWn%2BCzJpamlqaWppamlq4v1q%2FgsxamlqaWppamlqaeL9af4LMmlqaWppamlqaWri%2FWr%2BCzFqaWppamlqaWpp4v1p%2FgsyaWppamlqaWppauL9av4LMWppamlqaWppamnxXf4LMmlqaWppamlqaWrif13%2BCzFqaWppamlqaWpp8V3%2BCzJpamlqaWppamlq4n9d%2FgsxamlqaWppamlqafFd%2FgsyaWppamlqaWppauJ%2FXf4LMWppamlqaWppamnxXf4LMmlqaWppamlqaWrif13%2BCzFqaWppamlqaWpp8V3%2BCzJpamlqaWppamlq4n9d%2FgsxamlqaWppamlqafFd%2FgsyaWppamlqaWppauJpXf4LMWppamlqaWppamniamn%2BCzJ%2Fan9qf2p%2Fan9q4mlq%2Fgsxf2l%2FaX9pf2l%2FaeJqaf4LMmlqaWppamlqaWriaWr%2BDDFqaWppamlqaWpta%2BJqaf4MMmlqaWppamlqaW5s4mlq%2Fgsxan9qf2p%2Fan9qf%2BJqaf4CMmnif2r%2BAjFq8V3%2BAjJp8V3%2BAjFqQWnxXf4CMmlBavFd%2FgIxakFp8V3%2BAjJpQWrxXf4CMWpBafFd%2FgIyaUFq8V3%2BAjFqQWnxXf4CMmlMan9%2Ff39%2Ff39%2Ff39%2F%2FgIxav4LMmlpaWlpaWlpaWn%2BCzFqampqampqampq8Wn%2BATLxav4CUlbxUv4CU1fxU%2F4DVFJW01JWVP4DVVNX01NXVf4SVVlCUlbSVFj%2BAlJWQlVZ01VZUv4CU1fxU%2F4CVFjxVP4CVVniUlX%2B4lNX%2FhJSVuJVWf4SVFj%2BA1JVWcJSVv4CU1fCVVn%2BAlRYMYDxUv4CVVnxU%2F4SUlbxVP4SVFjxVf4SVVn%2B%2Fv4SUlb%2BElRXgoCC8VL%2BA1JVWUH08VT%2BAlNX8VX%2BAlRYQfTCUlb%2BAlVZxFVZUlb%2B4lNX%2FhJSVuJUWP4SVVmx9OJVWf4ygoD%2BsfTiUlb%2BAlJW4lNX%2FgJTV%2BJVUv4DVVJW8VP%2BElNXsv2C8VT%2BElRYQlJW8VX%2BElVZQlVZ4lJW%2FoH04lRX%2FuJVWf4F%2FW%2B1%2FW%2F%2BsW%2F%2BAlJWsW%2F%2BAlNXsW%2FxUv4DVFhWsW%2FxU%2F4DVVlXsW%2FxVP4SVVlm%2FW%2FxVf7%2B%2Fv7iUlb%2BAlJW4lVZ%2FgJTV%2F4I%2FW%2F%2BAlVZ%2FuJSVv7TUlNX%2FtNTVVn%2B0lRY%2FtJVWf4H%2FW%2Bm%2FW%2F%2BAztbb0H0YfSB9KH0wfTibzv%2BBDtbb%2FRR9HH0kfSx9NP0bzv%2BAztbb0H0YfSB9KH0wfTibzv%2BBDtbb%2FRR9HH0kfSx9NP0bzv%2BAztbb0H0YfSB9KH0wfTibzv%2BBDtbb%2FRR9HH0kfSx9NP0bzv%2BAztbb0H0YfSB9KH0wfTibzv%2BBDtbb%2FRR9HH0kfSx9NP0bzv%2BAztbb0H0YfSB9KH0wfTibzv%2BBDtbb%2FRR9HH0kfSx9NP0bzv%2BAztbb0H0YfSB9KH0wfTibzv%2BBDtbb%2FRR9HH0kfSx9NP0bzv%2BAztbb0H0YfSB9KH0wfTibzv%2BBDtbb%2FRR9HH0kfSx9NP0bzv%2BAztbb0H0YfSB9KH0wfTibzv%2BBDtbb%2FRR9HH0kfSx9NP0bzv%2BAztbb0H0YfSB9KH0wfTibzv%2BBDtbb%2FRR9HH0kfSx9NP0bzv%2BADtbb29vb29vb29vb4KCbzv%2BAztbVrFv4m87%2FgM7W1exb%2BJvO%2F4DO1tZQVqxb%2BJvO%2F4CO1uxb%2BJvO%2F4CO1uxb%2BJvO%2F4CO1uRWrFv4m87%2FgI7W7Fv4m87%2Fgn9b7Fv4m87%2FgJvW4FvsW%2Fibzv%2BAm9bhP1v4m87%2FgJvWzP9b%2BJvO%2F4Cb1sxb1Fv4m87%2FgJvWzFvW29vb29vb29vb287%2FgJvWzFv4lw7%2FgJvWz1vb29vb29vb29vb287%2FgJvW%2BJvO%2F4Cb1vibzv%2BDP1v4m87%2FgI7W7Fv4m87%2FgI7W4FasW%2Fibzv%2BAjtbsW%2Fibzv%2BAjtbsW%2Fibzv%2BAjtbsW%2Fibzv%2BAjtbUVqxb%2BJvO%2F4CO1uxb%2BJvO%2F4DO1tWsW%2Fibzv%2BAztbV7Fv4m87%2FgM7W1iRWrFv4m87%2FgM7W1mxb%2BJvO%2F4CO1uxb%2BJvO%2F4CO1uxb%2BJvO%2F4CO1uxb%2BJvO%2F4CO1tSUlaxb%2BJvO%2F4CO1tSU1exb%2BJvO%2F4CO1sxWlJVWbFv4m87%2FgI7W7Fv4m87%2FgI7W7Fv4m87%2FgI7W7Fv4m87%2FgI7W3FasW%2Fibzv%2BAjtbsW%2Fibzv%2BAjtbol5v4m87%2FgI7W5Neb2%2Fibzv%2BAjtbMVqDXm9v4m87%2FgI7W3Neb2%2Fibzv%2BAjtbY15vb%2BJvO%2F4CO1tTXm9v4m87%2FgI7W0Neb2%2Fibzv%2BAjtbM15vb%2BJvO%2F4FO1teb2%2Fibzv%2BBDtbb2%2Fi%2FW%2F%2BAztvb%2BJpb%2F4C%2FW%2Fiam%2F%2BAW%2BBb%2BJpb%2F4Bb%2BJqb%2F4Bb%2BJpb%2F4Bb%2BJqb%2F4Bb%2BJpb%2F4Bb%2BJqb%2F4Bb%2BJpb%2F4Bb%2BJqb%2F4Gb2lpaWlptWlpaWlv%2FgBvampqamqAgoKCgmpqampv%2FgJvaeJpb%2F4Cb2riam%2F%2BAm9p4mlv%2FgJvauJqb%2F4Cb2lk%2Fd3iaW%2F%2BAm9qTICC3t7e3oKCgoJqb%2F4Cb2niaW%2F%2BAm9q4mpv%2FgJvaeJpb%2F4Cb2riam%2F%2BAm9pUW%2FiaW%2F%2BAm9q4mpv%2FgJvaeJpb%2F4Cb2qhb%2BJqb%2F4Cb2niaW%2F%2BAm9q4mpv%2FgJvaeJpb%2F4Cb2riam%2F%2BDG9pbW1tbW1tbW1ta%2BJpb%2F4Mb2pubm5ubm5ubm5s4mpv%2FgJvaXP99OJpb%2F4Cb2pz%2FfTiam%2F%2BAm9pc%2F304mlv%2FgJvanP99OJqb%2F4Cb2lz%2FfTiaW%2F%2BAm9qc%2F304mpv%2FgdvaW1tbW1rpmlpaWlpb%2F4Hb2pubm5ubKZqampqam%2F%2BB29pbW1tbWumaWlpaWlv%2Fgdvam5ubm5spmpqampqb%2F4Hb2lpaWlpaaZpaWlpaW%2F%2BB29qampqamqmampqampv%2FgBvaW9vb29vgoKCb29vb2lv%2FgJvauJqb%2F4Cb2niaW%2F%2BAm9q4mpv%2FgJvaeJpb%2F4Cb2riam%2F%2BAG9pX19fX19fX19fX19faW%2F%2BAm9q4mpv%2FgJvaeJpb%2F4Cb2riam%2F%2BAm9p4mlv%2FgJvauJqb%2F4Cb2niaW%2F%2BAm9q4mpv%2FgJvaeJpb%2F4Cb2riam%2F%2BAm9p4mlv%2FgJvauJqb%2F4Cb2niaW%2F%2BAm9q4mpv%2FgJvaeJpb%2F4Cb2riam%2F%2BAm9p4mlv%2FgJvauJqb%2F4Ab2lpaWlpaWlpaWlpaWlpb%2F4Ab2pqampqampqampqampqb%2F7%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2BSYbdh2mGSYbdh2mGSYbdh2mGSYbdh2mGQYQJgc2D%2BYAJgc2D%2BYAJgc2D%2BYAJgc2D%2BYAAAAAAAAAAAAwMHBw8OHxsAAAAAAAAAAICA8PDgQPAAAAAAAAAAAQEDAwcHDw0PDAAAAAAAAMDA%2BPjwIPiA%2BDAAAAAAAAADAwcHDw4fGx8YAAAAAAAAgIDw8OBA8ADwYAAAAAAAAAICDwkNABgQDAgDAzw%2FQ3yc4LDAoMCQ4FBgAAAAAAAAAAADAwcHDw4fGwAAAAAAAA4AjoD8%2FOxM%2FAwAAAAAAAADAx8fDwQfAg8MAAAAAAAAgIDg4PDw%2BKD4IAcHDw8PDx8fHx4%2FPj8%2BPz%2Fg4PDw8NDgAPBA4ADgAMBAAAAAAAAAAAAAABwcPj5%2FfwAAAAAAAAMDFwc%2FCj8cHxsfGAcADQ8dHxwFGAcGBg4O8GDgAIDAsPA4sBjgYGBwcAMADw8%2FDzcHAA8QHxgcDg7wAEDAfOA8cAjIGPgYeAAABwAODx4fHhgEGwAPBwcHB%2BAAgIDAwACgAODAwODggIAfGAcADw8fDzAPEB8xPSEh8GDgAFjA%2BMAA4ADAgIDAwB8YBwAdH3w%2FYA5QHzg%2FICb4ePAQoODE5AzcDPwAwAAAHxgfHx8fDg8BAwEDAAAAAADgwDCAcODwwOCo6Hj4cHA8Pzs8EhEDBAEOAR4APwB%2FQKAA4ADAAOCAYIBwAPAA8P%2F%2Ff38%2BPhwcAAAAAAAAAAAPCA0OIS84PTg%2FAAcAAAAABwcPDw8MHxY%2FMD8wDwgLD8DA8PDggPgA%2BEDw8OAAgMAAAAMDBwcHBg8LHxgfGAcEAADg4Pj48ED8APwg%2BHjwAAcHDw8PDB8WPzA%2FMA8IHx%2FAwPDw4ID4APhA8PDgAEDAAAAAAAAAAAAAABwcIj5Jc7HBWWMiPhwcAAAAAAAAAAAAAAcHDw8PDB8WPzA%2FMA8MDgDeyP7w%2Fp7%2BBvxE%2FPz4GAcHHx8PAh8APwY%2FDA8BHR%2BAgPjw%2FGDMsMAgwPDgOOAYAAAAAAAAAAAAAAAAAAAAAAAABwePiNjQeHhu7vvj%2F2AAAAMDBwcPDx8fHx4%2FPj8%2BAADg4PDw8NDgAPBA4ADgABsfOz84OzgHGAcAHhwcPDyg4LDwOLg4wDDAAPBwcHh4Cw8THwMfMD8wPzA8ICAAAADA2MD84PzggOAA4HBweHgXHwcfAB8ADwEPBQcODgcHwIDggGCAAOCA4MDAQEAAAA8PHx84BzAHGB8YHxgYDAxc4FzgCGg4%2BDj4OLgAAAAAPj8%2BNzwjHAdmf2N%2FYH5AQLDwoPACcgb%2BBv6G%2FgAAAAAfHx4fCA8ABwADAAAAAAAAwDBg4Hj4%2BMjygk6%2BPHw4OL%2Bp67%2B8%2FP%2F%2Fz8sfEB8RHh4A%2FwAADw%2F4%2F%2F7%2F%2F3%2BDgwAAf394ewECAQIABwAPAB8AP8BAQKAA4LBA8AAA4ADgAPAAAAAAAAAAAAAABwcPDw8MAAAAAAAAAAAAAMDA8PDggB8WHxAfGDc4OzM4JxwfPDz4APhA8PD4GLioGOA4%2BDw8AAAHBw8PDwwfFj8wPzAPCQAAwMDw8OCA%2BAD4QP7w%2FPALDwEPAB8AH2B%2FYH5gbEBA4OCAwADAQOCA4ADgcHB4eAcHDw8fHx8cPz0%2FPH98f3%2FAwODg8HDwEPBQ8BDggMBAeXowNwYBBwgAHwA%2FAH8A%2F8QgHOAwwMAAAMAA4ADgAOAAAODg8JCIiISEjIz6%2Bv0RPdF9U%2FmXE%2F8e%2Fvz88PAAAAcHDw8PDx8cHx0%2FPD88Pz8eHhERHhAfExwUzM%2F%2Fv6%2BoPT44Px4ZAwQBDgAfAD8Af8AgAPAwwGCAwCAA8ADwAPD%2B%2Fv6C%2Fu44KDgoOCg4KDg47u7uqv66%2FoL%2Buu6q7qru7v7%2B%2FoL%2BvvyE%2FLz%2Bvv6C%2Fv729v6a%2Fpr%2Bqv6i%2FrLuqu7u%2FPz%2Bhv6y7qruqv6y%2Fob8%2FAAAIiJVVVVVVVVVVSIiAAAAACAgUFBQUFBQUFAgIAAAAAASEjU1FRUVFRUVEhIAAAAAIiJVVRUVJSVFRXJyAAAAAKKipaWlpfX1JSUiIgAAAAByckVFZWUVFRUVYmIAAAAAYmKVlWVltbWVlWJiAAAAAG5u7u5ubm5ub29nZwAAAAC%2Bvrm5ubm%2Bvri4ODgAAAAAPDxmZl5eXl5%2Bfjw8AAAAAAAAAwMMDBAQICAgIEBAAAAAABgYPCR6VjwMCBgAAAAAAAAAAAAAAwMHB2RkVFUAAAAAAAAAAODg8PDwoPiAd1d7eE9PfHw4OB8fBwcBAfgw8AD4%2BBwUf33M%2FBn58fH4MPEB%2BfkcFH99zPwY%2BPDwAAAHBw8Pycmpq%2B%2Bv56fzkAAA4ODw8PBA%2FAD8IPh48AD%2F%2F4%2BP%2BPjg4G9%2FPD8PDwMD%2FPz39R8V%2FPyL%2Bxv78%2FDDwwAA4ODw8PBA%2FwP%2FIPt78wP8%2FPf1HxX8%2FIj4GPjw8MDAAAA8PG5uXl5eXn5%2BPDwAAAAAAACAgEBAJCQaGgEBBgAAAAAAAAADAwQECQkLCw8OAAAAAAAA%2FPzi4v39%2BZH9wQ8OCQgPD2dkZGQUFwMDAAD9GfkB%2BfnWVn8%2Fffn5%2Ff7%2BDw4JCA8PBwQEBBQXY2NgYA8PExMnJycmLys%2FOD84JyT8%2FOLi%2BfnxQf0B%2FSH5efEBPz%2Ff1NTU1N80Px8fDw8DA%2Fn5rq7%2Ff33x8f3%2B%2Fv7%2B%2FPw%2FPx8UFBQUHzQ%2F39%2FPz8PDAAAAAB4ec3P%2F%2F39%2FHh4AAAAAAAAAAAAAAAAAAICAQEABAQICBAQPCAcEAwIBAQAAgIAAAMEA9wD%2FAP9A%2F%2BM%2BPhMAmQDBAOMA%2FwD%2FgH9BPj5AQKAg4CDAQMBAgIAAAAAAfn7%2Fg%2F%2B7%2F6P%2Fo%2F%2BH%2F%2F9%2Bfn5%2BmZmlpY2NmZmBgZmZfn5%2Bfv%2BD%2F7v%2Fo%2F%2Bj%2F4f%2F%2F35%2BPDx%2BQv%2BB%2F4H%2F%2F0JCQkI8PAAAbm6%2Fk7%2BD%2F4N%2BRjwsGBgAABAAEAD%2BAHwAOAB8AMYAAAAQEBAQ%2Fv58fDg4fHzGxsPDPT3Dw%2F%2F%2F%2F%2F%2Fv5%2F%2F%2F29s8PCBO%2F%2F%2F%2Fvf%2F%2F%2F%2F%2F%2Fvf%2F%2FDw8fEDgwcEBgQMCAwIDAgL%2B%2F%2F0BAAAAAAABBQUFBAACAgPh4PAQMBA4CBgIFAwUDwIDAgOCAcEA%2BICM8HR4DAwAAAAAAAAAAAAA%2FAJx%2F4%2BP%2F%2F4CAv4CviL%2BYv4D%2F%2F%2F%2F%2F%2F%2F8DA%2F8D7wv%2FG%2F8D%2F%2F%2F%2F%2Fzw8fn7b29vb%2F%2F88AH5iNjYAAAAAAAA8PH5%2B29s8AMPDGBg8JH5SfkL%2Fwf%2BF%2F4H%2Fo%2F%2BB%2F8N%2BZjw8mZnb235%2BPDyBgYGBw8PDw%2Bel56Xnpeel%2F73%2FmX5CPDyZmdvbfn48PAAAAAAAAAAAAABgYJCQ0NDQ0JCQ6OB%2Bbj0tHw8fBj85AAAAAAAAAABgYJCQ0NDQ0JCQ6OA%2BLj0tf28fBh4QNzcAAAAAPDxubl5eXl5%2Bfjw8AAAAADwAbgBeAF4AfgA8AAUDDQMJBwoGMg7kHAj48PAAAAAAAgIAABERBQQDAS4qBgYICCckLCgbEZSAWUkzIwAAAAAAAP%2F%2F%2F%2F8AAAAAAAAAAAAAMDBISEREdUV3Zjk5AAAAAAwMEhIiIq6i7macnAAAAAAAAAAAAABhYZeWiYkAAAAAAAAAAAAAhobpaZGRPz9tcH9%2Fjouvq%2F77%2F4P%2Bh4CAQMDg4LAQ8PCwEPDwQMAfHzY4Pz9HRVdVf303NQcFwMCgYPDwWIj4%2BFiI%2BPgg4AEBBwYPCD84T0iPjr%2BI9%2FeAgGDgkHDcPNIy8XHdMe%2FvAQEDAwcHDw8PDz4%2B4OAAAP%2Bdd3UnJQcFPzs%2BIp%2Bf%2BvoAADg4OCg4KDgoOCg4KDgoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACwrPz%2BnpOTkHBwMCPz5xcdBQ8%2FNXV1xc4ODAQPx8jo7rin9%2FCgo6Ond3AwIPDxwc11H%2B%2FpCQnJzu7sBA8PA4OH98HxgvIF9DXUTfz%2FuIf394%2BIx88g77h%2F0D%2FYP7B%2F7%2BBwU%2FPT8iHx0uIl9HXUQ%2FP7h4xDz6BvvH%2FQP9g%2FsH%2Fv4%2FP2xjf3%2F%2Bgv%2B7%2FoL%2Fg39%2FODju3vLOvWP9471j%2FeP%2B%2FhwcPj4vLycnZ2fBwYCAAABzcwYGGRgnIH5BfUd%2BVnh4OCg4KDgo%2Fv6CgkREKCgQEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA%2BPkdF5qXmpf6Z%2FcMcHCYmQkJGQp6Cvoa8vGBgAAA%2BPkdF5qXmpf6Z%2FeMfFwAAAAAAAICAvr7BwQEB%2B8MAAD4%2Bf3%2F%2F5%2F%2FB%2F%2Bd%2Ffz4%2BAAAAAICA4OD4%2BODgwMAAAP%2F%2FRYP%2F%2F02D%2F%2F7Df9zku8gAAAAA4OA4OOwM9IR3D%2FQMPz9%2FQf6B%2FrH8s%2FmH%2F4d5eQAAgICAgICA%2Fv4BbQFt%2Fv7%2FgX99f0E%2FIZ%2Bf%2BvpzcwIC%2F%2F9Fg%2F%2F%2FTYP%2B%2FuN83%2BG%2BggAAAAAAAMDAMDDpCffnEx9%2Ff05wf38%2FPVdVV1T%2F%2BP%2BA%2BPgkHPz8Ggb%2B%2Fu0j%2F7%2FlIwAAAAAAAAAAAAAAAAAAAAD%2Fh3t7AwMlJWhon59oaCAg%2FPwGLgJqgsr8%2FP%2F%2FhIQAAH9%2FAwMFBSgoaGifn2hoICA8PAJqgsr8%2FEJC%2F%2F9CQgAAAAB8fPvHhIOCgXlHPj4AAAAAAADg4D7%2BMPDAwAAAAAC7iH8E2zemfnj4gYEBAQEB9Az2TvrGekb2nvxM8DDg4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAwMBAQICPTxjQP6B%2Fav%2B%2Fr2EfQTfNKZ7b%2F%2B%2FsB8VHx%2F6DvoG%2Bgb6Bn6C%2FQP5B%2F7%2BPz9%2Ff%2F%2FI%2F4H%2FkP%2FE%2F%2F%2F%2F%2F%2Fz8%2Fv7%2FJ%2F8D%2FxP%2FR%2F%2F%2F%2F%2F%2F%2B2v%2BJ%2F813V3JSYmIgICAgPj5jY39%2FPj4ICGtrPj4cHDw8akZCfjw8GBj%2F%2F9mH2Yc8PEJ%2Bmeelw6XDmedCfjw8AAA8PGZmWlpaWmZmPDwAAAAAODh%2Ff%2F7k%2F7D%2Fhn4AAAAAPhxdAEEAPgAIAGsAPgAcfn6lw%2F%2F%2FpcP%2F%2F6XDWmY8PAD%2FAP8A%2FwD%2FAP8A%2FwD%2FAP%2F%2FAP8A%2FwD%2FAP8A%2FwD%2FAP8AGBgYGDg4%2BPjw8AAAAAAAAH5%2Bgf%2BB%2F4H%2Fgf%2BB%2F4H%2Ffn7%2F%2FxERERERERER%2FxER%2F%2F%2F%2F%2F%2F%2F%2Fw%2F%2FDfn7%2F%2F%2F%2FD%2F8N%2BfhAQEBAoKCgoRER8RHxEfHx%2Bfp%2Bf%2F%2F9uQm5C%2F%2F%2Bfn35%2Bfn7%2Fg%2F%2BD%2F4d%2BfgAAAAAAAA8PCwgLCAsIGxg3MC8gLyfw8LBwsHCwcJh43DzMPOQcLiEkIykpLyY2MRETDg4AAIT89Pz8XHzU3LQkbNjYAAA4OHxE7oLOis6K%2FpJ8RDg4AAAAAAAADw8fHxwcGBgYGDw8ZmZOTk5OTk5OTmZmPDwYGDwEPAQ8BDwEPAQ8BBgYGBgYGBgYGBgYGBgYGBgYGAAAAAA%2BPkhJrq%2F%2B%2F35%2FPj4AAAAAgIAYGLy8mJiAgICAAAAAAIyMEhKJiZKSjIyAgAAAAAAAAPDw%2BPg4OBgYGBjDJABCAIEAAAAAGAA8AGYYAAAAAAAAAAAAAAAAAAAAABgYGBgcHB8fDw8AAAAAAAAAADw8ZmZmZmZmZmY8PAAAAAAYGDg4GBgYGBgYPDwAAAAAPDxOTg4OPDxwcH5%2BAAAAAHx8Dg48PA4ODg58fAAAAAA8PGxsTExOTn5%2BDAwAAAAAfHxgYHx8Dg5OTjw8AAAAADw8YGB8fGZmZmY8PAAAAAB%2BfgYGDAwYGDg4ODgAAAAAPDxOTjw8Tk5OTjw8AAAAADw8Tk5OTj4%2BDg48PAAAAAA8PE5OTk5%2Bfk5OTk4AAAAAfHxmZnx8ZmZmZnx8AAAAADw8ZmZgYGBgZmY8PAAAAAB8fE5OTk5OTk5OfHwAAAAAfn5gYHx8YGBgYH5%2BAAAAAH5%2BYGBgYHx8YGBgYAAAAAA8PGZmYGBubmZmPj4AAAAARkZGRn5%2BRkZGRkZGAAAAADw8GBgYGBgYGBg8PAAA%2F%2F%2Fg4M%2FAmIe3j6%2Bfr5%2BvnwAAZmZsbHh4eHhsbGZmAAAAAGBgYGBgYGBgYGB%2BfgAAAABGRm5ufn5WVkZGRkYAAAAARkZmZnZ2Xl5OTkZGAAAAADw8ZmZmZmZmZmY8PAAAAAB8fGZmZmZ8fGBgYGAAAAAAPDxiYmJiampkZDo6AAAAAHx8ZmZmZnx8aGhmZgAAAAA8PGBgPDwODk5OPDwAAAAAfn4YGBgYGBgYGBgYAAAAAEZGRkZGRkZGTk48PAAAAABGRkZGRkZGRiwsGBgAAAAARkZGRlZWfn5ubkZGAAD%2F%2FwcP%2BwcN8%2F37%2Ffv9%2B%2F37AABmZmZmPDwYGBgYGBgAAAAAAAAAAAAAAAAwMDAwAACvn6%2Bfr5%2Bvn6%2Bfr5%2Bvn7%2BAAAAAADAwMDAAADAwMDAAAAAAAAAAAAAAMDAwMBAQICAAAH5%2BDg4cHDg4cHB%2BfgAAAAAcHBwcHBwcHAAAHBwAAAAAAAAAADw8PDwAAAAAAAA4OHxE7oLOis6K%2FpJ8RDg4AAAAAEREKCgQECgoREQAAAAAAAAAAAAAAAAAAAAAAADv7xAQEPcQ9%2F%2F%2F%2F%2F8AAAAAfnz%2F%2Fv%2BCw4L%2F%2Fv%2F%2Bw4LDgv%2F%2B%2F%2F7DgsOC%2F%2F7%2F%2FsOCw4Lv7xAQEPcQ9%2F%2F%2F%2F%2F8AAAAAAQEBAQEBAQEBAQEBAQEBARwcIiJPT0tLEREREQEBAQFwcIiIxMQkJBAQEBAAAAAAAQEDAwUFCQkRESEhQUGBgQB8AEQAVAAoACgAKAA4AAABAQICBAQICBAQICBAQICAAH44x3yDfIN8g3yDOMcAfgAAEBA4OHx8AAAQEDg4fHz9%2B%2F37%2Ffv9%2B%2F37%2Ffv9%2B%2F0DAQEGBgoKDAwwMFBQYGCAgAAAAAAIABgAJABEAJIAOQCBgUFBISEREQkJBQUDAwEB%2F%2F8BAQEBAQEBAQEBAQEBAYCAgICAgICAgICAgICA%2F%2F8%2FP39%2F%2F8j%2Fgf%2BQ%2F8T%2F%2F%2F%2F%2F%2FwAAAP8AAAD%2FAAAA%2FwAAAAAAAAADAwwMEBAgICAgQEAAAAAAgIBAQCQkGhoBAQYAAAAAAAAAAAAAAAAAgIBAQAEBAgIEBA8IBwQDAgEBAACAgAAAwQD3AP8A%2F0D%2F4z4%2BEwCZAMEA4wD%2FAP%2BAf0E%2BPkBAoCDgIMBAwECAgAAAAAAPDxISPj4iIltbQUFhYSMjwMBgYCAgMDAQEBAQEBDw8D4%2BBAQODhAQPj7AwKio%2F%2F8ICAcHAAAAAAcHGBgSEv%2F%2FAADw8AwMAgKBgQEBQUH%2B%2Fv%2F%2F%2F%2F%2F%2FyP%2BB%2F5D%2FxP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2Fyf%2FA%2F8T%2F0f%2F%2F%2F%2F%2F%2F%2F%2BAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID%2F%2FwAAAAAAAAAAAAAAAAAAAQEBAQEBAQEBAQEBAQEBAf8A%2FwD%2FAP8A%2FwD%2FAP8A%2FwD8%2FP7%2B%2Fyf%2FA%2F8T%2F0f%2F%2F%2F%2F%2FAAAYGCQkWlpaWiQkGBgAAAAA%2F%2F%2BBgUJCPDwAAKqqVVViYp%2BfYmIAAH5%2BgYF%2BfgAA9vaVlfb2AAB8fLKyt7d8fAAAQ0NFRU9PSUlBQX9%2FX18AAOLiEhKXl5WV9fUlJaenQkJCQkJCQ0NBQUFBQUFDQyAgICBvb%2BnpRkZGRklJz88AAAAQADgAOAB8AGwAbAA4gIBAQCAgEBAICAQEAgIBAQAAAAAAAAAAAAAAAAAAAAD%2F%2FwAA%2F%2F%2F%2F%2F%2F%2F%2F%2Fwj%2FQP8R%2FwD%2FAP%2F%2FAP%2F%2F%2FwD%2F%2F%2F%2F%2F%2F35%2B%2F4P%2Fu%2F%2Bj%2F6P%2Fh%2F%2F%2Ffn5%2BfoODn5%2Bfn5%2Bf%2F%2F%2F%2F%2F35%2B%2F%2F%2F%2FIv8i%2FyL%2F%2F%2F%2BI%2F4j%2FiD8%2Ff3%2F%2FyP%2BB%2F5D%2FxP%2F%2F%2F%2F%2F8%2FP7%2B%2Fyf%2FA%2F8T%2F0f%2F%2F%2F%2F%2FPj5jY8HBgYGDg4OD7%2B9%2Ffz8%2Ff3%2F%2F%2F%2F%2F%2F9%2FfV1VVVUVH%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F3d3VVVVVRER%2FPz%2B%2Fv%2F%2F%2F%2F93d1VVVVUUFP%2F%2F%2F5n%2Fmf%2BZ%2F%2F8AAAAAAAAAAAAAAAAAAAAAAAAAAAAA%2F%2F%2F%2F%2F%2F%2FI%2F4H%2FkP%2FE%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FJ%2F8D%2FxP%2FR%2F%2F%2F%2F%2F8AAAAAAAAAAAAAAAAAAAAA%2F%2F%2F%2FgP%2BA%2F4D%2FgP%2F%2Ff0B%2FQP%2F%2Fxz%2FHP8c%2Fxz%2F%2F%2F%2BYe5h5%2FQH9Af0B%2FQD8%2Ff0B%2FQH9A5h7mHuYe5h78%2FOYe5h7mHv39%2F4b%2FhP%2BE%2F4T%2FhP%2BE%2F4T39%2F8I%2Fwj%2FCP8I%2Fwj%2FCP8I%2F8D%2FYP8w%2FxD%2FH%2F8Y%2Fxj%2FGP%2BE%2F4T%2FhIf8hP%2F8%2F%2F%2F%2F%2Ff3%2FCP8I%2Fwj%2FCAj%2FCP%2F%2F%2F%2Ff3%2Fxj%2FGP8Y%2Fxg%2F%2F3%2Fw%2F%2BD%2FwL%2B%2F%2F2H%2FIf8h%2FyH%2FIf8h%2FyH%2FIf8h%2FyHhPyH%2FP%2F%2F%2F%2F7%2B%2FZmb%2Fmf%2BZ%2F5n%2Fmf%2BZ%2F5lmZv%2F%2FAAD%2F%2F%2F8AAP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FxERERERERER%2FxER%2F%2F%2F%2Ffn6B%2F4H%2Fgf%2BB%2F4H%2Fgf9%2BfsNyWsO7WsNlW8PrW8NEXMPeXM1LWM2SWMn6Hdr%2BA8ghANp%2BPXfAPih3IypOK9YBJyL%2BmSAEDXl3ySEd2v5QKAmnwLEgDz4Dd8l5p8A%2BAnc%2BUOAGyXn%2BAcA%2BAXc%2BMOAGyfDtR6fKpVn6C9pvJsARCADlGX3qC9r%2BUCAFPjDqC9rhDiAW9n3%2BMCASeeoD2nrqB9p4%2FsAgQeoM2hg8%2FjggEnnqBNp66gjaeP7AICvqDdoYJv5AIBJ56gXaeuoJ2nj%2BwCAV6g7aGBB56gbaeuoK2nj%2BwCAD6g%2Fa8Owi8OsieBFYWf4BKDkU%2FgIoNBT%2BBCgvFP4FKCoU%2FggoJRZZHf4QKB4U%2FiAoGRT%2BQCgUFP5QKA8U%2FoAoChQeX%2F7%2FKAMR%2FvZ6IiPw7CLw68YIInt3r%2BDt4Ozg63gRAAH%2BASg2FP4CKDEUFP4EKCsU%2FgUoJhYI%2FggoIBYQ%2FhAoGhYg%2FiAoFBZA%2FkAoDhZQ%2FlAoCBaA%2FoAoAhgDzWYBITDA5X6nymZafQEG2hEK2iET2v5IKEkNHS3%2BQCgwDR0t%2FjgoFg0dLfoM2v7AKEF%2BPHf%2BAsJmWq93GDX6Ddr%2BwCgufjx3%2FgLCZlqvdxgi%2Bg7a%2FsAoG348d%2F4CIGWvdxgQ%2Bg%2Fa%2FsAoCX48d%2F4CIFOvd%2BHlNSwsLCw1LS1%2B%2FvY4Exo8Enf%2B%2BTgLPT13%2FvcoBD09EncKPQIgKj4gAj72Eq8yMiIsLCwiInd9IQzaAQQA%2FjYoCyz%2BPigGLP5GKAEsr3cJd%2BERCAAZff5QwqhZySEwwPAE5gM8Rz4gxhgFIPtHIj4QTyKvV%2FCZ%2FgIgAz4gV3oiLHgiecYIIno8Iix4xghHInkiesYQVyIseCJ5xggiFHp3PhXgs8n6J9rLRygH8IDLR8JWWyEi2n48d%2F4DwK93%2Bifay0coLCEwwAYEfv6AKAw%2BGIYiLCwsBSD2GBYGAj44IiwsLAUg%2BQYCPkAiLCwsBSD5IeqYAWAAESfaGjwS%2FgM4EAn%2BBTgLCf4HOAYh6pivPBJ86hjafeoZ2iEj2hrLRygOPi4iPi8iPi8iPjB3GAw%2BLSI%2BLCI%2BLCI%2BLXc%2BFuCzya%2FqItrqJ9rqGto%2BF%2BCzySEc2n6nIAc0IejfPgp3ITHAEZ1cBgT6FNqnKAQTPSD8NCwaT%2F7%2FIAkRnVyv6hTaGk%2Fwmf4CIAR5xiBPeSITLCwFIN36FNrGBOoU2iExwDr%2BgDAqxgTgrn7GEOCtARbaCj0CwD4BAs1TAX7%2BLigF%2FjAoBsk%2BGOCzyT4Z4LPJr%2Boc2j4a4LPJITDABgQRnVz6FNqnKAVPEw0g%2FDQsLBpP%2Fv8gCRGdXK%2FqFNoaT%2FCZ%2FgIgBHnGIE95IhMsBSDd%2BhTaxgTqFNohMMB%2B%2FlAoCf5oKAX%2BgCgByT4I6hbaPhfgs8khMMAGBBGdXPoU2qcoBU8TDSD8NSwsGk%2F%2B%2FyAJEZ1cr%2BoU2hpP8Jn%2BAiAEecYgT3kiEywFIN36FNrGBOoU2iEwwH7%2BOCgJ%2FlAoBf5oKAHJPgjqFto%2BF%2BCzyQIDEhMCAxITAgMSEwIDEhMEBRQVBAUUFQQFFBUEBRQVAAEWFwABFhcAARYXAAEWFwQFFBUEBRQVBAUUFQQFFBX%2F%2Bhfap8JpXQ4CIdGYEWAA%2BjDAR%2F44KAQ%2BLCIyGXj%2BUCgEPiwiMhl4%2FmgoBD4sIjIZeP6AKAQ%2BLCJ3DSDNITHAOsYY4K5%2Bxgjgrc1TAX7%2BAygb%2FuUoHv4CKAw%2BAuoX2iHo3z4Nd8k%2BA%2BoX2hjyPgTqF9oY6%2FC1pygMIejfPg53PgHqF9rJPhDqF9oY0%2FoX2v4QMDD%2BAtICXvob2j3qG9rAPkDqG9qv6hfa6hTa6hza6h7a6iDaPOoW2j5A6h%2FaPhvgs8n6H9o96h%2FawD4D6h%2Fa%2BhfaPOoX2v4oKD%2F6HNqnIBA86hzaIeDfPgR38Jn%2BAigpITLABgT6HtqnIA886h7afsYgIiwsLAUg9sk96h7aftYgIiwsLAUg9sk%2BAeoX2jzgmeC1yfof2j3qH9rAPgTqH9r6INqnICohMMA%2BOEciPlhPIiwseCJ5xggiLCx4xghHInkiLCx4InnGCCKvPOog2skhMMD6Idr%2BAsraXqcgZX49Iiw%2BCEfwmf4CIAR4xiBHeCIsfj0iLHg8Iix%2BPSIseMYQRyIsfj0iLHg8d%2Fog2jzqINr%2BBsAh4N8%2BCHf6Fdqn%2FpkwF8YBJ%2BoV2hGLmPoV2kfmDxIdeObwyzcSPgHqINrqIdrJfjwiLCwsfjwiLCwsfjwiLCwsfjx3%2BiDaPOog2v4FwCHg3z4C6iHayX48IiyvR%2FCZ%2FgIgBHjGIEd4Iix%2BPCIseDwiLH48Iix4xhBHIix%2BPCIseDx3r%2Bog2uoh2voX2j3qF9rJcoo9%2FgkwkIKCgpNviz3%2BAo2RNlBgcICJPf4CjkE2UWFxgIo9%2FgKPQTZSYnKAiz3hPv4HMTNDU2NzgII9HeEB%2FgcxNERUZHSAgj0YsRzhCf4HMTVFVWV1gII9GbEd4Qj%2BCoQ2RlZmdoiCPSmxCuEJ%2FgeFN0dXZ3eAgT2xG%2F4HhThIWGh4gIE9sR3hTv4JhjlJWWl5h4M94U%2F%2BBzE6SlpqeoCBPeFc%2FgcxO0tba3uAgT3hXf4CMUFDbHyAgT3hXv4CMUFDbX2AgT3hX%2F4CMUFDbn6AgT3%2BAjGSUn%2BAgT3%2BCTJCg4ODg4GJPf5yij3%2BDA8ADw%2BAEwyEIQwAJQyEKAQAKQQAKgaELYuOMg%2BEOw8EPA%2BEPQ%2BEQAOOQg%2BORo2ETw8AUgSOUo8OU42EVQ8AVwyEXQwAXoyAYAyAYgwAZA8AaQ8AbQ%2BEdQ8OeA%2BEeg8OgAyEgQi%2FiQOOjocKkoQL%2F%2F8ODIQQCoQRBcITCAAVBsIXCEIYCIQaB8IcBUIeCMIiDAQkCgQnCIQvBAQvCIQwCAA0hQo3igo5BMI%2BCIQ%2FCMJCB8JEBkJHBkJJBMJLCIRMB8JOBUJQCEJTD4RYDABZiQBdiApgBApiiQpnBMJoiwRrBEJsCIR0Cgt%2BDIR%2FCkKBBkKEBwqHhTaIBTb%2FDU0CDwqEEw%2BEGwYMHAYMHU8CHw2AJE8CJ0%2BCKAaMKE0CKg%2BELwiMMAgMMQiMMs4CNQuEN0wCOc0CQAQMQQQMQo2%2FSgu%2FTI0%2FUQSMUgSMVESCVYWMXgwEXg6AYYSMYoSMZYQMZoQMZ4QMaRCEbwq%2FdY02dg02do02dw02d402fY4%2FgA2%2Fh46%2Fig0%2FjQWMkg0I%2F%2F8VX75iF2jHaL5iAGK%2BYoFjX2S%2BYg1lvmIAYoFjAGK%2BYt5ltWa7Z%2F%2B%2BYhdox2imaWFqI2thavVrq2wjayNrKW2tbfVrq2ymabtn%2F75iynafdy9uIW%2Fyb%2FJv%2FXAhby9uL25TcvJy4HPIdIdxh3HGdf8AAlNA4mBh%2FgJTQOJgYf4CU0CRgeJgYf4CU0DiYGH%2BAlNA4mBh%2FgJTQOJgYf4CU0DiYGH%2BAlNAxHByYGH%2BAlNAxHFzYGH%2BAlNAwTbiYGH%2BAlNAlzJSNFJSYGH%2BAlNAkjM24mBh%2FgJTQJE24mBh%2FgJTQIE24mBh%2FgJTQGGBgV61Y2NjYGH%2BAlNAkV61Y2NjYGH%2BAlNAQUShXuJgYf4CU0AyQUWxXuJgYf4CU0AyQkbBXuJgYf4CU0AyQ0fTXmBh%2FgJTQNM2YGH%2BAlNAxHByYGH%2BAlNAtTZxc2Bh%2FgJTQLFe4mBh%2FgJTQLI2XuJgYf4CU0CSgTbTXmBh%2FgJTQJE24mBh%2FgJTQIE2xDIxYGH%2BAlNAcTbBM%2BJgYf4CU0BxXrUyMTFgYf4CU0CBXrEz4mBh%2FgJTQDFEkV7iYGH%2BBFNAQUWhXuJgYf4EU0BCRrFe4mBh%2FgRTQEFFwV7iYGH%2BBFNAQkbTXmBh%2FgRTQENH4mBh%2FgJTQOJgYf4CU0DiYGH%2BAlNA4mBh%2FgJTQLVSUlJgYf4CU0CmNmDo6Ohh%2FgJTQKZeYOjo6GH%2BAlNAtWDo6Ohh%2FgJTQKY2YOjo6GH%2BAlNApl5g6OjoYf4CU0C1YOjo6GH%2BAlNAcYG1YOjo6GH%2BAlNAcYK1YOjo6GH%2BAlNAcYG1YOjo6GH%2BAlNAcYK1YOjo6GH%2BAlNAcYG1YOjo6GH%2BAlNAtWDo6Ohh%2FgJTQLVg6OjoYf4CU0C1YOjo6GH%2BAlNAtWDo6Ohh%2FgJTQLVg6OjoYf4CU0C1YOjo6GH%2BAlNAeXBycnJg6OjoYf4CU0B5cXNzc2Do6Ohh%2FgJTQFGC4mBh%2FgJTQFGCxDIxYGH%2BAlNAUYKhgcEz4mBh%2FgJTQFGAtTIxMWBh%2FgJTQFGCsTPiYGH%2BAlNAUYLiYGH%2BAlNA4mBh%2FgJTQDf99OJgYf4CU0DiYGH%2BAlNA4v1Q%2FgJTQOL9Uv4CU0DiYGH%2BAlNA4mBh%2FgJTQOJgYf4CU0ChguJgYf4CU0BhgaGC4mBh%2FgJTQKGC4mBh%2FgJTQOJgYf4CU0DiYGH%2BAlNA4mBh%2FgJTQNM2YGH%2BAlNAwTbiYGH%2BAlNAsTbiYGH%2BAlNAoTbiYGH%2BAlNAkjZ%2F4mBh%2FgJTQIE2oX%2FiYGH%2BAlNAYoE2oX%2FiYGH%2BAlNAYYGhf%2BJgYf4DU0CBUjaBoX%2FiYGH%2BA1NAgVJegaF%2F4mBh%2FgJTQGGBoX%2FiYGH%2BAlNAYoFeoX%2FiYGH%2BAlNAgV6hf%2BJgYf4CU0CSXn%2FiYGH%2BAlNAoV7EMjFgYf4CU0CyXjPiYGH%2BAlNAMUS1MjwxYGH%2BBFNAQUWxM9NeYGH%2BBFNAQkbi%2FVD%2BBFNAQ0f%2BAlNAtTIxMWBh%2FgJTQLEz0zZgYf4CU0CmMjE0MWBh%2FgJTQKIzNuJgYf4CU0CxXuJgYf4CU0CyNl7iYGH%2BAlNAoTbTXmBh%2FgJTQJE24v1Q%2FgJTQIE2%2FgJTQHE24v1S%2FgJTQGE2pkhKY2NgYf4CU0BRNqZJS2NjYGH%2BAlNAUV61TGNjYGH%2BAlNAYV7EY2NgYf4CU0BxXsRjY2Bh%2FgJTQIFetWNjY2Bh%2FgJTQJFetWNjY2Bh%2FgJTQHGCpl5jY2NgYf4CU0BxgrVjY2NgYf4CU0BxgLVjY2NgYf4CU0AxRLVjY2NgYf4EU0BBRbE24v1Q%2FgRTQEJGoTbi%2FVL%2BBFNAQ0eRNtNjYGH%2BAlNAgTbEY2NgYf4CU0BxNsRjY2Bh%2FgJTQGE2pmP0Y2NgYf4CU0BRNpL9Y8RjY2Bh%2FgJTQFFel2Nj9GNjYGH%2BAlNAYl5jkv1jxGNjYGH%2BAlNAamNj9GNj9GNjYGH%2BAlNAW2NjY15jY2NjY2Bh%2FgJTQExjY2Nj9GNjY2NjYGH%2BAlNANf1jl2NjY2NjYGH%2BAFNAY2NjY2Nj9GNjY2NjYGH%2BCFNAY2NjY2Njl2NjY2NjYGH%2BAlNA015gYf4CU0Ax9FH0cfSR9LH04mBh%2FgJTQOJgYf4CU0DiYGH%2B8Y7%2B8Y%2F%2B8Y7%2B8Y%2F%2B8Y7%2B8Y%2F%2B8Y7%2B8Y%2F%2B8Y7%2B8Y%2F%2B8Y7%2B8Y%2F%2B8Y7%2B8Y%2F%2B8Y7%2B8Y%2F%2B8Y7%2BIY7xj%2F4AEySPjo6Ojo6Ojo6OjhMkjv4AITmOj4%2BPj4%2BPj4%2BPjyE5j%2F4A%2FX%2F%2B4v1%2F%2FuL9f%2F7i%2FX%2F%2BAX%2Fi%2FX%2F%2BAX%2FE%2FX%2F%2BAX9x9JH0tfR%2Ff39%2F%2FgF%2FcfSR9LX0f39%2Ff%2F4Bf3H0kfS19H9%2Ff3%2F%2BAX9x9JH0tfR%2Ff39%2F%2FgF%2FcfSR9LX0f39%2Ff%2F4Bf3H0kfS19H9%2Ff3%2F%2BAX%2FE%2FX%2F%2BAX%2Fi%2FX%2F%2BAX%2Fi%2FX%2F%2B4v1%2F%2FsR0d39%2F%2FsR1eH9%2F%2FgBycnJycnJycnJycnJ2eX9%2F%2FgBzc3Nzc3Nzc3Nzc3Nzc39%2F%2FgD9f%2F7i%2FX%2F%2BwfTi%2FX%2F%2B4v1%2F%2Fgj9f8H04v1%2F%2FgF%2FMfR0%2FX%2Fi%2FX%2F%2BAX%2BB9KF%2FwfTi%2FX%2F%2BAX8x9FF%2FoX%2Fi%2FX%2F%2BAX9Rf4H0oX%2FB9OL9f%2F4BfzH0UX%2Bhf%2BL9f%2F4Bf1F%2FgfShf8H04v1%2F%2FgF%2FMfRRf6F%2F4v1%2F%2FgF%2FUX%2BB9KF%2FwfTi%2FX%2F%2BAX8x9FF%2FoX%2Fi%2FX%2F%2BAX9Rf4H0oX%2FB9OL9f%2F4BfzH0UX%2Bhf%2BL9f%2F4BfzN0d3%2BB9KF%2FwfTi%2FX%2F%2BAX8zdXh%2F4v1%2F%2FgZycnJ2eX%2FB9OL9f%2F4Ac3Nzc3N%2Ff39%2Ff39%2Ff39%2Ff%2F4CU0D%2BAlNA4v1S%2FgJTQEFEtTIxMWBh%2FgJTQDJBRbEz4mBh%2FgJTQDJCRogyMTExMTFgYf4CU0AyQ0eIMzIxMTExYGH%2BAlNAkTPiYGH%2BAlNA4mBh%2FgJTQOJgYf4CU0Di%2FVD%2BAlNAsWj%2BAlNAsWn%2BAlNAMUS1aTc3Nzf%2BBFNAQUW1aTc3Nzf%2BBFNAQkaxaf4EU0BDR3FosWr%2BAlNAUfRxaf4CU0B5aTc3Nzc3Nzc3%2FgJTQFH0cWn%2BAlNAcWr%2BAlNAMfRxaP4CU0AxgXlpNzc3Nzc3Nzf%2BAlNAMfRxavE2%2FgJTQLFo4Tb%2BAlNAsWnhXv4CU0CxaeI2Xv4CU0C1aTc3Nzf%2BAlNAsmk2%2FgJTQLJpXv4CU0BBRLFq0V7%2BAlNAMkFFkWjhXv4CU0AyQkaRafFe%2FgJTQDJDR5Fp%2FgJTQFH0l2k3Nzc3Nzf%2BAlNAkWnxNv4CU0CRaeE2%2FgJTQJFq0Tb%2BAlNAcWjRXv4CU0Ax9HlpNzc3Nzc3Nzf%2BAlNAcWrxXv4CU0BxaP4CU0Bxaf4CU0Bxaf4CU0Bxaf4CU0BxaeIyMf4CU0BxaeEz%2FgJTQHFp%2FgJTQHlpNzc3Nzc3Nzf%2BAlNAeWk3Nzc3Nzc3N%2F4CU0B5aTc3Nzc3Nzc3%2FgJTQDFEeWk3Nzc3Nzc3N%2F4EU0BBRXlpNzc3Nzc3Nzf%2BBFNAQkZ5aTc3Nzc3Nzc3%2FgRTQEFFcWnhNv4EU0BCRnFp4V7%2BBFNAQ0dxaeI2Xv4CU0BxadE28TL%2BAlNAcWnRXvEz%2FgJTQHFptTIxMTwx%2FgJTQHFqsTPxXv4CU0D%2BAlNA%2FgJTQP4CU0BR9HH0kfThaP4CU0Dhaf4CU0DiaTf%2BAlNA4Wn%2BAlNAoWjhav4CU0Chaf4CU0CmaTc3Nzc3%2FgJTQHFooWnxNv4CU0BxaaFq4Tb%2BAlNAMYFxaeFe%2FgJTQDGCcWniNl7%2BAlNAMYF5aTc3Nzc3Nzc3%2FgJTQDGCcWmyXzbhaP4CU0AxgXFppjJSPFJpUv4CU0BxaaEz015pN%2F4CU0BxauFp%2FgJTQLGB4mpe%2FgJTQHFo%2FgJTQDFEeWk3Nzc3Nzc3N%2F4EU0BBRXFq%2FgRTQEJG%2FgRTQENH%2FgJTQMQyMTEx%2FgJTQMEz%2FgJTQOIyMf4CU0DhM%2F4CU0D%2BAlNA%2FgJTQP4CU0D%2BAlNA%2FgJTQEH0%2FgJTQEH0%2FgJTQEH0%2FgJTQIF%2F%2FgJTQIF%2F%2FgJTQIF%2F%2FgJTQDH0%2FgJTQP4CU0Ax9OFo%2FgJTQOFp%2FgJTQOFp%2FgJTQOJpN%2F4CU0Dhaf4CU0Dhaf4CU0Dhav4CU0AxRP4EU0BBRf4EU0BCRv4EU0BDR%2FFj%2FgJTQOL9Y%2F4CU0DT%2FWP%2BAlNAxP1j%2FgJTQLX9Y%2F4CU0Cm%2FWP%2BAlNAl%2F1j%2FgJTQFGBl%2F1j%2FgJTQJf9Y%2F4CU0AxRKb9Y%2F4EU0BBRbX9Y%2F4EU0BCRvE2%2FgRTQEFF0%2F1j%2FgRTQEJG0zZjY%2F4EU0BDR8E28WP%2BAlNAwV7%2BAlNA0V7%2BAlNA4V7%2BAlNA8V7%2BAlNA%2FgJTQOIyMf4CU0DiMzL%2BAlNA8TP%2BAlNA%2FgJTQP4CU0D%2BAlNA%2FgJTQP4LZW5tbm1lZWVlZWXiZW7%2BC2Ztbm1uZmZmZmZm4mZt%2FgZlbm1uWVuRX%2BJlbv4GZm1ubVpc4mZt%2FgVlbm1mVeJlbv4DZm1uQVZiXTXiZm3%2BA2VubUFX4mVu%2FgNmbWZCWCuhgeJmbf4CZW5CWVuhguJlbv4CZm1CWlyhgeJmbf4CZW5CV1WSX4LiZW7%2BAmZtoYHiZm3%2BAmVuQlZX4mVu%2FgJubUErxGVlbm3%2BAm1uQVViXTXEZmZtbv4CZm1BV%2BJmbf4DZW5lQjgr4mVu%2FgZmbW5lOFXiZm3%2BCWVubW5lZWVlZeJlbv4JZm1ubWZmZmZm4mZt%2FgRlbm1mUVfiZU7%2BA2ZtblFVtXBycm5t%2FgNlbm1RVbVxc3Ntbv4DZm1uUVjiZm3%2BA2VubUMrK1biZW7%2BA2ZtblEl4mZt%2FgNlbm1RV6ZwcnJycnL%2BA2ZtbqZxc3Nzc3P%2BA2Vubf4DZm1u%2FgNlbm2XcHJycnJycv4DZm1ul3Fzc3Nzc3P%2BA2Vubf4DZm1uUVf%2BA2VubVFY4WX%2BA2ZtbqZwcnJybmX%2BA2VubVFVpnFzc3Ntbv4DZm1uUVbiZm3%2BA2VubVFX4mVu%2FgRmbW5lUVjiZm3%2BBmVubW5tVsRlZW1u%2FgZmbW5tbljEZm5ubf4FZW5tbm1iXTXEZW1tbv4GZm1ubW5WxGZubm3%2BFm5tbm1ZW8RlbW1u%2Fgf0bW5tblpcxGZubm3%2BBvRubW5tK8RlbW1u%2Fgb0bW5tbinEZm5ubf4H9G5tbm1VOMRlbW1u%2Fgf0bW5tblc4xGZubm3%2BB%2FRubW5tVVbEZW1tbv4G9GVubW5VxGZubm3%2BBvRmbW5tV8Rwcm1u%2Fgb0ZW5tbivEcXNubf4F9GZtbm3EZW1tbv4F9GVubW5iXTXEZm5ubf4G9GZtbm1VxGVtbW7%2BBvRlbm1uWMRmbm5t%2Fgf0Zm1ubVY4xHBybW7%2BFWVubW5VxHFzbm3%2BEWYxZqZwcnJybW7%2BIllbpnFzc3Nubf4iWlziZW7%2B4mZt%2FjE44mVu%2FjFVUl014mZt%2FjJWVeJlZv4yVyvhZv4yWCv%2BMlc4%2FjJWOP7%2BMVZSXTXhZf4xVeJmZf4xVuJlbv4xV%2BJmbf4jWVs44mVu%2FhRlWlxV4mZN%2FgJlbkL9OOJlTv4CZm0yZVbiZk3%2BBGRkUVW1%2FWT%2BBGRkUVa1%2FWT%2BBGRkUVfiO1P%2BBmRkUVVdNeI7U%2F4DZGRR4v1k%2FgVkZFFZW%2BL9ZP4FZGRRWlzi%2FWT%2BBWRkUVVW4v1k%2FgRkZFEr4jtT%2FgRkZFFV0387U%2F4FZGRRV1bTfztT%2FgVkZFFZW9N%2FO1P%2BBWRkUVpc0387U%2F4DZGRR0387U%2F4GZGQ9Ul01xDp%2FO1P%2BBmRkZGRRVsT9ZP4GZGRkZFErxP1k%2FgZkZGRkUVfE%2FWT%2BBGRkT1BRVcT9ZP4DZGRRUVjE%2FWT%2BE2ZtbvFm%2FiJmbf4iZW7%2BImZt%2FiJlblJdNeFl%2FiJmbeJmZf4iZW7iZW7%2BImZt4mZt%2FhNwcm7iZW7%2BE3FzbdNjbm3%2BMWbEY2Ntbv61Y2Njbm3%2BpmNjY2Ntbv4TWVtVl2NjY2Njbm3%2BE1pcVqZjY2NjbW7%2BMVe1Y2Njbm3%2BESsxWMRjY21u%2FhFWUl0102Nubf4RVTFW4mVu%2FhFXMVXiZmT%2B8WT%2B8WT%2B0X%2FxZP4BZSFlQWVlZYGCgoLRf%2FFk%2FgtmZW5lZmVmgYKCgtF%2F8WT%2BBGVubWZRZrFr0WvxZP4EZm1mVaL0a9Fr8WT%2BAmVuQl01s2v0a%2FFk%2FgJmbTJZW6L0a9Fr8WT%2BAmVuMlpcs2v0a%2FFk%2FgJmbTFYovRr0WvxZP4CZW4xVndSUlJSa%2FRr8WT%2BAmZtMVd1ZGRkZGvRa%2FFk%2FgJlbjFYcmRf0WvxZP4CZm1xZNFr8WT%2BAmVuMVVxZNFr8WT%2BAmZtMVdxZNFr8WT%2BAmVuMVZxUNFr8WT%2BAmZtMVfRa%2FFk%2FgNlbmVCXTXRa%2FFk%2FgRmbW5XwmNr8WT%2BBGVubVWzY%2FT08WT%2BA2ZtZqZj9PT0UmT%2BAmVul2P09PT0ZGT%2BAmZtgWOm9PT09FBk%2FgJlbnFjpP308WT%2BAmZtMVZhY6T0gfT08WT%2BAmVuMVVxY6T99PFk%2FgJmbYFjpP308WT%2BAmVuMVaVY%2FT09PTxZP4CZm0yVyukgvT09PFk%2FgJlbjJVK7OC9PTxZP4CZm0yWVvCY%2FTxZP4CZW4yWlzRY%2F4CZm0xVtP9ZP4CZW4zV1010%2F1k%2FgJmbTFVplJSUmRkZP4CZG6m%2FWT%2BBWRkUVlbpv1k%2FgVkZFFaXKb9ZP4EZGRRK6b9UP4EZGRRV5f9Uv4EZGRRJZf9ZP4DZGRRQl01l%2F1k%2FgNkZFGXUFBkZGRkZP4FZGQ9UlK1%2FWT%2BBmRkZGRkUXL9grX9ZP4GZGRkZGRReYKCSEpkZGRkZP4GZGRkZGRReYKCSUtkZGRkZP4GZGRkZGRRcv2CpkxkZGRkZP4GZGRkZGRRcv2Ctf1k%2FgZkZGRkZFF5gIJISmRkZGRk%2FgZkZGRkZFF5goJJS2RkZGRk%2FgZkZGRkZFFy%2FYKmTGRkZGRk%2FgVkZE9QULX9ZP4GZGRRWF01tf1k%2FgVkZFFZW7X9UP4FZGRRWlz%2BCWRkUVVWV1VWVf4DZGRRtf1S%2FgNkZFFRVcT9ZP4EZGQ9UlFWxP1k%2FgZkZGRkUVfBf%2BI7U%2F4GZGRkZFFYwX%2FiO1P%2BBmRkZGRRV8F%2F4jtT%2FgZkZGRkUSvBf%2BI7U%2F4GZGRkZFFVwX%2FiO1P%2BBmRkZGRRVsF%2F4jtT%2FgZkZGRkUVfBf%2BI7U%2F4GZGRkZFElwX%2FiO1P%2BBmRkZGRRVsF%2F4jtT%2FgZkZGRkUVXBf%2BI7U%2F4GZGRkZFFWwX%2FiO1P%2BBWRkZGRRwX%2FiO1P%2BB2RkZGRRXTXBf%2BI7U%2F4FZGRkZFGyOn%2FiO1P%2BB2RkZGRRXTWhOsF%2F4jtT%2FgZkZGRkPVKX4WRkZGRkZP4AZGRkZGRk7Ozs7GRkZGRkZP4G%2FWSm%2FWT%2BAP1%2F%2FuL9f%2F7i%2FX%2F%2B4v1%2F%2FuL9f%2F4Bfzj9guL9f%2F4Bf6GC0%2FR%2Ff%2F4BfzH0UfRx9JL0guL9f%2F4BfzH0UfRx9JL0gtP0f3%2F%2BAX8x9FH0cfSS9ILi%2FX%2F%2BAX8x9FH0cfSS9ILT9H9%2F%2FgF%2FMfRR9HH0kvSC4v1%2F%2FgF%2FMfRR9HH0kvSC0%2FR%2Ff%2F4Bf6GC4v1%2F%2FgF%2FOICCgoKCgoKC0%2FR%2Ff%2F7i%2FX%2F%2Bcv30xHR3f3%2F%2Bcv30xHV4f3%2F%2BAHJycnJycnJycnJycnZ5f3%2F%2BAHNzc3Nzc3Nzc3Nzc3Nzf3%2F%2BAP1%2F%2FvF%2F%2FvF%2F%2Fgz9f%2FF%2F%2FgF%2FMX%2Bi9H%2Fxf%2F4BfyL0f2L0f7GC8X%2F%2BAX8xgHGCovR%2F8X%2F%2BAX8i9H9i9H%2BxgvF%2F%2FgF%2FMYJxgKL0f%2FF%2F%2FgF%2FIvR%2FYvR%2FsYLxf%2F4BfzGCcX%2Bi9H%2Fxf%2F4BfyL0f2L0f7GC8X%2F%2BAX9xf6L0f%2FF%2F%2FgF%2FYvSCsYLxf%2F4BfzF%2FcX%2Bi9H%2Fxf%2F4BfzF%2FYvR%2FsYDxf%2F4Ef3R3f3F%2FovR%2F8X%2F%2BBH91eH9i9H%2BxgvF%2F%2FgRydnl%2FcX%2Fxf%2F4Ac3Nzf39%2Ff39%2Ff39%2Ff39%2Ff%2F7%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwAAAAAAAAAAAAAAAAAAHx8AAAAAAAAAAAAAAAAAAP%2F%2FAAAAAAAAAAAAAAAAAAD4%2BP8AAAD%2F%2FwAAAAABAQEBAwP%2FAAAA%2F%2F8AAH9%2FwMA%2FAP8A%2FwAAAP%2F%2FAADw8BAQ9xf0FP8AAAD%2F%2FwAAAAAAAN%2FfUFD%2FAAAA%2F%2F8AAAAAAAC%2Fv6Cg%2FwAAAP%2F%2FAAAAAAAA8fEZGf8AAAD%2F%2FwAAAAAAAP%2F%2FAAD%2FAAAA%2F%2F8AAAAAAAC%2Fv6Cg%2FwAAAP%2F%2FAAAAAAAA8PAYGP%2F%2F%2F%2F8A%2FwAA%2FwAAAP8AAAD%2F%2F%2F%2F%2FVVWqqlVVAAAAAAAAHBwiIl1dUVFdXSIiHBwAAAAWACkAQASAXYA%2BQQwyAAw%2FIHBQb09oSGhIaEhoSGhI%2FwAAAP%2F%2FAAAAAAAAAAAAAPwcLj7u3m5ebl5uXm5ebl4DAgMCAwIDAwEBAQEAAAAA%2FwD%2FB%2FwM9wf5Af7Af3AbGPcU9%2FQHBAcEx8RnZLc01xTfUN9Q31DfUN9Q31DfUP9wv6C%2Fo76ivqK%2Bor6ivqK%2Fo%2B0N9YX9hf2F%2FYX9hf2F%2FYX%2FAP8f8BD%2FH%2FAA%2FwD%2FH%2FAQv6C%2Foz4ivqK%2Bor6iv6M8IOwM9IT8hPyE%2FIT8hPyMeBgAaACWAAGEANUA%2FwA0ywA0AAAAwAAggBCAYACAAAAAAMbG5ubm5tbW1tbOzs7OxsbAwMDAAADb293d2dnZ2dnZAAAAAAAAAAAAAAAAAAABAQAAAAAAAAAAAAAAAP39h4cAAAAAAAAAAAAAAAD8%2FAYGf39AQH9Af0B%2FQH9%2FAAAAAPv4DwD%2FAP8A%2FwD%2F%2FwAAAAD3FPcU9xT3NuPjgYEAAAAAjwD%2FAP8A%2FwH%2FA%2F7%2BAAAAALygv6C%2Fo76iPiI%2BPgAAAAB9DfkZ8fEBAQEBAQEAAAAA%2Fx%2FwAP8A%2FwD%2FAP%2F%2FAAAAAL%2Bgv6O%2Bor6ivqK%2BvgAAAADwMNiY7Iz2hvqC%2Fv4AAAAAAAAwMHh4MzO2tre3trazswAAAAAAAM3Nbm7s7AwM7OwBAQEBAQGPj9nZ2dnZ2c%2FPgICAgICAnp6zs7Ozs7OengMDAwIDAgMCAwIDAgMCAwL7Av8A%2FwD%2FOO8o7yjvKO8o%2BwP9Af8B%2F%2BG%2Fob%2Bhv6G%2FoR8fMDB%2FYH9HfUV9RX1FfUXj4zIy2xrrCvsK%2Bwr7CvsK%2F%2F8BAf4A%2FzjvKO8o7yjvKB8fkZHf0V9R31HfUd9R31EfHzAwf2B%2FR31FfUV9RX1F4eExMdkZ6Qn5CfkJ%2BQn5CfDwEBDwEPAQ8BDwEPAQ8BAPDxgYPzA%2FIz4iPiI%2BIj4i8fEZGe0N9YX9hf2F%2FYX9hf%2F%2FAAD%2FAP8c9xT3FPcU9xSPj8jIb2ivKO8o7yjvKO8o%2FPwGBvsD%2FeG%2Fob%2Bhv6G%2FoWhIb09%2FUGB%2Ff38%2FPx8fAAADAgMCAwIDAgMCg4KDgoOD7yjvKO8o7yjvKO8o7yjv77%2Bhv6G%2Fob%2Bhv6G%2Fob%2Bhv79%2FR3hAf0B%2FR31FfUV9RX19%2Bwr7CvsK%2Bwr7CvsK%2Bwr7%2B%2F84xwD%2FAf847yjvKO8o7%2B%2FfUd%2FRn5Hf0d9R31HfUd%2FffUV9RX9HeEB%2FQH9gPzAfH%2FkJ%2BQn5CfkJ%2BQn5GfEx4eHwEPAQ%2Fx%2FwAP8A%2FwD%2FAP%2F%2FPyM8IL%2Bgv6O%2Bor6ivqK%2Bvv2FfQX9Bf2F%2FYX9hf2F%2Ff33FPcU9xT3FPcU9xT3FPf37yjvKO8o7yjvKO8o7yjv77%2Bhv6H%2F4R8B%2FwH%2FA%2F4G%2FPwAAAAAAAAAAAAABwEHAQcHAAD%2F%2F%2F8AAP%2F%2F%2F%2F%2F%2F%2F%2F8AAG5e7t7uPh7%2B%2Fv78%2FPj4AABoSGhIaEhoSGhIaEhoSGhIbl5uXm5ebl5uXm5ebl5uXgAAHx8%2FIHBQb09oSGhI%2F%2F8AAP%2F%2F%2FwAAAP%2F%2FAAAAAP%2F%2FAAD4%2BPwcLj7u3m5ebl7%2F%2FwAA%2F%2F%2F%2FAAD%2F%2F%2F%2F%2F%2F%2F%2F%2Fbl4AAP%2F%2F%2FwAA%2F%2F%2F%2F%2F%2F%2F%2F%2F2hIAAABAQYGCAgQECAgRUCAgAAAwMAwMAgIVQUCAgEBAAAAAAAAAADg4BgYBAQCAoGBoqKpqdHRzc39%2FeFh9nbcfB8SHxAPCg8PEBAiIisr6en%2FhP%2F%2F%2F27jAfPTf375z%2F%2F%2FyPiI%2BJDwEPDg4MBA4CD%2F%2Fz8gcFBvT2hIa0hrSGtLaEjnJhgY%2F%2F8AAICAgICAgAAA%2FwAAAP%2F%2FAAAHAQcBBwcAAGhIaEhoSGhIaEhrSGtIa0v%2F%2F%2F%2F%2FAP8AAP8AAAC7OEREBwcEBwgPCA8JDxsfIz4vP56ecX9Bf%2F7m%2BfHPTN9Yz0D%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FP1B0UJtQP1B0UJtQP1B0UJtQP1B0UJtQwFB0Th1P2E90Th1P2E90Th1P2E90Th1P2E8AAAAAAAAAABwcPiI%2FO39HAAAAAAAAAAA4OHxE%2FNz%2B4gAAAAAYGDwkflJ%2FWz8vfUUAAAAAGBg8JH5K%2Ftr89L6iAAABARsbJycvKD8wPyA%2FPvj47Bzk3OQc5BzEPIR8hHwAAAEBAwIHBw8OHxB%2FeI%2BIAADw8Ng4yLjIOMg4jn4L%2BwAAAwMPD3l5%2F5%2F%2Fpf%2BpVlYAAMDA8PCenv%2F5%2F6X%2FlWpqODhERIKCqamqqq2tsLBAQAB%2BAOUA%2F36Bfud%2B5xjnGOcAAAAAAAADAwwMcXGCgnx8AH5kgX7nGOcY%2F36Bfv8YfgAAeHjExIKCqal1dQMDBwcAAAAAAAB4eIycZBzk3OQcf3d%2FT%2F%2BH%2F7XvreelQ0IBAf7u%2FvL%2F4f%2Bt97XnpcJCgIB9VX9fPyl%2FS35a%2FprkpEBAvqr%2B%2BvyU%2FtJ%2BWn9ZJyUCAg8IHxAfGAcEHhkcEw8PAAD8fP4OwsIx8SHhYeGrqz4%2Bz8yPjEdHYGA%2FPzwzOCcfHwn5mfn%2BnhAQ8PBg4MDAgIABAQcHHx9%2FYP%2BA%2F%2FwfEB8f%2FPz%2BBvrG8g7yDvMP4R%2F%2F%2FwAAODhGRoGBlJSrq0BAAAAY%2Fxj%2FfoF%2B%2Fxj%2Fgf9%2Bfn5%2BAAAAAAAAAQEBAQMDBwcPCAAAHh55eY2dZR3m3uQc5BwPCB8QPyE%2FPh8QPyA%2FPAcE5BzEPMQ8hHz8fP4OwkKxcQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHBx8cHxA%2BMXhn%2BcbzjAAA8PD8HPYOOsY6xnuHe4dBQSEiEhQNDpaYXV4mOB0eBAQIiJBQYODSMnT0yDhw8CEiIiQtLpaYnZ5meB0eYmwIiIhIaOjSMnLyzDxw8IxsAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAgIODhoZKSnFxAgICAgMDcHDQ0BAQCAiIiAgICAjw8B8QPyE%2FPg8LHBQcFH5%2BkZHkHMQ8jHyoaMjIGBhwcKDgPjo8NBgYCAgMDBAQEBAfHyFhISFra%2F%2F%2F4eFZWUdHgIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPKN84z9wn9Af0A9IjE%2FHx%2FzD%2BIe8h72HsY%2Bjv48%2FPDwIixPT5eXKSlKSoeHjIxERIho5OTS0igopKTCwmJiRESPjzc3SUlKSkdHRkYiIgAA4uLY2CQkpKTExMTEiIgAAEFCNjYHCHZ%2BmZkvL0REIiIEhNjYwCDc%2FDIy6OhERIiIAAAAAHh4%2FMTjg%2FzEeHgAAMPDPT3Dw%2F%2F%2F%2F%2F%2Fv5%2F%2F%2F29s8PCBO%2F%2F%2F%2Fvf%2F%2F%2F%2F%2F%2Fvf%2F%2FAAAAAAMDDAwQECAgICBAQAAAAACAgEBAJCQaGgEBBgAAAAAAAAAAAAAAAACAgEBAAQECAgQEDwgHBAMCAQEAAICAAADBAPcA%2FwD%2FQP%2FjPj4TAJkAwQDjAP8A%2F4B%2FQT4%2BQECgIOAgwEDAQICAAAAAAAAAAAAAAQACAAMABwAPADIAeACEAAIAAgCCAMIABAAEAAAAAAABAAIABAAIABAAIABAAIAAAgAEAAgACAAAABAABAAEAAQACAAIAAgACAAIACAAOAAeAA8ABgAEAAYABwAQABAAAACAAAAAAAAAAAAACAAQAJAAkACgAKAA4ABAAAYACAAIABAAAAAhACcAHwCAAAAAAAAQAGAAwACCAAQAQABAAGAAIAAgAOAAEAAIAAEAAAAAAAAAAQACAAIABAAIAIAAkADQABAAIAAgACAABAAEAAQABAACAAIAAgACADgAxAABAAIAgwAHAA8AMgBAAIAAAQACAAQACAAQACD9%2B%2F37%2Ffv9%2B%2F37%2Ffv9%2B%2F0DAJkAmQCBAP8AmQDBAEIAfgAAAAAAAAgAHAA2AGsA3QD%2FAP8A%2FgB9ALsA%2FwD%2FAP8AAAAABAACAAIAFwCXAm0CPQAAAAAAAAAAACAAQADAAKAHeA1wGKAYYBhgCTAFGAAPAOiAcIBwwDCAYIBgAMAAAAAPAAgACAAHAAIAAQAAAAAA%2FwAAAAAAtwAAAP8AIAAxAP4AAgACAPwACADwAIAAgAAfACAAIAAgACAAfwCAAP8AAACAAIAAgACAAMAAIADg%2F%2F%2F%2F%2FwD%2F%2FwAAAP8AAAD%2FAACBAEIAJAAYAAAAAAAAAAAAQgBaAGYAwwCBAOcA5wCZAJkAmQC9AKUAmQBCAGYAWgATABUAGQARABEAEwAVABkAOABEAIIAqQCqAK0AsABAAH4AwQCBAIEA5wDnAJkAmQAcACIAQQCVAFUAtQANAAIAAACBAEIApQB%2BADwAGAAAAEIARgBCAEYAQgBGAEIAPAAAAAAAAAAAAAAAAAAAAAD%2F%2F%2F8%2F%2Fx7%2F%2FP%2F%2F%2F%2F%2F%2Fz%2F%2BH%2F%2F%2F%2F%2F%2F9%2B%2Fz%2F%2F%2F%2F%2Fz%2F%2BH%2F%2F35%2B%2F4P%2Fu%2F%2Bj%2F6P%2Fh%2F%2F%2Ffn5%2Bfv3D%2FYP7h%2F%2BOqN%2Ff%2F319dnb%2Fy%2F1j%2FTPbN5N%2Ff%2F%2Fm5n9%2FwMCfn7u7v7%2B%2Fv7e3v7%2F%2B%2FgMD%2Ff3v7%2F39f3%2F%2F%2F%2Fv7v7%2B9vb%2B%2Fr6%2B%2Fv76%2B399%2Ff%2F%2F%2F39%2F9%2Ff%2F%2F9%2Ff%2F%2F%2F%2F%2F%2Fv7%2F2%2F%2BJ%2F43%2F33pacnIwMCAgfn77x%2F2D%2FcP98%2F3LeU%2F%2BzvKO59%2FN%2F31zfmL5x%2FP%2Ffn5%2Ff%2FfH7o7dnLu49vD%2F%2F39%2F%2Fv5vD98fuzt3c%2B%2Fn%2F%2F%2F%2B%2Fn5%2B78%2Ffn7u79%2FPv5%2F%2F%2Ffn4AAAAAAAAAAAAAAAAAAAAAPiDgAPAA8AAv5g%2FLN0c%2BEOAA8ADwAPAA8ADwAPAAL%2BYPsE%2FwgKmh4IF54IA%2BMOAAyXzgln3gl36nKB3%2BgCgX8JZn8JdvERAAGfCPPeCPyBjgr%2BCVGOnglQYHEYb%2FKhITBSD68IkhN0wHXxYAGV4jVhpvExpnExrgkBMa4JFeI1Yj8IzglH7%2B%2FyjH%2Fv0gDPCM7hDglBjqExMY5v7%2BKPjgifCHRxpP8IvLdyAG8JCAiRgKePXwkEfxkJneCOCT8IhHExoTT%2FCLy28gBvCRgIkYCnj18JFH8ZCZ3gjgkuXwjWfwjm%2FwlacoBD7%2FGALwkyLwkiLwiSLwlEfwi7BH8IqwInzgjX3gjuHDckghCcJ%2BR6fILX7%2BD9BwLDYAyQpfFgANCg0NDQ0NDafI%2FgIoFBl%2B%2Fn8oIwqWAhx7DAwMDAwMDALJe%2F7%2FKCMZfv5%2FKAYKhgIdGOUrHRj2Gys%2BAgwMDAwMDAINDQ0NDQ0Y468MDAwMDAwCDALJHBr%2BDzBJHD0SHT4PEhhA9RqnIA76DML%2BAz4COAI%2BBOoOwvEYIfCz%2Fg3Kf0oRB8LwgUfwgMtPINf1%2Bg7C%2FgQgBT4C6g7C8ctHIA8a%2FgEosct4wndKy0ggP8kapyDyIQrCfqco68tAKOc2ACEDwuV%2B%2FhgoGebw9gR3%2Bg7C%2FgQoCD4C6g7C6gjCIQzCNjAh4N82AT4BEuEYuCEMwn7%2BBiAH8J%2BnIAI2APCz%2Fg0GAygG8LWnyAYBIan%2FEQDAKqcoCBwcHBwFIPXJ5SEFwkYhAcIqxv4SHA4Cy2goAg74KoESDmAc8LP%2BDSAKDnrw5P4LIAIObnkSHK8S4S0OCstoIAIOCXEh4N82Aj4M6q7APv%2FqqcDJIQzCNiDDuknwgeYDIIfwgMtHyCGuwH6nygxKNcnwn6fI%2Fv%2FI%2BtjApygGPerYwBgq%2BtzAyydfFgAh5EoZXiNW1eH62cAWAF8ZKv7%2FKBrq2sB%2B6tjAHBx76tnA8IDq28D62sDggOCBya%2Fq2sAY7VBl4GVwZgYEERAAIRDC5X7%2BgCACNv%2BnIB7VEQcAGdF%2BpygrLS1%2BLS0tpyAVNPDzT%2FCkkU9%2BkXfhGQUg0vCk4PPJNfDzT%2FCkkU9%2BkXcY6eHlNoAsLDb%2FGN%2Fw7v4DwCEtwPCkR%2FDykDL6AcLWC3f6CsKnIAvw8UfWBL4wCni%2B0DYAPgTg7sk%2BAuoHwskhAcJ%2B%2FrTY%2FsDQr%2BCZ4LU84LM86ujfPpDgpsnwmf4BwPCmpygQ5gPAr%2BoAwvoDwu4Q6gPCyT4C4Jmv6gDC%2BgPC9hDqA8LJ8Jn%2BBCgl%2FgPA8KanKAzmA8D6A8LuEOoDwsk%2BBOCZPkDgpvoDwuYP6gPCyfCmpygM5gPA%2BgDC7oDqAMLJr%2BCZ6gDC%2BgPC5g%2FqA8LJ8J%2F%2B%2F8DwgEf62sC4KCEhAMP62cBfFgAZ%2BtrAIvrYwHccHHvq2cB46trAr%2BrYwMn62MA86tjAyY1MkUyVTJlMnUyhTKVMqUyNTJFMsUy1TLlMvUylTK1MwUzFTMlMzUzRTNVM2UzdTOFM5UzpTO1M8Uz1TPVM9Uz5TP1MAU0FTQlNDU0ZTRVNEU0dTSFNJU35%2BCxN%2BfgzTfn4Ok35%2BEFN%2BfhITfn4T035%2B1ZN%2BftdTfz8YU35%2BGhN%2BfhvTfn4dk35%2BH1N%2BfiETfn4i035%2BJJN%2BfiZTfn4oE35%2BKdN%2BfuuTfn7tU35%2BLxN%2BfjDTfn4yk35%2BNFN%2BfjYTfn43035%2BOZN%2BfjtTfn49E35%2BPtN%2BfgCTvn4CU75%2BBRO%2BfcfTvn4Kk75%2BDVO%2BfhETgABEBH%2FRE4CAxIT%2F0ROBAUUFf9ETgABFhf%2FRE4ICRgZ%2F0ROCgsaG%2F9ETgABDA3%2FRE4AARwd%2F0ROYv9ETnBxcnP%2FRE5wcXRz%2F0ROY2RlZv9ETmNkZWf%2FRE4gITAx%2F0ROIiMyM%2F9ETiQlNDX%2FRE4iIzY3%2F0ROKCk4Of9ETiorOjv%2FRE4sLTw9%2F0ROLi8%2BP%2F9ETkBBQkP%2FRE5ERUZH%2F0ROdXZ3eP9ETnV2eXj%2FRE5oaWpr%2F0ROaGxqbf9ETqChsLH%2FRE6io7Kz%2F0ROTklQUf9ETkhJSkv%2FRE4MDRwd%2F0ROLi8%2BP%2F9cTiwsTzwtPUxN%2F0xODk8tTB48PU3%2FXE4mJ088LT1MTf9cTv58YX1vfnt%2F%2F1xO%2FnxhfW9%2BYX1vfnt%2F%2FwAAAAgIAAgIAAAACQARABkIAAgJCBEIGQAACAAACAgIABAIEAAYCBgAIAggACgIKA8PPBBPyRQPBBgPNhiPNhkPNhmPNhoPNhqPNh0PBB8HvB9OySMPhCRPSTEEBDEEPDSHCjeKOjqJCjxPAj6LBEEJhEdOAkxPSVEPsVMPBFcOMVgPBF6KhGAIMWMEPGoIBG0EPHEQC3IGOncGC3lOSX5PSYZKAogPMYkPMYmHPIoPMY2HhI4PPJBKSZULMZsFA6UFA68FA7kFA8NFA9cFA%2BGKO%2BMHNuQFNv8MhSUPEAQQjIQTBSUTD44WDwQZiCUaiCUdTgIeBSUgBLUhxAIoByUqDA4sDwQtg7UuBiUxDIQyBLUzAgQ0DIQ3jwQ7hjU%2BDIRADAREBiVFCw5GCCVJDwRLhLVOCA5PDIRRzklTBSVVD45WDARYDo5jCw5pgwNzgwN7BbV7z0l8iCV%2BDw5%2FD4SBTgKECAqIDQSJRzqMijaNCjaOiTaPCTaSijaUCzaUizaWizaYCjaZiTabCDachzaeBTb%2FDowLEgk4FAk5GYg4HQU7Jgo6Jwg2J4g2Jw1HKMYCKQ0ENRAONwcEORAOPw4LQYw4RIw5RoQ6TAQLThALVQk2VYk2VxALXRA7YJE7bw88cQ%2Bxcw8xeo%2B8ewqEfI9HiAy8iYo8kg4y%2F6VWpVbCXMxSU1PJU1NTIFSqVPBUU1PMUiBUIFSqVFNTTlVOVbliO2O5YrlismPdVTtjSVb%2FwlylVsJcyVeIWMlXJFnnWSRZS1rnWYhYS1q8WrxayVfCW0tcSVb%2FpValVsJcgV3vXe9dgV1XXsBe713vXVxfzl9OYE5gQmFCYQVi%2FyxSLFIsUixS%2FwAFAQEFGIgKAQIKGIj%2FBwACBxB4CwgBC1Aw%2FwcCAQcggA4CAg4ggP8FBQEFOFgPBQIPOFj%2FBgICBiCAEQgBEVBg%2FwgHAQhIMA8HAg9IiP8HAQEHGEALAgILIIj%2FAwICAyCAFgcCFkiY%2FwYCAQYgkBIGARJAiP8EAigHAyoHDygLDiwPE8D%2FBAEoBw8qCxMoDQ4q%2FwEOKgIIKAIPwAMCBwoKBwwNwA0GKA4LKP8BASgBCSgCEvAEDigHCSgLBCwOCcAPBCgRCCr%2FAQnAAgTwAhDABBAoCA8sCQ8oCgso%2FwQPKAYKLAwCKBICKhMRKP8FAygHAMANBCoPAyj%2FARIoAgrABA%2FwBg0oCAwHChMo%2FwESKAIJwAcLKAgJKgsE8A8DKP8DECgICcAKBygMACwOEcAPESgQEcAUCSgVAyr%2FBQooCAYoCgkoDQUsDwUoEQDA%2FwMOKAkKKAoOKgwOLA8OKBgHKP8Cjo%2FTjo%2BO%2FgKPjtOPjo%2F%2BAo6P046Pjv4Cj47Tj46P%2FgKOj9OOj47%2BAo%2BO04%2BOj%2F4Cjo%2FTjo%2BO%2FgKPjtOPjo%2F%2BAo6P046Pjv4Cj47Tj46P%2FgKOj9OOj47%2BAo%2BO04%2BOj%2F4Cjo%2FTjo%2BO%2FgKPjtOPjo%2F%2BAo6P046Pjv4Cj47Tj46P%2FgKOj9OOj47%2BAo%2BO04%2BOj%2F4Cjo%2FTjo%2BO%2FgKPjtOPjo%2F%2B4v1g%2FiE0xDo9YWH%2BEjE1tTg7PmBg%2FhIyNrU5PD9hYf4SMTXi%2FWD%2BEjI24v1h%2FhIzN%2BL9YP7i%2FWH%2B4v1g%2FuL9Yf7i%2FWD%2B4v1h%2FtM6YGD%2BxDg7YWH%2BxDk8YGD%2BQTTi%2FWH%2BMjE1pjo9QENgYP4yMjaXODs%2BQURhYf4yMzeXOTw%2FQkVgYP7i%2FWH%2B4v1g%2FuL9Yf61cHJyYGD%2BYYG1cXNzYWH%2B4v1g%2FuL9Yf7%2BITT%2BEjE1%2FhIyNuL9Yf4SMTXi%2FWD%2BEjI24v1h%2FhIzN3GBxHByYGD%2BcYHEcXNhYf7i%2FWD%2B4v1h%2FqY6PUBDYGD%2Blzg7PkFEYWH%2Blzk8P0JFYGD%2B4v1h%2FlGCkWPi%2FWD%2BUYKRZOL9Yf5RgpFj4v1g%2FlGAkWTi%2FWH%2B02NgYP7RZP7RY%2F7RZP7%2B%2Fv7%2B%2Fv4RNNFj%2FgIxNdNkYWH%2BAjI24v1g%2FgIzN%2BL9Yf7i%2FWD%2B4v1h%2FhGBUWPi%2FWD%2BUmRj4v1h%2FmFkkWPi%2FWD%2BkWTi%2FWH%2BMV%2BRY%2BL9YP6RZOL9Yf7TY2Bg%2FtNkYWH%2BkWP%2BkWT%2BkWP%2BkWT%2Bc%2F1j%2FhH0MfRR9HP9ZMQ6PUBD%2FrU4Oz5BRP61OTw%2FQkX%2BQmprtTo9QEM8%2FkFjpjhHPUBDPP4yY2SlRjs%2BQUT%2BMWSmOTw%2FQkU8%2FjFk%2Fv7%2B0zo9QP7EODs%2BQf4hNMQ5PD9C%2FhIxNf4SMjb%2BEjE1%2FhIyNv4SMzf%2B%2Fv7%2B%2Fv7EOj1AQ%2F61ODs%2BQUT%2BtTk8P0JF%2Fv7EcHJjY%2F4hNMRxc2Rk%2FhIxNf4SMjb%2BEjM3pv1j%2Fqb9ZP7%2BgfSh9MH04fT%2B%2Foj9Y%2F6I%2FWT%2B%2FoH0ofTB9OH0%2Fv5q%2FWP%2Bav1k%2Fnj99P5mamtqa2pp8WP%2B8WT%2BxGpramv%2BUvR%2F4v1g%2FlL0f%2BL9Yf5S9H%2Fi%2FWD%2BUvR%2F4v1h%2FlL0f%2BL9YP5S9H%2Fi%2FWH%2B4v1g%2FqGB4v1h%2FnRwcnKB4v1g%2FhE0dHFzc4Hi%2FWH%2BAjE14v1g%2FgIyNuL9Yf4CMzfi%2FWD%2Bpjo9QENhYf6XODs%2BQURgYP6XOTw%2FQkVhYf7i%2FWD%2B4v1h%2FqZjY2NjYGD%2BpmRkZGRhYf7%2B%2FmF%2F%2FiGBUvR%2F%2FiGBUvR%2F%2FiGBUvR%2F4v1h%2FuL9YP7i%2FWH%2B4v1g%2Fv61%2FWP%2BITS1%2FWT%2BEjE1iGNjamtjY2pr%2FhIyNohkZGNjZGRjY%2F4SMzeIamtkZGprZGT%2B4u1h%2FuLtYP7i7WH%2B4u1g%2FuLtYf7xjv7xj%2F7xjv7xj%2F7xjv7xj%2F7xjv7xj%2F7xjv7xj%2F7xjv7xj%2F7xjv7xj%2F7xjv7xj%2F7xjv4hjvGP%2FgATJI%2BOjo6Ojo6Ojo6OEySO%2FgAhSI6Pj4%2BPj4%2BPj4%2BPIUiP%2FgD9f%2F4p9PT09PT09PSA8X%2F%2BKfT09PT09PT0gvF%2F%2Fgt%2Ff%2FT09PSC9PT0gvF%2F%2Fgt%2Ff%2FT09PSC9PT0gvF%2F%2Fgt%2Ff%2FT09PSC9PT0gvF%2F%2Fgt%2Ff%2FT09PSC9PT0gvF%2F%2Fgt%2Ff%2FT09PSC9PT09PF%2F%2Fgt%2Ff%2FT09PT09PT0gvF%2F%2Fgt%2Ff%2FT09PSC9PT0gvF%2F%2Fgt%2Ff%2FT09PSC9PT0gvF%2F%2Fgt%2Ff%2FT09PSC9PT0gvF%2F%2Fgt%2Ff%2FT09PSC9PT0gvF%2F%2Fgt%2Ff%2FT09PSC9PT0gvF%2F%2Fgt%2Ff%2FT09PSC9PT0gvF%2F%2Fgt%2Ff%2FT09PSC9PT0gvF%2F%2Fgt%2Ff%2FT09PSC9PT0gvF%2F%2Fgt%2Ff%2FT09PSC9PT0gtN0d3%2F%2BC39%2F9PT09IL09PSB03V4f%2F4AcnJycnJycnJycnJycnZ5f%2F4FZGNqa2niZWf%2BBmNkY2praeJmaP4f%2FV3%2BH%2F1d%2FgNqa2niZWf%2BBmNqa2praeJmaP4DZGpr4mVn%2FgJjacRwcmZo%2FgJkacRxc2Vn%2FgVjZGNqa%2BJmaP4GZGNkamtp4mVn%2FgVjZGpraeJmaP4FZGNqa2niZWf%2BBWNkamtp4mZo%2FgVkamtqa%2BJlZ%2F4HY2NjY2praeJmaP4FZGRkZGniZWf%2BBWNjY2Np4mZo%2FgT9ZLVwcnJlZ%2F4GY2pramtptXFzc2Zo%2FgRjamtp4mVn%2FgNkY2niZmj%2BA2NkaeJlZ%2F4DZGprtXBycmZo%2FgRjamtptXFzc2Vn%2FgJkaeJmaP4CamviZWf%2BA2praeJmaP4FY2pramvxZf4CZGPxZv4DY2Rp8WX%2BAmRp8Wb%2BcYGxgfFl%2FnGCsYLxZv5xgbGB8WX%2BMV%2FxZv4Damtp02VnZf4CZGnTZmhm%2FgNjamviZWf%2BAmRp4mZo%2FgL0Y%2BJlZ%2F4SZGniZmj%2BAPRjaV1dXV1dXV1dXV1dXV3%2BH2RpXV1dXV1dXV1dXV1dXf4A9GNpXV1dXV1dXV1lZ11dXf4fZGldXV1dXV1dXWZoXV1d%2FgD0amldXV1dXV1dXV1dXV1d%2Fh9wcmNpXV1dXV1dXV1dXV3%2BH3FzZGldXV1dXV1dXV1dXf7iZmj%2BYfShguJlZ%2F6hgeJmaP5h9JJfguJlZ%2F6hgeJmaP5h9KGC4mVn%2FuJmaP7%2B%2Fv4Famtqa2nTamtq%2FhNqa2niZWf%2B4mZo%2Fv7%2B4mVn%2FuJmaP7iZWf%2B4mZo%2Fv7%2BEmNpkfSxY%2F4CY2SR9LFk%2FgNkammR9LFj%2FgNjY2mR9LFk%2FgNkZGn%2BH%2F1d%2Fh%2F9Xf4f%2FV3%2BA2NjabFj%2FgRkZGppcYGxZP4f%2FV3%2BH%2F1d%2FgNqa2myY2n%2BsmRp%2FrJjaf6zZGpp%2FrJqaf60amtqaf6zamtp%2FrJjaf6yZGn%2Bs2praf4Tamtp%2FgNjY2n%2BA2RkaaJqaf4Damtpo2praf4Damtp%2FgNjamv%2BAmRpo2praf4DamtppWpramtp%2Fh%2F9Xf4fXV1dXV1dXWpramtqaV1d%2Fh9dXV1dXV1damtqa2ppXV3%2BH11dXV1dXV1dXV3tamldXf4fXV1dXV1dXV1dXe1qaV1d%2Fh9dXV1dXV1dXV1d7WppXV3%2BH11dXV1dXV1dXV3tamldXf4fXV1dXV1dXV1dXe1qaV1d%2Fh9dXV1dXV1dXV1d7WppXV3%2BH11dXV1dXV1dXV3tamldXf4fXV1dXV1dXV1dXe1qaV1d%2Fh9dXV1dXV1dXV1d7WppXV3%2BH11dXV1dXV1dXV3tamldXf4fXV1dXV1dXV1dXe1qaV1d%2Fh9dXV1dXV1dXV1d7WppXV3%2BH%2F1d%2Fh%2F9Xf4f%2FV3%2BH%2F1d%2Fh%2F9Xf4DZGNp4mVn%2FgRjZGpp4mZo%2FgNkY2n%2BA2Nkaf4CZGP%2BA2Nkaf4FZGNqa2n%2BBGNkamn%2BA2Rjaf4DY2Rp%2FgNkY2nCY2n%2BBWNkY2ppwWT%2BBWRjZGprwmNp%2FgRjZGppwmRp%2FgNkY2n%2BA2Nkaf4CZGP%2BAmNkc2praf4CZGl2Y2pramtp%2FgJqaXRkamtp%2Fh%2F9Xf4f%2FV3%2BH%2F1d%2Fh%2F9Xf4f%2FV3%2BH%2F1d%2Fh%2F9Xf4f%2FV3%2BH11dXV1dXWpraV1dXV1dXf4fXV1dXV1dY2praV1dXV1d%2Fh9dXV1dXV1kamldXV1dXV3%2BH%2F1d%2Fh%2F9Xf4f%2FV3%2BH%2F1d%2Fh%2F9Xf4f%2FV3%2BH%2F1d%2Fh%2F9Xf4f%2FV3%2BAP1%2F%2FuL9f%2F7i%2FX%2F%2BAX%2Fi%2FX%2F%2BAX%2Fi%2FX%2F%2BAX%2Bhf%2BL9f%2F4Bf6F%2F4v1%2F%2FgF%2FoYLi%2FX%2F%2BAX%2Bhf%2BL9f%2F4Bf6GA4v1%2F%2FgF%2FcYCi%2FX%2Fi%2FX%2F%2BAX%2BT%2FX%2Fi%2FX%2F%2BAX%2Bi7X%2Fi%2FX%2F%2BAX9xf6Ltf%2BL9f%2F4Bf6Ltf%2BL9f%2F4Bf0F%2Fk%2F1%2F4v1%2F%2FgF%2FQX9m9PT09PSC4v1%2F%2FgV%2Ff3R3f2b09PT09ILi%2FX%2F%2BBX9%2FdXh%2FZvT09PT0guL9f%2F4AcnJ2eX9%2Ff39%2Ff39%2Ff39%2Ff%2F7%2BIVqhX%2BFs%2Fi5bSV5eXl5eXl5eXl5tbP4hXHFa4mxt%2FnlbSV5eXl5ebWz%2BcVzibG3%2BITThbf4SMTX%2BEjI2%2FhIxNYH0xHBycmz%2BEjI2gfTEcXNzbf4SMzf%2B%2Fv7E%2FW7%2BxP1u%2Fv7%2BxP1u%2FoH0xP1u%2Fv5BWmFa%2FkxbSVtJXl5eXl5eXl7%2BQVxhXP4hNJH0%2FhIxNf4SMjaR9P4SMzdhNP5SMTWR9P5SMjb%2BUjE1kfT%2BUjI2%2FlIzN%2F4RNP4CMTX%2BAjI2sVr%2BAjE1tVtJXl5e%2FgIyNrFc%2FgIzN%2F7%2BxP1s%2FjRwcnJsxP1t%2FjRxc3NtxP1s%2FsT9bf7%2BETTibmz%2BAjE1pmxsbGxsbf4CMjambW1tbW1s%2FgIzN6ZsbGxsbG3%2Bpf1t%2Fv5hX6b9bv7%2Bpv1u%2FjE0%2FiIxNab9bv4iMjam%2FW7%2BIjM3%2Fv7%2B0%2F1s%2FtP9bf7xbP4RgjFaYWzxbf4Rgj1bSV5tXl5eXl5eXl5s%2FhGCMlz0YWzxbf4RgkH0YW2hgfFs%2FhGCQfRhbKGB8W3%2BEYJB9GFtoYHxbP4RgEH0YWyhgfFt%2FhGCQfRhbbVbSV5ebP4RgkH0YWzxbf4RgmFt8Wz%2B8W3%2Bl1tYXl5eXmz%2BETTxbf4CMTXT%2FWz%2BAjI20%2F1t%2FgIzN%2F7%2B4v1s%2FhE04v1t%2FgIxNcRwcmxu%2FgIyNsRxc21s%2FgIxNZFf4mxt%2FgIyNuJtbv4CMzdybFr%2BeW1bSV5eXl5eXv5ybFz%2BcW3%2B%2Fv5xbP5xbf5xbP4hWnFtoVr%2BLltYXl5eXl5eV1heW0le%2FiFcoVz%2B0Wz%2B0W3%2BpP1s%2FiH0QfRh9IH0pP1t%2Fv7%2BDGxubm5ubm5ubm5sbv4BbaFt%2FgFsYWz%2BAW1hbf4BbGj9bv4Bbf4IbG5ubm5ubm7%2BAW1xbP4BbHFt%2FgFtMWy0%2FWz%2BAWw8bW5ubm5ubm5tbW1t%2FgFt4Wz%2BAWzhbf4IbW5ubm5ubm7hbP7hbf7hbv4DbFVW4mxu%2FgNtVVphWuJtbv4AbFVbSV5eV1heXl5eXl5sbv4DbVVcYVzibWz%2BA2xVVuJsbf4DbVVWUVDibW7%2BAGxVVkxOUVlZWVlZWVlTbG7%2BBm1VVk1PUtNUbWz%2BA2xVVuJsbf4DbVVW4m1u%2FgNsVVZRUOJsbv4AbVVWTE5RWVlZWVlZWVNtbP4GbFVWTU9S01Rsbf4DbVVW4m1u%2FgNsVVambG5sbmxu%2FgNtVVambWxtbG1s%2FgBsVV1dXV1dXV1dbG1sbWxt%2FgBtVV1dXV1dXV1dbW5tbm1u%2FgBsVV1dXV1dXV1dbGxsbGxs%2FgNtVVam%2FW3%2BA2xVVtNubG7%2BCG1VVjo9QENQ4m1s%2FgBsVTg7PkFEUVlZWVlZU2xt%2FghtVTk8P0JFUqGB01Rtbv4DbFVWoYHi%2FWz%2BA21VVqGB4v1t%2FgNsVVbibG7%2BA21VVuJtbP4DbFVWcVDibG3%2BA21VVltMTlFZWVlZWVNtbv4DbFVWU01PUtNUbGz%2BA21VVtNsbW3%2BA2xVVsJsbf4DbVVWsmxt%2FgNsVVaibG3%2BA21VVpJsbf4DbFVWkW3%2BA21VVv4DbFVW%2FgNtVVb%2BH%2F1d%2Fh%2F9Xf4CbG7T%2FWz%2BAm1s0%2F1t%2FgJsbVFQ025sbP4CbWw9TE5RWVlZWVlZWVNtbf4CbG0zTU9S01RsbP4BbeL9bf4BbuL9bv4f%2FV3%2BH%2F1d%2Fh%2F9Xf4BbNP9bP4BbUFQ0%2F1t%2FgFsJkxOUVlTbNP9bP4BbSNNT1JlVG1ubm7T%2FW3%2BAWzT%2FWz%2BBm1sbmxubJfhbm5ubW1t%2FgBsbWxtbG3s7OzsbGxsbGxs%2FgZtbm1ubW6m%2FW3%2BpmNjY2NgYP6mZGRkZGFh%2FuLtYP7i7WH%2B4u1g%2FiE04u1h%2FhIxNeLtYP4SMjbi7WH%2BEjE14u1g%2FhIyNrU6PUDtYf4SMzemODs%2BQe1g%2FqY5PD9C7WH%2B4u1g%2FqY6PUBD7WH%2Blzg7PkFE7WD%2Blzk8P0JF7WH%2B4u1g%2FuLtYf7i7WD%2B4u1h%2FuLtYP7i7WH%2BQ%2F30gv1j02NgYP5D%2FfSC%2FWTTZGFh%2FkP99IJqa%2BL9YP7i%2FWH%2B02NgYP4hNNNkYWH%2BEjE14u1g%2FhIyNuLtYf4SMzfTY2Bg%2FtNkYWH%2B4u1g%2FuLtYf7TY2Bg%2FtNkYWH%2B4u1g%2FuLtYf7TY2Bg%2FtNkYWH%2B4u1g%2FuLtYf6BY%2BLtYP6BZOLtYf5y%2FWPi7WD%2Bcv1k4u1h%2FuLtYP4hNOLtYf4SMTXi7WD%2BEjI24u1h%2FhIzN%2BLtYP7i7WH%2B4u1g%2FuLtYf7i7WD%2B4u1h%2FuLtYP7i7WH%2B4u1g%2FuLtYf7%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FKUNZQ11DkUPFQ%2FVD%2BUAtRGFElUTJRPlE%2BUT9RT1FcUXVRkVGnUbdRxFHXUepRBlIZUitSAEEBBwAYEFsRChAHAEsBCgAtEBQAdhABERAQJBELEAAAKwEPACwQHxELECcRAQEJACAQXREUEBkAJxAKEQYQKgBREA4RBhACAGMBDxEHEAb%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FACgQChELECURERAREQgQBAAcEAQRBAEDAB8QAhENEAcALxABEQ0QBAAdAQwAWRADEQ8AHyAKACIQABEWED0RGhAAABsQLxEPAQEAKRAEEQ0QCgBAAQwhASAIACkgFwBHEBcRGBAaABIQBxEMEAEAFRAJEQsQIAAdAQEAAAAAAAD%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FACYQAxENEAkACBAMEQ0QCgAYEAQRCxAEACIQAREREAIAPRAIEQwQDQBwAQURBxAEACAQDREcEBoAJQEQEQUQBgAsEAMRERAOACYQEBEXEAMAFAENABsQCgAqEQ0QAwAOIAYAGhADEQkQCAAXEAgBBREEABQgBgCYAQkRBhACAC3%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FrmjjaDZpc2kMab1pnmnpaXpobWhhacNo72hCaYBpFmnLae9oD2rvaO9ogGlQapxqaWqQaqhqqGp1aqhqlHCfcKpwtXDAcMtw1nDhcMF5zHnXeeJ57Xn4eQN6DnpPfhl6JHr1xdXlPgPg%2F%2Fvw3%2F4BKED%2BAiha8N6nIFoO0%2FKnKAev4j4I6uDfzVlrzXlrzfRnzZ1rzbhtze9rr%2Brg3%2Bro3%2Brw3%2Br43%2BDfPgfg%2F%2BHRwfHZzUtrr%2Brh3%2Brx3%2Br53z4w4N4h7GfN32oYzyHwZxj2r%2BDeGLMh3v81fv4oKO3%2BICjh%2Fhgo5f4QILA0GK2y44PHsuPBx%2Frw3%2F4BKA368d%2F%2BASgryYA6ILDG6vHfIT%2Ffy%2F6v6vTf4BohR3DNGWvwBOYfRz7QgOr13yEDaMPmavAE5gdHIfTfNH4h9d%2F%2BDjAKNDR%2B5viwDh3iyf4eKAU1NTUY76%2Fq8d%2FgGiE%2F38u%2BATbfCm8MCmfNGWvJALBTgMc%2BAyFoaMO5ajyAoFCEzZtoyD4OIXVow7lqAIDSCoY9gKMJh%2Frh3xgM%2BuHf%2FgPI%2BuHf%2FgXI%2FgTI%2FgbI%2FgjI%2FgvIyc2VaMg%2BECGGaM25aiHk3zYKLDaGyc0Ma6fK9Ggh5N9eLFblIQ8AGQ4TfeJHDHzmP%2BLhMnDJzZVoyD4DIYtow7lqzQxrp8Cv6uHf4BDgEiEf38u%2ByQCA4gaHAIDig4fNkGjIIQJpw7lqIeTfNH7%2BBCgG%2FhjK9GjJIQdpzdhqyVeWjDDHV5aMNcfNm2jIPgghLGnDuWrNDGunwCHk3340%2FgAoBv4ByvRoySExacPYalQAmiCHPmDq5t8%2BBSFcacO5aieAihCGPhDq5t8%2BBSFuacO5as0Ma6fAIebfPhCGd%2F7gyvRoDhPiDD6G4sksgNNAhM2baMg%2BCCGZacO5ajqA4yCG87Ojk4NzY1NDMyMjEwD64d%2F%2BCMg%2BBiGqacO5as0Ma6fAIeTfTjQGACGvaQl%2Bp8r0aA4S4gwMPofiyT4GIfFpw7lqADDwp8cAMPCxxwAw8LrHADDwxMcAMPDUxwAw8MvHzQxrp8D65N886uTf%2FgEoE%2F4CKBT%2BAygV%2FgQoFv4FKBfD9Ggh9mkYEiH7aRgNIQBqGAghBWoYAyEKasPYagD0V4A%2BMCFMasO5avr53%2F4ByMkALB6AHy0vPT8AzVhqyD4GIV9qw7lqzQxrp8Ah%2FN9ONAYAIWNqCX6nKCTgIskAbVSAPhYhjGrDuWoA8lWAzVhqyD4VIZhqw7lqzQxrp8Cv6vnf4CEhT9%2FLvsn1HfDREhzxHBIdrxIcHBIcEnv%2B5SgJ%2FvUoE%2F79KBbJxQ4QBgUYE8UOFgYEGAzFDhoGBRgFxQ4gBgQq4gwFIPrByRzg0Rw9yydPBgAJTiNGaWB8ydVrYjQqviADLa930cnFDjAq4gx5%2FkAg%2BMHJr%2Brh3%2Brp3%2Brx3%2Br53%2Bof3%2Bov3%2Bo%2F3%2BpP3%2BDf4N4%2B%2F%2BAlPgPg2D4B4BLgF%2BAhr%2BAQ4BrJEeDfGqcoDCEf38v%2BIQBnzfpq6RwapygHIRZnzf1q6ckR%2BN8apygMIU%2Ffy%2F4hLGfN%2BmrpHBqnKAchNGfN%2FWrpyc0ma8kh6N8qp8h3%2Fv8o8UchPGd45h%2FN%2FWrNiGzNuWvJ%2Bunfp8ghK2w9KAYjIyMjGPcq4Ngq4NYq4Nkq4Nqv4NXg18n6%2Bd%2F%2BAcB%2By08%2B9ygCPn%2FNH2zJ%2BunfpyguIdX%2Fzdxr%2BrP%2F%2FgUoIfDY%2FgEoH%2F4DKBc0Kr7ALTYALCw08NnLRsofbPDaDiXiyT7%2FGPjw2Rj0AiRlVgEAvQACIH%2B3AQDtAAIYf%2FcCQH%2F3AkB%2F9wMYf%2FcDEFqlAQBlAAMAAAACCH%2B1AQDtAAEA7QADAAAAAQDtAAIYfucBGO3nAQDeACpPfkcKEhwDChLJKhIcKhLJzUtrr%2BrV%2F%2BrX%2FxEA3wYAKhIczYJsERDfzYJsESDfzYJsETDfzYJsEUDfzYJsIRDfERTfzXdsISDfESTfzXdsITDfETTfzXdsIUDfEUTfzXdsARAEIRLfNgF5hW8FIPiv6h7f6i7f6j7fyeWv4BprYs0Za%2BEYKs0ubc1DbV%2FNLm3NQ21XzS5tzUNtTywscyxyLHEtLS0t5SHQ%2F37h%2FgMoys0ubcPRbdUqXzpXE3siejLRydUqXzpXExMY8SpPOkcKR8nhGCvw0P4DIBD6ON%2FLfygJfv4GIAQ%2BQOAc5X3GCW9%2BpyDefcYEb8t%2BINbhzdhuLS3Dqm4tLS0tzTptfcYEX1TNd2z%2BACgf%2Fv8oBCzDz20t5c06bc1DbV%2FNLm3NQ21X4XsiejIY1SHp3zYAzUtrySHp336nyD4B4NAhEN8sKqfKeG01wk1tLCzNQ23%2BAMp9bf6dyv5s5vD%2BoCAaeOYPTwYA5REB3xpvExpnCX7hLSLNLm3NQ214TwYAzS5t8ND%2BBMoubuV9xgVvXVQsLHn%2BASgPNgAhcG8JKhIcfhLhw0VuNgHhGBflEUbfIQJwCSoSHHv%2BSyD4DiAhRN8YLeXw0P4BKCH%2BAigZDhr6P9%2FLfyAFr%2BI%2BgOIMLCwsLCpfFgAYFQ4WGAUOED4ADCwsLDqnIE8qXywqV%2BUsLCqnKAIeASwsNgAsfuHLfyATeuIMe%2BIMKuIMfvaA4n32BW%2FLhuEtOjItEdD%2FGv4EKAk8EhEQABnDxW0hHt80IS7fNCE%2B3zTJBgDl4SwYrHjLP28mABleyeV9xgZvfuYPKBbg0fDQDhP%2BASgODhj%2BAigIDh3%2BAygC4cksKl9%2BV9V9xgRvRvDR%2FgEYCf4DGAAh%2F%2F8YHBE5b83PbstAIALLM3vmD8tfKAYm%2F%2FbwGAImAG%2FRGX3iDHziGL8AAAAAAAAQAA8AABEAD%2FABEhD%2F7wESEP%2FvARIQ%2F%2B8BEhD%2F7wESEP%2FvARIQ%2F%2B8BEhD%2F7wESEP%2FvAA8sAJwABgFrAckBIwJ3AsYCEgNWA5sD2gMWBE4EgwS1BOUEEQU7BWMFiQWsBc4F7QUKBicGQgZbBnIGiQaeBrIGxAbWBucG9wYGBxQHIQctBzkHRAdPB1kHYgdrB3MHeweDB4oHkAeXB50HogenB6wHsQe2B7oHvgfBB8QHyAfLB84H0QfUB9YH2QfbB90H3wcAAAAAAMChADoAwLEAKQHAgQApBMABI0VniavN7%2F7cuph2VDIQARIjNEVWZ3iJmqu8zd3u%2FwEjVniZmHZnmt%2F%2ByYVCEQABI0VniavMzQAMsLsA%2B7u7AAMGDBgwCRIkBAgCBAgQIEAMGDAFCgEABQoUKFAPHjwDBgwYMGASJEgIEAAHDhw4cBUqVAQIECBAgBgwYABXcOVz6XPrcwAAAHdwo3Onc6lzAAAAYnDpcvVyAXMVcwB3cIJyiHIAAI5yAFdwI3QvdDt0R3QAYnC8dch11HXsdQBicNJ33Hfmd%2FJ3AHdw7HD4cARxEHEYcUBxQHFdcf%2F%2F7nAgcZBxkHGtcf%2F%2F%2BnAwceJx4nETcv%2F%2FBnFlcnRy%2F%2F8ScZ1mAIClAQEAnXYAgaRCPjqpNjY2NjY2AJ03cKCkUk5MqUhISEhISACkAak6AaM%2BokynAak0TAFIo0Q%2BqUQBpD6pAaUBAKQBqT4BPgEBPgEBAQEBOqM2NKkwATQBAUKkAaUBpAGpPgE%2BAQE%2BAQEBAQE6ozY0pQEBAKQBqUwBo06iUqcBqURSAU6jTEipTAGkRKkBpQEApAGpTgFOAQFOAQEBAQFMo0hEqUIBRAEBSKQBpQGkAalOAU4BAU4BAQEBAUyjSESkQj46NgCjRKlEATqjRKlEATqjRKlEATqjRKlEATqjNqk2AUSjNqk2AUSjNqk2AUSjNqk2AUQAo0ipSAE%2Bo0ipSAE%2Bo0ipSAE%2Bo0ipSAE%2BozqpOgFIozqpOgFIozqpOgFIozqpOgFIo0ipSAE%2Bo0ipSAE%2Bo0ipSAE%2Bo0ipSAE%2Bo1JSTk5MTEhIAKMGBgYGCwupCwsLCwsLAKkGAQEQAQYBBgEQAQYAlHL%2F%2F4JytXL%2F%2F4hy0XL%2F%2F45ynXMAgKkBohoBIhAUGBoBKCIBARoBIhAUGBoBowGpAQEAnZMAgKIaASIQFBgaASgiAQEaASIQFBgaAaQBAKIGAQEGAQYGAQYGAQEGAQEGAQYGAaQBACBzJ3Mnc1pz%2F%2F%2FrchtzJ3Mnc1pz%2F%2F%2F3cm5zc3Nzc3Nzc3OFc4Vzc3P%2F%2FwNzjnP%2F%2FxVznYAAgQCdMACApwEApECjPqk4PjirAag2oygqoiouoyoupSikQKM%2BqTg%2BOKsBqDajKCqiKi6jMqEuMi4qpSgApSqkATKlPKQ4oziiPDilNgEBAQCdN3CgAKNAQkBCQEJATkBCQEJAQkA8AEJQQlBCUEJQAKMGogYGowaiBgajBqIGBqMLogYGAL5zAACrc9RznaEAgKABoVhUUk5KpgGiQAEyAZ0wAIChWFRSTkqmAZ2hAICiTgFSAQCdN3AgoVhUUk5KpgGiYAFiAe1zAAD%2FcxF0nWAAgKhSolIBUgFSAahWWFoAnYMAgKhKokoBSgFKAahOUFIAnRdwIahwonABcAFwAah0dngAX3SRdJF0GHX%2F%2FyV0T3S5dLl0SHX%2F%2FzF0b3TvdO90eHX%2F%2Fz10hXSjdf%2F%2FSXSdogCAokBEAUgBRAFApTwAnYIAgKJKSgFKAUoBSqVEAJ03cKCiUlQBWAFUAVJANgEwKAEBAQCiBgYBBgEGAQalBgCiOgEBp0CjOqQBMqo2RERESEqlAaI6OgGnQKM6pQGqSAEBNjo8pToAokoBAadSo0qiRE4BVKREqkhUVFRYXKJYUgFKpECiSkoBp1KjSqJETgFUpESqSAEBSEpOpUoApzI6o0CnPESjSqdASKM2pzI6o0CnMjqjQKc8RKNKp0BIozanMjqjQACqREREREA8p0AyowGiNgEBNjY6ATylQKpEAURESEqnSECjAadEQKM8ogE8AQGkQACqVFRUVFJOp1JKowGiSAEBSEhKAU6lUqpUAVRUWFynWFKjAadUUqNOogFEAQGkSACnPESjSqcyOqNAp0BIozanMjqjQKc8RKNKpzpAo0inPESjSqIBQAEBpEAAowapBgEGowupBgEGowapBgEGowupBgEGAAh2KHYodvd2%2F%2F%2B%2BdfR1d3Z3djV3%2F%2F%2FKdRx2tXa1drV21na1drV2tXbWdnN3%2F%2F%2FWdSR2vXf%2F%2F%2B51nYQAAKJwcHABagFqAWYBZgGkagCddAAAomZmZgFgAWABXAFcAaRgAJ03cCClAQEApQEBAJ2CAACoRKNIpE5IpESjSESkQKM6NqhEo0ikTqNIRKJYXKNYolJYo1KiTlKjTqJIRKNAqESjSKROSKREo0hEpECjOjaoOqM%2BOjYwLKUwAQCdcACBqE6jUqRYUqROo1JOpEijRECoTqNSpFijUk6lUgGoTqNSpFhSpE6jUk6kSKNEQKhEo0hEQDo2pToBAKMookA2oyhAoyiiQDajKECjGqIyKKMaMqMaojIooxoyAKMeojYsox42ox6iNiyjHjajIqI6MKMiOqMiojowoyI6AKhco2CkZqNmompmpGCjZmCjXKJgXKNYolJOpWaoZqNgpWYBqFKjWKRcWKhSo06kSKNEQKhEo0ikTlKlWAEAqESjSKROo06iUk6kSKNOSKNEokhEo0CiOjalTqhOo0ilTgGoUqNYpFxYqFKjTqRIo0RAqESjSKROUqVYAQCjHqI2LKMeNqMeojYsox42oxqiMiijGjKjGqIyKKMaMqMwokgmozBIozCiSCajMEijHqI2LKMeNqMeojYsox42pSIiGhoeHiIiAKMGogYGowuiBgajBqIGBqMLogYGAA14Q3hLef%2F%2F1Hf6d4d4F3n%2F%2F953GnjzePN4eHn%2F%2F%2Bh3K3ioef%2F%2F9HedkgCAolIBUAFOSgEBAadApCgAnWIAgKUBogGnKKQQAJ03cCCicAFuAWxqAQGkAUAApgahBqMLpgahBqMLogEGAQGmC6EGowYAowE6AToBOgE6AToBOgE6AToBSgFKAUoBSqUBowFupG6jAToBOgE6AToBOgE6AToBOgFKAUoBSgFKpQGmAaFuowGkVgCjUgGmTqFKpgGhUqgBpkqhTqJSAVIBo05KUlRYXAFKSkRApgGhSqQBozxAREijAXCkcKNSAaZOoUqmAaFSqAGmSqFOolIBUgGjTkpcWGKmUqFOowFKSk5SpgGhSqQBo1RSSk6mAaFwowGkWACjMqZYoSijMlgyWjJaMlwyXDJeRF48XDxcOlg6WE5SVFalAQCjAVxgYqNgpgGhWKQBo1QBplihVKMBolIBVAFWAVgBowFcYGKjYKYBoVikAaNoZgFipQEAowFKTkROpkChSKMBQEQ8pkihRKM2pQGjAUpORE6mQKFIowFAMjIBMgEBAQEAozxKPEo6SjpKNlw2XKJKAU4BUAFSAaM8SjxKOko6SkJQQlChWAFYAaJUAVIBTgEAowamBqEGowumBqEGowamBqEGowumBqEGAABucMF9x30AAM19AHdwYn1mfWh9AAAAYnAQfRZ9HH0ifQBicBd8LXxBfEV8AFdwsnsAALZ7AAAAYnDoe%2Bx7AAAAAACCcEF7S3sAAAAAAIJw%2F3oDewV7AAAAd3DHes16AAAAAAB3cC96N3o%2Fekd6TXqSev%2F%2FMXpeeqd6%2F%2F85em96tXr%2F%2F0F6gHr%2F%2F0d6nZAAAKUBHiCkIiSjJigqLACdoAAApQEQEqQUFqMYGhweAJ03cCClASgqpCwuozAyNDYAoQYGBgYLBgYGBgYGBgsGBgYAnWAAwaQeKig0pTIBpB4qKDSlNgEAnYMAAKIQDgwKCAYEAgChKEAmPiQ8IjogOB42HDQaMgDTev%2F%2Fx3rpev%2F%2FzXqdhACAokBCQEJAQkBCQEZMUlhSTEYAnXQAgKIQEhASEBIQEiIoLjQ6NC4oAAd7AAAhezR7nWAAgaM8SlRKQEo8OiqdMACBoTo8OjakOgCdgACBo0RKXKRYo1KkSqNOpUoAnTdwIahUUqRCozylMlN7cXtTe3p7AACCe6F7gnuqe51mAIGjWGBmYFZgZmBUYGZgUlhiWFBYYlhOWGBYAExSWFxYSlZOAFJYXFakYEAAnWYAgaR4o3RwqHiicHSjeHh0cHh6foIBcHBopGZ4AKNqcHR4pHRmAKN6am5mpXAAuHsAAMp7nVAAgKFAAUABQAGjQqJGpEoAnRdwoKJ4eHijeqJ%2BoYJwgnCCcIJwgnCCcIJwgnAA7nsAAAN8nXMAgKMeoQGjHqEBox6hAaMeoQEAndMAwKMcoQGjHKEBoxyhAaMcoQFLfFJ8bHxSfG98S3xSfGx8UnxvfAAAdnx9fJV8fXyefHZ8fXyVfH18nnylfKV863z%2F%2F0V8nZMAgKMBAKIBSgFKAUoBSgFKAUoBSgFKAUABQAFAAUAApQEAAUoBSkoBAJ3DAMCjOACkQqJGTEpGo1BQolBUSkyjRkaiRkxKRgBCWlhUUExKRgBCUEZKQgEAnRdwIKMBokJQOFBCUDhQQlA4UEJQOFA4XkZeOF5GXkJaWFRQTEpGQlA4UEJQOFBCUDhQQlA4UDheRl44XkZeQlA4UEIBAKMBogYLBgsGCwsLBgsGCwahCwuiBgsGCwYLBgsLCwsGCwYLAQA0ff%2F%2FEH0off%2F%2FFn1Aff%2F%2FHH1Vff%2F%2FIn2dVACAolBOTEpIRgCdNACAojo4NjQyMACdF3AgqESnREqoUFCoRKdESqhQUACiBgYGpwuiBgYGpwsAfX0AAGp9kn2d0QCApzI2OjxAREhKTlJUWFwAnUEAgKoBpzI2OjxAREhKTlJUWFwAnTdwIKJKAVJOAVRSAVhUAVxYAWBcAWJgAWZiAWpmAWxqAXBsAXRwAXh0AXp4AX7Tff%2F%2FwX35ff%2F%2Fx30%2Ffv%2F%2FzX2dkQCAokBOQE5ATkBORFJETkRSRE5KWEpYSlhKWE5OSkpISEREAJ2RAIChYGZwYGZwYGZwYGZwYGZwAVxkcFxkcFxkcFxkcFxkcAFianBianBianBianBianABblxuXGpwalhmVmZWYmpiUgCiBqEGBqIGoQYGogahBgYAAHdwWn5ofnZ%2BkH6efqp%2BzH7Mfvl%2B%2F%2F9efqV%2Bqn7Mfsx%2B%2BX7%2F%2F2x%2BJH8pfyl%2FO387f0x%2FTH9uf4h%2Fbn%2BRf%2F%2F%2FgH6yf7J%2Fsn%2Byf9t%2F%2F%2F%2BYfp0wAIGqAQCdkACBAKNMOkRMUD5IUFJASlJWRE5WWkhSWlxKUlxaSFJaXEpSXACiWgEBUgEBSAEBVgFcAVpWpVIBogGiWgEBUgEBSAGkUqIBUFKkVqIBpExQAQCoUqJQUqRWSKhaolZao1xMUlCoUqJQUqRWSKhaolZao2BKUlikXGKlWlYAnTdwoACiRERcXEREXFxERFxcRERcXAA6OlJSOjpSUjo6UlI6OlJSAKNSUlJSUFBQUE5OTk5MTExMREREREJCQkI%2BPj4%2BSEhISACiLCxERCwsREQsLERELCxERCoqQkIqKkJCACYmPj4wMEhIACgoQEAoKEBAKChAQCgoQEAwMDpCMDA6QjAwOD4wMDg%2BAKEGBqILoQYGoguhBgaiC6EGBqILoQYGoguhBgaiC6EGBqILoQYGogsAogYGEAYGBhAGBgYQBgYGEAYA%2F%2F%2F%2Fw2JnwyZr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2Fw%3D%3D";

},{}],"5AFiq":[function(require,module,exports) {
exports.interopDefault = function(a) {
    return a && a.__esModule ? a : {
        default: a
    };
};
exports.defineInteropFlag = function(a) {
    Object.defineProperty(a, '__esModule', {
        value: true
    });
};
exports.exportAll = function(source, dest) {
    Object.keys(source).forEach(function(key) {
        if (key === 'default' || key === '__esModule' || dest.hasOwnProperty(key)) return;
        Object.defineProperty(dest, key, {
            enumerable: true,
            get: function() {
                return source[key];
            }
        });
    });
    return dest;
};
exports.export = function(dest, destName, get) {
    Object.defineProperty(dest, destName, {
        enumerable: true,
        get: get
    });
};

},{}]},["8YQT9"], "8YQT9", "parcelRequire18a3")

//# sourceMappingURL=gameboy.feca7d50.js.map
