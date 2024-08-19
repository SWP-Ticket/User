'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router'; // Import useRouter to get the event ID from the URL
import Loader from '@components/Loader/Loader';
import { EventApi } from 'api';

// Import components
import Master from '@components/Layout/Master';
import Section from '@components/Section/Section';
import Heading from '@components/Heading/Heading';
import EventCard from '@components/Card/EventCard';
import CardGroup from '@components/Card/CardGroup';
import TicketForm from './components/TicketForm';
import Link from 'next/link';
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
  image: string;
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
  image: string;
  status: string;
}

const Page = (): React.JSX.Element => {
  const [event, setEvent] = useState<EventDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [otherEvents, setOtherEvents] = useState<eventList[]>([]);

  const urlSegments = window.location.pathname.split('/');
  const id = urlSegments[urlSegments.length - 1];
  const page = 1; // Specify the page number
  const pageSize = 5; // Specify the number of events per page
  const searchTerm = ''; // Specify the search term, if any

  useEffect(() => {
    const fetchEventDetails = async () => {
      if (!id) return; // Ensure the ID is available

      const eventApi = new EventApi();
      try {
        const response = await eventApi.apiEventIdGet(Number(id));
        //@ts-ignore
        setEvent(response.data); // Assuming the response contains event details
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
  }, [id]);

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
            backgroundImage: `url(${event.image})`,
          }}
          className='event-cover cover-image flex flex-v-center flex-h-center'
        />
        <div className='cover-info'>
          <div
            style={{
              backgroundImage: `url(${event.image})`,
            }}
            className='cover-image image'
          />
          <Heading type={1} color='white' text={event.title} />
          <Heading type={5} color='white' text={new Date(event.startDate).toLocaleDateString()} />
          <Heading type={6} color='white' text={event.venueName} />
        </div>
      </div>
      <Section className='white-background'>
        <div className='container'>
          <div className='event-details'>
            <div>
              <Heading type={4} color='gray' text='Event details' />
              <div className='paragraph-container gray'>
                <p>{event.description}</p>
              </div>
            </div>
            <div>
              <div className='ticket-box'>
                <div className='ticket-box-header'>
                  <Heading type={4} color='gray' text='Tickets' />
                </div>
                <TicketForm
                  data={[
                    {
                      id: 1,
                      name: 'Family',
                      price: '£10',
                      ordering: 1,
                      soldout: true,
                    },
                    {
                      id: 2,
                      name: 'Adult',
                      price: '£20',
                      ordering: 2,
                    },
                    {
                      id: 3,
                      name: 'Child',
                      price: '£30',
                      ordering: 3,
                      information: 'Information about child tickets',
                    },
                  ]}
                />
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Section className='white-background'>
        <div className='container'>
          <Heading type={4} color='gray' text={event.venueName} />

          <Heading type={6} color='gray' text='Address' />
          <div className='paragraph-container'>
            <p className='gray'>Lorem ipsum dolor sit amet consecteteur adispicing elit.</p>
          </div>
          <Heading type={6} color='gray' text='How to get there?' />
          <div className='paragraph-container'>
            <p className='gray'>Lorem ipsum dolor sit amet consecteteur adispicing elit.</p>
          </div>
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
            image={ev.image}
            status={ev.status}
          />
        ))}
      </CardGroup>
    </Master>
  );
};

export default Page;
