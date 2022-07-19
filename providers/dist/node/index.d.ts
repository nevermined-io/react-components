/// <reference types="react" />
export declare const Catalog: {
    fetchMarketplaceApiTokenFromLocalStorage: () => import("./types").MarketplaceAPIToken;
    newMarketplaceApiToken: (sdk: import("@nevermined-io/nevermined-sdk-js").Nevermined) => Promise<import("./types").MarketplaceAPIToken>;
    isTokenValid: () => boolean;
    useSubscribeToPaymentEvents: () => () => {
        paymentEvents: import("@nevermined-io/nevermined-sdk-js/dist/node/events").EventResult[];
        paymentSubscription: import("@nevermined-io/nevermined-sdk-js/dist/node/events").ContractEventSubscription | undefined;
    };
    useSubscribeToTransferEvents: () => () => {
        transferEvents: import("@nevermined-io/nevermined-sdk-js/dist/node/events").EventResult[];
        transferSubscription: import("@nevermined-io/nevermined-sdk-js/dist/node/events").ContractEventSubscription | undefined;
    };
    usePaymentEvents: () => {
        paymentEvents: import("@nevermined-io/nevermined-sdk-js/dist/node/events").EventResult[];
        isLoading: boolean;
    };
    useUserTransferEvents: (id: string) => {
        isLoading: boolean;
        transferEvents: import("@nevermined-io/nevermined-sdk-js/dist/node/events").EventResult[];
    };
    useAccountReleases: (id: string, format?: ((dids: string[]) => any) | undefined) => {
        isLoading: boolean;
        accountReleases: string[];
    };
    useAccountCollection: (id: string, format: (dids: string[]) => any) => {
        isLoading: boolean;
        accountCollection: string[];
    };
    useAssets: (q: import("@nevermined-io/nevermined-sdk-js").SearchQuery) => {
        result: import("@nevermined-io/nevermined-sdk-js/dist/node/metadata/Metadata").QueryResult;
        isLoading: boolean;
    };
    useAsset: (did: string) => import("./types").AssetState;
    initialState: {
        sdk: import("@nevermined-io/nevermined-sdk-js").Nevermined;
    };
    neverminedReducer: (state: {
        sdk: import("@nevermined-io/nevermined-sdk-js").Nevermined;
    }, action: {
        type: "SET_SDK";
        payload: {
            sdk: import("@nevermined-io/nevermined-sdk-js").Nevermined;
        };
    }) => {
        sdk: import("@nevermined-io/nevermined-sdk-js").Nevermined;
    };
    initializeNevermined: (config: import("@nevermined-io/nevermined-sdk-js").Config) => Promise<import("./types").GenericOutput<import("@nevermined-io/nevermined-sdk-js").Nevermined, any>>;
    NeverminedProvider: ({ children, config, verbose }: import("./types").NeverminedProviderProps) => JSX.Element;
    NeverminedContext: import("react").Context<import("./types").NeverminedProviderContext>;
    useNevermined: () => import("./types").NeverminedProviderContext;
};
export default Catalog;
