import { Nevermined, subgraphs } from '@nevermined-io/nevermined-sdk-js';
import { EventOptions, EventResult } from '@nevermined-io/nevermined-sdk-js/dist/node/events';
import { useContext, useEffect, useState } from 'react';
import { NeverminedContext } from '../nevermined';
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
    return {} as EventResult;
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
    return {} as EventResult;
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
    return {} as EventResult;
  }
};

export const getAssetRegisterEvent = async (
  asset: string,
  graphUrl: string
): Promise<RegisterEvent> => {
  try {
    const condition = {
      where: {
        _did: asset
      }
    };
    const registerEvent: RegisterEvent[] = await subgraphs.DIDRegistry.getDIDAttributeRegistereds(
      `${graphUrl}/DIDRegistry`,
      condition,
      {
        _did: true,
        _owner: true,
        _lastUpdatedBy: true,
        _blockNumberUpdated: true
      }
    );
    return registerEvent[0]; // Should return only one event
  } catch (error) {
    return {} as RegisterEvent;
  }
};

