import React, { useState, useEffect } from 'react';
import {
  Container, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Snackbar, Alert, FormControl, InputLabel, Select, MenuItem, Checkbox, FormControlLabel,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, CircularProgress, DialogContentText,
  Typography
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import axios from 'axios';

const WatchManager = () => {
  const [watches, setWatches] = useState([]);
  const [categories, setCategories] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ brand: '', name: '', image: '', price: '', description: '', isAutomatic: false });
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentWatchId, setCurrentWatchId] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [watchToDelete, setWatchToDelete] = useState(null);

  useEffect(() => {
    fetchWatches();
    fetchCategories();
  }, []);

  const fetchWatches = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        setErrorMsg('Token not found');
        setLoading(false);
        return;
      }
      const response = await axios.get('http://localhost:3000/watches/manageWatch', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setWatches(Array.isArray(response.data.watches) ? response.data.watches : []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching watches:', error);
      setErrorMsg('Failed to fetch watches');
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setErrorMsg('Token not found');
        return;
      }
      const response = await axios.get('http://localhost:3000/brands/getAllBrands', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setCategories(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setErrorMsg('Failed to fetch brands');
    }
  };

  const handleOpen = () => {
    setIsEdit(false);
    setForm({ brand: '', name: '', image: '', price: '', description: '', isAutomatic: false });
    setOpen(true);
  };
  
  const handleEditOpen = (watch) => {
    setIsEdit(true);
    setCurrentWatchId(watch._id);
    setForm({
      brand: watch.brand._id,
      name: watch.name,
      image: watch.image,
      price: watch.price,
      description: watch.description,
      isAutomatic: watch.isAutomatic
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setForm({ brand: '', name: '', image: '', price: '', description: '', isAutomatic: false });
    setCurrentWatchId(null);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        setErrorMsg('Token not found');
        setLoading(false);
        return;
      }
      if (isEdit) {
        await axios.put(`http://localhost:3000/watches/edit/${currentWatchId}`, form, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setSuccessMsg('Watch updated successfully');
      } else {
        await axios.post('http://localhost:3000/watches/manageWatch', form, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setSuccessMsg('Watch added successfully');
      }
      fetchWatches();
      handleClose();
    } catch (error) {
      console.error('Error saving watch:', error);
      setErrorMsg(isEdit ? 'Failed to update watch' : 'Failed to add watch');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id) => {
    setWatchToDelete(id);
    setOpenDeleteDialog(true);
  };

  const confirmDelete = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        setErrorMsg('Token not found');
        setLoading(false);
        return;
      }
      await axios.delete(`http://localhost:3000/watches/delete/${watchToDelete}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setSuccessMsg('Watch deleted successfully');
      fetchWatches();
    } catch (error) {
      console.error('Error deleting watch:', error);
      setErrorMsg('Failed to delete watch');
    } finally {
      setLoading(false);
      setOpenDeleteDialog(false);
      setWatchToDelete(null);
    }
  };

  return (
    <Container style={{ padding: '1rem', minHeight: '850px' }}>
        <Typography variant="h4" component="h1" align="center" className="mb-4 mt-5">
        Watches Management
      </Typography>
      <Button variant="contained" color="primary" onClick={handleOpen} className="mb-3 mt-3">Add New Watch</Button>

      {loading ? (
        <CircularProgress style={{ margin: 'auto' }} />
      ) : (
        <TableContainer component={Paper} className="mb-5">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Image</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Brand</TableCell>
                <TableCell>Automatic</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {watches.length > 0 ? (
                watches.map((watch) => (
                  <TableRow key={watch._id}>
                    <TableCell>{watch.name}</TableCell>
                    <TableCell><img src={watch.image} alt={watch.name} style={{ width: '100px' }} /></TableCell>
                    <TableCell>{watch.price}</TableCell>
                    <TableCell>{watch.description}</TableCell>
                    <TableCell>{watch.brand ? watch.brand.brandName : ''}</TableCell>
                    <TableCell>{watch.isAutomatic ? 'Yes' : 'No'}</TableCell>
                    <TableCell>
                      <IconButton color="secondary" onClick={() => handleEditOpen(watch)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton color="error" onClick={() => handleDelete(watch._id)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} align="center">No watches available</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{isEdit ? 'Edit Watch' : 'Add New Watch'}</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <FormControl fullWidth margin="normal">
              <InputLabel id="brand-label">Brand</InputLabel>
              <Select
                labelId="brand-label"
                id="brand"
                name="brand"
                value={form.brand}
                onChange={handleChange}
                required
              >
                {categories.length > 0 ? (
                  categories.map((brand) => (
                    <MenuItem key={brand._id} value={brand._id}>{brand.brandName}</MenuItem>
                  ))
                ) : (
                  <MenuItem value="">No brands available</MenuItem>
                )}
              </Select>
            </FormControl>
            <TextField
              margin="normal"
              label="Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              fullWidth
              required
            />
            <TextField
              margin="normal"
              label="Image URL"
              name="image"
              value={form.image}
              onChange={handleChange}
              fullWidth
              required
              pattern="^(http|https):\/\/.*(jpeg|jpg|png|gif|bmp)$"
            />
            <TextField
              margin="normal"
              label="Price"
              name="price"
              type="number"
              value={form.price}
              onChange={handleChange}
              fullWidth
              required
            />
            <TextField
              margin="normal"
              label="Description"
              name="description"
              value={form.description}
              onChange={handleChange}
              fullWidth
              required
              multiline
              rows={3}
            />
            <FormControlLabel
              control={<Checkbox checked={form.isAutomatic} onChange={handleChange} name="isAutomatic" />}
              label="Automatic"
            />
            <DialogActions>
              <Button onClick={handleClose} color="primary">Cancel</Button>
              <Button type="submit" color="primary">{isEdit ? 'Update' : 'Save'}</Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Delete"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this watch?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={confirmDelete} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={!!successMsg} autoHideDuration={3000} onClose={() => setSuccessMsg('')}>
        <Alert onClose={() => setSuccessMsg('')} severity="success">{successMsg}</Alert>
      </Snackbar>
      <Snackbar open={!!errorMsg} autoHideDuration={3000} onClose={() => setErrorMsg('')}>
        <Alert onClose={() => setErrorMsg('')} severity="error">{errorMsg}</Alert>
      </Snackbar>
    </Container>
  );
};

export default WatchManager;
