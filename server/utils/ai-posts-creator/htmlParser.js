const axios = require('axios');
const cheerio = require('cheerio');

async function fetchArticleContent(url) {
    try {
        const response = await axios.get(url);
        const $ = cheerio.load(response.data); // Aquí $ es una función que recibe el HTML de la página y lo convierte en un objeto que podemos manipular con jQuery.

        const articleTitle = $('h1').text(); // Aquí estamos seleccionando el título del artículo en base a la etiqueta h1.
        const articleImage = $('.crayons-article__cover__image').attr('src'); // Aquí estamos seleccionando la imagen del artículo en base a la clase CSS crayons-article__cover-image.
        const articleContent = $('.crayons-article__body').text(); // Aquí estamos seleccionando el contenido del artículo en base a la clase CSS crayons-article__body.

        return {
            title: articleTitle,
            image: articleImage,
            content: articleContent,
            source: url
        };
    } catch (error) {
        console.error('Error fetching articles content:', error);
        return '';
    }
}

module.exports = fetchArticleContent;