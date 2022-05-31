import {
  DDO,
  MetaData,
  MetaDataMain,
  Nevermined,
  SearchQuery
} from '@nevermined-io/nevermined-sdk-js';
import formPublish from './form-publish.json';
import { Logger } from '@nevermined-io/nevermined-sdk-js/dist/node/utils';
import queryBuilder from './query-builder';
import { AssetState, AutonomiesAttributeNames, AutonomiesMetaData, CollectionItem } from '../types';
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
