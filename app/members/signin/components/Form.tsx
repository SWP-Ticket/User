/* eslint-disable prettier/prettier */
'use client';

import React, { type FormEvent } from 'react';

import Link from 'next/link';

// hooks
import useAlert from '@hooks/useAlert';

// components
import Input from '@components/Form/Input';
import Button from '@components/Button/Button';
import Loader from '@components/Loader/Loader';

// utils

import { useRouter } from 'next/navigation';
import { AuthenApi } from 'api';

// interfaces
interface IFormProps {
  email: string;
  password: string;
}

const Form = (): React.JSX.Element => {
  const router = useRouter();
  const { showAlert, hideAlert } = useAlert();
  const [loading, setLoading] = React.useState<boolean>(false);
  const [formValues, setFormValues] = React.useState<IFormProps>({
    email: '',
    password: '',
  });

  /**
   * Handles the change event for input fields in the form.
   *
   * @param {React.ChangeEvent<HTMLInputElement>} e - The change event.
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;

    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  /**
   * Handles the form submission event.
   *
   * @param {FormEvent<HTMLFormElement>} e - The form submission event.
   * @returns {Promise<void>} A promise that resolves when the request is complete.
   */
  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    try {
      e.preventDefault();

      hideAlert();

      setLoading(true);

      const authenApi = new AuthenApi();
      const response = await authenApi.apiAuthenLoginPost({
        email: formValues.email,
        password: formValues.password,
      });
      console.log(response);
      showAlert({ type: 'success', text: 'Login successful' });
      // @ts-ignore
      sessionStorage.setItem('token', response.data.token);
      // @ts-ignore
      sessionStorage.setItem('role', response.data.role);
      // @ts-ignore
      sessionStorage.setItem('id', response.data.hintId);
      setTimeout(() => {
        router.push('/');
      }, 2000);
    } catch (error: any) {
      console.log(error.response.data.errorMessages);
      showAlert({ type: 'error', text: error.response.data.errorMessages });
    }

    setLoading(false);
  };

  if (loading) {
    return <Loader type='inline' color='gray' text='Hang on a second' />;
  }

  return (
    <form
      className='form shrink'
      noValidate
      onSubmit={(e) => {
        void handleSubmit(e);
      }}
    >
      <div className='form-elements'>
        <div className='or-line'>
          <hr />
          <span>OR</span>
        </div>
        <div className='form-line'>
          <div className='one-line'>
            <div className='label-line'>
              <label htmlFor='email'>E-mail address</label>
            </div>
            <Input
              type='email'
              name='email'
              value={formValues.email}
              maxLength={128}
              placeholder='Enter your e-mail address'
              required
              onChange={handleChange}
            />
          </div>
        </div>
        <div className='form-line'>
          <div className='label-line flex flex-v-center flex-space-between'>
            <label htmlFor='password'>Password</label>
            <Link href='/members/forgot' className='blue'>
              Forgot password?
            </Link>
          </div>
          <Input
            type='password'
            name='password'
            value={formValues.password}
            maxLength={64}
            placeholder='Enter your password'
            required
            onChange={handleChange}
          />
        </div>
        <div className='form-buttons'>
          <Button type='submit' color='blue-filled' text='Sign in' />
        </div>
      </div>
    </form>
  );
};

export default Form;
