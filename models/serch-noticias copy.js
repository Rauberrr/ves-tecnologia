const fs = require('fs');
const Crawler = require('crawler');

function SearchNotices() {
    const mainUrl = 'https://olhardigital.com.br/';
    const list = [];

    const mainCrawler = new Crawler({
        maxConnections: 1,
        callback: (error, res, done) => {
            if (error) {
                console.log('Erro ao acessar a página principal:', error);
                done();
                return;
            }

            const $ = res.$;
            const newsElements = $('a.cardV2.cardV2-incover');

            newsElements.each((index, element) => {

                const link = $(element).attr('href');
                crawlSinglePage(link, () => {
                    if (list.length === 3 && list.every(item => item.title)) {
                        saveData(list);
                    }
                });
            });

            done();
        },
    });

    const crawlSinglePage = (url, callback) => {
        const singleCrawler = new Crawler({
            maxConnections: 1,
            callback: (error, res, done) => {
                if (error) {
                    console.log('Erro ao acessar a página individual:', error);
                    done();
                    return;
                }

                const $ = res.$;
                const title = $('h1').text().trim();
                const subject = $('.banner-excerpt').text().trim();
                const src = $('.banner-img img').attr('src');
                const obj = {
                    title: title,
                    subject: subject,
                    src: src,
                    link: url,
                };

                list.push(obj);
                done();
                callback();
            },
        });

        singleCrawler.queue(url);
    };

    const saveData = (data) => {
        const listJSON = JSON.stringify(data, null, 2);
        fs.writeFileSync('./data/noticias.json', listJSON);
        console.log('Arquivo criado com sucesso');
    };

    mainCrawler.queue(mainUrl);
}

SearchNotices();