import '../styles/Header.css'
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import logo from '../logo.svg';
import { Chip } from '@mui/material';
import { Login, Logout, AccountCircle } from '@mui/icons-material';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import Hero from './Hero';
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

function Header({ user, handleLogout }) {

    const navigate = useNavigate(); // We need to use the useHistory hook to redirect the user

    async function handleGeneratePosts() {
        try {
            const response = await api.post('/api/posts/ai-generate');
            console.log(response.data);
            navigate('/'); // Redirect the user to the login page
        }
        catch (error) {
            console.log('Error generating posts', error);
        }
    };

    return (
        <header>
            <div id="top-header">
                <div id='logo-container'>
                    <img src={logo} alt='logo' style={{ width: '50px', height: '50px' }} />
                    <h4><Link to={'/'} className='title'>DevNews en Español</Link></h4>
                </div>
                <div id='nav-container'>
                    {/* We will show the Log in and Sign up links only if the user is not logged in*/}
                    {/* We will show the Log out link and a Welcome message only if the user is logged in*/}
                    {user.isLoggedIn ? (
                        <>
                            <p className='welcome-message'>Welcome {user.name}!</p>
                            {/* Display a 'New Post' button only if the user is an admin */}
                            {user.type === 'admin' && <Button variant="contained" component={Link} to={'/new-post'}>New Post</Button>}
                            {user.type === 'admin' && <Button variant="contained" onClick={handleGeneratePosts}>Generate Posts</Button>}
                            <Chip
                                label="Log out"
                                onClick={handleLogout}
                                icon={<Logout />}
                                clickable
                                sx={{ 
                                    backgroundColor: 'white',
                                    '&:hover': {
                                        backgroundColor: theme.palette.grey.main,
                                        color: 'black',
                                    }
                                }}
                            />
                        </>
                    ) : (
                        <>
                            <Chip
                                label="Log in"
                                component="a"
                                href='/login'
                                icon={<Login />}
                                clickable
                                sx={{ 
                                    backgroundColor: 'white',
                                    '&:hover': {
                                        backgroundColor: theme.palette.grey.main,
                                        color: 'black',
                                    }
                                }}
                            />
                            <Chip
                                label="Sign up"
                                component="a"
                                href='/signup'
                                icon={<AccountCircle />}
                                clickable
                                sx={{ 
                                    backgroundColor: 'white',
                                    '&:hover': {
                                        backgroundColor: theme.palette.grey.main,
                                        color: 'black',
                                    }
                                }}
                            />
                        </>
                    )}
                </div>
            </div>
            <div id='bottom-header'>
                <Hero />
            </div>
        </header>
    );
}

export default Header;