const axios = require('axios');
require('dotenv').config();

// Function to share a post on LinkedIn feed
async function shareOnLinkedInFeed(titlesArray) {
    try {
        const response = await axios.post('https://api.linkedin.com/v2/ugcPosts', {

            // Create the json object
            "author": `rn:li:person:${process.env.LINKEDIN_CLIENT_ID}`,
            "lifecycleState": "PUBLISHED",
            "specificContent": {
                "com.linkedin.ugc.ShareContent": {
                    "shareCommentary": {
                        "text": `En la edición de hoy: ${titlesArray.join(', ')}`
                    },
                    "shareMediaCategory": "ARTICLE",
                    "media": [
                        {
                            "status": "READY",
                            "description": {
                                "text": "Mantente al día con las noticias top del mundo Dev. Todos los días 3 nuevas noticias, resumidas y traducidas mediante IA con enlaces a la fuente original"
                            },
                            "originalUrl": "https://project-blog-api-client.vercel.app",
                            "title": {
                                "text": "DevNews en Español"
                            }
                        }
                    ]
                }
            },
        }, {
            headers: { 
                'Authorization': `Bearer ${process.env.LINKEDIN_BEARER_TOKEN}`,
                'Content-Type': 'application/json',
                'X-Restli-Protocol-Version': '2.0.0'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error sharing post on LinkedIn feed:', error);
        return [];
    }
}

module.exports = shareOnLinkedInFeed;