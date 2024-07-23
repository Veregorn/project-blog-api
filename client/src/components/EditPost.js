import '../styles/EditPost.css';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';

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

function EditPost() {
    const navigate = useNavigate();
    const [title, setTitle] = React.useState('');
    const [content, setContent] = React.useState('');
    const [imageFile, setImageFile] = React.useState('');
    const [oldImageFile, setOldImageFile] = React.useState('');
    const [published, setPublished] = React.useState(false);
    const [error, setError] = React.useState('');
    const { id } = useParams();

    useEffect(() => {
        async function loadPost() {
            try {
                const response = await api.get(`/api/posts/${id}`);
                setTitle(response.data.title);
                setContent(response.data.content);
                setPublished(response.data.published);
                setOldImageFile(response.data.image_url);
                setError('');
            } catch (error) {
                console.log('Error loading post', error);
                setError('Error loading post');
            }
        }

        loadPost();
    }, [id]);

    async function handleUpdatePost(event) {
        event.preventDefault();

        try {
            let image_url = oldImageFile;

            // If the image URL is not empty, decode the URL and upload the image to Cloudinary
            /* if (imageFile) {
                const formData = new FormData();
                formData.append('file', imageFile);
                formData.append('upload_preset', process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET); // Reemplaza 'your_upload_preset' con tu preset de subida

                const response = await fetch(`https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload`, {
                    method: 'POST',
                    body: formData
                });

                const data = await response.json();
                image_url = decodeImageURL(data.secure_url);
            } */

            // We only need to upload the image if the user uploads a new one, otherwise we use the old image URL
            if (imageFile !== oldImageFile) {
                console.log('Image File:', imageFile);
                console.log('Old Image File:', oldImageFile);
                const formData = new FormData();
                formData.append('file', imageFile);
                formData.append('upload_preset', process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET);

                const response = await fetch(`https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload`, {
                    method: 'POST',
                    body: formData
                });

                const data = await response.json();
                image_url = decodeImageURL(data.secure_url);
            };

            await api.put(`/api/posts/${id}`, { 
            // Create the post
                title, 
                content, 
                image_url, 
                published
            });

            // Redirect the user to the home page
            navigate('/');
        } catch (error) {
            console.log('Error updating post', error);
            setError('Error updating post. Please try again.');
        }
    }

    return (
        <div className='main'>
            <h2>Edit post</h2>
            <form onSubmit={handleUpdatePost}>
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
                <button type='submit'>Update Post</button>
            </form>
        </div>
    );
}

export default EditPost;