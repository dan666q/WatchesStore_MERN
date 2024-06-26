import React, { useEffect, useState } from 'react';
import axios from 'axios';
import WatchCard from '../components/watchCard'; // Ensure the correct path and casing

export default function Home() {
  const [watches, setWatches] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3000/getAllWatch') // Replace with your API URL
      .then(response => {
        console.log('API response:', response.data);
        if (response.data && Array.isArray(response.data.watches)) {
          setWatches(response.data.watches);
        } else {
          console.error('API response does not contain watches array:', response.data);
          setWatches([]); // Ensure watches is always an array
        }
      })
      .catch(error => {
        console.error('Error fetching the watches data:', error);
        setWatches([]); // Ensure watches is always an array
      });
  }, []);

  return (
    <div>
      <div className='title'>
        <h1 className='mt-5 text-center'>Welcome to DWatches</h1>
      </div>
      <div className='row mt-5'>
        {watches.map((watch) => (
          <div className='col-md-4 col-sm-6 col-xs-12' key={watch._id}>
            <WatchCard watch={watch} />
          </div>
        ))}
      </div>
    </div>
  );
}
