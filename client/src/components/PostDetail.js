import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import '../styles/PostDetail.css';
import { useNavigate } from 'react-router-dom';

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

function PostDetail({ user }) {
    const navigate = useNavigate();
    const { id } = useParams();
    const [post, setPost] = useState({});
    const [comments, setComments] = useState([]);
    const [commentContent, setCommentContent] = useState('');
    const [error, setError] = useState('');

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
            <h1>{post.title}</h1>
            {post.image_url && <img src={decodeImageURL(post.image_url)} alt={post.title} />}
            <p>{post.content}</p>
            {post.author && <p>Author: {post.author.name}</p>}
            {post.created_at && <p>Created at: {new Date(post.created_at).toLocaleString()}</p>}
            {/* Show a 'Delete post' button only if the user is an admin */}
            {user.isLoggedIn && user.type === 'admin' && <button onClick={handleDeletePost}>Delete post</button>}
            {user.isLoggedIn && (
                <>
                    <hr />
                    <form onSubmit={handleCreateComment}>
                        <div className='form-group'>
                            <label htmlFor='content'>Comment:</label>
                            <textarea id='content' name='content' value={commentContent} onChange={(e) => setCommentContent(e.target.value)}></textarea>
                        </div>
                        <button type='submit'>Post comment</button>
                    </form>
                    <hr />
                </>
            )}
            {comments.length > 0 ? (
                <>
                    <h2>Comments</h2>
                    {comments.map((comment) => (
                        <div key={comment._id}>
                            <p>{comment.content}</p>
                            {comment.user && <p>Author: {comment.user.name}</p>}
                            {comment.timestamp && <p>Created at: {new Date(comment.timestamp).toLocaleString()}</p>}
                            {/* Show a 'Delete comment' button only if the user is an admin */}
                            {user.isLoggedIn && user.type === 'admin' && <button onClick={async () => {
                                try {
                                    await api.delete(`/api/posts/${id}/comments/${comment._id}`);
                                    const response = await api.get(`/api/posts/${id}/comments`);
                                    setComments(response.data);
                                    setError('');
                                } catch (error) {
                                    console.log('Error deleting comment', error);
                                    setError('Error deleting comment');
                                }
                            }}>Delete comment</button>}
                        </div>
                    ))}
                </>
            ) : (
                <p>No comments yet.</p>
            )}
            {error && <p className='error'>{error}</p>}
        </div>
    );
}

export default PostDetail;