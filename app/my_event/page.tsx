'use client';
import Footer from '@components/Footer/Footer';
import Header from '@components/Header/Header';
import { Box, Chip, Pagination, Typography } from '@mui/material';
import { EventApi, UserApi, VenueApi } from 'api';
import React, { useEffect, useState } from 'react';
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
import Master from '@components/Layout/Master';

const statuColor: {
  [key: string]: 'default' | 'success' | 'primary' | 'secondary' | 'error' | 'info' | 'warning';
} = {
  Ready: 'info',
  Cancelled: 'warning',
  Pending: 'secondary',
  Active: 'success',
  OnGoing: 'primary',
  Ended: 'error',
};

const Page: React.FC = () => {
  const [organizerId] = useState(+sessionStorage.getItem('id')!);
  const [eventList, setEventList] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [venueList, setVenueList] = useState<[]>([]);
  const [staffList, setStaffList] = useState<[]>([]);

  useEffect(() => {
    const fetchAllVenue = async () => {
      const venueAPI = new VenueApi();
      const venueResponse = await venueAPI.apiVenueGet(1, 1000);
      //@ts-ignore
      return venueResponse.data.data.listData;
    };
    const fetchAllStaff = async () => {
      const staffAPI = new UserApi();
      const staffResponse = await staffAPI.apiUserStaffGet(1, 1000);
      //@ts-ignore
      return staffResponse.data.data.listData;
    };
    (async () => {
      try {
        const [venueList, staffList] = await Promise.all([fetchAllVenue(), fetchAllStaff()]);
        setVenueList(venueList);
        setStaffList(staffList);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    })();
  }, []);

  useEffect(() => {
    const fetchEventList = async () => {
      const eventAPI = new EventApi();
      const eventList = await eventAPI.apiEventOrganizerOrganizerIdGet(organizerId);
      //@ts-ignore
      setEventList(eventList.data.data.listData);
      //@ts-ignore
      setTotalPages(eventList.data.data.totalPage);
    };
    fetchEventList();
  }, [organizerId]);

  const handlePageChange = async (_event: React.ChangeEvent<unknown>, page: number) => {
    const eventAPI = new EventApi();
    const eventList = await eventAPI.apiEventOrganizerOrganizerIdGet(organizerId, page);
    //@ts-ignore
    setEventList(eventList.data.data.listData);
    //@ts-ignore
    setTotalPages(eventList.data.data.totalPage);
    setPage(page);
  };

  const handleUpdate = async () => {
    const eventAPI = new EventApi();
    const eventList = await eventAPI.apiEventOrganizerOrganizerIdGet(organizerId, page);
    //@ts-ignore
    setEventList(eventList.data.data.listData);
    //@ts-ignore
    setTotalPages(eventList.data.data.totalPage);
  };

  return (
    <Master>
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
                <TableCell style={{ textAlign: 'center' }}>{row.ticket?.price}</TableCell>
                <TableCell style={{ textAlign: 'center' }}>{row.ticket?.quantity}</TableCell>
                <TableCell style={{ textAlign: 'center' }}>
                  <UpdatingEventModal
                    venueList={venueList}
                    staffList={staffList}
                    eventId={row.id}
                    onUpdate={handleUpdate}
                  />
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
        <Pagination count={totalPages} color='primary' onChange={handlePageChange} />
      </Box>
    </Master>
  );
};

export default Page;
