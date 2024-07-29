import '../styles/Header.css'
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import logo from '../logo.svg';
import { Chip } from '@mui/material';
import { Login, Logout, AccountCircle } from '@mui/icons-material';

function Header({ user, handleLogout }) {
    return (
        <header>
            <div id='logo-container'>
                <img src={logo} alt='logo' style={{ width: '50px', height: '50px' }} />
                <h4><Link to={'/'} className='title'>Blog Example</Link></h4>
            </div>
            <div id='nav-container'>
                {/* We will show the Log in and Sign up links only if the user is not logged in*/}
                {/* We will show the Log out link and a Welcome message only if the user is logged in*/}
                {user.isLoggedIn ? (
                    <>
                        <p className='welcome-message'>Welcome {user.name}!</p>
                        {/* Display a 'New Post' button only if the user is an admin */}
                        {user.type === 'admin' && <Button variant="contained" component={Link} to={'/new-post'}>New Post</Button>}
                        <Chip
                            label="Log out"
                            onClick={handleLogout}
                            icon={<Logout />}
                            variant='outlined'
                            clickable
                        />
                    </>
                ) : (
                    <>
                        <Chip
                            label="Log in"
                            component="a"
                            href='/login'
                            icon={<Login />}
                            variant='outlined'
                            clickable
                        />
                        <Chip
                            label="Sign up"
                            component="a"
                            href='/signup'
                            icon={<AccountCircle />}
                            variant='outlined'
                            clickable
                        />
                    </>
                )}
            </div>
        </header>
    );
}

export default Header;