<template>
    <div class="CompContainer">
        <div class="Vidage">
            <div class="vidageImage"></div>
            <video ref="video" id="VidageVideo" class="vidageVideo" preload="metadata" loop autoplay muted
                x5-playsinline
                playsinline
                webkit-playsinline
                x5-video-player-type="h5"
            >
                <source  :src="prop_video_source" type="video/mp4">
            </video>
    
            <div class="vidageBackdrop"></div>
        </div>
    
    </div>
</template>
<script>
import nanocorePv3 from "_assets/videos/pv3.mp4"


export default {
    name: "nano_effect_bg_video",
    data() {
        return {
            a:nanocorePv3,
        }
    },
    props:{
        prop_video_source:{
            type:String,
            default:"",
            require:true,
        }
    },  
    mounted() {
        ! function (e) {
            if ("object" == typeof exports && "undefined" != typeof module) module.exports = e();
            else if ("function" == typeof define && define.amd) define([], e);
            else {
                var t;
                t = "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : this, t.Vidage = e()
            }
        }(function () {
            return function e(t, n, r) {
                function o(u, a) {
                    if (!n[u]) {
                        if (!t[u]) {
                            var c = "function" == typeof require && require;
                            if (!a && c) return c(u, !0);
                            if (i) return i(u, !0);
                            var f = new Error("Cannot find module '" + u + "'");
                            throw f.code = "MODULE_NOT_FOUND", f
                        }
                        var s = n[u] = {
                            exports: {}
                        };
                        t[u][0].call(s.exports, function (e) {
                            var n = t[u][1][e];
                            return o(n ? n : e)
                        }, s, s.exports, e, t, n, r)
                    }
                    return n[u].exports
                }
                for (var i = "function" == typeof require && require, u = 0; u < r.length; u++) o(r[u]);
                return o
            }({
                1: [function (e, t, n) {
                    function r(e, t, n) {
                        function r(t) {
                            var n = y,
                                r = b;
                            return y = b = void 0, S = t, x = e.apply(r, n)
                        }

                        function s(e) {
                            return S = e, O = setTimeout(v, t), E ? r(e) : x
                        }

                        function l(e) {
                            var n = e - j,
                                r = e - S,
                                o = t - n;
                            return T ? f(o, g - r) : o
                        }

                        function d(e) {
                            var n = e - j,
                                r = e - S;
                            return void 0 === j || n >= t || 0 > n || T && r >= g
                        }

                        function v() {
                            var e = i();
                            return d(e) ? p(e) : void(O = setTimeout(v, l(e)))
                        }

                        function p(e) {
                            return O = void 0, L && y ? r(e) : (y = b = void 0, x)
                        }

                        function h() {
                            S = 0, y = j = b = O = void 0
                        }

                        function m() {
                            return void 0 === O ? x : p(i())
                        }

                        function w() {
                            var e = i(),
                                n = d(e);
                            if (y = arguments, b = this, j = e, n) {
                                if (void 0 === O) return s(j);
                                if (T) return O = setTimeout(v, t), r(j)
                            }
                            return void 0 === O && (O = setTimeout(v, t)), x
                        }
                        var y, b, g, x, O, j, S = 0,
                            E = !1,
                            T = !1,
                            L = !0;
                        if ("function" != typeof e) throw new TypeError(a);
                        return t = u(t) || 0, o(n) && (E = !!n.leading, T = "maxWait" in n, g = T ? c(u(n.maxWait) || 0, t) : g, L = "trailing" in n ? !!n.trailing : L), w.cancel = h, w.flush = m, w
                    }
                    var o = e("./isObject"),
                        i = e("./now"),
                        u = e("./toNumber"),
                        a = "Expected a function",
                        c = Math.max,
                        f = Math.min;
                    t.exports = r
                }, {
                    "./isObject": 3,
                    "./now": 6,
                    "./toNumber": 7
                }],
                2: [function (e, t, n) {
                    function r(e) {
                        var t = o(e) ? c.call(e) : "";
                        return t == i || t == u
                    }
                    var o = e("./isObject"),
                        i = "[object Function]",
                        u = "[object GeneratorFunction]",
                        a = Object.prototype,
                        c = a.toString;
                    t.exports = r
                }, {
                    "./isObject": 3
                }],
                3: [function (e, t, n) {
                    function r(e) {
                        var t = typeof e;
                        return !!e && ("object" == t || "function" == t)
                    }
                    t.exports = r
                }, {}],
                4: [function (e, t, n) {
                    function r(e) {
                        return !!e && "object" == typeof e
                    }
                    t.exports = r
                }, {}],
                5: [function (e, t, n) {
                    function r(e) {
                        return "symbol" == typeof e || o(e) && a.call(e) == i
                    }
                    var o = e("./isObjectLike"),
                        i = "[object Symbol]",
                        u = Object.prototype,
                        a = u.toString;
                    t.exports = r
                }, {
                    "./isObjectLike": 4
                }],
                6: [function (e, t, n) {
                    function r() {
                        return Date.now()
                    }
                    t.exports = r
                }, {}],
                7: [function (e, t, n) {
                    function r(e) {
                        if ("number" == typeof e) return e;
                        if (u(e)) return a;
                        if (i(e)) {
                            var t = o(e.valueOf) ? e.valueOf() : e;
                            e = i(t) ? t + "" : t
                        }
                        if ("string" != typeof e) return 0 === e ? e : +e;
                        e = e.replace(c, "");
                        var n = s.test(e);
                        return n || l.test(e) ? d(e.slice(2), n ? 2 : 8) : f.test(e) ? a : +e
                    }
                    var o = e("./isFunction"),
                        i = e("./isObject"),
                        u = e("./isSymbol"),
                        a = NaN,
                        c = /^\s+|\s+$/g,
                        f = /^[-+]0x[0-9a-f]+$/i,
                        s = /^0b[01]+$/i,
                        l = /^0o[0-7]+$/i,
                        d = parseInt;
                    t.exports = r
                }, {
                    "./isFunction": 2,
                    "./isObject": 3,
                    "./isSymbol": 5
                }],
                8: [function (e, t, n) {
                    "use strict";

                    function r(e) {
                        return e && e.__esModule ? e : {
                            "default": e
                        }
                    }

                    function o(e, t) {
                        if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
                    }
                    Object.defineProperty(n, "__esModule", {
                        value: !0
                    });
                    var i = function () {
                            function e(e, t) {
                                for (var n = 0; n < t.length; n++) {
                                    var r = t[n];
                                    r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r)
                                }
                            }
                            return function (t, n, r) {
                                return n && e(t.prototype, n), r && e(t, r), t
                            }
                        }(),
                        u = e("lodash/debounce"),
                        a = r(u),
                        c = function () {
                            function e(t) {
                                var n = arguments.length <= 1 || void 0 === arguments[1] ? "vidageAllow" : arguments[1];
                                o(this, e), this._name = this.constructor.name, this.element = this.validateSelector(t), this.helperClass = n, this.init()
                            }
                            return i(e, [{
                                key: "init",
                                value: function () {
                                    var e = this;
                                    this.element.addEventListener("canplay", function () {
                                        return e.handler()
                                    }), window.addEventListener("resize", (0, a["default"])(function () {
                                        return e.handler()
                                    }, 250)), window.addEventListener("orientationchange", function () {
                                        return e.handler()
                                    })
                                }
                            }, {
                                key: "handler",
                                value: function () {
                                    var e = document.body;
                                    this.detectTouchOrSmallScreen() ? (this.element.pause(), e.classList.remove(this.helperClass)) : (this.element.play(), e.classList.add(this.helperClass))
                                }
                            }, {
                                key: "validateSelector",
                                value: function (e) {
                                    if ("undefined" == typeof e) throw new Error(this._name + " requires a video selector as first argument.");
                                    if (e = "string" == typeof e ? document.querySelector(e) : e, "video" !== e.nodeName.toLowerCase()) throw new Error(this._name + " requires a valid video selector. You passed a <" + validSelector.nodeName + ">");
                                    return e
                                }
                            }, {
                                key: "detectTouchOrSmallScreen",
                                value: function () {
                                    var e = {
                                        touch: !!("ontouchstart" in window || window.navigator && window.navigator.msPointerEnabled && window.MSGesture || window.DocumentTouch && document instanceof DocumentTouch),
                                        small: window.matchMedia("(max-width: 34em)").matches
                                    };
                                    return e.touch || e.small
                                }
                            }]), e
                        }();
                    n["default"] = c, t.exports = n["default"]
                }, {
                    "lodash/debounce": 1
                }]
            }, {}, [8])(8)
        });
        new Vidage('#VidageVideo');
        //auto play in mobile.
    },
    methods: {
       
    },
   
}
</script>
<style lang="less" scoped>
@import "./nano_effect_bg_video.less";
</style>