import CryptoJS from "crypto-js";
import {config} from "@/application/config";

const storageKeyPrefix: string = 'PWC_';
const secretKey: string = config.auth.secret;

// TODO : check if this storage strategy is viable for production
export const tokenStorage = {
    saveToken(url: string, token: string): void {
        localStorage.setItem(this.getStorageKey(url), CryptoJS.AES.encrypt(token, secretKey).toString());
    },
    loadToken(url: string): string | null {
        const encryptedToken = localStorage.getItem(this.getStorageKey(url));
        return null !== encryptedToken
            ? CryptoJS.AES.decrypt(encryptedToken, secretKey).toString(CryptoJS.enc.Utf8)
            : null;
    },
    clearToken(url: string): void {
        localStorage.removeItem(this.getStorageKey(url));
    },
    getStorageKey(url: string): string {
        return storageKeyPrefix + url;
    }
}
