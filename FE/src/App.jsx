import './App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Home from './pages/home';
import Navigation from './components/navbar';
import WatchDetail from './pages/watchDetail';
import Login from './pages/login';
import Register from './pages/register';
import Brands from './pages/brands';
import Profile from './pages/profile';
import WatchManager from './pages/watchManager';
import Account from './pages/account';

function App() {
  const [isAdmin, setIsAdmin] = useState(false); // State to track admin status

  useEffect(() => {
    // Fetch isAdmin status from localStorage or backend upon login
    const storedIsAdmin = localStorage.getItem('isAdmin');
    if (storedIsAdmin) {
      setIsAdmin(JSON.parse(storedIsAdmin));
    }
  }, []);

  return (
    <div className="App">
      <Navigation />
      <div className='container'>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/home' element={<Home />} />
          <Route path='/watchDetail/:id' element={<WatchDetail />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          {isAdmin ? (
            <>
              <Route path='/watch' element={<WatchManager />} />
              <Route path='/brand' element={<Brands />} />
              <Route path='/account' element={<Account />} />
            </>
          ) : (
            <>
              <Route path='/watch' element={<Navigate to="/"/>} />
              <Route path='/brand' element={<Navigate to="/"/>} />
              <Route path='/account' element={<Navigate to="/"/>} />
            </>
          )}
          <Route path='/profile' element={<Profile />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
