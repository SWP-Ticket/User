'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Loader from '@components/Loader/Loader';
import { EventApi } from 'api';

// Import components
import Master from '@components/Layout/Master';
import Section from '@components/Section/Section';
import Heading from '@components/Heading/Heading';
import EventCard from '@components/Card/EventCard';
import CardGroup from '@components/Card/CardGroup';
import TicketForm from './components/TicketForm';
import { Typography } from '@mui/material';

interface paginationResponse<T> {
  page: number;
  totalPage: number;
  totalRecords: number;
  listData: T[];
}

interface eventList {
  id: number;
  title: string;
  description: string;
  organizerId: number;
  organizerName: string;
  venueId: number;
  venueName: string;
  startDate: Date;
  endDate: Date;
  imageURL: string;
  status: string;
}

interface APIResponse<T> {
  data: T;
  success: boolean;
  message: string;
  error: string;
  hint: string;
  priceTotal: number;
  errorMessages: string[];
}

interface EventDetail {
  id: number;
  title: string;
  description: string;
  organizerName: string;
  venueName: string;
  startDate: Date;
  endDate: Date;
  imageURL: string;
  status: string;
  host: string;
  presenter: string;
}

const Page = (): React.JSX.Element => {
  const [event, setEvent] = useState<EventDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [otherEvents, setOtherEvents] = useState<eventList[]>([]);
  const userRole = sessionStorage.getItem('role');
  const token = sessionStorage.getItem('token');
  const page = 1; // Specify the page number
  const pageSize = 100; // Specify the number of events per page
  console.log(token);
  useEffect(() => {
    const urlSegments = window.location.pathname.split('/');
    const id = urlSegments[urlSegments.length - 1];
    const fetchEventDetails = async () => {
      if (!id) return; // Ensure the ID is available

      const eventApi = new EventApi();
      try {
        const response = await eventApi.apiEventIdGet(Number(id));
        //@ts-ignore

        //@ts-ignore
        setEvent(response.data.data); // Assuming the response contains event details
      } catch (error) {
        console.error('Failed to fetch event details', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchEvents = async () => {
      const eventApi = new EventApi();
      try {
        const response: any = await eventApi.apiEventGet(page, pageSize);
        const data = response.data as APIResponse<paginationResponse<eventList>>;

        setOtherEvents(data.data.listData);
      } catch (error) {
        console.error('Failed to fetch other events', error);
      }
    };

    fetchEventDetails();
    fetchEvents();
  }, []);

  if (loading) {
    return <Loader type='inline' color='gray' text='Loading event details...' />;
  }

  if (!event) {
    return <p>Event not found</p>;
  }

  return (
    <Master>
      <div className='blur-cover'>
        <div
          style={{
            backgroundImage: `url(${event.imageURL})`,
          }}
          className='event-cover cover-image flex flex-v-center flex-h-center'
        />
        <div className='cover-info'>
          <div
            style={{
              backgroundImage: `url(${event.imageURL})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              width: '150px',
              height: '150px',
              borderRadius: '50%',
              margin: '0 auto',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
            }}
            className='cover-image image'
          />
          <Heading type={1} color='white' text={event.title} />
          <Heading
            type={5}
            color='white'
            text={`from ${new Date(event.startDate).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
              hour12: true, // This ensures AM/PM notation
            })} to ${new Date(event.endDate).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
              hour12: true, // This ensures AM/PM notation
            })}`}
          />

          <Heading type={6} color='white' text={event.venueName} />
          <Heading type={6} color='white' text={event.status} />
        </div>
      </div>
      <Section className='white-background'>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '40px' }}>
            <div style={{ flex: 1 }}>
              <Typography variant='h5' style={{ fontWeight: '500', color: '#333' }}>
                Host: <span style={{ color: '#FF5722' }}>{event.host}</span> <br /> Presenter:{' '}
                <span style={{ color: '#FF5722' }}>{event.presenter}</span>
              </Typography>
              <Heading type={4} color='gray' text='Event details' />
              <div style={{ marginTop: '10px', color: '#666', lineHeight: '1.6' }}>
                <p>{event.description}</p>
              </div>
            </div>
            <div style={{ flex: 1 }}>
              {!token && (
                <div
                  style={{
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    padding: '20px',
                    backgroundColor: '#f9f9f9',
                  }}
                >
                  <div
                    style={{
                      borderBottom: '1px solid #ddd',
                      paddingBottom: '10px',
                      marginBottom: '10px',
                    }}
                  >
                    <Heading type={4} color='gray' text='Tickets' />
                  </div>
                  <TicketForm eventId={event.id} />
                </div>
              )}
            </div>
          </div>
        </div>
      </Section>

      <Section className='white-background'>
        <div className='container'>
          <Heading type={4} color='gray' text={`Location:` + ' ' + event.venueName} />
        </div>
      </Section>

      <CardGroup url='list' title='Other events' color='orange' background='gray'>
        {otherEvents.map((ev) => (
          <EventCard
            key={ev.id}
            url={String(ev.id)}
            color='orange'
            when={new Date(ev.startDate).toLocaleDateString()}
            name={ev.title}
            venue={ev.venueName}
            image={ev.imageURL}
            status={ev.status}
          />
        ))}
      </CardGroup>
    </Master>
  );
};

export default Page;
