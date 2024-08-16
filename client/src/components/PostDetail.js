import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import '../styles/PostDetail.css';
import { useNavigate } from 'react-router-dom';
import decodeImageURL from '../services/decodeImageURL';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import { Card, CardContent, CardActions, Button, Divider, TextField } from '@mui/material';
import { Link } from 'react-router-dom';
import MarkdownIt from 'markdown-it';
import DOMPurify from 'dompurify';

function PostDetail({ user }) {
    const navigate = useNavigate();
    const { id } = useParams();
    const [post, setPost] = useState({});
    const [comments, setComments] = useState([]);
    const [commentContent, setCommentContent] = useState('');
    const [error, setError] = useState('');

    const md = new MarkdownIt({
        html: true,
        linkify: true,
        typographer: true,
        breaks: true
    });

    // Convert the markdown content to HTML
    const rawHTMLContent = md.render(post.content || '');

    // Sanitize the HTML content
    const sanitizedHTMLContent = DOMPurify.sanitize(rawHTMLContent);

    useEffect(() => {
        async function loadPost() {
            try {
                const response = await api.get(`/api/posts/${id}`);
                setPost(response.data);
                setError('');
            } catch (error) {
                console.log('Error loading post', error);
                setError('Error loading post');
            }
        }
        
        async function loadComments() {
            try {
                const response = await api.get(`/api/posts/${id}/comments`);
                setComments(response.data);
            } catch (error) {
                if (error.response && error.response.status === 404) {
                    // Si el error es un 404, significa que no hay comentarios
                    setComments([]);
                    setError('');
                } else {
                    console.log('Error loading comments', error);
                    setError('Error loading comments');
                }
            }
        }

        loadPost();
        loadComments();
    }, [id]);

    // Function that delete all the comments of a post
    async function deleteComments() {
        try {
            for (let comment of comments) {
                await api.delete(`/api/posts/${id}/comments/${comment._id}`);
            }
            setComments([]);
            setError('');
        } catch (error) {
            console.log('Error deleting comments', error);
            setError('Error deleting comments');
        }
    }

    async function handleCreateComment(event) {
        event.preventDefault();
        try {
            await api.post(`/api/posts/${id}/comments`, { content: commentContent, user: user.id});
            const response = await api.get(`/api/posts/${id}/comments`);
            setComments(response.data);
            setCommentContent('');
            setError('');
        } catch (error) {
            console.log('Error posting comment', error);
            setError('Error posting comment. You need to enter some text.');
        }
    }

    if (!post.title) {
        return (
            <div className='main'>
                <h4>Loading...</h4>
            </div>
        );
    }

    async function handleDeletePost() {
        try {
            // Delete all the comments of the post
            await deleteComments();
            // Delete the post
            await api.delete(`/api/posts/${id}`);
            // Reset the post state
            setError('');
            // Redirect the user to the home page
            navigate('/');
        } catch (error) {
            console.log('Error deleting post', error);
            setError('Error deleting post. Please try again.');
        }
    }

    return (
        <div className='main'>
            <Typography
                variant="h1"
                align='center'
                lineHeight={2}
                fontSize={60}
                marginTop={10}
            >{post.title}</Typography>
            {post.image_url ? <img className='post-image' src={decodeImageURL(post.image_url)} alt={post.title} /> : <img className='post-image' src='/devnews-sn-logo.jpg' alt={post.title} />}
            {/* Link to the source of the post */}
            {post.source && <Typography variant='subtitle2' color={'#777'}>Post original: <a href={post.source} target='_blank' rel='noreferrer'>{post.source}</a></Typography>}
            {/* <p className='post-detail-content'>{post.content}</p> */}
            <Typography
                variant="body1"
                align='justify'
                lineHeight={2}
                fontSize={20}
            >{/* Renderiza el contenido del post */}
            <div dangerouslySetInnerHTML={{ __html: sanitizedHTMLContent }} />
            {/* Otros componentes y lógica */}</Typography>
            {post.author && <Typography variant='subtitle2' color={'#777'}>By {post.author.name}</Typography>}
            {post.created_at && <Typography variant='subtitle2' color={'#777'}>Published on {new Date(post.created_at).toLocaleDateString()}</Typography>}
            {/* Show a 'Edit post' button only if the user is an admin */}
            {user.isLoggedIn && user.type === 'admin' && <Button className='action-button' variant="contained" onClick={() => navigate(`/edit-post/${id}`)}>Edit post</Button>}
            {/* Show a 'Delete post' button only if the user is an admin */}
            {user.isLoggedIn && user.type === 'admin' && <Button className='action-button' variant="contained" onClick={handleDeletePost}>Delete post</Button>}
            {user.isLoggedIn && (
                <>
                    <Divider flexItem />
                    <form onSubmit={handleCreateComment}>
                        <TextField
                            label="Comment"
                            variant="outlined"
                            type='text'
                            id='content'
                            name='content'
                            multiline
                            minRows={4}
                            value={commentContent}
                            onChange={(e) => setCommentContent(e.target.value)}
                        />
                        <Button variant="contained" type='submit'>Post comment</Button>
                    </form>
                    <Divider flexItem />
                </>
            )}
            {comments.length > 0 ? (
                <>
                    <Typography variant='h2' sx={{ mt: 2 }}>Comments</Typography>
                    <Grid container spacing={8} sx={{ pb: '6' }}>
                        {comments.map((comment) => (
                            <Grid item xs={12} sm={6} md={6} lg={4} key={comment._id} sx={{ pb: '10' }}>
                                <Card key={comment._id} sx={{ minWidth: '250px', pb: '3' }}>
                                    <CardContent>
                                        <Typography variant='subtitle2'>{comment.user.name}</Typography>
                                        <Divider flexItem sx={{ mb: 2 }}/>
                                        <Typography variant='body2' component='div' sx={{ mb: 2 }}>
                                            {comment.content}
                                        </Typography>
                                    </CardContent>
                                    <CardActions>
                                        {/* If user is admin, we need to place a button to delete the comment */}
                                        {user.isLoggedIn && user.type === 'admin' && <Button size="small" component={Link} >Delete comment</Button>}
                                    </CardActions>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </>
            ) : (
                <p>No comments yet.</p>
            )}
            {error && <p className='error'>{error}</p>}
        </div>
    );
}

export default PostDetail;