import React, { useEffect, useState } from 'react';
import axios from 'axios';
import WatchCard from '../components/watchCard'; // Ensure the correct path and casing

export default function Home() {
  const [watches, setWatches] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredWatches, setFilteredWatches] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3000/getAllWatch') // Replace with your API URL
      .then(response => {
        console.log('API response:', response.data);
        if (response.data && Array.isArray(response.data.watches)) {
          setWatches(response.data.watches);
          setFilteredWatches(response.data.watches);
        } else {
          console.error('API response does not contain watches array:', response.data);
          setWatches([]);
          setFilteredWatches([]);
        }
      })
      .catch(error => {
        console.error('Error fetching the watches data:', error);
        setWatches([]);
        setFilteredWatches([]);
      });
  }, []);

  const handleSearchChange = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    filterWatches(query);
  };

  const filterWatches = (query) => {
    if (!query) {
      setFilteredWatches(watches);
    } else {
      const filtered = watches.filter(watch => 
        watch.name.toLowerCase().includes(query)
      );
      setFilteredWatches(filtered);
    }
  };

  return (
    <div>
      <div className='title'>
        <h1 className='mt-5 text-center'>Welcome to DWatches</h1>
      </div>
      <div className='search-bar text-center mt-3'>
        <input
          type='text'
          placeholder='Search for a watch...'
          value={searchQuery}
          onChange={handleSearchChange}
          className='form-control'
          style={{ maxWidth: '400px', margin: '0 auto' }}
        />
      </div>
      <div className='row mt-5'>
        {filteredWatches.map((watch) => (
          <div className='col-md-4 col-sm-6 col-xs-12' key={watch._id}>
            <WatchCard watch={watch} />
          </div>
        ))}
      </div>
    </div>
  );
}
