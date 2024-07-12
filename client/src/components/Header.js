import '../styles/Header.css'
import { Link } from 'react-router-dom';

function Header({ loggedIn, handleLogin, handleLogout }) {
    return (
        <header>
            <h1><Link to={'/'} className='title'>Blog Example</Link></h1>
            <div id='nav-container'>
                {/* We will show the Log in and Sign up links only if the user is not logged in*/}
                {/* We will show the Log out link and a Welcome message only if the user is logged in*/}
                {loggedIn ? (
                    <>
                        <p className='welcome-message'>Welcome!</p>
                        <a href='/logout' className='nav-link' onClick={handleLogout}>Log out</a>
                    </>
                ) : (
                    <>
                        <a href='/login' className='nav-link'>Log in</a>
                        <a href='/signup' className='nav-link'>Sign up</a>
                    </>
                )}
            </div>
        </header>
    );
}

export default Header;