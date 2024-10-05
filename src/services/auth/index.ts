import axios, { AxiosError } from 'axios';
import CryptoJS from 'crypto-js';
import { jwtDecode } from "jwt-decode";

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
        const response = await axios.post(`https://${AUTH0_DOMAIN}/oauth/token`, {
            grant_type: 'password', // Using password grant type
            username,
            password,
            client_id: AUTH0_CLIENT_ID,
            client_secret: AUTH0_CLIENT_SECRET,
            audience: AUTH0_AUDIENCE,
            scope: 'openid profile email' // Requesting these scopes
        });

        // Return the access token from the response
        return response.data.access_token;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const axiosError = error as AxiosError<AuthError>;
            if (axiosError.response) {
                // Throw a detailed error message with a description
                throw {
                    error: axiosError.response.data.error,
                    error_description: axiosError.response.data.error_description
                };
            }
        }
        // If no specific error is found, throw a generic error
        throw { error: 'unknown_error', error_description: 'An unknown error occurred' };
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
};

// Function to retrieve and decrypt the stored token from localStorage
export const getStoredToken = () => {
    const encryptedToken = localStorage.getItem('auth_token');
    return encryptedToken ? decryptToken(encryptedToken) : null;
};

// Function to remove the stored token from localStorage
export const removeToken = () => {
    localStorage.removeItem('auth_token');
};

// Function to check if the stored token is still valid based on expiration
export const isTokenValid = () => {
    const token = getStoredToken();
    if (!token) return false;

    // Decode the token's payload and check expiration time
    const decodedToken = JSON.parse(atob(token.split('.')[1]));
    const expirationTime = decodedToken.exp * 1000;
    return Date.now() < expirationTime;
};

// Function to decode the token and return its payload
export const decodeToken = (token: string): DecodedToken => {
    return jwtDecode<DecodedToken>(token);
};

// Function to extract roles from the decoded token
export const getRolesFromToken = (token: string): string[] => {
    const decodedToken = decodeToken(token);
    return decodedToken.roles || [];
};