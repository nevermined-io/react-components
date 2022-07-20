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
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useWallet = exports.WalletProvider = exports.WalletContext = void 0;
const react_1 = __importStar(require("react"));
const web3_1 = __importDefault(require("web3"));
const convertHextoIntString = (hex) => {
    const removedAddressFormat = hex.replace("0x", "");
    const intString = parseInt(removedAddressFormat, 16);
    return intString.toString();
};
exports.WalletContext = (0, react_1.createContext)({});
const WalletProvider = ({ children, nodeUri, correctNetworkId, chainConfig, }) => {
    const correctChainId = convertHextoIntString(correctNetworkId);
    const w3 = (0, react_1.useRef)({});
    const [walletAddress, setWalletAddress] = (0, react_1.useState)("");
    const [acceptedChainId, setAcceptedChainId] = (0, react_1.useState)("");
    const [acceptedChainIdHex, setAcceptedChainIdHex] = (0, react_1.useState)("");
    const [isChainCorrect, setIsChainCorrect] = (0, react_1.useState)(true);
    const checkIsNotChainCorrect = (chainHexId) => {
        return !Object.keys(chainConfig).some((env) => {
            if (env === "returnConfig") {
                return false;
            }
            return chainConfig[env].chainId === chainHexId;
        });
    };
    const checkChain = async (chainHexId) => {
        if (checkIsNotChainCorrect(chainHexId)) {
            setAcceptedChainId(correctChainId);
            setAcceptedChainIdHex(correctNetworkId);
            setIsChainCorrect(false);
        }
        else {
            setAcceptedChainId(convertHextoIntString(chainHexId));
            setAcceptedChainIdHex(chainHexId);
        }
    };
    (0, react_1.useEffect)(() => {
        if (!isChainCorrect)
            switchChainsOrRegisterSupportedChain();
    }, [isChainCorrect]);
    (0, react_1.useEffect)(() => {
        (async () => {
            var _a, _b;
            const chainIdHex = await ((_b = (_a = window.ethereum).request) === null || _b === void 0 ? void 0 : _b.call(_a, {
                method: "eth_chainId",
            }));
            const chainId = convertHextoIntString(chainIdHex);
            setAcceptedChainId(chainId);
            checkChain(chainIdHex);
        })();
        window.ethereum.on("chainChanged", (chainHexId) => {
            checkChain(chainHexId);
        });
    }, []);
    (0, react_1.useEffect)(() => {
        const registerOnAccounsChangedListener = async () => {
            window.ethereum.on("accountsChanged", (newAccount) => {
                if (newAccount && newAccount.length > 0) {
                    setWalletAddress(web3_1.default.utils.toChecksumAddress(newAccount[0]));
                }
                else {
                    setWalletAddress("");
                    console.log("No Account found!");
                }
            });
        };
        registerOnAccounsChangedListener();
    }, []);
    const updateWalletAddress = async () => {
        var _a, _b;
        const accounts = await ((_b = (_a = w3.current) === null || _a === void 0 ? void 0 : _a.eth) === null || _b === void 0 ? void 0 : _b.getAccounts());
        setWalletAddress((accounts === null || accounts === void 0 ? void 0 : accounts.length) ? web3_1.default.utils.toChecksumAddress(accounts[0]) : "");
    };
    (0, react_1.useEffect)(() => {
        (() => {
            let web3 = {};
            // Modern dapp browsers
            if (window.ethereum) {
                web3 = new web3_1.default(window.ethereum);
            }
            // Legacy dapp browsers
            else if (window.web3) {
                web3 = new web3_1.default(window.web3.currentProvider);
            }
            else {
                console.log("No Web3, defaulting to HTTPProvider");
                web3 = new web3_1.default(new web3_1.default.providers.HttpProvider(String(nodeUri)));
            }
            w3.current = web3;
            updateWalletAddress();
        })();
    }, []);
    const switchChainsOrRegisterSupportedChain = async () => {
        var _a, _b, _c, _d;
        if (!acceptedChainIdHex) {
            return;
        }
        try {
            await ((_b = (_a = window.ethereum).request) === null || _b === void 0 ? void 0 : _b.call(_a, {
                method: "wallet_switchEthereumChain",
                params: [
                    {
                        chainId: acceptedChainIdHex,
                    },
                ],
            }));
            setIsChainCorrect(true);
        }
        catch (switchError) {
            if (switchError.code === 4902) {
                try {
                    const currentChainConfig = chainConfig.returnConfig(acceptedChainIdHex);
                    const configParam = await ((_d = (_c = window.ethereum).request) === null || _d === void 0 ? void 0 : _d.call(_c, {
                        method: "wallet_addEthereumChain",
                        params: [currentChainConfig],
                    }));
                    if (!configParam) {
                        console.log(`Chain ${acceptedChainId} added successfully!`);
                    }
                }
                catch (addError) {
                    console.error(addError);
                }
            }
            console.error(switchError);
        }
    };
    const isAvailable = () => {
        return w3.current !== null;
    };
    const promptSwitchAccounts = async () => {
        var _a, _b;
        await ((_b = (_a = window.ethereum).request) === null || _b === void 0 ? void 0 : _b.call(_a, {
            method: "wallet_requestPermissions",
            params: [
                {
                    eth_accounts: {},
                },
            ],
        }));
    };
    const checkIsLogged = async () => {
        var _a, _b, _c, _d;
        if (!isAvailable() && !((_b = (_a = w3.current) === null || _a === void 0 ? void 0 : _a.eth) === null || _b === void 0 ? void 0 : _b.getAccounts))
            return false;
        const accounts = await ((_d = (_c = w3.current) === null || _c === void 0 ? void 0 : _c.eth) === null || _d === void 0 ? void 0 : _d.getAccounts());
        return Boolean(accounts === null || accounts === void 0 ? void 0 : accounts.length);
    };
    const startLogin = async () => {
        var _a, _b;
        try {
            const response = await ((_b = (_a = window.ethereum).request) === null || _b === void 0 ? void 0 : _b.call(_a, {
                method: "eth_requestAccounts",
            }));
            setWalletAddress(web3_1.default.utils.toChecksumAddress(response[0]));
            return response;
        }
        catch (error) {
            return await Promise.reject(error);
        }
    };
    const loginMetamask = async () => {
        try {
            await startLogin();
        }
        catch (error) {
            console.error(error);
        }
    };
    const logout = () => {
        setWalletAddress("");
    };
    const getProvider = () => {
        return w3.current;
    };
    const IState = {
        walletAddress,
        loginMetamask,
        getProvider,
        logout,
        promptSwitchAccounts,
        switchChainsOrRegisterSupportedChain,
        checkIsLogged,
        isAvailable,
        isChainCorrect,
    };
    return (react_1.default.createElement(exports.WalletContext.Provider, { value: IState }, children));
};
exports.WalletProvider = WalletProvider;
const useWallet = () => (0, react_1.useContext)(exports.WalletContext);
exports.useWallet = useWallet;
