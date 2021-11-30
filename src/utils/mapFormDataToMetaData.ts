import { File as AssetFile, MetaData } from "@nevermined-io/nevermined-sdk-js";


export interface MetaDataFormDTO {
    name?: string;
    type?: 'dataset' | 'algorithm' | 'compute' | 'workflow' | 'compute';
    dateCreated?: string;
    datePublished?: string;
    author?: string;
    license?: string;
    price?: string;
    files?: File[];
    encryptedService?: any;
    workflow?: any;
    algorithm?: any;
    service?: any;
    description?: string;
    copyrightHolder?: string;
}

const mapFilesToMetaDataFiles = (files: File[] | undefined): AssetFile[] => {
    if (!files) return [];

    return files.map((file) => (
        {
            name: file.name,
            url: "url",
            contentType: "type"
        }));
}

// TODO: fixed CSS names, Cloud providers: Amazon S3, Google Clould, Azure, IPFS, Filecoin, Arweave, HTTP
// TODO: quick and dirty version that works for defi-marketplace
// TODO: integration test to post stuff to MetaData with BurnerWallet (1 time wallet) & cypress

/**
 *
 * @param customDataName
 * @param formData
 * @returns mappedFormData matching the Nevermined API
 */
const mapFormDataToMetaData = (customDataName = "customData", formData: MetaDataFormDTO): MetaData => {
    const { type, name, author, license, price, files, description, copyrightHolder, ...rest } = formData;
    let mappedFiles;

    if (files) {
        mappedFiles = files.map((file) => (
            {
                name: file.name,
                url: "url",
                contentType: "type"
            }));
        // mapFilesToMetaDataFiles(files);
    }

    return {
        main: {
            type: type || 'dataset',
            name: name || "",
            datePublished: `${new Date().toISOString().split('.')[0]}Z`,
            dateCreated: `${new Date().toISOString().split('.')[0]}Z`, // remove milliseconds
            author: author || "",
            license: license || "",
            price: price || "0",
            files: mappedFiles || [],
        },
        additionalInformation: {
            description: description || "",
            copyrightHolder: copyrightHolder || "",
            categories: [],
            links: [],
            tags: [],
            updateFrequency: undefined,
            structuredMarkup: [],
            [customDataName]: rest,

        },
    }
}

export default mapFormDataToMetaData;
