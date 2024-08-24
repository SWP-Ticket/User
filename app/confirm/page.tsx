'use client';
import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Button from '@components/Button/Button';
import Loader from '@components/Loader/Loader';
import useAlert from '@hooks/useAlert';
import { PaymentApi } from 'api';

const ConfirmPage = (): React.JSX.Element => {
  const searchParams = useSearchParams();
  const { showAlert } = useAlert();
  const [loading, setLoading] = useState<boolean>(false);

  const price = searchParams.get('price');
  const name = searchParams.get('name');
  const email = searchParams.get('email');
  const phone = searchParams.get('phone');
  const attendeeId = Number(searchParams.get('attendeeId'));

  const sendPaymentRequestToVNPay = async (): Promise<void> => {
    const checkoutApi = new PaymentApi();
    setLoading(true);

    const checkoutPayload = {
      attendeeId,
      amount: Number(price),
    };

    try {
      const checkoutResponse =
        await checkoutApi.apiPaymentCreatePaymentRequestPost(checkoutPayload);
      console.log(checkoutResponse);
      //@ts-ignore
      if (checkoutResponse.data.success) {
        //@ts-ignore
        const checkoutUrl = checkoutResponse.data.data.token;
        window.location.href = checkoutUrl;
      } else {
        showAlert({ type: 'error', text: 'Failed to proceed to checkout' });
      }
    } catch (error) {
      console.error(error);
      showAlert({ type: 'error', text: 'Error: Failed to proceed to checkout' });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader type='inline' color='gray' text='Processing your purchase...' />;
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: '#f9f9f9',
        padding: '20px',
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          backgroundColor: '#fff',
          padding: '30px',
          borderRadius: '8px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          maxWidth: '400px',
          width: '100%',
          textAlign: 'center',
        }}
      >
        <h3 style={{ marginBottom: '20px', color: '#333' }}>Confirm Your Details</h3>
        <p style={{ margin: '10px 0', color: '#555' }}>Price: {price} VND</p>
        <p style={{ margin: '10px 0', color: '#555' }}>Name: {name}</p>
        <p style={{ margin: '10px 0', color: '#555' }}>Email: {email}</p>
        <p style={{ margin: '10px 0', color: '#555' }}>Phone: {phone}</p>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
          <Button text='Confirm' color='blue-filled' onClick={sendPaymentRequestToVNPay} />
          <Button text='Cancel' color='gray-filled' onClick={() => window.history.back()} />
        </div>
      </div>
    </div>
  );
};

export default ConfirmPage;
