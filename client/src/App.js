import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import Header from './components/Header';
import Footer from './components/Footer';
import PostDetail from './components/PostDetail';
import NewPost from './components/NewPost';
import api from './services/api';

function App() {
  // We need to save the save the state about the user being logged in or not
  // We can do this by using the useState hook
  const [user, setUser] = React.useState({ isLoggedIn: false, name: '', id: '' });

  function handleLogin(name) {
    // Take user id from the database
    api.get('/api/users').then((response) => {
      const user = response.data.find((user) => user.name === name);
      setUser({ isLoggedIn: true, name: name, id: user._id, type: user.type });
    });
  }

  function handleLogout() {
    localStorage.removeItem('token'); // Remove the token from localStorage
    setUser({ isLoggedIn: false, name: '' });
  }

  return (
    <Router>
      <div className="App">
        <Header user={user} handleLogout={handleLogout} />
        <Routes>
          <Route path="/login" element={<Login handleLogin={handleLogin} />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<Home user={user} />} />
          <Route path="/post/:id" element={<PostDetail user={user} />} />
          <Route path="/new-post" element={<NewPost />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
