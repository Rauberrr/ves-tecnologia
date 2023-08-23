const fs = require('fs');
const axios = require('axios');
const cheerio = require('cheerio');

async function searchNotices() {
    const mainUrl = 'https://olhardigital.com.br/';
    const list = [];
    try {
        const response = await axios.get(mainUrl);
        const $ = cheerio.load(response.data);
        console.log('opa');
        $('a.cardV2.cardV2-incover').each((index, element) => {
            if (list.length === 3) {
                saveData(list);
                return false;
            }

            const link = $(element).attr('href');
            crawlSinglePage(link, list);
        });
    } catch (error) {
        console.error('Erro ao acessar a página principal:', error);
    }
}

async function crawlSinglePage(url, list) {
    try {
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);

        const title = $('h1').text().trim();
        const subject = $('.banner-excerpt').text().trim();
        const src = $('.banner-img img').attr('src');
        if(!title || !subject || !src) {
            console.log('nao tem title ou assunto ou imagem');
        }
        else {
            const obj = {
                title: title,
                subject: subject,
                src: src,
                link: url,
            };
            
            list.push(obj);
        }

        if(list.length === 3) {
            saveData(list); // Salva após cada coleta de notícia individual
        }        
    } catch (error) {
        console.error('Erro ao acessar a página individual:', error);
    }
}

function saveData(data) {
    const listJSON = JSON.stringify(data, null, 2);
    fs.writeFileSync('./data/noticias.json', listJSON);
    console.log('Arquivo criado com sucesso');
}

module.exports = searchNotices;