// This function fetches the latest 3 articles from the DEV.to API and returns an array of their URLs.

const axios = require('axios');

async function getDevToArticles() {
  try {
    const response = await axios.get('https://dev.to/api/articles?top=1&per_page=3');
    const articles = response.data;
    const articleUrls = articles.map(article => article.url);
    return articleUrls;
  } catch (error) {
    console.error('Error fetching articles:', error);
    return [];
  }
}

module.exports = getDevToArticles;