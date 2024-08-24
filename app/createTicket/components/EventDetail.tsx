import React from 'react';
import Section from '@components/Section/Section';
import Heading from '@components/Heading/Heading';
import TicketForm from '../../event/[url]/components/TicketForm';

interface EventDetailProps {
  event: {
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
  };
  showCreateTicket: boolean;
}

const EventDetail = ({ event, showCreateTicket }: EventDetailProps) => {
  const handleCreateTicketClick = () => {
    window.location.href = `/create-ticket/${event.id}`;
  };

  return (
    <>
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
          <Heading type={4} color='white' text={'to'} />
          <Heading type={5} color='white' text={new Date(event.endDate).toLocaleDateString()} />
          <Heading type={6} color='white' text={event.venueName} />
          <Heading type={6} color='white' text={event.status} />
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
                {showCreateTicket ? (
                  <button onClick={handleCreateTicketClick}>Create Ticket</button>
                ) : (
                  <TicketForm eventId={event.id} />
                )}
              </div>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
};

export default EventDetail;
