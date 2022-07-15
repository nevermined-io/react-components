import { DDO, MetaData, SearchQuery } from '@nevermined-io/nevermined-sdk-js';
import { QueryResult } from '@nevermined-io/nevermined-sdk-js/dist/node/metadata/Metadata';
import AssetRewards from '@nevermined-io/nevermined-sdk-js/dist/node/models/AssetRewards';
import React, { useContext, useEffect, useState, createContext } from 'react';
import { NeverminedContext, useNevermined } from '../nevermined';
import {
  AssetState,
  AssetPublishParams,
  FileMetadata,
  AssetFile,
  FileType,
  UserProfileParams
} from '../types';
import { handleAssetFiles, checkFilecoinIdExists } from '../utils/asset_publish';
import BigNumber from 'bignumber.js';

export const useAssets = (
  q: SearchQuery
): {
  result: QueryResult;
  isLoading: boolean;
} => {
  const { assets, sdk } = useContext(NeverminedContext);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<QueryResult>({} as QueryResult);

  const handler = async () => {
    try {
      if (!q) return;
      setIsLoading(true);
      const queryResponse: QueryResult = await assets.query(q);
      setResult(queryResponse);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isLoading) return;
    handler();
  }, [assets, sdk, q]);

  return {
    result,
    isLoading
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

export interface AssetPublishProviderState {
  errorAssetMessage: string,
  assetMesssage: string,
  filesUploadedMessage: string[],
  isPublished: boolean,
  newFilecoinID: string,
  assetPublish: AssetPublishParams,
  setAssetPublish: React.Dispatch<React.SetStateAction<AssetPublishParams>>,
  setAssetMessage: React.Dispatch<React.SetStateAction<string>>,
  setAssetErrorMessage: React.Dispatch<React.SetStateAction<string>>,
  setNewFilecoinID: React.Dispatch<React.SetStateAction<string>>,
  handleChange: (value: string, input: string) => void,
  reset: (resetAssetPublish: AssetPublishParams) => void,
  handleNewFile: (e: React.ChangeEvent<HTMLInputElement>) => void,
  addFilecoinID: () => Promise<void>,
  updateFilesAdded: (assetFile: AssetFile) => void,
  removeFile: (label: string) => void,
  onSubmitAssetPublish: ({ nftAddress }: {
    nftAddress: string;
  }) => Promise<void>
}

export const AssetPublishContext = createContext({} as AssetPublishProviderState);

export const AssetPublishProvider = ({ children }: { 
  children: React.ReactElement
}) => {
  const { sdk, account, config } = useNevermined();
  const [errorAssetMessage, setAssetErrorMessage] = useState('');
  const [filesUploadedMessage, setFilesUploadedMessage] = useState<string[]>([]);
  const [isPublished, setIsPublished] = useState(false);
  const [assetMesssage, setAssetMessage] = useState('');
  const [newFilecoinID, setNewFilecoinID] = useState('');
  const [assetPublish, setAssetPublish] = useState<AssetPublishParams>({
    name: '',
    author: '',
    description: '',
    type: 'dataset',
    category: 'None',
    price: 0,
    asset_files: []
  });

  const reset = (resetAssetPublish: AssetPublishParams) => {
    setAssetPublish(resetAssetPublish);

    setIsPublished(false);
    setFilesUploadedMessage([]);
    setAssetMessage('');
    setAssetErrorMessage('');
  };

  const handleChange = (value: string, input: string) => {
    setAssetPublish({ ...assetPublish, [input]: value });
  };

  const handleNewFile = function (e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target?.files?.[0];

    if (!file) {
      return;
    }

    const assetFile: AssetFile = {
      type: FileType.Local,
      name: file.name,
      label: file.name,
      size: String(file.size),
      content_type: file.type,
      file: file
    };
    setAssetPublish({ ...assetPublish, asset_files: [...assetPublish.asset_files, assetFile] });
    setAssetErrorMessage('');
  };

  const addFilecoinID = async () => {
    if (!newFilecoinID) return;

    setAssetMessage('Getting info from Filecoin...');
    await new Promise((f) => setTimeout(f, 500));

    const result = await checkFilecoinIdExists(newFilecoinID, config.ipfsGatewayUri);
    if (!result[0]) {
      setAssetMessage('');
      setAssetErrorMessage('The filecoin ID was not found');
      return;
    }

    const assetFile: AssetFile = result[1];
    setNewFilecoinID('');
    setAssetPublish({ ...assetPublish, asset_files: [...assetPublish.asset_files, assetFile] });
    setAssetErrorMessage('');
  };

  const generateFilesMetadata = (): FileMetadata[] =>
    assetPublish.asset_files.map((assetFile: AssetFile, i: number) => {
      return {
        index: i + 1,
        contentType: assetFile.content_type || '',
        url: assetFile.filecoin_id || '',
        contentLength: assetFile.size || ''
      };
    });

  const generateMetadata = (): MetaData =>
    ({
      main: {
        name: assetPublish.name,
        dateCreated: new Date().toISOString().replace(/\.[0-9]{3}/, ''),
        author: assetPublish.author,
        license: 'CC0: Public Domain', // ??
        price: String(assetPublish.price),
        datePublished: new Date().toISOString().replace(/\.[0-9]{3}/, ''),
        type: assetPublish.type as unknown,
        network: assetPublish.network,
        files: generateFilesMetadata()
      },
      additionalInformation: {
        description: assetPublish.description,
        categories: [
          `ProtocolType:${assetPublish.category}`,
          `EventType:${assetPublish.protocol}`,
          `Blockchain:${assetPublish.network}`,
          `UseCase:defi-datasets`,
          `Version:v1`
        ],
        blockchain: assetPublish.network,
        version: 'v1',
        source: 'filecoin'
      }
    } as MetaData);

  const generateFilesUploadedMessage = (assetFiles: AssetFile[]) => {
    const messages: string[] = [];
    for (const assetFile of assetFiles) {
      const isLocalFile: boolean = assetFile.type === FileType.Local;
      if (isLocalFile)
        messages.push(
          `- File ${assetFile.name} uploaded to Filecoin with ID: ${assetFile.filecoin_id}`
        );
    }
    return messages;
  };

  const updateFilesAdded = (assetFile: AssetFile) => {
    const arrayFiles: AssetFile[] = assetPublish.asset_files;
    setAssetPublish({ ...assetPublish, asset_files: [...arrayFiles, assetFile] });
  };

  const removeFile = (label: string) => {
    const arrayFiles: AssetFile[] = assetPublish.asset_files;

    const indexOfObject = arrayFiles.findIndex((assetFile) => {
      return assetFile.label === label;
    });

    if (indexOfObject !== -1) {
      arrayFiles.splice(indexOfObject, 1);
      setAssetPublish({ ...assetPublish, asset_files: [...arrayFiles] });
    }
  };

  const onSubmitAssetPublish = async ({ nftAddress }: { nftAddress: string }) => {
    try {
      const findLocal = assetPublish.asset_files.find(
        (file: AssetFile) => file.type === FileType.Local
      );

      if (findLocal != undefined) {
        await handleAssetFiles(
          assetPublish.asset_files,
          config.gatewayUri,
          config.filecoinUploadUri
        );
        setFilesUploadedMessage(generateFilesUploadedMessage(assetPublish.asset_files));
      }

      const metadata = generateMetadata();

      // variable account in UserProvider stores only the address!
      const accounts = await sdk.accounts.list();
      const user_account = await accounts[0];
      const user_address = user_account.getId();

      const assetRewards = new AssetRewards(user_address, new BigNumber(assetPublish.price));
      if (!account.isTokenValid()) {
        setAssetErrorMessage(
          'Your login is expired. Please first sign with your wallet and after try again'
        );
        await account.generateToken();
      }

      const ddo = await sdk.nfts.create721(metadata, user_account, assetRewards, nftAddress);
      setAssetMessage('The assets has been sucessfully published. DID: ' + ddo.id);
      setAssetErrorMessage('');
    } catch (error: any) {
      console.error(error.message);
      setAssetErrorMessage('There was an error publishing the Asset:  ' + error.message);
      setAssetMessage('');
    }
  };

  const IState = {
    errorAssetMessage,
    assetMesssage,
    filesUploadedMessage,
    isPublished,
    newFilecoinID,
    assetPublish,
    setAssetPublish,
    setAssetMessage,
    setAssetErrorMessage,
    setNewFilecoinID,
    handleChange,
    reset,
    handleNewFile,
    addFilecoinID,
    updateFilesAdded,
    removeFile,
    onSubmitAssetPublish
  };

  return (<AssetPublishContext.Provider value={IState}>{children}</AssetPublishContext.Provider>)
};

export const useAssetPublish = (): AssetPublishProviderState => useContext(AssetPublishContext);