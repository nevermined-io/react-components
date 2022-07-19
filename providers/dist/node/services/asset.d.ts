import { SearchQuery } from '@nevermined-io/nevermined-sdk-js';
import { QueryResult } from '@nevermined-io/nevermined-sdk-js/dist/node/metadata/Metadata';
import { AssetState } from '../types';
export declare const useAssets: (q: SearchQuery) => {
    result: QueryResult;
    isLoading: boolean;
};
export declare const useAsset: (did: string) => AssetState;
