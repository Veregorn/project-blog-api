import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import Header from './components/Header';
import Footer from './components/Footer';
import PostDetail from './components/PostDetail';

function App() {
  // We need to save the save the state about the user being logged in or not
  // We can do this by using the useState hook
  // We will create a new state variable called loggedIn
  // The initial value of loggedIn will be false
  // We will also create two functions handleLogin and handleLogout
  const [loggedIn, setLoggedIn] = React.useState(false);

  function handleLogin() {
    setLoggedIn(true);
  }

  function handleLogout() {
    localStorage.removeItem('token'); // Remove the token from localStorage
    setLoggedIn(false);
  }

  return (
    <Router>
      <div className="App">
        <Header loggedIn={loggedIn} handleLogin={handleLogin} handleLogout={handleLogout} />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<Home />} />
          <Route path="/post/:id" element={<PostDetail />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
