/*!
 * Modernizr v2.8.3
 * www.modernizr.com
 *
 * Copyright (c) Faruk Ates, Paul Irish, Alex Sexton
 * Available under the BSD and MIT licenses: www.modernizr.com/license/
 */
/*
 * Modernizr tests which native CSS3 and HTML5 features are available in
 * the current UA and makes the results available to you in two ways:
 * as properties on a global Modernizr object, and as classes on the
 * <html> element. This information allows you to progressively enhance
 * your pages with a granular level of control over the experience.
 *
 * Modernizr has an optional (not included) conditional resource loader
 * called Modernizr.load(), based on Yepnope.js (yepnopejs.com).
 * To get a build that includes Modernizr.load(), as well as choosing
 * which tests to include, go to www.modernizr.com/download/
 *
 * Authors        Faruk Ates, Paul Irish, Alex Sexton
 * Contributors   Ryan Seddon, Ben Alman
 */
window.Modernizr = function(a, b, c) {
    var d = "2.8.3", e = {}, /*>>cssclasses*/
    // option for enabling the HTML classes to be added
    f = true, /*>>cssclasses*/
    g = b.documentElement, /**
     * Create our "modernizr" element that we do most feature tests on.
     */
    h = "modernizr", i = b.createElement(h), j = i.style, /**
     * Create the input element for various Web Forms feature tests.
     */
    k = b.createElement("input"), /*>>smile*/
    l = ":)", /*>>smile*/
    m = {}.toString, // TODO :: make the prefixes more granular
    /*>>prefixes*/
    // List of property values to set for css tests. See ticket #21
    n = " -webkit- -moz- -o- -ms- ".split(" "), /*>>prefixes*/
    /*>>domprefixes*/
    // Following spec is to expose vendor-specific style properties as:
    //   elem.style.WebkitBorderRadius
    // and the following would be incorrect:
    //   elem.style.webkitBorderRadius
    // Webkit ghosts their properties in lowercase but Opera & Moz do not.
    // Microsoft uses a lowercase `ms` instead of the correct `Ms` in IE8+
    //   erik.eae.net/archives/2008/03/10/21.48.10/
    // More here: github.com/Modernizr/Modernizr/issues/issue/21
    o = "Webkit Moz O ms", p = o.split(" "), q = o.toLowerCase().split(" "), /*>>domprefixes*/
    /*>>ns*/
    r = {
        svg: "http://www.w3.org/2000/svg"
    }, /*>>ns*/
    s = {}, t = {}, u = {}, v = [], w = v.slice, x, // used in testing loop
    /*>>teststyles*/
    // Inject element with style element and some CSS rules
    y = function(a, c, d, e) {
        var f, i, j, k, l = b.createElement("div"), // After page load injecting a fake body doesn't work so check if body exists
        m = b.body, // IE6 and 7 won't return offsetWidth or offsetHeight unless it's in the body element, so we fake it.
        n = m || b.createElement("body");
        if (parseInt(d, 10)) {
            // In order not to give false positives we create a node for each test
            // This also allows the method to scale for unspecified uses
            while (d--) {
                j = b.createElement("div");
                j.id = e ? e[d] : h + (d + 1);
                l.appendChild(j);
            }
        }
        // <style> elements in IE6-9 are considered 'NoScope' elements and therefore will be removed
        // when injected with innerHTML. To get around this you need to prepend the 'NoScope' element
        // with a 'scoped' element, in our case the soft-hyphen entity as it won't mess with our measurements.
        // msdn.microsoft.com/en-us/library/ms533897%28VS.85%29.aspx
        // Documents served as xml will throw if using &shy; so use xml friendly encoded version. See issue #277
        f = [ "&#173;", '<style id="s', h, '">', a, "</style>" ].join("");
        l.id = h;
        // IE6 will false positive on some tests due to the style element inside the test div somehow interfering offsetHeight, so insert it into body or fakebody.
        // Opera will act all quirky when injecting elements in documentElement when page is served as xml, needs fakebody too. #270
        (m ? l : n).innerHTML += f;
        n.appendChild(l);
        if (!m) {
            //avoid crashing IE8, if background image is used
            n.style.background = "";
            //Safari 5.13/5.1.4 OSX stops loading if ::-webkit-scrollbar is used and scrollbars are visible
            n.style.overflow = "hidden";
            k = g.style.overflow;
            g.style.overflow = "hidden";
            g.appendChild(n);
        }
        i = c(l, a);
        // If this is done after page load we don't want to remove the body so check if body exists
        if (!m) {
            n.parentNode.removeChild(n);
            g.style.overflow = k;
        } else {
            l.parentNode.removeChild(l);
        }
        return !!i;
    }, /*>>teststyles*/
    /*>>mq*/
    // adapted from matchMedia polyfill
    // by Scott Jehl and Paul Irish
    // gist.github.com/786768
    z = function(b) {
        var c = a.matchMedia || a.msMatchMedia;
        if (c) {
            return c(b) && c(b).matches || false;
        }
        var d;
        y("@media " + b + " { #" + h + " { position: absolute; } }", function(b) {
            d = (a.getComputedStyle ? getComputedStyle(b, null) : b.currentStyle)["position"] == "absolute";
        });
        return d;
    }, /*>>mq*/
    /*>>hasevent*/
    //
    // isEventSupported determines if a given element supports the given event
    // kangax.github.com/iseventsupported/
    //
    // The following results are known incorrects:
    //   Modernizr.hasEvent("webkitTransitionEnd", elem) // false negative
    //   Modernizr.hasEvent("textInput") // in Webkit. github.com/Modernizr/Modernizr/issues/333
    //   ...
    A = function() {
        var a = {
            select: "input",
            change: "input",
            submit: "form",
            reset: "form",
            error: "img",
            load: "img",
            abort: "img"
        };
        function d(d, e) {
            e = e || b.createElement(a[d] || "div");
            d = "on" + d;
            // When using `setAttribute`, IE skips "unload", WebKit skips "unload" and "resize", whereas `in` "catches" those
            var f = d in e;
            if (!f) {
                // If it has no `setAttribute` (i.e. doesn't implement Node interface), try generic element
                if (!e.setAttribute) {
                    e = b.createElement("div");
                }
                if (e.setAttribute && e.removeAttribute) {
                    e.setAttribute(d, "");
                    f = F(e[d], "function");
                    // If property was created, "remove it" (by setting value to `undefined`)
                    if (!F(e[d], "undefined")) {
                        e[d] = c;
                    }
                    e.removeAttribute(d);
                }
            }
            e = null;
            return f;
        }
        return d;
    }(), /*>>hasevent*/
    // TODO :: Add flag for hasownprop ? didn't last time
    // hasOwnProperty shim by kangax needed for Safari 2.0 support
    B = {}.hasOwnProperty, C;
    if (!F(B, "undefined") && !F(B.call, "undefined")) {
        C = function(a, b) {
            return B.call(a, b);
        };
    } else {
        C = function(a, b) {
            /* yes, this can give false positives/negatives, but most of the time we don't care about those */
            return b in a && F(a.constructor.prototype[b], "undefined");
        };
    }
    // Adapted from ES5-shim https://github.com/kriskowal/es5-shim/blob/master/es5-shim.js
    // es5.github.com/#x15.3.4.5
    if (!Function.prototype.bind) {
        Function.prototype.bind = function M(a) {
            var b = this;
            if (typeof b != "function") {
                throw new TypeError();
            }
            var c = w.call(arguments, 1), d = function() {
                if (this instanceof d) {
                    var e = function() {};
                    e.prototype = b.prototype;
                    var f = new e();
                    var g = b.apply(f, c.concat(w.call(arguments)));
                    if (Object(g) === g) {
                        return g;
                    }
                    return f;
                } else {
                    return b.apply(a, c.concat(w.call(arguments)));
                }
            };
            return d;
        };
    }
    /**
     * setCss applies given styles to the Modernizr DOM node.
     */
    function D(a) {
        j.cssText = a;
    }
    /**
     * setCssAll extrapolates all vendor-specific css strings.
     */
    function E(a, b) {
        return D(n.join(a + ";") + (b || ""));
    }
    /**
     * is returns a boolean for if typeof obj is exactly type.
     */
    function F(a, b) {
        return typeof a === b;
    }
    /**
     * contains returns a boolean for if substr is found within str.
     */
    function G(a, b) {
        return !!~("" + a).indexOf(b);
    }
    /*>>testprop*/
    // testProps is a generic CSS / DOM property test.
    // In testing support for a given CSS property, it's legit to test:
    //    `elem.style[styleName] !== undefined`
    // If the property is supported it will return an empty string,
    // if unsupported it will return undefined.
    // We'll take advantage of this quick test and skip setting a style
    // on our modernizr element, but instead just testing undefined vs
    // empty string.
    // Because the testing of the CSS property names (with "-", as
    // opposed to the camelCase DOM properties) is non-portable and
    // non-standard but works in WebKit and IE (but not Gecko or Opera),
    // we explicitly reject properties with dashes so that authors
    // developing in WebKit or IE first don't end up with
    // browser-specific content by accident.
    function H(a, b) {
        for (var d in a) {
            var e = a[d];
            if (!G(e, "-") && j[e] !== c) {
                return b == "pfx" ? e : true;
            }
        }
        return false;
    }
    /*>>testprop*/
    // TODO :: add testDOMProps
    /**
     * testDOMProps is a generic DOM property test; if a browser supports
     *   a certain property, it won't return undefined for it.
     */
    function I(a, b, d) {
        for (var e in a) {
            var f = b[a[e]];
            if (f !== c) {
                // return the property name as a string
                if (d === false) return a[e];
                // let's bind a function
                if (F(f, "function")) {
                    // default to autobind unless override
                    return f.bind(d || b);
                }
                // return the unbound function or obj or value
                return f;
            }
        }
        return false;
    }
    /*>>testallprops*/
    /**
     * testPropsAll tests a list of DOM properties we want to check against.
     *   We specify literally ALL possible (known and/or likely) properties on
     *   the element including the non-vendor prefixed one, for forward-
     *   compatibility.
     */
    function J(a, b, c) {
        var d = a.charAt(0).toUpperCase() + a.slice(1), e = (a + " " + p.join(d + " ") + d).split(" ");
        // did they call .prefixed('boxSizing') or are we just testing a prop?
        if (F(b, "string") || F(b, "undefined")) {
            return H(e, b);
        } else {
            e = (a + " " + q.join(d + " ") + d).split(" ");
            return I(e, b, c);
        }
    }
    /*>>testallprops*/
    /**
     * Tests
     * -----
     */
    // The *new* flexbox
    // dev.w3.org/csswg/css3-flexbox
    s["flexbox"] = function() {
        return J("flexWrap");
    };
    // The *old* flexbox
    // www.w3.org/TR/2009/WD-css3-flexbox-20090723/
    s["flexboxlegacy"] = function() {
        return J("boxDirection");
    };
    // On the S60 and BB Storm, getContext exists, but always returns undefined
    // so we actually have to call getContext() to verify
    // github.com/Modernizr/Modernizr/issues/issue/97/
    s["canvas"] = function() {
        var a = b.createElement("canvas");
        return !!(a.getContext && a.getContext("2d"));
    };
    s["canvastext"] = function() {
        return !!(e["canvas"] && F(b.createElement("canvas").getContext("2d").fillText, "function"));
    };
    // webk.it/70117 is tracking a legit WebGL feature detect proposal
    // We do a soft detect which may false positive in order to avoid
    // an expensive context creation: bugzil.la/732441
    s["webgl"] = function() {
        return !!a.WebGLRenderingContext;
    };
    /*
     * The Modernizr.touch test only indicates if the browser supports
     *    touch events, which does not necessarily reflect a touchscreen
     *    device, as evidenced by tablets running Windows 7 or, alas,
     *    the Palm Pre / WebOS (touch) phones.
     *
     * Additionally, Chrome (desktop) used to lie about its support on this,
     *    but that has since been rectified: crbug.com/36415
     *
     * We also test for Firefox 4 Multitouch Support.
     *
     * For more info, see: modernizr.github.com/Modernizr/touch.html
     */
    s["touch"] = function() {
        var c;
        if ("ontouchstart" in a || a.DocumentTouch && b instanceof DocumentTouch) {
            c = true;
        } else {
            y([ "@media (", n.join("touch-enabled),("), h, ")", "{#modernizr{top:9px;position:absolute}}" ].join(""), function(a) {
                c = a.offsetTop === 9;
            });
        }
        return c;
    };
    // geolocation is often considered a trivial feature detect...
    // Turns out, it's quite tricky to get right:
    //
    // Using !!navigator.geolocation does two things we don't want. It:
    //   1. Leaks memory in IE9: github.com/Modernizr/Modernizr/issues/513
    //   2. Disables page caching in WebKit: webk.it/43956
    //
    // Meanwhile, in Firefox < 8, an about:config setting could expose
    // a false positive that would throw an exception: bugzil.la/688158
    s["geolocation"] = function() {
        return "geolocation" in navigator;
    };
    s["postmessage"] = function() {
        return !!a.postMessage;
    };
    // Chrome incognito mode used to throw an exception when using openDatabase
    // It doesn't anymore.
    s["websqldatabase"] = function() {
        return !!a.openDatabase;
    };
    // Vendors had inconsistent prefixing with the experimental Indexed DB:
    // - Webkit's implementation is accessible through webkitIndexedDB
    // - Firefox shipped moz_indexedDB before FF4b9, but since then has been mozIndexedDB
    // For speed, we don't test the legacy (and beta-only) indexedDB
    s["indexedDB"] = function() {
        return !!J("indexedDB", a);
    };
    // documentMode logic from YUI to filter out IE8 Compat Mode
    //   which false positives.
    s["hashchange"] = function() {
        return A("hashchange", a) && (b.documentMode === c || b.documentMode > 7);
    };
    // Per 1.6:
    // This used to be Modernizr.historymanagement but the longer
    // name has been deprecated in favor of a shorter and property-matching one.
    // The old API is still available in 1.6, but as of 2.0 will throw a warning,
    // and in the first release thereafter disappear entirely.
    s["history"] = function() {
        return !!(a.history && history.pushState);
    };
    s["draganddrop"] = function() {
        var a = b.createElement("div");
        return "draggable" in a || "ondragstart" in a && "ondrop" in a;
    };
    // FF3.6 was EOL'ed on 4/24/12, but the ESR version of FF10
    // will be supported until FF19 (2/12/13), at which time, ESR becomes FF17.
    // FF10 still uses prefixes, so check for it until then.
    // for more ESR info, see: mozilla.org/en-US/firefox/organizations/faq/
    s["websockets"] = function() {
        return "WebSocket" in a || "MozWebSocket" in a;
    };
    // css-tricks.com/rgba-browser-support/
    s["rgba"] = function() {
        // Set an rgba() color and check the returned value
        D("background-color:rgba(150,255,150,.5)");
        return G(j.backgroundColor, "rgba");
    };
    s["hsla"] = function() {
        // Same as rgba(), in fact, browsers re-map hsla() to rgba() internally,
        //   except IE9 who retains it as hsla
        D("background-color:hsla(120,40%,100%,.5)");
        return G(j.backgroundColor, "rgba") || G(j.backgroundColor, "hsla");
    };
    s["multiplebgs"] = function() {
        // Setting multiple images AND a color on the background shorthand property
        //  and then querying the style.background property value for the number of
        //  occurrences of "url(" is a reliable method for detecting ACTUAL support for this!
        D("background:url(https://),url(https://),red url(https://)");
        // If the UA supports multiple backgrounds, there should be three occurrences
        //   of the string "url(" in the return value for elemStyle.background
        return /(url\s*\(.*?){3}/.test(j.background);
    };
    // this will false positive in Opera Mini
    //   github.com/Modernizr/Modernizr/issues/396
    s["backgroundsize"] = function() {
        return J("backgroundSize");
    };
    s["borderimage"] = function() {
        return J("borderImage");
    };
    // Super comprehensive table about all the unique implementations of
    // border-radius: muddledramblings.com/table-of-css3-border-radius-compliance
    s["borderradius"] = function() {
        return J("borderRadius");
    };
    // WebOS unfortunately false positives on this test.
    s["boxshadow"] = function() {
        return J("boxShadow");
    };
    // FF3.0 will false positive on this test
    s["textshadow"] = function() {
        return b.createElement("div").style.textShadow === "";
    };
    s["opacity"] = function() {
        // Browsers that actually have CSS Opacity implemented have done so
        //  according to spec, which means their return values are within the
        //  range of [0.0,1.0] - including the leading zero.
        E("opacity:.55");
        // The non-literal . in this regex is intentional:
        //   German Chrome returns this value as 0,55
        // github.com/Modernizr/Modernizr/issues/#issue/59/comment/516632
        return /^0.55$/.test(j.opacity);
    };
    // Note, Android < 4 will pass this test, but can only animate
    //   a single property at a time
    //   goo.gl/v3V4Gp
    s["cssanimations"] = function() {
        return J("animationName");
    };
    s["csscolumns"] = function() {
        return J("columnCount");
    };
    s["cssgradients"] = function() {
        /**
         * For CSS Gradients syntax, please see:
         * webkit.org/blog/175/introducing-css-gradients/
         * developer.mozilla.org/en/CSS/-moz-linear-gradient
         * developer.mozilla.org/en/CSS/-moz-radial-gradient
         * dev.w3.org/csswg/css3-images/#gradients-
         */
        var a = "background-image:", b = "gradient(linear,left top,right bottom,from(#9f9),to(white));", c = "linear-gradient(left top,#9f9, white);";
        D(// legacy webkit syntax (FIXME: remove when syntax not in use anymore)
        (a + "-webkit- ".split(" ").join(b + a) + // standard syntax             // trailing 'background-image:'
        n.join(c + a)).slice(0, -a.length));
        return G(j.backgroundImage, "gradient");
    };
    s["cssreflections"] = function() {
        return J("boxReflect");
    };
    s["csstransforms"] = function() {
        return !!J("transform");
    };
    s["csstransforms3d"] = function() {
        var a = !!J("perspective");
        // Webkit's 3D transforms are passed off to the browser's own graphics renderer.
        //   It works fine in Safari on Leopard and Snow Leopard, but not in Chrome in
        //   some conditions. As a result, Webkit typically recognizes the syntax but
        //   will sometimes throw a false positive, thus we must do a more thorough check:
        if (a && "webkitPerspective" in g.style) {
            // Webkit allows this media query to succeed only if the feature is enabled.
            // `@media (transform-3d),(-webkit-transform-3d){ ... }`
            y("@media (transform-3d),(-webkit-transform-3d){#modernizr{left:9px;position:absolute;height:3px;}}", function(b, c) {
                a = b.offsetLeft === 9 && b.offsetHeight === 3;
            });
        }
        return a;
    };
    s["csstransitions"] = function() {
        return J("transition");
    };
    /*>>fontface*/
    // @font-face detection routine by Diego Perini
    // javascript.nwbox.com/CSSSupport/
    // false positives:
    //   WebOS github.com/Modernizr/Modernizr/issues/342
    //   WP7   github.com/Modernizr/Modernizr/issues/538
    s["fontface"] = function() {
        var a;
        y('@font-face {font-family:"font";src:url("https://")}', function(c, d) {
            var e = b.getElementById("smodernizr"), f = e.sheet || e.styleSheet, g = f ? f.cssRules && f.cssRules[0] ? f.cssRules[0].cssText : f.cssText || "" : "";
            a = /src/i.test(g) && g.indexOf(d.split(" ")[0]) === 0;
        });
        return a;
    };
    /*>>fontface*/
    // CSS generated content detection
    s["generatedcontent"] = function() {
        var a;
        y([ "#", h, "{font:0/0 a}#", h, ':after{content:"', l, '";visibility:hidden;font:3px/1 a}' ].join(""), function(b) {
            a = b.offsetHeight >= 3;
        });
        return a;
    };
    // These tests evaluate support of the video/audio elements, as well as
    // testing what types of content they support.
    //
    // We're using the Boolean constructor here, so that we can extend the value
    // e.g.  Modernizr.video     // true
    //       Modernizr.video.ogg // 'probably'
    //
    // Codec values from : github.com/NielsLeenheer/html5test/blob/9106a8/index.html#L845
    //                     thx to NielsLeenheer and zcorpan
    // Note: in some older browsers, "no" was a return value instead of empty string.
    //   It was live in FF3.5.0 and 3.5.1, but fixed in 3.5.2
    //   It was also live in Safari 4.0.0 - 4.0.4, but fixed in 4.0.5
    s["video"] = function() {
        var a = b.createElement("video"), c = false;
        // IE9 Running on Windows Server SKU can cause an exception to be thrown, bug #224
        try {
            if (c = !!a.canPlayType) {
                c = new Boolean(c);
                c.ogg = a.canPlayType('video/ogg; codecs="theora"').replace(/^no$/, "");
                // Without QuickTime, this value will be `undefined`. github.com/Modernizr/Modernizr/issues/546
                c.h264 = a.canPlayType('video/mp4; codecs="avc1.42E01E"').replace(/^no$/, "");
                c.webm = a.canPlayType('video/webm; codecs="vp8, vorbis"').replace(/^no$/, "");
            }
        } catch (d) {}
        return c;
    };
    s["audio"] = function() {
        var a = b.createElement("audio"), c = false;
        try {
            if (c = !!a.canPlayType) {
                c = new Boolean(c);
                c.ogg = a.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/, "");
                c.mp3 = a.canPlayType("audio/mpeg;").replace(/^no$/, "");
                // Mimetypes accepted:
                //   developer.mozilla.org/En/Media_formats_supported_by_the_audio_and_video_elements
                //   bit.ly/iphoneoscodecs
                c.wav = a.canPlayType('audio/wav; codecs="1"').replace(/^no$/, "");
                c.m4a = (a.canPlayType("audio/x-m4a;") || a.canPlayType("audio/aac;")).replace(/^no$/, "");
            }
        } catch (d) {}
        return c;
    };
    // In FF4, if disabled, window.localStorage should === null.
    // Normally, we could not test that directly and need to do a
    //   `('localStorage' in window) && ` test first because otherwise Firefox will
    //   throw bugzil.la/365772 if cookies are disabled
    // Also in iOS5 Private Browsing mode, attempting to use localStorage.setItem
    // will throw the exception:
    //   QUOTA_EXCEEDED_ERRROR DOM Exception 22.
    // Peculiarly, getItem and removeItem calls do not throw.
    // Because we are forced to try/catch this, we'll go aggressive.
    // Just FWIW: IE8 Compat mode supports these features completely:
    //   www.quirksmode.org/dom/html5.html
    // But IE8 doesn't support either with local files
    s["localstorage"] = function() {
        try {
            localStorage.setItem(h, h);
            localStorage.removeItem(h);
            return true;
        } catch (a) {
            return false;
        }
    };
    s["sessionstorage"] = function() {
        try {
            sessionStorage.setItem(h, h);
            sessionStorage.removeItem(h);
            return true;
        } catch (a) {
            return false;
        }
    };
    s["webworkers"] = function() {
        return !!a.Worker;
    };
    s["applicationcache"] = function() {
        return !!a.applicationCache;
    };
    // Thanks to Erik Dahlstrom
    s["svg"] = function() {
        return !!b.createElementNS && !!b.createElementNS(r.svg, "svg").createSVGRect;
    };
    // specifically for SVG inline in HTML, not within XHTML
    // test page: paulirish.com/demo/inline-svg
    s["inlinesvg"] = function() {
        var a = b.createElement("div");
        a.innerHTML = "<svg/>";
        return (a.firstChild && a.firstChild.namespaceURI) == r.svg;
    };
    // SVG SMIL animation
    s["smil"] = function() {
        return !!b.createElementNS && /SVGAnimate/.test(m.call(b.createElementNS(r.svg, "animate")));
    };
    // This test is only for clip paths in SVG proper, not clip paths on HTML content
    // demo: srufaculty.sru.edu/david.dailey/svg/newstuff/clipPath4.svg
    // However read the comments to dig into applying SVG clippaths to HTML content here:
    //   github.com/Modernizr/Modernizr/issues/213#issuecomment-1149491
    s["svgclippaths"] = function() {
        return !!b.createElementNS && /SVGClipPath/.test(m.call(b.createElementNS(r.svg, "clipPath")));
    };
    /*>>webforms*/
    // input features and input types go directly onto the ret object, bypassing the tests loop.
    // Hold this guy to execute in a moment.
    function K() {
        /*>>input*/
        // Run through HTML5's new input attributes to see if the UA understands any.
        // We're using f which is the <input> element created early on
        // Mike Taylr has created a comprehensive resource for testing these attributes
        //   when applied to all input types:
        //   miketaylr.com/code/input-type-attr.html
        // spec: www.whatwg.org/specs/web-apps/current-work/multipage/the-input-element.html#input-type-attr-summary
        // Only input placeholder is tested while textarea's placeholder is not.
        // Currently Safari 4 and Opera 11 have support only for the input placeholder
        // Both tests are available in feature-detects/forms-placeholder.js
        e["input"] = function(c) {
            for (var d = 0, e = c.length; d < e; d++) {
                u[c[d]] = !!(c[d] in k);
            }
            if (u.list) {
                // safari false positive's on datalist: webk.it/74252
                // see also github.com/Modernizr/Modernizr/issues/146
                u.list = !!(b.createElement("datalist") && a.HTMLDataListElement);
            }
            return u;
        }("autocomplete autofocus list placeholder max min multiple pattern required step".split(" "));
        /*>>input*/
        /*>>inputtypes*/
        // Run through HTML5's new input types to see if the UA understands any.
        //   This is put behind the tests runloop because it doesn't return a
        //   true/false like all the other tests; instead, it returns an object
        //   containing each input type with its corresponding true/false value
        // Big thanks to @miketaylr for the html5 forms expertise. miketaylr.com/
        e["inputtypes"] = function(a) {
            for (var d = 0, e, f, h, i = a.length; d < i; d++) {
                k.setAttribute("type", f = a[d]);
                e = k.type !== "text";
                // We first check to see if the type we give it sticks..
                // If the type does, we feed it a textual value, which shouldn't be valid.
                // If the value doesn't stick, we know there's input sanitization which infers a custom UI
                if (e) {
                    k.value = l;
                    k.style.cssText = "position:absolute;visibility:hidden;";
                    if (/^range$/.test(f) && k.style.WebkitAppearance !== c) {
                        g.appendChild(k);
                        h = b.defaultView;
                        // Safari 2-4 allows the smiley as a value, despite making a slider
                        e = h.getComputedStyle && h.getComputedStyle(k, null).WebkitAppearance !== "textfield" && // Mobile android web browser has false positive, so must
                        // check the height to see if the widget is actually there.
                        k.offsetHeight !== 0;
                        g.removeChild(k);
                    } else if (/^(search|tel)$/.test(f)) {} else if (/^(url|email)$/.test(f)) {
                        // Real url and email support comes with prebaked validation.
                        e = k.checkValidity && k.checkValidity() === false;
                    } else {
                        // If the upgraded input compontent rejects the :) text, we got a winner
                        e = k.value != l;
                    }
                }
                t[a[d]] = !!e;
            }
            return t;
        }("search tel url email datetime date month week time datetime-local number range color".split(" "));
    }
    /*>>webforms*/
    // End of test definitions
    // -----------------------
    // Run through all tests and detect their support in the current UA.
    // todo: hypothetically we could be doing an array of tests and use a basic loop here.
    for (var L in s) {
        if (C(s, L)) {
            // run the test, throw the return value into the Modernizr,
            //   then based on that boolean, define an appropriate className
            //   and push it into an array of classes we'll join later.
            x = L.toLowerCase();
            e[x] = s[L]();
            v.push((e[x] ? "" : "no-") + x);
        }
    }
    /*>>webforms*/
    // input tests need to run.
    e.input || K();
    /*>>webforms*/
    /**
     * addTest allows the user to define their own feature tests
     * the result will be added onto the Modernizr object,
     * as well as an appropriate className set on the html element
     *
     * @param feature - String naming the feature
     * @param test - Function returning true if feature is supported, false if not
     */
    e.addTest = function(a, b) {
        if (typeof a == "object") {
            for (var d in a) {
                if (C(a, d)) {
                    e.addTest(d, a[d]);
                }
            }
        } else {
            a = a.toLowerCase();
            if (e[a] !== c) {
                // we're going to quit if you're trying to overwrite an existing test
                // if we were to allow it, we'd do this:
                //   var re = new RegExp("\\b(no-)?" + feature + "\\b");
                //   docElement.className = docElement.className.replace( re, '' );
                // but, no rly, stuff 'em.
                return e;
            }
            b = typeof b == "function" ? b() : b;
            if (typeof f !== "undefined" && f) {
                g.className += " " + (b ? "" : "no-") + a;
            }
            e[a] = b;
        }
        return e;
    };
    // Reset modElem.cssText to nothing to reduce memory footprint.
    D("");
    i = k = null;
    (function(a, b) {
        /*jshint evil:true */
        /** version */
        var c = "3.7.0";
        /** Preset options */
        var d = a.html5 || {};
        /** Used to skip problem elements */
        var e = /^<|^(?:button|map|select|textarea|object|iframe|option|optgroup)$/i;
        /** Not all elements can be cloned in IE **/
        var f = /^(?:a|b|code|div|fieldset|h1|h2|h3|h4|h5|h6|i|label|li|ol|p|q|span|strong|style|table|tbody|td|th|tr|ul)$/i;
        /** Detect whether the browser supports default html5 styles */
        var g;
        /** Name of the expando, to work with multiple documents or to re-shiv one document */
        var h = "_html5shiv";
        /** The id for the the documents expando */
        var i = 0;
        /** Cached data for each document */
        var j = {};
        /** Detect whether the browser supports unknown elements */
        var k;
        (function() {
            try {
                var a = b.createElement("a");
                a.innerHTML = "<xyz></xyz>";
                //if the hidden property is implemented we can assume, that the browser supports basic HTML5 Styles
                g = "hidden" in a;
                k = a.childNodes.length == 1 || function() {
                    // assign a false positive if unable to shiv
                    b.createElement("a");
                    var a = b.createDocumentFragment();
                    return typeof a.cloneNode == "undefined" || typeof a.createDocumentFragment == "undefined" || typeof a.createElement == "undefined";
                }();
            } catch (c) {
                // assign a false positive if detection fails => unable to shiv
                g = true;
                k = true;
            }
        })();
        /*--------------------------------------------------------------------------*/
        /**
         * Creates a style sheet with the given CSS text and adds it to the document.
         * @private
         * @param {Document} ownerDocument The document.
         * @param {String} cssText The CSS text.
         * @returns {StyleSheet} The style element.
         */
        function l(a, b) {
            var c = a.createElement("p"), d = a.getElementsByTagName("head")[0] || a.documentElement;
            c.innerHTML = "x<style>" + b + "</style>";
            return d.insertBefore(c.lastChild, d.firstChild);
        }
        /**
         * Returns the value of `html5.elements` as an array.
         * @private
         * @returns {Array} An array of shived element node names.
         */
        function m() {
            var a = s.elements;
            return typeof a == "string" ? a.split(" ") : a;
        }
        /**
         * Returns the data associated to the given document
         * @private
         * @param {Document} ownerDocument The document.
         * @returns {Object} An object of data.
         */
        function n(a) {
            var b = j[a[h]];
            if (!b) {
                b = {};
                i++;
                a[h] = i;
                j[i] = b;
            }
            return b;
        }
        /**
         * returns a shived element for the given nodeName and document
         * @memberOf html5
         * @param {String} nodeName name of the element
         * @param {Document} ownerDocument The context document.
         * @returns {Object} The shived element.
         */
        function o(a, c, d) {
            if (!c) {
                c = b;
            }
            if (k) {
                return c.createElement(a);
            }
            if (!d) {
                d = n(c);
            }
            var g;
            if (d.cache[a]) {
                g = d.cache[a].cloneNode();
            } else if (f.test(a)) {
                g = (d.cache[a] = d.createElem(a)).cloneNode();
            } else {
                g = d.createElem(a);
            }
            // Avoid adding some elements to fragments in IE < 9 because
            // * Attributes like `name` or `type` cannot be set/changed once an element
            //   is inserted into a document/fragment
            // * Link elements with `src` attributes that are inaccessible, as with
            //   a 403 response, will cause the tab/window to crash
            // * Script elements appended to fragments will execute when their `src`
            //   or `text` property is set
            return g.canHaveChildren && !e.test(a) && !g.tagUrn ? d.frag.appendChild(g) : g;
        }
        /**
         * returns a shived DocumentFragment for the given document
         * @memberOf html5
         * @param {Document} ownerDocument The context document.
         * @returns {Object} The shived DocumentFragment.
         */
        function p(a, c) {
            if (!a) {
                a = b;
            }
            if (k) {
                return a.createDocumentFragment();
            }
            c = c || n(a);
            var d = c.frag.cloneNode(), e = 0, f = m(), g = f.length;
            for (;e < g; e++) {
                d.createElement(f[e]);
            }
            return d;
        }
        /**
         * Shivs the `createElement` and `createDocumentFragment` methods of the document.
         * @private
         * @param {Document|DocumentFragment} ownerDocument The document.
         * @param {Object} data of the document.
         */
        function q(a, b) {
            if (!b.cache) {
                b.cache = {};
                b.createElem = a.createElement;
                b.createFrag = a.createDocumentFragment;
                b.frag = b.createFrag();
            }
            a.createElement = function(c) {
                //abort shiv
                if (!s.shivMethods) {
                    return b.createElem(c);
                }
                return o(c, a, b);
            };
            a.createDocumentFragment = Function("h,f", "return function(){" + "var n=f.cloneNode(),c=n.createElement;" + "h.shivMethods&&(" + // unroll the `createElement` calls
            m().join().replace(/[\w\-]+/g, function(a) {
                b.createElem(a);
                b.frag.createElement(a);
                return 'c("' + a + '")';
            }) + ");return n}")(s, b.frag);
        }
        /*--------------------------------------------------------------------------*/
        /**
         * Shivs the given document.
         * @memberOf html5
         * @param {Document} ownerDocument The document to shiv.
         * @returns {Document} The shived document.
         */
        function r(a) {
            if (!a) {
                a = b;
            }
            var c = n(a);
            if (s.shivCSS && !g && !c.hasCSS) {
                c.hasCSS = !!l(a, // corrects block display not defined in IE6/7/8/9
                "article,aside,dialog,figcaption,figure,footer,header,hgroup,main,nav,section{display:block}" + // adds styling not present in IE6/7/8/9
                "mark{background:#FF0;color:#000}" + // hides non-rendered elements
                "template{display:none}");
            }
            if (!k) {
                q(a, c);
            }
            return a;
        }
        /*--------------------------------------------------------------------------*/
        /**
         * The `html5` object is exposed so that more elements can be shived and
         * existing shiving can be detected on iframes.
         * @type Object
         * @example
         *
         * // options can be changed before the script is included
         * html5 = { 'elements': 'mark section', 'shivCSS': false, 'shivMethods': false };
         */
        var s = {
            /**
           * An array or space separated string of node names of the elements to shiv.
           * @memberOf html5
           * @type Array|String
           */
            elements: d.elements || "abbr article aside audio bdi canvas data datalist details dialog figcaption figure footer header hgroup main mark meter nav output progress section summary template time video",
            /**
           * current version of html5shiv
           */
            version: c,
            /**
           * A flag to indicate that the HTML5 style sheet should be inserted.
           * @memberOf html5
           * @type Boolean
           */
            shivCSS: d.shivCSS !== false,
            /**
           * Is equal to true if a browser supports creating unknown/HTML5 elements
           * @memberOf html5
           * @type boolean
           */
            supportsUnknownElements: k,
            /**
           * A flag to indicate that the document's `createElement` and `createDocumentFragment`
           * methods should be overwritten.
           * @memberOf html5
           * @type Boolean
           */
            shivMethods: d.shivMethods !== false,
            /**
           * A string to describe the type of `html5` object ("default" or "default print").
           * @memberOf html5
           * @type String
           */
            type: "default",
            // shivs the document according to the specified `html5` object options
            shivDocument: r,
            //creates a shived element
            createElement: o,
            //creates a shived documentFragment
            createDocumentFragment: p
        };
        /*--------------------------------------------------------------------------*/
        // expose html5
        a.html5 = s;
        // shiv the document
        r(b);
    })(this, b);
    /*>>shiv*/
    // Assign private properties to the return object with prefix
    e._version = d;
    // expose these for the plugin API. Look in the source for how to join() them against your input
    /*>>prefixes*/
    e._prefixes = n;
    /*>>prefixes*/
    /*>>domprefixes*/
    e._domPrefixes = q;
    e._cssomPrefixes = p;
    /*>>domprefixes*/
    /*>>mq*/
    // Modernizr.mq tests a given media query, live against the current state of the window
    // A few important notes:
    //   * If a browser does not support media queries at all (eg. oldIE) the mq() will always return false
    //   * A max-width or orientation query will be evaluated against the current state, which may change later.
    //   * You must specify values. Eg. If you are testing support for the min-width media query use:
    //       Modernizr.mq('(min-width:0)')
    // usage:
    // Modernizr.mq('only screen and (max-width:768)')
    e.mq = z;
    /*>>mq*/
    /*>>hasevent*/
    // Modernizr.hasEvent() detects support for a given event, with an optional element to test on
    // Modernizr.hasEvent('gesturestart', elem)
    e.hasEvent = A;
    /*>>hasevent*/
    /*>>testprop*/
    // Modernizr.testProp() investigates whether a given style property is recognized
    // Note that the property names must be provided in the camelCase variant.
    // Modernizr.testProp('pointerEvents')
    e.testProp = function(a) {
        return H([ a ]);
    };
    /*>>testprop*/
    /*>>testallprops*/
    // Modernizr.testAllProps() investigates whether a given style property,
    //   or any of its vendor-prefixed variants, is recognized
    // Note that the property names must be provided in the camelCase variant.
    // Modernizr.testAllProps('boxSizing')
    e.testAllProps = J;
    /*>>testallprops*/
    /*>>teststyles*/
    // Modernizr.testStyles() allows you to add custom styles to the document and test an element afterwards
    // Modernizr.testStyles('#modernizr { position:absolute }', function(elem, rule){ ... })
    e.testStyles = y;
    /*>>teststyles*/
    /*>>prefixed*/
    // Modernizr.prefixed() returns the prefixed or nonprefixed property name variant of your input
    // Modernizr.prefixed('boxSizing') // 'MozBoxSizing'
    // Properties must be passed as dom-style camelcase, rather than `box-sizing` hypentated style.
    // Return values will also be the camelCase variant, if you need to translate that to hypenated style use:
    //
    //     str.replace(/([A-Z])/g, function(str,m1){ return '-' + m1.toLowerCase(); }).replace(/^ms-/,'-ms-');
    // If you're trying to ascertain which transition end event to bind to, you might do something like...
    //
    //     var transEndEventNames = {
    //       'WebkitTransition' : 'webkitTransitionEnd',
    //       'MozTransition'    : 'transitionend',
    //       'OTransition'      : 'oTransitionEnd',
    //       'msTransition'     : 'MSTransitionEnd',
    //       'transition'       : 'transitionend'
    //     },
    //     transEndEventName = transEndEventNames[ Modernizr.prefixed('transition') ];
    e.prefixed = function(a, b, c) {
        if (!b) {
            return J(a, "pfx");
        } else {
            // Testing DOM property e.g. Modernizr.prefixed('requestAnimationFrame', window) // 'mozRequestAnimationFrame'
            return J(a, b, c);
        }
    };
    /*>>prefixed*/
    /*>>cssclasses*/
    // Remove "no-js" class from <html> element, if it exists:
    g.className = g.className.replace(/(^|\s)no-js(\s|$)/, "$1$2") + (// Add the new classes to the <html> element.
    f ? " js " + v.join(" ") : "");
    /*>>cssclasses*/
    return e;
}(this, this.document);