import { File as AssetFile, MetaData } from '@nevermined-io/nevermined-sdk-js';
import { MetaDataFormDTO } from 'lib/types';

export const mapFileToMetaDataFile = (file: File, index: number): AssetFile => {
  return {
    name: file.name,
    index,
    url: 'www.disney.com/file.jpg',
    contentType: file.type
  };
};

// TODO: fixed CSS names, Cloud providers: Amazon S3, Google Clould, Azure, IPFS, Filecoin, Arweave, HTTP
// TODO: quick and dirty version that works for defi-marketplace
// TODO: integration test to post stuff to MetaData with BurnerWallet (1 time wallet) & cypress

/**
 * This function maps the one-dimensional form metadata to the
 * structure that is required by the Nevermined API.
 *
 * @param customDataName
 * @param formData
 * @returns mappedFormData matching the Nevermined API
 */
export const mapFormDataToMetaData = (
  customDataName = 'customData',
  formData: MetaDataFormDTO
): MetaData => {
  const { type, name, author, license, price, files, description, copyrightHolder, ...rest } =
    formData;

  return {
    main: {
      //should add AssetType to sdk
      //@ts-ignore
      type: type || AssetType.dataset,
      name: name || '',
      datePublished: `${new Date().toISOString().split('.')[0]}Z`,
      dateCreated: `${new Date().toISOString().split('.')[0]}Z`, // remove milliseconds
      author: author || '',
      license: license || '',
      price: price || '0',
      files: files?.map(mapFileToMetaDataFile) || []
    },
    additionalInformation: {
      description: description || '',
      copyrightHolder: copyrightHolder || '',
      categories: [],
      links: [],
      tags: [],
      updateFrequency: undefined,
      structuredMarkup: []
    },
    [customDataName]: rest
  };
};

export default mapFormDataToMetaData;
