import { Nevermined } from '@nevermined-io/nevermined-sdk-js';

export const getAssetsReleasedByAddress = async (address: string, sdk: Nevermined): Promise<string[]> => {
    if (sdk && sdk.keeper) {
        const query = await sdk.keeper.didRegistry.events.getPastEvents({
            eventName: 'DidAttributeRegistered',
            methodName: 'getDIDAttributeRegistereds',
            filterSubgraph: { where: { _owner: address }, orderBy: '_blockNumberUpdated', orderDirection: 'desc' },
            result: {
                id: true,
                _did: true,
                _owner: true,
                _blockNumberUpdated: true,
                _lastUpdatedBy: true,
            },
        });

        return query.map((item) => item._did);
    } else return [];
};

export const getAssetsReceivedByAddress = async (
    address: string,
    sdk: Nevermined,
): Promise<{ _did: string; timestamp: number }[]> => {
    const query = await sdk?.keeper?.conditions?.transferNftCondition?.events?.getPastEvents({
        eventName: 'Fulfilled',
        methodName: 'getFulfilleds',
        filterSubgraph: { where: { _receiver: address }, orderBy: '_did', orderDirection: 'desc' },
        result: {
            id: true,
            _did: true,
            _receiver: true,
            _agreementId: true,
            _contract: true,
        },
    });
    if (!query || query.length == 0) return [];

    return query;
};

