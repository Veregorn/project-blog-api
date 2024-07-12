import '../styles/Login.css'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function Login({ handleLogin }) {
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate(); // We need to use the useHistory hook to redirect the user

    async function handleSubmit(event) {
        event.preventDefault();

        try {
            const response = await api.post('/api/auth/login', { name, password });
            localStorage.setItem('token', response.data.token); // Save the token in localStorage
            handleLogin(name); // Call the handleLogin function from the App component
            navigate('/'); // Redirect the user to the home page
        } catch (error) {
            console.log('Error logging in', error);
            setError('Error logging in. Please try again.');
        }
    };

    return (
        <div className='main'>
            <h2>Log in</h2>
            <form onSubmit={handleSubmit}>
                <div className='form-group'>
                    <label htmlFor='name'>Name:</label>
                    <input
                        type='text'
                        id='name'
                        name='name'
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <div className='form-group'>
                    <label htmlFor='password'>Password:</label>
                    <input
                        type='password'
                        id='password'
                        name='password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button type='submit'>Log in</button>
            </form>
            {error && <p className='error'>{error}</p>}
        </div>
    )
}

export default Login;