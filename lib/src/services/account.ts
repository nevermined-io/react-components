import { useContext, useEffect, useState } from 'react';
import { NeverminedContext } from '../nevermined';

export const useAccountReleases = (
  id: string,
  format?: (dids: string[]) => any
): { isLoading: boolean; accountReleases: string[] } => {
  const [accountReleases, setAccountReleases] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { account } = useContext(NeverminedContext);

  useEffect(() => {
    const loadReleases = async (): Promise<void> => {
      setIsLoading(true);
      const data = await account.getReleases(id);
      setAccountReleases(data);
      if (format) {
        setAccountReleases(format(data));
      } else {
        setAccountReleases(data);
      }
      setIsLoading(false);
    };
    loadReleases();
  }, [id]);

  return { isLoading, accountReleases };
};

export const useAccountCollection = (
  id: string,
  format: (dids: string[]) => any
): { isLoading: boolean; accountCollection: string[] } => {
  const { sdk, account } = useContext(NeverminedContext);
  const [isLoading, setLoading] = useState<boolean>(true);
  const [accountCollection, setAccountCollection] = useState<string[]>([]);

  useEffect(() => {
    const loadCollection = async (): Promise<void> => {
      if (!id || !sdk.utils) return;
      setLoading(true);
      const data = await account.getCollection(id);
      if (format) {
        setAccountCollection(format(data));
      } else {
        setAccountCollection(data);
      }
      setLoading(false);
    };
    loadCollection();
  }, [id, sdk]);

  return { isLoading, accountCollection };
};
