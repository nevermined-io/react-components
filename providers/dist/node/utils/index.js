"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isEmptyObject = void 0;
// if empty returns true
const isEmptyObject = (i) => !i || Object.keys(i).length < 1;
exports.isEmptyObject = isEmptyObject;
