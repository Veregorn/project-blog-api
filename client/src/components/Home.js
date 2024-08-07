import React, { useEffect, useState } from 'react';
import api from '../services/api';
import '../styles/Home.css';
import { Link } from 'react-router-dom';
import { Chip, Card, CardContent, CardActions, CardMedia, Button, Divider } from '@mui/material';
import Typography from '@mui/material/Typography';
import decodeImageURL from '../services/decodeImageURL';
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2

function Home({ user }) {
    const [posts, setPosts] = useState([]);
    const [comments, setComments] = useState([]);

    useEffect(() => {
        async function loadPosts() {
            // If the user is logged in and is admin, load all posts
            if (user.isLoggedIn && user.type === 'admin') {
                try {
                    const response = await api.get('/api/posts');
                    setPosts(response.data);
                } catch (error) {
                    console.log('Error loading posts', error);
                }
                return;
            } else {
                try {
                    const response = await api.get('/api/posts/published');
                    setPosts(response.data);
                } catch (error) {
                    console.log('Error loading posts', error);
                }
            }
        }

        // Function that load on the state the 5 last comments of the posts
        async function loadComments() {
            try {
                const response = await api.get('/api/comments/last');
                setComments(response.data);
            } catch (error) {
                console.log('Error loading comments', error);
            }
        }

        loadPosts();
        loadComments();
    }, [user]);

    if (posts.length === 0) {
        return (
            <div className='main'>
                <h4>Loading...</h4>
            </div>
        );
    }

    return (
        <div className='main'>
            <h2>Posts</h2>
            <Grid container spacing={8}>
                {posts.map((post) => (
                    <Grid item xs={12} sm={6} md={6} lg={4} key={post._id}>
                        <Card key={post._id} className='card'>
                            <>
                                <CardMedia
                                    component='img'
                                    height='200'
                                    image={decodeImageURL(post.image_url)}
                                    alt={post.title}
                                />
                                <CardContent>
                                    <Typography variant='h5' component='div'>
                                        {post.title}
                                    </Typography>
                                </CardContent>
                                <CardActions>
                                    <Button size='small' component={Link} to={`/post/${post._id}`}>Read now</Button>
                                    {(user.isLoggedIn && user.type === 'admin' && !post.published) &&
                                        <Chip label='Unpublished' variant='outlined' color='primary' />
                                    }
                                </CardActions>
                            </>
                        </Card>
                    </Grid>
                ))}
            </Grid>
            {comments.length > 0 && <h2>Last Comments</h2>}
            <Grid container spacing={8}>
                {comments.map((comment) => (
                    <Grid item xs={12} sm={6} md={6} lg={4} key={comment._id}>
                        <Card key={comment._id}>
                            <CardContent>
                                <Typography variant='subtitle2'>{comment.user.name}</Typography>
                                <Typography variant='body2'> in </Typography>
                                <Typography variant='subtitle2' sx={{ mb: 2 }}>{comment.post.title}</Typography>
                                <Divider flexItem sx={{ mb: 2 }}/>
                                <Typography variant='body2' component='div' sx={{ mb: 2 }}>
                                    {comment.content}
                                </Typography>
                                <Divider flexItem/>
                            </CardContent>
                            <CardActions>
                                <Button size='small' component={Link} to={`/post/${comment.post._id}`}>Read post</Button>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </div>
    );
}

export default Home;