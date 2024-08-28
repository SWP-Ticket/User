'use client';

import React, { useEffect, useState, type FormEvent } from 'react';

// hooks
import useAlert from '@hooks/useAlert';

// components
import Button from '@components/Button/Button';
import Loader from '@components/Loader/Loader';
import { TicketApi } from 'api';
import { Typography } from '@mui/material';

// interfaces
interface ITicket {
  id: number;
  price: number;
  eventId: number;
  quantity: number;
  ticketSaleEndDate: string;
}

interface IProps {
  eventId: number;
}

const TicketForm = ({ eventId }: IProps): React.JSX.Element => {
  const { showAlert, hideAlert } = useAlert();

  const [loading, setLoading] = useState<boolean>(true);
  const [tickets, setTickets] = useState<ITicket[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Fetch ticket data
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const ticketApi = new TicketApi();
        const response = await ticketApi.apiTicketEventEventIdGet(Number(eventId));

        // @ts-ignore
        setTickets(response.data.data);
        setError(null);
      } catch (error) {
        console.error('Error fetching tickets:', error);
        if (!error) {
          setError('Failed to fetch tickets');
          showAlert({ type: 'error', text: 'Fail to show ticket' });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [eventId, showAlert]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    hideAlert();
    setLoading(true);

    // Assume you have selected a ticket, you need to pass its details to the /buy page
    const selectedTicket = tickets.find((ticket) => ticket.quantity > 0);
    if (selectedTicket) {
      const queryParams = new URLSearchParams({
        ticketId: selectedTicket.id.toString(),
        eventId: selectedTicket.eventId.toString(),
        price: selectedTicket.price.toString(),
        quantity: selectedTicket.quantity.toString(),
        saleEnd: selectedTicket.ticketSaleEndDate,
      }).toString();

      window.location.href = `/buy?${queryParams}`;
    } else {
      showAlert({ type: 'error', text: 'No tickets available' });
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader type='inline' color='gray' text='Loading tickets...' />;
  }

  return (
    <form noValidate onSubmit={handleSubmit}>
      <div className='ticket-box-content'>
        {tickets.length > 0 ? (
          tickets.map((ticket) => (
            <div
              key={ticket.id}
              style={{
                display: 'flex',
                flexDirection: 'column',
                padding: '16px',
                marginBottom: '16px',
                border: '1px solid #ddd',
                borderRadius: '8px',
                backgroundColor: '#f9f9f9',
                transition: 'box-shadow 0.3s ease-in-out',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)')
              }
              onMouseOut={(e) => (e.currentTarget.style.boxShadow = 'none')}
            >
              <Typography style={{ marginBottom: '8px', fontWeight: 500, fontSize: '1rem' }}>
                Price: {ticket.price}
              </Typography>
              <Typography style={{ marginBottom: '8px', fontWeight: 500, fontSize: '1rem' }}>
                Quantity: {ticket.quantity}
              </Typography>
              {ticket.quantity === 0 && (
                <p
                  style={{
                    color: '#ff4c4c',
                    fontWeight: 'bold',
                    fontSize: '1rem',
                    textAlign: 'center',
                    marginTop: '8px',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    backgroundColor: '#ffe0e0',
                  }}
                >
                  Sold Out
                </p>
              )}
            </div>
          ))
        ) : (
          <p>No tickets available for this event.</p>
        )}
      </div>
      <div className='ticket-box-buttons'>
        {tickets.length > 0 && tickets.some((ticket) => ticket.quantity > 0) ? (
          <Button type='submit' color='blue-filled' text='Buy tickets' rightIcon='arrow_forward' />
        ) : (
          <Button type='submit' color='disabled' text='Tickets not found or Sold Out' />
        )}
      </div>
    </form>
  );
};

export default TicketForm;
