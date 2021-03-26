import {sha256} from "js-sha256";

export const ssha256 = (strToEncrypt: string): string => {
    const bytes: number[] = [];
    for(let i=0; i<strToEncrypt.length; i++) {
        const c = strToEncrypt.charCodeAt(i);
        bytes.push(c & 0xff);
        bytes.push(c / 256 >>> 0);
    }

    const hash = sha256.create();
    hash.update(bytes);
    const encodedBytes = hash.array();
    const decoder = new TextDecoder('unicode');
    const encoded = btoa(decoder.decode(new Uint16Array(encodedBytes)));
    return encoded;
}

