import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Typography
} from '@mui/material';

const Account = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3000/accounts/getAllAccount', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setAccounts(response.data);
      } catch (err) {
        setError('Failed to fetch accounts');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAccounts();
  }, []);

  if (loading) {
    return (
      <Container style={{ padding: '2rem', textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container style={{ padding: '2rem', textAlign: 'center' }}>
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Container>
    );
  }

  return (
    <Container style={{ padding: '2rem' }}>
      <Typography variant="h4" component="h1" align="center" className="mb-4">
        List of Users
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Username</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>YOB</TableCell>
              <TableCell>Admin</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {accounts.map((account) => (
              <TableRow key={account._id}>
                <TableCell>{account.username}</TableCell>
                <TableCell>{account.name}</TableCell>
                <TableCell>{account.YOB}</TableCell>
                <TableCell>{account.isAdmin ? 'Yes' : 'No'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default Account;
