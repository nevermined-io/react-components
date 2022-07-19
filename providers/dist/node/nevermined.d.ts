import { Config, Nevermined } from '@nevermined-io/nevermined-sdk-js';
import React from 'react';
import { GenericOutput, NeverminedProviderContext, NeverminedProviderProps } from './types';
export declare const initialState: {
    sdk: Nevermined;
};
export declare const neverminedReducer: (state: {
    sdk: Nevermined;
}, action: {
    type: 'SET_SDK';
    payload: {
        sdk: Nevermined;
    };
}) => {
    sdk: Nevermined;
};
export declare const initializeNevermined: (config: Config) => Promise<GenericOutput<Nevermined, any>>;
export declare const NeverminedProvider: ({ children, config, verbose }: NeverminedProviderProps) => JSX.Element;
export declare const NeverminedContext: React.Context<NeverminedProviderContext>;
export declare const useNevermined: () => NeverminedProviderContext;
