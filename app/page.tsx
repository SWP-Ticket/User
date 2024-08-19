'use client';
import React, { useEffect, useState } from 'react';
import Master from '@components/Layout/Master';
import Section from '@components/Section/Section';
import Heading from '@components/Heading/Heading';
import EventCard from '@components/Card/EventCard';
import CardGroup from '@components/Card/CardGroup';
import FormSearch from 'app/home/components/FormSearch';
import { EventApi } from 'api';
import { useRouter } from 'next/navigation';
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
const Page = (): React.JSX.Element => {
  const [events, setEvents] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const router = useRouter();
  const handleEventClick = (id: number) => {
    router.push(`/events/${id}`); // Navigate to the event detail page with the event ID
  };
  const pageSize = 5;
  useEffect(() => {
    const fetchEvents = async () => {
      const eventApi = new EventApi();
      const response: any = await eventApi.apiEventGet(page, pageSize, searchTerm);
      const data = response.data as APIResponse<paginationResponse<eventList>>;
      setEvents(response.data.data.listData);
    };

    fetchEvents();
  }, [searchTerm, page]);

  return (
    <Master>
      <Section className='white-background'>
        <div className='container'>
          <div className='center'>
            <Heading type={1} color='gray' text='Discover your journey' />
            <p className='gray'>Buying ticket without worrying about creating an account</p>
          </div>
        </div>

        <div className='center'>
          <div className='container'>
            <div className='top-search'>
              <FormSearch setSearchTerm={setSearchTerm} />
            </div>
          </div>
        </div>
      </Section>

      <CardGroup url='list' title='Latest events' color='blue' background='gray'>
        {events.map((event) => (
          <EventCard
            key={event.id}
            url={String(event.id)}
            color='blue'
            when={new Date(event.startDate).toLocaleString()}
            name={event.title}
            venue={event.venueName}
            image={event.image}
            status={event.status}
          />
        ))}
      </CardGroup>
    </Master>
  );
};

export default Page;
