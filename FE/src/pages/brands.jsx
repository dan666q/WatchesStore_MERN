import React, { useEffect, useState } from 'react';
import {
  Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Snackbar, Alert,
  Dialog, DialogActions, DialogContent, DialogTitle, TextField
} from '@mui/material';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Brands = () => {
  const [brands, setBrands] = useState([]);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [brandName, setBrandName] = useState('');
  const [editBrandName, setEditBrandName] = useState('');
  const [brandToDelete, setBrandToDelete] = useState(null);
  const [brandToEdit, setBrandToEdit] = useState(null);

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    try {
      const token = localStorage.getItem('token');

      const response = await axios.get('http://localhost:3000/brands/getAllBrands', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      setBrands(response.data);
    } catch (error) {
      console.error('Error fetching brands:', error);
      setErrorMsg('Failed to fetch brands. Please try again later.');
    }
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('token');

      await axios.delete(`http://localhost:3000/brands/delete/${brandToDelete}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      setSuccessMsg('Brand deleted successfully.');
      fetchBrands(); // Refresh brands after deletion
      handleCloseConfirmDialog();
    } catch (error) {
      console.error('Error deleting brand:', error);
      setErrorMsg('Failed to delete brand. Please try again later.');
    }
  };

  const handleAddBrand = async () => {
    try {
      const token = localStorage.getItem('token');

      await axios.post('http://localhost:3000/brands/createNewBrand', { brandName }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      setSuccessMsg('Brand added successfully.');
      fetchBrands(); // Refresh brands after addition
      handleCloseAddDialog();
    } catch (error) {
      console.error('Error adding brand:', error);
      setErrorMsg('Failed to add brand. Please try again later.');
    }
  };

  const handleEditBrand = async () => {
    try {
      const token = localStorage.getItem('token');

      await axios.put(`http://localhost:3000/brands/edit/${brandToEdit}`, { brandName: editBrandName }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      setSuccessMsg('Brand updated successfully.');
      fetchBrands(); // Refresh brands after editing
      handleCloseEditDialog();
    } catch (error) {
      console.error('Error editing brand:', error);
      setErrorMsg('Failed to edit brand. Please try again later.');
    }
  };

  const handleOpenAddDialog = () => {
    setOpenAddDialog(true);
  };

  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
    setBrandName('');
  };

  const handleOpenEditDialog = (brand) => {
    setBrandToEdit(brand._id);
    setEditBrandName(brand.brandName);
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setEditBrandName('');
    setBrandToEdit(null);
  };

  const handleOpenConfirmDialog = (id) => {
    setBrandToDelete(id);
    setOpenConfirmDialog(true);
  };

  const handleCloseConfirmDialog = () => {
    setOpenConfirmDialog(false);
    setBrandToDelete(null);
  };

  const handleSnackbarClose = () => {
    setSuccessMsg('');
    setErrorMsg('');
  };

  return (
    <Container>
      <Typography className='mt-5' variant="h4" align="center" gutterBottom>
        Brands Management
      </Typography>

      <Button variant="contained" color="primary" onClick={handleOpenAddDialog} style={{ marginBottom: 20 }}>
        Add Brand
      </Button>

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

      <TableContainer component={Paper} sx={{ maxWidth: 300, margin: 'auto' }}  >
        <Table >
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
                  <Button onClick={() => handleOpenEditDialog(brand)} variant="contained" color="secondary" style={{ marginRight: 10 }}>
                    <i className="fas fa-edit" style={{ marginRight: 5 }}></i> Edit
                  </Button>
                  <Button onClick={() => handleOpenConfirmDialog(brand._id)} variant="contained" color="error">
                    <i className="fas fa-trash-alt" style={{ marginRight: 5 }}></i> Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openAddDialog} onClose={handleCloseAddDialog}>
        <DialogTitle>Add New Brand</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Brand Name"
            type="text"
            fullWidth
            value={brandName}
            onChange={(e) => setBrandName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleAddBrand} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openEditDialog} onClose={handleCloseEditDialog}>
        <DialogTitle>Edit Brand</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Brand Name"
            type="text"
            fullWidth
            value={editBrandName}
            onChange={(e) => setEditBrandName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleEditBrand} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openConfirmDialog} onClose={handleCloseConfirmDialog}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this brand?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Brands;
