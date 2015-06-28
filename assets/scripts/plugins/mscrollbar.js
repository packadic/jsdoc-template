/*
== malihu jquery custom scrollbar plugin == 
Version: 3.0.9 
Plugin URI: http://manos.malihu.gr/jquery-custom-content-scroller 
Author: malihu
Author URI: http://manos.malihu.gr
License: MIT License (MIT)
*/
/*
Copyright 2010 Manos Malihutsakis (email: manos@malihu.gr)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/
/*
The code below is fairly long, fully commented and should be normally used in development. 
For production, use either the minified jquery.mCustomScrollbar.min.js script or 
the production-ready jquery.mCustomScrollbar.concat.min.js which contains the plugin 
and dependencies (minified). 
*/
(function(a) {
    if (typeof module !== "undefined" && module.exports) {
        module.exports = a;
    } else {
        a(jQuery, window, document);
    }
})(function(a) {
    (function(b) {
        var c = typeof define === "function" && define.amd, /* RequireJS */
        d = typeof module !== "undefined" && module.exports, /* NodeJS */
        e = "https:" == document.location.protocol ? "https:" : "http:", /* location protocol */
        f = "cdnjs.cloudflare.com/ajax/libs/jquery-mousewheel/3.1.12/jquery.mousewheel.min.js";
        if (!c) {
            if (d) {
                require("jquery-mousewheel")(a);
            } else {
                /* load jquery-mousewheel plugin (via CDN) if it's not present or not loaded via RequireJS 
			(works when mCustomScrollbar fn is called on window load) */
                a.event.special.mousewheel || a("head").append(decodeURI("%3Cscript src=" + e + "//" + f + "%3E%3C/script%3E"));
            }
        }
        b();
    })(function() {
        /* 
	----------------------------------------
	PLUGIN NAMESPACE, PREFIX, DEFAULT SELECTOR(S) 
	----------------------------------------
	*/
        var b = "mCustomScrollbar", c = "mCS", d = ".mCustomScrollbar", /* 
	----------------------------------------
	DEFAULT OPTIONS 
	----------------------------------------
	*/
        e = {
            /*
			set element/content width/height programmatically 
			values: boolean, pixels, percentage 
				option						default
				-------------------------------------
				setWidth					false
				setHeight					false
			*/
            /*
			set the initial css top property of content  
			values: string (e.g. "-100px", "10%" etc.)
			*/
            setTop: 0,
            /*
			set the initial css left property of content  
			values: string (e.g. "-100px", "10%" etc.)
			*/
            setLeft: 0,
            /* 
			scrollbar axis (vertical and/or horizontal scrollbars) 
			values (string): "y", "x", "yx"
			*/
            axis: "y",
            /*
			position of scrollbar relative to content  
			values (string): "inside", "outside" ("outside" requires elements with position:relative)
			*/
            scrollbarPosition: "inside",
            /*
			scrolling inertia
			values: integer (milliseconds)
			*/
            scrollInertia: 950,
            /* 
			auto-adjust scrollbar dragger length
			values: boolean
			*/
            autoDraggerLength: true,
            /*
			auto-hide scrollbar when idle 
			values: boolean
				option						default
				-------------------------------------
				autoHideScrollbar			false
			*/
            /*
			auto-expands scrollbar on mouse-over and dragging
			values: boolean
				option						default
				-------------------------------------
				autoExpandScrollbar			false
			*/
            /*
			always show scrollbar, even when there's nothing to scroll 
			values: integer (0=disable, 1=always show dragger rail and buttons, 2=always show dragger rail, dragger and buttons), boolean
			*/
            alwaysShowScrollbar: 0,
            /*
			scrolling always snaps to a multiple of this number in pixels
			values: integer
				option						default
				-------------------------------------
				snapAmount					null
			*/
            /*
			when snapping, snap with this number in pixels as an offset 
			values: integer
			*/
            snapOffset: 0,
            /* 
			mouse-wheel scrolling
			*/
            mouseWheel: {
                /* 
				enable mouse-wheel scrolling
				values: boolean
				*/
                enable: true,
                /* 
				scrolling amount in pixels
				values: "auto", integer 
				*/
                scrollAmount: "auto",
                /* 
				mouse-wheel scrolling axis 
				the default scrolling direction when both vertical and horizontal scrollbars are present 
				values (string): "y", "x" 
				*/
                axis: "y",
                /* 
				prevent the default behaviour which automatically scrolls the parent element(s) when end of scrolling is reached 
				values: boolean
					option						default
					-------------------------------------
					preventDefault				null
				*/
                /*
				the reported mouse-wheel delta value. The number of lines (translated to pixels) one wheel notch scrolls.  
				values: "auto", integer 
				"auto" uses the default OS/browser value 
				*/
                deltaFactor: "auto",
                /*
				normalize mouse-wheel delta to -1 or 1 (disables mouse-wheel acceleration) 
				values: boolean
					option						default
					-------------------------------------
					normalizeDelta				null
				*/
                /*
				invert mouse-wheel scrolling direction 
				values: boolean
					option						default
					-------------------------------------
					invert						null
				*/
                /*
				the tags that disable mouse-wheel when cursor is over them
				*/
                disableOver: [ "select", "option", "keygen", "datalist", "textarea" ]
            },
            /* 
			scrollbar buttons
			*/
            scrollButtons: {
                /*
				enable scrollbar buttons
				values: boolean
					option						default
					-------------------------------------
					enable						null
				*/
                /*
				scrollbar buttons scrolling type 
				values (string): "stepless", "stepped"
				*/
                scrollType: "stepless",
                /*
				scrolling amount in pixels
				values: "auto", integer 
				*/
                scrollAmount: "auto"
            },
            /* 
			keyboard scrolling
			*/
            keyboard: {
                /*
				enable scrolling via keyboard
				values: boolean
				*/
                enable: true,
                /*
				keyboard scrolling type 
				values (string): "stepless", "stepped"
				*/
                scrollType: "stepless",
                /*
				scrolling amount in pixels
				values: "auto", integer 
				*/
                scrollAmount: "auto"
            },
            /*
			enable content touch-swipe scrolling 
			values: boolean, integer, string (number)
			integer values define the axis-specific minimum amount required for scrolling momentum
			*/
            contentTouchScroll: 25,
            /*
			advanced option parameters
			*/
            advanced: {
                /*
				auto-expand content horizontally (for "x" or "yx" axis) 
				values: boolean
					option						default
					-------------------------------------
					autoExpandHorizontalScroll	null
				*/
                /*
				auto-scroll to elements with focus
				*/
                autoScrollOnFocus: "input,textarea,select,button,datalist,keygen,a[tabindex],area,object,[contenteditable='true']",
                /*
				auto-update scrollbars on content, element or viewport resize 
				should be true for fluid layouts/elements, adding/removing content dynamically, hiding/showing elements, content with images etc. 
				values: boolean
				*/
                updateOnContentResize: true,
                /*
				auto-update scrollbars each time each image inside the element is fully loaded 
				values: boolean
				*/
                updateOnImageLoad: true,
                /*
				auto-update scrollbars based on the amount and size changes of specific selectors 
				useful when you need to update the scrollbar(s) automatically, each time a type of element is added, removed or changes its size 
				values: boolean, string (e.g. "ul li" will auto-update scrollbars each time list-items inside the element are changed) 
				a value of true (boolean) will auto-update scrollbars each time any element is changed
					option						default
					-------------------------------------
					updateOnSelectorChange		null
				*/
                /*
				extra selectors that'll release scrollbar dragging upon mouseup, pointerup, touchend etc. (e.g. "selector-1, selector-2")
					option						default
					-------------------------------------
					releaseDraggableSelectors	null
				*/
                /*
				auto-update timeout 
				values: integer (milliseconds)
				*/
                autoUpdateTimeout: 60
            },
            /* 
			scrollbar theme 
			values: string (see CSS/plugin URI for a list of ready-to-use themes)
			*/
            theme: "light",
            /*
			user defined callback functions
			*/
            callbacks: {
                /*
				Available callbacks: 
					callback					default
					-------------------------------------
					onInit						null
					onScrollStart				null
					onScroll					null
					onTotalScroll				null
					onTotalScrollBack			null
					whileScrolling				null
					onOverflowY					null
					onOverflowX					null
					onOverflowYNone				null
					onOverflowXNone				null
					onImageLoad					null
					onSelectorChange			null
					onUpdate					null
				*/
                onTotalScrollOffset: 0,
                onTotalScrollBackOffset: 0,
                alwaysTriggerOffsets: true
            }
        }, /* 
	----------------------------------------
	VARS, CONSTANTS 
	----------------------------------------
	*/
        f = 0, /* plugin instances amount */
        g = {}, /* live option timers */
        h = window.attachEvent && !window.addEventListener ? 1 : 0, /* detect IE < 9 */
        i = false, j, /* global touch vars (for touch and pointer events) */
        /* general plugin classes */
        k = [ "mCSB_dragger_onDrag", "mCSB_scrollTools_onDrag", "mCS_img_loaded", "mCS_disabled", "mCS_destroyed", "mCS_no_scrollbar", "mCS-autoHide", "mCS-dir-rtl", "mCS_no_scrollbar_y", "mCS_no_scrollbar_x", "mCS_y_hidden", "mCS_x_hidden", "mCSB_draggerContainer", "mCSB_buttonUp", "mCSB_buttonDown", "mCSB_buttonLeft", "mCSB_buttonRight" ], /* 
	----------------------------------------
	METHODS 
	----------------------------------------
	*/
        l = {
            /* 
			plugin initialization method 
			creates the scrollbar(s), plugin data object and options
			----------------------------------------
			*/
            init: function(b) {
                var b = a.extend(true, {}, e, b), h = m.call(this);
                /* validate selector */
                /* 
				if live option is enabled, monitor for elements matching the current selector and 
				apply scrollbar(s) when found (now and in the future) 
				*/
                if (b.live) {
                    var i = b.liveSelector || this.selector || d, /* live selector(s) */
                    j = a(i);
                    /* live selector(s) as jquery object */
                    if (b.live === "off") {
                        /* 
						disable live if requested 
						usage: $(selector).mCustomScrollbar({live:"off"}); 
						*/
                        o(i);
                        return;
                    }
                    g[i] = setTimeout(function() {
                        /* call mCustomScrollbar fn on live selector(s) every half-second */
                        j.mCustomScrollbar(b);
                        if (b.live === "once" && j.length) {
                            /* disable live after first invocation */
                            o(i);
                        }
                    }, 500);
                } else {
                    o(i);
                }
                /* options backward compatibility (for versions < 3.0.0) and normalization */
                b.setWidth = b.set_width ? b.set_width : b.setWidth;
                b.setHeight = b.set_height ? b.set_height : b.setHeight;
                b.axis = b.horizontalScroll ? "x" : p(b.axis);
                b.scrollInertia = b.scrollInertia > 0 && b.scrollInertia < 17 ? 17 : b.scrollInertia;
                if (typeof b.mouseWheel !== "object" && b.mouseWheel == true) {
                    /* old school mouseWheel option (non-object) */
                    b.mouseWheel = {
                        enable: true,
                        scrollAmount: "auto",
                        axis: "y",
                        preventDefault: false,
                        deltaFactor: "auto",
                        normalizeDelta: false,
                        invert: false
                    };
                }
                b.mouseWheel.scrollAmount = !b.mouseWheelPixels ? b.mouseWheel.scrollAmount : b.mouseWheelPixels;
                b.mouseWheel.normalizeDelta = !b.advanced.normalizeMouseWheelDelta ? b.mouseWheel.normalizeDelta : b.advanced.normalizeMouseWheelDelta;
                b.scrollButtons.scrollType = q(b.scrollButtons.scrollType);
                n(b);
                /* theme-specific options */
                /* plugin constructor */
                return a(h).each(function() {
                    var d = a(this);
                    if (!d.data(c)) {
                        /* prevent multiple instantiations */
                        /* store options and create objects in jquery data */
                        d.data(c, {
                            idx: ++f,
                            /* instance index */
                            opt: b,
                            /* options */
                            scrollRatio: {
                                y: null,
                                x: null
                            },
                            /* scrollbar to content ratio */
                            overflowed: null,
                            /* overflowed axis */
                            contentReset: {
                                y: null,
                                x: null
                            },
                            /* object to check when content resets */
                            bindEvents: false,
                            /* object to check if events are bound */
                            tweenRunning: false,
                            /* object to check if tween is running */
                            sequential: {},
                            /* sequential scrolling object */
                            langDir: d.css("direction"),
                            /* detect/store direction (ltr or rtl) */
                            cbOffsets: null,
                            /* object to check whether callback offsets always trigger */
                            /* 
							object to check how scrolling events where last triggered 
							"internal" (default - triggered by this script), "external" (triggered by other scripts, e.g. via scrollTo method) 
							usage: object.data("mCS").trigger
							*/
                            trigger: null
                        });
                        var e = d.data(c), g = e.opt, /* HTML data attributes */
                        h = d.data("mcs-axis"), i = d.data("mcs-scrollbar-position"), j = d.data("mcs-theme");
                        if (h) {
                            g.axis = h;
                        }
                        /* usage example: data-mcs-axis="y" */
                        if (i) {
                            g.scrollbarPosition = i;
                        }
                        /* usage example: data-mcs-scrollbar-position="outside" */
                        if (j) {
                            /* usage example: data-mcs-theme="minimal" */
                            g.theme = j;
                            n(g);
                        }
                        r.call(this);
                        /* add plugin markup */
                        a("#mCSB_" + e.idx + "_container img:not(." + k[2] + ")").addClass(k[2]);
                        /* flag loaded images */
                        l.update.call(null, d);
                    }
                });
            },
            /* ---------------------------------------- */
            /* 
			plugin update method 
			updates content and scrollbar(s) values, events and status 
			----------------------------------------
			usage: $(selector).mCustomScrollbar("update");
			*/
            update: function(b, d) {
                var e = b || m.call(this);
                /* validate selector */
                return a(e).each(function() {
                    var b = a(this);
                    if (b.data(c)) {
                        /* check if plugin has initialized */
                        var e = b.data(c), f = e.opt, g = a("#mCSB_" + e.idx + "_container"), h = [ a("#mCSB_" + e.idx + "_dragger_vertical"), a("#mCSB_" + e.idx + "_dragger_horizontal") ];
                        if (!g.length) {
                            return;
                        }
                        if (e.tweenRunning) {
                            V(b);
                        }
                        /* stop any running tweens while updating */
                        /* if element was disabled or destroyed, remove class(es) */
                        if (b.hasClass(k[3])) {
                            b.removeClass(k[3]);
                        }
                        if (b.hasClass(k[4])) {
                            b.removeClass(k[4]);
                        }
                        v.call(this);
                        /* detect/set css max-height value */
                        t.call(this);
                        /* expand content horizontally */
                        if (f.axis !== "y" && !f.advanced.autoExpandHorizontalScroll) {
                            g.css("width", s(g.children()));
                        }
                        e.overflowed = z.call(this);
                        /* determine if scrolling is required */
                        D.call(this);
                        /* show/hide scrollbar(s) */
                        /* auto-adjust scrollbar dragger length analogous to content */
                        if (f.autoDraggerLength) {
                            w.call(this);
                        }
                        x.call(this);
                        /* calculate and store scrollbar to content ratio */
                        B.call(this);
                        /* bind scrollbar events */
                        /* reset scrolling position and/or events */
                        var i = [ Math.abs(g[0].offsetTop), Math.abs(g[0].offsetLeft) ];
                        if (f.axis !== "x") {
                            /* y/yx axis */
                            if (!e.overflowed[0]) {
                                /* y scrolling is not required */
                                A.call(this);
                                /* reset content position */
                                if (f.axis === "y") {
                                    C.call(this);
                                } else if (f.axis === "yx" && e.overflowed[1]) {
                                    W(b, i[1].toString(), {
                                        dir: "x",
                                        dur: 0,
                                        overwrite: "none"
                                    });
                                }
                            } else if (h[0].height() > h[0].parent().height()) {
                                A.call(this);
                            } else {
                                /* y scrolling is required */
                                W(b, i[0].toString(), {
                                    dir: "y",
                                    dur: 0,
                                    overwrite: "none"
                                });
                                e.contentReset.y = null;
                            }
                        }
                        if (f.axis !== "y") {
                            /* x/yx axis */
                            if (!e.overflowed[1]) {
                                /* x scrolling is not required */
                                A.call(this);
                                /* reset content position */
                                if (f.axis === "x") {
                                    C.call(this);
                                } else if (f.axis === "yx" && e.overflowed[0]) {
                                    W(b, i[0].toString(), {
                                        dir: "y",
                                        dur: 0,
                                        overwrite: "none"
                                    });
                                }
                            } else if (h[1].width() > h[1].parent().width()) {
                                A.call(this);
                            } else {
                                /* x scrolling is required */
                                W(b, i[1].toString(), {
                                    dir: "x",
                                    dur: 0,
                                    overwrite: "none"
                                });
                                e.contentReset.x = null;
                            }
                        }
                        /* callbacks: onImageLoad, onSelectorChange, onUpdate */
                        if (d && e) {
                            if (d === 2 && f.callbacks.onImageLoad && typeof f.callbacks.onImageLoad === "function") {
                                f.callbacks.onImageLoad.call(this);
                            } else if (d === 3 && f.callbacks.onSelectorChange && typeof f.callbacks.onSelectorChange === "function") {
                                f.callbacks.onSelectorChange.call(this);
                            } else if (f.callbacks.onUpdate && typeof f.callbacks.onUpdate === "function") {
                                f.callbacks.onUpdate.call(this);
                            }
                        }
                        T.call(this);
                    }
                });
            },
            /* ---------------------------------------- */
            /* 
			plugin scrollTo method 
			triggers a scrolling event to a specific value
			----------------------------------------
			usage: $(selector).mCustomScrollbar("scrollTo",value,options);
			*/
            scrollTo: function(b, d) {
                /* prevent silly things like $(selector).mCustomScrollbar("scrollTo",undefined); */
                if (typeof b == "undefined" || b == null) {
                    return;
                }
                var e = m.call(this);
                /* validate selector */
                return a(e).each(function() {
                    var e = a(this);
                    if (e.data(c)) {
                        /* check if plugin has initialized */
                        var f = e.data(c), g = f.opt, /* method default options */
                        h = {
                            trigger: "external",
                            /* method is by default triggered externally (e.g. from other scripts) */
                            scrollInertia: g.scrollInertia,
                            /* scrolling inertia (animation duration) */
                            scrollEasing: "mcsEaseInOut",
                            /* animation easing */
                            moveDragger: false,
                            /* move dragger instead of content */
                            timeout: 60,
                            /* scroll-to delay */
                            callbacks: true,
                            /* enable/disable callbacks */
                            onStart: true,
                            onUpdate: true,
                            onComplete: true
                        }, i = a.extend(true, {}, h, d), j = R.call(this, b), k = i.scrollInertia > 0 && i.scrollInertia < 17 ? 17 : i.scrollInertia;
                        /* translate yx values to actual scroll-to positions */
                        j[0] = S.call(this, j[0], "y");
                        j[1] = S.call(this, j[1], "x");
                        /* 
						check if scroll-to value moves the dragger instead of content. 
						Only pixel values apply on dragger (e.g. 100, "100px", "-=100" etc.) 
						*/
                        if (i.moveDragger) {
                            j[0] *= f.scrollRatio.y;
                            j[1] *= f.scrollRatio.x;
                        }
                        i.dur = k;
                        setTimeout(function() {
                            /* do the scrolling */
                            if (j[0] !== null && typeof j[0] !== "undefined" && g.axis !== "x" && f.overflowed[0]) {
                                /* scroll y */
                                i.dir = "y";
                                i.overwrite = "all";
                                W(e, j[0].toString(), i);
                            }
                            if (j[1] !== null && typeof j[1] !== "undefined" && g.axis !== "y" && f.overflowed[1]) {
                                /* scroll x */
                                i.dir = "x";
                                i.overwrite = "none";
                                W(e, j[1].toString(), i);
                            }
                        }, i.timeout);
                    }
                });
            },
            /* ---------------------------------------- */
            /*
			plugin stop method 
			stops scrolling animation
			----------------------------------------
			usage: $(selector).mCustomScrollbar("stop");
			*/
            stop: function() {
                var b = m.call(this);
                /* validate selector */
                return a(b).each(function() {
                    var b = a(this);
                    if (b.data(c)) {
                        /* check if plugin has initialized */
                        V(b);
                    }
                });
            },
            /* ---------------------------------------- */
            /*
			plugin disable method 
			temporarily disables the scrollbar(s) 
			----------------------------------------
			usage: $(selector).mCustomScrollbar("disable",reset); 
			reset (boolean): resets content position to 0 
			*/
            disable: function(b) {
                var d = m.call(this);
                /* validate selector */
                return a(d).each(function() {
                    var d = a(this);
                    if (d.data(c)) {
                        /* check if plugin has initialized */
                        var e = d.data(c);
                        T.call(this, "remove");
                        /* remove automatic updating */
                        C.call(this);
                        /* unbind events */
                        if (b) {
                            A.call(this);
                        }
                        /* reset content position */
                        D.call(this, true);
                        /* show/hide scrollbar(s) */
                        d.addClass(k[3]);
                    }
                });
            },
            /* ---------------------------------------- */
            /*
			plugin destroy method 
			completely removes the scrollbar(s) and returns the element to its original state
			----------------------------------------
			usage: $(selector).mCustomScrollbar("destroy"); 
			*/
            destroy: function() {
                var d = m.call(this);
                /* validate selector */
                return a(d).each(function() {
                    var e = a(this);
                    if (e.data(c)) {
                        /* check if plugin has initialized */
                        var f = e.data(c), g = f.opt, h = a("#mCSB_" + f.idx), i = a("#mCSB_" + f.idx + "_container"), j = a(".mCSB_" + f.idx + "_scrollbar");
                        if (g.live) {
                            o(g.liveSelector || a(d).selector);
                        }
                        /* remove live timers */
                        T.call(this, "remove");
                        /* remove automatic updating */
                        C.call(this);
                        /* unbind events */
                        A.call(this);
                        /* reset content position */
                        e.removeData(c);
                        /* remove plugin data object */
                        $(this, "mcs");
                        /* delete callbacks object */
                        /* remove plugin markup */
                        j.remove();
                        /* remove scrollbar(s) first (those can be either inside or outside plugin's inner wrapper) */
                        i.find("img." + k[2]).removeClass(k[2]);
                        /* remove loaded images flag */
                        h.replaceWith(i.contents());
                        /* replace plugin's inner wrapper with the original content */
                        /* remove plugin classes from the element and add destroy class */
                        e.removeClass(b + " _" + c + "_" + f.idx + " " + k[6] + " " + k[7] + " " + k[5] + " " + k[3]).addClass(k[4]);
                    }
                });
            }
        }, /* 
	----------------------------------------
	FUNCTIONS
	----------------------------------------
	*/
        /* validates selector (if selector is invalid or undefined uses the default one) */
        m = function() {
            return typeof a(this) !== "object" || a(this).length < 1 ? d : this;
        }, /* -------------------- */
        /* changes options according to theme */
        n = function(b) {
            var c = [ "rounded", "rounded-dark", "rounded-dots", "rounded-dots-dark" ], d = [ "rounded-dots", "rounded-dots-dark", "3d", "3d-dark", "3d-thick", "3d-thick-dark", "inset", "inset-dark", "inset-2", "inset-2-dark", "inset-3", "inset-3-dark" ], e = [ "minimal", "minimal-dark" ], f = [ "minimal", "minimal-dark" ], g = [ "minimal", "minimal-dark" ];
            b.autoDraggerLength = a.inArray(b.theme, c) > -1 ? false : b.autoDraggerLength;
            b.autoExpandScrollbar = a.inArray(b.theme, d) > -1 ? false : b.autoExpandScrollbar;
            b.scrollButtons.enable = a.inArray(b.theme, e) > -1 ? false : b.scrollButtons.enable;
            b.autoHideScrollbar = a.inArray(b.theme, f) > -1 ? true : b.autoHideScrollbar;
            b.scrollbarPosition = a.inArray(b.theme, g) > -1 ? "outside" : b.scrollbarPosition;
        }, /* -------------------- */
        /* live option timers removal */
        o = function(a) {
            if (g[a]) {
                clearTimeout(g[a]);
                $(g, a);
            }
        }, /* -------------------- */
        /* normalizes axis option to valid values: "y", "x", "yx" */
        p = function(a) {
            return a === "yx" || a === "xy" || a === "auto" ? "yx" : a === "x" || a === "horizontal" ? "x" : "y";
        }, /* -------------------- */
        /* normalizes scrollButtons.scrollType option to valid values: "stepless", "stepped" */
        q = function(a) {
            return a === "stepped" || a === "pixels" || a === "step" || a === "click" ? "stepped" : "stepless";
        }, /* -------------------- */
        /* generates plugin markup */
        r = function() {
            var d = a(this), e = d.data(c), f = e.opt, g = f.autoExpandScrollbar ? " " + k[1] + "_expand" : "", h = [ "<div id='mCSB_" + e.idx + "_scrollbar_vertical' class='mCSB_scrollTools mCSB_" + e.idx + "_scrollbar mCS-" + f.theme + " mCSB_scrollTools_vertical" + g + "'><div class='" + k[12] + "'><div id='mCSB_" + e.idx + "_dragger_vertical' class='mCSB_dragger' style='position:absolute;' oncontextmenu='return false;'><div class='mCSB_dragger_bar' /></div><div class='mCSB_draggerRail' /></div></div>", "<div id='mCSB_" + e.idx + "_scrollbar_horizontal' class='mCSB_scrollTools mCSB_" + e.idx + "_scrollbar mCS-" + f.theme + " mCSB_scrollTools_horizontal" + g + "'><div class='" + k[12] + "'><div id='mCSB_" + e.idx + "_dragger_horizontal' class='mCSB_dragger' style='position:absolute;' oncontextmenu='return false;'><div class='mCSB_dragger_bar' /></div><div class='mCSB_draggerRail' /></div></div>" ], i = f.axis === "yx" ? "mCSB_vertical_horizontal" : f.axis === "x" ? "mCSB_horizontal" : "mCSB_vertical", j = f.axis === "yx" ? h[0] + h[1] : f.axis === "x" ? h[1] : h[0], l = f.axis === "yx" ? "<div id='mCSB_" + e.idx + "_container_wrapper' class='mCSB_container_wrapper' />" : "", m = f.autoHideScrollbar ? " " + k[6] : "", n = f.axis !== "x" && e.langDir === "rtl" ? " " + k[7] : "";
            if (f.setWidth) {
                d.css("width", f.setWidth);
            }
            /* set element width */
            if (f.setHeight) {
                d.css("height", f.setHeight);
            }
            /* set element height */
            f.setLeft = f.axis !== "y" && e.langDir === "rtl" ? "989999px" : f.setLeft;
            /* adjust left position for rtl direction */
            d.addClass(b + " _" + c + "_" + e.idx + m + n).wrapInner("<div id='mCSB_" + e.idx + "' class='mCustomScrollBox mCS-" + f.theme + " " + i + "'><div id='mCSB_" + e.idx + "_container' class='mCSB_container' style='position:relative; top:" + f.setTop + "; left:" + f.setLeft + ";' dir=" + e.langDir + " /></div>");
            var o = a("#mCSB_" + e.idx), p = a("#mCSB_" + e.idx + "_container");
            if (f.axis !== "y" && !f.advanced.autoExpandHorizontalScroll) {
                p.css("width", s(p.children()));
            }
            if (f.scrollbarPosition === "outside") {
                if (d.css("position") === "static") {
                    /* requires elements with non-static position */
                    d.css("position", "relative");
                }
                d.css("overflow", "visible");
                o.addClass("mCSB_outside").after(j);
            } else {
                o.addClass("mCSB_inside").append(j);
                p.wrap(l);
            }
            u.call(this);
            /* add scrollbar buttons */
            /* minimum dragger length */
            var q = [ a("#mCSB_" + e.idx + "_dragger_vertical"), a("#mCSB_" + e.idx + "_dragger_horizontal") ];
            q[0].css("min-height", q[0].height());
            q[1].css("min-width", q[1].width());
        }, /* -------------------- */
        /* calculates content width */
        s = function(b) {
            return Math.max.apply(Math, b.map(function() {
                return a(this).outerWidth(true);
            }).get());
        }, /* -------------------- */
        /* expands content horizontally */
        t = function() {
            var b = a(this), d = b.data(c), e = d.opt, f = a("#mCSB_" + d.idx + "_container");
            if (e.advanced.autoExpandHorizontalScroll && e.axis !== "y") {
                /* 
				wrap content with an infinite width div and set its position to absolute and width to auto. 
				Setting width to auto before calculating the actual width is important! 
				We must let the browser set the width as browser zoom values are impossible to calculate.
				*/
                f.css({
                    position: "absolute",
                    width: "auto"
                }).wrap("<div class='mCSB_h_wrapper' style='position:relative; left:0; width:999999px;' />").css({
                    /* set actual width, original position and un-wrap */
                    /* 
						get the exact width (with decimals) and then round-up. 
						Using jquery outerWidth() will round the width value which will mess up with inner elements that have non-integer width
						*/
                    width: Math.ceil(f[0].getBoundingClientRect().right + .4) - Math.floor(f[0].getBoundingClientRect().left),
                    position: "relative"
                }).unwrap();
            }
        }, /* -------------------- */
        /* adds scrollbar buttons */
        u = function() {
            var b = a(this), d = b.data(c), e = d.opt, f = a(".mCSB_" + d.idx + "_scrollbar:first"), g = !ba(e.scrollButtons.tabindex) ? "" : "tabindex='" + e.scrollButtons.tabindex + "'", h = [ "<a href='#' class='" + k[13] + "' oncontextmenu='return false;' " + g + " />", "<a href='#' class='" + k[14] + "' oncontextmenu='return false;' " + g + " />", "<a href='#' class='" + k[15] + "' oncontextmenu='return false;' " + g + " />", "<a href='#' class='" + k[16] + "' oncontextmenu='return false;' " + g + " />" ], i = [ e.axis === "x" ? h[2] : h[0], e.axis === "x" ? h[3] : h[1], h[2], h[3] ];
            if (e.scrollButtons.enable) {
                f.prepend(i[0]).append(i[1]).next(".mCSB_scrollTools").prepend(i[2]).append(i[3]);
            }
        }, /* -------------------- */
        /* detects/sets css max-height value */
        v = function() {
            var b = a(this), d = b.data(c), e = a("#mCSB_" + d.idx), f = b.css("max-height") || "none", g = f.indexOf("%") !== -1, h = b.css("box-sizing");
            if (f !== "none") {
                var i = g ? b.parent().height() * parseInt(f) / 100 : parseInt(f);
                /* if element's css box-sizing is "border-box", subtract any paddings and/or borders from max-height value */
                if (h === "border-box") {
                    i -= b.innerHeight() - b.height() + (b.outerHeight() - b.innerHeight());
                }
                e.css("max-height", Math.round(i));
            }
        }, /* -------------------- */
        /* auto-adjusts scrollbar dragger length */
        w = function() {
            var b = a(this), d = b.data(c), e = a("#mCSB_" + d.idx), f = a("#mCSB_" + d.idx + "_container"), g = [ a("#mCSB_" + d.idx + "_dragger_vertical"), a("#mCSB_" + d.idx + "_dragger_horizontal") ], i = [ e.height() / f.outerHeight(false), e.width() / f.outerWidth(false) ], j = [ parseInt(g[0].css("min-height")), Math.round(i[0] * g[0].parent().height()), parseInt(g[1].css("min-width")), Math.round(i[1] * g[1].parent().width()) ], k = h && j[1] < j[0] ? j[0] : j[1], l = h && j[3] < j[2] ? j[2] : j[3];
            g[0].css({
                height: k,
                "max-height": g[0].parent().height() - 10
            }).find(".mCSB_dragger_bar").css({
                "line-height": j[0] + "px"
            });
            g[1].css({
                width: l,
                "max-width": g[1].parent().width() - 10
            });
        }, /* -------------------- */
        /* calculates scrollbar to content ratio */
        x = function() {
            var b = a(this), d = b.data(c), e = a("#mCSB_" + d.idx), f = a("#mCSB_" + d.idx + "_container"), g = [ a("#mCSB_" + d.idx + "_dragger_vertical"), a("#mCSB_" + d.idx + "_dragger_horizontal") ], h = [ f.outerHeight(false) - e.height(), f.outerWidth(false) - e.width() ], i = [ h[0] / (g[0].parent().height() - g[0].height()), h[1] / (g[1].parent().width() - g[1].width()) ];
            d.scrollRatio = {
                y: i[0],
                x: i[1]
            };
        }, /* -------------------- */
        /* toggles scrolling classes */
        y = function(a, b, c) {
            var d = c ? k[0] + "_expanded" : "", e = a.closest(".mCSB_scrollTools");
            if (b === "active") {
                a.toggleClass(k[0] + " " + d);
                e.toggleClass(k[1]);
                a[0]._draggable = a[0]._draggable ? 0 : 1;
            } else {
                if (!a[0]._draggable) {
                    if (b === "hide") {
                        a.removeClass(k[0]);
                        e.removeClass(k[1]);
                    } else {
                        a.addClass(k[0]);
                        e.addClass(k[1]);
                    }
                }
            }
        }, /* -------------------- */
        /* checks if content overflows its container to determine if scrolling is required */
        z = function() {
            var b = a(this), d = b.data(c), e = a("#mCSB_" + d.idx), f = a("#mCSB_" + d.idx + "_container"), g = d.overflowed == null ? f.height() : f.outerHeight(false), h = d.overflowed == null ? f.width() : f.outerWidth(false);
            return [ g > e.height(), h > e.width() ];
        }, /* -------------------- */
        /* resets content position to 0 */
        A = function() {
            var b = a(this), d = b.data(c), e = d.opt, f = a("#mCSB_" + d.idx), g = a("#mCSB_" + d.idx + "_container"), h = [ a("#mCSB_" + d.idx + "_dragger_vertical"), a("#mCSB_" + d.idx + "_dragger_horizontal") ];
            V(b);
            /* stop any current scrolling before resetting */
            if (e.axis !== "x" && !d.overflowed[0] || e.axis === "y" && d.overflowed[0]) {
                /* reset y */
                h[0].add(g).css("top", 0);
                W(b, "_resetY");
            }
            if (e.axis !== "y" && !d.overflowed[1] || e.axis === "x" && d.overflowed[1]) {
                /* reset x */
                var i = dx = 0;
                if (d.langDir === "rtl") {
                    /* adjust left position for rtl direction */
                    i = f.width() - g.outerWidth(false);
                    dx = Math.abs(i / d.scrollRatio.x);
                }
                g.css("left", i);
                h[1].css("left", dx);
                W(b, "_resetX");
            }
        }, /* -------------------- */
        /* binds scrollbar events */
        B = function() {
            var b = a(this), d = b.data(c), e = d.opt;
            if (!d.bindEvents) {
                /* check if events are already bound */
                F.call(this);
                if (e.contentTouchScroll) {
                    G.call(this);
                }
                H.call(this);
                if (e.mouseWheel.enable) {
                    /* bind mousewheel fn when plugin is available */
                    function f() {
                        g = setTimeout(function() {
                            if (!a.event.special.mousewheel) {
                                f();
                            } else {
                                clearTimeout(g);
                                I.call(b[0]);
                            }
                        }, 100);
                    }
                    var g;
                    f();
                }
                L.call(this);
                N.call(this);
                if (e.advanced.autoScrollOnFocus) {
                    M.call(this);
                }
                if (e.scrollButtons.enable) {
                    O.call(this);
                }
                if (e.keyboard.enable) {
                    P.call(this);
                }
                d.bindEvents = true;
            }
        }, /* -------------------- */
        /* unbinds scrollbar events */
        C = function() {
            var b = a(this), d = b.data(c), e = d.opt, f = c + "_" + d.idx, g = ".mCSB_" + d.idx + "_scrollbar", h = a("#mCSB_" + d.idx + ",#mCSB_" + d.idx + "_container,#mCSB_" + d.idx + "_container_wrapper," + g + " ." + k[12] + ",#mCSB_" + d.idx + "_dragger_vertical,#mCSB_" + d.idx + "_dragger_horizontal," + g + ">a"), i = a("#mCSB_" + d.idx + "_container");
            if (e.advanced.releaseDraggableSelectors) {
                h.add(a(e.advanced.releaseDraggableSelectors));
            }
            if (d.bindEvents) {
                /* check if events are bound */
                /* unbind namespaced events from document/selectors */
                a(document).unbind("." + f);
                h.each(function() {
                    a(this).unbind("." + f);
                });
                /* clear and delete timeouts/objects */
                clearTimeout(b[0]._focusTimeout);
                $(b[0], "_focusTimeout");
                clearTimeout(d.sequential.step);
                $(d.sequential, "step");
                clearTimeout(i[0].onCompleteTimeout);
                $(i[0], "onCompleteTimeout");
                d.bindEvents = false;
            }
        }, /* -------------------- */
        /* toggles scrollbar visibility */
        D = function(b) {
            var d = a(this), e = d.data(c), f = e.opt, g = a("#mCSB_" + e.idx + "_container_wrapper"), h = g.length ? g : a("#mCSB_" + e.idx + "_container"), i = [ a("#mCSB_" + e.idx + "_scrollbar_vertical"), a("#mCSB_" + e.idx + "_scrollbar_horizontal") ], j = [ i[0].find(".mCSB_dragger"), i[1].find(".mCSB_dragger") ];
            if (f.axis !== "x") {
                if (e.overflowed[0] && !b) {
                    i[0].add(j[0]).add(i[0].children("a")).css("display", "block");
                    h.removeClass(k[8] + " " + k[10]);
                } else {
                    if (f.alwaysShowScrollbar) {
                        if (f.alwaysShowScrollbar !== 2) {
                            j[0].css("display", "none");
                        }
                        h.removeClass(k[10]);
                    } else {
                        i[0].css("display", "none");
                        h.addClass(k[10]);
                    }
                    h.addClass(k[8]);
                }
            }
            if (f.axis !== "y") {
                if (e.overflowed[1] && !b) {
                    i[1].add(j[1]).add(i[1].children("a")).css("display", "block");
                    h.removeClass(k[9] + " " + k[11]);
                } else {
                    if (f.alwaysShowScrollbar) {
                        if (f.alwaysShowScrollbar !== 2) {
                            j[1].css("display", "none");
                        }
                        h.removeClass(k[11]);
                    } else {
                        i[1].css("display", "none");
                        h.addClass(k[11]);
                    }
                    h.addClass(k[9]);
                }
            }
            if (!e.overflowed[0] && !e.overflowed[1]) {
                d.addClass(k[5]);
            } else {
                d.removeClass(k[5]);
            }
        }, /* -------------------- */
        /* returns input coordinates of pointer, touch and mouse events (relative to document) */
        E = function(a) {
            var b = a.type;
            switch (b) {
              case "pointerdown":
              case "MSPointerDown":
              case "pointermove":
              case "MSPointerMove":
              case "pointerup":
              case "MSPointerUp":
                return a.target.ownerDocument !== document ? [ a.originalEvent.screenY, a.originalEvent.screenX, false ] : [ a.originalEvent.pageY, a.originalEvent.pageX, false ];
                break;

              case "touchstart":
              case "touchmove":
              case "touchend":
                var c = a.originalEvent.touches[0] || a.originalEvent.changedTouches[0], d = a.originalEvent.touches.length || a.originalEvent.changedTouches.length;
                return a.target.ownerDocument !== document ? [ c.screenY, c.screenX, d > 1 ] : [ c.pageY, c.pageX, d > 1 ];
                break;

              default:
                return [ a.pageY, a.pageX, false ];
            }
        }, /* -------------------- */
        /* 
		SCROLLBAR DRAG EVENTS
		scrolls content via scrollbar dragging 
		*/
        F = function() {
            var b = a(this), d = b.data(c), e = d.opt, f = c + "_" + d.idx, g = [ "mCSB_" + d.idx + "_dragger_vertical", "mCSB_" + d.idx + "_dragger_horizontal" ], j = a("#mCSB_" + d.idx + "_container"), k = a("#" + g[0] + ",#" + g[1]), l, m, n, o = e.advanced.releaseDraggableSelectors ? k.add(a(e.advanced.releaseDraggableSelectors)) : k;
            k.bind("mousedown." + f + " touchstart." + f + " pointerdown." + f + " MSPointerDown." + f, function(c) {
                c.stopImmediatePropagation();
                c.preventDefault();
                if (!_(c)) {
                    return;
                }
                /* left mouse button only */
                i = true;
                if (h) {
                    document.onselectstart = function() {
                        return false;
                    };
                }
                /* disable text selection for IE < 9 */
                p(false);
                /* enable scrollbar dragging over iframes by disabling their events */
                V(b);
                l = a(this);
                var d = l.offset(), f = E(c)[0] - d.top, g = E(c)[1] - d.left, j = l.height() + d.top, k = l.width() + d.left;
                if (f < j && f > 0 && g < k && g > 0) {
                    m = f;
                    n = g;
                }
                y(l, "active", e.autoExpandScrollbar);
            }).bind("touchmove." + f, function(a) {
                a.stopImmediatePropagation();
                a.preventDefault();
                var b = l.offset(), c = E(a)[0] - b.top, d = E(a)[1] - b.left;
                q(m, n, c, d);
            });
            a(document).bind("mousemove." + f + " pointermove." + f + " MSPointerMove." + f, function(a) {
                if (l) {
                    var b = l.offset(), c = E(a)[0] - b.top, d = E(a)[1] - b.left;
                    if (m === c) {
                        return;
                    }
                    /* has it really moved? */
                    q(m, n, c, d);
                }
            }).add(o).bind("mouseup." + f + " touchend." + f + " pointerup." + f + " MSPointerUp." + f, function(a) {
                if (l) {
                    y(l, "active", e.autoExpandScrollbar);
                    l = null;
                }
                i = false;
                if (h) {
                    document.onselectstart = null;
                }
                /* enable text selection for IE < 9 */
                p(true);
            });
            function p(a) {
                var b = j.find("iframe");
                if (!b.length) {
                    return;
                }
                /* check if content contains iframes */
                var c = !a ? "none" : "auto";
                b.css("pointer-events", c);
            }
            function q(a, c, f, h) {
                j[0].idleTimer = e.scrollInertia < 233 ? 250 : 0;
                if (l.attr("id") === g[1]) {
                    var i = "x", k = (l[0].offsetLeft - c + h) * d.scrollRatio.x;
                } else {
                    var i = "y", k = (l[0].offsetTop - a + f) * d.scrollRatio.y;
                }
                W(b, k.toString(), {
                    dir: i,
                    drag: true
                });
            }
        }, /* -------------------- */
        /* 
		TOUCH SWIPE EVENTS
		scrolls content via touch swipe 
		Emulates the native touch-swipe scrolling with momentum found in iOS, Android and WP devices 
		*/
        G = function() {
            var b = a(this), d = b.data(c), e = d.opt, f = c + "_" + d.idx, g = a("#mCSB_" + d.idx), h = a("#mCSB_" + d.idx + "_container"), k = [ a("#mCSB_" + d.idx + "_dragger_vertical"), a("#mCSB_" + d.idx + "_dragger_horizontal") ], l, m, n, o, p = [], q = [], r, s, t, u, v, w, x = 0, y, z = e.axis === "yx" ? "none" : "all", A = [], B, C, D = h.find("iframe"), F = [ "touchstart." + f + " pointerdown." + f + " MSPointerDown." + f, //start
            "touchmove." + f + " pointermove." + f + " MSPointerMove." + f, //move
            "touchend." + f + " pointerup." + f + " MSPointerUp." + f ];
            h.bind(F[0], function(a) {
                G(a);
            }).bind(F[1], function(a) {
                H(a);
            });
            g.bind(F[0], function(a) {
                I(a);
            }).bind(F[2], function(a) {
                K(a);
            });
            if (D.length) {
                D.each(function() {
                    a(this).load(function() {
                        /* bind events on accessible iframes */
                        if (J(this)) {
                            a(this.contentDocument || this.contentWindow.document).bind(F[0], function(a) {
                                G(a);
                                I(a);
                            }).bind(F[1], function(a) {
                                H(a);
                            }).bind(F[2], function(a) {
                                K(a);
                            });
                        }
                    });
                });
            }
            function G(a) {
                if (!aa(a) || i || E(a)[2]) {
                    j = 0;
                    return;
                }
                j = 1;
                B = 0;
                C = 0;
                b.removeClass("mCS_touch_action");
                var c = h.offset();
                l = E(a)[0] - c.top;
                m = E(a)[1] - c.left;
                A = [ E(a)[0], E(a)[1] ];
            }
            function H(a) {
                if (!aa(a) || i || E(a)[2]) {
                    return;
                }
                a.stopImmediatePropagation();
                if (C && !B) {
                    return;
                }
                s = Y();
                var c = g.offset(), f = E(a)[0] - c.top, j = E(a)[1] - c.left, n = "mcsLinearOut";
                p.push(f);
                q.push(j);
                A[2] = Math.abs(E(a)[0] - A[0]);
                A[3] = Math.abs(E(a)[1] - A[1]);
                if (d.overflowed[0]) {
                    var o = k[0].parent().height() - k[0].height(), r = l - f > 0 && f - l > -(o * d.scrollRatio.y) && (A[3] * 2 < A[2] || e.axis === "yx");
                }
                if (d.overflowed[1]) {
                    var t = k[1].parent().width() - k[1].width(), u = m - j > 0 && j - m > -(t * d.scrollRatio.x) && (A[2] * 2 < A[3] || e.axis === "yx");
                }
                if (r || u) {
                    /* prevent native document scrolling */
                    a.preventDefault();
                    B = 1;
                } else {
                    C = 1;
                    b.addClass("mCS_touch_action");
                }
                w = e.axis === "yx" ? [ l - f, m - j ] : e.axis === "x" ? [ null, m - j ] : [ l - f, null ];
                h[0].idleTimer = 250;
                if (d.overflowed[0]) {
                    M(w[0], x, n, "y", "all", true);
                }
                if (d.overflowed[1]) {
                    M(w[1], x, n, "x", z, true);
                }
            }
            function I(a) {
                if (!aa(a) || i || E(a)[2]) {
                    j = 0;
                    return;
                }
                j = 1;
                a.stopImmediatePropagation();
                V(b);
                r = Y();
                var c = g.offset();
                n = E(a)[0] - c.top;
                o = E(a)[1] - c.left;
                p = [];
                q = [];
            }
            function K(a) {
                if (!aa(a) || i || E(a)[2]) {
                    return;
                }
                a.stopImmediatePropagation();
                B = 0;
                C = 0;
                t = Y();
                var b = g.offset(), c = E(a)[0] - b.top, f = E(a)[1] - b.left;
                if (t - s > 30) {
                    return;
                }
                v = 1e3 / (t - r);
                var j = "mcsEaseOut", k = v < 2.5, l = k ? [ p[p.length - 2], q[q.length - 2] ] : [ 0, 0 ];
                u = k ? [ c - l[0], f - l[1] ] : [ c - n, f - o ];
                var m = [ Math.abs(u[0]), Math.abs(u[1]) ];
                v = k ? [ Math.abs(u[0] / 4), Math.abs(u[1] / 4) ] : [ v, v ];
                var x = [ Math.abs(h[0].offsetTop) - u[0] * L(m[0] / v[0], v[0]), Math.abs(h[0].offsetLeft) - u[1] * L(m[1] / v[1], v[1]) ];
                w = e.axis === "yx" ? [ x[0], x[1] ] : e.axis === "x" ? [ null, x[1] ] : [ x[0], null ];
                y = [ m[0] * 4 + e.scrollInertia, m[1] * 4 + e.scrollInertia ];
                var A = parseInt(e.contentTouchScroll) || 0;
                /* absolute minimum distance required */
                w[0] = m[0] > A ? w[0] : 0;
                w[1] = m[1] > A ? w[1] : 0;
                if (d.overflowed[0]) {
                    M(w[0], y[0], j, "y", z, false);
                }
                if (d.overflowed[1]) {
                    M(w[1], y[1], j, "x", z, false);
                }
            }
            function L(a, b) {
                var c = [ b * 1.5, b * 2, b / 1.5, b / 2 ];
                if (a > 90) {
                    return b > 4 ? c[0] : c[3];
                } else if (a > 60) {
                    return b > 3 ? c[3] : c[2];
                } else if (a > 30) {
                    return b > 8 ? c[1] : b > 6 ? c[0] : b > 4 ? b : c[2];
                } else {
                    return b > 8 ? b : c[3];
                }
            }
            function M(a, c, d, e, f, g) {
                if (!a) {
                    return;
                }
                W(b, a.toString(), {
                    dur: c,
                    scrollEasing: d,
                    dir: e,
                    overwrite: f,
                    drag: g
                });
            }
        }, /* -------------------- */
        /* 
		SELECT TEXT EVENTS 
		scrolls content when text is selected 
		*/
        H = function() {
            var b = a(this), d = b.data(c), e = d.opt, f = d.sequential, g = c + "_" + d.idx, h = a("#mCSB_" + d.idx + "_container"), k = h.parent(), l;
            h.bind("mousedown." + g, function(a) {
                if (j) {
                    return;
                }
                if (!l) {
                    l = 1;
                    i = true;
                }
            }).add(document).bind("mousemove." + g, function(a) {
                if (!j && l && m()) {
                    var b = h.offset(), c = E(a)[0] - b.top + h[0].offsetTop, g = E(a)[1] - b.left + h[0].offsetLeft;
                    if (c > 0 && c < k.height() && g > 0 && g < k.width()) {
                        if (f.step) {
                            n("off", null, "stepped");
                        }
                    } else {
                        if (e.axis !== "x" && d.overflowed[0]) {
                            if (c < 0) {
                                n("on", 38);
                            } else if (c > k.height()) {
                                n("on", 40);
                            }
                        }
                        if (e.axis !== "y" && d.overflowed[1]) {
                            if (g < 0) {
                                n("on", 37);
                            } else if (g > k.width()) {
                                n("on", 39);
                            }
                        }
                    }
                }
            }).bind("mouseup." + g, function(a) {
                if (j) {
                    return;
                }
                if (l) {
                    l = 0;
                    n("off", null);
                }
                i = false;
            });
            function m() {
                return window.getSelection ? window.getSelection().toString() : document.selection && document.selection.type != "Control" ? document.selection.createRange().text : 0;
            }
            function n(a, c, d) {
                f.type = d && l ? "stepped" : "stepless";
                f.scrollAmount = 10;
                Q(b, a, c, "mcsLinearOut", d ? 60 : null);
            }
        }, /* -------------------- */
        /* 
		MOUSE WHEEL EVENT
		scrolls content via mouse-wheel 
		via mouse-wheel plugin (https://github.com/brandonaaron/jquery-mousewheel)
		*/
        I = function() {
            if (!a(this).data(c)) {
                return;
            }
            /* Check if the scrollbar is ready to use mousewheel events (issue: #185) */
            var b = a(this), d = b.data(c), e = d.opt, f = c + "_" + d.idx, g = a("#mCSB_" + d.idx), i = [ a("#mCSB_" + d.idx + "_dragger_vertical"), a("#mCSB_" + d.idx + "_dragger_horizontal") ], j = a("#mCSB_" + d.idx + "_container").find("iframe");
            if (j.length) {
                j.each(function() {
                    a(this).load(function() {
                        /* bind events on accessible iframes */
                        if (J(this)) {
                            a(this.contentDocument || this.contentWindow.document).bind("mousewheel." + f, function(a, b) {
                                k(a, b);
                            });
                        }
                    });
                });
            }
            g.bind("mousewheel." + f, function(a, b) {
                k(a, b);
            });
            function k(c, f) {
                V(b);
                if (K(b, c.target)) {
                    return;
                }
                /* disables mouse-wheel when hovering specific elements */
                var j = e.mouseWheel.deltaFactor !== "auto" ? parseInt(e.mouseWheel.deltaFactor) : h && c.deltaFactor < 100 ? 100 : c.deltaFactor || 100;
                if (e.axis === "x" || e.mouseWheel.axis === "x") {
                    var k = "x", l = [ Math.round(j * d.scrollRatio.x), parseInt(e.mouseWheel.scrollAmount) ], m = e.mouseWheel.scrollAmount !== "auto" ? l[1] : l[0] >= g.width() ? g.width() * .9 : l[0], n = Math.abs(a("#mCSB_" + d.idx + "_container")[0].offsetLeft), o = i[1][0].offsetLeft, p = i[1].parent().width() - i[1].width(), q = c.deltaX || c.deltaY || f;
                } else {
                    var k = "y", l = [ Math.round(j * d.scrollRatio.y), parseInt(e.mouseWheel.scrollAmount) ], m = e.mouseWheel.scrollAmount !== "auto" ? l[1] : l[0] >= g.height() ? g.height() * .9 : l[0], n = Math.abs(a("#mCSB_" + d.idx + "_container")[0].offsetTop), o = i[0][0].offsetTop, p = i[0].parent().height() - i[0].height(), q = c.deltaY || f;
                }
                if (k === "y" && !d.overflowed[0] || k === "x" && !d.overflowed[1]) {
                    return;
                }
                if (e.mouseWheel.invert || c.webkitDirectionInvertedFromDevice) {
                    q = -q;
                }
                if (e.mouseWheel.normalizeDelta) {
                    q = q < 0 ? -1 : 1;
                }
                if (q > 0 && o !== 0 || q < 0 && o !== p || e.mouseWheel.preventDefault) {
                    c.stopImmediatePropagation();
                    c.preventDefault();
                }
                W(b, (n - q * m).toString(), {
                    dir: k
                });
            }
        }, /* -------------------- */
        /* checks if iframe can be accessed */
        J = function(a) {
            var b = null;
            try {
                var c = a.contentDocument || a.contentWindow.document;
                b = c.body.innerHTML;
            } catch (d) {}
            return b !== null;
        }, /* -------------------- */
        /* disables mouse-wheel when hovering specific elements like select, datalist etc. */
        K = function(b, d) {
            var e = d.nodeName.toLowerCase(), f = b.data(c).opt.mouseWheel.disableOver, /* elements that require focus */
            g = [ "select", "textarea" ];
            return a.inArray(e, f) > -1 && !(a.inArray(e, g) > -1 && !a(d).is(":focus"));
        }, /* -------------------- */
        /* 
		DRAGGER RAIL CLICK EVENT
		scrolls content via dragger rail 
		*/
        L = function() {
            var b = a(this), d = b.data(c), e = c + "_" + d.idx, f = a("#mCSB_" + d.idx + "_container"), g = f.parent(), h = a(".mCSB_" + d.idx + "_scrollbar ." + k[12]);
            h.bind("touchstart." + e + " pointerdown." + e + " MSPointerDown." + e, function(a) {
                i = true;
            }).bind("touchend." + e + " pointerup." + e + " MSPointerUp." + e, function(a) {
                i = false;
            }).bind("click." + e, function(c) {
                if (a(c.target).hasClass(k[12]) || a(c.target).hasClass("mCSB_draggerRail")) {
                    V(b);
                    var e = a(this), h = e.find(".mCSB_dragger");
                    if (e.parent(".mCSB_scrollTools_horizontal").length > 0) {
                        if (!d.overflowed[1]) {
                            return;
                        }
                        var i = "x", j = c.pageX > h.offset().left ? -1 : 1, l = Math.abs(f[0].offsetLeft) - j * (g.width() * .9);
                    } else {
                        if (!d.overflowed[0]) {
                            return;
                        }
                        var i = "y", j = c.pageY > h.offset().top ? -1 : 1, l = Math.abs(f[0].offsetTop) - j * (g.height() * .9);
                    }
                    W(b, l.toString(), {
                        dir: i,
                        scrollEasing: "mcsEaseInOut"
                    });
                }
            });
        }, /* -------------------- */
        /* 
		FOCUS EVENT
		scrolls content via element focus (e.g. clicking an input, pressing TAB key etc.)
		*/
        M = function() {
            var b = a(this), d = b.data(c), e = d.opt, f = c + "_" + d.idx, g = a("#mCSB_" + d.idx + "_container"), h = g.parent();
            g.bind("focusin." + f, function(c) {
                var d = a(document.activeElement), f = g.find(".mCustomScrollBox").length, i = 0;
                if (!d.is(e.advanced.autoScrollOnFocus)) {
                    return;
                }
                V(b);
                clearTimeout(b[0]._focusTimeout);
                b[0]._focusTimer = f ? (i + 17) * f : 0;
                b[0]._focusTimeout = setTimeout(function() {
                    var a = [ ca(d)[0], ca(d)[1] ], c = [ g[0].offsetTop, g[0].offsetLeft ], f = [ c[0] + a[0] >= 0 && c[0] + a[0] < h.height() - d.outerHeight(false), c[1] + a[1] >= 0 && c[0] + a[1] < h.width() - d.outerWidth(false) ], j = e.axis === "yx" && !f[0] && !f[1] ? "none" : "all";
                    if (e.axis !== "x" && !f[0]) {
                        W(b, a[0].toString(), {
                            dir: "y",
                            scrollEasing: "mcsEaseInOut",
                            overwrite: j,
                            dur: i
                        });
                    }
                    if (e.axis !== "y" && !f[1]) {
                        W(b, a[1].toString(), {
                            dir: "x",
                            scrollEasing: "mcsEaseInOut",
                            overwrite: j,
                            dur: i
                        });
                    }
                }, b[0]._focusTimer);
            });
        }, /* -------------------- */
        /* sets content wrapper scrollTop/scrollLeft always to 0 */
        N = function() {
            var b = a(this), d = b.data(c), e = c + "_" + d.idx, f = a("#mCSB_" + d.idx + "_container").parent();
            f.bind("scroll." + e, function(b) {
                if (f.scrollTop() !== 0 || f.scrollLeft() !== 0) {
                    a(".mCSB_" + d.idx + "_scrollbar").css("visibility", "hidden");
                }
            });
        }, /* -------------------- */
        /* 
		BUTTONS EVENTS
		scrolls content via up, down, left and right buttons 
		*/
        O = function() {
            var b = a(this), d = b.data(c), e = d.opt, f = d.sequential, g = c + "_" + d.idx, h = ".mCSB_" + d.idx + "_scrollbar", j = a(h + ">a");
            j.bind("mousedown." + g + " touchstart." + g + " pointerdown." + g + " MSPointerDown." + g + " mouseup." + g + " touchend." + g + " pointerup." + g + " MSPointerUp." + g + " mouseout." + g + " pointerout." + g + " MSPointerOut." + g + " click." + g, function(c) {
                c.preventDefault();
                if (!_(c)) {
                    return;
                }
                /* left mouse button only */
                var g = a(this).attr("class");
                f.type = e.scrollButtons.scrollType;
                switch (c.type) {
                  case "mousedown":
                  case "touchstart":
                  case "pointerdown":
                  case "MSPointerDown":
                    if (f.type === "stepped") {
                        return;
                    }
                    i = true;
                    d.tweenRunning = false;
                    h("on", g);
                    break;

                  case "mouseup":
                  case "touchend":
                  case "pointerup":
                  case "MSPointerUp":
                  case "mouseout":
                  case "pointerout":
                  case "MSPointerOut":
                    if (f.type === "stepped") {
                        return;
                    }
                    i = false;
                    if (f.dir) {
                        h("off", g);
                    }
                    break;

                  case "click":
                    if (f.type !== "stepped" || d.tweenRunning) {
                        return;
                    }
                    h("on", g);
                    break;
                }
                function h(a, c) {
                    f.scrollAmount = e.snapAmount || e.scrollButtons.scrollAmount;
                    Q(b, a, c);
                }
            });
        }, /* -------------------- */
        /* 
		KEYBOARD EVENTS
		scrolls content via keyboard 
		Keys: up arrow, down arrow, left arrow, right arrow, PgUp, PgDn, Home, End
		*/
        P = function() {
            var b = a(this), d = b.data(c), e = d.opt, f = d.sequential, g = c + "_" + d.idx, h = a("#mCSB_" + d.idx), i = a("#mCSB_" + d.idx + "_container"), j = i.parent(), k = "input,textarea,select,datalist,keygen,[contenteditable='true']", l = i.find("iframe"), m = [ "blur." + g + " keydown." + g + " keyup." + g ];
            if (l.length) {
                l.each(function() {
                    a(this).load(function() {
                        /* bind events on accessible iframes */
                        if (J(this)) {
                            a(this.contentDocument || this.contentWindow.document).bind(m[0], function(a) {
                                n(a);
                            });
                        }
                    });
                });
            }
            h.attr("tabindex", "0").bind(m[0], function(a) {
                n(a);
            });
            function n(c) {
                switch (c.type) {
                  case "blur":
                    if (d.tweenRunning && f.dir) {
                        o("off", null);
                    }
                    break;

                  case "keydown":
                  case "keyup":
                    var g = c.keyCode ? c.keyCode : c.which, h = "on";
                    if (e.axis !== "x" && (g === 38 || g === 40) || e.axis !== "y" && (g === 37 || g === 39)) {
                        /* up (38), down (40), left (37), right (39) arrows */
                        if ((g === 38 || g === 40) && !d.overflowed[0] || (g === 37 || g === 39) && !d.overflowed[1]) {
                            return;
                        }
                        if (c.type === "keyup") {
                            h = "off";
                        }
                        if (!a(document.activeElement).is(k)) {
                            c.preventDefault();
                            c.stopImmediatePropagation();
                            o(h, g);
                        }
                    } else if (g === 33 || g === 34) {
                        /* PgUp (33), PgDn (34) */
                        if (d.overflowed[0] || d.overflowed[1]) {
                            c.preventDefault();
                            c.stopImmediatePropagation();
                        }
                        if (c.type === "keyup") {
                            V(b);
                            var l = g === 34 ? -1 : 1;
                            if (e.axis === "x" || e.axis === "yx" && d.overflowed[1] && !d.overflowed[0]) {
                                var m = "x", n = Math.abs(i[0].offsetLeft) - l * (j.width() * .9);
                            } else {
                                var m = "y", n = Math.abs(i[0].offsetTop) - l * (j.height() * .9);
                            }
                            W(b, n.toString(), {
                                dir: m,
                                scrollEasing: "mcsEaseInOut"
                            });
                        }
                    } else if (g === 35 || g === 36) {
                        /* End (35), Home (36) */
                        if (!a(document.activeElement).is(k)) {
                            if (d.overflowed[0] || d.overflowed[1]) {
                                c.preventDefault();
                                c.stopImmediatePropagation();
                            }
                            if (c.type === "keyup") {
                                if (e.axis === "x" || e.axis === "yx" && d.overflowed[1] && !d.overflowed[0]) {
                                    var m = "x", n = g === 35 ? Math.abs(j.width() - i.outerWidth(false)) : 0;
                                } else {
                                    var m = "y", n = g === 35 ? Math.abs(j.height() - i.outerHeight(false)) : 0;
                                }
                                W(b, n.toString(), {
                                    dir: m,
                                    scrollEasing: "mcsEaseInOut"
                                });
                            }
                        }
                    }
                    break;
                }
                function o(a, c) {
                    f.type = e.keyboard.scrollType;
                    f.scrollAmount = e.snapAmount || e.keyboard.scrollAmount;
                    if (f.type === "stepped" && d.tweenRunning) {
                        return;
                    }
                    Q(b, a, c);
                }
            }
        }, /* -------------------- */
        /* scrolls content sequentially (used when scrolling via buttons, keyboard arrows etc.) */
        Q = function(b, d, e, f, g) {
            var h = b.data(c), i = h.opt, j = h.sequential, l = a("#mCSB_" + h.idx + "_container"), m = j.type === "stepped" ? true : false, n = i.scrollInertia < 26 ? 26 : i.scrollInertia, /* 26/1.5=17 */
            o = i.scrollInertia < 1 ? 17 : i.scrollInertia;
            switch (d) {
              case "on":
                j.dir = [ e === k[16] || e === k[15] || e === 39 || e === 37 ? "x" : "y", e === k[13] || e === k[15] || e === 38 || e === 37 ? -1 : 1 ];
                V(b);
                if (ba(e) && j.type === "stepped") {
                    return;
                }
                p(m);
                break;

              case "off":
                q();
                if (m || h.tweenRunning && j.dir) {
                    p(true);
                }
                break;
            }
            /* starts sequence */
            function p(a) {
                var c = j.type !== "stepped", /* continuous scrolling */
                d = g ? g : !a ? 1e3 / 60 : c ? n / 1.5 : o, /* timer */
                e = !a ? 2.5 : c ? 7.5 : 40, /* multiplier */
                i = [ Math.abs(l[0].offsetTop), Math.abs(l[0].offsetLeft) ], k = [ h.scrollRatio.y > 10 ? 10 : h.scrollRatio.y, h.scrollRatio.x > 10 ? 10 : h.scrollRatio.x ], m = j.dir[0] === "x" ? i[1] + j.dir[1] * (k[1] * e) : i[0] + j.dir[1] * (k[0] * e), q = j.dir[0] === "x" ? i[1] + j.dir[1] * parseInt(j.scrollAmount) : i[0] + j.dir[1] * parseInt(j.scrollAmount), r = j.scrollAmount !== "auto" ? q : m, s = f ? f : !a ? "mcsLinear" : c ? "mcsLinearOut" : "mcsEaseInOut", t = !a ? false : true;
                if (a && d < 17) {
                    r = j.dir[0] === "x" ? i[1] : i[0];
                }
                W(b, r.toString(), {
                    dir: j.dir[0],
                    scrollEasing: s,
                    dur: d,
                    onComplete: t
                });
                if (a) {
                    j.dir = false;
                    return;
                }
                clearTimeout(j.step);
                j.step = setTimeout(function() {
                    p();
                }, d);
            }
            /* stops sequence */
            function q() {
                clearTimeout(j.step);
                $(j, "step");
                V(b);
            }
        }, /* -------------------- */
        /* returns a yx array from value */
        R = function(b) {
            var d = a(this).data(c).opt, e = [];
            if (typeof b === "function") {
                b = b();
            }
            /* check if the value is a single anonymous function */
            /* check if value is object or array, its length and create an array with yx values */
            if (!(b instanceof Array)) {
                /* object value (e.g. {y:"100",x:"100"}, 100 etc.) */
                e[0] = b.y ? b.y : b.x || d.axis === "x" ? null : b;
                e[1] = b.x ? b.x : b.y || d.axis === "y" ? null : b;
            } else {
                /* array value (e.g. [100,100]) */
                e = b.length > 1 ? [ b[0], b[1] ] : d.axis === "x" ? [ null, b[0] ] : [ b[0], null ];
            }
            /* check if array values are anonymous functions */
            if (typeof e[0] === "function") {
                e[0] = e[0]();
            }
            if (typeof e[1] === "function") {
                e[1] = e[1]();
            }
            return e;
        }, /* -------------------- */
        /* translates values (e.g. "top", 100, "100px", "#id") to actual scroll-to positions */
        S = function(b, d) {
            if (b == null || typeof b == "undefined") {
                return;
            }
            var e = a(this), f = e.data(c), g = f.opt, h = a("#mCSB_" + f.idx + "_container"), i = h.parent(), j = typeof b;
            if (!d) {
                d = g.axis === "x" ? "x" : "y";
            }
            var k = d === "x" ? h.outerWidth(false) : h.outerHeight(false), m = d === "x" ? h[0].offsetLeft : h[0].offsetTop, n = d === "x" ? "left" : "top";
            switch (j) {
              case "function":
                /* this currently is not used. Consider removing it */
                return b();
                break;

              case "object":
                /* js/jquery object */
                var o = b.jquery ? b : a(b);
                if (!o.length) {
                    return;
                }
                return d === "x" ? ca(o)[1] : ca(o)[0];
                break;

              case "string":
              case "number":
                if (ba(b)) {
                    /* numeric value */
                    return Math.abs(b);
                } else if (b.indexOf("%") !== -1) {
                    /* percentage value */
                    return Math.abs(k * parseInt(b) / 100);
                } else if (b.indexOf("-=") !== -1) {
                    /* decrease value */
                    return Math.abs(m - parseInt(b.split("-=")[1]));
                } else if (b.indexOf("+=") !== -1) {
                    /* inrease value */
                    var p = m + parseInt(b.split("+=")[1]);
                    return p >= 0 ? 0 : Math.abs(p);
                } else if (b.indexOf("px") !== -1 && ba(b.split("px")[0])) {
                    /* pixels string value (e.g. "100px") */
                    return Math.abs(b.split("px")[0]);
                } else {
                    if (b === "top" || b === "left") {
                        /* special strings */
                        return 0;
                    } else if (b === "bottom") {
                        return Math.abs(i.height() - h.outerHeight(false));
                    } else if (b === "right") {
                        return Math.abs(i.width() - h.outerWidth(false));
                    } else if (b === "first" || b === "last") {
                        var o = h.find(":" + b);
                        return d === "x" ? ca(o)[1] : ca(o)[0];
                    } else {
                        if (a(b).length) {
                            /* jquery selector */
                            return d === "x" ? ca(a(b))[1] : ca(a(b))[0];
                        } else {
                            /* other values (e.g. "100em") */
                            h.css(n, b);
                            l.update.call(null, e[0]);
                            return;
                        }
                    }
                }
                break;
            }
        }, /* -------------------- */
        /* calls the update method automatically */
        T = function(b) {
            var d = a(this), e = d.data(c), f = e.opt, g = a("#mCSB_" + e.idx + "_container");
            if (b) {
                /* 
				removes autoUpdate timer 
				usage: _autoUpdate.call(this,"remove");
				*/
                clearTimeout(g[0].autoUpdate);
                $(g[0], "autoUpdate");
                return;
            }
            var h = g.parent(), i = [ a("#mCSB_" + e.idx + "_scrollbar_vertical"), a("#mCSB_" + e.idx + "_scrollbar_horizontal") ], j = function() {
                return [ i[0].is(":visible") ? i[0].outerHeight(true) : 0, /* returns y-scrollbar height */
                i[1].is(":visible") ? i[1].outerWidth(true) : 0 ];
            }, m = v(), n, o = [ g.outerHeight(false), g.outerWidth(false), h.height(), h.width(), j()[0], j()[1] ], p, q = t(), r;
            s();
            function s() {
                clearTimeout(g[0].autoUpdate);
                if (d.parents("html").length === 0) {
                    /* check element in dom tree */
                    d = null;
                    return;
                }
                g[0].autoUpdate = setTimeout(function() {
                    /* update on specific selector(s) length and size change */
                    if (f.advanced.updateOnSelectorChange) {
                        n = v();
                        if (n !== m) {
                            w(3);
                            m = n;
                            return;
                        }
                    }
                    /* update on main element and scrollbar size changes */
                    if (f.advanced.updateOnContentResize) {
                        p = [ g.outerHeight(false), g.outerWidth(false), h.height(), h.width(), j()[0], j()[1] ];
                        if (p[0] !== o[0] || p[1] !== o[1] || p[2] !== o[2] || p[3] !== o[3] || p[4] !== o[4] || p[5] !== o[5]) {
                            w(p[0] !== o[0] || p[1] !== o[1]);
                            o = p;
                        }
                    }
                    /* update on image load */
                    if (f.advanced.updateOnImageLoad) {
                        r = t();
                        if (r !== q) {
                            g.find("img").each(function() {
                                u(this);
                            });
                            q = r;
                        }
                    }
                    if (f.advanced.updateOnSelectorChange || f.advanced.updateOnContentResize || f.advanced.updateOnImageLoad) {
                        s();
                    }
                }, f.advanced.autoUpdateTimeout);
            }
            /* returns images amount */
            function t() {
                var a = 0;
                if (f.advanced.updateOnImageLoad) {
                    a = g.find("img").length;
                }
                return a;
            }
            /* a tiny image loader */
            function u(b) {
                if (a(b).hasClass(k[2])) {
                    w();
                    return;
                }
                var c = new Image();
                function d(a, b) {
                    return function() {
                        return b.apply(a, arguments);
                    };
                }
                function e() {
                    this.onload = null;
                    a(b).addClass(k[2]);
                    w(2);
                }
                c.onload = d(c, e);
                c.src = b.src;
            }
            /* returns the total height and width sum of all elements matching the selector */
            function v() {
                if (f.advanced.updateOnSelectorChange === true) {
                    f.advanced.updateOnSelectorChange = "*";
                }
                var b = 0, c = g.find(f.advanced.updateOnSelectorChange);
                if (f.advanced.updateOnSelectorChange && c.length > 0) {
                    c.each(function() {
                        b += a(this).height() + a(this).width();
                    });
                }
                return b;
            }
            /* calls the update method */
            function w(a) {
                clearTimeout(g[0].autoUpdate);
                l.update.call(null, d[0], a);
            }
        }, /* -------------------- */
        /* snaps scrolling to a multiple of a pixels number */
        U = function(a, b, c) {
            return Math.round(a / b) * b - c;
        }, /* -------------------- */
        /* stops content and scrollbar animations */
        V = function(b) {
            var d = b.data(c), e = a("#mCSB_" + d.idx + "_container,#mCSB_" + d.idx + "_container_wrapper,#mCSB_" + d.idx + "_dragger_vertical,#mCSB_" + d.idx + "_dragger_horizontal");
            e.each(function() {
                Z.call(this);
            });
        }, /* -------------------- */
        /* 
		ANIMATES CONTENT 
		This is where the actual scrolling happens
		*/
        W = function(b, d, e) {
            var f = b.data(c), g = f.opt, h = {
                trigger: "internal",
                dir: "y",
                scrollEasing: "mcsEaseOut",
                drag: false,
                dur: g.scrollInertia,
                overwrite: "all",
                callbacks: true,
                onStart: true,
                onUpdate: true,
                onComplete: true
            }, e = a.extend(h, e), i = [ e.dur, e.drag ? 0 : e.dur ], j = a("#mCSB_" + f.idx), k = a("#mCSB_" + f.idx + "_container"), l = k.parent(), m = g.callbacks.onTotalScrollOffset ? R.call(b, g.callbacks.onTotalScrollOffset) : [ 0, 0 ], n = g.callbacks.onTotalScrollBackOffset ? R.call(b, g.callbacks.onTotalScrollBackOffset) : [ 0, 0 ];
            f.trigger = e.trigger;
            if (l.scrollTop() !== 0 || l.scrollLeft() !== 0) {
                /* always reset scrollTop/Left */
                a(".mCSB_" + f.idx + "_scrollbar").css("visibility", "visible");
                l.scrollTop(0).scrollLeft(0);
            }
            if (d === "_resetY" && !f.contentReset.y) {
                /* callbacks: onOverflowYNone */
                if (x("onOverflowYNone")) {
                    g.callbacks.onOverflowYNone.call(b[0]);
                }
                f.contentReset.y = 1;
            }
            if (d === "_resetX" && !f.contentReset.x) {
                /* callbacks: onOverflowXNone */
                if (x("onOverflowXNone")) {
                    g.callbacks.onOverflowXNone.call(b[0]);
                }
                f.contentReset.x = 1;
            }
            if (d === "_resetY" || d === "_resetX") {
                return;
            }
            if ((f.contentReset.y || !b[0].mcs) && f.overflowed[0]) {
                /* callbacks: onOverflowY */
                if (x("onOverflowY")) {
                    g.callbacks.onOverflowY.call(b[0]);
                }
                f.contentReset.x = null;
            }
            if ((f.contentReset.x || !b[0].mcs) && f.overflowed[1]) {
                /* callbacks: onOverflowX */
                if (x("onOverflowX")) {
                    g.callbacks.onOverflowX.call(b[0]);
                }
                f.contentReset.x = null;
            }
            if (g.snapAmount) {
                d = U(d, g.snapAmount, g.snapOffset);
            }
            /* scrolling snapping */
            switch (e.dir) {
              case "x":
                var o = a("#mCSB_" + f.idx + "_dragger_horizontal"), p = "left", q = k[0].offsetLeft, r = [ j.width() - k.outerWidth(false), o.parent().width() - o.width() ], s = [ d, d === 0 ? 0 : d / f.scrollRatio.x ], t = m[1], u = n[1], v = t > 0 ? t / f.scrollRatio.x : 0, w = u > 0 ? u / f.scrollRatio.x : 0;
                break;

              case "y":
                var o = a("#mCSB_" + f.idx + "_dragger_vertical"), p = "top", q = k[0].offsetTop, r = [ j.height() - k.outerHeight(false), o.parent().height() - o.height() ], s = [ d, d === 0 ? 0 : d / f.scrollRatio.y ], t = m[0], u = n[0], v = t > 0 ? t / f.scrollRatio.y : 0, w = u > 0 ? u / f.scrollRatio.y : 0;
                break;
            }
            if (s[1] < 0 || s[0] === 0 && s[1] === 0) {
                s = [ 0, 0 ];
            } else if (s[1] >= r[1]) {
                s = [ r[0], r[1] ];
            } else {
                s[0] = -s[0];
            }
            if (!b[0].mcs) {
                A();
                /* init mcs object (once) to make it available before callbacks */
                if (x("onInit")) {
                    g.callbacks.onInit.call(b[0]);
                }
            }
            clearTimeout(k[0].onCompleteTimeout);
            if (!f.tweenRunning && (q === 0 && s[0] >= 0 || q === r[0] && s[0] <= r[0])) {
                return;
            }
            X(o[0], p, Math.round(s[1]), i[1], e.scrollEasing);
            X(k[0], p, Math.round(s[0]), i[0], e.scrollEasing, e.overwrite, {
                onStart: function() {
                    if (e.callbacks && e.onStart && !f.tweenRunning) {
                        /* callbacks: onScrollStart */
                        if (x("onScrollStart")) {
                            A();
                            g.callbacks.onScrollStart.call(b[0]);
                        }
                        f.tweenRunning = true;
                        y(o);
                        f.cbOffsets = z();
                    }
                },
                onUpdate: function() {
                    if (e.callbacks && e.onUpdate) {
                        /* callbacks: whileScrolling */
                        if (x("whileScrolling")) {
                            A();
                            g.callbacks.whileScrolling.call(b[0]);
                        }
                    }
                },
                onComplete: function() {
                    if (e.callbacks && e.onComplete) {
                        if (g.axis === "yx") {
                            clearTimeout(k[0].onCompleteTimeout);
                        }
                        var a = k[0].idleTimer || 0;
                        k[0].onCompleteTimeout = setTimeout(function() {
                            /* callbacks: onScroll, onTotalScroll, onTotalScrollBack */
                            if (x("onScroll")) {
                                A();
                                g.callbacks.onScroll.call(b[0]);
                            }
                            if (x("onTotalScroll") && s[1] >= r[1] - v && f.cbOffsets[0]) {
                                A();
                                g.callbacks.onTotalScroll.call(b[0]);
                            }
                            if (x("onTotalScrollBack") && s[1] <= w && f.cbOffsets[1]) {
                                A();
                                g.callbacks.onTotalScrollBack.call(b[0]);
                            }
                            f.tweenRunning = false;
                            k[0].idleTimer = 0;
                            y(o, "hide");
                        }, a);
                    }
                }
            });
            /* checks if callback function exists */
            function x(a) {
                return f && g.callbacks[a] && typeof g.callbacks[a] === "function";
            }
            /* checks whether callback offsets always trigger */
            function z() {
                return [ g.callbacks.alwaysTriggerOffsets || q >= r[0] + t, g.callbacks.alwaysTriggerOffsets || q <= -u ];
            }
            /* 
			populates object with useful values for the user 
			values: 
				content: this.mcs.content
				content top position: this.mcs.top 
				content left position: this.mcs.left 
				dragger top position: this.mcs.draggerTop 
				dragger left position: this.mcs.draggerLeft 
				scrolling y percentage: this.mcs.topPct 
				scrolling x percentage: this.mcs.leftPct 
				scrolling direction: this.mcs.direction
			*/
            function A() {
                var a = [ k[0].offsetTop, k[0].offsetLeft ], /* content position */
                c = [ o[0].offsetTop, o[0].offsetLeft ], /* dragger position */
                d = [ k.outerHeight(false), k.outerWidth(false) ], /* content length */
                f = [ j.height(), j.width() ];
                /* content parent length */
                b[0].mcs = {
                    content: k,
                    /* original content wrapper as jquery object */
                    top: a[0],
                    left: a[1],
                    draggerTop: c[0],
                    draggerLeft: c[1],
                    topPct: Math.round(100 * Math.abs(a[0]) / (Math.abs(d[0]) - f[0])),
                    leftPct: Math.round(100 * Math.abs(a[1]) / (Math.abs(d[1]) - f[1])),
                    direction: e.dir
                };
            }
        }, /* -------------------- */
        /* 
		CUSTOM JAVASCRIPT ANIMATION TWEEN 
		Lighter and faster than jquery animate() and css transitions 
		Animates top/left properties and includes easings 
		*/
        X = function(a, b, c, d, e, f, g) {
            if (!a._mTween) {
                a._mTween = {
                    top: {},
                    left: {}
                };
            }
            var g = g || {}, h = g.onStart || function() {}, i = g.onUpdate || function() {}, j = g.onComplete || function() {}, k = Y(), l, m = 0, n = a.offsetTop, o = a.style, p, q = a._mTween[b];
            if (b === "left") {
                n = a.offsetLeft;
            }
            var r = c - n;
            q.stop = 0;
            if (f !== "none") {
                v();
            }
            u();
            function s() {
                if (q.stop) {
                    return;
                }
                if (!m) {
                    h.call();
                }
                m = Y() - k;
                t();
                if (m >= q.time) {
                    q.time = m > q.time ? m + l - (m - q.time) : m + l - 1;
                    if (q.time < m + 1) {
                        q.time = m + 1;
                    }
                }
                if (q.time < d) {
                    q.id = p(s);
                } else {
                    j.call();
                }
            }
            function t() {
                if (d > 0) {
                    q.currVal = w(q.time, n, r, d, e);
                    o[b] = Math.round(q.currVal) + "px";
                } else {
                    o[b] = c + "px";
                }
                i.call();
            }
            function u() {
                l = 1e3 / 60;
                q.time = m + l;
                p = !window.requestAnimationFrame ? function(a) {
                    t();
                    return setTimeout(a, .01);
                } : window.requestAnimationFrame;
                q.id = p(s);
            }
            function v() {
                if (q.id == null) {
                    return;
                }
                if (!window.requestAnimationFrame) {
                    clearTimeout(q.id);
                } else {
                    window.cancelAnimationFrame(q.id);
                }
                q.id = null;
            }
            function w(a, b, c, d, e) {
                switch (e) {
                  case "linear":
                  case "mcsLinear":
                    return c * a / d + b;
                    break;

                  case "mcsLinearOut":
                    a /= d;
                    a--;
                    return c * Math.sqrt(1 - a * a) + b;
                    break;

                  case "easeInOutSmooth":
                    a /= d / 2;
                    if (a < 1) return c / 2 * a * a + b;
                    a--;
                    return -c / 2 * (a * (a - 2) - 1) + b;
                    break;

                  case "easeInOutStrong":
                    a /= d / 2;
                    if (a < 1) return c / 2 * Math.pow(2, 10 * (a - 1)) + b;
                    a--;
                    return c / 2 * (-Math.pow(2, -10 * a) + 2) + b;
                    break;

                  case "easeInOut":
                  case "mcsEaseInOut":
                    a /= d / 2;
                    if (a < 1) return c / 2 * a * a * a + b;
                    a -= 2;
                    return c / 2 * (a * a * a + 2) + b;
                    break;

                  case "easeOutSmooth":
                    a /= d;
                    a--;
                    return -c * (a * a * a * a - 1) + b;
                    break;

                  case "easeOutStrong":
                    return c * (-Math.pow(2, -10 * a / d) + 1) + b;
                    break;

                  case "easeOut":
                  case "mcsEaseOut":
                  default:
                    var f = (a /= d) * a, g = f * a;
                    return b + c * (.499999999999997 * g * f + -2.5 * f * f + 5.5 * g + -6.5 * f + 4 * a);
                }
            }
        }, /* -------------------- */
        /* returns current time */
        Y = function() {
            if (window.performance && window.performance.now) {
                return window.performance.now();
            } else {
                if (window.performance && window.performance.webkitNow) {
                    return window.performance.webkitNow();
                } else {
                    if (Date.now) {
                        return Date.now();
                    } else {
                        return new Date().getTime();
                    }
                }
            }
        }, /* -------------------- */
        /* stops a tween */
        Z = function() {
            var a = this;
            if (!a._mTween) {
                a._mTween = {
                    top: {},
                    left: {}
                };
            }
            var b = [ "top", "left" ];
            for (var c = 0; c < b.length; c++) {
                var d = b[c];
                if (a._mTween[d].id) {
                    if (!window.requestAnimationFrame) {
                        clearTimeout(a._mTween[d].id);
                    } else {
                        window.cancelAnimationFrame(a._mTween[d].id);
                    }
                    a._mTween[d].id = null;
                    a._mTween[d].stop = 1;
                }
            }
        }, /* -------------------- */
        /* deletes a property (avoiding the exception thrown by IE) */
        $ = function(a, b) {
            try {
                delete a[b];
            } catch (c) {
                a[b] = null;
            }
        }, /* -------------------- */
        /* detects left mouse button */
        _ = function(a) {
            return !(a.which && a.which !== 1);
        }, /* -------------------- */
        /* detects if pointer type event is touch */
        aa = function(a) {
            var b = a.originalEvent.pointerType;
            return !(b && b !== "touch" && b !== 2);
        }, /* -------------------- */
        /* checks if value is numeric */
        ba = function(a) {
            return !isNaN(parseFloat(a)) && isFinite(a);
        }, /* -------------------- */
        /* returns element position according to content */
        ca = function(a) {
            var b = a.parents(".mCSB_container");
            return [ a.offset().top - b.offset().top, a.offset().left - b.offset().left ];
        };
        /* -------------------- */
        /* 
	----------------------------------------
	PLUGIN SETUP 
	----------------------------------------
	*/
        /* plugin constructor functions */
        a.fn[b] = function(b) {
            /* usage: $(selector).mCustomScrollbar(); */
            if (l[b]) {
                return l[b].apply(this, Array.prototype.slice.call(arguments, 1));
            } else if (typeof b === "object" || !b) {
                return l.init.apply(this, arguments);
            } else {
                a.error("Method " + b + " does not exist");
            }
        };
        a[b] = function(b) {
            /* usage: $.mCustomScrollbar(); */
            if (l[b]) {
                return l[b].apply(this, Array.prototype.slice.call(arguments, 1));
            } else if (typeof b === "object" || !b) {
                return l.init.apply(this, arguments);
            } else {
                a.error("Method " + b + " does not exist");
            }
        };
        /* 
	allow setting plugin default options. 
	usage: $.mCustomScrollbar.defaults.scrollInertia=500; 
	to apply any changed default options on default selectors (below), use inside document ready fn 
	e.g.: $(document).ready(function(){ $.mCustomScrollbar.defaults.scrollInertia=500; });
	*/
        a[b].defaults = e;
        /* 
	add window object (window.mCustomScrollbar) 
	usage: if(window.mCustomScrollbar){console.log("custom scrollbar plugin loaded");}
	*/
        window[b] = true;
        a(window).load(function() {
            a(d)[b]();
            /* add scrollbars automatically on default selector */
            /* extend jQuery expressions */
            a.extend(a.expr[":"], {
                /* checks if element is within scrollable viewport */
                mcsInView: a.expr[":"].mcsInView || function(b) {
                    var c = a(b), d = c.parents(".mCSB_container"), e, f;
                    if (!d.length) {
                        return;
                    }
                    e = d.parent();
                    f = [ d[0].offsetTop, d[0].offsetLeft ];
                    return f[0] + ca(c)[0] >= 0 && f[0] + ca(c)[0] < e.height() - c.outerHeight(false) && f[1] + ca(c)[1] >= 0 && f[1] + ca(c)[1] < e.width() - c.outerWidth(false);
                },
                /* checks if element is overflowed having visible scrollbar(s) */
                mcsOverflow: a.expr[":"].mcsOverflow || function(b) {
                    var d = a(b).data(c);
                    if (!d) {
                        return;
                    }
                    return d.overflowed[0] || d.overflowed[1];
                }
            });
        });
    });
});