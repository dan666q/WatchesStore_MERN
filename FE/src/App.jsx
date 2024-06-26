import './App.css';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/home'
import Navigation from './components/navbar';
import WatchDetail from './pages/watchDetail'
import Login from './pages/login';
import Register from './pages/register';
import Brands from './pages/brands';


function App() {
  
  return (
    <div className="App">
     <Navigation></Navigation>
     <div className='container'>
        <Routes>
          <Route path='/' element={<Home />}> </Route>
          <Route path='/home' element={<Home />}> </Route>
          <Route path='/watchDetail/:id' element={<WatchDetail />}> </Route>
          <Route path='/login' element={<Login />}> </Route>
          <Route path='/register' element={<Register />}> </Route>
          <Route path='/brand' element={<Brands />}> </Route>

        </Routes>
        </div>
    </div>
  );
}

export default App;
