import '../styles/Header.css'
import { Link } from 'react-router-dom';

function Header({ user, handleLogout }) {
    return (
        <header>
            <h1><Link to={'/'} className='title'>Blog Example</Link></h1>
            <div id='nav-container'>
                {/* We will show the Log in and Sign up links only if the user is not logged in*/}
                {/* We will show the Log out link and a Welcome message only if the user is logged in*/}
                {user.isLoggedIn ? (
                    <>
                        <p className='welcome-message'>Welcome {user.name}!</p>
                        <a href='/' onClick={handleLogout} className='navbar-elem'>Log out</a>
                    </>
                ) : (
                    <>
                        <Link to={'/login'} className='navbar-elem'>Log in</Link>
                        <Link to={'/signup'} className='navbar-elem'>Sign up</Link>
                    </>
                )}
            </div>
        </header>
    );
}

export default Header;