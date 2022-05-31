import React from 'react';
import { initializeNevermined } from '../nevermined';
import { Config } from '@nevermined-io/nevermined-sdk-js';
import Catalog from '../index';
import { allAssetsDefaultQuery, fetchAssets } from '../services/UseAssetService';

const serviceUri = 'https://autonomies-backend.autonomies.staging.nevermined.rocks';
const metadataUri = 'https://metadata.autonomies.staging.nevermined.rocks'; // 'http://localhost:5000'
const gatewayAddress = '0xe63a11dC61b117D9c2B1Ac8021d4cffEd8EC213b';
const gatewayUri = 'https://gateway.autonomies.staging.nevermined.rocks';
const faucetUri = 'https://faucet.autonomies.staging.nevermined.rocks';
const nodeUri = 'https://polygon-mumbai.infura.io/v3/eda048626e2745b182f43de61ac70be1';
const acceptedChainId = '80001'; // for Mumbai

const testConfig = {
  metadataUri,
  gatewayUri,
  faucetUri,
  nodeUri,
  gatewayAddress,
  verbose: true
} as Config;

jest.setTimeout(20000);

describe('validate package exported items', () => {
  test('exist', () => {
    expect(Catalog.NeverminedProvider).toBeDefined();
    expect(Catalog.useAssetService).toBeDefined();
    expect(Catalog.useNevermined).toBeDefined();
  });
});

describe('initializeNevermined', () => {
  test('success', async () => {
    console.log('Testing nevermined initiliziation with config: ', JSON.stringify(testConfig));
    //@ts-ignore
    global.window = {}; // needed - for some reason jest remove window object
    const response = await initializeNevermined(testConfig);
    //@ts-ignore
    expect(response?.data?._web3?._requestManager?.provider?.host).toEqual(nodeUri); // maybe we have a better indication for successfull connection with nevermined
    expect(false).toEqual(false);
  });
});

describe('fetch assets', () => {
  test('all assets query(offset=2)', async () => {
    console.log('Testing nevermined initiliziation with config: ', JSON.stringify(testConfig));
    //@ts-ignore
    global.window = {};
    const response = await initializeNevermined(testConfig);
    //@ts-ignore
    expect(response?.data?._web3?._requestManager?.provider?.host).toEqual(nodeUri);
    const assets = await fetchAssets(response.data, allAssetsDefaultQuery);
    expect(assets.data.length).toEqual(2);
  });
});
