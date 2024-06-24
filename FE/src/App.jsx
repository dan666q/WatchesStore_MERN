import './App.css';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/home'
import Navigation from './components/navbar';
import WatchDetail from './pages/watchDetail'


function App() {
  
  return (
    <div className="App">
     <Navigation></Navigation>
     <div className='container'>
        <Routes>
          <Route path='/' element={<Home />}> </Route>
          <Route path='/watchDetail' element={<WatchDetail />}> </Route>

          
        </Routes>
        </div>
    </div>
  );
}

export default App;
