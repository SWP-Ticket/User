// app/requests/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import EventList from './components/EventList'; // Adjust the import path as necessary
import { Box, Typography } from '@mui/material';
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

  const fetchAndSetEvents = async () => {
    const organizerId = sessionStorage.getItem('id');
    if (organizerId) {
      try {
        const eventApi = new EventApi();
        const eventsData = await eventApi.apiEventOrganizerOrganizerIdGet(Number(organizerId));
        //@ts-ignore
        setEvents(eventsData.data.data.listData);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    }
  };

  useEffect(() => {
    fetchAndSetEvents();
  }, []);

  return (
    <div>
      <Header />
      <Box>
        <Typography variant='h3' gutterBottom display={'flex'} justifyContent={'center'}>
          Event List
        </Typography>
      </Box>
      <EventList events={events} />
      <Footer />
    </div>
  );
};

export default Page;
