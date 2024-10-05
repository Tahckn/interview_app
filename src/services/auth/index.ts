import axios, {AxiosError} from 'axios';
import CryptoJS from 'crypto-js';
import {jwtDecode} from "jwt-decode";
import logger from "services/logger";

// Environment variables containing Auth0 and secret key information
const AUTH0_DOMAIN = import.meta.env.VITE_AUTH0_DOMAIN;
const AUTH0_CLIENT_ID = import.meta.env.VITE_AUTH0_CLIENT_ID;
const AUTH0_CLIENT_SECRET = import.meta.env.VITE_AUTH0_CLIENT_SECRET;
const AUTH0_AUDIENCE = import.meta.env.VITE_AUTH0_AUDIENCE;
const SECRET_KEY = import.meta.env.VITE_SECRET_KEY;

// Interface for decoding the JWT token to extract expiration and roles
interface DecodedToken {
    exp: number;
    roles?: string[];
}

// Interface for handling Auth0 error responses
interface AuthError {
    error: string;
    error_description: string;
}

// Function to get the token from Auth0 by providing a username and password
export const getToken = async (username: string, password: string) => {
    try {
        // Make a POST request to Auth0's OAuth token endpoint
        logger.info('Attempting to get token from Auth0', {username});
        const response = await axios.post(`https://${AUTH0_DOMAIN}/oauth/token`, {
            grant_type: 'password', // Using password grant type
            username,
            password,
            client_id: AUTH0_CLIENT_ID,
            client_secret: AUTH0_CLIENT_SECRET,
            audience: AUTH0_AUDIENCE,
            scope: 'openid profile email' // Requesting these scopes
        });

        logger.info('Successfully obtained token from Auth0');
        // Return the access token from the response
        return response.data.access_token;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const axiosError = error as AxiosError<AuthError>;
            if (axiosError.response) {
                logger.error('Failed to get token from Auth0', {
                    error: axiosError.response.data.error,
                    description: axiosError.response.data.error_description
                });
                // Throw a detailed error message with a description
                throw {
                    error: axiosError.response.data.error,
                    error_description: axiosError.response.data.error_description
                };
            }
        }
        // If no specific error is found, throw a generic error
        logger.error('Unknown error occurred while getting token', {error});
        throw {error: 'unknown_error', error_description: 'An unknown error occurred'};
    }
};

// Function to encrypt the token using AES encryption and a secret key
export const encryptToken = (token: string) => {
    return CryptoJS.AES.encrypt(token, SECRET_KEY).toString();
};

// Function to decrypt the token back into plain text using the secret key
export const decryptToken = (encryptedToken: string) => {
    const bytes = CryptoJS.AES.decrypt(encryptedToken, SECRET_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
};

// Function to store the encrypted token in localStorage
export const setToken = (token: string) => {
    const encryptedToken = encryptToken(token);
    localStorage.setItem('auth_token', encryptedToken);
    logger.info('Token stored in localStorage');
};

// Function to retrieve and decrypt the stored token from localStorage
export const getStoredToken = () => {
    const encryptedToken = localStorage.getItem('auth_token');
    if (encryptedToken) {
        logger.info('Retrieved token from localStorage');
        return decryptToken(encryptedToken);
    }
    logger.warn('No token found in localStorage');
    return null;
};

// Function to remove the stored token from localStorage
export const removeToken = () => {
    localStorage.removeItem('auth_token');
    logger.info('Token removed from localStorage');
};

// Function to check if the stored token is still valid based on expiration
export const isTokenValid = () => {
    const token = getStoredToken();
    if (!token) {
        logger.warn('No token found for validation');
        return false;
    }

    const decodedToken = JSON.parse(atob(token.split('.')[1]));
    const expirationTime = decodedToken.exp * 1000;
    const isValid = Date.now() < expirationTime;

    if (isValid) {
        logger.info('Token is valid');
    } else {
        logger.warn('Token has expired');
    }

    return isValid;
};

// Function to decode the token and return its payload
export const decodeToken = (token: string): DecodedToken => {
    try {
        const decoded = jwtDecode<DecodedToken>(token);
        logger.info('Token successfully decoded');
        return decoded;
    } catch (error) {
        logger.error('Failed to decode token', {error});
        throw error;
    }
};

// Function to extract roles from the decoded token
export const getRolesFromToken = (token: string): string[] => {
    try {
        const decodedToken = decodeToken(token);
        const roles = decodedToken.roles || [];
        logger.info('Roles extracted from token', { roles });
        return roles;
    } catch (error) {
        logger.error('Failed to extract roles from token', { error });
        return [];
    }
};