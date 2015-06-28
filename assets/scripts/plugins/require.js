/** vim: et:ts=4:sw=4:sts=4
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