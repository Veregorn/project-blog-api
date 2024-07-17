import '../styles/NewPost.css';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

require('dotenv').config();
const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

console.log('API_KEY:', process.env.CLOUDINARY_API_KEY);
console.log('API_SECRET:', process.env.CLOUDINARY_API_SECRET);
console.log('CLOUD_NAME:', process.env.CLOUDINARY_CLOUD_NAME);

console.log('TESTING_ENV_VARIABLE: ', process.env.TESTING_ENV_VARIABLE);

// Function to decode the image URL
function decodeImageURL(imageURL) {
    const entities = {
        '&#x2F;': '/',
        '&amp;': '&',
        '&lt;': '<',
        '&gt;': '>',
        '&quot;': '"',
        '&#39;': "'"
    };
    return imageURL.replace(/&#x2F;|&amp;|&lt;|&gt;|&quot;|&#39;/g, function (match) {
        return entities[match];
    });
};

function NewPost() {
    const navigate = useNavigate();
    const [title, setTitle] = React.useState('');
    const [content, setContent] = React.useState('');
    const [image_url, setImageUrl] = React.useState('');
    const [published, setPublished] = React.useState(false);
    const [error, setError] = React.useState('');

    async function handleSubmit(event) {
        event.preventDefault();

        try {
            // If the image URL is not empty, decode the URL and upload the image to Cloudinary
            if (image_url !== '') {
                const decodedImgURL = decodeImageURL(image_url);
                await cloudinary.uploader.upload(decodedImgURL, function (error, result) {
                    if (error) {
                        console.log('Error uploading image to Cloudinary', error);
                        setError('Error uploading image to Cloudinary. Please try again.');
                    } else {
                        setImageUrl(cloudinary.url(decodedImgURL));
                    }
                });
            }
            // Create the post
            await api.post('/api/posts', { 
                title, 
                content, 
                image_url, 
                published
            });
            // Redirect the user to the home page
            navigate('/');
        } catch (error) {
            console.log('Error creating post', error);
            setError('Error creating post. Please try again.');
        }
    }

    return (
        <div className='main'>
            <h2>New post</h2>
            <form onSubmit={handleSubmit}>
                <div className='form-group'>
                    <label htmlFor='title'>Title:</label>
                    <input
                        type='text'
                        id='title'
                        name='title'
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>
                <div className='form-group'>
                    <label htmlFor='content'>Content:</label>
                    <textarea
                        id='content'
                        name='content'
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />
                </div>
                <div className='form-group'>
                    <label htmlFor='image_url'>Image URL:</label>
                    <input
                        type='file'
                        id='image_url' 
                        name='image_url' 
                        value={image_url} 
                        onChange={(e) => setImageUrl(e.target.value)}
                    />
                </div>
                <div className='form-group'>
                    <label htmlFor='published'>Published:</label>
                    <input
                        type='checkbox'
                        id='published'
                        name='published'
                        checked={published}
                        onChange={(e) => setPublished(e.target.checked)}
                    />
                </div>
                <button type='submit'>Create post</button>
            </form>
            {error && <p className='error'>{error}</p>}
        </div>
    );
}

export default NewPost;