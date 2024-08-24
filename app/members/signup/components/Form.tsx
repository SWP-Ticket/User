'use client';

import React, { useEffect, type FormEvent } from 'react';
import Link from 'next/link';

// hooks
import useAlert from '@hooks/useAlert';

// components
import Input from '@components/Form/Input';
import Switch from '@components/Form/Switch';
import Button from '@components/Button/Button';
import Loader from '@components/Loader/Loader';
import { UserApi } from 'api';

// interfaces
interface IFormProps {
  tos: boolean;
  name: string;
  email: string;
  password: string;
  role: string;
}

const Form = (): React.JSX.Element => {
  const { showAlert, hideAlert } = useAlert();
  const [loading, setLoading] = React.useState<boolean>(false);
  const [formValues, setFormValues] = React.useState<IFormProps>({
    name: '',
    email: '',
    password: '',
    role: 'Organizer',
    tos: false,
  });

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (token) {
      window.location.href = '/';
      showAlert({ type: 'error', text: 'You are already logged in' });
    }
  }, [showAlert]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const { name, value } = e.target;

    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, checked } = e.target;

    setFormValues({
      ...formValues,
      [name]: checked,
    });
  };
  const isFormValid = (): boolean => {
    return (
      formValues.name.trim() !== '' &&
      formValues.email.trim() !== '' &&
      formValues.password.trim() !== '' &&
      formValues.role.trim() !== '' &&
      formValues.tos
    );
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    if (!isFormValid()) {
      showAlert({
        type: 'error',
        text: 'Please fill in all fields and accept the terms of service.',
      });
      return;
    }

    hideAlert();
    setLoading(true);
    const signUpApi = new UserApi();
    try {
      const response = await signUpApi.apiUserPost({
        name: formValues.name,
        email: formValues.email,
        password: formValues.password,
        role: formValues.role,
      });

      console.log(response);
      //@ts-ignore
      if (response.data.success) {
        showAlert({ type: 'success', text: 'Created account successfully!' });

        setTimeout(() => {
          window.location.href = '/members/signin';
        }, 1000);
      } else {
        //@ts-ignore
        showAlert({ type: 'error', text: response.data.message || 'Failed to create account' });
      }
    } catch (error) {
      showAlert({ type: 'error', text: 'An unexpected error occurred' });
    } finally {
      setLoading(false);
    }
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
              <label htmlFor='name'>Name</label>
            </div>
            <Input
              type='text'
              name='name'
              value={formValues.name}
              maxLength={64}
              placeholder='Enter your name'
              required
              onChange={handleChange}
            />
          </div>
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
          <div className='label-line'>
            <label htmlFor='password'>Password</label>
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
        <div className='form-line'>
          <div className='label-line'>
            <label htmlFor='role'>Role</label>
          </div>
          <select
            name='role'
            value={formValues.role}
            onChange={handleChange}
            required
            className='form-select'
          >
            <option value='Organizer'>Organizer</option>
            <option value='Staff'>Staff</option>
            <option value='Sponsor'>Sponsor</option>
          </select>
        </div>
        <div className='form-line'>
          <div className='label-line'>
            <label htmlFor='tos'>Agreements</label>
          </div>
          <Switch name='tos' color='blue' onChange={handleCheckboxChange}>
            I agree to the{' '}
            <Link href='/legal/privacy-policy' className='blue'>
              Privacy policy
            </Link>{' '}
            and{' '}
            <Link href='/legal/terms-of-service' className='blue'>
              TOS
            </Link>
          </Switch>
        </div>
        <div className='form-buttons'>
          <Button
            type='submit'
            color='blue-filled'
            text='Sign up'
            disable={!isFormValid()} // Disable button if form is not valid
          />
        </div>
      </div>
    </form>
  );
};

export default Form;
