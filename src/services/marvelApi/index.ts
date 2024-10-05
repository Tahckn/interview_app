import axios from 'axios';
import md5 from 'md5';

const PUBLIC_KEY = '51eaeedbb0720ab6d9d38193dc5e4c0b';
const PRIVATE_KEY = '5ffcd2fbc9396e11a1d770f240dda859f91cfa54';
const BASE_URL = 'http://gateway.marvel.com/v1/public';

const getAuthParams = () => {
    const ts = new Date().getTime();
    const hash = md5(ts + PRIVATE_KEY + PUBLIC_KEY);
    return `apikey=${PUBLIC_KEY}&ts=${ts}&hash=${hash}`;
};

interface CharacterParams {
    offset?: number;
    limit?: number;
    nameStartsWith?: string;
}

export const getCharacters = async (params: CharacterParams = {}) => {
    const { offset, limit, nameStartsWith } = params;
    let url = `${BASE_URL}/characters?${getAuthParams()}`;

    if (offset !== undefined) url += `&offset=${offset}`;
    if (limit !== undefined) url += `&limit=${limit}`;
    if (nameStartsWith) url += `&nameStartsWith=${encodeURIComponent(nameStartsWith)}`;

    return axios.get(url);
};

interface SeriesParams {
    offset?: number;
    limit?: number;
    titleStartsWith?: string;
}

export const getSeries = async (params: SeriesParams = {}) => {
    const { offset, limit, titleStartsWith } = params;
    let url = `${BASE_URL}/series?${getAuthParams()}`;

    if (offset !== undefined) url += `&offset=${offset}`;
    if (limit !== undefined) url += `&limit=${limit}`;
    if (titleStartsWith) url += `&titleStartsWith=${encodeURIComponent(titleStartsWith)}`;

    return axios.get(url);
};