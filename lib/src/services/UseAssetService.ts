import { DDO } from '@nevermined-io/nevermined-sdk-js';
import { QueryResult } from '@nevermined-io/nevermined-sdk-js/dist/node/metadata/Metadata';
import { useContext, useEffect, useState } from 'react';
import { NeverminedContext } from '../nevermined';
import { CollectionItem } from '../types';
import { formatArtwork, truthy } from '../utils';

export const useAllAssets = (): {
  allArtwork: CollectionItem[];
  isLoading: boolean;
} => {
  const decimals = 18;
  const { assets } = useContext(NeverminedContext);
  const [isLoading, setIsLoading] = useState(false);
  const [allArtwork, setAllArtwork] = useState<CollectionItem[]>([]);

  const handler = async () => {
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
  }, [decimals]);

  return {
    allArtwork,
    isLoading: isLoading
  };
};
