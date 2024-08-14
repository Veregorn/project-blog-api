import React, { useEffect, useState } from 'react';
import api from '../services/api';
import '../styles/Home.css';
import { Link } from 'react-router-dom';
import { Chip, Card, CardContent, CardActions, CardMedia, Button, Divider } from '@mui/material';
import Typography from '@mui/material/Typography';
import decodeImageURL from '../services/decodeImageURL';
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import Pagination from '@mui/material/Pagination';
import { createTheme } from '@mui/material/styles';

let theme = createTheme();

theme = createTheme(theme,{
    palette: {
        primary: {
            main: '#fff',
        },
        secondary: {
            main: '#ff5722',
        },
        grey: theme.palette.augmentColor({
            color: {
                main: '#e0e0e0',
                contrastText: '#000',
            },
            name: 'grey',
        })
    },
});


function Home({ user }) {
    const [posts, setPosts] = useState([]);
    const [comments, setComments] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    }

    useEffect(() => {
        async function loadPosts(currentPage) {
            // If the user is logged in and is admin, load all posts
            if (user.isLoggedIn && user.type === 'admin') {
                try {
                    const response = await api.get(`/api/posts${currentPage ? `?page=${currentPage}` : ''}`);
                    setPosts(response.data.posts);
                    setTotalPages(response.data.totalPages);
                } catch (error) {
                    console.log('Error loading posts', error);
                }
                return;
            } else {
                try {
                    const response = await api.get(`/api/posts/published${currentPage ? `?page=${currentPage}` : ''}`);
                    setPosts(response.data.posts);
                    setTotalPages(response.data.totalPages);
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

        loadPosts(currentPage);
        loadComments();
    }, [user, currentPage]);

    if (posts.length === 0) {
        return (
            <div className='main'>
                <h4>Loading...</h4>
            </div>
        );
    }

    return (
        <div className='main'>
            <h2>Últimos Artículos</h2>
            <Grid container spacing={8}>
                {posts.length > 0 && posts.map((post) => (
                    <Grid item xs={12} sm={6} md={6} lg={4} key={post._id}>
                        <Card key={post._id} className='card' sx={{ backgroundColor: '#efebe9' }}>
                            <>
                                <CardMedia
                                    component='img'
                                    sx= {{height: '200px'}}
                                    image={decodeImageURL(post.image_url)}
                                    alt={post.title}
                                />
                                <CardContent className='card-content'>
                                    <Typography sx={{ fontSize: 18 }} component='div'>
                                        {post.title}
                                    </Typography>
                                </CardContent>
                                <CardActions className='card-actions'>
                                    <Button size='small' component={Link} to={`/post/${post._id}`} sx={{ color: theme.palette.grey.main }}>Leer ahora</Button>
                                    {(user.isLoggedIn && user.type === 'admin' && !post.published) &&
                                        <Chip label='Unpublished' variant='outlined' color='primary' />
                                    }
                                </CardActions>
                            </>
                        </Card>
                    </Grid>
                ))}
                {posts.length === 0 && <h4>No posts found</h4>}
            </Grid>
            <Pagination count={totalPages} color='primary' defaultPage={currentPage} onChange={handlePageChange} sx={{ mt: 2, textAlign: 'center' }}/>
            {comments.length > 0 && <h2>Últimos Comentarios</h2>}
            <Grid container spacing={8}>
                {comments.map((comment) => (
                    <Grid item xs={12} sm={6} md={6} lg={4} key={comment._id} sx={{ pb: 10 }}>
                        <Card key={comment._id} sx={{ minWidth: '250px', minHeight: '250px' }}>
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