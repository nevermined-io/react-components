type MatchCriteria = 'must' | 'should';
type MatchType = 'bool';

type FieldInput = {
    [attributeName: string]: string[];
};

type ESQuery = {
    [key in MatchType]: {
        [criteria in MatchCriteria]: [
            {
                match: {
                    [field in string]: string;
                };
            }
        ];
    };
};

type QueryBuilder = {
    createStrictQuery: (attribute: string, param: string | string[]) => ESQuery;
    createLenientQuery: (attribute: string, param: string | string[]) => ESQuery;
    createMultipleFieldStrictQuery: (fields: FieldInput) => ESQuery;
    createMultipleFieldLenientQuery: (fields: FieldInput) => ESQuery;
    createServiceQueryByDid: (did: string) => ESQuery;
};

const createServiceQueryByDid = (did: string): ESQuery =>
    ({
        query: {
            bool: {
                must: [
                    {
                        match: {
                            did: did.replace('did:nv:', ''),
                        },
                    },
                ],
            },
        },
    } as any);

const createStrictQuery = (attributeName: string, attribute: string | string[]): ESQuery => {
    if (typeof attribute === 'string') {
        return {
            bool: {
                must: [
                    {
                        match: {
                            [attributeName]: attribute,
                        },
                    },
                ],
            },
        } as any;
    }
    const innerQuery = attribute.map((attr) => ({
        match: {
            [attributeName]: attr,
        },
    }));
    return {
        bool: {
            should: innerQuery.values,
        },
    } as any;
};

const createMultipleFieldStrictQuery = (fields: FieldInput): ESQuery => {
    const innerQueries: any = [];
    Object.keys(fields).forEach((key) => {
        fields[key].forEach((value) => {
            innerQueries.push({
                match: {
                    key: value,
                },
            });
        });
    });
    return {
        bool: {
            must: innerQueries.values,
        },
    } as any;
};

const createLenientQuery = (attributeName: string, attribute: string | string[]): ESQuery => {
    if (typeof attribute === 'string') {
        return {
            bool: {
                should: [
                    {
                        match: {
                            [attributeName]: attribute,
                        },
                    },
                ],
            },
        } as any;
    }
    const innerQuery = attribute.map((attr) => ({
        match: {
            [attributeName]: attr,
        },
    }));
    return {
        bool: {
            should: innerQuery.values,
        },
    } as any;
};

const createMultipleFieldLenientQuery = (fields: FieldInput): ESQuery => {
    const innerQueries: any = [];
    Object.keys(fields).forEach((key) => {
        fields[key].forEach((value) => {
            innerQueries.push({
                match: {
                    key: value,
                },
            });
        });
    });
    return {
        bool: {
            should: innerQueries.values,
        },
    } as any;
};

const queryBuilder: QueryBuilder = {
    createStrictQuery,
    createLenientQuery,
    createMultipleFieldStrictQuery,
    createMultipleFieldLenientQuery,
    createServiceQueryByDid,
};

export default queryBuilder;

