import axios from 'axios';
import md5 from 'md5';
import logger from 'services/logger'; // Logger'ı import ediyoruz

// Environment variables for the Marvel API keys and base URL
const PUBLIC_KEY = import.meta.env.VITE_MARVEL_API_PUBLIC_KEY
const PRIVATE_KEY = import.meta.env.VITE_MARVEL_API_PRIVATE_KEY
const BASE_URL = import.meta.env.VITE_MARVEL_API_BASE_URL

// Helper function to generate the necessary authentication parameters for Marvel API requests
const getAuthParams = () => {
    const ts = new Date().getTime();
    const hash = md5(ts + PRIVATE_KEY + PUBLIC_KEY);
    return `apikey=${PUBLIC_KEY}&ts=${ts}&hash=${hash}`;
};

// Interface to define the optional parameters for character queries
interface CharacterParams {
    offset?: number;
    limit?: number;
    nameStartsWith?: string;
}

// Function to fetch Marvel characters based on the provided query parameters
export const getCharacters = async (params: CharacterParams = {}) => {
    const {offset, limit, nameStartsWith} = params;
    let url = `${BASE_URL}/characters?${getAuthParams()}`;

    // Append the optional query parameters to the URL if they are provided
    if (offset !== undefined) url += `&offset=${offset}`;
    if (limit !== undefined) url += `&limit=${limit}`;
    if (nameStartsWith) url += `&nameStartsWith=${encodeURIComponent(nameStartsWith)}`;

    logger.info(`Fetching Marvel characters`, { params });

    try {
        const response = await axios.get(url);
        logger.info(`Successfully fetched Marvel characters`, { 
            count: response.data.data.results.length,
            total: response.data.data.total
        });
        return response;
    } catch (error) {
        logger.error(`Error fetching Marvel characters`, { error, params });
        throw error;
    }
};

// Interface to define the optional parameters for series queries
interface SeriesParams {
    offset?: number;
    limit?: number;
    titleStartsWith?: string;
}

// Function to fetch Marvel series based on the provided query parameters
export const getSeries = async (params: SeriesParams = {}) => {
    const {offset, limit, titleStartsWith} = params;
    let url = `${BASE_URL}/series?${getAuthParams()}`;

    // Append the optional query parameters to the URL if they are provided
    if (offset !== undefined) url += `&offset=${offset}`;
    if (limit !== undefined) url += `&limit=${limit}`;
    if (titleStartsWith) url += `&titleStartsWith=${encodeURIComponent(titleStartsWith)}`;

    logger.info(`Fetching Marvel series`, { params });

    try {
        const response = await axios.get(url);
        logger.info(`Successfully fetched Marvel series`, { 
            count: response.data.data.results.length,
            total: response.data.data.total
        });
        return response;
    } catch (error) {
        logger.error(`Error fetching Marvel series`, { error, params });
        throw error;
    }
};