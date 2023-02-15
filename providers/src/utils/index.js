"use strict";
exports.__esModule = true;
exports.zeroX = void 0;
function zeroX(input) {
    if (input === void 0) { input = ""; }
    var _a = inputMatch(input, /^(?:0x)*([a-f0-9]+)$/i, "zeroXTransformer"), valid = _a.valid, output = _a.output;
    return (valid ? "0x" : "") + output;
}
exports.zeroX = zeroX;
var inputMatch = function (input, regexp, conversorName) {
    if (typeof input !== "string") {
        throw new Error("[".concat(conversorName, "] Expected string, input type: ").concat(typeof input));
    }
    var match = input.match(regexp);
    if (!match) {
        return { valid: false, output: input };
    }
    return { valid: true, output: match[1] };
};
