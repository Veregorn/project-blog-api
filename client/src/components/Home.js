import React, { useEffect, useState } from 'react';
import api from '../services/api';
import '../styles/Home.css';

function Home() {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        async function loadPosts() {
            try {
                const response = await api.get('/api/posts');
                setPosts(response.data);
            } catch (error) {
                console.log('Error loading posts', error);
            }
        }

        loadPosts();
    }, []);

    return (
        <div className='main'>
            {posts.map((post) => (
                <div className='post-title-container' key={post._id}>
                    <a href='./'>{post.title}</a>
                </div>
            ))}
        </div>
    );
}

export default Home;