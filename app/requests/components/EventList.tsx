// components/EventList.tsx
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
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
              <TableCell>{event.title}</TableCell>
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
