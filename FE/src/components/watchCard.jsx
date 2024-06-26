import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';
import { Link } from 'react-router-dom';

export default function WatchCard({ watch }) {
  return (
    <Card
      sx={{
        maxWidth: 345,
        margin: 'auto',
        mb: 5,
        '&:hover': {
          '.MuiTypography-root': {
            color: 'gray',
          },
        },
      }}
    >
      <CardActionArea component={Link} to={`/watchDetail/${watch._id}`}>
        <CardMedia
          component="img"
          height="140"
          image={watch.image}
          alt="image"
          className='mt-4 mb-4'
        />
        <CardContent className='text-center'>
          <Typography
            gutterBottom
            sx={{ height: '40px' }}
            variant="h5"
            component="div"
            className='fw-bold'
          >
            {watch.name}
          </Typography>
          <Typography>
            {watch.brand?.brandName}
          </Typography>
          <Typography
            gutterBottom
            variant="h6"
            component="div"
            sx={{ marginTop: '20px' }}
          >
            ${watch.price}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
