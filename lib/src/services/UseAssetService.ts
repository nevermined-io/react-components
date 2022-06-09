import { DDO, MetaData } from '@nevermined-io/nevermined-sdk-js';
import { QueryResult } from '@nevermined-io/nevermined-sdk-js/dist/node/metadata/Metadata';
import { useContext, useEffect, useState } from 'react';
import { NeverminedContext } from '../nevermined';
import { AssetState, CollectionItem } from '../types';
import { formatArtwork, isEmptyObject, truthy } from '../utils';

export const useAllAssets = (): {
  allArtwork: CollectionItem[];
  isLoading: boolean;
} => {
  const decimals = 18;
  const { assets, sdk } = useContext(NeverminedContext);
  const [isLoading, setIsLoading] = useState(false);
  const [allArtwork, setAllArtwork] = useState<CollectionItem[]>([]);

  const handler = async () => {
    if (isEmptyObject(sdk)) return;
    setIsLoading(true);
    try {
      const queryResponse: QueryResult = await assets.getAll();
      const artworks: (CollectionItem | undefined)[] = await Promise.all(
        queryResponse?.results?.map(async (artwork: DDO): Promise<CollectionItem | undefined> => {
          try {
            const resvoledAsset = await assets.resolve(artwork.id);
            if (!resvoledAsset) return undefined;
            const formattedArtwork = await formatArtwork(artwork, decimals);
            return {
              ...formattedArtwork
            };
          } catch (error) {
            return undefined;
          }
        })
      );

      const aws = artworks?.length ? artworks.filter(truthy) : [];
      //@ts-ignore
      setAllArtwork(aws);
      setIsLoading(false);
    } catch (error) {
      console.log('error', error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isLoading) return;
    handler();
  }, [decimals, assets, sdk]);

  return {
    allArtwork,
    isLoading: isLoading
  };
};

export const useAsset = (did: string): AssetState => {
  const { assets } = useContext(NeverminedContext);
  const [state, setState] = useState<AssetState>({} as AssetState);

  useEffect(() => {
    const getData = async () => {
      try {
        const ddo: DDO | undefined = await assets.resolve(did);
        if (!ddo) return;
        const metaData: MetaData = ddo.findServiceByType('metadata').attributes;
        const nftDetails = await assets.nftDetails(did);
        setState({
          ddo,
          metadata: metaData,
          nftDetails,
          error: '',
          isLoading: false
        } as AssetState);
      } catch (e) {
        console.error(e as Error);
      }
    };
    getData();
  }, [did, assets]);

  return { ...state };
};
