import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';

function PostDetail() {
    const { id } = useParams();
    const [post, setPost] = useState({});
    const [comments, setComments] = useState([]);

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
            <p>{post.content}</p>
            {post.author && <p>Author: {post.author.name}</p>}
            {post.createdAt && <p>Created at: {new Date(post.createdAt).toLocaleString()}</p>}
            {comments.length > 0 ? (
                <>
                    <h2>Comments</h2>
                    {comments.map((comment) => (
                        <div key={comment._id}>
                            <p>{comment.content}</p>
                            {comment.author && <p>Author: {comment.author.name}</p>}
                            {comment.createdAt && <p>Created at: {new Date(comment.createdAt).toLocaleString()}</p>}
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