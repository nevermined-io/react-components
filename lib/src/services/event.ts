import { Logger, Nevermined, subgraphs } from '@nevermined-io/nevermined-sdk-js';
import { FullfilledOrders, RegisterEvent, Transfer } from '../types';

export const getTransfers = async (sdk: Nevermined, receiver: string): Promise<Transfer[]> => {
  try {
    const resultStruct = {
      id: true,
      _did: true,
      _agreementId: true,
      _receiver: true
    };
    const methodName = 'getFulfilleds';
    const condition = {
      where: {
        _receiver: receiver
      }
    };
    const data: Transfer[] = await sdk.keeper.conditions.transferNftCondition.events.getEventData({
      filterSubgraph: condition,
      methodName,
      result: resultStruct
    });
    return data;
  } catch (error) {
    Logger.warn('Something went wrong@getTransfers');
    Logger.debug(error);
    return [];
  }
};

export const getUserFulfilledEvents = async (
  sdk: Nevermined,
  account: string
): Promise<FullfilledOrders[]> => {
  try {
    const condition = {
      where: {
        _grantee: account
      }
    };
    const resultStruct = {
      _documentId: true
    };
    const methodName = 'getFulfilleds';
    const result = await sdk.keeper.conditions.accessCondition.events.getPastEvents({
      methodName,
      filterSubgraph: condition,
      result: resultStruct
    });
    return result;
  } catch (error) {
    Logger.warn('Something went wrong@getUserFulfilledEvents');
    Logger.debug(error);
    return [];
  }
};

export const getUserRegisterEvents = async (
  sdk: Nevermined,
  owner: string
): Promise<RegisterEvent[]> => {
  try {
    const methodName = 'getDIDAttributeRegistereds';
    const condition = {
      where: {
        _owner: owner
      }
    };
    const resultStruct = {
      _did: true,
      _owner: true,
      _lastUpdatedBy: true,
      _blockNumberUpdated: true
    };
    const result: RegisterEvent[] = await sdk.keeper.didRegistry.events.getPastEvents({
      methodName,
      filterSubgraph: condition,
      result: resultStruct
    });

    return result;
  } catch (error) {
    Logger.warn('Something went wrong@getUserRegisterEvents');
    Logger.debug(error);
    return [];
  }
};

export const getAssetRegisterEvent = async (
  asset: string,
  graphUrl: string
): Promise<RegisterEvent[]> => {
  try {
    const condition = {
      where: {
        _did: asset
      }
    };
    const registerEvents: RegisterEvent[] = await subgraphs.DIDRegistry.getDIDAttributeRegistereds(
      `${graphUrl}/DIDRegistry`,
      condition,
      {
        _did: true,
        _owner: true,
        _lastUpdatedBy: true,
        _blockNumberUpdated: true
      }
    );
    return registerEvents; // Should have length 1
  } catch (error) {
    Logger.warn('Something went wrong@getAssetRegisterEvent');
    Logger.debug(error);
    return [];
  }
};
