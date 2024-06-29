import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Container, Grid, Typography, CircularProgress, Box, TextField, Button } from '@mui/material';
import Rating from '@mui/material/Rating';
import { jwtDecode } from 'jwt-decode'; // Ensure the correct import path for jwt-decode

export default function WatchDetail() {
    const { id } = useParams();
    const [watch, setWatch] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [newComment, setNewComment] = useState({ rating: 0, comment: '' });
    const [isAdmin, setIsAdmin] = useState(false);
    const [hasCommented, setHasCommented] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const decodedToken = jwtDecode(token);
            setIsAdmin(decodedToken.isAdmin == true);
        }

        axios.get(`http://localhost:3000/watches/getWatchById/${id}`)
            .then(response => {
                setWatch(response.data.watch);
                setLoading(false);

                if (token) {
                    const decodedToken = jwtDecode(token);
                    const userId = decodedToken.id;
                    const userHasCommented = response.data.watch.comments.some(comment => comment.author?._id === userId);
                    setHasCommented(userHasCommented);
                }
            })
            .catch(err => {
                setError('Failed to fetch watch details');
                setLoading(false);
            });
    }, [id]);

    const handleCommentChange = (event) => {
        const { name, value } = event.target;
        setNewComment({ ...newComment, [name]: value });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const token = localStorage.getItem('token');
        axios.post(`http://localhost:3000/watches/${id}/comment`, newComment, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            // After successfully adding comment, reload watch details
            return axios.get(`http://localhost:3000/watches/getWatchById/${id}`);
        })
        .then(response => {
            setWatch(response.data.watch); // Update watch details with new comments
            setNewComment({ rating: 0, comment: '' });
        })
        .catch(err => {
            setError('Failed to submit comment');
        });
    };

    if (loading) {
        return (
            <Container maxWidth="sm" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
                <CircularProgress />
            </Container>
        );
    }

    if (error) {
        return (
            <Container maxWidth="sm" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
                <Typography variant="h6" color="error">{error}</Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 5, mb: 5 }}>
            <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                    <img
                        src={watch.image}
                        alt={watch.name}
                        style={{ width: '100%', borderRadius: '8px' }}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <Typography variant="h3" gutterBottom>{watch.name}</Typography>
                    <Typography variant="h4" color="text.secondary" gutterBottom>${watch.price}</Typography>
                    <Typography variant="body1" color="text.secondary" gutterBottom><strong>Brand:</strong> {watch.brand?.brandName}</Typography>
                    <Typography variant="body1" color="text.secondary" gutterBottom><strong>Automatic:</strong> {watch.isAutomatic ? 'Yes' : 'No'}</Typography>
                    <Typography variant="body1" color="text.secondary" gutterBottom>{watch.description}</Typography>
                    
                    <Box sx={{ mt: 4 }}>
                        <Typography variant="h5" gutterBottom>Comments</Typography>
                        {watch.comments.map((comment, index) => (
                            <Box key={index} sx={{ mb: 2, borderBottom: '1px solid #e0e0e0', pb: 2 }}>
                                <Rating name="read-only" value={comment.rating} readOnly />
                                <Typography variant="body2"><strong>Comment:</strong> {comment.comment}</Typography>
                                <Typography variant="body2"><strong>Author:</strong> {comment.author?.name}</Typography>
                                <Typography variant="body2"><strong>Time:</strong> {new Date(comment.createdAt).toLocaleString()}</Typography>
                            </Box>
                        ))}
                    </Box>

                    {!isAdmin && !hasCommented && (
                        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 4 }}>
                            <Typography variant="h5" gutterBottom>Add a Comment</Typography>
                            <Rating
                                name="rating"
                                value={newComment.rating}
                                onChange={(event, newValue) => {
                                    setNewComment({ ...newComment, rating: newValue });
                                }}
                                required
                            />
                            <TextField
                                label="Comment"
                                name="comment"
                                value={newComment.comment}
                                onChange={handleCommentChange}
                                multiline
                                rows={4}
                                fullWidth
                                sx={{ mt: 2 }}
                                required
                            />
                            <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
                                Submit
                            </Button>
                        </Box>
                    )}
                </Grid>
            </Grid>
        </Container>
    );
}
