import {MetaData} from '../src'

export async function getMetadata(
  name: string,
): Promise<MetaData> {
  return {
    main: {
      name,
      type: 'dataset',
      dateCreated: '2012-10-10T17:00:00Z',
      datePublished: '2012-10-10T17:00:00Z',
      author: 'Met Office',
      license: 'CC-BY',
      files: [
        {
          index: 0,
          contentType: 'application/json',
          url: 'https://uploads5.wikiart.org/00268/images/william-holbrook-beard/the-bear-dance-1870.jpg',
        },
      ],
    },
    additionalInformation: {
      description: 'Weather information of UK including temperature and humidity',
      copyrightHolder: 'Met Office',
      workExample: '423432fsd,51.509865,-0.118092,2011-01-01T10:55:11+00:00,7.2,68',
      inLanguage: 'en',
      categories: ['Economy', 'Data Science'],
      tags: ['weather', 'uk', '2011', 'temperature', 'humidity'],
    },
  }
}
