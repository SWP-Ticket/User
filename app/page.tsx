'use client';
import React, { useCallback, useEffect, useState } from 'react';
import Master from '@components/Layout/Master';
import Section from '@components/Section/Section';
import Heading from '@components/Heading/Heading';
import EventCard from '@components/Card/EventCard';
import CardGroup from '@components/Card/CardGroup';
import FormSearch from 'app/home/components/FormSearch';
import { EventApi } from 'api';

const Page = (): React.JSX.Element => {
  const [events, setEvents] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(100);
  const [loading, setLoading] = useState<boolean>(true);
  console.log(events);
  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      const eventApi = new EventApi();
      const response: any = await eventApi.apiEventGet(page, 100, searchTerm);
      const data = response.data;
      setEvents(data.data.listData);
      setTotalPages(data.totalPage);
    } catch (error) {
      console.error('Failed to fetch events:', error);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, page]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

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

      <CardGroup url='list' title='All event' color='blue' background='gray'>
        {events.map((event) => (
          <EventCard
            key={event.id}
            url={String(event.id)}
            color='blue'
            when={new Date(event.startDate).toLocaleString()}
            name={event.title}
            venue={event.venueName}
            image={event.imageURL}
            status={event.status}
            ticket={
              event.ticket
                ? {
                    price: event.ticket.price,
                    quantity: event.ticket.quantity,
                  }
                : { price: 0, quantity: 0 }
            } // Fallback in case ticket is missing
          />
        ))}
      </CardGroup>
    </Master>
  );
};

export default Page;
