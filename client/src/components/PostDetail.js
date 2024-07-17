import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import '../styles/PostDetail.css';

function PostDetail({ user }) {
    const { id } = useParams();
    const [post, setPost] = useState({});
    const [comments, setComments] = useState([]);
    const [commentContent, setCommentContent] = useState('');

    useEffect(() => {
        async function loadPost() {
            try {
                const response = await api.get(`/api/posts/${id}`);
                setPost(response.data);
            } catch (error) {
                console.log('Error loading post', error);
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
                } else {
                    console.log('Error loading comments', error);
                }
            }
        }

        loadPost();
        loadComments();
    }, [id]);

    async function handleSubmit(event) {
        event.preventDefault();
        try {
            await api.post(`/api/posts/${id}/comments`, { content: commentContent, user: user.id});
            const response = await api.get(`/api/posts/${id}/comments`);
            setComments(response.data);
            setCommentContent('');
        } catch (error) {
            console.log('Error posting comment', error);
        }
    }

    if (!post.title) {
        return (
            <div className='main'>
                <h4>Loading...</h4>
            </div>
        );
    }

    return (
        <div className='main'>
            <h1>{post.title}</h1>
            {console.log(post.image_url)}
            {post.image_url && <img src={post.image_url} alt={post.title} />}
            <p>{post.content}</p>
            {post.author && <p>Author: {post.author.name}</p>}
            {post.created_at && <p>Created at: {new Date(post.created_at).toLocaleString()}</p>}
            {user.isLoggedIn && (
                <>
                    <hr />
                    <form onSubmit={handleSubmit}>
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
                        </div>
                    ))}
                </>
            ) : (
                <p>No comments yet.</p>
            )}
        </div>
    );
}

export default PostDetail;