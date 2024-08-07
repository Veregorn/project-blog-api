import '../styles/NewPost.css';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Button from '@mui/material/Button';
import { TextField, Checkbox, FormGroup, FormControlLabel } from '@mui/material';
import decodeImageURL from '../services/decodeImageURL';

function NewPost() {
    const navigate = useNavigate();
    const [title, setTitle] = React.useState('');
    const [content, setContent] = React.useState('');
    const [imageFile, setImageFile] = React.useState(null);
    const [published, setPublished] = React.useState(false);
    const [source, setSource] = React.useState('');
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
            console.log('Source before:', source);
            setSource(decodeImageURL(source));
            console.log('Source after:', source);

            // Create the post
            await api.post('/api/posts', { 
                title, 
                content, 
                image_url, 
                published,
                source
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
                <TextField
                    label="Title"
                    variant="outlined"
                    type='text'
                    id='title'
                    name='title'
                    fullWidth
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <TextField
                    label="Source"
                    variant="outlined"
                    type='text'
                    id='source'
                    name='source'
                    fullWidth
                    value={source}
                    onChange={(e) => setSource(e.target.value)}
                />
                <TextField
                    label="Content"
                    variant="outlined"
                    type='text'
                    id='content'
                    name='content'
                    multiline
                    minRows={4}
                    fullWidth
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />
                <TextField
                    label="Image"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    type='file'
                    id='image_url'
                    name='image_url'
                    fullWidth
                    onChange={(e) => setImageFile(e.target.files[0])}
                />
                <FormGroup>
                    <FormControlLabel
                        control={<Checkbox
                            id='published'
                            name='published'
                            checked={published}
                            onChange={(e) => setPublished(e.target.checked)}
                        />}
                        label='Published'
                    />
                </FormGroup>
                {error && <p className='error'>{error}</p>}
                <Button variant="contained" type='submit'>Create post</Button>
            </form>
        </div>
    );
}

export default NewPost;