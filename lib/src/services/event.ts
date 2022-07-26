import { Nevermined, subgraphs } from '@nevermined-io/nevermined-sdk-js';
import { EventOptions, EventResult } from '@nevermined-io/nevermined-sdk-js/dist/node/events';
import { useContext, useEffect, useState } from 'react';
import { NeverminedContext } from '../nevermined';
import { AssetRegisterEvent, FullfilledOrders } from '../types';

const getTransfers = async (sdk: Nevermined, receiver: string): Promise<EventResult> => {
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
    const data = await sdk.keeper.conditions.transferNftCondition.events.getEventData({
      filterSubgraph: condition,
      methodName,
      result: resultStruct
    });
    return data;
  } catch (error) {
    console.error(error);
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
    const fullfilled = await sdk.keeper.conditions.accessCondition.events.getPastEvents({
      methodName,
      filterSubgraph: condition,
      result: resultStruct
    });
    return fullfilled;
  } catch (error) {
    console.log('Error loading Asset Publish Event');
    return {} as EventResult;
  }
};

export const getUserRegisterEvents = async (
  sdk: Nevermined,
  owner: string
): Promise<EventResult> => {
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
    const registered = await sdk.keeper.didRegistry.events.getPastEvents({
      methodName,
      filterSubgraph: condition,
      result: resultStruct
    });

    return registered;
  } catch (error) {
    console.log('Error loading Asset Publish Event');
    return {} as EventResult;
  }
};

// Subgraphs
export const getAssetRegisterEvent = async (
  asset: string,
  graphUrl: string
): Promise<AssetRegisterEvent> => {
  try {
    const condition = {
      where: {
        _did: asset
      }
    };
    const resultStruct = {
      _did: true,
      _owner: true,
      _lastUpdatedBy: true,
      _blockNumberUpdated: true
    };
    const registerEvent: AssetRegisterEvent[] =
      await subgraphs.DIDRegistry.getDIDAttributeRegistereds(
        `${graphUrl}/DIDRegistry`,
        condition,
        //@ts-ignore
        resultStruct
      );
    return registerEvent[0]; // Should return only one event
  } catch (error) {
    console.log('Error loading Asset Publish Event');
    return {} as AssetRegisterEvent;
  }
};
