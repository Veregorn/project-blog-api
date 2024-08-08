// En este fichero vamos a leer el contenido del fichero 'raw-articles.json' y vamos a pasarle lo que hay en el campo 'content' de cada artículo a un cliente del SDK de Vercel que se encargará de usar la API de OpenAI para generar un resumen y traducción de cada artículo.
// Por último, vamos a guardar el resultado en un fichero 'processed-articles.json' donde cada artículo tendrá un campo adicional 'summary' con el resumen traducido de su contenido.

const { generateText } = require('ai');
const { createOpenAI } = require('@ai-sdk/openai');
const sharp = require('sharp');
const axios = require('axios');
const FormData = require('form-data');
require('dotenv').config();

const openai = createOpenAI({
    compatibility: 'strict', // strict mode, enable when using the OpenAI API
    apiKey: process.env.OPENAI_API_KEY,
});

const model = 'gpt-4o-mini'; // Usar el modelo adecuado

// Function to decode the image URL
function decodeImageURL(imageURL) {
    const entities = {
        '&%23x2F;': '/',
        '&#x2F;': '/',
        '&amp;': '&',
        '&lt;': '<',
        '&gt;': '>',
        '&quot;': '"',
        '&#39;': "'"
    };
    return imageURL.replace(/&%23x2F;|&#x2F;|&amp;|&lt;|&gt;|&quot;|&#39;/g, function (match) {
        return entities[match];
    });
};

// Function to process the images
async function processImage(imageURL) {
    try {
        // Descargar la imagen desde la URL
        const response = await axios({
          url: imageURL,
          method: 'GET',
          responseType: 'arraybuffer', // Obtener la imagen como un buffer
        });
    
        // Redimensionar y comprimir la imagen usando sharp
        const resizedImageBuffer = await sharp(response.data)
          .resize({ width: 1000 }) // Redimensionar la imagen si es necesario
          .webp({ quality: 80 }) // Convertir a WebP y comprimir
          .toBuffer();
    
        // Crear un FormData para subir la imagen a Cloudinary
        const formData = new FormData();
        formData.append('file', resizedImageBuffer, { filename: 'image.webp' });
        formData.append('upload_preset', process.env.CLOUDINARY_UPLOAD_PRESET);
    
        // Subir la imagen a Cloudinary
        const cloudinaryResponse = await axios.post(
          `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`,
          formData,
          { headers: formData.getHeaders() }
        );
    
        // Devolver la URL segura de la imagen subida
        return decodeImageURL(cloudinaryResponse.data.secure_url);
    } catch (error) {
        console.error('Error al procesar y subir la imagen:', error);
        throw error;
    }
}

async function articlesHandler(rawArticlesArray) {
    const processedArticlesArray = await Promise.all(rawArticlesArray.map(async article => {
        try {
            let processedArticle = {
                title: article.title,
                image: article.image,
                summary: article.content,
                source: article.source
            };

            // Process the title
            const titleResponse = await generateText({
                model: openai('gpt-4o-mini'), // Usar el modelo adecuado
                system: 'You are a professional writer in a well known blog about developing for developers. You write simple, clear, and concise content',
                prompt: `Por favor, traduce el siguiente título al español: ${article.title}`,
                max_tokens: 100,
                temperature: 0.5,
                top_p: 1,
                frequency_penalty: 0,
                presence_penalty: 0,
            });

            processedArticle.title = titleResponse.text;

            // Process the content

            const contentResponse = await generateText({
                model: openai('gpt-4o-mini'), // Usar el modelo adecuado
                system: 'You are a professional writer in a well known blog about developing for developers. You write simple, clear, and concise content',
                prompt: `Por favor, resume el siguiente artículo y tradúcelo al español. No quiero que digas cosas como \"El artículo presenta\" o \"El artículo menciona\". Muestra la respuesta como si fuese el propio artículo, sin hacer comentarios en tercera persona. El resumen debe ser bastante conciso, usando el menor número de tokens posible pero sin eliminar información importante del resumen. No incluyas nunca código de programación en las respuestas. Este es el articulo:\n\n${article.content}`,
                max_tokens: 8000,
                temperature: 0.5,
                top_p: 1,
                frequency_penalty: 0,
                presence_penalty: 0,
            });

            processedArticle.summary = contentResponse.text;

            // Process the image uploading it to Cloudinary and decoding the URL

            // If the image URL is not empty, decode the URL and upload the image to Cloudinary
            if (processedArticle.image) {
                processedArticle.image = await processImage(processedArticle.image);
            }

            return processedArticle;

        } catch (error) {
            console.error('Error processing article:', error);
            return '';
        }   
    }));

    return processedArticlesArray;
}

module.exports = articlesHandler;