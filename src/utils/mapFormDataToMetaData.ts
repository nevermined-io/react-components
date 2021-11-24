import { MetaData } from '@nevermined-io/nevermined-sdk-js';

// export interface FormData {
//     name: string;
//     type: 'dataset' | 'algorithm' | 'compute' | 'workflow' | 'compute';
//     dateCreated: string;
//     datePublished?: string;
//     author: string;
//     license: string;
//     price: string;
//     files?: File[];
//     encryptedService?: any;
//     workflow?: any;
//     algorithm?: any;
//     service?: any;
//     description?: string;
//     copyrightHolder?: string;
// }

export interface MetaDataFormDTO {
    /**
     * name var
     */
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

type MData = {
    name: string;
    type: 'dataset' | 'algorithm' | 'compute' | 'workflow' | 'compute';
    dateCreated: string;
    datePublished?: string;
    author: string;
    license: string;
    price: string;
    files?: File[];
    encryptedService?: any;
    workflow?: any;
    algorithm?: any;
    service?: any;
};
/**
 *
 * @param customDataName
 * @param formData
 * @returns mappedFormData matching the Nevermined API
 */
const mapFormDataToMetaData = (customDataName = "customData", formData: MetaDataFormDTO) => {
    console.log(formData);
    const { name, author, license, price, files, description, copyrightHolder, ...rest } = formData;
    return {
        main: {
            type: 'dataset',
            name: name,
            dateCreated: (new Date()).toISOString(),
            datePublished: '',
            author: author,
            license: license,
            price: price,
            files: files
        },
        additionalInformation: {
            description: description,
            copyrightHolder: copyrightHolder,
            categories: [],
            links: [],
            tags: [],
            updateFrequency: null,
            structuredMarkup: []
        },
        [customDataName]: rest
    }
}

export default mapFormDataToMetaData;
