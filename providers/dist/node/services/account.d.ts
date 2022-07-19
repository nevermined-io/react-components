export declare const useAccountReleases: (id: string, format?: ((dids: string[]) => any) | undefined) => {
    isLoading: boolean;
    accountReleases: string[];
};
export declare const useAccountCollection: (id: string, format: (dids: string[]) => any) => {
    isLoading: boolean;
    accountCollection: string[];
};
