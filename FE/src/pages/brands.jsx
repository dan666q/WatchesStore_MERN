import React, { useEffect, useState } from 'react';
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Snackbar, Alert } from '@mui/material';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Brands = () => {
  const [brands, setBrands] = useState([]);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    try {
      const response = await axios.get('http://localhost:3000/brands/getAllBrands'); // Adjust API endpoint as per your backend
      setBrands(response.data);
    } catch (error) {
      console.error('Error fetching brands:', error);
      setErrorMsg('Failed to fetch brands. Please try again later.');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/brands/${id}`); // Adjust API endpoint for delete
      setSuccessMsg('Brand deleted successfully.');
      fetchBrands(); // Refresh brands after deletion
    } catch (error) {
      console.error('Error deleting brand:', error);
      setErrorMsg('Failed to delete brand. Please try again later.');
    }
  };

  const handleSnackbarClose = () => {
    setSuccessMsg('');
    setErrorMsg('');
  };

  return (
    <Container>
      <Typography variant="h4" align="center" gutterBottom>
        Brands Management
      </Typography>

      {successMsg && (
        <Snackbar open={!!successMsg} autoHideDuration={6000} onClose={handleSnackbarClose}>
          <Alert onClose={handleSnackbarClose} severity="success">
            {successMsg}
          </Alert>
        </Snackbar>
      )}

      {errorMsg && (
        <Snackbar open={!!errorMsg} autoHideDuration={6000} onClose={handleSnackbarClose}>
          <Alert onClose={handleSnackbarClose} severity="error">
            {errorMsg}
          </Alert>
        </Snackbar>
      )}

      <TableContainer component={Paper} style={{ marginTop: 20 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {brands.map((brand) => (
              <TableRow key={brand._id}>
                <TableCell>{brand.brandName}</TableCell>
                <TableCell>
                  <Button component={Link} to={`/edit/${brand._id}`} variant="contained" color="secondary" style={{ marginRight: 10 }}>
                    <i className="fas fa-edit" style={{ marginRight: 5 }}></i> Edit
                  </Button>
                  <Button onClick={() => handleDelete(brand._id)} variant="contained" color="error">
                    <i className="fas fa-trash-alt" style={{ marginRight: 5 }}></i> Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default Brands;
