import '../styles/Signup.css'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Button from '@mui/material/Button';
import { TextField } from '@mui/material';

function Signup() {
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate(); // We need to use the useHistory hook to redirect the user

    async function handleSubmit(event) {
        event.preventDefault();

        try {
            const type = 'user';
            await api.post('/api/users', { name: name, email: email, password: password, type: type });
            navigate('/login'); // Redirect the user to the login page
        } catch (error) {
            console.log('Error signing up', error);
            setError('Error signing up. Please try again.');
        }
    };

    return (
        <div className='main'>
            <h2>Sign up</h2>
            <form onSubmit={handleSubmit}>
                <TextField
                    label="Name"
                    variant="outlined"
                    type='text'
                    id='name'
                    name='name'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <TextField
                    label="Email"
                    variant="outlined"
                    type='email'
                    id='email'
                    name='email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <TextField
                    label="Password"
                    variant="outlined"
                    type='password'
                    id='password'
                    name='password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <Button variant="contained" type='submit'>Sign up</Button>
            </form>
            {error && <p className='error'>{error}</p>}
        </div>
    )
}

export default Signup;