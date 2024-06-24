import React, { useEffect, useState } from 'react';
import axios from 'axios';
import WatchCard from '../components/watchCard';

export default function Home() {
  const [watches, setWatches] = useState([]);

  useEffect(() => {
    axios.get('https://api.example.com/watches') // Replace with your API URL
      .then(response => {
        setWatches(response.data);
      })
      .catch(error => {
        console.error('Error fetching the watches data:', error);
      });
  }, []);

  return (
    <div>
      <div className='title'>
        <h1 className='mt-5 text-center'>Welcome to DWatches</h1>
      </div>
      <div className='row mt-5'>
        {watches.map((watch, index) => (
          <div key={index} className='col-md-4'>
            <WatchCard watch={watch} />
          </div>
        ))}
      </div>
    </div>
  );
}
