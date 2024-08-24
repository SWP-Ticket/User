'use client';
import React, { useState, type FormEvent } from 'react';
import { useSearchParams } from 'next/navigation';
import useAlert from '@hooks/useAlert';
import Input from '@components/Form/Input';
import Button from '@components/Button/Button';
import Loader from '@components/Loader/Loader';
import Heading from '@components/Heading/Heading';
import { AttendeeApi } from 'api';

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
  const [attendeeId, setAttendeeId] = useState<number | null>(null);

  const handleAttendeeChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setAttendeeDetails({
      ...attendeeDetails,
      [name]: value,
    });
  };

  const validateForm = (): boolean => {
    const { name, email, phone } = attendeeDetails;
    if (!name || !email || !phone) {
      showAlert({ type: 'error', text: 'All fields are required' });
      return false;
    }
    return true;
  };

  const registerAttendee = async (): Promise<number | null> => {
    const attendeeApi = new AttendeeApi();
    const payload = {
      registrationDate: new Date().toISOString(),
      ticketId: Number(searchParams.get('ticketId')),
      eventId: Number(searchParams.get('eventId')),
      attendeeDetails: [attendeeDetails],
    };

    try {
      const attendeeResponse = await attendeeApi.apiAttendeeRegisterPost(payload);
      console.log(attendeeResponse);
      //@ts-ignore
      if (attendeeResponse.data.success) {
        //@ts-ignore
        return attendeeResponse.data.id;
      } else {
        showAlert({ type: 'error', text: 'Failed to register attendee' });
        return null;
      }
    } catch (error) {
      console.error(error);
      showAlert({ type: 'error', text: 'Error: Failed to register attendee' });
      return null;
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    hideAlert();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    const id = await registerAttendee();
    if (id !== null) {
      setAttendeeId(id);

      window.location.href = `/confirm?attendeeId=${id}&price=${searchParams.get('price')}&name=${attendeeDetails.name}&email=${attendeeDetails.email}&phone=${attendeeDetails.phone}`;
    }
    setLoading(false);
  };

  if (loading) {
    return <Loader type='inline' color='gray' text='Processing your purchase...' />;
  }

  return (
    <form className='form' noValidate onSubmit={handleSubmit}>
      <div className='ticket-details'>
        <Heading type={5} color='gray' text='Ticket Details' />
        <table className='table'>
          <thead>
            <tr>
              <th className='left'>Price</th>
              <th className='center'>Quantity</th>
              <th className='right'>Sale End</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className='left'>{searchParams.get('price')} VND</td>
              <td className='center'>{searchParams.get('quantity')} left</td>
              <td className='right'>
                {searchParams.get('saleEnd')
                  ? new Date(searchParams.get('saleEnd')!).toLocaleDateString('en-US')
                  : 'N/A'}
              </td>
            </tr>
          </tbody>
        </table>
        <hr />
      </div>
      <div className='form-elements'>
        <div className='form-line'>
          <Heading type={5} color='gray' text='Attendee Details' />
          <div
            className='form-group'
            style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
          >
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
          <Button type='submit' color='blue-filled' text='Proceed to checkout' />
        </div>
      </div>
    </form>
  );
};

export default BuyTicket;
