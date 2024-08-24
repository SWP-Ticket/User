// app/requests/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import EventList from './components/EventList'; // Adjust the import path as necessary
import { Box, Typography, Pagination, CircularProgress } from '@mui/material';
import { EventApi } from 'api';
import Header from '@components/Header/Header';
import Footer from '@components/Footer/Footer';

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

const Page: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [page, setPage] = useState<number>(1);
  const [pageSize] = useState<number>(10); // Set the page size
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchAndSetEvents = async (page: number, pageSize: number) => {
    const organizerId = sessionStorage.getItem('id');
    if (organizerId) {
      try {
        setLoading(true);
        const eventApi = new EventApi();
        const eventsData = await eventApi.apiEventOrganizerOrganizerIdGet(
          Number(organizerId),
          page,
          pageSize
        );
        //@ts-ignore
        setEvents(eventsData.data.data.listData);
        //@ts-ignore
        setTotalPages(eventsData.data.data.totalPage);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchAndSetEvents(page, pageSize);
  }, [page]);

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  return (
    <div>
      <Header />
      <Box>
        <Typography variant='h3' gutterBottom display={'flex'} justifyContent={'center'}>
          My Event List
        </Typography>
      </Box>
      {loading ? (
        <Box display='flex' justifyContent='center' alignItems='center'>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <EventList events={events} />
          <Box display='flex' justifyContent='center' marginTop={2} marginBottom={5}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={handlePageChange}
              color='primary'
            />
          </Box>
        </>
      )}
      <Footer />
    </div>
  );
};

export default Page;
