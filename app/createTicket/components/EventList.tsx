import React, { useEffect, useState } from 'react';
import CardGroup from '@components/Card/CardGroup';
import EventCard from '@components/Card/EventCard';
import { EventApi } from 'api';

interface Event {
  id: number;
  title: string;
  startDate: Date;
  endDate: Date;
  venueName: string;
  image: string;
  status: string;
}

interface EventListProps {
  organizerId?: number; // Optional if you want to fetch events by organizer
}

const EventList = ({ organizerId }: EventListProps) => {
  const [events, setEvents] = useState<Event[]>([]);
  const page = 1;
  const pageSize = 10; // Adjust pageSize as needed
  console.log(events);
  useEffect(() => {
    const fetchEvents = async () => {
      const eventApi = new EventApi();
      try {
        const response = await eventApi.apiEventOrganizerOrganizerIdGet(
          Number(organizerId),
          page,
          pageSize
        );

        //@ts-ignore
        setEvents(response.data.data.listData);
      } catch (error) {
        console.error('Failed to fetch events', error);
      }
    };

    fetchEvents();
  }, [organizerId]);

  return (
    <>
      {events.length > 0 && (
        <CardGroup url='list' title='Events' color='orange' background='gray'>
          {events.map((event) => (
            <EventCard
              key={event.id}
              url={String(event.id)}
              color='orange'
              when={new Date(event.startDate).toLocaleDateString()}
              name={event.title}
              venue={event.venueName}
              image={event.image}
              status={event.status}
            />
          ))}
        </CardGroup>
      )}
    </>
  );
};

export default EventList;
