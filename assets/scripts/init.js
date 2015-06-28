 
 ; /**
 * @license
 * lodash 3.2.0 (Custom Build) <https://lodash.com/>
 * Build: `lodash exports="amd,commonjs,global,none" include="each, find, isFunction, isNumber, isObject, isString, isUndefined, last, map, merge" --output docs/assets/scripts/plugins/lodash.custom.js`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.7.0 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */
;(function() {

  /** Used as a safe reference for `undefined` in pre-ES5 environments. */
  var undefined;

  /** Used as the semantic version number. */
  var VERSION = '3.2.0';

  /** `Object#toString` result references. */
  var argsTag = '[object Arguments]',
      arrayTag = '[object Array]',
      boolTag = '[object Boolean]',
      dateTag = '[object Date]',
      errorTag = '[object Error]',
      funcTag = '[object Function]',
      mapTag = '[object Map]',
      numberTag = '[object Number]',
      objectTag = '[object Object]',
      regexpTag = '[object RegExp]',
      setTag = '[object Set]',
      stringTag = '[object String]',
      weakMapTag = '[object WeakMap]';

  var arrayBufferTag = '[object ArrayBuffer]',
      float32Tag = '[object Float32Array]',
      float64Tag = '[object Float64Array]',
      int8Tag = '[object Int8Array]',
      int16Tag = '[object Int16Array]',
      int32Tag = '[object Int32Array]',
      uint8Tag = '[object Uint8Array]',
      uint8ClampedTag = '[object Uint8ClampedArray]',
      uint16Tag = '[object Uint16Array]',
      uint32Tag = '[object Uint32Array]';

  /** Used to match `RegExp` flags from their coerced string values. */
  var reFlags = /\w*$/;

  /** Used to detect named functions. */
  var reFuncName = /^\s*function[ \n\r\t]+\w/;

  /** Used to detect host constructors (Safari > 5). */
  var reHostCtor = /^\[object .+?Constructor\]$/;

  /**
   * Used to match `RegExp` special characters.
   * See this [article on `RegExp` characters](http://www.regular-expressions.info/characters.html#special)
   * for more details.
   */
  var reRegExpChars = /[.*+?^${}()|[\]\/\\]/g,
      reHasRegExpChars = RegExp(reRegExpChars.source);

  /** Used to detect functions containing a `this` reference. */
  var reThis = /\bthis\b/;

  /** Used to fix the JScript `[[DontEnum]]` bug. */
  var shadowProps = [
    'constructor', 'hasOwnProperty', 'isPrototypeOf', 'propertyIsEnumerable',
    'toLocaleString', 'toString', 'valueOf'
  ];

  /** Used to identify `toStringTag` values of typed arrays. */
  var typedArrayTags = {};
  typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
  typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
  typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
  typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
  typedArrayTags[uint32Tag] = true;
  typedArrayTags[argsTag] = typedArrayTags[arrayTag] =
  typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] =
  typedArrayTags[dateTag] = typedArrayTags[errorTag] =
  typedArrayTags[funcTag] = typedArrayTags[mapTag] =
  typedArrayTags[numberTag] = typedArrayTags[objectTag] =
  typedArrayTags[regexpTag] = typedArrayTags[setTag] =
  typedArrayTags[stringTag] = typedArrayTags[weakMapTag] = false;

  /** Used to identify `toStringTag` values supported by `_.clone`. */
  var cloneableTags = {};
  cloneableTags[argsTag] = cloneableTags[arrayTag] =
  cloneableTags[arrayBufferTag] = cloneableTags[boolTag] =
  cloneableTags[dateTag] = cloneableTags[float32Tag] =
  cloneableTags[float64Tag] = cloneableTags[int8Tag] =
  cloneableTags[int16Tag] = cloneableTags[int32Tag] =
  cloneableTags[numberTag] = cloneableTags[objectTag] =
  cloneableTags[regexpTag] = cloneableTags[stringTag] =
  cloneableTags[uint8Tag] = cloneableTags[uint8ClampedTag] =
  cloneableTags[uint16Tag] = cloneableTags[uint32Tag] = true;
  cloneableTags[errorTag] = cloneableTags[funcTag] =
  cloneableTags[mapTag] = cloneableTags[setTag] =
  cloneableTags[weakMapTag] = false;

  /** Used to determine if values are of the language type `Object`. */
  var objectTypes = {
    'function': true,
    'object': true
  };

  /**
   * Used as a reference to the global object.
   *
   * The `this` value is used if it is the global object to avoid Greasemonkey's
   * restricted `window` object, otherwise the `window` object is used.
   */
  var root = (objectTypes[typeof window] && window !== (this && this.window)) ? window : this;

  /** Detect free variable `exports`. */
  var freeExports = objectTypes[typeof exports] && exports && !exports.nodeType && exports;

  /** Detect free variable `module`. */
  var freeModule = objectTypes[typeof module] && module && !module.nodeType && module;

  /** Detect free variable `global` from Node.js or Browserified code and use it as `root`. */
  var freeGlobal = freeExports && freeModule && typeof global == 'object' && global;
  if (freeGlobal && (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal || freeGlobal.self === freeGlobal)) {
    root = freeGlobal;
  }

  /*--------------------------------------------------------------------------*/

  /**
   * Converts `value` to a string if it is not one. An empty string is returned
   * for `null` or `undefined` values.
   *
   * @private
   * @param {*} value The value to process.
   * @returns {string} Returns the string.
   */
  function baseToString(value) {
    if (typeof value == 'string') {
      return value;
    }
    return value == null ? '' : (value + '');
  }

  /**
   * Checks if `value` is a host object in IE < 9.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a host object, else `false`.
   */
  var isHostObject = (function() {
    try {
      Object({ 'toString': 0 } + '');
    } catch(e) {
      return function() { return false; };
    }
    return function(value) {
      // IE < 9 presents many host objects as `Object` objects that can coerce
      // to strings despite having improperly defined `toString` methods.
      return typeof value.toString != 'function' && typeof (value + '') == 'string';
    };
  }());

  /**
   * Checks if `value` is object-like.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
   */
  function isObjectLike(value) {
    return (value && typeof value == 'object') || false;
  }

  /*--------------------------------------------------------------------------*/

  /** Used for native method references. */
  var arrayProto = Array.prototype,
      errorProto = Error.prototype,
      objectProto = Object.prototype,
      stringProto = String.prototype;

  /** Used to resolve the decompiled source of functions. */
  var fnToString = Function.prototype.toString;

  /** Used to check objects for own properties. */
  var hasOwnProperty = objectProto.hasOwnProperty;

  /**
   * Used to resolve the `toStringTag` of values.
   * See the [ES spec](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-object.prototype.tostring)
   * for more details.
   */
  var objToString = objectProto.toString;

  /** Used to detect if a method is native. */
  var reNative = RegExp('^' +
    escapeRegExp(objToString)
    .replace(/toString|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
  );

  /** Native method references. */
  var ArrayBuffer = isNative(ArrayBuffer = root.ArrayBuffer) && ArrayBuffer,
      bufferSlice = isNative(bufferSlice = ArrayBuffer && new ArrayBuffer(0).slice) && bufferSlice,
      floor = Math.floor,
      getPrototypeOf = isNative(getPrototypeOf = Object.getPrototypeOf) && getPrototypeOf,
      propertyIsEnumerable = objectProto.propertyIsEnumerable,
      splice = arrayProto.splice,
      Uint8Array = isNative(Uint8Array = root.Uint8Array) && Uint8Array,
      WeakMap = isNative(WeakMap = root.WeakMap) && WeakMap;

  /** Used to clone array buffers. */
  var Float64Array = (function() {
    // Safari 5 errors when using an array buffer to initialize a typed array
    // where the array buffer's `byteLength` is not a multiple of the typed
    // array's `BYTES_PER_ELEMENT`.
    try {
      var func = isNative(func = root.Float64Array) && func,
          result = new func(new ArrayBuffer(10), 0, 1) && func;
    } catch(e) {}
    return result;
  }());

  /* Native method references for those with the same name as other `lodash` methods. */
  var nativeIsArray = isNative(nativeIsArray = Array.isArray) && nativeIsArray,
      nativeKeys = isNative(nativeKeys = Object.keys) && nativeKeys;

  /** Used as the size, in bytes, of each `Float64Array` element. */
  var FLOAT64_BYTES_PER_ELEMENT = Float64Array ? Float64Array.BYTES_PER_ELEMENT : 0;

  /**
   * Used as the maximum length of an array-like value.
   * See the [ES spec](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-number.max_safe_integer)
   * for more details.
   */
  var MAX_SAFE_INTEGER = Math.pow(2, 53) - 1;

  /** Used to store function metadata. */
  var metaMap = WeakMap && new WeakMap;

  /** Used to lookup a type array constructors by `toStringTag`. */
  var ctorByTag = {};
  ctorByTag[float32Tag] = root.Float32Array;
  ctorByTag[float64Tag] = root.Float64Array;
  ctorByTag[int8Tag] = root.Int8Array;
  ctorByTag[int16Tag] = root.Int16Array;
  ctorByTag[int32Tag] = root.Int32Array;
  ctorByTag[uint8Tag] = root.Uint8Array;
  ctorByTag[uint8ClampedTag] = root.Uint8ClampedArray;
  ctorByTag[uint16Tag] = root.Uint16Array;
  ctorByTag[uint32Tag] = root.Uint32Array;

  /** Used to avoid iterating over non-enumerable properties in IE < 9. */
  var nonEnumProps = {};
  nonEnumProps[arrayTag] = nonEnumProps[dateTag] = nonEnumProps[numberTag] = { 'constructor': true, 'toLocaleString': true, 'toString': true, 'valueOf': true };
  nonEnumProps[boolTag] = nonEnumProps[stringTag] = { 'constructor': true, 'toString': true, 'valueOf': true };
  nonEnumProps[errorTag] = nonEnumProps[funcTag] = nonEnumProps[regexpTag] = { 'constructor': true, 'toString': true };
  nonEnumProps[objectTag] = { 'constructor': true };

  arrayEach(shadowProps, function(key) {
    for (var tag in nonEnumProps) {
      if (hasOwnProperty.call(nonEnumProps, tag)) {
        var props = nonEnumProps[tag];
        props[key] = hasOwnProperty.call(props, key);
      }
    }
  });

  /*------------------------------------------------------------------------*/

  /**
   * Creates a `lodash` object which wraps `value` to enable implicit chaining.
   * Methods that operate on and return arrays, collections, and functions can
   * be chained together. Methods that return a boolean or single value will
   * automatically end the chain returning the unwrapped value. Explicit chaining
   * may be enabled using `_.chain`. The execution of chained methods is lazy,
   * that is, execution is deferred until `_#value` is implicitly or explicitly
   * called.
   *
   * Lazy evaluation allows several methods to support shortcut fusion. Shortcut
   * fusion is an optimization that merges iteratees to avoid creating intermediate
   * arrays and reduce the number of iteratee executions.
   *
   * Chaining is supported in custom builds as long as the `_#value` method is
   * directly or indirectly included in the build.
   *
   * In addition to lodash methods, wrappers also have the following `Array` methods:
   * `concat`, `join`, `pop`, `push`, `reverse`, `shift`, `slice`, `sort`, `splice`,
   * and `unshift`
   *
   * The wrapper methods that support shortcut fusion are:
   * `compact`, `drop`, `dropRight`, `dropRightWhile`, `dropWhile`, `filter`,
   * `first`, `initial`, `last`, `map`, `pluck`, `reject`, `rest`, `reverse`,
   * `slice`, `take`, `takeRight`, `takeRightWhile`, `takeWhile`, `toArray`,
   * and `where`
   *
   * The chainable wrapper methods are:
   * `after`, `ary`, `assign`, `at`, `before`, `bind`, `bindAll`, `bindKey`,
   * `callback`, `chain`, `chunk`, `commit`, `compact`, `concat`, `constant`,
   * `countBy`, `create`, `curry`, `debounce`, `defaults`, `defer`, `delay`,
   * `difference`, `drop`, `dropRight`, `dropRightWhile`, `dropWhile`, `fill`,
   * `filter`, `flatten`, `flattenDeep`, `flow`, `flowRight`, `forEach`,
   * `forEachRight`, `forIn`, `forInRight`, `forOwn`, `forOwnRight`, `functions`,
   * `groupBy`, `indexBy`, `initial`, `intersection`, `invert`, `invoke`, `keys`,
   * `keysIn`, `map`, `mapValues`, `matches`, `memoize`, `merge`, `mixin`,
   * `negate`, `noop`, `omit`, `once`, `pairs`, `partial`, `partialRight`,
   * `partition`, `pick`, `plant`, `pluck`, `property`, `propertyOf`, `pull`,
   * `pullAt`, `push`, `range`, `rearg`, `reject`, `remove`, `rest`, `reverse`,
   * `shuffle`, `slice`, `sort`, `sortBy`, `sortByAll`, `splice`, `spread`,
   * `take`, `takeRight`, `takeRightWhile`, `takeWhile`, `tap`, `throttle`,
   * `thru`, `times`, `toArray`, `toPlainObject`, `transform`, `union`, `uniq`,
   * `unshift`, `unzip`, `values`, `valuesIn`, `where`, `without`, `wrap`, `xor`,
   * `zip`, and `zipObject`
   *
   * The wrapper methods that are **not** chainable by default are:
   * `attempt`, `camelCase`, `capitalize`, `clone`, `cloneDeep`, `deburr`,
   * `endsWith`, `escape`, `escapeRegExp`, `every`, `find`, `findIndex`, `findKey`,
   * `findLast`, `findLastIndex`, `findLastKey`, `findWhere`, `first`, `has`,
   * `identity`, `includes`, `indexOf`, `isArguments`, `isArray`, `isBoolean`,
   * `isDate`, `isElement`, `isEmpty`, `isEqual`, `isError`, `isFinite`,
   * `isFunction`, `isMatch`, `isNative`, `isNaN`, `isNull`, `isNumber`,
   * `isObject`, `isPlainObject`, `isRegExp`, `isString`, `isUndefined`,
   * `isTypedArray`, `join`, `kebabCase`, `last`, `lastIndexOf`, `max`, `min`,
   * `noConflict`, `now`, `pad`, `padLeft`, `padRight`, `parseInt`, `pop`,
   * `random`, `reduce`, `reduceRight`, `repeat`, `result`, `runInContext`,
   * `shift`, `size`, `snakeCase`, `some`, `sortedIndex`, `sortedLastIndex`,
   * `startCase`, `startsWith`, `template`, `trim`, `trimLeft`, `trimRight`,
   * `trunc`, `unescape`, `uniqueId`, `value`, and `words`
   *
   * The wrapper method `sample` will return a wrapped value when `n` is provided,
   * otherwise an unwrapped value is returned.
   *
   * @name _
   * @constructor
   * @category Chain
   * @param {*} value The value to wrap in a `lodash` instance.
   * @returns {Object} Returns the new `lodash` wrapper instance.
   * @example
   *
   * var wrapped = _([1, 2, 3]);
   *
   * // returns an unwrapped value
   * wrapped.reduce(function(sum, n) { return sum + n; });
   * // => 6
   *
   * // returns a wrapped value
   * var squares = wrapped.map(function(n) { return n * n; });
   *
   * _.isArray(squares);
   * // => false
   *
   * _.isArray(squares.value());
   * // => true
   */
  function lodash() {
    // No operation performed.
  }

  /**
   * An object environment feature flags.
   *
   * @static
   * @memberOf _
   * @type Object
   */
  var support = lodash.support = {};

  (function(x) {
    var Ctor = function() { this.x = 1; },
        object = { '0': 1, 'length': 1 },
        props = [];

    Ctor.prototype = { 'valueOf': 1, 'y': 1 };
    for (var key in new Ctor) { props.push(key); }

    /**
     * Detect if the `toStringTag` of `arguments` objects is resolvable
     * (all but Firefox < 4, IE < 9).
     *
     * @memberOf _.support
     * @type boolean
     */
    support.argsTag = objToString.call(arguments) == argsTag;

    /**
     * Detect if `name` or `message` properties of `Error.prototype` are
     * enumerable by default (IE < 9, Safari < 5.1).
     *
     * @memberOf _.support
     * @type boolean
     */
    support.enumErrorProps = propertyIsEnumerable.call(errorProto, 'message') ||
      propertyIsEnumerable.call(errorProto, 'name');

    /**
     * Detect if `prototype` properties are enumerable by default.
     *
     * Firefox < 3.6, Opera > 9.50 - Opera < 11.60, and Safari < 5.1
     * (if the prototype or a property on the prototype has been set)
     * incorrectly set the `[[Enumerable]]` value of a function's `prototype`
     * property to `true`.
     *
     * @memberOf _.support
     * @type boolean
     */
    support.enumPrototypes = propertyIsEnumerable.call(Ctor, 'prototype');

    /**
     * Detect if functions can be decompiled by `Function#toString`
     * (all but Firefox OS certified apps, older Opera mobile browsers, and
     * the PlayStation 3; forced `false` for Windows 8 apps).
     *
     * @memberOf _.support
     * @type boolean
     */
    support.funcDecomp = !isNative(root.WinRTError) && reThis.test(function() { return this; });

    /**
     * Detect if `Function#name` is supported (all but IE).
     *
     * @memberOf _.support
     * @type boolean
     */
    support.funcNames = typeof Function.name == 'string';

    /**
     * Detect if string indexes are non-enumerable
     * (IE < 9, RingoJS, Rhino, Narwhal).
     *
     * @memberOf _.support
     * @type boolean
     */
    support.nonEnumStrings = !propertyIsEnumerable.call('x', 0);

    /**
     * Detect if properties shadowing those on `Object.prototype` are
     * non-enumerable.
     *
     * In IE < 9 an object's own properties, shadowing non-enumerable ones,
     * are made non-enumerable as well (a.k.a the JScript `[[DontEnum]]` bug).
     *
     * @memberOf _.support
     * @type boolean
     */
    support.nonEnumShadows = !/valueOf/.test(props);

    /**
     * Detect if own properties are iterated after inherited properties (IE < 9).
     *
     * @memberOf _.support
     * @type boolean
     */
    support.ownLast = props[0] != 'x';

    /**
     * Detect if `Array#shift` and `Array#splice` augment array-like objects
     * correctly.
     *
     * Firefox < 10, compatibility modes of IE 8, and IE < 9 have buggy Array `shift()`
     * and `splice()` functions that fail to remove the last element, `value[0]`,
     * of array-like objects even though the `length` property is set to `0`.
     * The `shift()` method is buggy in compatibility modes of IE 8, while `splice()`
     * is buggy regardless of mode in IE < 9.
     *
     * @memberOf _.support
     * @type boolean
     */
    support.spliceObjects = (splice.call(object, 0, 1), !object[0]);

    /**
     * Detect lack of support for accessing string characters by index.
     *
     * IE < 8 can't access characters by index. IE 8 can only access characters
     * by index on string literals, not string objects.
     *
     * @memberOf _.support
     * @type boolean
     */
    support.unindexedChars = ('x'[0] + Object('x')[0]) != 'xx';

    /**
     * Detect if `arguments` object indexes are non-enumerable.
     *
     * In Firefox < 4, IE < 9, PhantomJS, and Safari < 5.1 `arguments` object
     * indexes are non-enumerable. Chrome < 25 and Node.js < 0.11.0 treat
     * `arguments` object indexes as non-enumerable and fail `hasOwnProperty`
     * checks for indexes that exceed their function's formal parameters with
     * associated values of `0`.
     *
     * @memberOf _.support
     * @type boolean
     */
    try {
      support.nonEnumArgs = !propertyIsEnumerable.call(arguments, 1);
    } catch(e) {
      support.nonEnumArgs = true;
    }
  }(0, 0));

  /*------------------------------------------------------------------------*/

  /**
   * Copies the values of `source` to `array`.
   *
   * @private
   * @param {Array} source The array to copy values from.
   * @param {Array} [array=[]] The array to copy values to.
   * @returns {Array} Returns `array`.
   */
  function arrayCopy(source, array) {
    var index = -1,
        length = source.length;

    array || (array = Array(length));
    while (++index < length) {
      array[index] = source[index];
    }
    return array;
  }

  /**
   * A specialized version of `_.forEach` for arrays without support for callback
   * shorthands or `this` binding.
   *
   * @private
   * @param {Array} array The array to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {Array} Returns `array`.
   */
  function arrayEach(array, iteratee) {
    var index = -1,
        length = array.length;

    while (++index < length) {
      if (iteratee(array[index], index, array) === false) {
        break;
      }
    }
    return array;
  }

  /**
   * A specialized version of `_.map` for arrays without support for callback
   * shorthands or `this` binding.
   *
   * @private
   * @param {Array} array The array to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {Array} Returns the new mapped array.
   */
  function arrayMap(array, iteratee) {
    var index = -1,
        length = array.length,
        result = Array(length);

    while (++index < length) {
      result[index] = iteratee(array[index], index, array);
    }
    return result;
  }

  /**
   * Copies the properties of `source` to `object`.
   *
   * @private
   * @param {Object} source The object to copy properties from.
   * @param {Object} [object={}] The object to copy properties to.
   * @param {Array} props The property names to copy.
   * @returns {Object} Returns `object`.
   */
  function baseCopy(source, object, props) {
    if (!props) {
      props = object;
      object = {};
    }
    var index = -1,
        length = props.length;

    while (++index < length) {
      var key = props[index];
      object[key] = source[key];
    }
    return object;
  }

  /**
   * The base implementation of `_.callback` which supports specifying the
   * number of arguments to provide to `func`.
   *
   * @private
   * @param {*} [func=_.identity] The value to convert to a callback.
   * @param {*} [thisArg] The `this` binding of `func`.
   * @param {number} [argCount] The number of arguments to provide to `func`.
   * @returns {Function} Returns the callback.
   */
  function baseCallback(func, thisArg, argCount) {
    var type = typeof func;
    if (type == 'function') {
      return (typeof thisArg != 'undefined' && isBindable(func))
        ? bindCallback(func, thisArg, argCount)
        : func;
    }
    if (func == null) {
      return identity;
    }
    if (type == 'object') {
      return baseMatches(func);
    }
    return typeof thisArg == 'undefined'
      ? baseProperty(func + '')
      : baseMatchesProperty(func + '', thisArg);
  }

  /**
   * The base implementation of `_.clone` without support for argument juggling
   * and `this` binding `customizer` functions.
   *
   * @private
   * @param {*} value The value to clone.
   * @param {boolean} [isDeep] Specify a deep clone.
   * @param {Function} [customizer] The function to customize cloning values.
   * @param {string} [key] The key of `value`.
   * @param {Object} [object] The object `value` belongs to.
   * @param {Array} [stackA=[]] Tracks traversed source objects.
   * @param {Array} [stackB=[]] Associates clones with source counterparts.
   * @returns {*} Returns the cloned value.
   */
  function baseClone(value, isDeep, customizer, key, object, stackA, stackB) {
    var result;
    if (customizer) {
      result = object ? customizer(value, key, object) : customizer(value);
    }
    if (typeof result != 'undefined') {
      return result;
    }
    if (!isObject(value)) {
      return value;
    }
    var isArr = isArray(value);
    if (isArr) {
      result = initCloneArray(value);
      if (!isDeep) {
        return arrayCopy(value, result);
      }
    } else {
      var tag = objToString.call(value),
          isFunc = tag == funcTag;

      if (tag == objectTag || tag == argsTag || (isFunc && !object)) {
        if (isHostObject(value)) {
          return object ? value : {};
        }
        result = initCloneObject(isFunc ? {} : value);
        if (!isDeep) {
          return baseCopy(value, result, keys(value));
        }
      } else {
        return cloneableTags[tag]
          ? initCloneByTag(value, tag, isDeep)
          : (object ? value : {});
      }
    }
    // Check for circular references and return corresponding clone.
    stackA || (stackA = []);
    stackB || (stackB = []);

    var length = stackA.length;
    while (length--) {
      if (stackA[length] == value) {
        return stackB[length];
      }
    }
    // Add the source value to the stack of traversed objects and associate it with its clone.
    stackA.push(value);
    stackB.push(result);

    // Recursively populate clone (susceptible to call stack limits).
    (isArr ? arrayEach : baseForOwn)(value, function(subValue, key) {
      result[key] = baseClone(subValue, isDeep, customizer, key, value, stackA, stackB);
    });
    return result;
  }

  /**
   * The base implementation of `_.forEach` without support for callback
   * shorthands and `this` binding.
   *
   * @private
   * @param {Array|Object|string} collection The collection to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {Array|Object|string} Returns `collection`.
   */
  function baseEach(collection, iteratee) {
    var length = collection ? collection.length : 0;
    if (!isLength(length)) {
      return baseForOwn(collection, iteratee);
    }
    var index = -1,
        iterable = toObject(collection);

    while (++index < length) {
      if (iteratee(iterable[index], index, iterable) === false) {
        break;
      }
    }
    return collection;
  }

  /**
   * The base implementation of `_.find`, `_.findLast`, `_.findKey`, and `_.findLastKey`,
   * without support for callback shorthands and `this` binding, which iterates
   * over `collection` using the provided `eachFunc`.
   *
   * @private
   * @param {Array|Object|string} collection The collection to search.
   * @param {Function} predicate The function invoked per iteration.
   * @param {Function} eachFunc The function to iterate over `collection`.
   * @param {boolean} [retKey] Specify returning the key of the found element
   *  instead of the element itself.
   * @returns {*} Returns the found element or its key, else `undefined`.
   */
  function baseFind(collection, predicate, eachFunc, retKey) {
    var result;
    eachFunc(collection, function(value, key, collection) {
      if (predicate(value, key, collection)) {
        result = retKey ? key : value;
        return false;
      }
    });
    return result;
  }

  /**
   * The base implementation of `baseForIn` and `baseForOwn` which iterates
   * over `object` properties returned by `keysFunc` invoking `iteratee` for
   * each property. Iterator functions may exit iteration early by explicitly
   * returning `false`.
   *
   * @private
   * @param {Object} object The object to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @param {Function} keysFunc The function to get the keys of `object`.
   * @returns {Object} Returns `object`.
   */
  function baseFor(object, iteratee, keysFunc) {
    var index = -1,
        iterable = toObject(object),
        props = keysFunc(object),
        length = props.length;

    while (++index < length) {
      var key = props[index];
      if (iteratee(iterable[key], key, iterable) === false) {
        break;
      }
    }
    return object;
  }

  /**
   * The base implementation of `_.forIn` without support for callback
   * shorthands and `this` binding.
   *
   * @private
   * @param {Object} object The object to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {Object} Returns `object`.
   */
  function baseForIn(object, iteratee) {
    return baseFor(object, iteratee, keysIn);
  }

  /**
   * The base implementation of `_.forOwn` without support for callback
   * shorthands and `this` binding.
   *
   * @private
   * @param {Object} object The object to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {Object} Returns `object`.
   */
  function baseForOwn(object, iteratee) {
    return baseFor(object, iteratee, keys);
  }

  /**
   * The base implementation of `_.isEqual` without support for `this` binding
   * `customizer` functions.
   *
   * @private
   * @param {*} value The value to compare.
   * @param {*} other The other value to compare.
   * @param {Function} [customizer] The function to customize comparing values.
   * @param {boolean} [isWhere] Specify performing partial comparisons.
   * @param {Array} [stackA] Tracks traversed `value` objects.
   * @param {Array} [stackB] Tracks traversed `other` objects.
   * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
   */
  function baseIsEqual(value, other, customizer, isWhere, stackA, stackB) {
    // Exit early for identical values.
    if (value === other) {
      // Treat `+0` vs. `-0` as not equal.
      return value !== 0 || (1 / value == 1 / other);
    }
    var valType = typeof value,
        othType = typeof other;

    // Exit early for unlike primitive values.
    if ((valType != 'function' && valType != 'object' && othType != 'function' && othType != 'object') ||
        value == null || other == null) {
      // Return `false` unless both values are `NaN`.
      return value !== value && other !== other;
    }
    return baseIsEqualDeep(value, other, baseIsEqual, customizer, isWhere, stackA, stackB);
  }

  /**
   * A specialized version of `baseIsEqual` for arrays and objects which performs
   * deep comparisons and tracks traversed objects enabling objects with circular
   * references to be compared.
   *
   * @private
   * @param {Object} object The object to compare.
   * @param {Object} other The other object to compare.
   * @param {Function} equalFunc The function to determine equivalents of values.
   * @param {Function} [customizer] The function to customize comparing objects.
   * @param {boolean} [isWhere] Specify performing partial comparisons.
   * @param {Array} [stackA=[]] Tracks traversed `value` objects.
   * @param {Array} [stackB=[]] Tracks traversed `other` objects.
   * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
   */
  function baseIsEqualDeep(object, other, equalFunc, customizer, isWhere, stackA, stackB) {
    var objIsArr = isArray(object),
        othIsArr = isArray(other),
        objTag = arrayTag,
        othTag = arrayTag;

    if (!objIsArr) {
      objTag = objToString.call(object);
      if (objTag == argsTag) {
        objTag = objectTag;
      } else if (objTag != objectTag) {
        objIsArr = isTypedArray(object);
      }
    }
    if (!othIsArr) {
      othTag = objToString.call(other);
      if (othTag == argsTag) {
        othTag = objectTag;
      } else if (othTag != objectTag) {
        othIsArr = isTypedArray(other);
      }
    }
    var objIsObj = objTag == objectTag && !isHostObject(object),
        othIsObj = othTag == objectTag && !isHostObject(other),
        isSameTag = objTag == othTag;

    if (isSameTag && !(objIsArr || objIsObj)) {
      return equalByTag(object, other, objTag);
    }
    var valWrapped = objIsObj && hasOwnProperty.call(object, '__wrapped__'),
        othWrapped = othIsObj && hasOwnProperty.call(other, '__wrapped__');

    if (valWrapped || othWrapped) {
      return equalFunc(valWrapped ? object.value() : object, othWrapped ? other.value() : other, customizer, isWhere, stackA, stackB);
    }
    if (!isSameTag) {
      return false;
    }
    // Assume cyclic values are equal.
    // For more information on detecting circular references see https://es5.github.io/#JO.
    stackA || (stackA = []);
    stackB || (stackB = []);

    var length = stackA.length;
    while (length--) {
      if (stackA[length] == object) {
        return stackB[length] == other;
      }
    }
    // Add `object` and `other` to the stack of traversed objects.
    stackA.push(object);
    stackB.push(other);

    var result = (objIsArr ? equalArrays : equalObjects)(object, other, equalFunc, customizer, isWhere, stackA, stackB);

    stackA.pop();
    stackB.pop();

    return result;
  }

  /**
   * The base implementation of `_.isMatch` without support for callback
   * shorthands or `this` binding.
   *
   * @private
   * @param {Object} object The object to inspect.
   * @param {Array} props The source property names to match.
   * @param {Array} values The source values to match.
   * @param {Array} strictCompareFlags Strict comparison flags for source values.
   * @param {Function} [customizer] The function to customize comparing objects.
   * @returns {boolean} Returns `true` if `object` is a match, else `false`.
   */
  function baseIsMatch(object, props, values, strictCompareFlags, customizer) {
    var length = props.length;
    if (object == null) {
      return !length;
    }
    var index = -1,
        noCustomizer = !customizer;

    while (++index < length) {
      if ((noCustomizer && strictCompareFlags[index])
            ? values[index] !== object[props[index]]
            : !hasOwnProperty.call(object, props[index])
          ) {
        return false;
      }
    }
    index = -1;
    while (++index < length) {
      var key = props[index];
      if (noCustomizer && strictCompareFlags[index]) {
        var result = hasOwnProperty.call(object, key);
      } else {
        var objValue = object[key],
            srcValue = values[index];

        result = customizer ? customizer(objValue, srcValue, key) : undefined;
        if (typeof result == 'undefined') {
          result = baseIsEqual(srcValue, objValue, customizer, true);
        }
      }
      if (!result) {
        return false;
      }
    }
    return true;
  }

  /**
   * The base implementation of `_.map` without support for callback shorthands
   * or `this` binding.
   *
   * @private
   * @param {Array|Object|string} collection The collection to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {Array} Returns the new mapped array.
   */
  function baseMap(collection, iteratee) {
    var result = [];
    baseEach(collection, function(value, key, collection) {
      result.push(iteratee(value, key, collection));
    });
    return result;
  }

  /**
   * The base implementation of `_.matches` which does not clone `source`.
   *
   * @private
   * @param {Object} source The object of property values to match.
   * @returns {Function} Returns the new function.
   */
  function baseMatches(source) {
    var props = keys(source),
        length = props.length;

    if (length == 1) {
      var key = props[0],
          value = source[key];

      if (isStrictComparable(value)) {
        return function(object) {
          return object != null && value === object[key] && hasOwnProperty.call(object, key);
        };
      }
    }
    var values = Array(length),
        strictCompareFlags = Array(length);

    while (length--) {
      value = source[props[length]];
      values[length] = value;
      strictCompareFlags[length] = isStrictComparable(value);
    }
    return function(object) {
      return baseIsMatch(object, props, values, strictCompareFlags);
    };
  }

  /**
   * The base implementation of `_.matchesProperty` which does not coerce `key`
   * to a string.
   *
   * @private
   * @param {string} key The key of the property to get.
   * @param {*} value The value to compare.
   * @returns {Function} Returns the new function.
   */
  function baseMatchesProperty(key, value) {
    if (isStrictComparable(value)) {
      return function(object) {
        return object != null && object[key] === value;
      };
    }
    return function(object) {
      return object != null && baseIsEqual(value, object[key], null, true);
    };
  }

  /**
   * The base implementation of `_.merge` without support for argument juggling,
   * multiple sources, and `this` binding `customizer` functions.
   *
   * @private
   * @param {Object} object The destination object.
   * @param {Object} source The source object.
   * @param {Function} [customizer] The function to customize merging properties.
   * @param {Array} [stackA=[]] Tracks traversed source objects.
   * @param {Array} [stackB=[]] Associates values with source counterparts.
   * @returns {Object} Returns the destination object.
   */
  function baseMerge(object, source, customizer, stackA, stackB) {
    var isSrcArr = isLength(source.length) && (isArray(source) || isTypedArray(source));

    (isSrcArr ? arrayEach : baseForOwn)(source, function(srcValue, key, source) {
      if (isObjectLike(srcValue)) {
        stackA || (stackA = []);
        stackB || (stackB = []);
        return baseMergeDeep(object, source, key, baseMerge, customizer, stackA, stackB);
      }
      var value = object[key],
          result = customizer ? customizer(value, srcValue, key, object, source) : undefined,
          isCommon = typeof result == 'undefined';

      if (isCommon) {
        result = srcValue;
      }
      if ((isSrcArr || typeof result != 'undefined') &&
          (isCommon || (result === result ? result !== value : value === value))) {
        object[key] = result;
      }
    });
    return object;
  }

  /**
   * A specialized version of `baseMerge` for arrays and objects which performs
   * deep merges and tracks traversed objects enabling objects with circular
   * references to be merged.
   *
   * @private
   * @param {Object} object The destination object.
   * @param {Object} source The source object.
   * @param {string} key The key of the value to merge.
   * @param {Function} mergeFunc The function to merge values.
   * @param {Function} [customizer] The function to customize merging properties.
   * @param {Array} [stackA=[]] Tracks traversed source objects.
   * @param {Array} [stackB=[]] Associates values with source counterparts.
   * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
   */
  function baseMergeDeep(object, source, key, mergeFunc, customizer, stackA, stackB) {
    var length = stackA.length,
        srcValue = source[key];

    while (length--) {
      if (stackA[length] == srcValue) {
        object[key] = stackB[length];
        return;
      }
    }
    var value = object[key],
        result = customizer ? customizer(value, srcValue, key, object, source) : undefined,
        isCommon = typeof result == 'undefined';

    if (isCommon) {
      result = srcValue;
      if (isLength(srcValue.length) && (isArray(srcValue) || isTypedArray(srcValue))) {
        result = isArray(value)
          ? value
          : (value ? arrayCopy(value) : []);
      }
      else if (isPlainObject(srcValue) || isArguments(srcValue)) {
        result = isArguments(value)
          ? toPlainObject(value)
          : (isPlainObject(value) ? value : {});
      }
      else {
        isCommon = false;
      }
    }
    // Add the source value to the stack of traversed objects and associate
    // it with its merged value.
    stackA.push(srcValue);
    stackB.push(result);

    if (isCommon) {
      // Recursively merge objects and arrays (susceptible to call stack limits).
      object[key] = mergeFunc(result, srcValue, customizer, stackA, stackB);
    } else if (result === result ? result !== value : value === value) {
      object[key] = result;
    }
  }

  /**
   * The base implementation of `_.property` which does not coerce `key` to a string.
   *
   * @private
   * @param {string} key The key of the property to get.
   * @returns {Function} Returns the new function.
   */
  function baseProperty(key) {
    return function(object) {
      return object == null ? undefined : object[key];
    };
  }

  /**
   * The base implementation of `setData` without support for hot loop detection.
   *
   * @private
   * @param {Function} func The function to associate metadata with.
   * @param {*} data The metadata.
   * @returns {Function} Returns `func`.
   */
  var baseSetData = !metaMap ? identity : function(func, data) {
    metaMap.set(func, data);
    return func;
  };

  /**
   * A specialized version of `baseCallback` which only supports `this` binding
   * and specifying the number of arguments to provide to `func`.
   *
   * @private
   * @param {Function} func The function to bind.
   * @param {*} thisArg The `this` binding of `func`.
   * @param {number} [argCount] The number of arguments to provide to `func`.
   * @returns {Function} Returns the callback.
   */
  function bindCallback(func, thisArg, argCount) {
    if (typeof func != 'function') {
      return identity;
    }
    if (typeof thisArg == 'undefined') {
      return func;
    }
    switch (argCount) {
      case 1: return function(value) {
        return func.call(thisArg, value);
      };
      case 3: return function(value, index, collection) {
        return func.call(thisArg, value, index, collection);
      };
      case 4: return function(accumulator, value, index, collection) {
        return func.call(thisArg, accumulator, value, index, collection);
      };
      case 5: return function(value, other, key, object, source) {
        return func.call(thisArg, value, other, key, object, source);
      };
    }
    return function() {
      return func.apply(thisArg, arguments);
    };
  }

  /**
   * Creates a clone of the given array buffer.
   *
   * @private
   * @param {ArrayBuffer} buffer The array buffer to clone.
   * @returns {ArrayBuffer} Returns the cloned array buffer.
   */
  function bufferClone(buffer) {
    return bufferSlice.call(buffer, 0);
  }
  if (!bufferSlice) {
    // PhantomJS has `ArrayBuffer` and `Uint8Array` but not `Float64Array`.
    bufferClone = !(ArrayBuffer && Uint8Array) ? constant(null) : function(buffer) {
      var byteLength = buffer.byteLength,
          floatLength = Float64Array ? floor(byteLength / FLOAT64_BYTES_PER_ELEMENT) : 0,
          offset = floatLength * FLOAT64_BYTES_PER_ELEMENT,
          result = new ArrayBuffer(byteLength);

      if (floatLength) {
        var view = new Float64Array(result, 0, floatLength);
        view.set(new Float64Array(buffer, 0, floatLength));
      }
      if (byteLength != offset) {
        view = new Uint8Array(result, offset);
        view.set(new Uint8Array(buffer, offset));
      }
      return result;
    };
  }

  /**
   * Creates a function that assigns properties of source object(s) to a given
   * destination object.
   *
   * @private
   * @param {Function} assigner The function to assign values.
   * @returns {Function} Returns the new assigner function.
   */
  function createAssigner(assigner) {
    return function() {
      var length = arguments.length,
          object = arguments[0];

      if (length < 2 || object == null) {
        return object;
      }
      if (length > 3 && isIterateeCall(arguments[1], arguments[2], arguments[3])) {
        length = 2;
      }
      // Juggle arguments.
      if (length > 3 && typeof arguments[length - 2] == 'function') {
        var customizer = bindCallback(arguments[--length - 1], arguments[length--], 5);
      } else if (length > 2 && typeof arguments[length - 1] == 'function') {
        customizer = arguments[--length];
      }
      var index = 0;
      while (++index < length) {
        var source = arguments[index];
        if (source) {
          assigner(object, source, customizer);
        }
      }
      return object;
    };
  }

  /**
   * A specialized version of `baseIsEqualDeep` for arrays with support for
   * partial deep comparisons.
   *
   * @private
   * @param {Array} array The array to compare.
   * @param {Array} other The other array to compare.
   * @param {Function} equalFunc The function to determine equivalents of values.
   * @param {Function} [customizer] The function to customize comparing arrays.
   * @param {boolean} [isWhere] Specify performing partial comparisons.
   * @param {Array} [stackA] Tracks traversed `value` objects.
   * @param {Array} [stackB] Tracks traversed `other` objects.
   * @returns {boolean} Returns `true` if the arrays are equivalent, else `false`.
   */
  function equalArrays(array, other, equalFunc, customizer, isWhere, stackA, stackB) {
    var index = -1,
        arrLength = array.length,
        othLength = other.length,
        result = true;

    if (arrLength != othLength && !(isWhere && othLength > arrLength)) {
      return false;
    }
    // Deep compare the contents, ignoring non-numeric properties.
    while (result && ++index < arrLength) {
      var arrValue = array[index],
          othValue = other[index];

      result = undefined;
      if (customizer) {
        result = isWhere
          ? customizer(othValue, arrValue, index)
          : customizer(arrValue, othValue, index);
      }
      if (typeof result == 'undefined') {
        // Recursively compare arrays (susceptible to call stack limits).
        if (isWhere) {
          var othIndex = othLength;
          while (othIndex--) {
            othValue = other[othIndex];
            result = (arrValue && arrValue === othValue) || equalFunc(arrValue, othValue, customizer, isWhere, stackA, stackB);
            if (result) {
              break;
            }
          }
        } else {
          result = (arrValue && arrValue === othValue) || equalFunc(arrValue, othValue, customizer, isWhere, stackA, stackB);
        }
      }
    }
    return !!result;
  }

  /**
   * A specialized version of `baseIsEqualDeep` for comparing objects of
   * the same `toStringTag`.
   *
   * **Note:** This function only supports comparing values with tags of
   * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
   *
   * @private
   * @param {Object} value The object to compare.
   * @param {Object} other The other object to compare.
   * @param {string} tag The `toStringTag` of the objects to compare.
   * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
   */
  function equalByTag(object, other, tag) {
    switch (tag) {
      case boolTag:
      case dateTag:
        // Coerce dates and booleans to numbers, dates to milliseconds and booleans
        // to `1` or `0` treating invalid dates coerced to `NaN` as not equal.
        return +object == +other;

      case errorTag:
        return object.name == other.name && object.message == other.message;

      case numberTag:
        // Treat `NaN` vs. `NaN` as equal.
        return (object != +object)
          ? other != +other
          // But, treat `-0` vs. `+0` as not equal.
          : (object == 0 ? ((1 / object) == (1 / other)) : object == +other);

      case regexpTag:
      case stringTag:
        // Coerce regexes to strings and treat strings primitives and string
        // objects as equal. See https://es5.github.io/#x15.10.6.4 for more details.
        return object == (other + '');
    }
    return false;
  }

  /**
   * A specialized version of `baseIsEqualDeep` for objects with support for
   * partial deep comparisons.
   *
   * @private
   * @param {Object} object The object to compare.
   * @param {Object} other The other object to compare.
   * @param {Function} equalFunc The function to determine equivalents of values.
   * @param {Function} [customizer] The function to customize comparing values.
   * @param {boolean} [isWhere] Specify performing partial comparisons.
   * @param {Array} [stackA] Tracks traversed `value` objects.
   * @param {Array} [stackB] Tracks traversed `other` objects.
   * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
   */
  function equalObjects(object, other, equalFunc, customizer, isWhere, stackA, stackB) {
    var objProps = keys(object),
        objLength = objProps.length,
        othProps = keys(other),
        othLength = othProps.length;

    if (objLength != othLength && !isWhere) {
      return false;
    }
    var hasCtor,
        index = -1;

    while (++index < objLength) {
      var key = objProps[index],
          result = hasOwnProperty.call(other, key);

      if (result) {
        var objValue = object[key],
            othValue = other[key];

        result = undefined;
        if (customizer) {
          result = isWhere
            ? customizer(othValue, objValue, key)
            : customizer(objValue, othValue, key);
        }
        if (typeof result == 'undefined') {
          // Recursively compare objects (susceptible to call stack limits).
          result = (objValue && objValue === othValue) || equalFunc(objValue, othValue, customizer, isWhere, stackA, stackB);
        }
      }
      if (!result) {
        return false;
      }
      hasCtor || (hasCtor = key == 'constructor');
    }
    if (!hasCtor) {
      var objCtor = object.constructor,
          othCtor = other.constructor;

      // Non `Object` object instances with different constructors are not equal.
      if (objCtor != othCtor && ('constructor' in object && 'constructor' in other) &&
          !(typeof objCtor == 'function' && objCtor instanceof objCtor && typeof othCtor == 'function' && othCtor instanceof othCtor)) {
        return false;
      }
    }
    return true;
  }

  /**
   * Gets the appropriate "callback" function. If the `_.callback` method is
   * customized this function returns the custom method, otherwise it returns
   * the `baseCallback` function. If arguments are provided the chosen function
   * is invoked with them and its result is returned.
   *
   * @private
   * @returns {Function} Returns the chosen function or its result.
   */
  function getCallback(func, thisArg, argCount) {
    var result = lodash.callback || callback;
    result = result === callback ? baseCallback : result;
    return argCount ? result(func, thisArg, argCount) : result;
  }

  /**
   * Initializes an array clone.
   *
   * @private
   * @param {Array} array The array to clone.
   * @returns {Array} Returns the initialized clone.
   */
  function initCloneArray(array) {
    var length = array.length,
        result = new array.constructor(length);

    // Add array properties assigned by `RegExp#exec`.
    if (length && typeof array[0] == 'string' && hasOwnProperty.call(array, 'index')) {
      result.index = array.index;
      result.input = array.input;
    }
    return result;
  }

  /**
   * Initializes an object clone.
   *
   * @private
   * @param {Object} object The object to clone.
   * @returns {Object} Returns the initialized clone.
   */
  function initCloneObject(object) {
    var Ctor = object.constructor;
    if (!(typeof Ctor == 'function' && Ctor instanceof Ctor)) {
      Ctor = Object;
    }
    return new Ctor;
  }

  /**
   * Initializes an object clone based on its `toStringTag`.
   *
   * **Note:** This function only supports cloning values with tags of
   * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
   *
   *
   * @private
   * @param {Object} object The object to clone.
   * @param {string} tag The `toStringTag` of the object to clone.
   * @param {boolean} [isDeep] Specify a deep clone.
   * @returns {Object} Returns the initialized clone.
   */
  function initCloneByTag(object, tag, isDeep) {
    var Ctor = object.constructor;
    switch (tag) {
      case arrayBufferTag:
        return bufferClone(object);

      case boolTag:
      case dateTag:
        return new Ctor(+object);

      case float32Tag: case float64Tag:
      case int8Tag: case int16Tag: case int32Tag:
      case uint8Tag: case uint8ClampedTag: case uint16Tag: case uint32Tag:
        // Safari 5 mobile incorrectly has `Object` as the constructor of typed arrays.
        if (Ctor instanceof Ctor) {
          Ctor = ctorByTag[tag];
        }
        var buffer = object.buffer;
        return new Ctor(isDeep ? bufferClone(buffer) : buffer, object.byteOffset, object.length);

      case numberTag:
      case stringTag:
        return new Ctor(object);

      case regexpTag:
        var result = new Ctor(object.source, reFlags.exec(object));
        result.lastIndex = object.lastIndex;
    }
    return result;
  }

  /**
   * Checks if `func` is eligible for `this` binding.
   *
   * @private
   * @param {Function} func The function to check.
   * @returns {boolean} Returns `true` if `func` is eligible, else `false`.
   */
  function isBindable(func) {
    var support = lodash.support,
        result = !(support.funcNames ? func.name : support.funcDecomp);

    if (!result) {
      var source = fnToString.call(func);
      if (!support.funcNames) {
        result = !reFuncName.test(source);
      }
      if (!result) {
        // Check if `func` references the `this` keyword and store the result.
        result = reThis.test(source) || isNative(func);
        baseSetData(func, result);
      }
    }
    return result;
  }

  /**
   * Checks if `value` is a valid array-like index.
   *
   * @private
   * @param {*} value The value to check.
   * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
   * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
   */
  function isIndex(value, length) {
    value = +value;
    length = length == null ? MAX_SAFE_INTEGER : length;
    return value > -1 && value % 1 == 0 && value < length;
  }

  /**
   * Checks if the provided arguments are from an iteratee call.
   *
   * @private
   * @param {*} value The potential iteratee value argument.
   * @param {*} index The potential iteratee index or key argument.
   * @param {*} object The potential iteratee object argument.
   * @returns {boolean} Returns `true` if the arguments are from an iteratee call, else `false`.
   */
  function isIterateeCall(value, index, object) {
    if (!isObject(object)) {
      return false;
    }
    var type = typeof index;
    if (type == 'number') {
      var length = object.length,
          prereq = isLength(length) && isIndex(index, length);
    } else {
      prereq = type == 'string' && index in object;
    }
    return prereq && object[index] === value;
  }

  /**
   * Checks if `value` is a valid array-like length.
   *
   * **Note:** This function is based on ES `ToLength`. See the
   * [ES spec](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength)
   * for more details.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
   */
  function isLength(value) {
    return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
  }

  /**
   * Checks if `value` is suitable for strict equality comparisons, i.e. `===`.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` if suitable for strict
   *  equality comparisons, else `false`.
   */
  function isStrictComparable(value) {
    return value === value && (value === 0 ? ((1 / value) > 0) : !isObject(value));
  }

  /**
   * A fallback implementation of `_.isPlainObject` which checks if `value`
   * is an object created by the `Object` constructor or has a `[[Prototype]]`
   * of `null`.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
   */
  function shimIsPlainObject(value) {
    var Ctor,
        support = lodash.support;

    // Exit early for non `Object` objects.
    if (!(isObjectLike(value) && objToString.call(value) == objectTag && !isHostObject(value)) ||
        (!hasOwnProperty.call(value, 'constructor') &&
          (Ctor = value.constructor, typeof Ctor == 'function' && !(Ctor instanceof Ctor))) ||
        (!support.argsTag && isArguments(value))) {
      return false;
    }
    // IE < 9 iterates inherited properties before own properties. If the first
    // iterated property is an object's own property then there are no inherited
    // enumerable properties.
    var result;
    if (support.ownLast) {
      baseForIn(value, function(subValue, key, object) {
        result = hasOwnProperty.call(object, key);
        return false;
      });
      return result !== false;
    }
    // In most environments an object's own properties are iterated before
    // its inherited properties. If the last iterated property is an object's
    // own property then there are no inherited enumerable properties.
    baseForIn(value, function(subValue, key) {
      result = key;
    });
    return typeof result == 'undefined' || hasOwnProperty.call(value, result);
  }

  /**
   * A fallback implementation of `Object.keys` which creates an array of the
   * own enumerable property names of `object`.
   *
   * @private
   * @param {Object} object The object to inspect.
   * @returns {Array} Returns the array of property names.
   */
  function shimKeys(object) {
    var props = keysIn(object),
        propsLength = props.length,
        length = propsLength && object.length,
        support = lodash.support;

    var allowIndexes = length && isLength(length) &&
      (isArray(object) || (support.nonEnumStrings && isString(object)) ||
        (support.nonEnumArgs && isArguments(object)));

    var index = -1,
        result = [];

    while (++index < propsLength) {
      var key = props[index];
      if ((allowIndexes && isIndex(key, length)) || hasOwnProperty.call(object, key)) {
        result.push(key);
      }
    }
    return result;
  }

  /**
   * Converts `value` to an object if it is not one.
   *
   * @private
   * @param {*} value The value to process.
   * @returns {Object} Returns the object.
   */
  function toObject(value) {
    if (lodash.support.unindexedChars && isString(value)) {
      var index = -1,
          length = value.length,
          result = Object(value);

      while (++index < length) {
        result[index] = value.charAt(index);
      }
      return result;
    }
    return isObject(value) ? value : Object(value);
  }

  /*------------------------------------------------------------------------*/

  /**
   * This method is like `_.find` except that it returns the index of the first
   * element `predicate` returns truthy for, instead of the element itself.
   *
   * If a property name is provided for `predicate` the created "_.property"
   * style callback returns the property value of the given element.
   *
   * If value is also provided for `thisArg` the created "_.matchesProperty"
   * style callback returns `true` for elements that have a matching property
   * value, else `false`.
   *
   * If an object is provided for `predicate` the created "_.matches" style
   * callback returns `true` for elements that have the properties of the given
   * object, else `false`.
   *
   * @static
   * @memberOf _
   * @category Array
   * @param {Array} array The array to search.
   * @param {Function|Object|string} [predicate=_.identity] The function invoked
   *  per iteration. If a property name or object is provided it is used to
   *  create a "_.property" or "_.matches" style callback respectively.
   * @param {*} [thisArg] The `this` binding of `predicate`.
   * @returns {number} Returns the index of the found element, else `-1`.
   * @example
   *
   * var users = [
   *   { 'user': 'barney',  'age': 36, 'active': false },
   *   { 'user': 'fred',    'age': 40, 'active': true },
   *   { 'user': 'pebbles', 'age': 1,  'active': false }
   * ];
   *
   * _.findIndex(users, function(chr) { return chr.age < 40; });
   * // => 0
   *
   * // using the "_.matches" callback shorthand
   * _.findIndex(users, { 'age': 40, 'active': true });
   * // => 1
   *
   * // using the "_.matchesProperty" callback shorthand
   * _.findIndex(users, 'age', 1);
   * // => 2
   *
   * // using the "_.property" callback shorthand
   * _.findIndex(users, 'active');
   * // => 1
   */
  function findIndex(array, predicate, thisArg) {
    var index = -1,
        length = array ? array.length : 0;

    predicate = getCallback(predicate, thisArg, 3);
    while (++index < length) {
      if (predicate(array[index], index, array)) {
        return index;
      }
    }
    return -1;
  }

  /**
   * Gets the last element of `array`.
   *
   * @static
   * @memberOf _
   * @category Array
   * @param {Array} array The array to query.
   * @returns {*} Returns the last element of `array`.
   * @example
   *
   * _.last([1, 2, 3]);
   * // => 3
   */
  function last(array) {
    var length = array ? array.length : 0;
    return length ? array[length - 1] : undefined;
  }

  /*------------------------------------------------------------------------*/

  /**
   * Iterates over elements of `collection`, returning the first element
   * `predicate` returns truthy for. The predicate is bound to `thisArg` and
   * invoked with three arguments; (value, index|key, collection).
   *
   * If a property name is provided for `predicate` the created "_.property"
   * style callback returns the property value of the given element.
   *
   * If value is also provided for `thisArg` the created "_.matchesProperty"
   * style callback returns `true` for elements that have a matching property
   * value, else `false`.
   *
   * If an object is provided for `predicate` the created "_.matches" style
   * callback returns `true` for elements that have the properties of the given
   * object, else `false`.
   *
   * @static
   * @memberOf _
   * @alias detect
   * @category Collection
   * @param {Array|Object|string} collection The collection to search.
   * @param {Function|Object|string} [predicate=_.identity] The function invoked
   *  per iteration. If a property name or object is provided it is used to
   *  create a "_.property" or "_.matches" style callback respectively.
   * @param {*} [thisArg] The `this` binding of `predicate`.
   * @returns {*} Returns the matched element, else `undefined`.
   * @example
   *
   * var users = [
   *   { 'user': 'barney',  'age': 36, 'active': true },
   *   { 'user': 'fred',    'age': 40, 'active': false },
   *   { 'user': 'pebbles', 'age': 1,  'active': true }
   * ];
   *
   * _.result(_.find(users, function(chr) { return chr.age < 40; }), 'user');
   * // => 'barney'
   *
   * // using the "_.matches" callback shorthand
   * _.result(_.find(users, { 'age': 1, 'active': true }), 'user');
   * // => 'pebbles'
   *
   * // using the "_.matchesProperty" callback shorthand
   * _.result(_.find(users, 'active', false), 'user');
   * // => 'fred'
   *
   * // using the "_.property" callback shorthand
   * _.result(_.find(users, 'active'), 'user');
   * // => 'barney'
   */
  function find(collection, predicate, thisArg) {
    if (isArray(collection)) {
      var index = findIndex(collection, predicate, thisArg);
      return index > -1 ? collection[index] : undefined;
    }
    predicate = getCallback(predicate, thisArg, 3);
    return baseFind(collection, predicate, baseEach);
  }

  /**
   * Iterates over elements of `collection` invoking `iteratee` for each element.
   * The `iteratee` is bound to `thisArg` and invoked with three arguments;
   * (value, index|key, collection). Iterator functions may exit iteration early
   * by explicitly returning `false`.
   *
   * **Note:** As with other "Collections" methods, objects with a `length` property
   * are iterated like arrays. To avoid this behavior `_.forIn` or `_.forOwn`
   * may be used for object iteration.
   *
   * @static
   * @memberOf _
   * @alias each
   * @category Collection
   * @param {Array|Object|string} collection The collection to iterate over.
   * @param {Function} [iteratee=_.identity] The function invoked per iteration.
   * @param {*} [thisArg] The `this` binding of `iteratee`.
   * @returns {Array|Object|string} Returns `collection`.
   * @example
   *
   * _([1, 2, 3]).forEach(function(n) { console.log(n); }).value();
   * // => logs each value from left to right and returns the array
   *
   * _.forEach({ 'one': 1, 'two': 2, 'three': 3 }, function(n, key) { console.log(n, key); });
   * // => logs each value-key pair and returns the object (iteration order is not guaranteed)
   */
  function forEach(collection, iteratee, thisArg) {
    return (typeof iteratee == 'function' && typeof thisArg == 'undefined' && isArray(collection))
      ? arrayEach(collection, iteratee)
      : baseEach(collection, bindCallback(iteratee, thisArg, 3));
  }

  /**
   * Creates an array of values by running each element in `collection` through
   * `iteratee`. The `iteratee` is bound to `thisArg` and invoked with three
   * arguments; (value, index|key, collection).
   *
   * If a property name is provided for `predicate` the created "_.property"
   * style callback returns the property value of the given element.
   *
   * If value is also provided for `thisArg` the created "_.matchesProperty"
   * style callback returns `true` for elements that have a matching property
   * value, else `false`.
   *
   * If an object is provided for `predicate` the created "_.matches" style
   * callback returns `true` for elements that have the properties of the given
   * object, else `false`.
   *
   * Many lodash methods are guarded to work as interatees for methods like
   * `_.every`, `_.filter`, `_.map`, `_.mapValues`, `_.reject`, and `_.some`.
   *
   * The guarded methods are:
   * `ary`, `callback`, `chunk`, `clone`, `create`, `curry`, `curryRight`, `drop`,
   * `dropRight`, `fill`, `flatten`, `invert`, `max`, `min`, `parseInt`, `slice`,
   * `sortBy`, `take`, `takeRight`, `template`, `trim`, `trimLeft`, `trimRight`,
   * `trunc`, `random`, `range`, `sample`, `uniq`, and `words`
   *
   * @static
   * @memberOf _
   * @alias collect
   * @category Collection
   * @param {Array|Object|string} collection The collection to iterate over.
   * @param {Function|Object|string} [iteratee=_.identity] The function invoked
   *  per iteration. If a property name or object is provided it is used to
   *  create a "_.property" or "_.matches" style callback respectively.
   * @param {*} [thisArg] The `this` binding of `iteratee`.
   * @returns {Array} Returns the new mapped array.
   * @example
   *
   * _.map([1, 2, 3], function(n) { return n * 3; });
   * // => [3, 6, 9]
   *
   * _.map({ 'one': 1, 'two': 2, 'three': 3 }, function(n) { return n * 3; });
   * // => [3, 6, 9] (iteration order is not guaranteed)
   *
   * var users = [
   *   { 'user': 'barney' },
   *   { 'user': 'fred' }
   * ];
   *
   * // using the "_.property" callback shorthand
   * _.map(users, 'user');
   * // => ['barney', 'fred']
   */
  function map(collection, iteratee, thisArg) {
    var func = isArray(collection) ? arrayMap : baseMap;
    iteratee = getCallback(iteratee, thisArg, 3);
    return func(collection, iteratee);
  }

  /*------------------------------------------------------------------------*/

  /**
   * Checks if `value` is classified as an `arguments` object.
   *
   * @static
   * @memberOf _
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
   * @example
   *
   * (function() { return _.isArguments(arguments); })();
   * // => true
   *
   * _.isArguments([1, 2, 3]);
   * // => false
   */
  function isArguments(value) {
    var length = isObjectLike(value) ? value.length : undefined;
    return (isLength(length) && objToString.call(value) == argsTag) || false;
  }
  // Fallback for environments without a `toStringTag` for `arguments` objects.
  if (!support.argsTag) {
    isArguments = function(value) {
      var length = isObjectLike(value) ? value.length : undefined;
      return (isLength(length) && hasOwnProperty.call(value, 'callee') &&
        !propertyIsEnumerable.call(value, 'callee')) || false;
    };
  }

  /**
   * Checks if `value` is classified as an `Array` object.
   *
   * @static
   * @memberOf _
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
   * @example
   *
   * _.isArray([1, 2, 3]);
   * // => true
   *
   * (function() { return _.isArray(arguments); })();
   * // => false
   */
  var isArray = nativeIsArray || function(value) {
    return (isObjectLike(value) && isLength(value.length) && objToString.call(value) == arrayTag) || false;
  };

  /**
   * Checks if `value` is classified as a `Function` object.
   *
   * @static
   * @memberOf _
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
   * @example
   *
   * _.isFunction(_);
   * // => true
   *
   * _.isFunction(/abc/);
   * // => false
   */
  function isFunction(value) {
    // Avoid a Chakra JIT bug in compatibility modes of IE 11.
    // See https://github.com/jashkenas/underscore/issues/1621 for more details.
    return typeof value == 'function' || false;
  }
  // Fallback for environments that return incorrect `typeof` operator results.
  if (isFunction(/x/) || (Uint8Array && !isFunction(Uint8Array))) {
    isFunction = function(value) {
      // The use of `Object#toString` avoids issues with the `typeof` operator
      // in older versions of Chrome and Safari which return 'function' for regexes
      // and Safari 8 equivalents which return 'object' for typed array constructors.
      return objToString.call(value) == funcTag;
    };
  }

  /**
   * Checks if `value` is the language type of `Object`.
   * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
   *
   * **Note:** See the [ES5 spec](https://es5.github.io/#x8) for more details.
   *
   * @static
   * @memberOf _
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is an object, else `false`.
   * @example
   *
   * _.isObject({});
   * // => true
   *
   * _.isObject([1, 2, 3]);
   * // => true
   *
   * _.isObject(1);
   * // => false
   */
  function isObject(value) {
    // Avoid a V8 JIT bug in Chrome 19-20.
    // See https://code.google.com/p/v8/issues/detail?id=2291 for more details.
    var type = typeof value;
    return type == 'function' || (value && type == 'object') || false;
  }

  /**
   * Checks if `value` is a native function.
   *
   * @static
   * @memberOf _
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a native function, else `false`.
   * @example
   *
   * _.isNative(Array.prototype.push);
   * // => true
   *
   * _.isNative(_);
   * // => false
   */
  function isNative(value) {
    if (value == null) {
      return false;
    }
    if (objToString.call(value) == funcTag) {
      return reNative.test(fnToString.call(value));
    }
    return (isObjectLike(value) &&
      (isHostObject(value) ? reNative : reHostCtor).test(value)) || false;
  }

  /**
   * Checks if `value` is classified as a `Number` primitive or object.
   *
   * **Note:** To exclude `Infinity`, `-Infinity`, and `NaN`, which are classified
   * as numbers, use the `_.isFinite` method.
   *
   * @static
   * @memberOf _
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
   * @example
   *
   * _.isNumber(8.4);
   * // => true
   *
   * _.isNumber(NaN);
   * // => true
   *
   * _.isNumber('8.4');
   * // => false
   */
  function isNumber(value) {
    return typeof value == 'number' || (isObjectLike(value) && objToString.call(value) == numberTag) || false;
  }

  /**
   * Checks if `value` is a plain object, that is, an object created by the
   * `Object` constructor or one with a `[[Prototype]]` of `null`.
   *
   * **Note:** This method assumes objects created by the `Object` constructor
   * have no inherited enumerable properties.
   *
   * @static
   * @memberOf _
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
   * @example
   *
   * function Foo() {
   *   this.a = 1;
   * }
   *
   * _.isPlainObject(new Foo);
   * // => false
   *
   * _.isPlainObject([1, 2, 3]);
   * // => false
   *
   * _.isPlainObject({ 'x': 0, 'y': 0 });
   * // => true
   *
   * _.isPlainObject(Object.create(null));
   * // => true
   */
  var isPlainObject = !getPrototypeOf ? shimIsPlainObject : function(value) {
    if (!(value && objToString.call(value) == objectTag) || (!lodash.support.argsTag && isArguments(value))) {
      return false;
    }
    var valueOf = value.valueOf,
        objProto = isNative(valueOf) && (objProto = getPrototypeOf(valueOf)) && getPrototypeOf(objProto);

    return objProto
      ? (value == objProto || getPrototypeOf(value) == objProto)
      : shimIsPlainObject(value);
  };

  /**
   * Checks if `value` is classified as a `String` primitive or object.
   *
   * @static
   * @memberOf _
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
   * @example
   *
   * _.isString('abc');
   * // => true
   *
   * _.isString(1);
   * // => false
   */
  function isString(value) {
    return typeof value == 'string' || (isObjectLike(value) && objToString.call(value) == stringTag) || false;
  }

  /**
   * Checks if `value` is classified as a typed array.
   *
   * @static
   * @memberOf _
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
   * @example
   *
   * _.isTypedArray(new Uint8Array);
   * // => true
   *
   * _.isTypedArray([]);
   * // => false
   */
  function isTypedArray(value) {
    return (isObjectLike(value) && isLength(value.length) && typedArrayTags[objToString.call(value)]) || false;
  }

  /**
   * Checks if `value` is `undefined`.
   *
   * @static
   * @memberOf _
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is `undefined`, else `false`.
   * @example
   *
   * _.isUndefined(void 0);
   * // => true
   *
   * _.isUndefined(null);
   * // => false
   */
  function isUndefined(value) {
    return typeof value == 'undefined';
  }

  /**
   * Converts `value` to a plain object flattening inherited enumerable
   * properties of `value` to own properties of the plain object.
   *
   * @static
   * @memberOf _
   * @category Lang
   * @param {*} value The value to convert.
   * @returns {Object} Returns the converted plain object.
   * @example
   *
   * function Foo() {
   *   this.b = 2;
   * }
   *
   * Foo.prototype.c = 3;
   *
   * _.assign({ 'a': 1 }, new Foo);
   * // => { 'a': 1, 'b': 2 }
   *
   * _.assign({ 'a': 1 }, _.toPlainObject(new Foo));
   * // => { 'a': 1, 'b': 2, 'c': 3 }
   */
  function toPlainObject(value) {
    return baseCopy(value, keysIn(value));
  }

  /*------------------------------------------------------------------------*/

  /**
   * Creates an array of the own enumerable property names of `object`.
   *
   * **Note:** Non-object values are coerced to objects. See the
   * [ES spec](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-object.keys)
   * for more details.
   *
   * @static
   * @memberOf _
   * @category Object
   * @param {Object} object The object to inspect.
   * @returns {Array} Returns the array of property names.
   * @example
   *
   * function Foo() {
   *   this.a = 1;
   *   this.b = 2;
   * }
   *
   * Foo.prototype.c = 3;
   *
   * _.keys(new Foo);
   * // => ['a', 'b'] (iteration order is not guaranteed)
   *
   * _.keys('hi');
   * // => ['0', '1']
   */
  var keys = !nativeKeys ? shimKeys : function(object) {
    if (object) {
      var Ctor = object.constructor,
          length = object.length;
    }
    if ((typeof Ctor == 'function' && Ctor.prototype === object) ||
       (typeof object == 'function' ? lodash.support.enumPrototypes : (length && isLength(length)))) {
      return shimKeys(object);
    }
    return isObject(object) ? nativeKeys(object) : [];
  };

  /**
   * Creates an array of the own and inherited enumerable property names of `object`.
   *
   * **Note:** Non-object values are coerced to objects.
   *
   * @static
   * @memberOf _
   * @category Object
   * @param {Object} object The object to inspect.
   * @returns {Array} Returns the array of property names.
   * @example
   *
   * function Foo() {
   *   this.a = 1;
   *   this.b = 2;
   * }
   *
   * Foo.prototype.c = 3;
   *
   * _.keysIn(new Foo);
   * // => ['a', 'b', 'c'] (iteration order is not guaranteed)
   */
  function keysIn(object) {
    if (object == null) {
      return [];
    }
    if (!isObject(object)) {
      object = Object(object);
    }
    var length = object.length,
        support = lodash.support;

    length = (length && isLength(length) &&
      (isArray(object) || (support.nonEnumStrings && isString(object)) ||
        (support.nonEnumArgs && isArguments(object))) && length) || 0;

    var Ctor = object.constructor,
        index = -1,
        proto = (isFunction(Ctor) && Ctor.prototype) || objectProto,
        isProto = proto === object,
        result = Array(length),
        skipIndexes = length > 0,
        skipErrorProps = support.enumErrorProps && (object === errorProto || object instanceof Error),
        skipProto = support.enumPrototypes && isFunction(object);

    while (++index < length) {
      result[index] = (index + '');
    }
    // lodash skips the `constructor` property when it infers it is iterating
    // over a `prototype` object because IE < 9 can't set the `[[Enumerable]]`
    // attribute of an existing property and the `constructor` property of a
    // prototype defaults to non-enumerable.
    for (var key in object) {
      if (!(skipProto && key == 'prototype') &&
          !(skipErrorProps && (key == 'message' || key == 'name')) &&
          !(skipIndexes && isIndex(key, length)) &&
          !(key == 'constructor' && (isProto || !hasOwnProperty.call(object, key)))) {
        result.push(key);
      }
    }
    if (support.nonEnumShadows && object !== objectProto) {
      var tag = object === stringProto ? stringTag : object === errorProto ? errorTag : objToString.call(object),
          nonEnums = nonEnumProps[tag] || nonEnumProps[objectTag];

      if (tag == objectTag) {
        proto = objectProto;
      }
      length = shadowProps.length;
      while (length--) {
        key = shadowProps[length];
        var nonEnum = nonEnums[key];
        if (!(isProto && nonEnum) &&
            (nonEnum ? hasOwnProperty.call(object, key) : object[key] !== proto[key])) {
          result.push(key);
        }
      }
    }
    return result;
  }

  /**
   * Recursively merges own enumerable properties of the source object(s), that
   * don't resolve to `undefined` into the destination object. Subsequent sources
   * overwrite property assignments of previous sources. If `customizer` is
   * provided it is invoked to produce the merged values of the destination and
   * source properties. If `customizer` returns `undefined` merging is handled
   * by the method instead. The `customizer` is bound to `thisArg` and invoked
   * with five arguments; (objectValue, sourceValue, key, object, source).
   *
   * @static
   * @memberOf _
   * @category Object
   * @param {Object} object The destination object.
   * @param {...Object} [sources] The source objects.
   * @param {Function} [customizer] The function to customize merging properties.
   * @param {*} [thisArg] The `this` binding of `customizer`.
   * @returns {Object} Returns `object`.
   * @example
   *
   * var users = {
   *   'data': [{ 'user': 'barney' }, { 'user': 'fred' }]
   * };
   *
   * var ages = {
   *   'data': [{ 'age': 36 }, { 'age': 40 }]
   * };
   *
   * _.merge(users, ages);
   * // => { 'data': [{ 'user': 'barney', 'age': 36 }, { 'user': 'fred', 'age': 40 }] }
   *
   * // using a customizer callback
   * var object = {
   *   'fruits': ['apple'],
   *   'vegetables': ['beet']
   * };
   *
   * var other = {
   *   'fruits': ['banana'],
   *   'vegetables': ['carrot']
   * };
   *
   * _.merge(object, other, function(a, b) {
   *   return _.isArray(a) ? a.concat(b) : undefined;
   * });
   * // => { 'fruits': ['apple', 'banana'], 'vegetables': ['beet', 'carrot'] }
   */
  var merge = createAssigner(baseMerge);

  /*------------------------------------------------------------------------*/

  /**
   * Escapes the `RegExp` special characters "\", "^", "$", ".", "|", "?", "*",
   * "+", "(", ")", "[", "]", "{" and "}" in `string`.
   *
   * @static
   * @memberOf _
   * @category String
   * @param {string} [string=''] The string to escape.
   * @returns {string} Returns the escaped string.
   * @example
   *
   * _.escapeRegExp('[lodash](https://lodash.com/)');
   * // => '\[lodash\]\(https://lodash\.com/\)'
   */
  function escapeRegExp(string) {
    string = baseToString(string);
    return (string && reHasRegExpChars.test(string))
      ? string.replace(reRegExpChars, '\\$&')
      : string;
  }

  /*------------------------------------------------------------------------*/

  /**
   * Creates a function that invokes `func` with the `this` binding of `thisArg`
   * and arguments of the created function. If `func` is a property name the
   * created callback returns the property value for a given element. If `func`
   * is an object the created callback returns `true` for elements that contain
   * the equivalent object properties, otherwise it returns `false`.
   *
   * @static
   * @memberOf _
   * @alias iteratee
   * @category Utility
   * @param {*} [func=_.identity] The value to convert to a callback.
   * @param {*} [thisArg] The `this` binding of `func`.
   * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
   * @returns {Function} Returns the callback.
   * @example
   *
   * var users = [
   *   { 'user': 'barney', 'age': 36 },
   *   { 'user': 'fred',   'age': 40 }
   * ];
   *
   * // wrap to create custom callback shorthands
   * _.callback = _.wrap(_.callback, function(callback, func, thisArg) {
   *   var match = /^(.+?)__([gl]t)(.+)$/.exec(func);
   *   if (!match) {
   *     return callback(func, thisArg);
   *   }
   *   return function(object) {
   *     return match[2] == 'gt' ? object[match[1]] > match[3] : object[match[1]] < match[3];
   *   };
   * });
   *
   * _.filter(users, 'age__gt36');
   * // => [{ 'user': 'fred', 'age': 40 }]
   */
  function callback(func, thisArg, guard) {
    if (guard && isIterateeCall(func, thisArg, guard)) {
      thisArg = null;
    }
    return isObjectLike(func)
      ? matches(func)
      : baseCallback(func, thisArg);
  }

  /**
   * Creates a function that returns `value`.
   *
   * @static
   * @memberOf _
   * @category Utility
   * @param {*} value The value to return from the new function.
   * @returns {Function} Returns the new function.
   * @example
   *
   * var object = { 'user': 'fred' };
   * var getter = _.constant(object);
   * getter() === object;
   * // => true
   */
  function constant(value) {
    return function() {
      return value;
    };
  }

  /**
   * This method returns the first argument provided to it.
   *
   * @static
   * @memberOf _
   * @category Utility
   * @param {*} value Any value.
   * @returns {*} Returns `value`.
   * @example
   *
   * var object = { 'user': 'fred' };
   * _.identity(object) === object;
   * // => true
   */
  function identity(value) {
    return value;
  }

  /**
   * Creates a function which performs a deep comparison between a given object
   * and `source`, returning `true` if the given object has equivalent property
   * values, else `false`.
   *
   * **Note:** This method supports comparing arrays, booleans, `Date` objects,
   * numbers, `Object` objects, regexes, and strings. Objects are compared by
   * their own, not inherited, enumerable properties. For comparing a single
   * own or inherited property value see `_.matchesProperty`.
   *
   * @static
   * @memberOf _
   * @category Utility
   * @param {Object} source The object of property values to match.
   * @returns {Function} Returns the new function.
   * @example
   *
   * var users = [
   *   { 'user': 'barney', 'age': 36, 'active': true },
   *   { 'user': 'fred',   'age': 40, 'active': false }
   * ];
   *
   * _.filter(users, _.matches({ 'age': 40, 'active': false }));
   * // => [{ 'user': 'fred', 'age': 40, 'active': false }]
   */
  function matches(source) {
    return baseMatches(baseClone(source, true));
  }

  /*------------------------------------------------------------------------*/

  // Add functions that return wrapped values when chaining.
  lodash.callback = callback;
  lodash.constant = constant;
  lodash.forEach = forEach;
  lodash.keys = keys;
  lodash.keysIn = keysIn;
  lodash.map = map;
  lodash.matches = matches;
  lodash.merge = merge;
  lodash.toPlainObject = toPlainObject;

  // Add aliases.
  lodash.collect = map;
  lodash.each = forEach;
  lodash.iteratee = callback;

  /*------------------------------------------------------------------------*/

  // Add functions that return unwrapped values when chaining.
  lodash.escapeRegExp = escapeRegExp;
  lodash.find = find;
  lodash.findIndex = findIndex;
  lodash.identity = identity;
  lodash.isArguments = isArguments;
  lodash.isArray = isArray;
  lodash.isFunction = isFunction;
  lodash.isNative = isNative;
  lodash.isNumber = isNumber;
  lodash.isObject = isObject;
  lodash.isPlainObject = isPlainObject;
  lodash.isString = isString;
  lodash.isTypedArray = isTypedArray;
  lodash.isUndefined = isUndefined;
  lodash.last = last;

  // Add aliases.
  lodash.detect = find;

  /*------------------------------------------------------------------------*/

  /**
   * The semantic version number.
   *
   * @static
   * @memberOf _
   * @type string
   */
  lodash.VERSION = VERSION;

  /*--------------------------------------------------------------------------*/

  // Some AMD build optimizers like r.js check for condition patterns like the following:
  if (typeof define == 'function' && typeof define.amd == 'object' && define.amd) {
    // Expose lodash to the global object when an AMD loader is present to avoid
    // errors in cases where lodash is loaded by a script tag and not intended
    // as an AMD module. See http://requirejs.org/docs/errors.html#mismatch for
    // more details.
    root._ = lodash;

    // Define as an anonymous module so, through path mapping, it can be
    // referenced as the "underscore" module.
    define(function() {
      return lodash;
    });
  }
  // Check for `exports` after `define` in case a build optimizer adds an `exports` object.
  else if (freeExports && freeModule) {

      freeExports._ = lodash;
  }
  else {
    // Export for a browser or Rhino.
    root._ = lodash;
  }
}.call(this));
 
 ; /** vim: et:ts=4:sw=4:sts=4
 * @license RequireJS 2.1.18 Copyright (c) 2010-2015, The Dojo Foundation All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: http://github.com/jrburke/requirejs for details
 */
//Not using strict: uneven strict support in browsers, #392, and causes
//problems with requirejs.exec()/transpiler plugins that may not be strict.
/*jslint regexp: true, nomen: true, sloppy: true */
/*global window, navigator, document, importScripts, setTimeout, opera */
var requirejs, require, define;

(function(global) {
    var req, s, head, baseElement, dataMain, src, interactiveScript, currentlyAddingScript, mainScript, subPath, version = "2.1.18", commentRegExp = /(\/\*([\s\S]*?)\*\/|([^:]|^)\/\/(.*)$)/gm, cjsRequireRegExp = /[^.]\s*require\s*\(\s*["']([^'"\s]+)["']\s*\)/g, jsSuffixRegExp = /\.js$/, currDirRegExp = /^\.\//, op = Object.prototype, ostring = op.toString, hasOwn = op.hasOwnProperty, ap = Array.prototype, apsp = ap.splice, isBrowser = !!(typeof window !== "undefined" && typeof navigator !== "undefined" && window.document), isWebWorker = !isBrowser && typeof importScripts !== "undefined", //PS3 indicates loaded and complete, but need to wait for complete
    //specifically. Sequence is 'loading', 'loaded', execution,
    // then 'complete'. The UA check is unfortunate, but not sure how
    //to feature test w/o causing perf issues.
    readyRegExp = isBrowser && navigator.platform === "PLAYSTATION 3" ? /^complete$/ : /^(complete|loaded)$/, defContextName = "_", //Oh the tragedy, detecting opera. See the usage of isOpera for reason.
    isOpera = typeof opera !== "undefined" && opera.toString() === "[object Opera]", contexts = {}, cfg = {}, globalDefQueue = [], useInteractive = false;
    function isFunction(a) {
        return ostring.call(a) === "[object Function]";
    }
    function isArray(a) {
        return ostring.call(a) === "[object Array]";
    }
    /**
     * Helper function for iterating over an array. If the func returns
     * a true value, it will break out of the loop.
     */
    function each(a, b) {
        if (a) {
            var c;
            for (c = 0; c < a.length; c += 1) {
                if (a[c] && b(a[c], c, a)) {
                    break;
                }
            }
        }
    }
    /**
     * Helper function for iterating over an array backwards. If the func
     * returns a true value, it will break out of the loop.
     */
    function eachReverse(a, b) {
        if (a) {
            var c;
            for (c = a.length - 1; c > -1; c -= 1) {
                if (a[c] && b(a[c], c, a)) {
                    break;
                }
            }
        }
    }
    function hasProp(a, b) {
        return hasOwn.call(a, b);
    }
    function getOwn(a, b) {
        return hasProp(a, b) && a[b];
    }
    /**
     * Cycles over properties in an object and calls a function for each
     * property value. If the function returns a truthy value, then the
     * iteration is stopped.
     */
    function eachProp(a, b) {
        var c;
        for (c in a) {
            if (hasProp(a, c)) {
                if (b(a[c], c)) {
                    break;
                }
            }
        }
    }
    /**
     * Simple function to mix in properties from source into target,
     * but only if target does not already have a property of the same name.
     */
    function mixin(a, b, c, d) {
        if (b) {
            eachProp(b, function(b, e) {
                if (c || !hasProp(a, e)) {
                    if (d && typeof b === "object" && b && !isArray(b) && !isFunction(b) && !(b instanceof RegExp)) {
                        if (!a[e]) {
                            a[e] = {};
                        }
                        mixin(a[e], b, c, d);
                    } else {
                        a[e] = b;
                    }
                }
            });
        }
        return a;
    }
    //Similar to Function.prototype.bind, but the 'this' object is specified
    //first, since it is easier to read/figure out what 'this' will be.
    function bind(a, b) {
        return function() {
            return b.apply(a, arguments);
        };
    }
    function scripts() {
        return document.getElementsByTagName("script");
    }
    function defaultOnError(a) {
        throw a;
    }
    //Allow getting a global that is expressed in
    //dot notation, like 'a.b.c'.
    function getGlobal(a) {
        if (!a) {
            return a;
        }
        var b = global;
        each(a.split("."), function(a) {
            b = b[a];
        });
        return b;
    }
    /**
     * Constructs an error with a pointer to an URL with more information.
     * @param {String} id the error ID that maps to an ID on a web page.
     * @param {String} message human readable error.
     * @param {Error} [err] the original error, if there is one.
     *
     * @returns {Error}
     */
    function makeError(a, b, c, d) {
        var e = new Error(b + "\nhttp://requirejs.org/docs/errors.html#" + a);
        e.requireType = a;
        e.requireModules = d;
        if (c) {
            e.originalError = c;
        }
        return e;
    }
    if (typeof define !== "undefined") {
        //If a define is already in play via another AMD loader,
        //do not overwrite.
        return;
    }
    if (typeof requirejs !== "undefined") {
        if (isFunction(requirejs)) {
            //Do not overwrite an existing requirejs instance.
            return;
        }
        cfg = requirejs;
        requirejs = undefined;
    }
    //Allow for a require config object
    if (typeof require !== "undefined" && !isFunction(require)) {
        //assume it is a config object.
        cfg = require;
        require = undefined;
    }
    function newContext(a) {
        var b, c, d, e, f, g = {
            //Defaults. Do not set a default for map
            //config to speed up normalize(), which
            //will run faster if there is no default.
            waitSeconds: 7,
            baseUrl: "./",
            paths: {},
            bundles: {},
            pkgs: {},
            shim: {},
            config: {}
        }, h = {}, //registry of just enabled modules, to speed
        //cycle breaking code when lots of modules
        //are registered, but not activated.
        i = {}, j = {}, k = [], l = {}, m = {}, n = {}, o = 1, p = 1;
        /**
         * Trims the . and .. from an array of path segments.
         * It will keep a leading path segment if a .. will become
         * the first path segment, to help with module name lookups,
         * which act like paths, but can be remapped. But the end result,
         * all paths that use this function should look normalized.
         * NOTE: this method MODIFIES the input array.
         * @param {Array} ary the array of path segments.
         */
        function q(a) {
            var b, c;
            for (b = 0; b < a.length; b++) {
                c = a[b];
                if (c === ".") {
                    a.splice(b, 1);
                    b -= 1;
                } else if (c === "..") {
                    // If at the start, or previous value is still ..,
                    // keep them so that when converted to a path it may
                    // still work when converted to a path, even though
                    // as an ID it is less than ideal. In larger point
                    // releases, may be better to just kick out an error.
                    if (b === 0 || b === 1 && a[2] === ".." || a[b - 1] === "..") {
                        continue;
                    } else if (b > 0) {
                        a.splice(b - 1, 2);
                        b -= 2;
                    }
                }
            }
        }
        /**
         * Given a relative module name, like ./something, normalize it to
         * a real name that can be mapped to a path.
         * @param {String} name the relative name
         * @param {String} baseName a real name that the name arg is relative
         * to.
         * @param {Boolean} applyMap apply the map config to the value. Should
         * only be done if this normalization is for a dependency ID.
         * @returns {String} normalized name
         */
        function r(a, b, c) {
            var d, e, f, h, i, j, k, l, m, n, o, p, r = b && b.split("/"), s = g.map, t = s && s["*"];
            //Adjust any relative paths.
            if (a) {
                a = a.split("/");
                k = a.length - 1;
                // If wanting node ID compatibility, strip .js from end
                // of IDs. Have to do this here, and not in nameToUrl
                // because node allows either .js or non .js to map
                // to same file.
                if (g.nodeIdCompat && jsSuffixRegExp.test(a[k])) {
                    a[k] = a[k].replace(jsSuffixRegExp, "");
                }
                // Starts with a '.' so need the baseName
                if (a[0].charAt(0) === "." && r) {
                    //Convert baseName to array, and lop off the last part,
                    //so that . matches that 'directory' and not name of the baseName's
                    //module. For instance, baseName of 'one/two/three', maps to
                    //'one/two/three.js', but we want the directory, 'one/two' for
                    //this normalization.
                    p = r.slice(0, r.length - 1);
                    a = p.concat(a);
                }
                q(a);
                a = a.join("/");
            }
            //Apply map config if available.
            if (c && s && (r || t)) {
                f = a.split("/");
                a: for (h = f.length; h > 0; h -= 1) {
                    j = f.slice(0, h).join("/");
                    if (r) {
                        //Find the longest baseName segment match in the config.
                        //So, do joins on the biggest to smallest lengths of baseParts.
                        for (i = r.length; i > 0; i -= 1) {
                            e = getOwn(s, r.slice(0, i).join("/"));
                            //baseName segment has config, find if it has one for
                            //this name.
                            if (e) {
                                e = getOwn(e, j);
                                if (e) {
                                    //Match, update name to the new value.
                                    l = e;
                                    m = h;
                                    break a;
                                }
                            }
                        }
                    }
                    //Check for a star map match, but just hold on to it,
                    //if there is a shorter segment match later in a matching
                    //config, then favor over this star map.
                    if (!n && t && getOwn(t, j)) {
                        n = getOwn(t, j);
                        o = h;
                    }
                }
                if (!l && n) {
                    l = n;
                    m = o;
                }
                if (l) {
                    f.splice(0, m, l);
                    a = f.join("/");
                }
            }
            // If the name points to a package's name, use
            // the package main instead.
            d = getOwn(g.pkgs, a);
            return d ? d : a;
        }
        function s(a) {
            if (isBrowser) {
                each(scripts(), function(b) {
                    if (b.getAttribute("data-requiremodule") === a && b.getAttribute("data-requirecontext") === d.contextName) {
                        b.parentNode.removeChild(b);
                        return true;
                    }
                });
            }
        }
        function t(a) {
            var b = getOwn(g.paths, a);
            if (b && isArray(b) && b.length > 1) {
                //Pop off the first array value, since it failed, and
                //retry
                b.shift();
                d.require.undef(a);
                //Custom require that does not do map translation, since
                //ID is "absolute", already mapped/resolved.
                d.makeRequire(null, {
                    skipMap: true
                })([ a ]);
                return true;
            }
        }
        //Turns a plugin!resource to [plugin, resource]
        //with the plugin being undefined if the name
        //did not have a plugin prefix.
        function u(a) {
            var b, c = a ? a.indexOf("!") : -1;
            if (c > -1) {
                b = a.substring(0, c);
                a = a.substring(c + 1, a.length);
            }
            return [ b, a ];
        }
        /**
         * Creates a module mapping that includes plugin prefix, module
         * name, and path. If parentModuleMap is provided it will
         * also normalize the name via require.normalize()
         *
         * @param {String} name the module name
         * @param {String} [parentModuleMap] parent module map
         * for the module name, used to resolve relative names.
         * @param {Boolean} isNormalized: is the ID already normalized.
         * This is true if this call is done for a define() module ID.
         * @param {Boolean} applyMap: apply the map config to the ID.
         * Should only be true if this map is for a dependency.
         *
         * @returns {Object}
         */
        function v(a, b, c, e) {
            var f, g, h, i, j = null, k = b ? b.name : null, m = a, n = true, q = "";
            //If no name, then it means it is a require call, generate an
            //internal name.
            if (!a) {
                n = false;
                a = "_@r" + (o += 1);
            }
            i = u(a);
            j = i[0];
            a = i[1];
            if (j) {
                j = r(j, k, e);
                g = getOwn(l, j);
            }
            //Account for relative paths if there is a base name.
            if (a) {
                if (j) {
                    if (g && g.normalize) {
                        //Plugin is loaded, use its normalize method.
                        q = g.normalize(a, function(a) {
                            return r(a, k, e);
                        });
                    } else {
                        // If nested plugin references, then do not try to
                        // normalize, as it will not normalize correctly. This
                        // places a restriction on resourceIds, and the longer
                        // term solution is not to normalize until plugins are
                        // loaded and all normalizations to allow for async
                        // loading of a loader plugin. But for now, fixes the
                        // common uses. Details in #1131
                        q = a.indexOf("!") === -1 ? r(a, k, e) : a;
                    }
                } else {
                    //A regular module.
                    q = r(a, k, e);
                    //Normalized name may be a plugin ID due to map config
                    //application in normalize. The map config values must
                    //already be normalized, so do not need to redo that part.
                    i = u(q);
                    j = i[0];
                    q = i[1];
                    c = true;
                    f = d.nameToUrl(q);
                }
            }
            //If the id is a plugin id that cannot be determined if it needs
            //normalization, stamp it with a unique ID so two matching relative
            //ids that may conflict can be separate.
            h = j && !g && !c ? "_unnormalized" + (p += 1) : "";
            return {
                prefix: j,
                name: q,
                parentMap: b,
                unnormalized: !!h,
                url: f,
                originalName: m,
                isDefine: n,
                id: (j ? j + "!" + q : q) + h
            };
        }
        function w(a) {
            var b = a.id, c = getOwn(h, b);
            if (!c) {
                c = h[b] = new d.Module(a);
            }
            return c;
        }
        function x(a, b, c) {
            var d = a.id, e = getOwn(h, d);
            if (hasProp(l, d) && (!e || e.defineEmitComplete)) {
                if (b === "defined") {
                    c(l[d]);
                }
            } else {
                e = w(a);
                if (e.error && b === "error") {
                    c(e.error);
                } else {
                    e.on(b, c);
                }
            }
        }
        function y(a, b) {
            var c = a.requireModules, d = false;
            if (b) {
                b(a);
            } else {
                each(c, function(b) {
                    var c = getOwn(h, b);
                    if (c) {
                        //Set error on module, so it skips timeout checks.
                        c.error = a;
                        if (c.events.error) {
                            d = true;
                            c.emit("error", a);
                        }
                    }
                });
                if (!d) {
                    req.onError(a);
                }
            }
        }
        /**
         * Internal method to transfer globalQueue items to this context's
         * defQueue.
         */
        function z() {
            //Push all the globalDefQueue items into the context's defQueue
            if (globalDefQueue.length) {
                //Array splice in the values since the context code has a
                //local var ref to defQueue, so cannot just reassign the one
                //on context.
                apsp.apply(k, [ k.length, 0 ].concat(globalDefQueue));
                globalDefQueue = [];
            }
        }
        e = {
            require: function(a) {
                if (a.require) {
                    return a.require;
                } else {
                    return a.require = d.makeRequire(a.map);
                }
            },
            exports: function(a) {
                a.usingExports = true;
                if (a.map.isDefine) {
                    if (a.exports) {
                        return l[a.map.id] = a.exports;
                    } else {
                        return a.exports = l[a.map.id] = {};
                    }
                }
            },
            module: function(a) {
                if (a.module) {
                    return a.module;
                } else {
                    return a.module = {
                        id: a.map.id,
                        uri: a.map.url,
                        config: function() {
                            return getOwn(g.config, a.map.id) || {};
                        },
                        exports: a.exports || (a.exports = {})
                    };
                }
            }
        };
        function A(a) {
            //Clean up machinery used for waiting modules.
            delete h[a];
            delete i[a];
        }
        function B(a, b, c) {
            var d = a.map.id;
            if (a.error) {
                a.emit("error", a.error);
            } else {
                b[d] = true;
                each(a.depMaps, function(d, e) {
                    var f = d.id, g = getOwn(h, f);
                    //Only force things that have not completed
                    //being defined, so still in the registry,
                    //and only if it has not been matched up
                    //in the module already.
                    if (g && !a.depMatched[e] && !c[f]) {
                        if (getOwn(b, f)) {
                            a.defineDep(e, l[f]);
                            a.check();
                        } else {
                            B(g, b, c);
                        }
                    }
                });
                c[d] = true;
            }
        }
        function C() {
            var a, c, e = g.waitSeconds * 1e3, //It is possible to disable the wait interval by using waitSeconds of 0.
            h = e && d.startTime + e < new Date().getTime(), j = [], k = [], l = false, m = true;
            //Do not bother if this call was a result of a cycle break.
            if (b) {
                return;
            }
            b = true;
            //Figure out the state of all the modules.
            eachProp(i, function(a) {
                var b = a.map, d = b.id;
                //Skip things that are not enabled or in error state.
                if (!a.enabled) {
                    return;
                }
                if (!b.isDefine) {
                    k.push(a);
                }
                if (!a.error) {
                    //If the module should be executed, and it has not
                    //been inited and time is up, remember it.
                    if (!a.inited && h) {
                        if (t(d)) {
                            c = true;
                            l = true;
                        } else {
                            j.push(d);
                            s(d);
                        }
                    } else if (!a.inited && a.fetched && b.isDefine) {
                        l = true;
                        if (!b.prefix) {
                            //No reason to keep looking for unfinished
                            //loading. If the only stillLoading is a
                            //plugin resource though, keep going,
                            //because it may be that a plugin resource
                            //is waiting on a non-plugin cycle.
                            return m = false;
                        }
                    }
                }
            });
            if (h && j.length) {
                //If wait time expired, throw error of unloaded modules.
                a = makeError("timeout", "Load timeout for modules: " + j, null, j);
                a.contextName = d.contextName;
                return y(a);
            }
            //Not expired, check for a cycle.
            if (m) {
                each(k, function(a) {
                    B(a, {}, {});
                });
            }
            //If still waiting on loads, and the waiting load is something
            //other than a plugin resource, or there are still outstanding
            //scripts, then just try back later.
            if ((!h || c) && l) {
                //Something is still waiting to load. Wait for it, but only
                //if a timeout is not already in effect.
                if ((isBrowser || isWebWorker) && !f) {
                    f = setTimeout(function() {
                        f = 0;
                        C();
                    }, 50);
                }
            }
            b = false;
        }
        c = function(a) {
            this.events = getOwn(j, a.id) || {};
            this.map = a;
            this.shim = getOwn(g.shim, a.id);
            this.depExports = [];
            this.depMaps = [];
            this.depMatched = [];
            this.pluginMaps = {};
            this.depCount = 0;
        };
        c.prototype = {
            init: function(a, b, c, d) {
                d = d || {};
                //Do not do more inits if already done. Can happen if there
                //are multiple define calls for the same module. That is not
                //a normal, common case, but it is also not unexpected.
                if (this.inited) {
                    return;
                }
                this.factory = b;
                if (c) {
                    //Register for errors on this module.
                    this.on("error", c);
                } else if (this.events.error) {
                    //If no errback already, but there are error listeners
                    //on this module, set up an errback to pass to the deps.
                    c = bind(this, function(a) {
                        this.emit("error", a);
                    });
                }
                //Do a copy of the dependency array, so that
                //source inputs are not modified. For example
                //"shim" deps are passed in here directly, and
                //doing a direct modification of the depMaps array
                //would affect that config.
                this.depMaps = a && a.slice(0);
                this.errback = c;
                //Indicate this module has be initialized
                this.inited = true;
                this.ignore = d.ignore;
                //Could have option to init this module in enabled mode,
                //or could have been previously marked as enabled. However,
                //the dependencies are not known until init is called. So
                //if enabled previously, now trigger dependencies as enabled.
                if (d.enabled || this.enabled) {
                    //Enable this module and dependencies.
                    //Will call this.check()
                    this.enable();
                } else {
                    this.check();
                }
            },
            defineDep: function(a, b) {
                //Because of cycles, defined callback for a given
                //export can be called more than once.
                if (!this.depMatched[a]) {
                    this.depMatched[a] = true;
                    this.depCount -= 1;
                    this.depExports[a] = b;
                }
            },
            fetch: function() {
                if (this.fetched) {
                    return;
                }
                this.fetched = true;
                d.startTime = new Date().getTime();
                var a = this.map;
                //If the manager is for a plugin managed resource,
                //ask the plugin to load it now.
                if (this.shim) {
                    d.makeRequire(this.map, {
                        enableBuildCallback: true
                    })(this.shim.deps || [], bind(this, function() {
                        return a.prefix ? this.callPlugin() : this.load();
                    }));
                } else {
                    //Regular dependency.
                    return a.prefix ? this.callPlugin() : this.load();
                }
            },
            load: function() {
                var a = this.map.url;
                //Regular dependency.
                if (!m[a]) {
                    m[a] = true;
                    d.load(this.map.id, a);
                }
            },
            /**
             * Checks if the module is ready to define itself, and if so,
             * define it.
             */
            check: function() {
                if (!this.enabled || this.enabling) {
                    return;
                }
                var a, b, c = this.map.id, e = this.depExports, f = this.exports, g = this.factory;
                if (!this.inited) {
                    this.fetch();
                } else if (this.error) {
                    this.emit("error", this.error);
                } else if (!this.defining) {
                    //The factory could trigger another require call
                    //that would result in checking this module to
                    //define itself again. If already in the process
                    //of doing that, skip this work.
                    this.defining = true;
                    if (this.depCount < 1 && !this.defined) {
                        if (isFunction(g)) {
                            //If there is an error listener, favor passing
                            //to that instead of throwing an error. However,
                            //only do it for define()'d  modules. require
                            //errbacks should not be called for failures in
                            //their callbacks (#699). However if a global
                            //onError is set, use that.
                            if (this.events.error && this.map.isDefine || req.onError !== defaultOnError) {
                                try {
                                    f = d.execCb(c, g, e, f);
                                } catch (h) {
                                    a = h;
                                }
                            } else {
                                f = d.execCb(c, g, e, f);
                            }
                            // Favor return value over exports. If node/cjs in play,
                            // then will not have a return value anyway. Favor
                            // module.exports assignment over exports object.
                            if (this.map.isDefine && f === undefined) {
                                b = this.module;
                                if (b) {
                                    f = b.exports;
                                } else if (this.usingExports) {
                                    //exports already set the defined value.
                                    f = this.exports;
                                }
                            }
                            if (a) {
                                a.requireMap = this.map;
                                a.requireModules = this.map.isDefine ? [ this.map.id ] : null;
                                a.requireType = this.map.isDefine ? "define" : "require";
                                return y(this.error = a);
                            }
                        } else {
                            //Just a literal value
                            f = g;
                        }
                        this.exports = f;
                        if (this.map.isDefine && !this.ignore) {
                            l[c] = f;
                            if (req.onResourceLoad) {
                                req.onResourceLoad(d, this.map, this.depMaps);
                            }
                        }
                        //Clean up
                        A(c);
                        this.defined = true;
                    }
                    //Finished the define stage. Allow calling check again
                    //to allow define notifications below in the case of a
                    //cycle.
                    this.defining = false;
                    if (this.defined && !this.defineEmitted) {
                        this.defineEmitted = true;
                        this.emit("defined", this.exports);
                        this.defineEmitComplete = true;
                    }
                }
            },
            callPlugin: function() {
                var a = this.map, b = a.id, //Map already normalized the prefix.
                c = v(a.prefix);
                //Mark this as a dependency for this plugin, so it
                //can be traced for cycles.
                this.depMaps.push(c);
                x(c, "defined", bind(this, function(c) {
                    var e, f, i, j = getOwn(n, this.map.id), k = this.map.name, l = this.map.parentMap ? this.map.parentMap.name : null, m = d.makeRequire(a.parentMap, {
                        enableBuildCallback: true
                    });
                    //If current map is not normalized, wait for that
                    //normalized name to load instead of continuing.
                    if (this.map.unnormalized) {
                        //Normalize the ID if the plugin allows it.
                        if (c.normalize) {
                            k = c.normalize(k, function(a) {
                                return r(a, l, true);
                            }) || "";
                        }
                        //prefix and name should already be normalized, no need
                        //for applying map config again either.
                        f = v(a.prefix + "!" + k, this.map.parentMap);
                        x(f, "defined", bind(this, function(a) {
                            this.init([], function() {
                                return a;
                            }, null, {
                                enabled: true,
                                ignore: true
                            });
                        }));
                        i = getOwn(h, f.id);
                        if (i) {
                            //Mark this as a dependency for this plugin, so it
                            //can be traced for cycles.
                            this.depMaps.push(f);
                            if (this.events.error) {
                                i.on("error", bind(this, function(a) {
                                    this.emit("error", a);
                                }));
                            }
                            i.enable();
                        }
                        return;
                    }
                    //If a paths config, then just load that file instead to
                    //resolve the plugin, as it is built into that paths layer.
                    if (j) {
                        this.map.url = d.nameToUrl(j);
                        this.load();
                        return;
                    }
                    e = bind(this, function(a) {
                        this.init([], function() {
                            return a;
                        }, null, {
                            enabled: true
                        });
                    });
                    e.error = bind(this, function(a) {
                        this.inited = true;
                        this.error = a;
                        a.requireModules = [ b ];
                        //Remove temp unnormalized modules for this module,
                        //since they will never be resolved otherwise now.
                        eachProp(h, function(a) {
                            if (a.map.id.indexOf(b + "_unnormalized") === 0) {
                                A(a.map.id);
                            }
                        });
                        y(a);
                    });
                    //Allow plugins to load other code without having to know the
                    //context or how to 'complete' the load.
                    e.fromText = bind(this, function(c, f) {
                        /*jslint evil: true */
                        var h = a.name, i = v(h), j = useInteractive;
                        //As of 2.1.0, support just passing the text, to reinforce
                        //fromText only being called once per resource. Still
                        //support old style of passing moduleName but discard
                        //that moduleName in favor of the internal ref.
                        if (f) {
                            c = f;
                        }
                        //Turn off interactive script matching for IE for any define
                        //calls in the text, then turn it back on at the end.
                        if (j) {
                            useInteractive = false;
                        }
                        //Prime the system by creating a module instance for
                        //it.
                        w(i);
                        //Transfer any config to this other module.
                        if (hasProp(g.config, b)) {
                            g.config[h] = g.config[b];
                        }
                        try {
                            req.exec(c);
                        } catch (k) {
                            return y(makeError("fromtexteval", "fromText eval for " + b + " failed: " + k, k, [ b ]));
                        }
                        if (j) {
                            useInteractive = true;
                        }
                        //Mark this as a dependency for the plugin
                        //resource
                        this.depMaps.push(i);
                        //Support anonymous modules.
                        d.completeLoad(h);
                        //Bind the value of that module to the value for this
                        //resource ID.
                        m([ h ], e);
                    });
                    //Use parentName here since the plugin's name is not reliable,
                    //could be some weird string with no path that actually wants to
                    //reference the parentName's path.
                    c.load(a.name, m, e, g);
                }));
                d.enable(c, this);
                this.pluginMaps[c.id] = c;
            },
            enable: function() {
                i[this.map.id] = this;
                this.enabled = true;
                //Set flag mentioning that the module is enabling,
                //so that immediate calls to the defined callbacks
                //for dependencies do not trigger inadvertent load
                //with the depCount still being zero.
                this.enabling = true;
                //Enable each dependency
                each(this.depMaps, bind(this, function(a, b) {
                    var c, f, g;
                    if (typeof a === "string") {
                        //Dependency needs to be converted to a depMap
                        //and wired up to this module.
                        a = v(a, this.map.isDefine ? this.map : this.map.parentMap, false, !this.skipMap);
                        this.depMaps[b] = a;
                        g = getOwn(e, a.id);
                        if (g) {
                            this.depExports[b] = g(this);
                            return;
                        }
                        this.depCount += 1;
                        x(a, "defined", bind(this, function(a) {
                            if (this.undefed) {
                                return;
                            }
                            this.defineDep(b, a);
                            this.check();
                        }));
                        if (this.errback) {
                            x(a, "error", bind(this, this.errback));
                        } else if (this.events.error) {
                            // No direct errback on this module, but something
                            // else is listening for errors, so be sure to
                            // propagate the error correctly.
                            x(a, "error", bind(this, function(a) {
                                this.emit("error", a);
                            }));
                        }
                    }
                    c = a.id;
                    f = h[c];
                    //Skip special modules like 'require', 'exports', 'module'
                    //Also, don't call enable if it is already enabled,
                    //important in circular dependency cases.
                    if (!hasProp(e, c) && f && !f.enabled) {
                        d.enable(a, this);
                    }
                }));
                //Enable each plugin that is used in
                //a dependency
                eachProp(this.pluginMaps, bind(this, function(a) {
                    var b = getOwn(h, a.id);
                    if (b && !b.enabled) {
                        d.enable(a, this);
                    }
                }));
                this.enabling = false;
                this.check();
            },
            on: function(a, b) {
                var c = this.events[a];
                if (!c) {
                    c = this.events[a] = [];
                }
                c.push(b);
            },
            emit: function(a, b) {
                each(this.events[a], function(a) {
                    a(b);
                });
                if (a === "error") {
                    //Now that the error handler was triggered, remove
                    //the listeners, since this broken Module instance
                    //can stay around for a while in the registry.
                    delete this.events[a];
                }
            }
        };
        function D(a) {
            //Skip modules already defined.
            if (!hasProp(l, a[0])) {
                w(v(a[0], null, true)).init(a[1], a[2]);
            }
        }
        function E(a, b, c, d) {
            //Favor detachEvent because of IE9
            //issue, see attachEvent/addEventListener comment elsewhere
            //in this file.
            if (a.detachEvent && !isOpera) {
                //Probably IE. If not it will throw an error, which will be
                //useful to know.
                if (d) {
                    a.detachEvent(d, b);
                }
            } else {
                a.removeEventListener(c, b, false);
            }
        }
        /**
         * Given an event from a script node, get the requirejs info from it,
         * and then removes the event listeners on the node.
         * @param {Event} evt
         * @returns {Object}
         */
        function F(a) {
            //Using currentTarget instead of target for Firefox 2.0's sake. Not
            //all old browsers will be supported, but this one was easy enough
            //to support and still makes sense.
            var b = a.currentTarget || a.srcElement;
            //Remove the listeners once here.
            E(b, d.onScriptLoad, "load", "onreadystatechange");
            E(b, d.onScriptError, "error");
            return {
                node: b,
                id: b && b.getAttribute("data-requiremodule")
            };
        }
        function G() {
            var a;
            //Any defined modules in the global queue, intake them now.
            z();
            //Make sure any remaining defQueue items get properly processed.
            while (k.length) {
                a = k.shift();
                if (a[0] === null) {
                    return y(makeError("mismatch", "Mismatched anonymous define() module: " + a[a.length - 1]));
                } else {
                    //args are id, deps, factory. Should be normalized by the
                    //define() function.
                    D(a);
                }
            }
        }
        d = {
            config: g,
            contextName: a,
            registry: h,
            defined: l,
            urlFetched: m,
            defQueue: k,
            Module: c,
            makeModuleMap: v,
            nextTick: req.nextTick,
            onError: y,
            /**
             * Set a configuration for the context.
             * @param {Object} cfg config object to integrate.
             */
            configure: function(a) {
                //Make sure the baseUrl ends in a slash.
                if (a.baseUrl) {
                    if (a.baseUrl.charAt(a.baseUrl.length - 1) !== "/") {
                        a.baseUrl += "/";
                    }
                }
                //Save off the paths since they require special processing,
                //they are additive.
                var b = g.shim, c = {
                    paths: true,
                    bundles: true,
                    config: true,
                    map: true
                };
                eachProp(a, function(a, b) {
                    if (c[b]) {
                        if (!g[b]) {
                            g[b] = {};
                        }
                        mixin(g[b], a, true, true);
                    } else {
                        g[b] = a;
                    }
                });
                //Reverse map the bundles
                if (a.bundles) {
                    eachProp(a.bundles, function(a, b) {
                        each(a, function(a) {
                            if (a !== b) {
                                n[a] = b;
                            }
                        });
                    });
                }
                //Merge shim
                if (a.shim) {
                    eachProp(a.shim, function(a, c) {
                        //Normalize the structure
                        if (isArray(a)) {
                            a = {
                                deps: a
                            };
                        }
                        if ((a.exports || a.init) && !a.exportsFn) {
                            a.exportsFn = d.makeShimExports(a);
                        }
                        b[c] = a;
                    });
                    g.shim = b;
                }
                //Adjust packages if necessary.
                if (a.packages) {
                    each(a.packages, function(a) {
                        var b, c;
                        a = typeof a === "string" ? {
                            name: a
                        } : a;
                        c = a.name;
                        b = a.location;
                        if (b) {
                            g.paths[c] = a.location;
                        }
                        //Save pointer to main module ID for pkg name.
                        //Remove leading dot in main, so main paths are normalized,
                        //and remove any trailing .js, since different package
                        //envs have different conventions: some use a module name,
                        //some use a file name.
                        g.pkgs[c] = a.name + "/" + (a.main || "main").replace(currDirRegExp, "").replace(jsSuffixRegExp, "");
                    });
                }
                //If there are any "waiting to execute" modules in the registry,
                //update the maps for them, since their info, like URLs to load,
                //may have changed.
                eachProp(h, function(a, b) {
                    //If module already has init called, since it is too
                    //late to modify them, and ignore unnormalized ones
                    //since they are transient.
                    if (!a.inited && !a.map.unnormalized) {
                        a.map = v(b, null, true);
                    }
                });
                //If a deps array or a config callback is specified, then call
                //require with those args. This is useful when require is defined as a
                //config object before require.js is loaded.
                if (a.deps || a.callback) {
                    d.require(a.deps || [], a.callback);
                }
            },
            makeShimExports: function(a) {
                function b() {
                    var b;
                    if (a.init) {
                        b = a.init.apply(global, arguments);
                    }
                    return b || a.exports && getGlobal(a.exports);
                }
                return b;
            },
            makeRequire: function(b, c) {
                c = c || {};
                function f(g, i, j) {
                    var k, m, n;
                    if (c.enableBuildCallback && i && isFunction(i)) {
                        i.__requireJsBuild = true;
                    }
                    if (typeof g === "string") {
                        if (isFunction(i)) {
                            //Invalid call
                            return y(makeError("requireargs", "Invalid require call"), j);
                        }
                        //If require|exports|module are requested, get the
                        //value for them from the special handlers. Caveat:
                        //this only works while module is being defined.
                        if (b && hasProp(e, g)) {
                            return e[g](h[b.id]);
                        }
                        //Synchronous access to one module. If require.get is
                        //available (as in the Node adapter), prefer that.
                        if (req.get) {
                            return req.get(d, g, b, f);
                        }
                        //Normalize module name, if it contains . or ..
                        m = v(g, b, false, true);
                        k = m.id;
                        if (!hasProp(l, k)) {
                            return y(makeError("notloaded", 'Module name "' + k + '" has not been loaded yet for context: ' + a + (b ? "" : ". Use require([])")));
                        }
                        return l[k];
                    }
                    //Grab defines waiting in the global queue.
                    G();
                    //Mark all the dependencies as needing to be loaded.
                    d.nextTick(function() {
                        //Some defines could have been added since the
                        //require call, collect them.
                        G();
                        n = w(v(null, b));
                        //Store if map config should be applied to this require
                        //call for dependencies.
                        n.skipMap = c.skipMap;
                        n.init(g, i, j, {
                            enabled: true
                        });
                        C();
                    });
                    return f;
                }
                mixin(f, {
                    isBrowser: isBrowser,
                    /**
                     * Converts a module name + .extension into an URL path.
                     * *Requires* the use of a module name. It does not support using
                     * plain URLs like nameToUrl.
                     */
                    toUrl: function(a) {
                        var c, e = a.lastIndexOf("."), f = a.split("/")[0], g = f === "." || f === "..";
                        //Have a file extension alias, and it is not the
                        //dots from a relative path.
                        if (e !== -1 && (!g || e > 1)) {
                            c = a.substring(e, a.length);
                            a = a.substring(0, e);
                        }
                        return d.nameToUrl(r(a, b && b.id, true), c, true);
                    },
                    defined: function(a) {
                        return hasProp(l, v(a, b, false, true).id);
                    },
                    specified: function(a) {
                        a = v(a, b, false, true).id;
                        return hasProp(l, a) || hasProp(h, a);
                    }
                });
                //Only allow undef on top level require calls
                if (!b) {
                    f.undef = function(a) {
                        //Bind any waiting define() calls to this context,
                        //fix for #408
                        z();
                        var c = v(a, b, true), d = getOwn(h, a);
                        d.undefed = true;
                        s(a);
                        delete l[a];
                        delete m[c.url];
                        delete j[a];
                        //Clean queued defines too. Go backwards
                        //in array so that the splices do not
                        //mess up the iteration.
                        eachReverse(k, function(b, c) {
                            if (b[0] === a) {
                                k.splice(c, 1);
                            }
                        });
                        if (d) {
                            //Hold on to listeners in case the
                            //module will be attempted to be reloaded
                            //using a different config.
                            if (d.events.defined) {
                                j[a] = d.events;
                            }
                            A(a);
                        }
                    };
                }
                return f;
            },
            /**
             * Called to enable a module if it is still in the registry
             * awaiting enablement. A second arg, parent, the parent module,
             * is passed in for context, when this method is overridden by
             * the optimizer. Not shown here to keep code compact.
             */
            enable: function(a) {
                var b = getOwn(h, a.id);
                if (b) {
                    w(a).enable();
                }
            },
            /**
             * Internal method used by environment adapters to complete a load event.
             * A load event could be a script load or just a load pass from a synchronous
             * load call.
             * @param {String} moduleName the name of the module to potentially complete.
             */
            completeLoad: function(a) {
                var b, c, d, e = getOwn(g.shim, a) || {}, f = e.exports;
                z();
                while (k.length) {
                    c = k.shift();
                    if (c[0] === null) {
                        c[0] = a;
                        //If already found an anonymous module and bound it
                        //to this name, then this is some other anon module
                        //waiting for its completeLoad to fire.
                        if (b) {
                            break;
                        }
                        b = true;
                    } else if (c[0] === a) {
                        //Found matching define call for this script!
                        b = true;
                    }
                    D(c);
                }
                //Do this after the cycle of callGetModule in case the result
                //of those calls/init calls changes the registry.
                d = getOwn(h, a);
                if (!b && !hasProp(l, a) && d && !d.inited) {
                    if (g.enforceDefine && (!f || !getGlobal(f))) {
                        if (t(a)) {
                            return;
                        } else {
                            return y(makeError("nodefine", "No define call for " + a, null, [ a ]));
                        }
                    } else {
                        //A script that does not call define(), so just simulate
                        //the call for it.
                        D([ a, e.deps || [], e.exportsFn ]);
                    }
                }
                C();
            },
            /**
             * Converts a module name to a file path. Supports cases where
             * moduleName may actually be just an URL.
             * Note that it **does not** call normalize on the moduleName,
             * it is assumed to have already been normalized. This is an
             * internal API, not a public one. Use toUrl for the public API.
             */
            nameToUrl: function(a, b, c) {
                var e, f, h, i, j, k, l, m = getOwn(g.pkgs, a);
                if (m) {
                    a = m;
                }
                l = getOwn(n, a);
                if (l) {
                    return d.nameToUrl(l, b, c);
                }
                //If a colon is in the URL, it indicates a protocol is used and it is just
                //an URL to a file, or if it starts with a slash, contains a query arg (i.e. ?)
                //or ends with .js, then assume the user meant to use an url and not a module id.
                //The slash is important for protocol-less URLs as well as full paths.
                if (req.jsExtRegExp.test(a)) {
                    //Just a plain path, not module name lookup, so just return it.
                    //Add extension if it is included. This is a bit wonky, only non-.js things pass
                    //an extension, this method probably needs to be reworked.
                    j = a + (b || "");
                } else {
                    //A module that needs to be converted to a path.
                    e = g.paths;
                    f = a.split("/");
                    //For each module name segment, see if there is a path
                    //registered for it. Start with most specific name
                    //and work up from it.
                    for (h = f.length; h > 0; h -= 1) {
                        i = f.slice(0, h).join("/");
                        k = getOwn(e, i);
                        if (k) {
                            //If an array, it means there are a few choices,
                            //Choose the one that is desired
                            if (isArray(k)) {
                                k = k[0];
                            }
                            f.splice(0, h, k);
                            break;
                        }
                    }
                    //Join the path parts together, then figure out if baseUrl is needed.
                    j = f.join("/");
                    j += b || (/^data\:|\?/.test(j) || c ? "" : ".js");
                    j = (j.charAt(0) === "/" || j.match(/^[\w\+\.\-]+:/) ? "" : g.baseUrl) + j;
                }
                return g.urlArgs ? j + ((j.indexOf("?") === -1 ? "?" : "&") + g.urlArgs) : j;
            },
            //Delegates to req.load. Broken out as a separate function to
            //allow overriding in the optimizer.
            load: function(a, b) {
                req.load(d, a, b);
            },
            /**
             * Executes a module callback function. Broken out as a separate function
             * solely to allow the build system to sequence the files in the built
             * layer in the right sequence.
             *
             * @private
             */
            execCb: function(a, b, c, d) {
                return b.apply(d, c);
            },
            /**
             * callback for script loads, used to check status of loading.
             *
             * @param {Event} evt the event from the browser for the script
             * that was loaded.
             */
            onScriptLoad: function(a) {
                //Using currentTarget instead of target for Firefox 2.0's sake. Not
                //all old browsers will be supported, but this one was easy enough
                //to support and still makes sense.
                if (a.type === "load" || readyRegExp.test((a.currentTarget || a.srcElement).readyState)) {
                    //Reset interactive script so a script node is not held onto for
                    //to long.
                    interactiveScript = null;
                    //Pull out the name of the module and the context.
                    var b = F(a);
                    d.completeLoad(b.id);
                }
            },
            /**
             * Callback for script errors.
             */
            onScriptError: function(a) {
                var b = F(a);
                if (!t(b.id)) {
                    return y(makeError("scripterror", "Script error for: " + b.id, a, [ b.id ]));
                }
            }
        };
        d.require = d.makeRequire();
        return d;
    }
    /**
     * Main entry point.
     *
     * If the only argument to require is a string, then the module that
     * is represented by that string is fetched for the appropriate context.
     *
     * If the first argument is an array, then it will be treated as an array
     * of dependency string names to fetch. An optional function callback can
     * be specified to execute when all of those dependencies are available.
     *
     * Make a local req variable to help Caja compliance (it assumes things
     * on a require that are not standardized), and to give a short
     * name for minification/local scope use.
     */
    req = requirejs = function(a, b, c, d) {
        //Find the right context, use default
        var e, f, g = defContextName;
        // Determine if have config object in the call.
        if (!isArray(a) && typeof a !== "string") {
            // deps is a config object
            f = a;
            if (isArray(b)) {
                // Adjust args if there are dependencies
                a = b;
                b = c;
                c = d;
            } else {
                a = [];
            }
        }
        if (f && f.context) {
            g = f.context;
        }
        e = getOwn(contexts, g);
        if (!e) {
            e = contexts[g] = req.s.newContext(g);
        }
        if (f) {
            e.configure(f);
        }
        return e.require(a, b, c);
    };
    /**
     * Support require.config() to make it easier to cooperate with other
     * AMD loaders on globally agreed names.
     */
    req.config = function(a) {
        return req(a);
    };
    /**
     * Execute something after the current tick
     * of the event loop. Override for other envs
     * that have a better solution than setTimeout.
     * @param  {Function} fn function to execute later.
     */
    req.nextTick = typeof setTimeout !== "undefined" ? function(a) {
        setTimeout(a, 4);
    } : function(a) {
        a();
    };
    /**
     * Export require as a global, but only if it does not already exist.
     */
    if (!require) {
        require = req;
    }
    req.version = version;
    //Used to filter out dependencies that are already paths.
    req.jsExtRegExp = /^\/|:|\?|\.js$/;
    req.isBrowser = isBrowser;
    s = req.s = {
        contexts: contexts,
        newContext: newContext
    };
    //Create default context.
    req({});
    //Exports some context-sensitive methods on global require.
    each([ "toUrl", "undef", "defined", "specified" ], function(a) {
        //Reference from contexts instead of early binding to default context,
        //so that during builds, the latest instance of the default context
        //with its config gets used.
        req[a] = function() {
            var b = contexts[defContextName];
            return b.require[a].apply(b, arguments);
        };
    });
    if (isBrowser) {
        head = s.head = document.getElementsByTagName("head")[0];
        //If BASE tag is in play, using appendChild is a problem for IE6.
        //When that browser dies, this can be removed. Details in this jQuery bug:
        //http://dev.jquery.com/ticket/2709
        baseElement = document.getElementsByTagName("base")[0];
        if (baseElement) {
            head = s.head = baseElement.parentNode;
        }
    }
    /**
     * Any errors that require explicitly generates will be passed to this
     * function. Intercept/override it if you want custom error handling.
     * @param {Error} err the error object.
     */
    req.onError = defaultOnError;
    /**
     * Creates the node for the load command. Only used in browser envs.
     */
    req.createNode = function(a, b, c) {
        var d = a.xhtml ? document.createElementNS("http://www.w3.org/1999/xhtml", "html:script") : document.createElement("script");
        d.type = a.scriptType || "text/javascript";
        d.charset = "utf-8";
        d.async = true;
        return d;
    };
    /**
     * Does the request to load a module for the browser case.
     * Make this a separate function to allow other environments
     * to override it.
     *
     * @param {Object} context the require context to find state.
     * @param {String} moduleName the name of the module.
     * @param {Object} url the URL to the module.
     */
    req.load = function(a, b, c) {
        var d = a && a.config || {}, e;
        if (isBrowser) {
            //In the browser so use a script tag
            e = req.createNode(d, b, c);
            e.setAttribute("data-requirecontext", a.contextName);
            e.setAttribute("data-requiremodule", b);
            //Set up load listener. Test attachEvent first because IE9 has
            //a subtle issue in its addEventListener and script onload firings
            //that do not match the behavior of all other browsers with
            //addEventListener support, which fire the onload event for a
            //script right after the script execution. See:
            //https://connect.microsoft.com/IE/feedback/details/648057/script-onload-event-is-not-fired-immediately-after-script-execution
            //UNFORTUNATELY Opera implements attachEvent but does not follow the script
            //script execution mode.
            if (e.attachEvent && //Check if node.attachEvent is artificially added by custom script or
            //natively supported by browser
            //read https://github.com/jrburke/requirejs/issues/187
            //if we can NOT find [native code] then it must NOT natively supported.
            //in IE8, node.attachEvent does not have toString()
            //Note the test for "[native code" with no closing brace, see:
            //https://github.com/jrburke/requirejs/issues/273
            !(e.attachEvent.toString && e.attachEvent.toString().indexOf("[native code") < 0) && !isOpera) {
                //Probably IE. IE (at least 6-8) do not fire
                //script onload right after executing the script, so
                //we cannot tie the anonymous define call to a name.
                //However, IE reports the script as being in 'interactive'
                //readyState at the time of the define call.
                useInteractive = true;
                e.attachEvent("onreadystatechange", a.onScriptLoad);
            } else {
                e.addEventListener("load", a.onScriptLoad, false);
                e.addEventListener("error", a.onScriptError, false);
            }
            e.src = c;
            //For some cache cases in IE 6-8, the script executes before the end
            //of the appendChild execution, so to tie an anonymous define
            //call to the module name (which is stored on the node), hold on
            //to a reference to this node, but clear after the DOM insertion.
            currentlyAddingScript = e;
            if (baseElement) {
                head.insertBefore(e, baseElement);
            } else {
                head.appendChild(e);
            }
            currentlyAddingScript = null;
            return e;
        } else if (isWebWorker) {
            try {
                //In a web worker, use importScripts. This is not a very
                //efficient use of importScripts, importScripts will block until
                //its script is downloaded and evaluated. However, if web workers
                //are in play, the expectation that a build has been done so that
                //only one script needs to be loaded anyway. This may need to be
                //reevaluated if other use cases become common.
                importScripts(c);
                //Account for anonymous modules
                a.completeLoad(b);
            } catch (f) {
                a.onError(makeError("importscripts", "importScripts failed for " + b + " at " + c, f, [ b ]));
            }
        }
    };
    function getInteractiveScript() {
        if (interactiveScript && interactiveScript.readyState === "interactive") {
            return interactiveScript;
        }
        eachReverse(scripts(), function(a) {
            if (a.readyState === "interactive") {
                return interactiveScript = a;
            }
        });
        return interactiveScript;
    }
    //Look for a data-main script attribute, which could also adjust the baseUrl.
    if (isBrowser && !cfg.skipDataMain) {
        //Figure out baseUrl. Get it from the script tag with require.js in it.
        eachReverse(scripts(), function(a) {
            //Set the 'head' where we can append children by
            //using the script's parent.
            if (!head) {
                head = a.parentNode;
            }
            //Look for a data-main attribute to set main script for the page
            //to load. If it is there, the path to data main becomes the
            //baseUrl, if it is not already set.
            dataMain = a.getAttribute("data-main");
            if (dataMain) {
                //Preserve dataMain in case it is a path (i.e. contains '?')
                mainScript = dataMain;
                //Set final baseUrl if there is not already an explicit one.
                if (!cfg.baseUrl) {
                    //Pull off the directory of data-main for use as the
                    //baseUrl.
                    src = mainScript.split("/");
                    mainScript = src.pop();
                    subPath = src.length ? src.join("/") + "/" : "./";
                    cfg.baseUrl = subPath;
                }
                //Strip off any trailing .js since mainScript is now
                //like a module name.
                mainScript = mainScript.replace(jsSuffixRegExp, "");
                //If mainScript is still a path, fall back to dataMain
                if (req.jsExtRegExp.test(mainScript)) {
                    mainScript = dataMain;
                }
                //Put the data-main script in the files to load.
                cfg.deps = cfg.deps ? cfg.deps.concat(mainScript) : [ mainScript ];
                return true;
            }
        });
    }
    /**
     * The function that handles definitions of modules. Differs from
     * require() in that a string for the module should be the first argument,
     * and the function to execute after dependencies are loaded should
     * return a value to define the module corresponding to the first argument's
     * name.
     */
    define = function(a, b, c) {
        var d, e;
        //Allow for anonymous modules
        if (typeof a !== "string") {
            //Adjust args appropriately
            c = b;
            b = a;
            a = null;
        }
        //This module may not have dependencies
        if (!isArray(b)) {
            c = b;
            b = null;
        }
        //If no name, and callback is a function, then figure out if it a
        //CommonJS thing with dependencies.
        if (!b && isFunction(c)) {
            b = [];
            //Remove comments from the callback string,
            //look for require calls, and pull them into the dependencies,
            //but only if there are function args.
            if (c.length) {
                c.toString().replace(commentRegExp, "").replace(cjsRequireRegExp, function(a, c) {
                    b.push(c);
                });
                //May be a CommonJS thing even without require calls, but still
                //could use exports, and module. Avoid doing exports and module
                //work though if it just needs require.
                //REQUIRES the function to expect the CommonJS variables in the
                //order listed below.
                b = (c.length === 1 ? [ "require" ] : [ "require", "exports", "module" ]).concat(b);
            }
        }
        //If in IE 6-8 and hit an anonymous define() call, do the interactive
        //work.
        if (useInteractive) {
            d = currentlyAddingScript || getInteractiveScript();
            if (d) {
                if (!a) {
                    a = d.getAttribute("data-requiremodule");
                }
                e = contexts[d.getAttribute("data-requirecontext")];
            }
        }
        //Always save off evaluating the def call until the script onload handler.
        //This allows multiple modules to be in a file without prematurely
        //tracing dependencies, and allows for anonymous module support,
        //where the module name is not known until the script onload event
        //occurs. If no context, use the global queue, and get it processed
        //in the onscript load callback.
        (e ? e.defQueue : globalDefQueue).push([ a, b, c ]);
    };
    define.amd = {
        jQuery: true
    };
    /**
     * Executes the text. Normally just uses eval, but can be modified
     * to use a better, environment-specific call. Only used for transpiling
     * loader plugins, not for plain JS modules.
     * @param {String} text the text to execute/evaluate.
     */
    req.exec = function(text) {
        /*jslint evil: true */
        return eval(text);
    };
    //Set up with config info.
    req(cfg);
})(this); 
 ; /* MooTools: the javascript framework. license: MIT-style license. copyright: Copyright (c) 2006-2015 [Valerio Proietti](http://mad4milk.net/).*/ 
!function(){this.MooTools={version:"1.5.1",build:"0542c135fdeb7feed7d9917e01447a408f22c876"};var t=this.typeOf=function(t){if(null==t)return"null";if(null!=t.$family)return t.$family();if(t.nodeName){if(1==t.nodeType)return"element";if(3==t.nodeType)return/\S/.test(t.nodeValue)?"textnode":"whitespace"}else if("number"==typeof t.length){if("callee"in t)return"arguments";if("item"in t)return"collection"}return typeof t},n=this.instanceOf=function(t,n){if(null==t)return!1;for(var e=t.$constructor||t.constructor;e;){if(e===n)return!0;e=e.parent}return t.hasOwnProperty?t instanceof n:!1},e=this.Function,r=!0;for(var i in{toString:1})r=null;r&&(r=["hasOwnProperty","valueOf","isPrototypeOf","propertyIsEnumerable","toLocaleString","toString","constructor"]),e.prototype.overloadSetter=function(t){var n=this;return function(e,i){if(null==e)return this;if(t||"string"!=typeof e){for(var o in e)n.call(this,o,e[o]);if(r)for(var a=r.length;a--;)o=r[a],e.hasOwnProperty(o)&&n.call(this,o,e[o])}else n.call(this,e,i);return this}},e.prototype.overloadGetter=function(t){var n=this;return function(e){var r,i;if("string"!=typeof e?r=e:arguments.length>1?r=arguments:t&&(r=[e]),r){i={};for(var o=0;o<r.length;o++)i[r[o]]=n.call(this,r[o])}else i=n.call(this,e);return i}},e.prototype.extend=function(t,n){this[t]=n}.overloadSetter(),e.prototype.implement=function(t,n){this.prototype[t]=n}.overloadSetter();var o=Array.prototype.slice;e.from=function(n){return"function"==t(n)?n:function(){return n}},Array.from=function(n){return null==n?[]:a.isEnumerable(n)&&"string"!=typeof n?"array"==t(n)?n:o.call(n):[n]},Number.from=function(t){var n=parseFloat(t);return isFinite(n)?n:null},String.from=function(t){return t+""},e.implement({hide:function(){return this.$hidden=!0,this},protect:function(){return this.$protected=!0,this}});var a=this.Type=function(n,e){if(n){var r=n.toLowerCase(),i=function(n){return t(n)==r};a["is"+n]=i,null!=e&&(e.prototype.$family=function(){return r}.hide(),e.type=i)}return null==e?null:(e.extend(this),e.$constructor=a,e.prototype.$constructor=e,e)},s=Object.prototype.toString;a.isEnumerable=function(t){return null!=t&&"number"==typeof t.length&&"[object Function]"!=s.call(t)};var u={},c=function(n){var e=t(n.prototype);return u[e]||(u[e]=[])},h=function(n,e){if(!e||!e.$hidden){for(var r=c(this),i=0;i<r.length;i++){var a=r[i];"type"==t(a)?h.call(a,n,e):a.call(this,n,e)}var s=this.prototype[n];null!=s&&s.$protected||(this.prototype[n]=e),null==this[n]&&"function"==t(e)&&l.call(this,n,function(t){return e.apply(t,o.call(arguments,1))})}},l=function(t,n){if(!n||!n.$hidden){var e=this[t];null!=e&&e.$protected||(this[t]=n)}};a.implement({implement:h.overloadSetter(),extend:l.overloadSetter(),alias:function(t,n){h.call(this,t,this.prototype[n])}.overloadSetter(),mirror:function(t){return c(this).push(t),this}}),new a("Type",a);var f=function(t,n,e){var r=n!=Object,i=n.prototype;r&&(n=new a(t,n));for(var o=0,s=e.length;s>o;o++){var u=e[o],c=n[u],h=i[u];c&&c.protect(),r&&h&&n.implement(u,h.protect())}if(r){var l=i.propertyIsEnumerable(e[0]);n.forEachMethod=function(t){if(!l)for(var n=0,r=e.length;r>n;n++)t.call(i,i[e[n]],e[n]);for(var o in i)t.call(i,i[o],o)}}return f};f("String",String,["charAt","charCodeAt","concat","contains","indexOf","lastIndexOf","match","quote","replace","search","slice","split","substr","substring","trim","toLowerCase","toUpperCase"])("Array",Array,["pop","push","reverse","shift","sort","splice","unshift","concat","join","slice","indexOf","lastIndexOf","filter","forEach","every","map","some","reduce","reduceRight"])("Number",Number,["toExponential","toFixed","toLocaleString","toPrecision"])("Function",e,["apply","call","bind"])("RegExp",RegExp,["exec","test"])("Object",Object,["create","defineProperty","defineProperties","keys","getPrototypeOf","getOwnPropertyDescriptor","getOwnPropertyNames","preventExtensions","isExtensible","seal","isSealed","freeze","isFrozen"])("Date",Date,["now"]),Object.extend=l.overloadSetter(),Date.extend("now",function(){return+new Date}),new a("Boolean",Boolean),Number.prototype.$family=function(){return isFinite(this)?"number":"null"}.hide(),Number.extend("random",function(t,n){return Math.floor(Math.random()*(n-t+1)+t)});var p=Object.prototype.hasOwnProperty;Object.extend("forEach",function(t,n,e){for(var r in t)p.call(t,r)&&n.call(e,t[r],r,t)}),Object.each=Object.forEach,Array.implement({forEach:function(t,n){for(var e=0,r=this.length;r>e;e++)e in this&&t.call(n,this[e],e,this)},each:function(t,n){return Array.forEach(this,t,n),this}});var m=function(n){switch(t(n)){case"array":return n.clone();case"object":return Object.clone(n);default:return n}};Array.implement("clone",function(){for(var t=this.length,n=new Array(t);t--;)n[t]=m(this[t]);return n});var v=function(n,e,r){switch(t(r)){case"object":"object"==t(n[e])?Object.merge(n[e],r):n[e]=Object.clone(r);break;case"array":n[e]=r.clone();break;default:n[e]=r}return n};Object.extend({merge:function(n,e,r){if("string"==t(e))return v(n,e,r);for(var i=1,o=arguments.length;o>i;i++){var a=arguments[i];for(var s in a)v(n,s,a[s])}return n},clone:function(t){var n={};for(var e in t)n[e]=m(t[e]);return n},append:function(t){for(var n=1,e=arguments.length;e>n;n++){var r=arguments[n]||{};for(var i in r)t[i]=r[i]}return t}}),["Object","WhiteSpace","TextNode","Collection","Arguments"].each(function(t){new a(t)});var d=Date.now();String.extend("uniqueID",function(){return(d++).toString(36)});var y=this.Hash=new a("Hash",function(n){"hash"==t(n)&&(n=Object.clone(n.getClean()));for(var e in n)this[e]=n[e];return this});y.implement({forEach:function(t,n){Object.forEach(this,t,n)},getClean:function(){var t={};for(var n in this)this.hasOwnProperty(n)&&(t[n]=this[n]);return t},getLength:function(){var t=0;for(var n in this)this.hasOwnProperty(n)&&t++;return t}}),y.alias("each","forEach"),Object.type=a.isObject;var g=this.Native=function(t){return new a(t.name,t.initialize)};g.type=a.type,g.implement=function(t,n){for(var e=0;e<t.length;e++)t[e].implement(n);return g};var b=Array.type;Array.type=function(t){return n(t,Array)||b(t)},this.$A=function(t){return Array.from(t).slice()},this.$arguments=function(t){return function(){return arguments[t]}},this.$chk=function(t){return!(!t&&0!==t)},this.$clear=function(t){return clearTimeout(t),clearInterval(t),null},this.$defined=function(t){return null!=t},this.$each=function(n,e,r){var i=t(n);("arguments"==i||"collection"==i||"array"==i||"elements"==i?Array:Object).each(n,e,r)},this.$empty=function(){},this.$extend=function(t,n){return Object.append(t,n)},this.$H=function(t){return new y(t)},this.$merge=function(){var t=Array.slice(arguments);return t.unshift({}),Object.merge.apply(null,t)},this.$lambda=e.from,this.$mixin=Object.merge,this.$random=Number.random,this.$splat=Array.from,this.$time=Date.now,this.$type=function(n){var e=t(n);return"elements"==e?"array":"null"==e?!1:e},this.$unlink=function(n){switch(t(n)){case"object":return Object.clone(n);case"array":return Array.clone(n);case"hash":return new y(n);default:return n}}}(),Array.implement({every:function(t,n){for(var e=0,r=this.length>>>0;r>e;e++)if(e in this&&!t.call(n,this[e],e,this))return!1;return!0},filter:function(t,n){for(var e,r=[],i=0,o=this.length>>>0;o>i;i++)i in this&&(e=this[i],t.call(n,e,i,this)&&r.push(e));return r},indexOf:function(t,n){for(var e=this.length>>>0,r=0>n?Math.max(0,e+n):n||0;e>r;r++)if(this[r]===t)return r;return-1},map:function(t,n){for(var e=this.length>>>0,r=Array(e),i=0;e>i;i++)i in this&&(r[i]=t.call(n,this[i],i,this));return r},some:function(t,n){for(var e=0,r=this.length>>>0;r>e;e++)if(e in this&&t.call(n,this[e],e,this))return!0;return!1},clean:function(){return this.filter(function(t){return null!=t})},invoke:function(t){var n=Array.slice(arguments,1);return this.map(function(e){return e[t].apply(e,n)})},associate:function(t){for(var n={},e=Math.min(this.length,t.length),r=0;e>r;r++)n[t[r]]=this[r];return n},link:function(t){for(var n={},e=0,r=this.length;r>e;e++)for(var i in t)if(t[i](this[e])){n[i]=this[e],delete t[i];break}return n},contains:function(t,n){return-1!=this.indexOf(t,n)},append:function(t){return this.push.apply(this,t),this},getLast:function(){return this.length?this[this.length-1]:null},getRandom:function(){return this.length?this[Number.random(0,this.length-1)]:null},include:function(t){return this.contains(t)||this.push(t),this},combine:function(t){for(var n=0,e=t.length;e>n;n++)this.include(t[n]);return this},erase:function(t){for(var n=this.length;n--;)this[n]===t&&this.splice(n,1);return this},empty:function(){return this.length=0,this},flatten:function(){for(var t=[],n=0,e=this.length;e>n;n++){var r=typeOf(this[n]);"null"!=r&&(t=t.concat("array"==r||"collection"==r||"arguments"==r||instanceOf(this[n],Array)?Array.flatten(this[n]):this[n]))}return t},pick:function(){for(var t=0,n=this.length;n>t;t++)if(null!=this[t])return this[t];return null},hexToRgb:function(t){if(3!=this.length)return null;var n=this.map(function(t){return 1==t.length&&(t+=t),parseInt(t,16)});return t?n:"rgb("+n+")"},rgbToHex:function(t){if(this.length<3)return null;if(4==this.length&&0==this[3]&&!t)return"transparent";for(var n=[],e=0;3>e;e++){var r=(this[e]-0).toString(16);n.push(1==r.length?"0"+r:r)}return t?n:"#"+n.join("")}}),Array.alias("extend","append");var $pick=function(){return Array.from(arguments).pick()};Function.extend({attempt:function(){for(var t=0,n=arguments.length;n>t;t++)try{return arguments[t]()}catch(e){}return null}}),Function.implement({attempt:function(t,n){try{return this.apply(n,Array.from(t))}catch(e){}return null},bind:function(t){var n=this,e=arguments.length>1?Array.slice(arguments,1):null,r=function(){},i=function(){var o=t,a=arguments.length;this instanceof i&&(r.prototype=n.prototype,o=new r);var s=e||a?n.apply(o,e&&a?e.concat(Array.slice(arguments)):e||arguments):n.call(o);return o==t?s:o};return i},pass:function(t,n){var e=this;return null!=t&&(t=Array.from(t)),function(){return e.apply(n,t||arguments)}},delay:function(t,n,e){return setTimeout(this.pass(null==e?[]:e,n),t)},periodical:function(t,n,e){return setInterval(this.pass(null==e?[]:e,n),t)}}),delete Function.prototype.bind,Function.implement({create:function(t){var n=this;return t=t||{},function(e){var r=t.arguments;r=null!=r?Array.from(r):Array.slice(arguments,t.event?1:0),t.event&&(r=[e||window.event].extend(r));var i=function(){return n.apply(t.bind||null,r)};return t.delay?setTimeout(i,t.delay):t.periodical?setInterval(i,t.periodical):t.attempt?Function.attempt(i):i()}},bind:function(t,n){var e=this;return null!=n&&(n=Array.from(n)),function(){return e.apply(t,n||arguments)}},bindWithEvent:function(t,n){var e=this;return null!=n&&(n=Array.from(n)),function(r){return e.apply(t,null==n?arguments:[r].concat(n))}},run:function(t,n){return this.apply(n,Array.from(t))}}),Object.create==Function.prototype.create&&(Object.create=null);var $try=Function.attempt;Number.implement({limit:function(t,n){return Math.min(n,Math.max(t,this))},round:function(t){return t=Math.pow(10,t||0).toFixed(0>t?-t:0),Math.round(this*t)/t},times:function(t,n){for(var e=0;this>e;e++)t.call(n,e,this)},toFloat:function(){return parseFloat(this)},toInt:function(t){return parseInt(this,t||10)}}),Number.alias("each","times"),function(t){var n={};t.each(function(t){Number[t]||(n[t]=function(){return Math[t].apply(null,[this].concat(Array.from(arguments)))})}),Number.implement(n)}(["abs","acos","asin","atan","atan2","ceil","cos","exp","floor","log","max","min","pow","sin","sqrt","tan"]),String.implement({contains:function(t,n){return(n?String(this).slice(n):String(this)).indexOf(t)>-1},test:function(t,n){return("regexp"==typeOf(t)?t:new RegExp(""+t,n)).test(this)},trim:function(){return String(this).replace(/^\s+|\s+$/g,"")},clean:function(){return String(this).replace(/\s+/g," ").trim()},camelCase:function(){return String(this).replace(/-\D/g,function(t){return t.charAt(1).toUpperCase()})},hyphenate:function(){return String(this).replace(/[A-Z]/g,function(t){return"-"+t.charAt(0).toLowerCase()})},capitalize:function(){return String(this).replace(/\b[a-z]/g,function(t){return t.toUpperCase()})},escapeRegExp:function(){return String(this).replace(/([-.*+?^${}()|[\]\/\\])/g,"\\$1")},toInt:function(t){return parseInt(this,t||10)},toFloat:function(){return parseFloat(this)},hexToRgb:function(t){var n=String(this).match(/^#?(\w{1,2})(\w{1,2})(\w{1,2})$/);return n?n.slice(1).hexToRgb(t):null},rgbToHex:function(t){var n=String(this).match(/\d{1,3}/g);return n?n.rgbToHex(t):null},substitute:function(t,n){return String(this).replace(n||/\\?\{([^{}]+)\}/g,function(n,e){return"\\"==n.charAt(0)?n.slice(1):null!=t[e]?t[e]:""})}}),String.prototype.contains=function(t,n){return n?(n+this+n).indexOf(n+t+n)>-1:String(this).indexOf(t)>-1},function(){var t=this.Class=new Type("Class",function(r){instanceOf(r,Function)&&(r={initialize:r});var i=function(){if(e(this),i.$prototyping)return this;this.$caller=null;var t=this.initialize?this.initialize.apply(this,arguments):this;return this.$caller=this.caller=null,t}.extend(this).implement(r);return i.$constructor=t,i.prototype.$constructor=i,i.prototype.parent=n,i}),n=function(){if(!this.$caller)throw new Error('The method "parent" cannot be called.');var t=this.$caller.$name,n=this.$caller.$owner.parent,e=n?n.prototype[t]:null;if(!e)throw new Error('The method "'+t+'" has no parent.');return e.apply(this,arguments)},e=function(t){for(var n in t){var r=t[n];switch(typeOf(r)){case"object":var i=function(){};i.prototype=r,t[n]=e(new i);break;case"array":t[n]=r.clone()}}return t},r=function(t,n,e){e.$origin&&(e=e.$origin);var r=function(){if(e.$protected&&null==this.$caller)throw new Error('The method "'+n+'" cannot be called.');var t=this.caller,i=this.$caller;this.caller=i,this.$caller=r;var o=e.apply(this,arguments);return this.$caller=i,this.caller=t,o}.extend({$owner:t,$origin:e,$name:n});return r},i=function(n,e,i){if(t.Mutators.hasOwnProperty(n)&&(e=t.Mutators[n].call(this,e),null==e))return this;if("function"==typeOf(e)){if(e.$hidden)return this;this.prototype[n]=i?e:r(this,n,e)}else Object.merge(this.prototype,n,e);return this},o=function(t){t.$prototyping=!0;var n=new t;return delete t.$prototyping,n};t.implement("implement",i.overloadSetter()),t.Mutators={Extends:function(t){this.parent=t,this.prototype=o(t)},Implements:function(t){Array.from(t).each(function(t){var n=new t;for(var e in n)i.call(this,e,n[e],!0)},this)}}}(),function(){this.Chain=new Class({$chain:[],chain:function(){return this.$chain.append(Array.flatten(arguments)),this},callChain:function(){return this.$chain.length?this.$chain.shift().apply(this,arguments):!1},clearChain:function(){return this.$chain.empty(),this}});var t=function(t){return t.replace(/^on([A-Z])/,function(t,n){return n.toLowerCase()})};this.Events=new Class({$events:{},addEvent:function(n,e,r){return n=t(n),e==$empty?this:(this.$events[n]=(this.$events[n]||[]).include(e),r&&(e.internal=!0),this)},addEvents:function(t){for(var n in t)this.addEvent(n,t[n]);return this},fireEvent:function(n,e,r){n=t(n);var i=this.$events[n];return i?(e=Array.from(e),i.each(function(t){r?t.delay(r,this,e):t.apply(this,e)},this),this):this},removeEvent:function(n,e){n=t(n);var r=this.$events[n];if(r&&!e.internal){var i=r.indexOf(e);-1!=i&&delete r[i]}return this},removeEvents:function(n){var e;if("object"==typeOf(n)){for(e in n)this.removeEvent(e,n[e]);return this}n&&(n=t(n));for(e in this.$events)if(!n||n==e)for(var r=this.$events[e],i=r.length;i--;)i in r&&this.removeEvent(e,r[i]);return this}}),this.Options=new Class({setOptions:function(){var t=this.options=Object.merge.apply(null,[{},this.options].append(arguments));if(this.addEvent)for(var n in t)"function"==typeOf(t[n])&&/^on[A-Z]/.test(n)&&(this.addEvent(n,t[n]),delete t[n]);return this}})}(),function(){var t=Object.prototype.hasOwnProperty;Object.extend({subset:function(t,n){for(var e={},r=0,i=n.length;i>r;r++){var o=n[r];o in t&&(e[o]=t[o])}return e},map:function(n,e,r){var i={};for(var o in n)t.call(n,o)&&(i[o]=e.call(r,n[o],o,n));return i},filter:function(n,e,r){var i={};for(var o in n){var a=n[o];t.call(n,o)&&e.call(r,a,o,n)&&(i[o]=a)}return i},every:function(n,e,r){for(var i in n)if(t.call(n,i)&&!e.call(r,n[i],i))return!1;return!0},some:function(n,e,r){for(var i in n)if(t.call(n,i)&&e.call(r,n[i],i))return!0;return!1},keys:function(n){var e=[];for(var r in n)t.call(n,r)&&e.push(r);return e},values:function(n){var e=[];for(var r in n)t.call(n,r)&&e.push(n[r]);return e},getLength:function(t){return Object.keys(t).length},keyOf:function(n,e){for(var r in n)if(t.call(n,r)&&n[r]===e)return r;return null},contains:function(t,n){return null!=Object.keyOf(t,n)},toQueryString:function(t,n){var e=[];return Object.each(t,function(t,r){n&&(r=n+"["+r+"]");var i;switch(typeOf(t)){case"object":i=Object.toQueryString(t,r);break;case"array":var o={};t.each(function(t,n){o[n]=t}),i=Object.toQueryString(o,r);break;default:i=r+"="+encodeURIComponent(t)}null!=t&&e.push(i)}),e.join("&")}})}(),Hash.implement({has:Object.prototype.hasOwnProperty,keyOf:function(t){return Object.keyOf(this,t)},hasValue:function(t){return Object.contains(this,t)},extend:function(t){return Hash.each(t||{},function(t,n){Hash.set(this,n,t)},this),this},combine:function(t){return Hash.each(t||{},function(t,n){Hash.include(this,n,t)},this),this},erase:function(t){return this.hasOwnProperty(t)&&delete this[t],this},get:function(t){return this.hasOwnProperty(t)?this[t]:null},set:function(t,n){return(!this[t]||this.hasOwnProperty(t))&&(this[t]=n),this},empty:function(){return Hash.each(this,function(t,n){delete this[n]},this),this},include:function(t,n){return null==this[t]&&(this[t]=n),this},map:function(t,n){return new Hash(Object.map(this,t,n))},filter:function(t,n){return new Hash(Object.filter(this,t,n))},every:function(t,n){return Object.every(this,t,n)},some:function(t,n){return Object.some(this,t,n)},getKeys:function(){return Object.keys(this)},getValues:function(){return Object.values(this)},toQueryString:function(t){return Object.toQueryString(this,t)}}),Hash.extend=Object.append,Hash.alias({indexOf:"keyOf",contains:"hasValue"}),function(){var t=this.document,n=t.window=this,e=function(t,n){t=t.toLowerCase(),n=n?n.toLowerCase():"";var e=t.match(/(opera|ie|firefox|chrome|trident|crios|version)[\s\/:]([\w\d\.]+)?.*?(safari|(?:rv[\s\/:]|version[\s\/:])([\w\d\.]+)|$)/)||[null,"unknown",0];return"trident"==e[1]?(e[1]="ie",e[4]&&(e[2]=e[4])):"crios"==e[1]&&(e[1]="chrome"),n=t.match(/ip(?:ad|od|hone)/)?"ios":(t.match(/(?:webos|android)/)||n.match(/mac|win|linux/)||["other"])[0],"win"==n&&(n="windows"),{extend:Function.prototype.extend,name:"version"==e[1]?e[3]:e[1],version:parseFloat("opera"==e[1]&&e[4]?e[4]:e[2]),platform:n}},r=this.Browser=e(navigator.userAgent,navigator.platform);"ie"==r.name&&(r.version=t.documentMode),r.extend({Features:{xpath:!!t.evaluate,air:!!n.runtime,query:!!t.querySelector,json:!!n.JSON},parseUA:e}),r[r.name]=!0,r[r.name+parseInt(r.version,10)]=!0,"ie"==r.name&&r.version>="11"&&delete r.ie;var i=r.platform;"windows"==i&&(i="win"),r.Platform={name:i},r.Platform[i]=!0,r.Request=function(){var t=function(){return new XMLHttpRequest},n=function(){return new ActiveXObject("MSXML2.XMLHTTP")},e=function(){return new ActiveXObject("Microsoft.XMLHTTP")};return Function.attempt(function(){return t(),t},function(){return n(),n},function(){return e(),e})}(),r.Features.xhr=!!r.Request;var o=(Function.attempt(function(){return navigator.plugins["Shockwave Flash"].description},function(){return new ActiveXObject("ShockwaveFlash.ShockwaveFlash").GetVariable("$version")})||"0 r0").match(/\d+/g);if(r.Plugins={Flash:{version:Number(o[0]||"0."+o[1])||0,build:Number(o[2])||0}},r.exec=function(e){if(!e)return e;if(n.execScript)n.execScript(e);else{var r=t.createElement("script");r.setAttribute("type","text/javascript"),r.text=e,t.head.appendChild(r),t.head.removeChild(r)}return e},String.implement("stripScripts",function(t){var n="",e=this.replace(/<script[^>]*>([\s\S]*?)<\/script>/gi,function(t,e){return n+=e+"\n",""});return t===!0?r.exec(n):"function"==typeOf(t)&&t(n,e),e}),r.extend({Document:this.Document,Window:this.Window,Element:this.Element,Event:this.Event}),this.Window=this.$constructor=new Type("Window",function(){}),this.$family=Function.from("window").hide(),Window.mirror(function(t,e){n[t]=e}),this.Document=t.$constructor=new Type("Document",function(){}),t.$family=Function.from("document").hide(),Document.mirror(function(n,e){t[n]=e}),t.html=t.documentElement,t.head||(t.head=t.getElementsByTagName("head")[0]),t.execCommand)try{t.execCommand("BackgroundImageCache",!1,!0)}catch(a){}if(this.attachEvent&&!this.addEventListener){var s=function(){this.detachEvent("onunload",s),t.head=t.html=t.window=null,n=this.Window=t=null};this.attachEvent("onunload",s)}var u=Array.from;try{u(t.html.childNodes)}catch(a){Array.from=function(t){if("string"!=typeof t&&Type.isEnumerable(t)&&"array"!=typeOf(t)){for(var n=t.length,e=new Array(n);n--;)e[n]=t[n];return e}return u(t)};var c=Array.prototype,h=c.slice;["pop","push","reverse","shift","sort","splice","unshift","concat","join","slice"].each(function(t){var n=c[t];Array[t]=function(t){return n.apply(Array.from(t),h.call(arguments,1))}})}r.Platform.ios&&(r.Platform.ipod=!0),r.Engine={};var l=function(t,n){r.Engine.name=t,r.Engine[t+n]=!0,r.Engine.version=n};if(r.ie)switch(r.Engine.trident=!0,r.version){case 6:l("trident",4);break;case 7:l("trident",5);break;case 8:l("trident",6)}if(r.firefox&&(r.Engine.gecko=!0,r.version>=3?l("gecko",19):l("gecko",18)),r.safari||r.chrome)switch(r.Engine.webkit=!0,r.version){case 2:l("webkit",419);break;case 3:l("webkit",420);break;case 4:l("webkit",525)}if(r.opera&&(r.Engine.presto=!0,r.version>=9.6?l("presto",960):r.version>=9.5?l("presto",950):l("presto",925)),"unknown"==r.name)switch((navigator.userAgent.toLowerCase().match(/(?:webkit|khtml|gecko)/)||[])[0]){case"webkit":case"khtml":r.Engine.webkit=!0;break;case"gecko":r.Engine.gecko=!0}this.$exec=r.exec}();var Cookie=new Class({Implements:Options,options:{path:"/",domain:!1,duration:!1,secure:!1,document:document,encode:!0},initialize:function(t,n){this.key=t,this.setOptions(n)},write:function(t){if(this.options.encode&&(t=encodeURIComponent(t)),this.options.domain&&(t+="; domain="+this.options.domain),this.options.path&&(t+="; path="+this.options.path),this.options.duration){var n=new Date;n.setTime(n.getTime()+24*this.options.duration*60*60*1e3),t+="; expires="+n.toGMTString()}return this.options.secure&&(t+="; secure"),this.options.document.cookie=this.key+"="+t,this},read:function(){var t=this.options.document.cookie.match("(?:^|;)\\s*"+this.key.escapeRegExp()+"=([^;]*)");return t?decodeURIComponent(t[1]):null},dispose:function(){return new Cookie(this.key,Object.merge({},this.options,{duration:-1})).write(""),this}});Cookie.write=function(t,n,e){return new Cookie(t,e).write(n)},Cookie.read=function(t){return new Cookie(t).read()},Cookie.dispose=function(t,n){return new Cookie(t,n).dispose()}; 
 ; // here comes require.js and lodash.custom.js after build task
/*
 * INIT
 */
(function Init() {
    var packadic = (window.packadic = window.packadic || {});

    if(!_.isObject(packadic.config)){
        packadic.config = {};
    }
    packadic.state = 'pre-boot';
    packadic.start = Date.now();
    packadic.__events_fired = [];
    packadic.__event_callbacks = {
        "pre-boot": [],     // before requirejs.config get initialised - before loading the primary dependencies
        "booting" : [],     // after loading up require.js config, before the first require() call
        "booted"  : [],     // after the first require() call when primary dependencies are loaded and booted up packadic base modules
        "starting": [],     // fires right after loading the theme and autoloader dependencies, before any other startup operation
        "started" : []      // fires after the theme module has been initialised and default autoloaders have been added
    };

    packadic.getElapsedTime = function () {
        return (Date.now() - packadic.start) / 1000;
    };

    packadic.bindEventHandler = function (name, cb) {
        if (packadic.__events_fired.indexOf(name) !== -1) {
            return cb();
        }
        packadic.__event_callbacks[name].push(cb);
        return packadic;
    };

    packadic.onPreBoot = function(cb){
        packadic.bindEventHandler('pre-boot', cb);
        return packadic;
    };
    packadic.onBoot = function(req, cb){
        packadic.bindEventHandler('booting', cb);
        return packadic;
    };
    packadic.onBooted = function(req, cb){
        packadic.bindEventHandler('booted', function(){
            if(_.isFunction(req)){
                req();
            } else {
                require(req, cb);
            }
        });
        return packadic;
    };
    packadic.onStart = function(req, cb){
        packadic.bindEventHandler('starting', function(){
            if(_.isFunction(req)){
                req();
            } else {
                require(req, cb);
            }
        });
        return packadic;
    };
    packadic.onStarted = function(req, cb){
        packadic.bindEventHandler('started', function(){
            if(_.isFunction(req)){
                req();
            } else {
                require(req, cb);
            }
        });
        return packadic;
    };

    packadic.fireEvent = function (name) {
        if (!_.isObject(packadic.__event_callbacks[name])) {
            return;
        }
        _.each(packadic.__event_callbacks[name], function (cb) {
            if (typeof cb === 'function') {
                cb();
            }
        });
        packadic.state = name;
        packadic.__events_fired.push(name);
        return packadic;
    };


    packadic.debug = function () {
    };
    packadic.log = function () {
    };

    packadic.mergeConfig = function (newConfig) {
        packadic.config = _.merge(packadic.config, newConfig);
        return packadic;
    }


}.call());

 
 ; /*
 * CONFIG
 */
(function Config() {

    var packadic = (window.packadic = window.packadic || {});
    packadic.config = {
        debug                 : false,
        pageLoadedOnAutoloaded: true,
        paths                 : {
            assets : '/assets',
            images : '/assets/images',
            scripts: '/assets/scripts',
            fonts  : '/assets/fonts',
            styles : '/assets/styles'
        },
        requireJS             : {}
    };


    var jqui = ['accordion', 'autocomplete', 'button', 'core', 'datepicker', 'dialog', 'draggable', 'droppable', 'effect-blind', 'effect-bounce', 'effect-clip', 'effect-drop', 'effect-explode', 'effect-fade', 'effect-fold', 'effect-highlight', 'effect', 'effect-puff', 'effect-pulsate', 'effect-scale', 'effect-shake', 'effect-size', 'effect-slide', 'effect-transfer', 'menu', 'mouse', 'position', 'progressbar', 'resizable', 'selectable', 'selectmenu', 'slider', 'sortable', 'spinner', 'tabs', 'tooltip', 'widget'];
    var tweendeps = ['plugins/gsap/css']; //, 'plugins/gsap/ease', 'plugins/gsap/attr', 'plugins/gsap/scroll' ];

    packadic.config.jQueryUI = jqui;

    packadic.config.requireJS = {
        baseUrl: packadic.config.paths.scripts,
        map    : {
            '*': {
                'css': 'plugins/require-css/css',
                'd3': 'plugins/d3',
                'topojson': 'plugins/topojson'
            }
        },

        paths: {
            // custom build with jsbuild
            'jquery'                   : 'plugins/jquery/dist/jquery.min',
            'plugins/bootstrap'        : 'plugins/bootstrap.custom.min',
            'jquery-ui'                : 'plugins/jquery-ui/ui',

            // dont prefix jade, template amd loader require it, same as jquery
            'jade'                     : 'plugins/jade/runtime',
            'string'                   : 'plugins/underscore.string/dist/underscore.string.min',
            'code-mirror'              : 'plugins/requirejs-codemirror/src/code-mirror',
            'ace'                      : 'plugins/ace/lib/ace',
            'Q'                        : 'plugins/q/q',

            // custom uglified and moved
            'plugins/bootbox'          : 'plugins/bootbox',
            'plugins/modernizr'        : 'plugins/modernizr',
            'plugins/mscrollbar'       : 'plugins/mscrollbar',

            // default vendor paths
            'plugins/async'            : 'plugins/async/lib/async',
            'plugins/svg'              : 'plugins/svg.js/dist/svg',
            'plugins/moment'           : 'plugins/moment/moment/min/moment.min',
            'plugins/select2'          : 'plugins/select2/select2.min',
            'plugins/marked'           : 'plugins/marked/marked.min',
            'plugins/highlightjs'      : 'plugins/highlightjs/highlight.pack',
            'plugins/cryptojs'         : 'plugins/cryptojslib/components',
            'plugins/toastr'           : 'plugins/toastr/toastr',
            'plugins/events'           : 'plugins/eventEmitter/EventEmitter.min',
            'plugins/github-api'       : 'plugins/github-api/github',
            'plugins/oauth2'           : 'plugins/javascript-oauth2/oauth2/oauth2',
            'plugins/oauth-io'         : 'plugins/oauth.io/dist/oauth.min',
            'plugins/md5'              : 'plugins/blueimp-md5/js/md5.min',
            'plugins/pace'             : 'plugins/pace/pace.min',
            'plugins/speakingurl'      : 'plugins/speakingurl/speakingurl.min',

            // jquery
            'plugins/jquery-rest'      : 'plugins/jquery.rest/dist/1/jquery.rest.min',
            'plugins/jquery-migrate'   : 'plugins/jquery-migrate/jquery-migrate',
            'plugins/jquery-slimscroll': 'plugins/jquery-slimscroll/jquery.slimscroll.min',
            'plugins/jquery-slugify'   : 'plugins/jquery-slugify/dist/slugify.min',
            'plugins/mousewheel'       : 'plugins/jquery-mousewheel/jquery.mousewheel.min',
            'plugins/uniform'          : 'plugins/jquery.uniform/jquery.uniform.min',
            'plugins/impromptu'        : 'plugins/jquery-impromptu/dist/jquery-impromptu.min',
            'plugins/cookie'           : 'plugins/jquery-cookie/jquery.cookie',
            'plugins/validation'       : 'plugins/jquery-form-validator/form-validator/jquery.form-validator.min',
            'plugins/tag-it'           : 'plugins/tag-it/js/tag-it.min',

            // flotcharts
            'flot'                     : 'plugins/flotcharts/jquery.flot',
            'flot.pie'                 : 'plugins/flotcharts/jquery.flot.pie',
            'flot.events'              : 'plugins/flotcharts/jquery.flot.events',
            'flot.selection'           : 'plugins/flotcharts/jquery.flot.selection',
            'flot.stack'               : 'plugins/flotcharts/jquery.flot.stack',
            'flot.stackpercent'        : 'plugins/flotcharts/jquery.flot.stackpercent',
            'flot.time'                : 'plugins/flotcharts/jquery.flot.time',
            'flot.byte'                : 'plugins/flotcharts/jquery.flot.byte',
            'flot.orderBars'           : 'plugins/flotcharts/jquery.flot.orderBars',

            'plugins/chartjs'            : 'plugins/chartjs/Chart.min',
            'plugins/easypiechart'       : 'vendor/jquery.easypiechart',
            'plugins/sparkline'          : 'plugins/jquery-sparkline/dist/jquery.sparkline.min',
            'plugins/highcharts'         : 'plugins/highcharts',
            'plugins/d3'                 : 'plugins/d3/d3.min',
            'plugins/nvd3'               : 'plugins/nvd3/build/nv.d3.min',
            'plugins/rickshaw'               : 'plugins/rickshaw/rickshaw.min',
            'plugins/vega'               : 'plugins/vega/vega.min',
            'plugins/topojson'               : 'plugins/topojson/topojson',

            // bootstrap
            'plugins/bs-datepicker'      : 'plugins/bootstrap-datepicker/js/bootstrap-datepicker',
            'plugins/bs-progressbar'     : 'plugins/bootstrap-progressbar/bootstrap-progressbar',
            'plugins/bs-modal'           : 'plugins/bootstrap-modal/js/bootstrap-modal',
            'plugins/bs-modal-manager'   : 'plugins/bootstrap-modal/js/bootstrap-modalmanager',
            'plugins/bs-switch'          : 'plugins/bootstrap-switch/dist/js/bootstrap-switch.min',
            'plugins/bs-select'          : 'plugins/bootstrap-select/dist/js/bootstrap-select.min',
            'plugins/bs-confirmation'    : 'plugins/bootstrap-confirmation2/bootstrap-confirmation',
            'plugins/bs-maxlength'       : 'plugins/bootstrap-maxlength/bootstrap-maxlength.min',
            'plugins/bs-material'        : 'vendor/material',
            'plugins/bs-material-ripples': 'plugins/bootstrap-material-design/scripts/ripples',
            'plugins/contextmenu'        : 'plugins/bootstrap-contextmenu/bootstrap-contextmenu',
            'plugins/gtreetable'         : "plugins/bootstrap-gtreetable/dist/bootstrap-gtreetable",


            // gsap
            'plugins/gsap/lite'          : 'plugins/gsap/src/minified/TweenLite.min',
            'plugins/gsap/max'           : 'plugins/gsap/src/minified/TweenMax.min',
            'plugins/gsap/ease'          : 'plugins/gsap/src/minified/easing/EasePack.min',
            'plugins/gsap/css'           : 'plugins/gsap/src/minified/plugins/CSSPlugin.min',
            'plugins/gsap/attr'          : 'plugins/gsap/src/minified/plugins/AttrPlugin.min',
            'plugins/gsap/color'         : 'plugins/gsap/src/minified/plugins/ColorPropsPlugin.min',
            'plugins/gsap/scroll'        : 'plugins/gsap/src/minified/plugins/ScrollToPlugin.min',
            'plugins/gsap/text'          : 'plugins/gsap/src/minified/plugins/TextPlugin.min',
            'plugins/gsap/jquery-lite'   : 'plugins/gsap/src/minified/jquery.gsap.min',
            'plugins/gsap/jquery-max'    : 'plugins/gsap/src/minified/jquery.gsap.min',


            // Datatables
            'datatables'                 : 'plugins/datatables/media/js/jquery.dataTables.min',
            'datatables/plugins'         : 'plugins/datatables-plugins',
            'datatables/bs-plugins'      : 'plugins/datatables-plugins',

            // stylesheets
            'plugins/select2css'         : '../styles/components/select2',
            'plugins/highlightjscss'     : 'plugins/highlightjs/styles/zenburn'
        },



        shim: {
            // stand-alone and exports
            'plugins/svg'       : {exports: 'SVG'},
            'jade'              : {exports: 'jade'},
            'string'            : {exports: '_s'},
            'plugins/github-api': {exports: 'Github'},
            'plugins/oauth2'    : {exports: 'oauth2'},
            'plugins/oauth-io'  : {exports: 'OAuth'},
            'plugins/d3': {exports: 'd3'},

            // jquery
            'jquery'            : {
                exports: '$',
                init   : function () {
                    this.jquery.noConflict();
                }
            },

            'plugins/jquery-migrate' : ['jquery'],
            'jquery-ui'              : ['jquery'], //, 'jquery-migrate'],
            'plugins/jquery-slugify' : ['jquery', 'plugins/speakingurl'],
            'plugins/tag-it'         : ['jquery-ui/core', 'jquery-ui/widget', 'jquery-ui/position', 'jquery-ui/menu', 'jquery-ui/autocomplete'],
            // bootstrap
            'plugins/bootstrap'      : ['jquery'],
            'plugins/gtreetable'     : ['plugins/jquery-migrate', 'plugins/jquery-ui/core', 'plugins/jquery-ui/draggable', 'plugins/jquery-ui/droppable'],
            'plugins/mscrollbar'     : ['plugins/bootstrap', 'plugins/mousewheel'],
            'plugins/bs-modal'       : ['plugins/bootstrap', 'plugins/bs-modal-manager'],
            'plugins/bs-material'    : ['plugins/bootstrap', 'plugins/bs-material-ripples'],
            'plugins/bs-confirmation': ['plugins/bootstrap'],

            // flots

            'flot'             : ['jquery'],
            'flot.byte'        : ['jquery', 'flot'],
            'flot.orderBars'   : ['jquery', 'flot'],
            'flot.pie'         : ['jquery', 'flot'],
            'flot.events'      : ['jquery', 'flot'],
            'flot.selection'   : ['jquery', 'flot'],
            'flot.stack'       : ['jquery', 'flot'],
            'flot.stackpercent': ['jquery', 'flot'],
            'flot.time'        : ['jquery', 'flot'],

            'plugins/easypiechart'    : ['jquery'],
            'plugins/sparkline'       : ['jquery'],
            'plugins/nvd3': {exports: 'nv', deps: ['plugins/d3']},
            'plugins/vega': {exports: 'vg', deps: ['plugins/d3', 'plugins/topojson']},
            'plugins/rickshaw': {exports: 'Rickshaw', deps: ['plugins/d3']},

            // misc
            'plugins/gsap/lite'       : ['plugins/gsap/scroll'],
            'plugins/gsap/max'        : {exports: 'TweenMax', deps: ['plugins/gsap/scroll']},
            'plugins/gsap/jquery-lite': ['jquery', 'plugins/gsap/lite'],
            'plugins/gsap/jquery-max' : ['jquery', 'plugins/gsap/max'],

            'vendor/dataTables.bootstrap': ['datatables'],

            'plugins/select2'    : ['css!plugins/select2css'],
            'plugins/highlightjs': ['css!plugins/highlightjscss'],

            // packadic scripts
            'config'             : ['jquery'],
            'eventer'            : ['jquery', 'plugins/events'],
            'autoload'           : ['jquery'],
            'theme'              : ['plugins/bootstrap', 'jade', 'plugins/cookie', 'plugins/events'],
            'demo'               : ['theme']
        },


        waitSeconds: 5,

        config: {
            debug: true
        },

        cm: {
            // baseUrl to CodeMirror dir
            baseUrl: 'plugins/codemirror/',
            // path to CodeMirror lib
            path   : 'lib/codemirror',
            // path to CodeMirror css file
            css    : packadic.config.requireJS.basePath + '/lib/codemirror.css',
            // define themes
            themes : {
                monokai : '/path/to/theme/monokai.css',
                ambiance: '/path/to/theme/ambiance.css',
                eclipse : '/path/to/theme/eclipse.css'
            },
            modes  : {
                // modes dir structure
                path: 'mode/{mode}/{mode}'
            }
        }


    };

    jqui.forEach(function (name) {
        packadic.config.requireJS.paths['plugins/jquery-ui/' + name] = 'plugins/jquery-ui/ui/minified/' + name + '.min'
    });


    packadic.config.chartjsGlobal = {
        // Boolean - Whether to animate the chart
        animation             : true,

        // Number - Number of animation steps
        animationSteps        : 60,

        // String - Animation easing effect
        // Possible effects are:
        // [easeInOutQuart, linear, easeOutBounce, easeInBack, easeInOutQuad,
        //  easeOutQuart, easeOutQuad, easeInOutBounce, easeOutSine, easeInOutCubic,
        //  easeInExpo, easeInOutBack, easeInCirc, easeInOutElastic, easeOutBack,
        //  easeInQuad, easeInOutExpo, easeInQuart, easeOutQuint, easeInOutCirc,
        //  easeInSine, easeOutExpo, easeOutCirc, easeOutCubic, easeInQuint,
        //  easeInElastic, easeInOutSine, easeInOutQuint, easeInBounce,
        //  easeOutElastic, easeInCubic]
        animationEasing       : "easeOutQuart",

        // Boolean - If we should show the scale at all
        showScale             : true,

        // Boolean - If we want to override with a hard coded scale
        scaleOverride         : false,

        // ** Required if scaleOverride is true **
        // Number - The number of steps in a hard coded scale
        scaleSteps            : null,
        // Number - The value jump in the hard coded scale
        scaleStepWidth        : null,
        // Number - The scale starting value
        scaleStartValue       : null,

        // String - Colour of the scale line
        scaleLineColor        : "rgba(0,0,0,.1)",

        // Number - Pixel width of the scale line
        scaleLineWidth        : 1,

        // Boolean - Whether to show labels on the scale
        scaleShowLabels       : true,

        // Interpolated JS string - can access value
        scaleLabel            : "<%=value%>",

        // Boolean - Whether the scale should stick to integers, not floats even if drawing space is there
        scaleIntegersOnly     : true,

        // Boolean - Whether the scale should start at zero, or an order of magnitude down from the lowest value
        scaleBeginAtZero      : false,

        // String - Scale label font declaration for the scale label
        scaleFontFamily       : null, // if still null @ boot, the boot script will auto set it correctly //"'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",

        // Number - Scale label font size in pixels
        scaleFontSize         : 12,

        // String - Scale label font weight style
        scaleFontStyle        : "normal",

        // String - Scale label font colour
        scaleFontColor        : "#666",

        // Boolean - whether or not the chart should be responsive and resize when the browser does.
        responsive            : true,

        // Boolean - whether to maintain the starting aspect ratio or not when responsive, if set to false, will take up entire container
        maintainAspectRatio   : true,

        // Boolean - Determines whether to draw tooltips on the canvas or not
        showTooltips          : true,

        // Function - Determines whether to execute the customTooltips function instead of drawing the built in tooltips (See [Advanced - External Tooltips](#advanced-usage-custom-tooltips))
        customTooltips        : false,

        // Array - Array of string names to attach tooltip events
        tooltipEvents         : ["mousemove", "touchstart", "touchmove"],

        // String - Tooltip background colour
        tooltipFillColor      : "rgba(0,0,0,0.8)",

        // String - Tooltip label font declaration for the scale label
        tooltipFontFamily     : null, // if still null @ boot, the boot script will auto set it correctly //"'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",

        // Number - Tooltip label font size in pixels
        tooltipFontSize       : 14,

        // String - Tooltip font weight style
        tooltipFontStyle      : "normal",

        // String - Tooltip label font colour
        tooltipFontColor      : "#fff",

        // String - Tooltip title font declaration for the scale label
        tooltipTitleFontFamily: null, // if still null @ boot, the boot script will auto set it correctly //"'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",

        // Number - Tooltip title font size in pixels
        tooltipTitleFontSize  : 14,

        // String - Tooltip title font weight style
        tooltipTitleFontStyle : "bold",

        // String - Tooltip title font colour
        tooltipTitleFontColor : "#fff",

        // Number - pixel width of padding around tooltip text
        tooltipYPadding       : 6,

        // Number - pixel width of padding around tooltip text
        tooltipXPadding       : 6,

        // Number - Size of the caret on the tooltip
        tooltipCaretSize      : 8,

        // Number - Pixel radius of the tooltip border
        tooltipCornerRadius   : 6,

        // Number - Pixel offset from point x to tooltip edge
        tooltipXOffset        : 10,

        // String - Template string for single tooltips
        tooltipTemplate       : "<%if (label){%><%=label%>: <%}%><%= value %>",

        // String - Template string for multiple tooltips
        multiTooltipTemplate  : "<%= value %>",

        // Function - Will fire on animation progression.
        onAnimationProgress   : function () {
        },

        // Function - Will fire on animation completion.
        onAnimationComplete   : function () {
        }
    }

}.call());
