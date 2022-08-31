const config = require('./config.json');
module.exports.run = async(client, message, args) => {
    message.delete()

    let brand_id, size_id, price_from, price_to, search_text;
    search_text = args[2] ? args[2] : "";
    price_from = args[3] ? args[3] : 0;
    price_to = args[4] ? args[4] : 1000000;

    // Si l'argument 0 est vide alors envoyer un message
    if(args[0] === undefined){
        return message.channel.send(`${message.author},Veuillez entrer une marque`);
    }

    if(!args[1]) {args[1] = ''}


    // Pour affecter la commande à un channel spécifique
    // if(message.channel.id !== '974569752309686322') {
    //     return message.channel.send("Vous devez être dans le channel #vinted_parser pour utiliser cette commande.")
    // }

    switch (args[0].toUpperCase()) {
        case 'NIKE': brand_id = config.brand[0].id; break;
        case 'ADIDAS': brand_id = config.brand[1].id; break;
        case 'LACOSTE': brand_id = config.brand[2].id; break;
        case 'RALPH-LAUREN': brand_id = config.brand[3].id; break;
        case 'TOMMY-HILFIGER': brand_id = config.brand[4].id; break;
        case 'LEVIS': brand_id = config.brand[5].id; break;
        case 'PUMA': brand_id = config.brand[6].id; break;
        case 'REEBOK': brand_id = config.brand[7].id; break;
        case 'NEW-BALANCE': brand_id = config.brand[8].id; break;
        case 'ASICS': brand_id = config.brand[9].id; break;
        case 'VANS': brand_id = config.brand[10].id; break;
        case 'CONVERSE': brand_id = config.brand[11].id; break;
        case 'ZARA': brand_id = config.brand[12].id; break;
        case 'DIESEL': brand_id = config.brand[13].id; break;
        case 'GUCCI': brand_id = config.brand[14].id; break;
        case 'ARMANI': brand_id = config.brand[15].id; break;
        case 'VERSACE': brand_id = config.brand[16].id; break;
        case 'PRADA': brand_id = config.brand[17].id; break;
        case 'FENDI': brand_id = config.brand[18].id; break;
        case 'VALENTINO': brand_id = config.brand[19].id; break;
        case 'THE-NORTH-FACE': brand_id = config.brand[20].id; break;
        case 'BURBERRY': brand_id = config.brand[21].id; break;
        case 'STONE-ISLAND': brand_id = config.brand[22].id; break;
        case 'OFF-WHITE': brand_id = config.brand[23].id; break;
        case 'SUPREME': brand_id = config.brand[24].id; break;
        case 'TRAVIS-SCOTT': brand_id = config.brand[25].id; break;
        case 'YEEZY': brand_id = config.brand[26].id; break;
        case 'CARHARTT': brand_id = config.brand[27].id; break;
        default:
            return message.channel.send(`${message.author}, merci de préciser une marque valide.`);
    }

    switch (args[1].toUpperCase()) {
        // Tailles
        case 'XS': size_id = config.size[0].id; break;
        case 'S': size_id = config.size[1].id; break;
        case 'M': size_id = config.size[2].id; break;
        case 'L': size_id = config.size[3].id; break;
        case 'XL': size_id = config.size[4].id; break;
        case 'XXL': size_id = config.size[5].id; break;
        // Pointures
        case '38': size_id = config.size[6].id; break;
        case '39': size_id = config.size[7].id; break;
        case '40': size_id = config.size[8].id; break;
        case '41': size_id = config.size[9].id; break;
        case '42': size_id = config.size[10].id; break;
        case '42.5': size_id = config.size[11].id; break;
        case '43': size_id = config.size[12].id; break;
        case '43.5': size_id = config.size[13].id; break;
        case '44': size_id = config.size[14].id; break;
        case '44.5': size_id = config.size[15].id; break;
        case '45': size_id = config.size[16].id; break;

        default:
            size_id = 0;
            break;

    }

    // console.log(args[2] + ' ' + args[3] + ' ' + args[4]) // DEBUG : Affiche les arguments
    let lien = `https://www.vinted.fr/vetements?search_text=${search_text}&brand_id[]=${brand_id}&order=newest_first&price_from=${price_from}&currency=EUR&price_to=${price_to}&size_id[]=${size_id}`;

    // Si l'user n'as pas tapé de taille alors on la retire de la requête
    if(size_id === 0) {
        lien = lien.replace('&size_id[]=0', '');
    }

    // console.log(lien) // DEBUG : Affiche le lien


    // Si l'user ne tape pas de taille alors on la retire de la requête
    if (size_id === 0) {
        lien = lien.substring(0, lien.length - 12);
    }

    /**
     * Récupération des données pour le parser en url puis en url api v2
     * @param url
     * @param disableOrder
     * @param allowSwap
     * @param customParams
     * @returns {{validURL: boolean}|{domain: string, querystring: string, validURL: boolean}}
     */
    function parseVintedURL(url, disableOrder, allowSwap, customParams = {}) {
        try {
            const decodedURL = decodeURI(url);
            const matchedParams = decodedURL.match(/^https:\/\/www\.vinted\.([a-z]+)/);
            if (!matchedParams) return {
                validURL: false
            };

            const missingIDsParams = ['catalog', 'status'];
            const params = decodedURL.match(/(?:([a-z_]+)(\[\])?=([a-zA-Z 0-9._À-ú+%]*)&?)/g);
            if (typeof matchedParams[Symbol.iterator] !== 'function') return {
                validURL: false
            };
            const mappedParams = new Map();
            for (let param of params) {
                let [ _, paramName, isArray, paramValue ] = param.match(/(?:([a-z_]+)(\[\])?=([a-zA-Z 0-9._À-ú+%]*)&?)/);
                if (paramValue?.includes(' ')) paramValue = paramValue.replace(/ /g, '+');
                if (isArray) {
                    if (missingIDsParams.includes(paramName)) paramName = `${paramName}_id`;
                    if (mappedParams.has(`${paramName}s`)) {
                        mappedParams.set(`${paramName}s`, [ ...mappedParams.get(`${paramName}s`), paramValue ]);
                    } else {
                        mappedParams.set(`${paramName}s`, [paramValue]);
                    }
                } else {
                    mappedParams.set(paramName, paramValue);
                }
            }
            for (let key of Object.keys(customParams)) {
                mappedParams.set(key, customParams[key]);
            }
            const finalParams = [];
            for (let [ key, value ] of mappedParams.entries()) {
                finalParams.push(typeof value === 'string' ? `${key}=${value}` : `${key}=${value.join(',')}`);
            }

            return {
                validURL: true,
                domain: matchedParams[1],
                querystring: `https://www.vinted.fr/api/v2/catalog/items?${finalParams.join('&')}`
            }
        } catch (e) {
            return {
                validURL: false
            }
        }
    }

    message.channel.send(`${message.author}, voici les résultats de votre recherche : \n${parseVintedURL(lien, false, false, {}).querystring}`);

}

module.exports.help = {
    "name": 'vinted_parser'
}
