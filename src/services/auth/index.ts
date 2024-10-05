import axios, { AxiosError } from 'axios';
import CryptoJS from 'crypto-js';
import { jwtDecode } from "jwt-decode";

const AUTH0_DOMAIN = import.meta.env.VITE_AUTH0_DOMAIN;
const AUTH0_CLIENT_ID = import.meta.env.VITE_AUTH0_CLIENT_ID;
const AUTH0_CLIENT_SECRET = import.meta.env.VITE_AUTH0_CLIENT_SECRET;
const AUTH0_AUDIENCE = import.meta.env.VITE_AUTH0_AUDIENCE;
const SECRET_KEY = import.meta.env.VITE_SECRET_KEY;

interface DecodedToken {
    exp: number;
    roles?: string[];
}

interface AuthError {
    error: string;
    error_description: string;
}

export const getToken = async (username: string, password: string) => {
    try {
        const response = await axios.post(`https://${AUTH0_DOMAIN}/oauth/token`, {
            grant_type: 'password',
            username,
            password,
            client_id: AUTH0_CLIENT_ID,
            client_secret: AUTH0_CLIENT_SECRET,
            audience: AUTH0_AUDIENCE,
            scope: 'openid profile email'
        });

        return response.data.access_token;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const axiosError = error as AxiosError<AuthError>;
            if (axiosError.response) {
                throw {
                    error: axiosError.response.data.error,
                    error_description: axiosError.response.data.error_description
                };
            }
        }
        throw { error: 'unknown_error', error_description: 'An unknown error occurred' };
    }
};

export const encryptToken = (token: string) => {
    return CryptoJS.AES.encrypt(token, SECRET_KEY).toString();
};

export const decryptToken = (encryptedToken: string) => {
    const bytes = CryptoJS.AES.decrypt(encryptedToken, SECRET_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
};

export const setToken = (token: string) => {
    const encryptedToken = encryptToken(token);
    localStorage.setItem('auth_token', encryptedToken);
};

export const getStoredToken = () => {
    const encryptedToken = localStorage.getItem('auth_token');
    return encryptedToken ? decryptToken(encryptedToken) : null;
};

export const removeToken = () => {
    localStorage.removeItem('auth_token');
};

export const isTokenValid = () => {
    const token = getStoredToken();
    if (!token) return false;

    const decodedToken = JSON.parse(atob(token.split('.')[1]));
    const expirationTime = decodedToken.exp * 1000;
    return Date.now() < expirationTime;
};

export const decodeToken = (token: string): DecodedToken => {
    return jwtDecode<DecodedToken>(token);
};

export const getRolesFromToken = (token: string): string[] => {
    const decodedToken = decodeToken(token);
    return decodedToken.roles || [];
};