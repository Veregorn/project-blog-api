import React, { useEffect, useState } from 'react';
import api from '../services/api';
import '../styles/Home.css';
import { Link } from 'react-router-dom';

function Home({ user }) {
    const [posts, setPosts] = useState([]);

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

        loadPosts();
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
            {posts.map((post) => (
                <div className='post-title-container' key={post._id}>
                    <Link to={`/post/${post._id}`} className='post-title'>{post.title}</Link>
                    {(user.isLoggedIn && user.type === 'admin' && !post.published) &&
                        <span className='unpublished'>Unpublished</span>
                    }
                </div>
            ))}
        </div>
    );
}

export default Home;