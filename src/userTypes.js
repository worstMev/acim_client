import cryptojs from 'crypto-js';
export const User = {
    TECH_MAIN : { 
        text :'technicien de maintenance',
        code : 'TECH_MAIN',
    },
    USER : {
        text : 'utilisateur',
        code : 'USER',
    },
    DASH : { 
        text : 'tableau de bord',
        code : 'DASH',
    },
}

export async function computeHmac( text , key ) {
    let computedHash = await cryptojs.HmacMD5(text, key);
    const hexaComputedHash ='\\x'+computedHash;
    return hexaComputedHash;
}
