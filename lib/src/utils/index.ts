import {
  Account,
  Config,
  DDO,
  MetaData,
  MetaDataMain,
  Nevermined,
  SearchQuery
} from '@nevermined-io/nevermined-sdk-js';
import formPublish from './form-publish.json';
import { Logger } from '@nevermined-io/nevermined-sdk-js/dist/node/utils';
import queryBuilder from './query-builder';
import {
  AssetState,
  AutonomiesAttributeNames,
  AutonomiesMetaData,
  CollectionItem,
  GenericOutput
} from '../types';
import { ServiceCommon } from '@nevermined-io/nevermined-sdk-js/dist/node/ddo/Service';

export const isEmptyObject = (i: any) => !i || Object.keys(i).length < 1;

export function truthy<T>(value: T) {
  return Boolean(value); //  or !!value
}

export const calculateAssetPrice = (artwork: DDO, decimals: number): number => {
  const {
    attributes: { main }
  } = artwork.findServiceByType('metadata');
  const { price } = main;
  let priceNum = +price;
  priceNum /= 10 ** decimals;

  return priceNum;
};

export function findCoverForAsset(metaData: MetaData): string {
  if (metaData && metaData.additionalInformation && metaData.additionalInformation.customData) {
    const { coverUrl } = metaData.additionalInformation.customData;
    if (coverUrl && coverUrl !== '') {
      return coverUrl;
    }
    console.log('Broken asset, no cover found!');
  }
  return '';
}

export const categories: string[] =
  (formPublish.steps[0].fields['additionalInformation.categories'] &&
    formPublish.steps[0].fields['additionalInformation.categories'].options) ||
  [];

export const Queries = {
  allAssets: () => {
    const lenientCategoriesQuery: any = queryBuilder.createLenientQuery('categories', categories);
    const q: SearchQuery = {
      offset: 150,
      page: 1,
      query: lenientCategoriesQuery,
      sort: {
        created: -1
      }
    };
    return q;
  }
};

export interface AutonomiesMetaDataMain extends MetaDataMain {
  priceInEther?: number;
}

interface AssetStateHere extends MetaData {
  autonomies?: AutonomiesMetaData;
  main: AutonomiesMetaDataMain;
}

export function unwrapNeverminedMetaData(metaData: MetaData): AssetStateHere {
  const { main, additionalInformation } = metaData;
  const asset: AssetStateHere = {
    main,
    additionalInformation
  };
  const autonomies = {
    artworkAuthor: '',
    genre: '',
    nftAmount: 1,
    royalties: 4,
    trackListing: [],
    label: '',
    royaltiesHolder: '',
    collaborators: [],
    recipients: [
      {
        name: '',
        split: 0,
        walletAddress: ''
      }
    ],
    coverUrl: '',
    audioUrls: [],
    priceInEther: 0
  } as AutonomiesMetaData;

  if (additionalInformation) {
    const marketSpecificData = additionalInformation?.customData;

    if (marketSpecificData) {
      AutonomiesAttributeNames.forEach((attribute) => {
        (autonomies as any)[attribute] = marketSpecificData[attribute];
      });
    }
    asset.autonomies = autonomies;
    return asset;
  }
  asset.additionalInformation = additionalInformation;
  asset.autonomies = autonomies;
  return asset;
}

export const getItemsFromDids = async (
  dids: string[],
  sdk: Nevermined
): Promise<CollectionItem[]> => {
  const assets = await Promise.all(
    dids.map((did) => {
      try {
        return sdk.assets.resolve(did);
      } catch (error) {
        console.log('error resolving did', error);
      }
      return undefined;
    })
  );

  const items = await Promise.all(
    assets.map(async (ddo) => {
      if (!ddo || !ddo.findServiceByType('metadata')) return undefined;
      const unwrapped = unwrapNeverminedMetaData(ddo.findServiceByType('metadata').attributes);
      const coverUrl = unwrapped.autonomies?.coverUrl;
      if (coverUrl) {
        return {
          artwork: ddo,
          cover: coverUrl,
          secondaryAgreements: [],
          price: +unwrapped.main.price
        } as CollectionItem;
      }
      return undefined;
    })
  );

  //@ts-ignore
  return items.filter(truthy);
};

export const formatArtwork = async (
  artwork: DDO,
  decimals: number
): Promise<Pick<CollectionItem, 'price' | 'cover' | 'artwork'>> => {
  const serviceAttributes = artwork.findServiceByType('metadata') as ServiceCommon;
  const metaData: MetaData = serviceAttributes.attributes;
  const price = calculateAssetPrice(artwork, decimals);
  const cover = findCoverForAsset(metaData);
  return {
    artwork,
    cover,
    price
  };
};

export const filterItemListForAccount = async (
  account: Account,
  items: (CollectionItem & { txTimestamp: number })[],
  sdk: Nevermined
): Promise<(CollectionItem & { txTimestamp: number })[]> => {
  const assetsOfAccount: (CollectionItem & { txTimestamp: number })[] = [];
  await Promise.all(
    items.map(async (item) => {
      const balanceOfAccount = await sdk.nfts.balance(item.artwork.id, account);
      if (balanceOfAccount > 0) {
        assetsOfAccount.push(item);
      }
    })
  );
  return assetsOfAccount;
};

export const getItemFromDid = async (did: string, sdk: Nevermined) => {
  try {
    const asset = await sdk.assets.resolve(did);
    if (!asset || !asset.findServiceByType('metadata')) return undefined;
    const unwrapped = unwrapNeverminedMetaData(asset.findServiceByType('metadata').attributes);
    const coverUrl = unwrapped.autonomies?.coverUrl;
    if (coverUrl) {
      return {
        artwork: asset,
        cover: coverUrl,
        secondaryAgreements: [],
        price: +unwrapped.main.price
      } as CollectionItem;
    }
    return undefined;
  } catch (error) {
    console.log('error resolving did', error);
  }
  return undefined;
};

export const getAssetsOfAccount = async (
  account: string,
  sdk: Nevermined
): Promise<(CollectionItem & { txTimestamp: number })[]> => {
  const dids = await getAssetsReceivedByAddress(account, sdk);
  const uniqueDids = [...new Set(dids.map((item) => item))];
  const items: (CollectionItem & { txTimestamp: number })[] = [];
  for (let i = 0; i < uniqueDids.length; i++) {
    const did = uniqueDids[i];
    const item = await getItemFromDid(did._did, sdk);
    if (item) items.push({ ...item, txTimestamp: did.timestamp });
  }
  const result = await filterItemListForAccount(new Account(account), items, sdk);

  return result.sort((a, b) => b.txTimestamp - a.txTimestamp);
};

export const initializeNevermined = async (
  config: Config
): Promise<GenericOutput<Nevermined, any>> => {
  try {
    console.log('Loading SDK Started..');
    const nvmSdk: Nevermined = await Nevermined.getInstance({
      ...config
    });

    console.log('Loading SDK Finished Successfully');
    return { data: nvmSdk, error: undefined, success: true };
  } catch (error) {
    console.log('Loading SDK Failed:');
    console.log(error);
    return { data: {} as Nevermined, error, success: false };
  }
};

export const getReleasesOfAccount = async (
  account: string,
  sdk: Nevermined
): Promise<CollectionItem[]> => {
  if (!account) return [];
  const dids = await getAssetsReleasedByAddress(account, sdk);
  return getItemsFromDids(dids, sdk);
};

export const getAssetsReleasedByAddress = async (
  address: string,
  sdk: Nevermined
): Promise<string[]> => {
  if (sdk && sdk.keeper) {
    const query = await sdk.keeper.didRegistry.events.getPastEvents({
      eventName: 'DidAttributeRegistered',
      methodName: 'getDIDAttributeRegistereds',
      filterSubgraph: {
        where: { _owner: address },
        orderBy: '_blockNumberUpdated',
        orderDirection: 'desc'
      },
      result: {
        id: true,
        _did: true,
        _owner: true,
        _blockNumberUpdated: true,
        _lastUpdatedBy: true
      }
    });

    return query.map((item) => item._did);
  } else return [];
};

export const getAssetsReceivedByAddress = async (
  address: string,
  sdk: Nevermined
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
      _contract: true
    }
  });
  if (!query || query.length == 0) return [];

  return query;
};
