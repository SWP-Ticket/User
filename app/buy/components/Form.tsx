'use client';

import React, { useState, type FormEvent } from 'react';
import { useSearchParams } from 'next/navigation';

// hooks
import useAlert from '@hooks/useAlert';

// components
import Input from '@components/Form/Input';
import Button from '@components/Button/Button';
import Loader from '@components/Loader/Loader';
import Heading from '@components/Heading/Heading';

// interfaces
interface IAttendeeDetails {
  name: string;
  email: string;
  phone: string;
}

const BuyTicket = (): React.JSX.Element => {
  const { showAlert, hideAlert } = useAlert();
  const searchParams = useSearchParams();

  const [loading, setLoading] = useState<boolean>(false);
  const [attendeeDetails, setAttendeeDetails] = useState<IAttendeeDetails>({
    name: '',
    email: '',
    phone: '',
  });

  const handleAttendeeChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;

    setAttendeeDetails({
      ...attendeeDetails,
      [name]: value,
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    hideAlert();
    setLoading(true);

    const payload = {
      registrationDate: new Date().toISOString(),
      ticketId: Number(searchParams.get('ticketId')),
      eventId: Number(searchParams.get('eventId')),
      attendeeDetails: [attendeeDetails],
    };

    try {
      const response = await fetch('/api/ticket/purchase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (result.success) {
        showAlert({ type: 'success', text: 'Ticket purchased successfully' });
      } else {
        showAlert({ type: 'error', text: 'Failed to purchase ticket' });
      }
    } catch (error) {
      showAlert({ type: 'error', text: 'There was an error processing your request' });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader type='inline' color='gray' text='Processing your purchase...' />;
  }

  return (
    <form
      className='form'
      noValidate
      onSubmit={(e) => {
        void handleSubmit(e);
      }}
    >
      <div className='ticket-details'>
        <Heading type={5} color='gray' text='Ticket Details' />
        <p>Event ID: {searchParams.get('eventId')}</p>
        <p>Ticket ID: {searchParams.get('ticketId')}</p>
        <p>Price: ${searchParams.get('price')}</p>
        <p>Available Quantity: {searchParams.get('quantity')}</p>
      </div>
      <div className='form-elements'>
        <div className='form-line'>
          <Heading type={5} color='gray' text='Attendee Details' />
          <div className='form-group'>
            <Input
              type='text'
              name='name'
              value={attendeeDetails.name}
              placeholder='Enter your name'
              required
              maxLength={50}
              onChange={handleAttendeeChange}
            />
            <Input
              type='email'
              name='email'
              value={attendeeDetails.email}
              placeholder='Enter your email'
              required
              maxLength={50}
              onChange={handleAttendeeChange}
            />
            <Input
              type='text'
              name='phone'
              value={attendeeDetails.phone}
              placeholder='Enter your phone number'
              required
              maxLength={50}
              onChange={handleAttendeeChange}
            />
          </div>
        </div>
        <div className='form-buttons'>
          <Button type='submit' color='blue-filled' text='Complete Purchase' />
        </div>
      </div>
    </form>
  );
};

export default BuyTicket;
