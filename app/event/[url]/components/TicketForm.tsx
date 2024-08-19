'use client';

import React, { type FormEvent } from 'react';

// hooks
import useAlert from '@hooks/useAlert';

// components
import Button from '@components/Button/Button';
import Loader from '@components/Loader/Loader';

// interfaces
interface IData {
  id: number;
  name: string;
  price: string;
  ordering: number;
  soldout?: boolean;
  quantity?: number;
  information?: string;
}

interface IProps {
  data: IData[];
}

const TicketForm = ({ data }: IProps): React.JSX.Element => {
  const { showAlert, hideAlert } = useAlert();

  const [loading, setLoading] = React.useState<boolean>(true);
  const [formValues, setFormValues] = React.useState<IData[]>(data);

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 500);

    return () => {
      clearTimeout(timeout);
    };
  }, []);

  /**
   * Orders the tickets in the array based on their ordering.
   *
   * @param {IData[]} array - The array of tickets to be ordered.
   * @return {IData[]} - The ordered array of tickets.
   */
  const orderTickets = (array: IData[]): IData[] => {
    return array.sort((a, b) => a.ordering - b.ordering);
  };

  /**
   * Handles the form submission event.
   *
   * Prevents the default form submission behavior, hides any existing alert,
   * and redirects to the '/buy' page.
   *
   * @param {FormEvent<HTMLFormElement>} e - The event object from the form submission.
   * @return {Promise<void>} - A promise that resolves when submission is handled.
   */
  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    hideAlert();
    setLoading(true);

    window.location.href = '/buy';
  };

  if (loading) {
    return <Loader type='inline' color='gray' text='Hang on a second' />;
  }

  return (
    <form noValidate onSubmit={handleSubmit}>
      <div className='ticket-box-content'>
        {/* {formValues?.map((ticket) => (
          <div key={ticket.id} className='ticket-box-line'>
            {ticket.soldout ? (
              <>
                <span className='material-symbols-outlined'>lock</span>
                <span>{ticket.name}</span>
                <strong>Sold out</strong>
                {ticket.information && (
                  <span className='material-symbols-outlined icon' title={ticket.information}>
                    info
                  </span>
                )}
              </>
            ) : (
              <>
                <span>{ticket.name}</span>
                <strong>{ticket.price}</strong>
                {ticket.information && (
                  <span className='material-symbols-outlined icon' title={ticket.information}>
                    info
                  </span>
                )}
              </>
            )}
          </div>
        ))} */}
      </div>
      <div className='ticket-box-buttons'>
        {formValues.length > 0 ? (
          <Button type='submit' color='blue-filled' text='Buy tickets' rightIcon='arrow_forward' />
        ) : (
          <Button type='submit' color='disabled' text='Tickets not found' />
        )}
      </div>
    </form>
  );
};

export default TicketForm;
