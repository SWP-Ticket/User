'use client';
import React, { useEffect, useState } from 'react';
import Loader from '@components/Loader/Loader';
import Master from '@components/Layout/Master';
import Section from '@components/Section/Section';
import Heading from '@components/Heading/Heading';
import EventDetail from './components/EventDetail';
import EventLists from './components/EventList';
import { EventApi } from 'api';

interface EventDetail {
  id: number;
  title: string;
  description: string;
  organizerName: string;
  venueName: string;
  startDate: Date;
  endDate: Date;
  image: string;
  status: string;
  hasTickets: boolean;
}

const Page = (): React.JSX.Element => {
  const [event, setEvent] = useState<EventDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [role, setRole] = useState<string>('');
  const [showCreateTicket, setShowCreateTicket] = useState<boolean>(false);
  const organizerId = sessionStorage.getItem('id');
  useEffect(() => {
    const fetchEventDetails = async () => {
      const urlSegments = window.location.pathname.split('/');
      const id = urlSegments[urlSegments.length - 1];
      const eventApi = new EventApi();

      try {
        const response = await eventApi.apiEventIdGet(Number(id));
        //@ts-ignore
        setEvent(response.data.data);
      } catch (error) {
        console.error('Failed to fetch event details', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchUserRole = () => {
      const userRole = sessionStorage.getItem('role') || '';
      setRole(userRole);
      if (userRole === 'Organizer' && event && !event.hasTickets) {
        setShowCreateTicket(true);
      }
    };

    fetchEventDetails();
    fetchUserRole();
  }, [event]);

  if (loading) {
    return <Loader type='inline' color='gray' text='Loading event details...' />;
  }

  if (!event) {
    return <p>Event not found</p>;
  }

  return (
    <Master>
      <EventDetail event={event} showCreateTicket={showCreateTicket} />
      <EventLists organizerId={Number(organizerId)} />
    </Master>
  );
};

export default Page;
