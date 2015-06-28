/**
 * bootbox.js [v4.3.0]
 *
 * http://bootboxjs.com/license.txt
 */
// @see https://github.com/makeusabrew/bootbox/issues/180
// @see https://github.com/makeusabrew/bootbox/issues/186
(function(a, b) {
    "use strict";
    if (typeof define === "function" && define.amd) {
        // AMD. Register as an anonymous module.
        define([ "jquery" ], b);
    } else if (typeof exports === "object") {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = b(require("jquery"));
    } else {
        // Browser globals (root is window)
        a.bootbox = b(a.jQuery);
    }
})(this, function a(b, c) {
    "use strict";
    // the base DOM structure needed to create a modal
    var d = {
        dialog: "<div class='bootbox modal' tabindex='-1' role='dialog'>" + "<div class='modal-dialog'>" + "<div class='modal-content'>" + "<div class='modal-body'><div class='bootbox-body'></div></div>" + "</div>" + "</div>" + "</div>",
        header: "<div class='modal-header'>" + "<h4 class='modal-title'></h4>" + "</div>",
        footer: "<div class='modal-footer'></div>",
        closeButton: "<button type='button' class='bootbox-close-button close' data-dismiss='modal' aria-hidden='true'>&times;</button>",
        form: "<form class='bootbox-form'></form>",
        inputs: {
            text: "<input class='bootbox-input bootbox-input-text form-control' autocomplete=off type=text />",
            textarea: "<textarea class='bootbox-input bootbox-input-textarea form-control'></textarea>",
            email: "<input class='bootbox-input bootbox-input-email form-control' autocomplete='off' type='email' />",
            select: "<select class='bootbox-input bootbox-input-select form-control'></select>",
            checkbox: "<div class='checkbox'><label><input class='bootbox-input bootbox-input-checkbox' type='checkbox' /></label></div>",
            date: "<input class='bootbox-input bootbox-input-date form-control' autocomplete=off type='date' />",
            time: "<input class='bootbox-input bootbox-input-time form-control' autocomplete=off type='time' />",
            number: "<input class='bootbox-input bootbox-input-number form-control' autocomplete=off type='number' />",
            password: "<input class='bootbox-input bootbox-input-password form-control' autocomplete='off' type='password' />"
        }
    };
    var e = {
        // default language
        locale: "en",
        // show backdrop or not
        backdrop: true,
        // animate the modal in/out
        animate: true,
        // additional class string applied to the top level dialog
        className: null,
        // whether or not to include a close button
        closeButton: true,
        // show the dialog immediately by default
        show: true,
        // dialog container
        container: "body"
    };
    // our public object; augmented after our private API
    var f = {};
    /**
   * @private
   */
    function g(a) {
        var b = q[e.locale];
        return b ? b[a] : q.en[a];
    }
    function h(a, c, d) {
        a.stopPropagation();
        a.preventDefault();
        // by default we assume a callback will get rid of the dialog,
        // although it is given the opportunity to override this
        // so, if the callback can be invoked and it *explicitly returns false*
        // then we'll set a flag to keep the dialog active...
        var e = b.isFunction(d) && d(a) === false;
        // ... otherwise we'll bin it
        if (!e) {
            c.modal("hide");
        }
    }
    function i(a) {
        // @TODO defer to Object.keys(x).length if available?
        var b, c = 0;
        for (b in a) {
            c++;
        }
        return c;
    }
    function j(a, c) {
        var d = 0;
        b.each(a, function(a, b) {
            c(a, b, d++);
        });
    }
    function k(a) {
        var c;
        var d;
        if (typeof a !== "object") {
            throw new Error("Please supply an object of options");
        }
        if (!a.message) {
            throw new Error("Please specify a message");
        }
        // make sure any supplied options take precedence over defaults
        a = b.extend({}, e, a);
        if (!a.buttons) {
            a.buttons = {};
        }
        // we only support Bootstrap's "static" and false backdrop args
        // supporting true would mean you could dismiss the dialog without
        // explicitly interacting with it
        a.backdrop = a.backdrop ? "static" : false;
        c = a.buttons;
        d = i(c);
        j(c, function(a, e, f) {
            if (b.isFunction(e)) {
                // short form, assume value is our callback. Since button
                // isn't an object it isn't a reference either so re-assign it
                e = c[a] = {
                    callback: e
                };
            }
            // before any further checks make sure by now button is the correct type
            if (b.type(e) !== "object") {
                throw new Error("button with key " + a + " must be an object");
            }
            if (!e.label) {
                // the lack of an explicit label means we'll assume the key is good enough
                e.label = a;
            }
            if (!e.className) {
                if (d <= 2 && f === d - 1) {
                    // always add a primary to the main option in a two-button dialog
                    e.className = "btn-primary";
                } else {
                    e.className = "btn-default";
                }
            }
        });
        return a;
    }
    /**
   * map a flexible set of arguments into a single returned object
   * if args.length is already one just return it, otherwise
   * use the properties argument to map the unnamed args to
   * object properties
   * so in the latter case:
   * mapArguments(["foo", $.noop], ["message", "callback"])
   * -> { message: "foo", callback: $.noop }
   */
    function l(a, b) {
        var c = a.length;
        var d = {};
        if (c < 1 || c > 2) {
            throw new Error("Invalid argument length");
        }
        if (c === 2 || typeof a[0] === "string") {
            d[b[0]] = a[0];
            d[b[1]] = a[1];
        } else {
            d = a[0];
        }
        return d;
    }
    /**
   * merge a set of default dialog options with user supplied arguments
   */
    function m(a, c, d) {
        // deep merge
        // ensure the target is an empty, unreferenced object
        // the base options object for this type of dialog (often just buttons)
        // args could be an object or array; if it's an array properties will
        // map it to a proper options object
        return b.extend(true, {}, a, l(c, d));
    }
    /**
   * this entry-level method makes heavy use of composition to take a simple
   * range of inputs and return valid options suitable for passing to bootbox.dialog
   */
    function n(a, b, c, d) {
        //  build up a base set of dialog properties
        var e = {
            className: "bootbox-" + a,
            buttons: o.apply(null, b)
        };
        // ensure the buttons properties generated, *after* merging
        // with user args are still valid against the supplied labels
        // merge the generated base properties with user supplied arguments
        // if args.length > 1, properties specify how each arg maps to an object key
        return p(m(e, d, c), b);
    }
    /**
   * from a given list of arguments return a suitable object of button labels
   * all this does is normalise the given labels and translate them where possible
   * e.g. "ok", "confirm" -> { ok: "OK, cancel: "Annuleren" }
   */
    function o() {
        var a = {};
        for (var b = 0, c = arguments.length; b < c; b++) {
            var d = arguments[b];
            var e = d.toLowerCase();
            var f = d.toUpperCase();
            a[e] = {
                label: g(f)
            };
        }
        return a;
    }
    function p(a, b) {
        var d = {};
        j(b, function(a, b) {
            d[b] = true;
        });
        j(a.buttons, function(a) {
            if (d[a] === c) {
                throw new Error("button key " + a + " is not allowed (options are " + b.join("\n") + ")");
            }
        });
        return a;
    }
    f.alert = function() {
        var a;
        a = n("alert", [ "ok" ], [ "message", "callback" ], arguments);
        if (a.callback && !b.isFunction(a.callback)) {
            throw new Error("alert requires callback property to be a function when provided");
        }
        /**
     * overrides
     */
        a.buttons.ok.callback = a.onEscape = function() {
            if (b.isFunction(a.callback)) {
                return a.callback();
            }
            return true;
        };
        return f.dialog(a);
    };
    f.confirm = function() {
        var a;
        a = n("confirm", [ "cancel", "confirm" ], [ "message", "callback" ], arguments);
        /**
     * overrides; undo anything the user tried to set they shouldn't have
     */
        a.buttons.cancel.callback = a.onEscape = function() {
            return a.callback(false);
        };
        a.buttons.confirm.callback = function() {
            return a.callback(true);
        };
        // confirm specific validation
        if (!b.isFunction(a.callback)) {
            throw new Error("confirm requires a callback");
        }
        return f.dialog(a);
    };
    f.prompt = function() {
        var a;
        var e;
        var g;
        var h;
        var i;
        var k;
        var l;
        // we have to create our form first otherwise
        // its value is undefined when gearing up our options
        // @TODO this could be solved by allowing message to
        // be a function instead...
        h = b(d.form);
        // prompt defaults are more complex than others in that
        // users can override more defaults
        // @TODO I don't like that prompt has to do a lot of heavy
        // lifting which mergeDialogOptions can *almost* support already
        // just because of 'value' and 'inputType' - can we refactor?
        e = {
            className: "bootbox-prompt",
            buttons: o("cancel", "confirm"),
            value: "",
            inputType: "text"
        };
        a = p(m(e, arguments, [ "title", "callback" ]), [ "cancel", "confirm" ]);
        // capture the user's show value; we always set this to false before
        // spawning the dialog to give us a chance to attach some handlers to
        // it, but we need to make sure we respect a preference not to show it
        k = a.show === c ? true : a.show;
        /**
     * overrides; undo anything the user tried to set they shouldn't have
     */
        a.message = h;
        a.buttons.cancel.callback = a.onEscape = function() {
            return a.callback(null);
        };
        a.buttons.confirm.callback = function() {
            var c;
            switch (a.inputType) {
              case "text":
              case "textarea":
              case "email":
              case "select":
              case "date":
              case "time":
              case "number":
              case "password":
                c = i.val();
                break;

              case "checkbox":
                var d = i.find("input:checked");
                // we assume that checkboxes are always multiple,
                // hence we default to an empty array
                c = [];
                j(d, function(a, d) {
                    c.push(b(d).val());
                });
                break;
            }
            return a.callback(c);
        };
        a.show = false;
        // prompt specific validation
        if (!a.title) {
            throw new Error("prompt requires a title");
        }
        if (!b.isFunction(a.callback)) {
            throw new Error("prompt requires a callback");
        }
        if (!d.inputs[a.inputType]) {
            throw new Error("invalid prompt type");
        }
        // create the input based on the supplied type
        i = b(d.inputs[a.inputType]);
        switch (a.inputType) {
          case "text":
          case "textarea":
          case "email":
          case "date":
          case "time":
          case "number":
          case "password":
            i.val(a.value);
            break;

          case "select":
            var n = {};
            l = a.inputOptions || [];
            if (!l.length) {
                throw new Error("prompt with select requires options");
            }
            j(l, function(a, d) {
                // assume the element to attach to is the input...
                var e = i;
                if (d.value === c || d.text === c) {
                    throw new Error("given options in wrong format");
                }
                // ... but override that element if this option sits in a group
                if (d.group) {
                    // initialise group if necessary
                    if (!n[d.group]) {
                        n[d.group] = b("<optgroup/>").attr("label", d.group);
                    }
                    e = n[d.group];
                }
                e.append("<option value='" + d.value + "'>" + d.text + "</option>");
            });
            j(n, function(a, b) {
                i.append(b);
            });
            // safe to set a select's value as per a normal input
            i.val(a.value);
            break;

          case "checkbox":
            var q = b.isArray(a.value) ? a.value : [ a.value ];
            l = a.inputOptions || [];
            if (!l.length) {
                throw new Error("prompt with checkbox requires options");
            }
            if (!l[0].value || !l[0].text) {
                throw new Error("given options in wrong format");
            }
            // checkboxes have to nest within a containing element, so
            // they break the rules a bit and we end up re-assigning
            // our 'input' element to this container instead
            i = b("<div/>");
            j(l, function(c, e) {
                var f = b(d.inputs[a.inputType]);
                f.find("input").attr("value", e.value);
                f.find("label").append(e.text);
                // we've ensured values is an array so we can always iterate over it
                j(q, function(a, b) {
                    if (b === e.value) {
                        f.find("input").prop("checked", true);
                    }
                });
                i.append(f);
            });
            break;
        }
        if (a.placeholder) {
            i.attr("placeholder", a.placeholder);
        }
        if (a.pattern) {
            i.attr("pattern", a.pattern);
        }
        // now place it in our form
        h.append(i);
        h.on("submit", function(a) {
            a.preventDefault();
            // Fix for SammyJS (or similar JS routing library) hijacking the form post.
            a.stopPropagation();
            // @TODO can we actually click *the* button object instead?
            // e.g. buttons.confirm.click() or similar
            g.find(".btn-primary").click();
        });
        g = f.dialog(a);
        // clear the existing handler focusing the submit button...
        g.off("shown.bs.modal");
        // ...and replace it with one focusing our input, if possible
        g.on("shown.bs.modal", function() {
            i.focus();
        });
        if (k === true) {
            g.modal("show");
        }
        return g;
    };
    f.dialog = function(a) {
        a = k(a);
        var c = b(d.dialog);
        var e = c.find(".modal-dialog");
        var f = c.find(".modal-body");
        var g = a.buttons;
        var i = "";
        var l = {
            onEscape: a.onEscape
        };
        j(g, function(a, b) {
            // @TODO I don't like this string appending to itself; bit dirty. Needs reworking
            // can we just build up button elements instead? slower but neater. Then button
            // can just become a template too
            i += "<button data-bb-handler='" + a + "' type='button' class='btn " + b.className + "'>" + b.label + "</button>";
            l[a] = b.callback;
        });
        f.find(".bootbox-body").html(a.message);
        if (a.animate === true) {
            c.addClass("fade");
        }
        if (a.className) {
            c.addClass(a.className);
        }
        if (a.size === "large") {
            e.addClass("modal-lg");
        }
        if (a.size === "small") {
            e.addClass("modal-sm");
        }
        if (a.title) {
            f.before(d.header);
        }
        if (a.closeButton) {
            var m = b(d.closeButton);
            if (a.title) {
                c.find(".modal-header").prepend(m);
            } else {
                m.css("margin-top", "-10px").prependTo(f);
            }
        }
        if (a.title) {
            c.find(".modal-title").html(a.title);
        }
        if (i.length) {
            f.after(d.footer);
            c.find(".modal-footer").html(i);
        }
        /**
     * Bootstrap event listeners; used handle extra
     * setup & teardown required after the underlying
     * modal has performed certain actions
     */
        c.on("hidden.bs.modal", function(a) {
            // ensure we don't accidentally intercept hidden events triggered
            // by children of the current dialog. We shouldn't anymore now BS
            // namespaces its events; but still worth doing
            if (a.target === this) {
                c.remove();
            }
        });
        /*
    dialog.on("show.bs.modal", function() {
      // sadly this doesn't work; show is called *just* before
      // the backdrop is added so we'd need a setTimeout hack or
      // otherwise... leaving in as would be nice
      if (options.backdrop) {
        dialog.next(".modal-backdrop").addClass("bootbox-backdrop");
      }
    });
    */
        c.on("shown.bs.modal", function() {
            c.find(".btn-primary:first").focus();
        });
        /**
     * Bootbox event listeners; experimental and may not last
     * just an attempt to decouple some behaviours from their
     * respective triggers
     */
        c.on("escape.close.bb", function(a) {
            if (l.onEscape) {
                h(a, c, l.onEscape);
            }
        });
        /**
     * Standard jQuery event listeners; used to handle user
     * interaction with our dialog
     */
        c.on("click", ".modal-footer button", function(a) {
            var d = b(this).data("bb-handler");
            h(a, c, l[d]);
        });
        c.on("click", ".bootbox-close-button", function(a) {
            // onEscape might be falsy but that's fine; the fact is
            // if the user has managed to click the close button we
            // have to close the dialog, callback or not
            h(a, c, l.onEscape);
        });
        c.on("keyup", function(a) {
            if (a.which === 27) {
                c.trigger("escape.close.bb");
            }
        });
        // the remainder of this method simply deals with adding our
        // dialogent to the DOM, augmenting it with Bootstrap's modal
        // functionality and then giving the resulting object back
        // to our caller
        b(a.container).append(c);
        c.modal({
            backdrop: a.backdrop,
            keyboard: false,
            show: false
        });
        if (a.show) {
            c.modal("show");
        }
        // @TODO should we return the raw element here or should
        // we wrap it in an object on which we can expose some neater
        // methods, e.g. var d = bootbox.alert(); d.hide(); instead
        // of d.modal("hide");
        /*
    function BBDialog(elem) {
      this.elem = elem;
    }

    BBDialog.prototype = {
      hide: function() {
        return this.elem.modal("hide");
      },
      show: function() {
        return this.elem.modal("show");
      }
    };
    */
        return c;
    };
    f.setDefaults = function() {
        var a = {};
        if (arguments.length === 2) {
            // allow passing of single key/value...
            a[arguments[0]] = arguments[1];
        } else {
            // ... and as an object too
            a = arguments[0];
        }
        b.extend(e, a);
    };
    f.hideAll = function() {
        b(".bootbox").modal("hide");
        return f;
    };
    /**
   * standard locales. Please add more according to ISO 639-1 standard. Multiple language variants are
   * unlikely to be required. If this gets too large it can be split out into separate JS files.
   */
    var q = {
        br: {
            OK: "OK",
            CANCEL: "Cancelar",
            CONFIRM: "Sim"
        },
        cs: {
            OK: "OK",
            CANCEL: "Zrušit",
            CONFIRM: "Potvrdit"
        },
        da: {
            OK: "OK",
            CANCEL: "Annuller",
            CONFIRM: "Accepter"
        },
        de: {
            OK: "OK",
            CANCEL: "Abbrechen",
            CONFIRM: "Akzeptieren"
        },
        el: {
            OK: "Εντάξει",
            CANCEL: "Ακύρωση",
            CONFIRM: "Επιβεβαίωση"
        },
        en: {
            OK: "OK",
            CANCEL: "Cancel",
            CONFIRM: "OK"
        },
        es: {
            OK: "OK",
            CANCEL: "Cancelar",
            CONFIRM: "Aceptar"
        },
        et: {
            OK: "OK",
            CANCEL: "Katkesta",
            CONFIRM: "OK"
        },
        fi: {
            OK: "OK",
            CANCEL: "Peruuta",
            CONFIRM: "OK"
        },
        fr: {
            OK: "OK",
            CANCEL: "Annuler",
            CONFIRM: "D'accord"
        },
        he: {
            OK: "אישור",
            CANCEL: "ביטול",
            CONFIRM: "אישור"
        },
        id: {
            OK: "OK",
            CANCEL: "Batal",
            CONFIRM: "OK"
        },
        it: {
            OK: "OK",
            CANCEL: "Annulla",
            CONFIRM: "Conferma"
        },
        ja: {
            OK: "OK",
            CANCEL: "キャンセル",
            CONFIRM: "確認"
        },
        lt: {
            OK: "Gerai",
            CANCEL: "Atšaukti",
            CONFIRM: "Patvirtinti"
        },
        lv: {
            OK: "Labi",
            CANCEL: "Atcelt",
            CONFIRM: "Apstiprināt"
        },
        nl: {
            OK: "OK",
            CANCEL: "Annuleren",
            CONFIRM: "Accepteren"
        },
        no: {
            OK: "OK",
            CANCEL: "Avbryt",
            CONFIRM: "OK"
        },
        pl: {
            OK: "OK",
            CANCEL: "Anuluj",
            CONFIRM: "Potwierdź"
        },
        pt: {
            OK: "OK",
            CANCEL: "Cancelar",
            CONFIRM: "Confirmar"
        },
        ru: {
            OK: "OK",
            CANCEL: "Отмена",
            CONFIRM: "Применить"
        },
        sv: {
            OK: "OK",
            CANCEL: "Avbryt",
            CONFIRM: "OK"
        },
        tr: {
            OK: "Tamam",
            CANCEL: "İptal",
            CONFIRM: "Onayla"
        },
        zh_CN: {
            OK: "OK",
            CANCEL: "取消",
            CONFIRM: "确认"
        },
        zh_TW: {
            OK: "OK",
            CANCEL: "取消",
            CONFIRM: "確認"
        }
    };
    f.init = function(c) {
        return a(c || b);
    };
    return f;
});