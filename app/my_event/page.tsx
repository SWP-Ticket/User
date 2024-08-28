'use client';
import Footer from '@components/Footer/Footer';
import Header from '@components/Header/Header';
import { Box, Button, Chip, Pagination, Typography } from '@mui/material';
import { EventApi } from 'api';
import React, { useEffect, useState } from 'react';
import UpdateIcon from '@mui/icons-material/Update';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import UpdatingEventModal from './component/UpdateModal';

const statuColor: {
  [key: string]: 'default' | 'success' | 'primary' | 'secondary' | 'error' | 'info' | 'warning';
} = {
  Cancel: 'warning',
  Pending: 'secondary',
  Active: 'success',
  OnGoing: 'primary',
  Ended: 'error',
};
const handleChange = (event, value) => {
  setPage(value);
  // Trigger data fetch or any other action when page changes
};
const Page: React.FC = () => {
  const [organizerId] = useState(+sessionStorage.getItem('id')!);
  const [eventList, setEventList] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  useEffect(() => {
    const fetchEventList = async () => {
      const eventAPI = new EventApi();
      const eventList = await eventAPI.apiEventOrganizerOrganizerIdGet(organizerId, page, pageSize);
      //@ts-ignore
      setEventList(eventList.data.data.listData);
      //@ts-ignore
      setTotalPages(eventList.data.data.totalPage);
    };
    fetchEventList();
  }, [organizerId, page, pageSize]);

  return (
    <>
      <Header />
      <Typography
        variant='h3'
        gutterBottom
        display={'flex'}
        justifyContent={'center'}
        alignItems={'center'}
        marginY={3}
      >
        {'My event list'.toLocaleUpperCase()}
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>Title</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Description</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Staff Name</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Venue Name</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Start Date</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>End Date</TableCell>
              <TableCell sx={{ fontWeight: 700 }} style={{ textAlign: 'center' }}>
                Image
              </TableCell>
              <TableCell sx={{ fontWeight: 700 }} style={{ textAlign: 'center' }}>
                Status
              </TableCell>
              <TableCell sx={{ fontWeight: 700 }} style={{ textAlign: 'center' }}>
                Ticket Price
              </TableCell>
              <TableCell sx={{ fontWeight: 700 }} style={{ textAlign: 'center' }}>
                Ticket Quantity
              </TableCell>
              <TableCell sx={{ fontWeight: 700 }} style={{ textAlign: 'center' }}>
                Action
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {eventList.map((row: any) => (
              <TableRow key={row.id}>
                <TableCell>{row.title}</TableCell>
                <TableCell>{row.description}</TableCell>
                <TableCell>{row.staffName}</TableCell>
                <TableCell>{row.venueName}</TableCell>
                <TableCell>{new Date(row.startDate).toLocaleString()}</TableCell>
                <TableCell>{new Date(row.endDate).toLocaleString()}</TableCell>
                <TableCell>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <img
                      src={row.imageUrl}
                      alt={row.title}
                      width='50'
                      style={{ display: 'grid', placeItems: 'center' }}
                    />
                  </div>
                </TableCell>
                <TableCell style={{ textAlign: 'center' }}>
                  <Chip
                    label={row.status}
                    color={statuColor[row.status]}
                    sx={{ '& .MuiChip-label': { fontSize: '0.875rem', fontWeight: 'bold' } }}
                  />
                </TableCell>
                <TableCell style={{ textAlign: 'center' }}>{row.ticket.price}</TableCell>
                <TableCell style={{ textAlign: 'center' }}>{row.ticket.quantity}</TableCell>
                <TableCell style={{ textAlign: 'center' }}>
                  <UpdatingEventModal />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box
        sx={{
          width: 'auto',
          borderRadius: 2,
          paddingTop: 2,
          paddingBottom: 3,
          bgcolor: 'Window',
          marginTop: 3,
          display: 'grid',
          placeItems: 'center',
        }}
      >
        <Pagination page={page} count={totalPages} color='primary' onChange={handleChange} />
      </Box>
      <Footer />
    </>
  );
};

export default Page;
