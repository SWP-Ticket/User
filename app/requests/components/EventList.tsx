// app/requests/components/EventList.tsx
import React from 'react';
import Link from 'next/link';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
} from '@mui/material';

interface Event {
  id: number;
  title: string;
  description: string | null;
  staffId: number;
  staffName: string | null;
  venueId: number;
  venueName: string;
  startDate: string;
  endDate: string;
  imageUrl: string;
  status: string;
}

interface EventListProps {
  events: Event[];
}

const EventList: React.FC<EventListProps> = ({ events }) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <Typography variant='h5' sx={{ display: 'flex', justifyContent: 'center' }}>
                Title
              </Typography>
            </TableCell>
            <TableCell>
              <Typography variant='h5' sx={{ display: 'flex', justifyContent: 'center' }}>
                Description
              </Typography>
            </TableCell>
            <TableCell>
              <Typography variant='h5' sx={{ display: 'flex', justifyContent: 'center' }}>
                Status
              </Typography>
            </TableCell>
            <TableCell>
              <Typography variant='h5' sx={{ display: 'flex', justifyContent: 'center' }}>
                Image
              </Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {events.map((event) => (
            <TableRow key={event.id}>
              <TableCell>
                <Box display={'flex'} justifyContent={'center'}>
                  <Link href={`/requests/${event.id}`} passHref>
                    <p style={{ textDecoration: 'none', color: 'inherit' }}>{event.title}</p>
                  </Link>
                </Box>
              </TableCell>
              <TableCell sx={{ width: 1000 }}>
                {event.description || 'No description available'}
              </TableCell>
              <TableCell>{event.status}</TableCell>
              <TableCell>
                <Box display={'flex'} justifyContent={'center'}>
                  <img
                    src={event.imageUrl}
                    alt={event.title}
                    style={{ width: 'auto', height: '100px', objectFit: 'cover' }}
                  />
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default EventList;
