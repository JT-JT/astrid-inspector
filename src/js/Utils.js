
const Utils = {

    valueOrDefault: function valueOrDefault(value, defaultValue) {
        return (Utils.isNullOrUndefined(value) ? defaultValue : value);
    },

    argumentOrDefault: function argumentOrDefault(args, index, defaultValue) {
        if (args && args.length > index) {
            return Utils.valueOrDefault(args[index], defaultValue);
        }

        return defaultValue;
    },

    hasFlag: function hasFlag(flag, flags) {
        return !!(flags & flag);
    },

    toggleFlag: function toggleFlag(flag, flags, enabled) {
        return (enabled ? (flags | flag) : (flags & ~flag));
    },

    setFlag: function setFlag(flag, flags) {
        return Utils.toggleFlag(flag, flags, true);
    },

    clearFlag: function clearFlag(flag, flags) {
        return Utils.toggleFlag(flag, flags, false);
    },

    toString: function toString(value) {
        return Object.prototype.toString.call(value);
    },

    toInt: function toInt(value) {
        return (value >> 0);
    },

    isUndefined: function isUndefined(value) {
        return (value === void(0));
    },

    isNotUndefined: function isNotUndefined(value) {
        return !Utils.isUndefined(value);
    },

    isNull: function isNull(value, includeUndefined) {
        includeUndefined = Utils.valueOrDefault(includeUndefined, true);

        return (includeUndefined ? Utils.isNullOrUndefined(value) : value === null);
    },

    isNotNull: function isNotNull(value, includeUndefined) {
        return !Utils.isNull(value, includeUndefined);
    },

    isNullOrUndefined: function isNullOrUndefined(value) {
        return (value === null || Utils.isUndefined(value));
    },

    isNotNullOrUndefined: function isNotNullOrUndefined(value) {
        return !Utils.isNullOrUndefined(value);
    },

    isNullOrEmpty: function isNullOrEmpty(value) {
        return (Utils.isNullOrUndefined(value) || !value.length);
    },

    isStringNullOrEmpty: function isStringNullOrEmpty(value) {
        return (Utils.isNullOrUndefined(value) || (Utils.isString(value) && value.length === 0));
    },

    isStringNotNullOrEmpty: function isStringNotNullOrEmpty(value) {
        return !Utils.isStringNullOrEmpty(value);
    },

    isArray: function isArray(value) {
        return Array.isArray(value);
    },

    isArrayBuffer: function isArrayBuffer(value) {
        if (!Utils.isObject(value)) {
            return false;
        }

        // value might be a typed array, so re-run using the typed array buffer
        if (value.buffer) {
            return Utils.isArrayBuffer(value.buffer);
        }

        return (Utils.toString(value) === "[object ArrayBuffer]" || value instanceof ArrayBuffer);
    },

    isBoolean: function isBoolean(value) {
        return (typeof value === "boolean");
    },

    isDate: function isDate(value) {
        return (Utils.isObject(value) && Utils.toString(value) === "[object Date]");
    },

    isError: function isError(value) {
        return (Utils.isObject(value) && (Utils.toString(value) === "[object Error]" || value instanceof Error));
    },

    isFunction: function isFunction(value) {
        return (typeof value === "function");
    },

    isNumber: function isNumber(value) {
        return (typeof value === "number");
    },

    isInteger: function isInteger(value) {
        if (Number.isInteger) {
            return Number.isInteger(value);
        }

        return (Utils.isNumber(value) && isFinite(value) && value > -9007199254740992 && value < 9007199254740992 && Math.floor(value) === value);
    },

    isObject: function isObject(value) {
        return (typeof value === "object" && !Utils.isNull(value));
    },

    isString: function isString(value) {
        return (typeof value === "string");
    },

    mixin: function mixin(parentClass, objMixin) {
        class Mixed extends parentClass { }
        Object.assign(Mixed.prototype, objMixin);

        return Mixed;
    },

    format: function format(str) {
        var i = 1;
        var args = arguments;
        var argsLen = args.length;

        var formatValue = function formatValue(value) {
            if (Utils.isDate(value)) {
                return Date.prototype.toString.call(value);
            }
            else if (Utils.isError(value)) {
                return Error.prototype.toString.call(value);
            }
            else if (Utils.isFunction(value)) {
                return "[Function" + (value.name ? ": " + value.name : "") + "]";
            }
            else {
                return "" + value;
            }
        };

        if (!Utils.isString(str)) {
            var objs = [];

            for (i = 0; i < argsLen; ++i) {
                objs.push(formatValue(args[i]));
            }

            return objs.join(" ");
        }

        str = String(str).replace(/%[sdijxX%]/g, function replaceMatch(m) {
            if (m === "%%") {
                return "%";
            }

            if (i >= argsLen) {
                return m;
            }

            switch (m) {
                case "%s":
                    return String(args[i++]);
                case "%d":
                    return Number(args[i++]);
                case "%i":
                    return Math.floor(Number(args[i++]));
                case "%x":
                    return "0x" + Number(args[i++]).toString(16);
                case "%X":
                    return "0x" + Number(args[i++]).toString(16).toUpperCase();
                case "%j":
                    try {
                        return JSON.stringify(args[i++]);
                    }
                    catch (e) {
                        void(e);
                        return "[...]";
                    }
                default:
                    return m;
            }
        });

        for (var a = args[i]; i < argsLen; a = args[++i]) {
            str += " " + formatValue(a);
        }

        return str;
    },

    getQueryStringParameter: function getQueryStringParameter(name) {
        var qs = location.search.substr(1);
        var params = qs.split("&");

        for (var i = 0; i < params.length; i++) {
            var p = params[i].split("=");

            if (p[0] === name) {
                return p[1];
            }
        }

        return null;
    },

    createHTTPRequest: function createHTTPRequest() {
        if (window.XMLHttpRequest) {
            return new XMLHttpRequest();
        }
        else {
            return new ActiveXObject("Microsoft.XMLHTTP");
        }
    },

    requestAnimationFrame: function requestAnimationFrame(callback) {
        var nativeFunc =
            window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||

            (function (callback) {
                return window.setTimeout(function () {
                    callback(performance.now());
                }, 0);
            });

        return nativeFunc(callback);
    }

};

export default Utils;
