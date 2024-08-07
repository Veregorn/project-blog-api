import '../styles/EditPost.css';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import Button from '@mui/material/Button';
import { TextField, Checkbox, FormGroup, FormControlLabel } from '@mui/material';
import decodeImageURL from '../services/decodeImageURL';

function EditPost() {
    const navigate = useNavigate();
    const [title, setTitle] = React.useState('');
    const [content, setContent] = React.useState('');
    const [imageFile, setImageFile] = React.useState('');
    const [oldImageFile, setOldImageFile] = React.useState('');
    const [published, setPublished] = React.useState(false);
    const [source, setSource] = React.useState('');
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
                setSource(response.data.source);
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

            const decodedSource = decodeImageURL(source);

            await api.put(`/api/posts/${id}`, { 
            // Create the post
                title, 
                content, 
                image_url, 
                published,
                decodedSource
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
                <Button variant="contained" type='submit'>Update post</Button>
            </form>
        </div>
    );
}

export default EditPost;