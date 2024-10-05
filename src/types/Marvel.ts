type Url = {
    type: string;
    url: string;
}

type Image = {
    path: string;
    extension: string;
}

type ResourceList = {
    available: number;
    returned: number;
    collectionURI: string;
    items: Array<{
        resourceURI: string;
        name: string;
    }>;
}

export type Character = {
    id: number;
    name: string;
    description: string;
    modified: Date;
    resourceURI: string;
    urls: Url[];
    thumbnail: Image;
    comics: ResourceList;
    stories: ResourceList;
    events: ResourceList;
    series: ResourceList;
}

export type Series = {
    id: number;
    title: string;
    description: string;
    resourceURI: string;
    urls: Url[];
    startYear: number;
    endYear: number;
    rating: string;
    modified: Date;
    thumbnail: Image;
    comics: ResourceList;
    stories: ResourceList;
    events: ResourceList;
    characters: ResourceList;
    creators: ResourceList;
    next?: {
        resourceURI: string;
        name: string;
    };
    previous?: {
        resourceURI: string;
        name: string;
    };
}

export type MarvelApiResponse<T> = {
    code: number;
    status: string;
    copyright: string;
    attributionText: string;
    attributionHTML: string;
    data: {
        offset: number;
        limit: number;
        total: number;
        count: number;
        results: T[];
    };
    etag: string;
}

export type Pagination = {
    offset: number;
    limit: number;
    total: number;
}
