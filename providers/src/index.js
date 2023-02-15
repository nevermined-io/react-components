"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
exports.__esModule = true;
exports.ConnectKit = exports.Ethers = exports.WagmiCore = exports.CoinbaseWallet = exports.Metamask = exports.WalletConnect = exports.Chains = exports.Wagmi = exports.zeroX = void 0;
var utils_1 = require("./utils");
__createBinding(exports, utils_1, "zeroX");
__exportStar(require("./providers"), exports);
__exportStar(require("./client"), exports);
__exportStar(require("./types"), exports);
exports.Wagmi = require("wagmi");
exports.Chains = require("wagmi/chains");
exports.WalletConnect = require("wagmi/connectors/walletConnect");
exports.Metamask = require("wagmi/connectors/metaMask");
exports.CoinbaseWallet = require("wagmi/connectors/coinbaseWallet");
exports.WagmiCore = require("@wagmi/core");
exports.Ethers = require("ethers");
exports.ConnectKit = require("connectkit");
