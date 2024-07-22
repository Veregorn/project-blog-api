import '../styles/NewPost.css';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

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

function NewPost() {
    const navigate = useNavigate();
    const [title, setTitle] = React.useState('');
    const [content, setContent] = React.useState('');
    const [imageFile, setImageFile] = React.useState(null);
    const [published, setPublished] = React.useState(false);
    const [error, setError] = React.useState('');

    async function handleCreatePost(event) {
        event.preventDefault();

        try {
            let image_url = '';

            // If the image URL is not empty, decode the URL and upload the image to Cloudinary
            if (imageFile) {
                const formData = new FormData();
                formData.append('file', imageFile);
                formData.append('upload_preset', process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET); // Reemplaza 'your_upload_preset' con tu preset de subida

                const response = await fetch(`https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload`, {
                    method: 'POST',
                    body: formData
                });

                const data = await response.json();
                image_url = decodeImageURL(data.secure_url);
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
            <form onSubmit={handleCreatePost}>
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
                        onChange={(e) => setImageFile(e.target.files[0])}
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
                {error && <p className='error'>{error}</p>}
                <button type='submit'>Create Post</button>
            </form>
        </div>
    );
}

export default NewPost;