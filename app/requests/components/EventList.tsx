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
            <TableCell>Title</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Image</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {events.map((event) => (
            <TableRow key={event.id}>
              <TableCell>
                <Link href={`/requests/${event.id}`} passHref>
                  <p style={{ textDecoration: 'none', color: 'inherit' }}>{event.title}</p>
                </Link>
              </TableCell>
              <TableCell>{event.description || 'No description available'}</TableCell>
              <TableCell>{event.status}</TableCell>
              <TableCell>
                <img
                  src={event.imageUrl}
                  alt={event.title}
                  style={{ width: '100px', height: 'auto' }}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default EventList;
