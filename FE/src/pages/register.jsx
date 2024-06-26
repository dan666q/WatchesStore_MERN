import React, { useState } from 'react';
import { Container, Box, Card, CardContent, Typography, TextField, Button, Snackbar, Alert } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [YOB, setYOB] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  // Validation function
  const validateForm = () => {
    let isValid = true;

    // Clear previous errors
    setError('');

    // Validate username
    if (username.length <= 6) {
      setError('Username must be more than 6 characters.');
      isValid = false;
    }

    // Validate name
    if (!name) {
      setError('Please enter your name.');
      isValid = false;
    }

    // Validate year of birth
    const currentYear = new Date().getFullYear();
    if (!YOB || isNaN(YOB) || YOB < 1900 || YOB > currentYear) {
      setError(`Please enter a valid year of birth between 1900 and ${currentYear}.`);
      isValid = false;
    }

    // Validate password
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      isValid = false;
    }

    // Validate confirm password
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      isValid = false;
    }

    return isValid;
  };

  // Form submission handler
  const handleSubmit = async (event) => {
    event.preventDefault();
    const isValid = validateForm();

    if (isValid) {
      try {
        const response = await axios.post('http://localhost:3000/register', {
          username,
          name,
          YOB,
          password,
        });

        if (response.status === 201) {
          setSuccessMessage(response.data.message);
          setSnackbarOpen(true);
          navigate('/login');
        }
      } catch (error) {
        if (error.response && error.response.data && error.response.data.message) {
          setError(error.response.data.message);
        } else {
          setError('An error occurred. Please try again.');
        }
      }
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Box display="flex" justifyContent="center" alignItems="center">
        <Card sx={{ p: 4, width: '100%' }}>
          <CardContent>
            <Typography variant="h4" align="center" gutterBottom>
              Welcome to DWATCHES
            </Typography>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            <form onSubmit={handleSubmit}>
              <TextField
                label="Username"
                variant="outlined"
                fullWidth
                margin="normal"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <TextField
                label="Name"
                variant="outlined"
                fullWidth
                margin="normal"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <TextField
                label="Year of Birth"
                variant="outlined"
                fullWidth
                margin="normal"
                type="number"
                value={YOB}
                onChange={(e) => setYOB(e.target.value)}
                required
              />
              <TextField
                label="Password"
                type="password"
                variant="outlined"
                fullWidth
                margin="normal"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <TextField
                label="Confirm Password"
                type="password"
                variant="outlined"
                fullWidth
                margin="normal"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <Button type="submit" variant="contained" color="secondary" fullWidth sx={{ mt: 2 }}>
                Register
              </Button>
            </form>
            <Box textAlign="center" mt={2}>
              <Typography variant="body2">
                Already have an account? <a href="/login">Login</a>
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
          {successMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
}
