import React, { useEffect, useState } from 'react';
import { Container, Typography, Grid, Button, Snackbar, Alert, TextField } from '@mui/material';
import axios from 'axios';

const Profile = () => {
  const [user, setUser] = useState({});
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successPasswordMsg, setSuccessPasswordMsg] = useState('');
  const [errorPasswordMsg, setErrorPasswordMsg] = useState('');
  const [errorPassword, setErrorPassword] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    YOB: ''
  });
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });

  const currentYear = new Date().getFullYear();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await axios.get('http://localhost:3000/profile', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setUser(response.data.user || {}); // Ensure user is an object, or default to empty object
      setFormData({
        name: response.data.user ? response.data.user.name : '',
        username: response.data.user ? response.data.user.username : '',
        YOB: response.data.user ? response.data.user.YOB.toString() : ''
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      setErrorMsg('Failed to fetch profile. Please try again later.');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form fields
    if (!validateForm()) {
      return;
    }

    try {
      const response = await axios.post('http://localhost:3000/profile', formData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setSuccessMsg('Profile updated successfully.');
      setUser(response.data.user || {}); // Update user data or default to empty object
      setFormData({
        name: response.data.user ? response.data.user.name : '',
        username: response.data.user ? response.data.user.username : '',
        YOB: response.data.user ? response.data.user.YOB.toString() : ''
      });
      setTimeout(() => {
        setSuccessMsg('');
        window.location.reload(); // Reload the page after a short delay
      }, 2000); // Adjust the delay as needed
    } catch (error) {
      console.error('Error updating profile:', error);
      setErrorMsg('Failed to update profile. Please try again later.');
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    // Validate password form fields
    if (!validatePasswordForm()) {
      return;
    }

    try {
      const response = await axios.post('http://localhost:3000/profile/change-password', passwordData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setSuccessPasswordMsg('Password changed successfully.');
      setPasswordData({
        oldPassword: '',
        newPassword: '',
        confirmNewPassword: ''
      });
      setTimeout(() => {
        setSuccessPasswordMsg('');
        window.location.reload(); // Reload the page after a short delay
      }, 2000); // Adjust the delay as needed
    } catch (error) {
      console.error('Error changing password:', error);
      setErrorPasswordMsg('Failed to change password. Please try again later.');
      if (error.response && error.response.data.errors) {
        setErrorPassword(error.response.data.errors);
      }
    }
  };

  const validateForm = () => {
    let isValid = true;
    setErrorMsg(''); // Clear previous errors

    // Validate username
    if (formData.username.length <= 6) {
      setErrorMsg('Username must be more than 6 characters.');
      isValid = false;
    }

    // Validate name
    if (!formData.name) {
      setErrorMsg('Please enter your name.');
      isValid = false;
    }

    // Validate year of birth
    if (!formData.YOB || isNaN(formData.YOB) || formData.YOB < 1900 || formData.YOB > currentYear) {
      setErrorMsg(`Please enter a valid year of birth between 1900 and ${currentYear}.`);
      isValid = false;
    }

    return isValid;
  };

  const validatePasswordForm = () => {
    let isValid = true;
    setErrorPasswordMsg(''); // Clear previous errors
    setErrorPassword([]); // Clear array of errors

    // Validate old password
    if (!passwordData.oldPassword) {
      setErrorPasswordMsg('Please enter your old password.');
      isValid = false;
    }

    // Validate new password
    if (!passwordData.newPassword) {
      setErrorPasswordMsg('Please enter a new password.');
      isValid = false;
    }

    // Validate confirm new password
    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      setErrorPasswordMsg('New passwords do not match.');
      isValid = false;
    }

    return isValid;
  };

  const handleSnackbarClose = () => {
    setSuccessMsg('');
    setErrorMsg('');
    setSuccessPasswordMsg('');
    setErrorPasswordMsg('');
    setErrorPassword([]);
  };

  return (
    <Container>
      <Typography variant="h4" align="center" gutterBottom className='mt-5'>
        Profile
      </Typography>

      <Grid container spacing={3} justifyContent="center">
        <Grid item xs={12} sm={6}>
          <div className="card mb-3">
            <div className="card-header">
              <p className="card-header-title">User Information</p>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-4">
                  <img src="https://media-cdn-v2.laodong.vn/storage/newsportal/2022/12/19/1128874/Messi-World-Cup.jpg" alt="Profile" className="img-fluid" />
                </div>
                <div className="col-md-8">
                  <Typography variant="subtitle1">
                    <span className="icon"><i className="fa fa-user"></i></span> Name: {user.name || ''}
                  </Typography>
                  <Typography variant="subtitle1">
                    <span className="icon"><i className="fa fa-envelope"></i></span> Username: {user.username || ''}
                  </Typography>
                  <Typography variant="subtitle1">
                    <span className="icon"><i className="fa fa-calendar"></i></span> Year of Birth: {user.YOB || ''}
                  </Typography>
                </div>
              </div>
            </div>
          </div>

          {successMsg && (
            <Alert severity="success" onClose={handleSnackbarClose}>
              {successMsg}
            </Alert>
          )}

          {errorMsg && (
            <Alert severity="error" onClose={handleSnackbarClose}>
              {errorMsg}
            </Alert>
          )}

          <div className="card mb-3">
            <div className="card-header">
              <p className="card-header-title">Edit Profile</p>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <TextField
                    id="name"
                    name="name"
                    label="Name"
                    variant="outlined"
                    value={formData.name}
                    onChange={handleChange}
                    fullWidth
                    required
                  />
                </div>
                <div className="mb-3">
                  <TextField
                    id="username"
                    name="username"
                    label="Username"
                    variant="outlined"
                    value={formData.username}
                    onChange={handleChange}
                    fullWidth
                    disabled
                  />
                </div>
                <div className="mb-3">
                  <TextField
                    id="YOB"
                    name="YOB"
                    label="Year of Birth"
                    variant="outlined"
                    value={formData.YOB}
                    onChange={handleChange}
                    type="number"
                    InputProps={{ inputProps: { min: 1900, max: currentYear } }}
                    fullWidth
                    required
                  />
                </div>
                <Button type="submit" variant="contained" color="primary">
                  Submit
                </Button>
              </form>
            </div>
          </div>
        </Grid>

        <Grid item xs={12} sm={6}>
          <div className="card mb-3">
            <div className="card-header">
              <p className="card-header-title">Change Password</p>
            </div>
            <div className="card-body">
              <form onSubmit={handlePasswordSubmit}>
                <div className="mb-3">
                  <TextField
                    id="oldPassword"
                    name="oldPassword"
                    label="Old Password"
                    variant="outlined"
                    value={passwordData.oldPassword}
                    onChange={handlePasswordChange}
                    type="password"
                    fullWidth
                    required
                  />
                </div>
                <div className="mb-3">
                  <TextField
                    id="newPassword"
                    name="newPassword"
                    label="New Password"
                    variant="outlined"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    type="password"
                    fullWidth
                    required
                  />
                </div>
                <div className="mb-3">
                  <TextField
                    id="confirmNewPassword"
                    name="confirmNewPassword"
                    label="Confirm New Password"
                    variant="outlined"
                    value={passwordData.confirmNewPassword}
                    onChange={handlePasswordChange}
                    type="password"
                    fullWidth
                    required
                  />
                </div>
                <Button type="submit" variant="contained" color="primary">
                  Change Password
                </Button>
              </form>
            </div>
          </div>

          {successPasswordMsg && (
            <Alert severity="success" onClose={handleSnackbarClose}>
              {successPasswordMsg}
            </Alert>
          )}

          {errorPasswordMsg && (
            <Alert severity="error" onClose={handleSnackbarClose}>
              {errorPasswordMsg}
            </Alert>
          )}

          {errorPassword.length > 0 && (
            <Alert severity="error" onClose={handleSnackbarClose}>
              {errorPassword.map((err, index) => (
                <div key={index}>{err.msg}</div>
              ))}
            </Alert>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default Profile;
